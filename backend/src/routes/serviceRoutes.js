const express = require('express');
const { createService, getServices, getCategories } = require('../controllers/serviceController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createService);
router.get('/', getServices);
router.get('/categories', getCategories)

module.exports = router;
