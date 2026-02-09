// 

import React, { useState, useRef } from 'react';
import { Image, Smile, X, Loader2, Send, MapPin, Sparkles } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { clsx } from 'clsx';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const fileInputRef = useRef(null);
  const currentUser = useAuthStore((state) => state.user);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!content.trim() && selectedImages.length === 0) {
      toast.error('Add some content or an image');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      selectedImages.forEach(file => formData.append('images', file));
      
      await api.post('/posts', formData);
      
      toast.success('Shared with the world!');
      setContent('');
      setSelectedImages([]);
      setImagePreviews([]);
      setIsFocused(false);
      if (onPostCreated) onPostCreated();
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={clsx(
      "bg-white dark:bg-zinc-900/70 dark:backdrop-blur-xl rounded-4xl p-5 mb-8 border transition-all duration-500",
      isFocused 
        ? "border-indigo-500/50 shadow-2xl shadow-indigo-500/10" 
        : "border-slate-200/60 dark:border-zinc-800/60 shadow-sm"
    )}>
      <div className="flex gap-4">
        <div className="relative">
          <Avatar 
            src={currentUser?.avatar} 
            alt={currentUser?.name} 
            className="w-12 h-12 rounded-2xl ring-2 ring-indigo-500/20"
          />
          <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-0.5 border-2 border-white dark:border-zinc-900">
            <Sparkles className="w-2.5 h-2.5" />
          </div>
        </div>
        
        <div className="flex-1 pt-2">
          <textarea
            value={content}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's up, ${currentUser?.name?.split(' ')[0]}?`}
            className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 resize-none min-h-12.5 text-lg font-medium tracking-tight"
            rows={isFocused ? 4 : 1}
          />
        </div>
      </div>

      {/* Image Preview Grid - Modern Mosaic */}
      {imagePreviews.length > 0 && (
        <div className={clsx(
          "mt-4 grid gap-2 mb-4",
          imagePreviews.length === 1 ? "grid-cols-1" : "grid-cols-2"
        )}>
          {imagePreviews.map((src, index) => (
            <div key={index} className="relative group aspect-16/10 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-inner bg-slate-100 dark:bg-zinc-800">
              <img src={src} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-3 right-3 bg-black/40 backdrop-blur-md hover:bg-red-500 text-white rounded-xl p-1.5 transition-all shadow-lg active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className={clsx(
        "flex items-center justify-between pt-4 border-t transition-all duration-500",
        isFocused ? "border-slate-100 dark:border-zinc-800" : "border-transparent"
      )}>
        <div className="flex gap-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="hidden"
          />

          <button 
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <Image className="w-5 h-5" />
            <span className="hidden sm:inline">Photo</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all font-bold text-xs uppercase tracking-widest">
            <Smile className="w-5 h-5" />
            <span className="hidden sm:inline">Vibe</span>
          </button>

          {isFocused && (
             <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-all font-bold text-xs uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
                <MapPin className="w-5 h-5" />
                <span className="hidden sm:inline">Location</span>
             </button>
          )}
        </div>

        <Button 
          onClick={handlePost} 
          disabled={(!content.trim() && selectedImages.length === 0) || isSubmitting}
          className="rounded-2xl px-8 h-11 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
               Publish <Send className="w-3.5 h-3.5" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;