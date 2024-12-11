const express = require('express');
const { updateProviderProfile, getMyProfile, getOtherUserProfile, getUserServices } = require('../controllers/providerController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Update provider profile (protected)
router.put('/profile', protect, updateProviderProfile);

// Fetch own profile
router.get('/profile', protect, getMyProfile);

// Fetch another user's profile
router.get('/profile/:id', protect, getOtherUserProfile);

// Fetch all services for a specific user
router.get('/profile/:id/services', protect, getUserServices);

module.exports = router;
