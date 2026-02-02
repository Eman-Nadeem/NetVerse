import React from 'react';
import { MapPin, Link as LinkIcon, Calendar, Settings, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { PostCard } from '../components/posts/PostCard'; // 1. Fixed: Named import

const Profile = () => {
  // Mock Data
  const MOCK_USER = {
    name: 'Eman Nadeem',
    username: 'webdev.eman',
    avatar: 'https://i.pravatar.cc/150?img=32',
    bio: 'Full Stack Developer | Building Netverse 🚀\nReact, Node.js, and MongoDB enthusiast.',
    website: 'https://netverse.app',
    location: 'Faisalabad, Pakistan',
    joinedDate: 'January 2026',
    stats: { posts: 42, followers: '1.2k', following: '340' }
  };

  // 2. Added: Mock data for the feed
  const USER_POSTS = [
    {
      _id: '1',
      content: "Just finished implementing the new profile layout! 🎨 The tab system makes navigation so much smoother.",
      author: MOCK_USER,
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
      likes: ['102', '103'],
      comments: [],
      images: []
    },
    {
      _id: '2',
      content: "Working on the backend integration for Netverse. Node.js and Express are handling the requests like a charm. ⚡",
      author: MOCK_USER,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      likes: ['105', '106', '107'],
      comments: [],
      images: []
    }
  ];

  const [selectedTab, setSelectedTab] = React.useState('posts');

  return (
    <div className="max-w-4xl mx-auto pb-10 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
      
      {/* Header Section */}
      <div className="relative">
        {/* 3. Fixed: Corrected gradient class */}
        <div className="h-40 md:h-64 bg-linear-to-tr from-indigo-600 to-purple-500 rounded-b-3xl shadow-inner" />
        
        {/* Avatar Positioned Over Cover */}
        <div className="px-6 flex justify-between items-end -mt-12 md:-mt-16 relative z-10">
          <Avatar 
            src={MOCK_USER.avatar} 
            size="xl" 
            className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-slate-50 dark:ring-zinc-950 shadow-2xl"
          />
          
          <div className="flex gap-2 pb-2">
            {/* Settings Button - Mobile Only (md:hidden) */}
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-zinc-50">
            {MOCK_USER.name}
          </h1>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium">@{MOCK_USER.username}</p>
        </div>

        <p className="mt-4 text-slate-700 dark:text-zinc-300 whitespace-pre-line max-w-lg leading-relaxed">
          {MOCK_USER.bio}
        </p>

        {/* Metadata Bar */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {MOCK_USER.location}</div>
          <div className="flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4" /> 
            <a href={MOCK_USER.website} className="text-indigo-600 hover:underline">{MOCK_USER.website}</a>
          </div>
          <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {MOCK_USER.joinedDate}</div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-8 mt-8 py-4 border-y border-slate-100 dark:border-zinc-800/50 justify-center md:justify-start">
          <div className="flex gap-1.5 items-center">
            <span className="font-bold text-slate-900 dark:text-zinc-100">{MOCK_USER.stats.posts}</span>
            <span className="text-slate-500 text-sm">Posts</span>
          </div>
          <div className="flex gap-1.5 items-center cursor-pointer hover:text-indigo-600 transition-colors">
            <span className="font-bold text-slate-900 dark:text-zinc-100">{MOCK_USER.stats.followers}</span>
            <span className="text-slate-500 text-sm">Followers</span>
          </div>
          <div className="flex gap-1.5 items-center cursor-pointer hover:text-indigo-600 transition-colors">
            <span className="font-bold text-slate-900 dark:text-zinc-100">{MOCK_USER.stats.following}</span>
            <span className="text-slate-500 text-sm">Following</span>
          </div>
        </div>
      </div>

      {/* Tabs / Navigation */}
      <div className="flex border-b border-slate-100 dark:border-zinc-800/50 mt-4">
        <button
          className={`flex-1 py-4 font-semibold text-sm transition-all border-b-2 ${selectedTab === 'posts' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'}`}
          onClick={() => setSelectedTab('posts')}
        >
          Posts
        </button>
        <button
          className={`flex-1 py-4 font-medium text-sm transition-all border-b-2 ${selectedTab === 'media' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'}`}
          onClick={() => setSelectedTab('media')}
        >
          Media
        </button>
        <button
          className={`flex-1 py-4 font-medium text-sm transition-all border-b-2 ${selectedTab === 'likes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'}`}
          onClick={() => setSelectedTab('likes')}
        >
          Likes
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-0">
        {selectedTab === 'posts' && (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/50">
            {USER_POSTS.map((post) => (
              <PostCard key={post._id} post={post} />
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
  );
};

export default Profile;