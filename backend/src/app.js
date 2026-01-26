import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config(); //load .env variables

const app = express();

// Middleware to parse JSON requests
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/auth', authRoutes);

//Error Handling Middleware (should be the last middleware)
app.use(notFound); // 404 Not Found
app.use(errorHandler); // global error handler

export default app;