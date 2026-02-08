import React from 'react';
import { Plus } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuthStore } from '../../store/authStore';

const StoryTray = ({ stories = [], onStoryClick }) => {
  const { user: currentUser } = useAuthStore();

  // Check if current user has stories and find their index
  const myStoryIndex = stories.findIndex(s => s._id === currentUser?._id);
  const hasMyStory = myStoryIndex !== -1;
  const myStoryData = hasMyStory ? stories[myStoryIndex] : null;
  
  // Filter out current user's story from the main list (we show it first separately)
  const otherStories = stories.filter(s => s._id !== currentUser?._id);

  const handleMyStoryClick = (e) => {
    if (hasMyStory) {
      // View my story - pass the original index from the full stories array
      onStoryClick(myStoryIndex, 0, false);
    } else {
      // Create new story
      onStoryClick(null, null, true);
    }
  };

  const handleAddNewStory = (e) => {
    e.stopPropagation(); // Prevent triggering the parent click
    onStoryClick(null, null, true);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-zinc-800 mb-6 overflow-hidden">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        
        {/* My Story / Add Story Button - Always First */}
        <div 
          className="flex flex-col items-center gap-2 cursor-pointer shrink-0 w-16 ml-1"
          onClick={handleMyStoryClick}
        >
          <div className="relative w-16 h-16">
            {hasMyStory ? (
              <>
                {/* Gradient Ring when user has story - using logo colors */}
                <div className="absolute inset-0 rounded-full p-0.5 bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-pulse-slow">
                  <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-full p-0.5">
                    <Avatar 
                      src={currentUser?.avatar} 
                      alt={currentUser?.name || currentUser?.username} 
                      size="lg" 
                      className="w-full h-full rounded-full" 
                    />
                  </div>
                </div>
                {/* Small + button to add new story */}
                <button
                  onClick={handleAddNewStory}
                  className="absolute -bottom-0.5 -right-0.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-full p-1 border-2 border-white dark:border-zinc-900 shadow-lg hover:scale-110 transition-transform z-10"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </>
            ) : (
              <>
                {/* No story - show dashed border and + icon */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-300 dark:border-zinc-600" />
                <Avatar 
                  src={currentUser?.avatar} 
                  alt={currentUser?.name || currentUser?.username} 
                  size="lg" 
                  className="w-full h-full rounded-full opacity-80" 
                />
                <div className="absolute bottom-0 right-0 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-full p-1.5 border-2 border-white dark:border-zinc-900 shadow-lg">
                  <Plus className="w-3 h-3" />
                </div>
              </>
            )}
          </div>
          <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
            {hasMyStory ? 'Your Story' : 'Add Story'}
          </span>
        </div>

        {/* Other Users' Stories */}
        {otherStories.map((userData) => {
          // Find original index for proper viewer navigation
          const originalIndex = stories.findIndex(s => s._id === userData._id);
          return (
            <div 
              key={userData._id}
              className="flex flex-col items-center gap-2 cursor-pointer shrink-0 w-16"
              onClick={() => onStoryClick(originalIndex, 0, false)}
            >
              <div className="relative w-16 h-16">
                {/* Gradient Ring for Stories */}
                <div className={`absolute inset-0 rounded-full p-0.5 ${
                  userData.stories.length > 0 
                  ? 'bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500' 
                  : 'bg-slate-300 dark:bg-zinc-700'
                }`}>
                  <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-full p-0.5">
                     <Avatar src={userData.avatar} alt={userData.name} size="lg" className="w-full h-full rounded-full" />
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-zinc-400 truncate w-full text-center">
                {userData.username}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoryTray;