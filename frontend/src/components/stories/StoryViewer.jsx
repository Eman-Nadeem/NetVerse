// components/stories/StoryViewer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { formatDistanceToNow } from 'date-fns';
import api from '../../lib/api';

const StoryViewer = ({ storiesData, initialUserIndex, initialStoryIndex, onClose }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const currentUser = storiesData[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];

  // Auto-progress Logic
  useEffect(() => {
    if (!currentStory || paused) return;

    // Calculate duration: 5 seconds for images, video duration (if available) or 10s
    let duration = 5000;
    if (currentStory.media?.type === 'video' && currentStory.media?.duration) {
      duration = currentStory.media.duration * 1000;
    }

    timerRef.current = setTimeout(() => {
      handleNext();
    }, duration);

    // Mark as viewed via API (Backend handles it on GET, but we ensure we fetched the specific story)
    // The fetch happens in the component that opens this, or we could do it here.
    // For now, we assume the data is fresh or we don't strictly need to re-fetch just to mark view if the backend does it on get.

    return () => clearTimeout(timerRef.current);
  }, [currentStory, paused, currentUserIndex, currentStoryIndex]);

  const handleNext = () => {
    if (!currentUser) return;
    
    // Check if more stories for this user
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } 
    // Move to next user
    else if (currentUserIndex < storiesData.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose(); // End of stories
    }
  };

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      setCurrentStoryIndex(storiesData[currentUserIndex - 1].stories.length - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentUserIndex, currentStoryIndex]);

  if (!currentUser || !currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Background Blur */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      <div 
        className="relative w-full max-w-md h-full max-h-[90vh] md:rounded-xl overflow-hidden bg-zinc-900 shadow-2xl flex flex-col"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white/80 hover:text-white bg-black/20 rounded-full p-1"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-2">
          {currentUser.stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300 ease-linear"
                style={{ width: idx < currentStoryIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-6 left-4 right-12 z-10 flex items-center gap-3">
          <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" />
          <div>
            <h3 className="text-white font-semibold text-sm">{currentUser.name}</h3>
            <p className="text-white/70 text-xs">{formatDistanceToNow(new Date(currentStory.createdAt))}</p>
          </div>
        </div>

        {/* Media Content */}
        <div className="flex-1 flex items-center justify-center bg-black relative">
          {currentStory.media?.type === 'video' ? (
            <video 
              src={currentStory.media.url} 
              className="max-h-full max-w-full object-contain"
              autoPlay
              loop
              playsInline
            />
          ) : (
            <img 
              src={currentStory.media.url} 
              alt="Story" 
              className="max-h-full max-w-full object-contain"
            />
          )}
          
          {/* Navigation Zones (Invisible) */}
          <div className="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-10" onClick={handlePrev} />
          <div className="absolute inset-y-0 right-0 w-1/3 cursor-pointer z-10" onClick={handleNext} />
        </div>

        {/* Caption & Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
          <p className="text-white text-sm mb-4">{currentStory.caption}</p>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Send message" 
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:bg-white/20"
            />
            <button className="text-white bg-white/20 rounded-full p-2 hover:bg-white/30">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;