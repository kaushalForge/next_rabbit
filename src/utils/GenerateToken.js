import jwt from "jsonwebtoken";

/**
 * Generate JWT token
 * @param {Object} user - User object to encode in token
 * @param {Object} options - Options like expiresIn
 * @returns {String} JWT token
 */
export const generateToken = (user, options = {}) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      authProvider: user.authProvider,
    },
    process.env.JWT_KEY,
    { expiresIn: options.expiresIn || "7d" },
  );
};
