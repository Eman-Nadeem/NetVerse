// import React from 'react';
// import { Search, Bell, MessageCircleHeartIcon, Moon, Sun, LogOut } from 'lucide-react'; // Icons library
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Avatar } from '../ui/Avatar.jsx';
// import { useThemeStore } from '../../store/themeStore';
// import { Button } from '../ui/Button.jsx';
// import { useAuthStore } from '../../store/authStore';
// import { useChatStore } from '../../store/chatStore';
// import { useNotificationStore } from '../../store/notificationStore';

// export const Navbar = ({}) => {
//   const theme = useThemeStore((state) => state.theme);
//   const toggleTheme = useThemeStore((state) => state.toggleTheme);
//   const { user: currentUser, logout } = useAuthStore(); // Get current user and logout from authStore
//   const unreadChatsCount = useChatStore((state) => state.unreadChatsCount);
//   const unreadNotifCount = useNotificationStore((state) => 
//     state.notifications.filter(n => !n.isRead && n.type !== 'message').length
//   );
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isSearchPage = location.pathname === '/search';
//   const isProfilePage = location.pathname.startsWith('/profile');

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     // header stays at the top even when scrolling
//     // backdrop-blur-md gives a frosted glass effect (glassmorphism)
//     <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-50/80 dark:bg-zinc-950/80 border-b border-slate-200 dark:border-zinc-800 h-16 px-4 flex items-center justify-between">
//       {/* Mobile Logo, hidden on desktop */}
//       <div className="flex items-center gap-3 md:hidden">
//         <h1 className="text-xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//           Netverse
//         </h1>
//       </div>

//       {/* Desktop Search - clicking navigates to search page - hidden on search page */}
//       {!isSearchPage && (
//         <div 
//           className="hidden md:flex flex-1 max-w-xl mx-4 relative cursor-pointer"
//           onClick={() => navigate('/search')}
//         >
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
//           <div
//             className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-slate-400 dark:text-zinc-500 hover:border-indigo-500 transition-all"
//           >
//             Search Netverse...
//           </div>
//         </div>
//       )}

//       {/* Right Actions */}
//       <div className={`flex items-center gap-1  ${isSearchPage ? 'md:ml-auto' : ''}`}>
//         {/* Dark mode toggle */}
//         <Button
//           variant="ghost"
//           aria-label="Toggle dark mode"
//           className="px-2 rounded-full"
//           onClick={toggleTheme}
//         >
//           {theme === 'light' ? (
//             <Moon className="w-5 h-5 text-indigo-400" />
//           ) : (
//             <Sun className="w-5 h-5 text-orange-500" />
//           )}
//         </Button>

//         <Link to="notifications" className="rounded-full relative">
//             <Button className="px-2" variant="ghost">
//               <Bell className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
//             </Button>
//             {unreadNotifCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-4.5 h-4.5 flex items-center justify-center rounded-full">
//                 {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
//               </span>
//             )}
//         </Link>

//         {isProfilePage ? (
//           <Button 
//             className="md:hidden px-2" 
//             variant="ghost"
//             onClick={handleLogout}
//           >
//             <LogOut className="w-5 h-5 text-red-500" />
//           </Button>
//         ) : (
//           <Link
//             to="/chats"
//             className="md:hidden rounded-full relative"
//           >
//             <Button className="px-2" variant="ghost">
//               <MessageCircleHeartIcon className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
//             </Button>
//             {unreadChatsCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-4.5 h-4.5 flex items-center justify-center rounded-full">
//                 {unreadChatsCount > 9 ? '9+' : unreadChatsCount}
//               </span>
//             )}
//           </Link>
//         )}
//         <Avatar
//           src={currentUser?.avatar}
//           alt={currentUser?.name || 'User'}
//           className="ml-3 hidden md:block cursor-pointer ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950"
//         />
//       </div>
//     </header>
//   );
// };

// basic navbar

import React from 'react';
import { Search, Bell, MessageCircle, Moon, Sun, LogOut, Sparkles } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from '../ui/Avatar.jsx';
import { useThemeStore } from '../../store/themeStore';
import { Button } from '../ui/Button.jsx';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { useNotificationStore } from '../../store/notificationStore';
import { clsx } from 'clsx';

export const Navbar = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { user: currentUser, logout } = useAuthStore();
  const unreadChatsCount = useChatStore((state) => state.unreadChatsCount);
  const notifications = useNotificationStore((state) => state.notifications);
  
  const unreadNotifCount = notifications.filter(n => !n.isRead && n.type !== 'message').length;
  
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-zinc-800/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between gap-4">
        
        {/* Mobile Logo: Clean & Compact */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="h-8 w-8 bg-linear-to-tr from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-black tracking-tighter dark:text-white">NV</span>
        </div>

        {/* Search Bar: Expanding Pill Design */}
        {!isSearchPage && (
          <div 
            className="hidden md:flex flex-1 max-w-md relative group cursor-pointer"
            onClick={() => navigate('/search')}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 w-4 h-4 transition-colors" />
            <div className="w-full bg-slate-100 dark:bg-zinc-900/50 border border-transparent group-hover:border-indigo-500/50 group-hover:bg-white dark:group-hover:bg-zinc-900 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-slate-500 font-medium transition-all duration-300">
              Search the universe...
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-hover:block transition-all">
              <span className="text-[10px] font-bold bg-slate-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-slate-500 uppercase tracking-widest">⌘K</span>
            </div>
          </div>
        )}

        {/* Action Center */}
        <div className={clsx("flex items-center gap-2", isSearchPage && "md:ml-auto")}>
          
          {/* Theme Toggle with Animation */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all relative group overflow-hidden active:scale-90"
          >
            <div className="relative z-10">
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-600 group-hover:text-indigo-500 transition-colors" />
              ) : (
                <Sun className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors" />
              )}
            </div>
            <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Notifications Badge */}
          <Link to="/notifications" className="relative group">
            <div className="p-2.5 rounded-2xl group-hover:bg-slate-100 dark:group-hover:bg-zinc-900 transition-all active:scale-95">
              <Bell className="w-5 h-5 text-slate-600 dark:text-zinc-400 group-hover:text-indigo-500" />
            </div>
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-0.5 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-black text-white items-center justify-center">
                  {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              </span>
            )}
          </Link>

          {/* Messages (Mobile Only) */}
          <Link to="/chats" className="md:hidden relative group">
            <div className="p-2.5 rounded-2xl group-hover:bg-slate-100 dark:group-hover:bg-zinc-900 transition-all">
              <MessageCircle className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
            </div>
            {unreadChatsCount > 0 && (
              <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[9px] font-black min-w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950">
                {unreadChatsCount}
              </span>
            )}
          </Link>

          {/* User Profile / Menu */}
          <div className="flex items-center gap-3 ml-2 pl-2 border-l border-slate-200 dark:border-zinc-800">
            <Link to={`/profile/${currentUser?._id}`} className="hidden md:block">
              <Avatar
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-9 h-9 rounded-xl ring-2 ring-transparent hover:ring-indigo-500 transition-all cursor-pointer"
              />
            </Link>
            
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all md:block hidden"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};