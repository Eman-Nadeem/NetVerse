import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar } from '../ui/Avatar';

export const MessageBubble = ({ message, isOwn, sender }) => {
  // Fix: handle both object and string ID from backend
  const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
  
  return (
    <div className={`flex gap-3 mb-6 ${isOwn ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Avatar with Squircle Style */}
      {!isOwn && (
        <Avatar 
          src={sender?.avatar} 
          alt={sender?.name} 
          className="w-9 h-9 rounded-2xl self-end border-2 border-white dark:border-zinc-800 shadow-sm"
        />
      )}

      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[80%] sm:max-w-[70%]`}>
        {/* Message Card */}
        <div
          className={`relative px-4 py-3 rounded-3xl text-sm transition-all duration-300 shadow-sm ${
            isOwn
              ? 'bg-linear-to-tr from-indigo-600 to-indigo-500 text-white rounded-br-none shadow-indigo-500/20 hover:shadow-indigo-500/40'
              : 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 rounded-bl-none border border-slate-100 dark:border-zinc-800 hover:border-indigo-500/30'
          }`}
        >
          <p className="leading-relaxed whitespace-pre-wrap wrap-break-words">
            {message.content}
          </p>
          
          {/* Subtle Glow Effect for Own Messages */}
          {isOwn && (
            <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          )}
        </div>

        {/* Status & Time */}
        <div className={`flex items-center gap-1.5 mt-1.5 px-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500`}>
          <span>{format(new Date(message.createdAt), 'hh:mm a')}</span>
          {isOwn && (
            <div className="flex items-center">
              {message.isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-indigo-500" />
              ) : (
                <Check className="w-3.5 h-3.5 opacity-50" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};