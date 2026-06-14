const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  toggleAvailability,
  changePassword,
} = require('../controllers/userController');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/availability', toggleAvailability);
router.put('/change-password', changePassword);

module.exports = router;
