const express = require('express');
const { createService, getServices, getCategories, getServiceById } = require('../controllers/serviceController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createService);
router.get('/', getServices);
router.get('/categories', getCategories)
router.get('/:id', getServiceById)

module.exports = router;
