// 

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Sparkles, Verified, Trash2, Edit3, X } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import api from '../../lib/api';
import { toast } from 'sonner';
import { CommentSection } from './CommentSection';

export const PostCard = ({ post, onUpdate, currentUserId, showComments, onToggleComments, onDelete }) => {
  const [liked, setLiked] = useState(post.likes?.includes(currentUserId));
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  const isOwner = currentUserId === post.author?._id;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLike = async () => {
    setIsLiking(true);
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      await api.post(`/posts/${post._id}/like`);
      if (newLikedState) toast.success('Added to liked posts');
    } catch (error) {
      setLiked(!newLikedState);
      setLikesCount(prev => newLikedState ? prev - 1 : prev + 1);
      toast.error('Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
    toast.success('Link copied to clipboard', { icon: <Share2 className="w-4 h-4" /> });
  };

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }
    setIsUpdating(true);
    try {
      const res = await api.put(`/posts/${post._id}`, { content: editContent });
      if (onUpdate) onUpdate(res.data.data);
      setShowEditModal(false);
      toast.success('Post updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/posts/${post._id}`);
      if (onDelete) onDelete(post._id);
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <article className="group bg-white dark:bg-zinc-900/50 dark:backdrop-blur-xl rounded-4xl border border-slate-200/60 dark:border-zinc-800/60 mb-6 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(79,70,229,0.05)] dark:hover:border-zinc-700">
      
      {/* Header: User Info */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author?._id}`} className="relative">
            <Avatar 
              src={post.author?.avatar} 
              alt={post.author?.name} 
              className="w-11 h-11 rounded-2xl ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all"
            />
            {post.author?.isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
            )}
          </Link>
          <div>
            <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-1 group/author">
              <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-[15px] leading-none group-hover/author:text-indigo-600 transition-colors">
                {post.author?.name}
              </h3>
              {post.author?.isVerified && <Verified className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/10" />}
            </Link>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 mt-1">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        {isOwner && (
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-700 py-1 z-50">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setEditContent(post.content);
                    setShowEditModal(true);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Body: Content */}
      <div className="px-5 pb-4">
        <p className="text-slate-700 dark:text-zinc-300 whitespace-pre-line mb-4 text-[15px] leading-relaxed font-medium">
          {post.content}
        </p>
        
        {post.images && post.images.length > 0 && (
          <div className="relative rounded-3xl overflow-hidden border border-slate-100 dark:border-zinc-800 group/image">
            <img 
              src={post.images[0].url} 
              alt="Post media" 
              className="w-full h-auto object-cover max-h-96 transition-transform duration-700 group-hover/image:scale-[1.03]" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      {/* Footer: Modern Action Bar */}
      <div className="px-3 py-3 mx-2 mb-2 bg-slate-50/50 dark:bg-zinc-900/80 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Like Button */}
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all active:scale-90",
              liked 
                ? "bg-red-50 dark:bg-red-500/10 text-red-500" 
                : "text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
            )}
          >
            <Heart className={clsx("w-5 h-5 transition-all", liked && "fill-current scale-110")} />
            <span className="text-sm font-bold">{likesCount}</span>
          </button>

          {/* Comment Button */}
          <button 
            onClick={onToggleComments}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
              showComments 
                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600" 
                : "text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
            )}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-bold">{post.comments?.length || 0}</span>
          </button>

          {/* Share Button */}
          <button 
            onClick={handleShare}
            className="p-2.5 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Save Button */}
        <button 
          onClick={() => {
            setSaved(!saved);
            toast(saved ? 'Removed from saved' : 'Saved to collection', {
              icon: <Bookmark className="w-4 h-4 fill-current" />
            });
          }}
          className={clsx(
            "p-2.5 rounded-xl transition-all",
            saved 
              ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10" 
              : "text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          )}
        >
          <Bookmark className={clsx("w-5 h-5", saved && "fill-current")} />
        </button>
      </div>

      {/* Comment Section with Smooth Transition */}
      {showComments && (
        <div className="animate-in slide-in-from-top-2 duration-300 border-t border-slate-100 dark:border-zinc-800">
          <CommentSection 
            postId={post._id} 
            comments={post.comments} 
            onUpdate={onUpdate} 
          />
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9999 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Post</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-32 p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-0 resize-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder-slate-400"
                placeholder="What's on your mind?"
              />
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={isUpdating}
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9999 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Post?</h3>
              <p className="text-slate-500 dark:text-zinc-400 mb-6">This action cannot be undone. This post will be permanently deleted.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </article>
  );
};

export default PostCard;