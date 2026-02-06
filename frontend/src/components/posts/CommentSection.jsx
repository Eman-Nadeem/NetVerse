import React, { useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../../lib/api';
import { toast } from 'sonner';

export const CommentSection = ({ postId, comments: initialComments, onUpdate }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post(`/posts/${postId}/comment`, { content: newComment });
      const addedComment = res.data.data;
      
      setComments([...comments, addedComment]);
      setNewComment('');
      toast.success('Comment added');
      
      // Notify parent to update comment count on card
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 space-y-4">
      {/* Existing Comments List */}
      <div className="space-y-4 max-h-60 overflow-y-auto scrollbar-hide">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-zinc-400 text-center py-2">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <Avatar 
                src={comment.user?.avatar} 
                alt={comment.user?.name} 
                size="sm"
                className="mt-1"
              />
              <div className="flex-1">
                <div className="bg-white dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-zinc-700">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-slate-900 dark:text-zinc-100">
                      {comment.user?.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-zinc-200 whitespace-pre-line">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="flex gap-2 items-center mt-2">
        <Avatar 
          src="https://i.pravatar.cc/150?img=32" 
          alt="Me" 
          size="sm"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};