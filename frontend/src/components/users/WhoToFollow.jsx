// // components/users/WhoToFollow.jsx
// import React, { useEffect, useState } from 'react';
// import { UserPlus, UserMinus, UserCheck, X } from 'lucide-react';
// import { Avatar } from '../ui/Avatar';
// import { Button } from '../ui/Button';
// import { Link } from 'react-router-dom';
// import api from '../../lib/api';
// import { toast } from 'sonner';
// import { useAuthStore } from '../../store/authStore';

// export const WhoToFollow = ({ title = "Who to follow", limit = 3, onDismiss }) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user: currentUser } = useAuthStore();

//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       try {
//         const res = await api.get(`/users/suggestions?limit=${limit}`);
//         // Mark initial follow status
//         const usersWithStatus = res.data.data.map(u => ({
//           ...u,
//           isFollowing: currentUser?.following?.includes(u._id) || false
//         }));
//         setUsers(usersWithStatus);
//       } catch (error) {
//         console.error('Failed to fetch suggestions', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSuggestions();
//   }, [currentUser, limit]);

//   const handleFollow = async (e, userId, isFollowing) => {
//     e.preventDefault();
//     e.stopPropagation();

//     // Optimistic UI
//     setUsers(prev => prev.map(u => 
//       u._id === userId ? { ...u, isFollowing: !isFollowing } : u
//     ));

//     try {
//       await api.post(`/users/follow/${userId}`);
//       toast.success(isFollowing ? 'Unfollowed' : 'Following');
//     } catch (error) {
//       // Revert on error
//       setUsers(prev => prev.map(u => 
//         u._id === userId ? { ...u, isFollowing: isFollowing } : u
//       ));
//       toast.error('Action failed');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden mb-6">
//         <div className="p-4 border-b border-slate-100 dark:border-zinc-800">
//           <div className="h-5 bg-slate-200 dark:bg-zinc-800 rounded w-24 animate-pulse" />
//         </div>
//         <div className="divide-y divide-slate-100 dark:divide-zinc-800">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="p-4 flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 animate-pulse" />
//               <div className="flex-1">
//                 <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-24 mb-2 animate-pulse" />
//                 <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-16 animate-pulse" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (users.length === 0) return null;

//   return (
//     <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden mb-6">
//       <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
//         <h3 className="font-bold text-slate-900 dark:text-zinc-100">{title}</h3>
//         {onDismiss && (
//           <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600">
//             <X className="w-4 h-4" />
//           </button>
//         )}
//       </div>
      
//       <div className="divide-y divide-slate-100 dark:divide-zinc-800">
//         {users.map((user) => (
//           <Link key={user._id} to={`/profile/${user._id}`} className="block p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3 overflow-hidden">
//                 <Avatar src={user.avatar} alt={user.name} size="md" />
//                 <div className="min-w-0">
//                   <h4 className="font-semibold text-sm text-slate-900 dark:text-zinc-100 truncate">{user.name}</h4>
//                   <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">@{user.username}</p>
//                 </div>
//               </div>
              
//               <Button 
//                 variant={user.isFollowing ? "secondary" : "outline"}
//                 size="sm"
//                 className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
//                   user.isFollowing ? 'hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400' : ''
//                 }`}
//                 onClick={(e) => handleFollow(e, user._id, user.isFollowing)}
//               >
//                 {user.isFollowing ? (
//                   <><UserCheck className="w-3 h-3 mr-1" /> Following</>
//                 ) : (
//                   <><UserPlus className="w-3 h-3 mr-1" /> Follow</>
//                 )}
//               </Button>
//             </div>
//           </Link>
//         ))}
//       </div>
      
//       <Link to="/explore" className="block p-3 text-center text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium">
//         Show more
//       </Link>
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import { UserPlus, UserCheck, Sparkles, X, ChevronRight } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';

export const WhoToFollow = ({ title = "Who to follow", limit = 3, onDismiss }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get(`/users/suggestions?limit=${limit}`);
        const usersWithStatus = res.data.data.map(u => ({
          ...u,
          isFollowing: currentUser?.following?.includes(u._id) || false
        }));
        setUsers(usersWithStatus);
      } catch (error) {
        console.error('Failed to fetch suggestions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [currentUser, limit]);

  const handleFollow = async (e, userId, isFollowing) => {
    e.preventDefault();
    e.stopPropagation();

    setUsers(prev => prev.map(u => 
      u._id === userId ? { ...u, isFollowing: !isFollowing } : u
    ));

    try {
      await api.post(`/users/follow/${userId}`);
      toast.success(isFollowing ? 'Unfollowed' : `You're now following this creator`);
    } catch (error) {
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, isFollowing: isFollowing } : u
      ));
      toast.error('Something went wrong');
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-4xl border border-slate-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800">
          <div className="h-5 bg-slate-100 dark:bg-zinc-800 rounded-full w-32 animate-pulse" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full w-24" />
                <div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded-full w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-4xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-linear-to-r from-transparent to-slate-50/50 dark:to-zinc-800/30">
        <h3 className="font-black text-slate-900 dark:text-zinc-100 flex items-center gap-2 tracking-tight">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          {title}
        </h3>
        {onDismiss && (
          <button onClick={onDismiss} className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* User List */}
      <div className="divide-y divide-slate-50 dark:divide-zinc-800/50">
        {users.map((user) => (
          <Link 
            key={user._id} 
            to={`/profile/${user._id}`} 
            className="group block p-4 hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <Avatar src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl border-2 border-transparent group-hover:border-indigo-500/30 transition-all duration-300" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {user.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 truncate font-medium">@{user.username}</p>
                  <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                    Suggested for you
                  </span>
                </div>
              </div>
              
              <button 
                onClick={(e) => handleFollow(e, user._id, user.isFollowing)}
                className={`shrink-0 p-2.5 rounded-2xl transition-all duration-300 ${
                  user.isFollowing 
                    ? 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-red-500 hover:text-white' 
                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white shadow-sm'
                }`}
              >
                {user.isFollowing ? (
                  <UserCheck className="w-5 h-5" />
                ) : (
                  <UserPlus className="w-5 h-5" />
                )}
              </button>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Footer Link */}
      <Link 
        to="/explore" 
        className="group flex items-center justify-center gap-2 p-4 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
      >
        View All Creators
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};