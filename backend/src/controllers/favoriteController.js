const Favorite = require('../models/Favorite');

exports.addFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.create({
      client: req.user._id,
      service: req.body.serviceId,
    });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add favorite', error });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ client: req.user._id }).populate('service');
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch favorites', error });
  }
};
