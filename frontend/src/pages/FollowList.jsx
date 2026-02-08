import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, UserCheck, Search } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const FollowList = () => {
  const { id, type } = useParams(); // type will be 'followers' or 'following'
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/${id}/${type}`);
        // Ensure each user has isFollowing status
        const listWithStatus = res.data.data.map(u => ({
          ...u,
          isFollowing: currentUser?.following?.includes(u._id)
        }));
        setUsers(listWithStatus);
      } catch (error) {
        toast.error(`Failed to load ${type}`);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [id, type, currentUser]);

  const handleFollowToggle = async (e, targetUserId, currentlyFollowing) => {
    e.preventDefault();
    try {
      await api.post(`/users/follow/${targetUserId}`);
      setUsers(prev => prev.map(u => 
        u._id === targetUserId ? { ...u, isFollowing: !currentlyFollowing } : u
      ));
      
      // Update the auth store with new following status
      const updatedFollowing = currentlyFollowing 
        ? currentUser.following.filter(id => id !== targetUserId)
        : [...(currentUser.following || []), targetUserId];
      
      const { updateUser } = useAuthStore.getState();
      updateUser({ following: updatedFollowing });
      
      toast.success(currentlyFollowing ? 'Unfollowed' : 'Following');
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto pb-10 min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-20 bg-slate-50/80 dark:bg-zinc-950/80 backdrop-blur-md py-4 px-4 flex items-center gap-4 border-b border-slate-200 dark:border-zinc-800">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black capitalize">{type}</h1>
          <p className="text-xs text-slate-500 font-medium">{users.length} People</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder={`Search ${type}...`}
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-2">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-zinc-900 rounded-3xl animate-pulse" />
          ))
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div 
              key={user._id}
              className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-100 dark:border-zinc-800 hover:border-indigo-500/30 transition-all shadow-sm"
            >
              <Link to={`/profile/${user._id}`} className="flex items-center gap-3 min-w-0">
                <Avatar src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl" />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm truncate">{user.name}</h4>
                  <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                </div>
              </Link>

              {currentUser?._id !== user._id && (
                <button
                  onClick={(e) => handleFollowToggle(e, user._id, user.isFollowing)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                    user.isFollowing 
                    ? 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-red-500 hover:text-white' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20'
                  }`}
                >
                  {user.isFollowing ? (
                    <><UserCheck className="w-4 h-4" /> <span className="hidden sm:inline">Following</span></>
                  ) : (
                    <><UserPlus className="w-4 h-4" /> Follow</>
                  )}
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-500">
            No one found here yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowList;