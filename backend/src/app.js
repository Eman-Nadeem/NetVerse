import express from 'express';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import chatRoutes from './routes/chatRoute.js';
import notificationRoutes from './routes/notificationRoute.js';

const app = express();

// Middleware to parse JSON requests
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);

//Error Handling Middleware (should be the last middleware)
app.use(notFound); // 404 Not Found
app.use(errorHandler); // global error handler

export default app;