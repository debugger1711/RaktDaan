const BloodRequest = require('../models/BloodRequest');
const Notification = require('../models/Notification');
const { findMatchingDonors } = require('../services/matchingService');
const { sendRequestMatchEmail, sendStatusUpdateEmail, sendDonorFoundEmail } = require('../services/emailService');

// @desc    Create blood request
// @route   POST /api/requests
const createRequest = async (req, res, next) => {
  try {
    const { patientName, bloodGroup, unitsRequired, hospital, city, contactNumber, urgency, notes } = req.body;

    const request = await BloodRequest.create({
      requester: req.user._id,
      patientName,
      bloodGroup,
      unitsRequired,
      hospital,
      city,
      contactNumber,
      urgency: urgency || 'Normal',
      notes,
    });

    // Find and notify matching donors (non-blocking)
    findMatchingDonors({ bloodGroup, city, limit: 10, excludeUserId: req.user._id })
      .then(async (matchedDonors) => {
        for (const donor of matchedDonors) {
          // Create in-app notification
          await Notification.create({
            user: donor._id,
            title: `${urgency || 'Normal'} Blood Request`,
            message: `${bloodGroup} blood needed at ${hospital}, ${city}. ${unitsRequired} unit(s) required.`,
            type: urgency === 'Critical' ? 'alert' : 'info',
            relatedRequest: request._id,
          });

          // Send email notification
          sendRequestMatchEmail(donor, request);
        }
      })
      .catch((err) => console.error('Matching notification error:', err));

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blood requests (filtered by role)
// @route   GET /api/requests
const getRequests = async (req, res, next) => {
  try {
    const { status, bloodGroup, city, urgency, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (urgency) filter.urgency = urgency;

    // Non-admin users only see active requests from other users
    if (req.user.role !== 'admin') {
      filter.status = filter.status || { $in: ['Pending', 'Accepted'] };
      filter.requester = { $ne: req.user._id };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await BloodRequest.countDocuments(filter);
    const requests = await BloodRequest.find(filter)
      .populate('requester', 'name email phone')
      .populate('acceptedDonors.donor', 'name bloodGroup phone city')
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

// @desc    Get single request
// @route   GET /api/requests/:id
const getRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('requester', 'name email phone')
      .populate('acceptedDonors.donor', 'name bloodGroup phone city');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validTransitions = {
      Pending: ['Accepted', 'Closed'],
      Accepted: ['Completed', 'Closed'],
      Completed: ['Closed'],
      Closed: [],
    };

    const request = await BloodRequest.findById(req.params.id)
      .populate('requester', 'name')
      .populate('acceptedDonors.donor', 'name');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Only requester or admin can change status
    if (request.requester._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this request' });
    }

    if (!validTransitions[request.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from '${request.status}' to '${status}'`,
      });
    }

    request.status = status;
    await request.save();

    // Notify requester
    await Notification.create({
      user: request.requester._id,
      title: 'Request Status Updated',
      message: `Your blood request for ${request.patientName} has been updated to: ${status}`,
      type: 'info',
      relatedRequest: request._id,
    });
    
    // Send email to requester
    if (request.requester.email) {
      sendStatusUpdateEmail(request.requester, request, status);
    } else {
      // If requester email is not populated, fetch it
      const User = require('../models/User');
      const requesterFull = await User.findById(request.requester._id);
      if (requesterFull && requesterFull.email) {
        sendStatusUpdateEmail(requesterFull, request, status);
      }
    }

    // If marked Completed, create DonationHistory records for all accepted donors
    if (status === 'Completed' && request.acceptedDonors && request.acceptedDonors.length > 0) {
      const DonationHistory = require('../models/DonationHistory');
      const User = require('../models/User');

      const historyRecords = request.acceptedDonors.map(match => ({
        donor: match.donor._id,
        donorName: match.donor.name,
        recipientName: request.requester.name,
        bloodRequest: request._id,
        hospital: request.hospital,
        city: request.city,
        bloodGroup: request.bloodGroup,
        units: Math.max(1, Math.floor(request.unitsRequired / request.acceptedDonors.length)),
        status: 'Completed'
      }));

      await DonationHistory.insertMany(historyRecords);

      // Increment totalDonations for these donors
      for (const match of request.acceptedDonors) {
        await User.findByIdAndUpdate(match.donor._id, {
          $inc: { totalDonations: 1 },
          lastDonationDate: new Date()
        });
      }
    }

    res.json({ success: true, message: `Request status updated to ${status}`, data: request });
  } catch (error) {
    next(error);
  }
};

// @desc    Donor accepts a request
// @route   POST /api/requests/:id/accept
const acceptRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'Pending' && request.status !== 'Accepted') {
      return res.status(400).json({ success: false, message: 'This request is no longer accepting donors' });
    }

    // Prevent accepting own request
    if (request.requester.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot accept your own blood request' });
    }

    // Check if donor already accepted
    const alreadyAccepted = request.acceptedDonors.some(
      (d) => d.donor.toString() === req.user._id.toString()
    );
    if (alreadyAccepted) {
      return res.status(400).json({ success: false, message: 'You have already accepted this request' });
    }

    request.acceptedDonors.push({ donor: req.user._id });
    if (request.status === 'Pending') {
      request.status = 'Accepted';
    }
    await request.save();

    // Notify the requester
    await Notification.create({
      user: request.requester,
      title: 'Donor Found!',
      message: `${req.user.name} (${req.user.bloodGroup}) has accepted your blood request at ${request.hospital}.`,
      type: 'success',
      relatedRequest: request._id,
    });
    
    // Send email to requester
    const User = require('../models/User');
    const requesterUser = await User.findById(request.requester);
    if (requesterUser && requesterUser.email) {
      sendDonorFoundEmail(requesterUser, request, req.user);
    }

    res.json({ success: true, message: 'Request accepted successfully', data: request });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my requests (requester)
// @route   GET /api/requests/my-requests
const getMyRequests = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find({ requester: req.user._id })
      .populate('acceptedDonors.donor', 'name bloodGroup phone city')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequest,
  updateRequestStatus,
  acceptRequest,
  getMyRequests,
};
