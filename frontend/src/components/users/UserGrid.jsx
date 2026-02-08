import React, { useEffect, useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { UserPlus, UserCheck, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

export const UserGrid = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users/suggestions?limit=12');
        const usersWithFollowStatus = res.data.data.map(user => ({
          ...user,
          isFollowing: currentUser?.following?.includes(user._id) || false
        }));
        setUsers(usersWithFollowStatus);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  const handleFollow = async (e, userId, isFollowing) => {
    e.preventDefault();
    e.stopPropagation();

    setUsers(prev => prev.map(u => 
      u._id === userId ? { ...u, isFollowing: !isFollowing } : u
    ));

    try {
      await api.post(`/users/follow/${userId}`);
      
      // Update the auth store with new following status
      const updatedFollowing = isFollowing 
        ? currentUser.following.filter(id => id !== userId)
        : [...(currentUser.following || []), userId];
      
      const { updateUser } = useAuthStore.getState();
      updateUser({ following: updatedFollowing });
      
      toast.success(isFollowing ? 'Removed from following' : `Now following`);
    } catch (error) {
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, isFollowing: isFollowing } : u
      ));
      toast.error('Action failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-slate-100 dark:bg-zinc-900/50 rounded-4xl h-64 animate-pulse border border-slate-200 dark:border-zinc-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {users.map((user) => (
        <Link 
          key={user._id} 
          to={`/profile/${user._id}`}
          className="group relative bg-white dark:bg-zinc-900 rounded-4xl p-6 transition-all duration-500 border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 overflow-hidden"
        >
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-indigo-500/5 to-transparent rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Avatar with Animated Ring */}
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm scale-110" />
              <div className="relative p-1 bg-white dark:bg-zinc-900 rounded-full">
                <Avatar 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-20 h-20 rounded-full border-2 border-slate-100 dark:border-zinc-800" 
                />
              </div>
              {user.isVerified && (
                <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full border-2 border-white dark:border-zinc-900">
                  <ShieldCheck className="w-3 h-3" />
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="space-y-1 mb-6 w-full">
              <h4 className="font-black text-slate-900 dark:text-zinc-100 text-base line-clamp-1 px-1">
                {user.name}
              </h4>
              <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium truncate">@{user.username}</p>
              
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Followers</p>
                  <p className="text-sm font-black text-slate-700 dark:text-zinc-300">{user.followersCount || 0}</p>
                </div>
                <div className="w-px h-6 bg-slate-200 dark:bg-zinc-800" />
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Posts</p>
                  <p className="text-sm font-black text-slate-700 dark:text-zinc-300">{user.postsCount || 0}</p>
                </div>
              </div>
            </div>

            {/* Dynamic Action Button */}
            <button
              onClick={(e) => handleFollow(e, user._id, user.isFollowing)}
              className={`cursor-pointer group/btn w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                user.isFollowing 
                  ? 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-red-500 hover:text-white dark:hover:bg-red-600' 
                  : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 hover:shadow-indigo-500/40'
              }`}
            >
              {user.isFollowing ? (
                <>
                  <UserCheck className="w-5 h-5 shrink-0 transition-transform group-hover/btn:scale-110" />
                  <span className="group-hover/btn:hidden">Following</span>
                  <span className="hidden group-hover/btn:inline">Unfollow</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 shrink-0 transition-transform group-hover/btn:scale-110" />
                  Follow
                </>
              )}
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};