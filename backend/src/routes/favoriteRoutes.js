const express = require('express');
const { addFavorite, getFavorites } = require('../controllers/favoriteController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addFavorite);
router.get('/', protect, getFavorites);

module.exports = router;
