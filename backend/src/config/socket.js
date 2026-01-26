import { Server } from 'socket.io';

/**
 * Socket.IO Configuration
 * Handles all real-time WebSocket configuration and event listeners
 */

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
    socket.on('join', (userId) => {
      const roomId = userId.toString();
      socket.join(roomId);
      console.log(`👤 User ${userId} joined room: ${roomId}`);
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
      console.log(`⌨️ User ${userId} typing in chat ${chatId}`);
    });

    // Handle user online status
    socket.on('userOnline', (userId) => {
      io.emit('userStatusChange', { userId, status: 'online' });
      console.log(`🟢 User ${userId} is online`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
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
