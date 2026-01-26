import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

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

//Error Handling Middleware (should be the last middleware)


export default app;