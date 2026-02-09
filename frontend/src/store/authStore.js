// store/authStore.js
import { create } from 'zustand';
import api from '../lib/api';
import { useNotificationStore } from './notificationStore';
import { useChatStore } from './chatStore';
import { disconnectSocket } from '../lib/socket';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: true, // Start with loading true until we check auth

  // Login Action: Set token and user
  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // Optional backup
    set({ token, user, isAuthenticated: true, isLoading: false });
  },

  // Logout Action: Clear everything
  logout: () => {
    // Disconnect socket first to trigger offline status update
    disconnectSocket();
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear notifications and chat store on logout
    useNotificationStore.getState().clearNotifications();
    useChatStore.getState().resetUnread();
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    // Optional: redirect to login via window.location.href = '/login'
  },

  // Check Auth Action: Verify token validity on app load
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user', JSON.stringify(res.data.data));
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Update User Action (for profile edits later)
  updateUser: (userData) => {
    set((state) => {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
}));