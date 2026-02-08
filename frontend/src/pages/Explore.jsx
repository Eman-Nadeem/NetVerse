// 

import React, { useState, useEffect } from 'react';
import { Hash, Users, Flame, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';
import { WhoToFollow } from '../components/users/WhoToFollow';
import { UserGrid } from '../components/users/UserGrid';
import { Button } from '../components/ui/Button';
import PostCard from '../components/posts/PostCard';
import { PostSkeleton } from '../components/ui/Skeleton';
import { clsx } from 'clsx';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

// --- Sub-Component: Bento Trend Card ---
const TrendCard = ({ tag, category, posts, index }) => (
  <div className="group relative overflow-hidden p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:border-indigo-500 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1">
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/15 transition-all" />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">
          {category}
        </span>
        <span className="text-xs font-medium text-slate-400">#{index + 1}</span>
      </div>
      <h4 className="text-lg font-black text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {tag}
      </h4>
      <p className="text-sm text-slate-500 mt-1 font-medium">{posts} Posts</p>
    </div>
  </div>
);

const Explore = () => {
  const [activeTab, setActiveTab] = useState('for-you');
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('7d');
  const { user: currentUser } = useAuthStore();

  const tabs = [
    { id: 'for-you', label: 'For you', icon: Flame },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'users', label: 'Creators', icon: Users },
  ];

  const timeframes = [
    { id: '24h', label: 'Today' },
    { id: '7d', label: 'This week' },
    { id: '30d', label: 'This month' },
  ];

  useEffect(() => {
    if (activeTab === 'trending' || activeTab === 'for-you') {
      fetchTrendingPosts();
    }
  }, [activeTab, timeframe]);

  const fetchTrendingPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/posts/explore?timeframe=${timeframe}&limit=20`);
      setTrendingPosts(res.data.data);
    } catch (error) {
      console.error('Failed to fetch trending posts', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in px-4 md:px-0">
      {/* Header & Floating Tabs */}
      <div className="sticky top-16 bg-slate-50/80 dark:bg-zinc-950/80 backdrop-blur-xl z-30 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">Explore</h1>
          
          <div className="flex p-1.5 bg-slate-200/50 dark:bg-zinc-900/50 rounded-2xl w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-md scale-100"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300 scale-95"
                  )}
                >
                  <Icon className={clsx("w-4 h-4", activeTab === tab.id && "animate-pulse")} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-10 mt-4">
        
        {activeTab === 'for-you' && (
          <div className="space-y-10">
            {/* Bento Grid Trends */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-zinc-100">
                  <Sparkles className="w-5 h-5 text-indigo-500" /> Trends for you
                </h3>
                <Button variant="ghost" size="sm" className="text-indigo-600 font-bold">Show more</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <TrendCard tag="#NetVerseLaunch" category="Tech" posts="24.8K" index={0} />
                <TrendCard tag="#ReactConf2026" category="Coding" posts="12.1K" index={1} />
                <TrendCard tag="#UIUXDesign" category="Design" posts="8.5K" index={2} />
              </div>
            </section>

            {/* Premium Spotlight Card */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-2xl shadow-indigo-500/20">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                    alt="Spotlight" 
                    className="relative w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md p-2 border border-white/20 shadow-inner" 
                  />
                </div>
                <div className="text-center md:text-left space-y-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest border border-white/10">
                    Community Spotlight
                  </div>
                  <h3 className="text-3xl font-black leading-none">Meet the Pioneers</h3>
                  <p className="text-indigo-50 max-w-sm font-medium">Discover the most influential creators shaping the future of Netverse this month.</p>
                  <Button className="mt-4 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl px-8 font-black shadow-xl border-0 transition-transform active:scale-95">
                    Discover More <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </section>

            <WhoToFollow title="Creators to watch" limit={3} />
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="space-y-6">
            {/* Modern Timeframe Filter */}
            <div className="flex p-1 bg-slate-200/50 dark:bg-zinc-900/50 rounded-2xl w-fit">
              {timeframes.map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id)}
                  className={clsx(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all duration-200",
                    timeframe === tf.id
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300"
                  )}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Trending Feed */}
            {loading ? (
              <div className="space-y-6">
                <PostSkeleton /><PostSkeleton />
              </div>
            ) : trendingPosts.length > 0 ? (
              <div className="space-y-6">
                {trendingPosts.map((post, index) => (
                  <div key={post._id} className="group relative">
                    {index < 3 && (
                      <div className="absolute -left-3 -top-3 z-20 flex items-center justify-center w-10 h-10 bg-white dark:bg-zinc-900 border-4 border-slate-50 dark:border-zinc-950 rounded-2xl shadow-xl transform -rotate-12 group-hover:rotate-0 transition-transform">
                        <span className="text-lg font-black bg-linear-to-br from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                          {index + 1}
                        </span>
                      </div>
                    )}
                    <PostCard
                      post={post}
                      onUpdate={fetchTrendingPosts}
                      currentUserId={currentUser?._id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-[3rem] border border-slate-200 dark:border-zinc-800">
                <TrendingUp className="w-20 h-20 mx-auto mb-4 text-slate-200 dark:text-zinc-800" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-200">Silence is trending...</h3>
                <p className="text-slate-500 mt-2">Check back later for high-energy posts.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-zinc-800">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-zinc-100">Rising Stars</h3>
                <p className="text-slate-500 text-sm">People who are making waves in the community</p>
              </div>
              <UserGrid /> 
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;