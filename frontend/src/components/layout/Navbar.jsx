import React from 'react';
import { Search, Bell, MessageCircleHeartIcon, Moon, Sun, LogOut } from 'lucide-react'; // Icons library
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from '../ui/Avatar.jsx';
import { useThemeStore } from '../../store/themeStore';
import { Button } from '../ui/Button.jsx';
import { useAuthStore } from '../../store/authStore';

export const Navbar = ({}) => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { user: currentUser, logout } = useAuthStore(); // Get current user and logout from authStore
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const isProfilePage = location.pathname.startsWith('/profile');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // header stays at the top even when scrolling
    // backdrop-blur-md gives a frosted glass effect (glassmorphism)
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-50/80 dark:bg-zinc-950/80 border-b border-slate-200 dark:border-zinc-800 h-16 px-4 flex items-center justify-between">
      {/* Mobile Logo, hidden on desktop */}
      <div className="flex items-center gap-3 md:hidden">
        <h1 className="text-xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Netverse
        </h1>
      </div>

      {/* Desktop Search - clicking navigates to search page - hidden on search page */}
      {!isSearchPage && (
        <div 
          className="hidden md:flex flex-1 max-w-xl mx-4 relative cursor-pointer"
          onClick={() => navigate('/search')}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <div
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-slate-400 dark:text-zinc-500 hover:border-indigo-500 transition-all"
          >
            Search Netverse...
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className={`flex items-center gap-1  ${isSearchPage ? 'md:ml-auto' : ''}`}>
        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          aria-label="Toggle dark mode"
          className="px-2 rounded-full"
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-indigo-400" />
          ) : (
            <Sun className="w-5 h-5 text-orange-500" />
          )}
        </Button>

        <Link to="notifications" className="rounded-full">
            <Button className="px-2" variant="ghost">
              <Bell className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
            </Button>
        </Link>

        {isProfilePage ? (
          <Button 
            className="md:hidden px-2" 
            variant="ghost"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 text-red-500" />
          </Button>
        ) : (
          <Link
            to="/chats"
            className="md:hidden rounded-full"
          >
            <Button className="px-2" variant="ghost">
              <MessageCircleHeartIcon className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
            </Button>
          </Link>
        )}
        <Avatar
          src={currentUser?.avatar}
          alt={currentUser?.name || 'User'}
          className="ml-3 hidden md:block cursor-pointer ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950"
        />
      </div>
    </header>
  );
};