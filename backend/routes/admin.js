const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const {
  getStats,
  getUsers,
  getAllRequests,
  getMonthlyAnalytics,
  getBloodGroupAnalytics,
  toggleUserStatus,
  deleteUser,
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect);
router.use(authorize('admin'));

// Stats & Analytics
router.get('/stats', getStats);
router.get('/analytics/monthly', getMonthlyAnalytics);
router.get('/analytics/blood-groups', getBloodGroupAnalytics);

// User management
router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Request management
router.get('/requests', getAllRequests);

module.exports = router;
