import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, User, MapPin, Link as LinkIcon, UserPlus, UserMinus } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import api from '../lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuthStore(); // To check if we are already following

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Debounce Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2) {
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
      console.error('Search error:', error);
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  // Handle Follow/Unfollow in Search Results
  const handleFollow = async (e, userId, isCurrentlyFollowing) => {
    e.preventDefault(); // Prevent navigation to profile
    e.stopPropagation();
    
    // Optimistic UI Update
    setResults(prev => prev.map(u => {
      if (u._id === userId) {
        return {
          ...u,
          followers: isCurrentlyFollowing 
            ? u.followers.filter(id => id !== currentUser._id) 
            : [...u.followers, currentUser._id]
        };
      }
      return u;
    }));

    try {
      await api.post(`/users/follow/${userId}`);
      toast.success(isCurrentlyFollowing ? 'Unfollowed' : 'Following');
    } catch (error) {
      toast.error('Action failed');
      // Revert on error (simplified for now)
      fetchUsers(); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-fade-in">
      {/* Search Header */}
      <div className="sticky top-0 bg-slate-50/90 dark:bg-zinc-950/90 backdrop-blur-md z-10 py-4 px-2">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name or username..."
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-4 space-y-3">
        {loading && <div className="text-center text-slate-500 py-4">Searching...</div>}
        
        {!loading && query.length <= 2 && (
          <div className="text-center py-16">
            <SearchIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-zinc-300 mb-2">Discover People</h3>
            <p className="text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
              Search for users by name or username to connect with friends and discover new people.
            </p>
          </div>
        )}
        
        {!loading && query.length > 2 && results.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No users found for "{query}"
          </div>
        )}

        {results.map((user) => {
          const isFollowing = user.followers?.includes(currentUser?._id);
          return (
            <Link 
              key={user._id} 
              to={`/profile/${user._id}`}
              className="block bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar} alt={user.name} size="lg" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-zinc-100">{user.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">@{user.username}</p>
                    {user.bio && (
                      <p className="text-sm text-slate-600 dark:text-zinc-300 mt-1 line-clamp-1 max-w-xs">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant={isFollowing ? "secondary" : "primary"}
                  className="rounded-full px-4"
                  onClick={(e) => handleFollow(e, user._id, isFollowing)}
                >
                  {isFollowing ? (
                    <>Following <UserMinus className="w-4 h-4 ml-2" /></>
                  ) : (
                    <>Follow <UserPlus className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Search;