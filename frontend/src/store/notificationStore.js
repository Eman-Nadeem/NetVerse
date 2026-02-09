// store/notificationStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      loading: false,

      // Fetch notifications from API (always fetches fresh data)
      fetchNotifications: async () => {
        // If we have cached notifications, don't show loading spinner
        const hasCached = get().notifications.length > 0;
        if (!hasCached) {
          set({ loading: true });
        }
        
        try {
          const res = await api.get('/notifications');
          set({ 
            notifications: res.data.data, 
            unreadCount: res.data.unreadCount || 0,
            loading: false,
          });
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
          set({ loading: false });
        }
      },

      // Force refresh notifications
      refreshNotifications: async () => {
        set({ loading: true });
        try {
          const res = await api.get('/notifications');
          set({ 
            notifications: res.data.data, 
            unreadCount: res.data.unreadCount || 0,
            loading: false,
          });
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
          set({ loading: false });
        }
      },

      // Add a new real-time notification
      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      // Mark all as read
      markAllAsRead: async () => {
        try {
          await api.put('/notifications/read-all');
          set((state) => ({
            notifications: state.notifications.map(n => ({ ...n, isRead: true })),
            unreadCount: 0,
          }));
          return true;
        } catch (error) {
          console.error('Failed to mark all as read:', error);
          return false;
        }
      },

      // Mark single notification as read
      markAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map(n => 
            n._id === notificationId ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      // Remove a notification from the list
      removeNotification: (notificationId) => {
        set((state) => {
          const notif = state.notifications.find(n => n._id === notificationId);
          const wasUnread = notif && !notif.isRead;
          return {
            notifications: state.notifications.filter(n => n._id !== notificationId),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          };
        });
      },

      // Clear all notifications (on logout)
      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },
    }),
    {
      name: 'notifications-storage', // localStorage key
      partialize: (state) => ({ 
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }), // Only persist these fields, not loading state
    }
  )
);