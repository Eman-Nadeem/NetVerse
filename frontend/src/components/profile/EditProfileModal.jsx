import React, { useState, useRef } from 'react';
import { X, Camera, Loader2, Lock, Globe } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import api from '../../lib/api';
import { toast } from 'sonner';

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    accountType: user.accountType || 'public',
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updatedUser = { ...user };

      // Upload avatar if changed
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('image', avatarFile);
        const avatarRes = await api.post('/users/profile/avatar', avatarFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        updatedUser = avatarRes.data.data;
      }

      // Update profile data - only send non-empty fields
      const profilePayload = {};
      if (formData.name) profilePayload.name = formData.name;
      if (formData.username) profilePayload.username = formData.username;
      if (formData.bio !== undefined) profilePayload.bio = formData.bio;
      if (formData.location !== undefined) profilePayload.location = formData.location;
      if (formData.website) profilePayload.website = formData.website; // Only send if not empty
      profilePayload.accountType = formData.accountType;
      
      const profileRes = await api.put('/users/profile', profilePayload);
      updatedUser = { ...updatedUser, ...profileRes.data.data };

      toast.success('Profile updated successfully');
      onUpdate(updatedUser);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar 
                src={avatarPreview} 
                alt={formData.name}
                className="w-28 h-28 rounded-3xl ring-4 ring-slate-100 dark:ring-zinc-800"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-slate-500">Click to change avatar</p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-zinc-400">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              maxLength={50}
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-zinc-400">Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">@</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username"
                className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                maxLength={20}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-zinc-400">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell the world about yourself..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              maxLength={500}
            />
            <p className="text-xs text-slate-400 text-right">{formData.bio.length}/500</p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-zinc-400">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Where are you based?"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-zinc-400">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600 dark:text-zinc-400">Account Privacy</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, accountType: 'public' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                  formData.accountType === 'public'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600'
                    : 'border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-600'
                }`}
              >
                <Globe className="w-5 h-5" />
                <span className="font-semibold">Public</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, accountType: 'private' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                  formData.accountType === 'private'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600'
                    : 'border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-600'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span className="font-semibold">Private</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              {formData.accountType === 'private' 
                ? 'Only approved followers can see your posts and stories' 
                : 'Anyone can see your posts and stories'}
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl py-4 font-black text-sm uppercase tracking-widest"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
