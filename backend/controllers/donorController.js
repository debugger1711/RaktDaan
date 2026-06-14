const User = require('../models/User');
const { findMatchingDonors, getCompatibleGroups } = require('../services/matchingService');

// @desc    Search donors
// @route   GET /api/donors/search
const searchDonors = async (req, res, next) => {
  try {
    const { bloodGroup, city, available, page = 1, limit = 10 } = req.query;

    const filter = { role: 'user', isActive: true, _id: { $ne: req.user._id } };

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (available === 'true') filter.isAvailable = true;
    if (available === 'false') filter.isAvailable = false;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const donors = await User.find(filter)
      .select('name bloodGroup city isAvailable lastDonationDate totalDonations phone email')
      .sort({ totalDonations: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: donors,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Match donors for a specific request
// @route   GET /api/donors/match/:requestId
const matchDonorsForRequest = async (req, res, next) => {
  try {
    const BloodRequest = require('../models/BloodRequest');
    const request = await BloodRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const matchedDonors = await findMatchingDonors({
      bloodGroup: request.bloodGroup,
      city: request.city,
      limit: 20,
      excludeUserId: request.requester,
    });

    res.json({
      success: true,
      data: matchedDonors,
      compatibleGroups: getCompatibleGroups(request.bloodGroup),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchDonors, matchDonorsForRequest };
