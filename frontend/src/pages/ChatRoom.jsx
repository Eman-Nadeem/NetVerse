import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { MessageBubble } from '../components/chat/MessageBubble';
import api from '../lib/api';
import { getSocket, emitWhenReady } from '../lib/socket';
import { useAuthStore } from '../store/authStore';

const ChatRoom = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const socket = getSocket();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatDetails, setChatDetails] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll logic
  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const chatRes = await api.get(`/chats/${chatId}`);
        setChatDetails(chatRes.data.data);
        const participant = chatRes.data.data.participants.find(p => p._id !== currentUser._id);
        setOtherUser(participant);

        const msgRes = await api.get(`/chats/${chatId}/messages`);
        setMessages(msgRes.data.data);
        
        // Join user's room for receiving messages
        emitWhenReady('join', currentUser._id);
        
        await api.put(`/chats/${chatId}/read`);
        
        // Initial scroll
        setTimeout(() => scrollToBottom("auto"), 100);
      } catch (error) {
        navigate('/chats');
      }
    };
    if (chatId && currentUser) fetchChatData();
  }, [chatId, currentUser]);

  useEffect(() => {
    const handleNewMessage = (data) => {
      const receivedChatId = data.chatId?._id || data.chatId;
      if (String(receivedChatId) === String(chatId)) {
        setMessages(prev => {
          const exists = prev.find(m => m._id === data.message._id);
          return exists ? prev : [...prev, data.message];
        });
        scrollToBottom();
        setIsTyping(false);
        api.put(`/chats/${chatId}/read`).catch(() => {});
      }
    };

    const handleUserTyping = (data) => {
      if (data.userId === otherUser?._id) {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('userTyping', handleUserTyping);
    
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('userTyping', handleUserTyping);
    };
  }, [socket, chatId, otherUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage('');

    // --- OPTIMISTIC UPDATE ---
    const optimisticMsg = {
      _id: Date.now().toString(), // Temp ID
      content: content,
      sender: currentUser._id, // Ensure this matches currentUser._id string
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setTimeout(() => scrollToBottom(), 50);

    try {
      const res = await api.post(`/chats/${chatId}/messages`, { content });
      // Update the temp message with real backend data
      setMessages(prev => prev.map(m => m._id === optimisticMsg._id ? res.data.data : m));
    } catch (error) {
      setMessages(prev => prev.filter(m => m._id !== optimisticMsg._id));
      setNewMessage(content);
    }
  };

  if (!chatDetails) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 font-black text-indigo-500 animate-pulse">Loading Connection...</div>;

  return (
    <div className="h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col overflow-hidden">
      
      {/* Header: Glassmorphism */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800 p-4 flex items-center gap-4 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
        </button>
        
        <div className="relative cursor-pointer group" onClick={() => navigate(`/profile/${otherUser?._id}`)}>
          <Avatar src={otherUser?.avatar} alt={otherUser?.name} className="w-11 h-11 rounded-2xl border-2 border-indigo-500/20 group-hover:border-indigo-500 transition-all" />
          {otherUser?.isOnline && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-slate-900 dark:text-zinc-100 truncate flex items-center gap-1.5">
            {otherUser?.name}
            {otherUser?.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />}
          </h2>
          <p className={`text-xs font-bold uppercase tracking-widest ${isTyping ? 'text-indigo-500 animate-pulse' : 'text-slate-400'}`}>
            {isTyping ? 'typing...' : (otherUser?.isOnline ? 'Active Now' : 'Offline')}
          </p>
        </div>
        
        <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-3xl text-slate-400">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Messages: Modern Spacing */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [bg-size:24px_24px]">
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isOwn={(typeof msg.sender === 'object' ? msg.sender._id : msg.sender) === currentUser._id}
            sender={(typeof msg.sender === 'object' ? msg.sender._id : msg.sender) === currentUser._id ? currentUser : otherUser}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input: Floating Card Style */}
      <div className="p-4 bg-transparent">
        <form onSubmit={handleSendMessage} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-2 rounded-3xl flex gap-2 shadow-xl shadow-indigo-500/5">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              socket.emit('typing', { chatId, userId: currentUser._id });
            }}
            placeholder="Write a message..."
            className="flex-1 bg-transparent border-0 px-4 py-2 focus:ring-0 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 font-medium"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-3xl px-6 py-2 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;