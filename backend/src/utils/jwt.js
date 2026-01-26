import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

// Generate JWT Token
const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in environment variables!');
  }
  return process.env.JWT_SECRET;
};

export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

// Verify JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    return null;
  }
};

// Generate Reset Password Token
export const generateResetToken = () => {
  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to resetPasswordToken field
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  return {
    resetToken,
    hashedToken,
  };
};
