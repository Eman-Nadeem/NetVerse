import express from 'express';
import {
  createStory,
  getStories,
  getStory,
  deleteStory,
  getUserStories,
} from '../controllers/storyController.js';
import { protect } from '../middleware/auth.js';
import { validateStory } from '../middleware/validator.js';
import { handleUploadError, uploadStoryMedia } from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Story routes
router.post('/', uploadStoryMedia, handleUploadError, validateStory, createStory);
router.get('/', getStories);
router.get('/:id', getStory);
router.delete('/:id', deleteStory);
router.get('/user/:userId', getUserStories);

export default router;