const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const {
  createDonation,
  getDonations,
  getDonationStats,
} = require('../controllers/donationController');

const router = express.Router();

router.use(protect);

// Get donation stats (must come before other routes)
router.get('/stats', getDonationStats);

// Get donation history
router.get('/', getDonations);

// Record a donation
router.post(
  '/',
  [
    body('hospital').trim().notEmpty().withMessage('Hospital name is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('units').optional().isInt({ min: 1 }).withMessage('Units must be at least 1'),
  ],
  validate,
  createDonation
);

module.exports = router;
