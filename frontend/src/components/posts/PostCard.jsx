import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Copy, ChevronDown, icons } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import api from '../../lib/api';
import { toast } from 'sonner';
import { CommentSection } from './CommentSection'; // Import new component

export const PostCard = ({ post, onUpdate, currentUserId, showComments, onToggleComments }) => {
  // Correct like logic: check if current user has liked
  const [liked, setLiked] = useState(post.likes?.includes(currentUserId));
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    setIsLiking(true);
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      await api.post(`/posts/${post._id}/like`);
      if (newLikedState) toast.success('Post liked');
      else toast.error('Post unliked', icons.Cross);
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
    toast.success('Link copied to clipboard!');
  };

  return (
    <article className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 mb-6 overflow-hidden transition-all hover:shadow-md dark:hover:border-zinc-700">
      {/* Header: User Info & Time */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={post.author?.avatar} alt={post.author?.name || 'User'} />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-zinc-100 text-sm leading-tight">
              {post.author?.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Button variant="ghost" className="p-2 h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300" aria-label="More options">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Body: Content & Images */}
      <div className="px-4 pb-3">
        <p className="text-slate-800 dark:text-zinc-200 whitespace-pre-line mb-3 text-[15px]">
          {post.content}
        </p>
        {post.images && post.images.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-zinc-800 bg-black/5 dark:bg-white/5">
            <img src={post.images[0].url} alt="Post content" className="w-full h-auto object-cover max-h-150" loading="lazy" />
          </div>
        )}
      </div>

      {/* Footer: Stats & Actions */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            onClick={handleLike}
            disabled={isLiking}
            aria-label={liked ? "Unlike post" : "Like post"}
            className={clsx(
              "flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 px-3 py-2",
              liked && "text-red-500 dark:text-red-500 hover:text-red-600"
            )}
          >
            <Heart className={clsx("w-5 h-5 transition-transform", liked && "fill-current scale-110")}/>
            <span className="text-sm font-medium">{likesCount}</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={onToggleComments}
            className={clsx(
              "text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2",
              showComments && "text-indigo-600 dark:text-indigo-400"
            )}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium ml-2">{post.comments?.length || 0}</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleShare}
            className="text-slate-500 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 px-3 py-2"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => {
            setSaved(!saved);
            toast(saved ? 'Removed from saved' : 'Post saved');
          }}
          className={clsx(
            "text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2",
            saved && "text-indigo-600 dark:text-indigo-400"
          )}
          aria-label="Save post"
        >
          <Bookmark className={clsx("w-5 h-5", saved && "fill-current")} />
        </Button>
      </div>

      {/* Collapsible Comment Section */}
      {showComments && (
        <div className="animate-fade-in-down border-t border-slate-100 dark:border-zinc-800">
          <CommentSection 
            postId={post._id} 
            comments={post.comments} 
            onUpdate={onUpdate} 
          />
        </div>
      )}
    </article>
  );
};

export default PostCard;