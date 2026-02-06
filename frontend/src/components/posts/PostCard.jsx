import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import api from '../../lib/api';

const PostCard = ({ post, onUpdate, currentUserId }) => {
  // Local state for like and save status, optimistic UI update
  const [liked, setLiked] = useState(post.likes?.includes(currentUserId)); // Use real user ID
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const handleLike = async () => {
    // Optimistic UI Update (Update immediately)
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      // API Call
      await api.post(`/posts/${post._id}/like`);
      // If successful, we keep the state. If failed, we could revert (not implemented here for simplicity)
    } catch (error) {
      console.error("Like failed", error);
      // Revert on error
      setLiked(!newLikedState);
      setLikesCount(prev => newLikedState ? prev - 1 : prev + 1);
    }
  };

  return (
    <article className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 mb-6 overflow-hidden transition-all hover:shadow-md dark:hover:border-zinc-700">
      {/* Header: User Info & Time */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={post.author?.avatar} alt={post.author?.name} />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-zinc-100 text-sm leading-tight">
              {post.author?.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Button variant="ghost" className="p-2 h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Body: Content & Images */}
      <div className="px-4 pb-3">
        {/* // preserve line breaks in post content */}
        <p className="text-slate-800 dark:text-zinc-200 whitespace-pre-line mb-3 text-[15px]">
          {post.content}
        </p>
        
        {post.images && post.images.length > 0 && (
          <div className="relative rounded-xl overflow-hidden border border-slate-100 dark:border-zinc-800 bg-black/5 dark:bg-white/5">
            <img
              src={post.images[0].url}
              alt="Post content"
              className="w-full h-auto object-cover max-h-150 rounded-xl transition-opacity duration-300"
              loading="lazy"
            />
            {post.images.length > 1 && (
              <>
                {/* Left arrow */}
                <button
                  type="button"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-zinc-900/70 rounded-full p-1 shadow hover:bg-white dark:hover:bg-zinc-800 transition"
                  onClick={() => {
                    setImageFade(true);
                    setTimeout(() => {
                      setCurrentImage((prev) => prev === 0 ? post.images.length - 1 : prev - 1);
                    }, 150);
                  }}
                  aria-label="Previous image"
                  style={{ zIndex: 2 }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                </button>
                {/* Right arrow */}
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-zinc-900/70 rounded-full p-1 shadow hover:bg-white dark:hover:bg-zinc-800 transition"
                  onClick={() => {
                    setImageFade(true);
                    setTimeout(() => {
                      setCurrentImage((prev) => prev === post.images.length - 1 ? 0 : prev + 1);
                    }, 150);
                  }}
                  aria-label="Next image"
                  style={{ zIndex: 2 }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                </button>
                {/* Dots indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {post.images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`inline-block w-2 h-2 rounded-full ${idx === currentImage ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-zinc-700'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer: Stats & Actions */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
        {/* Left Actions: Interactive */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            onClick={handleLike}
            className={clsx(
              "flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 px-3 py-2",
              liked && "text-red-500 dark:text-red-500 hover:text-red-600"
            )}
          >
            <Heart className={clsx("w-5 h-5 transition-transform", liked && "fill-current scale-110")} />
            <span className="text-sm font-medium">{likesCount}</span>
          </Button>
          
          <Button variant="ghost" className="text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium ml-2">{post.comments?.length || 0}</span>
          </Button>

          <Button variant="ghost" className="text-slate-500 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 px-3 py-2">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Right Action: Save */}
        <Button 
          variant="ghost" 
          onClick={() => setSaved(!saved)}
          className={clsx(
            "text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2",
            saved && "text-indigo-600 dark:text-indigo-400"
          )}
        >
          <Bookmark className={clsx("w-5 h-5", saved && "fill-current")} />
        </Button>
      </div>
    </article>
  );
};

export default PostCard;