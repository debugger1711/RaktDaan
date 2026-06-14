const DonationHistory = require('../models/DonationHistory');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Record a donation (manual)
// @route   POST /api/donations
const createDonation = async (req, res, next) => {
  try {
    const { bloodRequest, hospital, city, units, donationDate, notes } = req.body;

    const donor = await User.findById(req.user._id);
    if (!donor) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const donation = await DonationHistory.create({
      donor: req.user._id,
      donorName: donor.name,
      recipientName: 'Direct Donation',
      bloodRequest: bloodRequest || undefined,
      hospital,
      city,
      bloodGroup: donor.bloodGroup,
      units: units || 1,
      donationDate: donationDate || new Date(),
      notes,
    });

    // Update donor stats
    donor.totalDonations += 1;
    donor.lastDonationDate = donation.donationDate;
    await donor.save();

    res.status(201).json({
      success: true,
      message: 'Donation recorded successfully',
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donation history
// @route   GET /api/donations
const getDonations = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const filter = { donor: req.user._id };

    if (startDate || endDate) {
      filter.donationDate = {};
      if (startDate) filter.donationDate.$gte = new Date(startDate);
      if (endDate) filter.donationDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await DonationHistory.countDocuments(filter);
    const donations = await DonationHistory.find(filter)
      .populate('bloodRequest', 'patientName hospital status')
      .sort({ donationDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: donations,
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

// @desc    Get donation statistics
// @route   GET /api/donations/stats
const getDonationStats = async (req, res, next) => {
  try {
    const totalDonations = await DonationHistory.countDocuments({ donor: req.user._id, status: 'Completed' });

    const totalUnits = await DonationHistory.aggregate([
      { $match: { donor: new mongoose.Types.ObjectId(req.user._id), status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$units' } } },
    ]);

    const lastDonation = await DonationHistory.findOne({ donor: req.user._id, status: 'Completed' })
      .sort({ donationDate: -1 });

    // Check eligibility (56 days since last donation)
    let isEligible = true;
    let daysUntilEligible = 0;
    if (lastDonation) {
      const daysSince = Math.floor(
        (Date.now() - lastDonation.donationDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      isEligible = daysSince >= 56;
      daysUntilEligible = isEligible ? 0 : 56 - daysSince;
    }

    res.json({
      success: true,
      data: {
        totalDonations,
        totalUnits: totalUnits[0]?.total || 0,
        livesSaved: (totalUnits[0]?.total || 0) * 3, // 1 unit can save up to 3 lives
        lastDonationDate: lastDonation?.donationDate || null,
        isEligible,
        daysUntilEligible,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createDonation, getDonations, getDonationStats };
