import express from 'express';
import {
  createPost,
  getFeed,
  getPost,
  toggleLike,
  addComment,
  deletePost,
  getComments,
  sharePost,
  getExplorePosts,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { validatePost, validateComment } from '../middleware/validator.js';
import { handleUploadError, uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Post routes
router.post('/', uploadMultiple, handleUploadError, validatePost, createPost);
router.get('/', getFeed);
router.get('/explore', getExplorePosts); // Trending/explore posts - must be before /:id
router.get('/:id', getPost);
router.delete('/:id', deletePost);
router.post('/:id/like', toggleLike);
router.post('/:id/comment', validateComment, addComment);
router.get('/:id/comments', getComments);
router.post('/:id/share', sharePost);

export default router;