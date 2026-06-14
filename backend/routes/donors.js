const express = require('express');
const { protect } = require('../middleware/auth');
const { searchDonors, matchDonorsForRequest } = require('../controllers/donorController');

const router = express.Router();

router.use(protect);

// Search donors
router.get('/search', searchDonors);

// Match donors for a specific request
router.get('/match/:requestId', matchDonorsForRequest);

module.exports = router;
