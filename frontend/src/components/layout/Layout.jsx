import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomBar } from './BottomBar';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

export const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { initializeTheme } = useThemeStore();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Initialize theme on mount , e.g., set dark or light mode based on user preference
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen"> 
            {/* account for sidebar width on desktop w-64 */}
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          <main className="flex-1 max-w-3xl w-full mx-auto p-4 pb-24 md:pb-8">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Mobile Bottom Nav */}
      <BottomBar />
    </div>
  );
};