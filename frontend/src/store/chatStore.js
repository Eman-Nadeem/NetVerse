// store/chatStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

export const useChatStore = create(
  persist(
    (set, get) => ({
      unreadChatsCount: 0,
      activeChatId: null, // Track currently active chat to avoid incrementing when already viewing
      
      // Fetch total unread chats count
      fetchUnreadCount: async () => {
        try {
          const res = await api.get('/chats');
          const chats = res.data.data;
          const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
          
          // Count chats with unread messages
          let count = 0;
          chats.forEach(chat => {
            const unread = chat.unreadCount?.[userId] || 0;
            if (unread > 0) count++;
          });
          
          set({ unreadChatsCount: count });
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
        }
      },

      // Set active chat (when entering a chat room)
      setActiveChatId: (chatId) => {
        set({ activeChatId: chatId });
      },

      // Clear active chat (when leaving a chat room)
      clearActiveChatId: () => {
        set({ activeChatId: null });
      },

      // Increment unread count when new message arrives (only if not in that chat)
      incrementUnread: (chatId) => {
        const { activeChatId } = get();
        // Don't increment if user is already viewing this chat
        if (activeChatId && String(activeChatId) === String(chatId)) {
          return;
        }
        set((state) => ({ unreadChatsCount: state.unreadChatsCount + 1 }));
      },

      // Decrement when entering a chat
      decrementUnread: () => {
        set((state) => ({ unreadChatsCount: Math.max(0, state.unreadChatsCount - 1) }));
      },

      // Reset count (on logout)
      resetUnread: () => {
        set({ unreadChatsCount: 0, activeChatId: null });
      },

      // Set count directly
      setUnreadCount: (count) => {
        set({ unreadChatsCount: count });
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ unreadChatsCount: state.unreadChatsCount }),
    }
  )
);
