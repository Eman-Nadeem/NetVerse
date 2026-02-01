import express from 'express';
import {
  createChat,
  getChats,
  getChat,
  sendMessage,
  getMessages,
  deleteMessage,
  markAsRead,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';
import { validateMessage } from '../middleware/validator.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Chat routes
router.post('/', createChat);
router.get('/', getChats);
router.get('/:id', getChat);
router.post('/:id/messages', validateMessage, sendMessage);
router.get('/:id/messages', getMessages);
router.put('/:id/read', markAsRead);
router.delete('/:chatId/messages/:messageId', deleteMessage);

export default router;
