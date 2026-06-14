const User = require('../models/User');

// Blood group compatibility chart
// Key = recipient blood group, Value = compatible donor blood groups
const compatibilityChart = {
  'A+':  ['A+', 'A-', 'O+', 'O-'],
  'A-':  ['A-', 'O-'],
  'B+':  ['B+', 'B-', 'O+', 'O-'],
  'B-':  ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+':  ['O+', 'O-'],
  'O-':  ['O-'], // Universal donor gives, but can only receive O-
};

/**
 * Find matching donors for a blood request.
 *
 * Priority order:
 *   1. Exact blood group match, same city, available, eligible
 *   2. Compatible blood group, same city, available, eligible
 *   3. Exact blood group match, any city, available, eligible
 *   4. Compatible blood group, any city, available, eligible
 *
 * @param {Object} options
 * @param {string} options.bloodGroup  - Required blood group
 * @param {string} options.city        - Preferred city
 * @param {number} options.limit       - Max results (default 20)
 * @returns {Array} Sorted array of matching donors
 */
const findMatchingDonors = async ({ bloodGroup, city, limit = 20, excludeUserId }) => {
  const compatibleGroups = compatibilityChart[bloodGroup] || [bloodGroup];

  // 56 days eligibility window
  const eligibilityCutoff = new Date();
  eligibilityCutoff.setDate(eligibilityCutoff.getDate() - 56);

  const query = {
    role: 'user',
    isAvailable: true,
    isActive: true,
    bloodGroup: { $in: compatibleGroups },
    $or: [
      { lastDonationDate: { $lte: eligibilityCutoff } },
      { lastDonationDate: { $exists: false } },
      { lastDonationDate: null },
    ],
  };

  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }

  // Find all potentially matching donors
  const donors = await User.find(query)
    .select('-password')
    .limit(limit * 2) // Fetch extra for sorting
    .lean();

  // Score and sort donors
  const scoredDonors = donors.map((donor) => {
    let score = 0;

    // Exact blood group match is best
    if (donor.bloodGroup === bloodGroup) {
      score += 100;
    }

    // Same city
    if (donor.city && city && donor.city.toLowerCase() === city.toLowerCase()) {
      score += 50;
    }

    // More donations = more reliable
    score += Math.min(donor.totalDonations * 2, 20);

    return { ...donor, matchScore: score };
  });

  // Sort by score descending
  scoredDonors.sort((a, b) => b.matchScore - a.matchScore);

  return scoredDonors.slice(0, limit);
};

/**
 * Get compatible blood groups for a given type.
 * @param {string} bloodGroup
 * @returns {string[]}
 */
const getCompatibleGroups = (bloodGroup) => {
  return compatibilityChart[bloodGroup] || [bloodGroup];
};

module.exports = {
  findMatchingDonors,
  getCompatibleGroups,
  compatibilityChart,
};
