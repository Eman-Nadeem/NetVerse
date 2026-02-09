// 

import React, { useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Send, Sparkles, MessageSquare, X, CornerDownRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../../lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';
import { clsx } from 'clsx';

// Single Comment Component
const CommentItem = ({ comment, onReply, depth = 0 }) => {
  const maxDepth = 2; // Limit nesting depth
  
  // Skip rendering if comment is invalid or just an ID
  if (!comment || typeof comment === 'string' || !comment.content) {
    return null;
  }
  
  const userName = comment.user?.name || 'Unknown';
  const userAvatar = comment.user?.avatar || '';
  
  return (
    <div className={clsx("animate-in fade-in slide-in-from-bottom-2 duration-300", depth > 0 && "ml-8 mt-3")}>
      <div className="flex gap-3 group">
        <Avatar 
          src={userAvatar} 
          alt={userName} 
          className={clsx(
            "rounded-xl ring-2 ring-white dark:ring-zinc-900 shadow-sm shrink-0",
            depth > 0 ? "w-6 h-6" : "w-8 h-8"
          )}
        />
        <div className="flex flex-col gap-1.5 max-w-[85%]">
          <div className="bg-white dark:bg-zinc-900 px-4 py-3 rounded-[1.25rem] rounded-tl-none shadow-sm border border-slate-100 dark:border-zinc-800/60 transition-colors group-hover:border-indigo-500/20">
            <div className="flex items-center gap-2 mb-1">
              <span className={clsx("font-bold text-slate-900 dark:text-zinc-100", depth > 0 ? "text-[12px]" : "text-[13px]")}>
                {userName}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Just now'}
              </span>
            </div>
            <p className={clsx("text-slate-700 dark:text-zinc-300 leading-relaxed font-medium", depth > 0 ? "text-[13px]" : "text-[14px]")}>
              {comment.content}
            </p>
          </div>
          {depth < maxDepth && (
            <button 
              onClick={() => onReply(comment)}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 hover:text-indigo-600 transition-colors w-fit flex items-center gap-1"
            >
              <CornerDownRight className="w-3 h-3" /> Reply
            </button>
          )}
        </div>
      </div>
      
      {/* Render nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3 mt-3">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply._id || reply} 
              comment={reply} 
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CommentSection = ({ postId, comments: initialComments, onUpdate }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const { user: currentUser } = useAuthStore();

  // Refetch post to get fresh comments with proper population
  const refetchComments = async () => {
    try {
      const res = await api.get(`/posts/${postId}`);
      if (res.data.data?.comments) {
        setComments(res.data.data.comments);
      }
    } catch (error) {
      console.error('Failed to refetch comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = { 
        content: newComment,
        ...(replyingTo && { parent: replyingTo._id })
      };
      
      const res = await api.post(`/posts/${postId}/comment`, payload);
      const addedComment = res.data.data;
      
      if (replyingTo) {
        // Refetch to get properly nested and populated comments
        await refetchComments();
        toast.success('Reply added!');
      } else {
        // For top-level comments, we can update state directly since user is populated
        setComments(prev => [...prev, addedComment]);
        toast.success('Your thought has been shared!');
      }
      
      setNewComment('');
      setReplyingTo(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Could not post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment('');
  };

  // Filter to show only top-level comments (no parent)
  const topLevelComments = comments.filter(c => !c.parent);

  return (
    <div className="bg-slate-50/50 dark:bg-zinc-950/40 p-5 space-y-6">
      {/* Scrollable Comments List */} 
      <div className="space-y-5 max-h-100 overflow-y-auto scrollbar-hide pr-1">
        {topLevelComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-slate-100 dark:border-zinc-800">
              <MessageSquare className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">No thoughts yet</p>
          </div>
        ) : (
          [...topLevelComments].reverse().map((comment) => (
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              onReply={handleReply}
            />
          ))
        )}
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-200 dark:border-indigo-500/20">
          <CornerDownRight className="w-4 h-4 text-indigo-500" />
          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium flex-1">
            Replying to <span className="font-bold">{replyingTo.user?.name}</span>
          </span>
          <button onClick={cancelReply} className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors">
            <X className="w-4 h-4 text-indigo-500" />
          </button>
        </div>
      )}

      {/* Modern Floating Input Area */}
      <form onSubmit={handleAddComment} className="relative pt-2 border-t border-slate-200/60 dark:border-zinc-800/60 flex items-center gap-3">
        <Avatar 
          src={currentUser?.avatar} 
          alt={currentUser?.name} 
          className="w-9 h-9 rounded-xl ring-2 ring-indigo-500/10 hidden sm:block"
        />
        <div className="flex-1 relative group">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyingTo ? `Reply to ${replyingTo.user?.name}...` : "Share your thought..."}
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl py-3 pl-5 pr-12 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 focus:outline-none text-slate-900 dark:text-zinc-100 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600 shadow-sm"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className={clsx(
              "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-300",
              newComment.trim() 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-100" 
                : "text-slate-300 dark:text-zinc-700 scale-90"
            )}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};