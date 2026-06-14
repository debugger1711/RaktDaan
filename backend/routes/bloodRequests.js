const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const {
  createRequest,
  getRequests,
  getRequest,
  updateRequestStatus,
  acceptRequest,
  getMyRequests,
} = require('../controllers/bloodRequestController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get my requests (must come before /:id)
router.get('/my-requests', getMyRequests);

// Create request
router.post(
  '/',
  [
    body('patientName').trim().notEmpty().withMessage('Patient name is required'),
    body('bloodGroup')
      .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .withMessage('Valid blood group is required'),
    body('unitsRequired')
      .isInt({ min: 1, max: 10 })
      .withMessage('Units required must be between 1 and 10'),
    body('hospital').trim().notEmpty().withMessage('Hospital name is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('contactNumber').trim().notEmpty().withMessage('Contact number is required'),
    body('urgency')
      .optional()
      .isIn(['Normal', 'High', 'Critical'])
      .withMessage('Urgency must be Normal, High, or Critical'),
  ],
  validate,
  createRequest
);

// Get all requests
router.get('/', getRequests);

// Get single request
router.get('/:id', getRequest);

// Update request status
router.put(
  '/:id/status',
  [
    body('status')
      .isIn(['Pending', 'Accepted', 'Completed', 'Closed'])
      .withMessage('Invalid status'),
  ],
  validate,
  updateRequestStatus
);

// Donor accepts a request
router.post('/:id/accept', acceptRequest);

module.exports = router;
