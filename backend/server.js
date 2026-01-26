import { createServer } from 'http';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import app from './src/app.js';
import { createSocket } from './src/config/socket.js';

// Load environment variables
dotenv.config();

// Server configuration
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';


const startServer = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected successfully');

    // Create HTTP server from Express app
    const httpServer = createServer(app);

    // Initialize Socket.IO with HTTP server
    const io = createSocket(httpServer);

    // Make io globally accessible for controllers
    global.io = io;
    console.log('✅ Socket.IO initialized and accessible globally');

    // Start listening
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = (signal) => {
      console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

      // Close database connection
      mongoose.connection.close(() => {
        console.log('✅ MongoDB connection closed');
      });

      // Close HTTP server
      httpServer.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('❌ Forcing shutdown...');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default startServer;