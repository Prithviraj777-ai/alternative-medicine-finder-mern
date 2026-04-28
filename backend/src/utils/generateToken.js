const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for the given user.
 * Includes user ID and role in the payload.
 * Token expires based on JWT_EXPIRE env variable (default: 7 days).
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = generateToken;
