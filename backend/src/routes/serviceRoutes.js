const express = require('express');
const { createService, getServices } = require('../controllers/serviceController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createService);
router.get('/', getServices);

module.exports = router;
