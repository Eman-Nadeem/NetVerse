import React, { useState, useEffect } from 'react';
import { MapPin, Link as LinkIcon, Calendar, Settings, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import PostCard from '../components/posts/PostCard';
import api from '../lib/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('posts');
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch User Info
        const userRes = await api.get('/auth/me');
        console.log("Fetched user data:", userRes.data.data); // Debug log to check the structure of the response
        setUser(userRes.data.data);

        // Fetch User's Posts (Assuming backend supports filtering or we just fetch all and filter client side for now)
        // Ideally: api.get(`/posts?author=${userRes.data.data._id}`)
        // For this demo, we'll assume we fetch the general feed or a specific user endpoint
        // Let's stick to a placeholder or specific fetch if you have the route:
        const postsRes = await api.get('/posts'); 
        // Filter for this user's posts
        const myPosts = postsRes.data.data.filter(p => p.author._id === userRes.data.data._id);
        setPosts(myPosts);

      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };

    fetchProfileData();
  }, []);

  if (!user) {
     return <div className="p-10 text-center">Loading Profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Profile Info Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
        {/* Header Section */}
        <div className="relative">
          <div className="h-40 md:h-64 bg-linear-to-tr from-indigo-600 via-purple-500 to-pink-500 rounded-b-3xl shadow-inner" />
          <div className="px-6 flex justify-between items-end -mt-12 md:-mt-16 relative z-10">
            <Avatar 
              src={user.avatar} 
              size="xl" 
              className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-slate-50 dark:ring-zinc-950 shadow-2xl"
            />
            <div className="flex gap-2 pb-2">
              <Link to="/settings" className="md:hidden">
                <Button variant="secondary" className="rounded-full p-2">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="primary" className="rounded-full px-6">
                <Edit3 className="w-4 h-4 mr-2" /> 
                <span className="hidden sm:inline">Edit Profile</span>
              </Button>
            </div>
          </div>
        </div>
        {/* Profile Info */}
        <div className="px-6 mt-4">
          <div className="flex flex-col gap-1">
            <h1
              className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 group relative inline-block"
            >
              <span
                className="relative z-10 bg-clip-text text-transparent bg-linear-to-r from-slate-900 dark:from-zinc-50 via-slate-900 dark:via-zinc-50 to-slate-900 dark:to-zinc-50 group-hover:from-indigo-600 group-hover:via-purple-500 group-hover:to-pink-500 group-hover:text-transparent transition-all duration-300 ease-in-out"
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {user.name}
              </span>
            </h1>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium">@{user.username}</p>
          </div>
          <p className="mt-4 text-slate-700 dark:text-zinc-300 whitespace-pre-line max-w-lg leading-relaxed">
            {user.bio}
          </p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {user.location || 'Not specified'}</div>
            <div className="flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4" /> 
              {user.website ? (
                <a href={user.website} className="text-indigo-600 hover:underline">{user.website}</a>
              ) : (
                'No website provided'
              )}
            </div>
            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="flex gap-8 mt-8 py-4 border-y border-slate-100 dark:border-zinc-800/50 justify-center">
            <div className="flex gap-1.5 items-center">
              <span className="font-bold text-slate-900 dark:text-zinc-100">{posts.length}</span>
              <span className="text-slate-500 text-sm">Posts</span>
            </div>
            <div className="flex gap-1.5 items-center cursor-pointer hover:text-indigo-600 transition-colors">
              <span className="font-bold text-slate-900 dark:text-zinc-100">{user.followersCount}</span>
              <span className="text-slate-500 text-sm">Followers</span>
            </div>
            <div className="flex gap-1.5 items-center cursor-pointer hover:text-indigo-600 transition-colors">
              <span className="font-bold text-slate-900 dark:text-zinc-100">{user.followingCount}</span>
              <span className="text-slate-500 text-sm">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar and Content Card */}
      <div className="mt-8">
        <div className="shadow-sm border border-slate-200 dark:border-zinc-800/50 rounded-2xl bg-white dark:bg-zinc-900 flex w-full border-b">
          <button
            className={`flex-1 py-4 font-semibold text-sm transition-all relative ${selectedTab === 'posts' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'}`}
            onClick={() => setSelectedTab('posts')}
          >
            Posts
            {selectedTab === 'posts' && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3/4 h-1 rounded-full bg-linear-to-r from-indigo-600 via-purple-500 to-pink-500" />
            )}
          </button>
          <button
            className={`flex-1 py-4 font-medium text-sm transition-all relative ${selectedTab === 'media' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'}`}
            onClick={() => setSelectedTab('media')}
          >
            Media
            {selectedTab === 'media' && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3/4 h-1 rounded-full bg-linear-to-r from-indigo-600 via-purple-500 to-pink-500" />
            )}
          </button>
          <button
            className={`flex-1 py-4 font-medium text-sm transition-all relative ${selectedTab === 'likes' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'}`}
            onClick={() => setSelectedTab('likes')}
          >
            Likes
            {selectedTab === 'likes' && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3/4 h-1 rounded-full bg-linear-to-r from-indigo-600 via-purple-500 to-pink-500" />
            )}
          </button>
        </div>
        {/* Tab Content */}
        <div className="pt-5">
          {selectedTab === 'posts' && (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={user._id}
                  showComments={openCommentsPostId === post._id}
                  onToggleComments={() => setOpenCommentsPostId(openCommentsPostId === post._id ? null : post._id)}
                />
              ))}
            </div>
          )}
          {selectedTab === 'media' && (
            <div className="p-8 text-center text-slate-500 dark:text-zinc-400">No media posts yet.</div>
          )}
          {selectedTab === 'likes' && (
            <div className="p-8 text-center text-slate-500 dark:text-zinc-400">No liked posts yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;