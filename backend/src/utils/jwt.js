const jwt = require('jsonwebtoken');

/**
 * Generate a JSON Web Token (JWT)
 * @param {string} userId - The user ID for the token payload
 * @returns {string} - The signed JWT
 */
exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d',
  });
};
