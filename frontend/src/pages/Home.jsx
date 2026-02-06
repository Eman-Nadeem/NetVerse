import React, { useState, useEffect } from 'react';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';
import api from '../lib/api';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

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

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <CreatePost onPostCreated={fetchPosts} />

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={fetchPosts} currentUserId={currentUserId} />
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 dark:text-zinc-400">
              No posts yet. Be the first to post!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;