// lib/socket.js
import { io } from 'socket.io-client';

// Socket connects to the server root, not the API path
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Remove /api suffix for socket connection
const SOCKET_URL = API_URL.replace('/api', '');

export const initializeSocket = () => {
  const token = localStorage.getItem('token');
  
  const socket = io(SOCKET_URL, {
    auth: {
      token: token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
    // Re-join room on reconnection
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user._id) {
      socket.emit('join', user._id);
      console.log('📢 Joined notification room:', user._id);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  return socket;
};

// Singleton instance
let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = initializeSocket();
  }
  return socketInstance;
};

// Join room for the current user - call this after login or when user data changes
export const joinUserRoom = (userId) => {
  const socket = getSocket();
  if (socket.connected && userId) {
    socket.emit('join', userId);
    console.log('📢 Joined notification room:', userId);
  } else if (userId) {
    socket.once('connect', () => {
      socket.emit('join', userId);
      console.log('📢 Joined notification room (after connect):', userId);
    });
  }
};

// Disconnect socket on logout - this will trigger offline status update
export const disconnectSocket = () => {
  if (socketInstance) {
    console.log('🔴 Disconnecting socket on logout');
    socketInstance.disconnect();
    socketInstance = null;
  }
};

// Helper to ensure socket is connected before emitting
export const emitWhenReady = (event, data) => {
  const socket = getSocket();
  if (socket.connected) {
    socket.emit(event, data);
  } else {
    socket.once('connect', () => {
      socket.emit(event, data);
    });
  }
};