import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

// Protect routes - Verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
    // Attach user info from token payload directly
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role
    };
    // If you need to fetch fresh user data, uncomment below:
    // const user = await User.findById(decoded.userId).select('-password');
    // if (!user) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'User not found',
    //   });
    // }
    // req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

// Optional auth - doesn't fail if no token, (for public routes)
// for routes that can be accessed by both authenticated and unauthenticated users
// User personalizes experience if logged in.
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await User.findById(decoded.userId).select('-password');
        if (user) {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    // Continue without user
    next();
  }
};

// Check if user is the owner of a resource
// RBAC - Role Based Access Control
// Ensures only resource owners can perform certain actions
// e.g., editing/deleting their own posts or profiles
export const isOwner = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Check if the resource exists and belongs to the user
    const resourceUserId = req.params.userId || req.body.userId || req.params.id;

    if (resourceUserId && resourceUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action',
      });
    }

    next();
  };
};
