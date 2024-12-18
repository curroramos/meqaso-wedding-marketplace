const User = require('../models/User');
const Service = require('../models/Service')
const { userDTO } = require('../utils/dto');

/**
 * Update provider details
 */
exports.updateProviderProfile = async (req, res) => {
  try {
    // Ensure the user is authenticated and is a provider
    if (!req.user || req.user.userType !== 'provider') {
      return res.status(403).json({ message: 'Only providers can update their profile' });
    }

    // Extract and validate the update data
    const { bio, categories, website, socialLinks, location, hourlyRate, gallery } = req.body;
    const updatedData = { bio, categories, website, socialLinks, location, hourlyRate, gallery };

    // Update provider profile
    const user = await User.findByIdAndUpdate(req.user._id, updatedData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Sanitize user data before sending the response
    const sanitizedUser = userDTO(user);
    return res.status(200).json({ message: 'Profile updated successfully', user: sanitizedUser });
  } catch (error) {
    console.error('Error updating provider profile:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

/**
 * Fetch another user's profile by ID
 */
exports.getOtherUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure only public data is returned
    const publicData = userDTO(user);

    return res.status(200).json({ message: 'User profile fetched successfully', user: publicData });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

/**
 * Fetch the authenticated user's own profile
 */
exports.getMyProfile = async (req, res) => {
  try {
    const user = req.user; // Populated by `protect` middleware

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Sanitize user data before sending the response
    const sanitizedUser = userDTO(user);
    
    return res.status(200).json({ message: 'User profile fetched successfully', user: sanitizedUser });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

// Controller to fetch all services of a specific user
exports.getUserServices = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
    }

    console.log(req.params)
    const userId = req.params.id;

    console.log(userId)

    // Fetch services for the user
    const services = await Service.find({ provider: userId }).populate('provider');

    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching user services:', error);
    res.status(500).json({
      message: 'Failed to fetch user services',
      error: error.message,
    });
  }
};
