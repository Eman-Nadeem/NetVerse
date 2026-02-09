// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom'; // Using Link for future-proofing, works without Router for now if handled carefully
// import { Home, Compass, MessageSquare, User, Settings, LogOut, Search } from 'lucide-react';
// import { clsx } from 'clsx';
// import { useAuthStore } from '../../store/authStore';
// import { useChatStore } from '../../store/chatStore';
// import { toast } from 'sonner';

// const navItems = [
//   { icon: Home, label: 'Feed', path: '/' },
//   { icon: Search, label: 'Search', path: '/search' },
//   { icon: Compass, label: 'Explore', path: '/explore' },
//   { icon: MessageSquare, label: 'Messages', path: '/chats' },
//   { icon: User, label: 'Profile', path: '/profile' },
// ];

// export const Sidebar = ({ isOpen, onClose }) => {
//   const logout = useAuthStore((state) => state.logout);
//   const unreadChatsCount = useChatStore((state) => state.unreadChatsCount);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     toast.success('Logged out successfully');
//     navigate('/login');
//   };

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div // Overlay for mobile
//           className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
//           onClick={onClose}
//         />
//       )}

//       {/* Sidebar Content */}
//       <aside className={clsx(
//         "fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out",
//         isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//       )}>
//         <div className="p-6 flex items-center gap-2">
//           <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
//             NetVerse
//           </h1>
//         </div>

//         <nav className="flex-1 px-4 space-y-1">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const showBadge = item.path === '/chats' && unreadChatsCount > 0;
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 onClick={onClose}
//                 className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 relative"
//               >
//                 <Icon className="w-5 h-5" />
//                 <span>{item.label}</span>
//                 {showBadge && (
//                   <span className="absolute right-4 bg-red-500 text-white text-[10px] font-bold min-w-4.5 h-4.5 flex items-center justify-center rounded-full">
//                     {unreadChatsCount > 9 ? '9+' : unreadChatsCount}
//                   </span>
//                 )}
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t border-slate-200 dark:border-zinc-800 space-y-1">
//             <Link to="/settings" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
//               <Settings className="w-5 h-5" />
//               <span>Settings</span>
//             </Link>
//             <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
//                 <LogOut className="w-5 h-5" />
//                 <span>Logout</span>
//             </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// basic sidebar 

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, MessageSquare, User, Settings, LogOut, Search, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { toast } from 'sonner';

const navItems = [
  { icon: Home, label: 'Feed', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: MessageSquare, label: 'Messages', path: '/chats' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const logout = useAuthStore((state) => state.logout);
  const unreadChatsCount = useChatStore((state) => state.unreadChatsCount);
  const navigate = useNavigate();
  const location = useLocation(); // To check which link is active

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-md transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={clsx(
        "fixed md:sticky top-0 left-0 z-50 h-dvh w-72 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col transition-all duration-500 ease-in-out shadow-2xl md:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        
        {/* Modernized Logo Section */}
        <div className="p-8">
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-tr from-indigo-600 to-purple-500 rounded-xl blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-10 w-10 bg-linear-to-tr from-indigo-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Sparkles className="text-white w-6 h-6" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                NETVERSE
              </span>
              <span className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase">
                Community
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const showBadge = item.path === '/chats' && unreadChatsCount > 0;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={clsx(
                  "group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                  isActive 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10" 
                    : "text-slate-500 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100"
                )}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 dark:bg-indigo-500 rounded-r-full" />
                )}

                <Icon className={clsx(
                  "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-indigo-600 dark:text-indigo-400" : ""
                )} />
                
                <span className="font-bold text-sm tracking-wide">{item.label}</span>

                {showBadge && (
                  <span className="ml-auto bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-lg shadow-indigo-500/40">
                    {unreadChatsCount > 9 ? '9+' : unreadChatsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: User Actions */}
        <div className="p-4 mt-auto">
          <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-4xl p-2 space-y-1 border border-slate-100 dark:border-zinc-800/50">
            <Link 
              to="/settings" 
              onClick={onClose} 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 shadow-xs hover:shadow-md"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-bold">Settings</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 group"
            >
              <div className="bg-red-100 dark:bg-red-500/10 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold">Sign Out</span>
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};