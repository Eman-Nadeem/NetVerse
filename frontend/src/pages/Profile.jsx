import React from 'react';

const Profile = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">👤</span>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-2">User Profile</h2>
      <p className="text-slate-500 dark:text-zinc-400 max-w-md">
        The detailed profile page and settings will be built in Phase 6.
      </p>
    </div>
  );
};

export default Profile;