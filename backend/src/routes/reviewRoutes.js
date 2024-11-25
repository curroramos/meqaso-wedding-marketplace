const express = require('express');
const { addReview, getReviews } = require('../controllers/reviewController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addReview); // Add a review
router.get('/:serviceId', getReviews); // Get reviews for a specific service

module.exports = router;
