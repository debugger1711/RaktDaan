const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const DonationHistory = require('../models/DonationHistory');
const mongoose = require('mongoose');

// @desc    Get platform statistics
// @route   GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, activeRequests, completedDonations] =
      await Promise.all([
        User.countDocuments({ role: 'user', isActive: true }),
        BloodRequest.countDocuments({ status: { $in: ['Pending', 'Accepted'] } }),
        DonationHistory.countDocuments({ status: 'Completed' }),
      ]);

    res.json({
      success: true,
      data: {
        totalDonors: totalUsers, // Fallback for old frontend
        totalRecipients: totalUsers, // Fallback for old frontend
        activeRequests,
        completedDonations,
        totalUsers,
        livesSaved: completedDonations * 3,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (paginated)
// @route   GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const { role, city, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: users,
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

// @desc    Get all requests (admin view)
// @route   GET /api/admin/requests
const getAllRequests = async (req, res, next) => {
  try {
    const { status, bloodGroup, urgency, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (urgency) filter.urgency = urgency;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await BloodRequest.countDocuments(filter);
    const requests = await BloodRequest.find(filter)
      .populate('requester', 'name email phone')
      .populate('acceptedDonors.donor', 'name bloodGroup')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: requests,
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

// @desc    Monthly donation analytics
// @route   GET /api/admin/analytics/monthly
const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const monthlyData = await DonationHistory.aggregate([
      {
        $match: {
          status: 'Completed',
          donationDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$donationDate' },
          donations: { $sum: 1 },
          units: { $sum: '$units' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing months with zeros
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = months.map((name, index) => {
      const found = monthlyData.find((d) => d._id === index + 1);
      return {
        name,
        month: index + 1,
        donations: found?.donations || 0,
        units: found?.units || 0,
      };
    });

    res.json({ success: true, data: result, year });
  } catch (error) {
    next(error);
  }
};

// @desc    Blood group distribution analytics
// @route   GET /api/admin/analytics/blood-groups
const getBloodGroupAnalytics = async (req, res, next) => {
  try {
    const distribution = await User.aggregate([
      { $match: { role: 'user', isActive: true, bloodGroup: { $exists: true } } },
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const total = distribution.reduce((sum, item) => sum + item.count, 0);
    const result = distribution.map((item) => ({
      bloodGroup: item._id,
      count: item.count,
      percentage: total > 0 ? parseFloat(((item.count / total) * 100).toFixed(1)) : 0,
    }));

    res.json({ success: true, data: result, total });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/status
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot modify admin status' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      data: { isActive: user.isActive },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin user' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getUsers,
  getAllRequests,
  getMonthlyAnalytics,
  getBloodGroupAnalytics,
  toggleUserStatus,
  deleteUser,
};
