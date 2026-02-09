// import React, { useState, useEffect } from 'react';
// import { Search as SearchIcon, User, MapPin, Link as LinkIcon, UserPlus, UserMinus, MessageSquare } from 'lucide-react';
// import { Link, useSearchParams, useNavigate } from 'react-router-dom';
// import { Avatar } from '../components/ui/Avatar';
// import { Button } from '../components/ui/Button';
// import api from '../lib/api';
// import { toast } from 'sonner';
// import { useAuthStore } from '../store/authStore';

// const Search = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const initialQuery = searchParams.get('q') || '';
//   const navigate = useNavigate();

//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { user: currentUser, updateUser } = useAuthStore(); // To check if we are already following

//   useEffect(() => {
//     setQuery(initialQuery);
//   }, [initialQuery]);

//   // Debounce Effect
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (query.length > 2) {
//         fetchUsers();
//         setSearchParams({ q: query });
//       } else {
//         setResults([]);
//         if (query === '') setSearchParams({});
//       }
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//   }, [query]);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/users/search?q=${query}`);
//       setResults(res.data.data);
//     } catch (error) {
//       console.error('Search error:', error);
//       toast.error('Failed to search users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Follow/Unfollow in Search Results
//   const handleFollow = async (e, userId, isCurrentlyFollowing) => {
//     e.preventDefault(); // Prevent navigation to profile
//     e.stopPropagation();
    
//     // Optimistic UI Update
//     setResults(prev => prev.map(u => {
//       if (u._id === userId) {
//         const currentFollowers = u.followers || [];
//         return {
//           ...u,
//           followers: isCurrentlyFollowing 
//             ? currentFollowers.filter(id => id !== currentUser._id) 
//             : [...currentFollowers, currentUser._id]
//         };
//       }
//       return u;
//     }));

//     try {
//       await api.post(`/users/follow/${userId}`);
      
//       // Update the auth store with new following status
//       const currentFollowing = currentUser.following || [];
//       const updatedFollowing = isCurrentlyFollowing 
//         ? currentFollowing.filter(id => id !== userId)
//         : [...currentFollowing, userId];
      
//       updateUser({ following: updatedFollowing });
      
//       toast.success(isCurrentlyFollowing ? 'Unfollowed' : 'Following');
//     } catch (error) {
//       toast.error('Action failed');
//       // Revert on error (simplified for now)
//       fetchUsers(); 
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto pb-20 animate-fade-in">
//       {/* Search Header */}
//       <div className="sticky top-0 bg-slate-50/90 dark:bg-zinc-950/90 backdrop-blur-md z-10 py-4 px-2">
//         <div className="relative">
//           <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search users by name or username..."
//             className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm transition-all"
//             autoFocus
//           />
//         </div>
//       </div>

//       {/* Results */}
//       <div className="mt-4 space-y-3">
//         {loading && <div className="text-center text-slate-500 py-4">Searching...</div>}
        
//         {!loading && query.length <= 2 && (
//           <div className="text-center py-16">
//             <SearchIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-zinc-700 mb-4" />
//             <h3 className="text-xl font-semibold text-slate-700 dark:text-zinc-300 mb-2">Discover People</h3>
//             <p className="text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
//               Search for users by name or username to connect with friends and discover new people.
//             </p>
//           </div>
//         )}
        
//         {!loading && query.length > 2 && results.length === 0 && (
//           <div className="text-center py-10 text-slate-500">
//             No users found for "{query}"
//           </div>
//         )}

//         {results.map((user) => {
//           // Check if current user is following this user from authStore
//           const currentFollowing = currentUser?.following || [];
//           const isFollowing = currentFollowing.some(id => id === user._id || id.toString() === user._id);
//           return (
//             <Link 
//               key={user._id} 
//               to={`/profile/${user._id}`}
//               className="block bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:shadow-md transition-all"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <Avatar src={user.avatar} alt={user.name} size="lg" />
//                   <div>
//                     <h3 className="font-semibold text-slate-900 dark:text-zinc-100">{user.name}</h3>
//                     <p className="text-sm text-slate-500 dark:text-zinc-400">@{user.username}</p>
//                     {user.bio && (
//                       <p className="text-sm text-slate-600 dark:text-zinc-300 mt-1 line-clamp-1 max-w-xs">
//                         {user.bio}
//                       </p>
//                     )}
//                   </div>
//                 </div>
                
//                 {currentUser?._id !== user._id && (
//                   <div className="flex items-center gap-2">
//                     <button 
//                       onClick={async (e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         try {
//                           const res = await api.post('/chats', { userId: user._id });
//                           navigate(`/chats/${res.data.data._id}`);
//                         } catch (error) {
//                           toast.error('Could not open chat');
//                         }
//                       }}
//                       className="rounded-full p-2 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
//                     >
//                       <MessageSquare className="w-4 h-4" />
//                     </button>

//                     <Button 
//                       variant={isFollowing ? "secondary" : "primary"}
//                       className="rounded-full px-4"
//                       onClick={(e) => handleFollow(e, user._id, isFollowing)}
//                     >
//                       {isFollowing ? (
//                         <>Following <UserMinus className="w-4 h-4 ml-2" /></>
//                       ) : (
//                         <>Follow <UserPlus className="w-4 h-4 ml-2" /></>
//                       )}
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Search;

// basic search page 

import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, MapPin, UserPlus, UserMinus, MessageSquare, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import api from '../lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { clsx } from 'clsx';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser, updateUser } = useAuthStore();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 2) {
        fetchUsers();
        setSearchParams({ q: query });
      } else {
        setResults([]);
        if (query === '') setSearchParams({});
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/search?q=${query}`);
      setResults(res.data.data);
    } catch (error) {
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (e, userId, isCurrentlyFollowing) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic UI Update
    setResults(prev => prev.map(u => {
      if (u._id === userId) {
        const currentFollowers = u.followers || [];
        return {
          ...u,
          followers: isCurrentlyFollowing 
            ? currentFollowers.filter(id => id !== currentUser._id) 
            : [...currentFollowers, currentUser._id]
        };
      }
      return u;
    }));

    try {
      await api.post(`/users/follow/${userId}`);
      const currentFollowing = currentUser.following || [];
      const updatedFollowing = isCurrentlyFollowing 
        ? currentFollowing.filter(id => id !== userId)
        : [...currentFollowing, userId];
      
      updateUser({ following: updatedFollowing });
      toast.success(isCurrentlyFollowing ? 'Removed from following' : 'Following successfully');
    } catch (error) {
      toast.error('Action failed');
      fetchUsers(); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 px-4 min-h-screen">
      
      {/* Dynamic Header */}
      <div className="sticky top-0 bg-slate-50/80 dark:bg-zinc-950/80 backdrop-blur-xl z-20 py-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-4xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, username or bio..."
            className="w-full bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-4xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-xl shadow-slate-200/50 dark:shadow-none transition-all text-lg font-medium placeholder:text-slate-400"
            autoFocus
          />
        </div>
      </div>

      {/* Content States */}
      <div className="mt-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="mt-4 text-sm font-bold text-slate-400 uppercase tracking-widest">Scanning NetVerse...</p>
          </div>
        )}
        
        {/* Default State: Trending / Suggestions */}
        {!loading && query.length <= 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-6 px-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Trending Discoveries</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Designers', 'Developers', 'Writers', 'Gamers'].map((tag) => (
                <button 
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 rounded-4xl border border-slate-100 dark:border-zinc-800 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all text-left group"
                >
                  <div>
                    <p className="font-black text-slate-900 dark:text-zinc-100">{tag}</p>
                    <p className="text-xs text-slate-500">Discover top {tag.toLowerCase()}</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Results List */}
        {!loading && query.length > 2 && (
          <div className="space-y-3">
            {results.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 font-medium">No explorers found for "{query}"</p>
              </div>
            ) : (
              results.map((user) => {
                const isFollowing = currentUser?.following?.includes(user._id);
                
                return (
                  <div 
                    key={user._id}
                    className="group relative flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300"
                  >
                    <Link to={`/profile/${user._id}`} className="shrink-0 relative">
                      <Avatar src={user.avatar} alt={user.name} size="xl" className="w-16 h-16 rounded-3xl group-hover:scale-105 transition-transform duration-300" />
                      {user.isOnline && (
                         <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white dark:border-zinc-900 rounded-full" />
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/profile/${user._id}`} className="flex items-center gap-1 group/name">
                        <h3 className="font-black text-slate-900 dark:text-zinc-100 truncate group-hover/name:text-indigo-500 transition-colors">
                          {user.name}
                        </h3>
                        {user.isVerified && <ShieldCheck className="w-4 h-4 text-indigo-500" />}
                      </Link>
                      <p className="text-xs font-bold text-slate-400 tracking-wide mb-1">@{user.username}</p>
                      <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-1">
                        {user.bio || "Searching for connections..."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pr-2">
                      <button 
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            const res = await api.post('/chats', { userId: user._id });
                            navigate(`/chats/${res.data.data._id}`);
                          } catch (error) { toast.error('Chat failed'); }
                        }}
                        className="p-3 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 transition-all"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>

                      <Button 
                        variant={isFollowing ? "secondary" : "primary"}
                        className={clsx(
                          "rounded-2xl px-6 h-11 font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg",
                          isFollowing ? "shadow-slate-200/50 dark:shadow-none" : "shadow-indigo-500/25"
                        )}
                        onClick={(e) => handleFollow(e, user._id, isFollowing)}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;