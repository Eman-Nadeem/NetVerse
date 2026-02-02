import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  // 1. Initial State: Check LocalStorage or default to 'light'
  theme: localStorage.getItem('theme') || 'light',

  // 2. Action: Toggle between Light and Dark
  toggleTheme: () => {
    const currentTheme = useThemeStore.getState().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Update State
    set({ theme: newTheme });
    
    // Save to LocalStorage
    localStorage.setItem('theme', newTheme);
    
    // Apply class to document (Tailwind requirement)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // 3. Action: Initialize on App Load
  // This ensures the correct theme is applied immediately when the user refreshes
  initializeTheme: () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    set({ theme: savedTheme });
  },
}));