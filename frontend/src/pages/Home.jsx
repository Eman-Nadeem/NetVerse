import React, { useState, useEffect } from 'react';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';
import { PostSkeleton } from '../components/ui/Skeleton'; // Import Skeleton
import { FileX } from 'lucide-react'; // Icon for empty state
import api from '../lib/api';
import StoryTray from '../components/stories/StoryTray';
import StoryViewer from '../components/stories/StoryViewer';
import CreateStoryModal from '../components/stories/CreateStoryModal';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);

  // Story States
  const [allStories, setAllStories] = useState([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUserIndex, setViewerUserIndex] = useState(0);
  const [viewerStoryIndex, setViewerStoryIndex] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch current user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setCurrentUserId(res.data.data._id);
      } catch (e) {
        setCurrentUserId(null);
      }
    };
    fetchUser();
  }, []);

  // Function to fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/posts');
      setPosts(res.data.data); 
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Stories (For the viewer logic)
  const fetchStories = async () => {
    try {
      const res = await api.get('/stories');
      setAllStories(res.data.data);
    } catch (error) {
      console.error('Failed to fetch stories', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchStories();
  }, []);

  // Handle click on Story Tray
  const handleStoryClick = async (userIndex, storyIndex, isCreate) => {
    if (isCreate) {
      setIsCreateModalOpen(true);
    } else {
      // Refresh stories to ensure we have latest
      await fetchStories();
      setViewerUserIndex(userIndex);
      setViewerStoryIndex(storyIndex);
      setViewerOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Story Tray */}
      <StoryTray stories={allStories} onStoryClick={handleStoryClick} />

      {/* Story Viewer Overlay */}
      {viewerOpen && (
        <StoryViewer 
          storiesData={allStories}
          initialUserIndex={viewerUserIndex}
          initialStoryIndex={viewerStoryIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}

      {/* Create Story Modal */}
      <CreateStoryModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onStoryCreated={() => {
          setIsCreateModalOpen(false);
          fetchStories(); // Refresh tray to show my new story
        }}
      />

      <CreatePost onPostCreated={fetchPosts} />

      {loading ? (
        // Show 3 skeleton cards while loading
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : (
        <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUpdate={fetchPosts}
                currentUserId={currentUserId}
                showComments={openCommentsPostId === post._id}
                onToggleComments={() => setOpenCommentsPostId(openCommentsPostId === post._id ? null : post._id)}
              />
            ))
          ) : (
            // Beautiful Empty State
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
              <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <FileX className="w-8 h-8 text-slate-400 dark:text-zinc-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">No Posts Yet</h3>
              <p className="text-slate-500 dark:text-zinc-400 max-w-sm mt-2">
                Be the first to share something with the community!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;