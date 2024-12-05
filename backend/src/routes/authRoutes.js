const express = require('express');
const { register, login, googleSignup, googleLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/googleSignup', googleSignup)
router.post('/googleLogin', googleLogin)

module.exports = router;
