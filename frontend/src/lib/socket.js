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
    // Re-join room on reconnection
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user._id) {
      socket.emit('join', user._id);
    }
  });

  socket.on('disconnect', () => {});

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