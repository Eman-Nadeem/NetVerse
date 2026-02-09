import { Server } from 'socket.io';
import User from '../models/User.js';

/**
 * Socket.IO Configuration
 * Handles all real-time WebSocket configuration and event listeners
 */

// Map to track userId -> socketId connections
const userSocketMap = new Map();

export const createSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
    allowUpgrades: true,
  });

  // Connection handling
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // User joins their personal room for notifications
    socket.on('join', async (userId) => {
      const roomId = userId.toString();
      socket.join(roomId);
      
      // Store socket mapping
      socket.userId = userId;
      userSocketMap.set(userId, socket.id);
      
      // Update user online status in database
      try {
        await User.findByIdAndUpdate(userId, { 
          isOnline: true,
          lastSeen: new Date()
        });
        
        // Broadcast to all users that this user is now online
        io.emit('userStatusChange', { userId, status: 'online' });
        console.log(`🟢 User ${userId} is now online`);
      } catch (error) {
        console.error('Failed to update online status:', error);
      }
      
      console.log(`📢 User ${socket.id} joined room: ${roomId}`);
    });

    // Handle real-time messaging
    socket.on('sendMessage', (data) => {
      const { chatId, message, senderId } = data;
      // Broadcast to all participants in chat room
      io.to(chatId).emit('receiveMessage', message);
      console.log(`💬 Message sent in chat ${chatId} by user ${senderId}`);
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { chatId, userId } = data;
      // Broadcast to other participants (not sender)
      socket.to(chatId).emit('userTyping', { userId });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      const userId = socket.userId;
      
      if (userId) {
        userSocketMap.delete(userId);
        
        // Update user offline status in database
        try {
          await User.findByIdAndUpdate(userId, { 
            isOnline: false,
            lastSeen: new Date()
          });
          
          // Broadcast to all users that this user is now offline
          io.emit('userStatusChange', { userId, status: 'offline', lastSeen: new Date() });
          console.log(`🔴 User ${userId} is now offline`);
        } catch (error) {
          console.error('Failed to update offline status:', error);
        }
      }
      
      console.log(`🔴 User disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`❌ Socket error: ${error}`);
    });
  });

  return io;
};

export default createSocket;
