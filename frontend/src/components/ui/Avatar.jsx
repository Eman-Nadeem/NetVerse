import React from 'react';
import { clsx } from 'clsx';

export const Avatar = ({ src, alt, className, size = 'md' }) => {
    // Define size styles for different avatar sizes
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-20 h-20 text-xl',
    xl: 'w-36 h-36 text-4xl',
  };

  return (
    <div className={clsx('relative rounded-full overflow-hidden bg-slate-200 dark:bg-zinc-800 shrink-0', sizeStyles[size], className)}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" /> // Display the image if src is provided
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
          {alt?.charAt(0).toUpperCase()}
        </div> // Fallback to initials if no image, using the first character of alt text
      )}
    </div>
  );
};