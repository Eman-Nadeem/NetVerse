import React from 'react';
import { MapPin, Link as LinkIcon, Calendar, Settings, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import PostCard from '../components/posts/PostCard';

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

  // Mock posts
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
    <div className="max-w-4xl mx-auto pb-10">
      {/* Profile Info Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
        {/* Header Section */}
        <div className="relative">
          <div className="h-40 md:h-64 bg-linear-to-tr from-indigo-600 via-purple-500 to-pink-500 rounded-b-3xl shadow-inner" />
          <div className="px-6 flex justify-between items-end -mt-12 md:-mt-16 relative z-10">
            <Avatar 
              src={MOCK_USER.avatar} 
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
                className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 dark:from-zinc-50 via-slate-900 dark:via-zinc-50 to-slate-900 dark:to-zinc-50 group-hover:from-indigo-600 group-hover:via-purple-500 group-hover:to-pink-500 group-hover:text-transparent transition-all duration-300 ease-in-out"
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {MOCK_USER.name}
              </span>
            </h1>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium">@{MOCK_USER.username}</p>
          </div>
          <p className="mt-4 text-slate-700 dark:text-zinc-300 whitespace-pre-line max-w-lg leading-relaxed">
            {MOCK_USER.bio}
          </p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {MOCK_USER.location}</div>
            <div className="flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4" /> 
              <a href={MOCK_USER.website} className="text-indigo-600 hover:underline">{MOCK_USER.website}</a>
            </div>
            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {MOCK_USER.joinedDate}</div>
          </div>
          <div className="flex gap-8 mt-8 py-4 border-y border-slate-100 dark:border-zinc-800/50 justify-center">
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
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3/4 h-1 rounded-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500" />
            )}
          </button>
          <button
            className={`flex-1 py-4 font-medium text-sm transition-all relative ${selectedTab === 'media' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'}`}
            onClick={() => setSelectedTab('media')}
          >
            Media
            {selectedTab === 'media' && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3/4 h-1 rounded-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500" />
            )}
          </button>
          <button
            className={`flex-1 py-4 font-medium text-sm transition-all relative ${selectedTab === 'likes' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'}`}
            onClick={() => setSelectedTab('likes')}
          >
            Likes
            {selectedTab === 'likes' && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3/4 h-1 rounded-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500" />
            )}
          </button>
        </div>
        {/* Tab Content */}
        <div className="pt-5">
          {selectedTab === 'posts' && (
            <div className="flex flex-col gap-4">
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
    </div>
  );
};

export default Profile;