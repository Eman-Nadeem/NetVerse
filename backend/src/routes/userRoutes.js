import express from 'express';
import {
  getUserProfile,
  updateProfile,
  toggleFollow,
  searchUsers,
  getFollowers,
  getFollowing,
  getUserPosts,
  toggleSavePost,
  getSavedPosts,
} from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validateUpdateProfile } from '../middleware/validator.js';
import { handleUploadError, uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/profile/:id', optionalAuth, getUserProfile);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);
router.get('/:id/posts', getUserPosts);
router.get('/search', searchUsers);

// Protected routes
router.put('/profile', protect, validateUpdateProfile, updateProfile);
router.post('/profile/avatar', protect, uploadSingle, handleUploadError, updateProfile);
router.post('/follow/:id', protect, toggleFollow);
router.post('/saved-posts/:postId', protect, toggleSavePost);
router.get('/saved-posts', protect, getSavedPosts);

export default router;