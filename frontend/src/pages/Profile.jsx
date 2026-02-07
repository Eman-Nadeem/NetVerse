import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Link as LinkIcon, Calendar, Settings, Edit3, UserPlus, UserMinus, MessageSquare } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import PostCard from '../components/posts/PostCard';
import api from '../lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const isMyProfile = !id || id === currentUser?._id;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // Fetch User: Use ID from URL if present, else 'me'
        const userRes = await api.get(isMyProfile ? '/auth/me' : `/users/profile/${id}`);
        const userData = userRes.data.data;
        
        setUser(userData);
        setIsFollowing(userData.isFollowing || false);

        // Fetch User's Posts
        const postsRes = await api.get(`/users/${userData._id}/posts`);
        setPosts(postsRes.data.data);

      } catch (error) {
        console.error("Failed to load profile", error);
        if(error.response?.status === 404) toast.error('User not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, isMyProfile]);

  const handleFollow = async () => {
    if (!user) return;
    try {
      const res = await api.post(`/users/follow/${user._id}`);
      const data = res.data.data;
      
      setIsFollowing(data.isFollowing);
      
      // Update follower count locally for instant feedback
      setUser(prev => ({
        ...prev,
        followersCount: prev.followersCount + (data.isFollowing ? 1 : -1)
      }));

      toast.success(data.isFollowing ? 'Followed successfully' : 'Unfollowed');
    } catch (error) {
      toast.error('Action failed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pb-10 space-y-6">
        <div className="h-64 bg-slate-200 dark:bg-zinc-800 rounded-b-3xl animate-pulse" />
        <div className="px-6 -mt-12 flex justify-between items-end">
           <div className="w-32 h-32 bg-slate-300 dark:bg-zinc-700 rounded-full animate-pulse ring-4 ring-slate-50 dark:ring-zinc-950" />
           <div className="h-10 w-32 bg-slate-200 dark:bg-zinc-800 rounded-full animate-pulse" />
        </div>
        <div className="px-6 space-y-4">
           <div className="h-8 w-1/3 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
           <div className="h-4 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Profile Info Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="relative">
          {/* Cover Photo Placeholder */}
          <div className="h-40 md:h-64 bg-linear-to-tr from-indigo-600 via-purple-500 to-pink-500 rounded-b-3xl" />
          
          <div className="px-6 flex justify-between items-end -mt-12 md:-mt-16 relative z-10">
            <Avatar 
              src={user.avatar} 
              alt={user.name}
              size="xl" 
              className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-slate-50 dark:ring-zinc-950"
            />
            
            <div className="flex gap-2 pb-2">
              {!isMyProfile && (
                <>
                  <Link to={`/chats/create/${user._id}`}>
                    <Button variant="secondary" className="rounded-full px-4">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant={isFollowing ? "secondary" : "primary"} 
                    className="rounded-full px-6"
                    onClick={handleFollow}
                  >
                    {isFollowing ? (
                      <>Following <UserMinus className="w-4 h-4 ml-2"/></>
                    ) : (
                      <>Follow <UserPlus className="w-4 h-4 ml-2"/></>
                    )}
                  </Button>
                </>
              )}
              
              {isMyProfile && (
                <>
                  <Link to="/settings" className="md:hidden">
                    <Button variant="secondary" className="rounded-full p-2">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button variant="primary" className="rounded-full px-6">
                    <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Profile Details */}
        <div className="px-6 mt-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-zinc-50">
            {user.name}
          </h1>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium">@{user.username}</p>
          
          <p className="mt-4 text-slate-700 dark:text-zinc-300 whitespace-pre-line max-w-lg leading-relaxed">
            {user.bio || 'No bio yet.'}
          </p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {user.location || 'Unknown'}</div>
            <div className="flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4" /> 
              {user.website ? (
                <a href={user.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{user.website}</a>
              ) : (
                'No website'
              )}
            </div>
            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {new Date(user.createdAt).toLocaleDateString()}</div>
          </div>

          <div className="flex gap-8 mt-8 py-4 border-y border-slate-100 dark:border-zinc-800/50 justify-center">
            <div className="flex gap-1.5 items-center">
              <span className="font-bold text-slate-900 dark:text-zinc-100">{posts.length}</span>
              <span className="text-slate-500 text-sm">Posts</span>
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="font-bold text-slate-900 dark:text-zinc-100">{user.followersCount}</span>
              <span className="text-slate-500 text-sm">Followers</span>
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="font-bold text-slate-900 dark:text-zinc-100">{user.followingCount}</span>
              <span className="text-slate-500 text-sm">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="shadow-sm border border-slate-200 dark:border-zinc-800/50 rounded-2xl bg-white dark:bg-zinc-900 flex w-full border-b">
        {['posts', 'media', 'likes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`flex-1 py-4 font-semibold text-sm transition-all relative capitalize ${
              selectedTab === tab ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            {tab}
            {selectedTab === tab && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3/4 h-1 rounded-full bg-linear-to-r from-indigo-600 via-purple-500 to-pink-500" />
            )}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="pt-5">
        {selectedTab === 'posts' && (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={currentUser?._id}
                showComments={openCommentsPostId === post._id}
                onToggleComments={() => setOpenCommentsPostId(openCommentsPostId === post._id ? null : post._id)}
              />
            ))}
            {posts.length === 0 && (
              <div className="text-center py-10 text-slate-500">No posts yet</div>
            )}
          </div>
        )}
        {selectedTab !== 'posts' && (
           <div className="p-8 text-center text-slate-500 dark:text-zinc-400">Feature coming soon!</div>
        )}
      </div>
    </div>
  );
};

export default Profile;