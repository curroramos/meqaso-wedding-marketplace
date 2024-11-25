const User = require('../models/User');
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
 * Fetch provider profile
 */
exports.getProviderProfile = async (req, res) => {
  try {
    // Fetch provider details by ID
    const provider = await User.findById(req.params.id);
    if (!provider || provider.userType !== 'provider') {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Sanitize provider data before sending the response
    const sanitizedProvider = userDTO(provider);
    return res.status(200).json(sanitizedProvider);
  } catch (error) {
    console.error('Error fetching provider profile:', error);
    return res.status(500).json({ message: 'Failed to fetch provider profile' });
  }
};