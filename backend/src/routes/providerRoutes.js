const express = require('express');
const { updateProviderProfile, getProviderProfile } = require('../controllers/providerController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Update provider profile (protected)
router.put('/profile', protect, updateProviderProfile);

// Fetch provider profile (public)
router.get('/:id', getProviderProfile);

module.exports = router;
