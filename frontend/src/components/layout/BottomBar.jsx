import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, Search, User, Plus } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { icon: Home, label: 'Feed', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Plus, label: 'Create', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const BottomBar = () => {
  return (
    // Mobile bottom navigation bar, hidden on desktop
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-zinc-800 z-40 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isCreate = item.label === 'Create';
          
          return (
            <Link
              key={item.label}
              to={item.path}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full transition-colors text-slate-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              )}
            >
              <div className={clsx(
                "flex items-center justify-center rounded-full transition-all",
                isCreate ? "bg-indigo-600 text-white p-2 -mt-6 shadow-lg border-4 border-slate-50 dark:border-zinc-950" : ""
              )}>
                {/* create a larger icon for the Create button */}  
                 <Icon className={clsx("w-6 h-6", isCreate ? "w-7 h-7" : "")} />
              </div> 
              {/* Display label only for non-Create items */}   
              {!isCreate && <span className="text-[10px] mt-1 font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};