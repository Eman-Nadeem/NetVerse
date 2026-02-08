// pages/Chats.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '../components/ui/Avatar';
import { getSocket, emitWhenReady } from '../lib/socket';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { user: currentUser } = useAuthStore();
  const socket = getSocket();

  useEffect(() => {
    fetchChats();
    // Ensure user is in their socket room
    if (currentUser?._id) {
      emitWhenReady('join', currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    // Listen for new messages to update the list
    const handleNewMessage = (data) => {
      const receivedChatId = String(data.chatId?._id || data.chatId);
      
      setChats((prevChats) => {
        const chatIndex = prevChats.findIndex(c => String(c._id) === receivedChatId);
        
        if (chatIndex !== -1) {
          // Move to top and update last message + increment unread
          const oldChat = prevChats[chatIndex];
          const currentUnread = oldChat.unreadCount?.[currentUser._id] || 0;
          const updatedChat = { 
            ...oldChat, 
            lastMessage: data.message, 
            updatedAt: new Date(),
            unreadCount: {
              ...oldChat.unreadCount,
              [currentUser._id]: currentUnread + 1
            }
          };
          const newChats = [...prevChats];
          newChats.splice(chatIndex, 1);
          newChats.unshift(updatedChat);
          return newChats;
        } else {
          // It's a brand new chat, refresh list (simplified)
          fetchChats();
          return prevChats;
        }
      });
    };

    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket, currentUser]);

  const fetchChats = async () => {
    try {
      const res = await api.get('/chats');
      setChats(res.data.data);
    } catch (error) {
      console.error('Error fetching chats', error);
    }
  };

  const getChatUser = (chat) => {
    return chat.participants.find(p => p._id !== currentUser._id);
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 px-4 h-full">
      <div className="sticky top-0 bg-slate-50/80 dark:bg-zinc-950/80 backdrop-blur-xl z-10 py-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">Messages</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Connect with your community</p>
      </div>

      <div className="space-y-3">
        {chats.map((chat) => {
          const otherUser = getChatUser(chat);
          const lastMsg = chat.lastMessage;
          const unreadCount = chat.unreadCount?.[currentUser._id] || 0;

          return (
            <Link
              key={chat._id}
              to={`/chats/${chat._id}`}
              className="group flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-4xl border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300"
            >
              <div className="relative">
                <Avatar src={otherUser?.avatar} alt={otherUser?.name} className="w-14 h-14 rounded-2xl group-hover:scale-105 transition-transform" />
                {otherUser?.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white dark:border-zinc-900 rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-black text-slate-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 transition-colors">
                    {otherUser?.name}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {lastMsg ? formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: false }) : ''}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate pr-4 ${unreadCount > 0 ? 'text-slate-900 dark:text-zinc-200 font-bold' : 'text-slate-500'}`}>
                    {lastMsg ? lastMsg.content : 'Start a new story...'}
                  </p>
                  {unreadCount > 0 && (
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded-lg animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Chats;