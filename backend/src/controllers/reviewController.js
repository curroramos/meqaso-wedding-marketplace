const Review = require('../models/Review');
const Service = require('../models/Service');

// Add a review for a service
exports.addReview = async (req, res) => {
  const { serviceId, rating, reviewText } = req.body;

  try {
    // Ensure the user is a client
    if (req.user.userType !== 'client') {
      return res.status(403).json({ message: 'Only clients can add reviews' });
    }

    // Validate the rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if the client has already reviewed this service
    const existingReview = await Review.findOne({ service: serviceId, client: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this service' });
    }

    // Check if the service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Create the review
    const review = await Review.create({
      client: req.user._id,
      service: serviceId,
      rating,
      reviewText,
    });

    // Update the service's average rating and review count
    const reviews = await Review.find({ service: serviceId });
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    service.rating = averageRating;
    service.reviewCount = reviews.length;
    await service.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review', error });
  }
};


// Get reviews for a specific service
exports.getReviews = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const reviews = await Review.find({ service: serviceId }).populate('client', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error });
  }
};
