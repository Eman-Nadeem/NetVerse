import React from 'react';
import { clsx } from 'clsx';

//clsx is a utility for constructing className strings conditionally
// It helps in combining multiple class names based on certain conditions

export const Button = ({ children, variant = 'primary', className, ...props }) => {
    // Define base styles common to all button variants, like padding, border-radius, font weight, and transition effects
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer';
  
  // Define styles for different button variants
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100',
    ghost: 'hover:bg-slate-200 text-slate-700 dark:hover:bg-zinc-800 dark:text-zinc-300', // No background by default, only on hover
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm', // Red background for danger actions
  };

  return (
    // Render a button element with combined class names based on the variant and any additional class names passed via props (onClick, disabled, etc.)
    <button className={clsx(baseStyles, variants[variant], className)} {...props}> 
      {children}
    </button>
    //children could be text or icons passed to the button component
  );
};