const jwt = require('../utils/jwt');
const User = require('../models/User');
const { verifyGoogleToken } = require('../utils/googleAuth');

exports.register = async (req, res) => {
  const { name, email, password, userType } = req.body;

  try {
    console.log('Register Request Received:', { name, email, userType });

    const user = await User.create({ name, email, password, userType });
    console.log('User Created Successfully:', user);

    res.status(201).json({ token: jwt.generateToken(user._id) });
  } catch (error) {
    console.error('Error during User Registration:', error.message);
    res.status(400).json({ message: 'User registration failed', error: error.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login Request Received:', { email });

    const user = await User.findOne({ email });
    if (!user) {
      console.warn('User Not Found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.warn('Invalid Password Attempt:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User Authenticated:', user._id);
    res.json({ token: jwt.generateToken(user._id) });
  } catch (error) {
    console.error('Error during Login:', error.message);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};


exports.googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  try {
    console.log('Google Login Request Received:', { tokenId });

    const { email, sub: googleId } = await verifyGoogleToken(tokenId);
    console.log('Google Token Verified:', { email, googleId });

    const user = await User.findOne({ googleId });
    if (!user) {
      console.warn('Google User Not Found:', googleId);
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    const token = jwt.generateToken(user._id);
    console.log('Google Login Successful:', user._id);
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error during Google Login:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.googleSignup = async (req, res) => {
  const { tokenId, name } = req.body;

  try {
    console.log('Google Signup Request Received:', { tokenId, name });

    const { email, sub: googleId } = await verifyGoogleToken(tokenId);
    console.log('Google Token Verified:', { email, googleId });

    const existingUser = await User.findOne({ googleId });
    if (existingUser) {
      console.warn('Google User Already Exists:', googleId);
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    const user = new User({ name, email, googleId });
    await user.save();
    console.log('Google User Created:', user._id);

    const token = jwt.generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error during Google Signup:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
