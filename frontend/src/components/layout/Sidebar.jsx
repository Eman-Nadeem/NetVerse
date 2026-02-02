import React from 'react';
import { Link } from 'react-router-dom'; // Using Link for future-proofing, works without Router for now if handled carefully
import { Home, Compass, MessageSquare, User, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { icon: Home, label: 'Feed', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: MessageSquare, label: 'Messages', path: '/chats' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div // Overlay for mobile
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={clsx(
        "fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            NetVerse
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-zinc-800 space-y-1">
            <Link to="/settings" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
            </button>
        </div>
      </aside>
    </>
  );
};