import React, { useState } from 'react';
import { Image, Smile } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import api from '../../lib/api';

// Destructure onPostCreated from props
const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // API Call to create post
      await api.post('/posts', { content });
      
      toast.success('Post created successfully!');
      setContent('');
      
      // Refresh the feed in the parent component
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-zinc-800 mb-6">
      <div className="flex gap-4">
        <Avatar 
          src="https://i.pravatar.cc/150?img=32" 
          alt="Current User" 
          className="ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-zinc-100 placeholder-slate-400 resize-none min-h-[60px] text-lg"
            rows={2}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
        <div className="flex gap-2">
          <Button variant="ghost" className="text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">
            <Image className="w-5 h-5 mr-2" />
            Photo
          </Button>
          <Button variant="ghost" className="text-slate-500 hover:text-yellow-600 dark:text-zinc-400 dark:hover:text-yellow-400">
            <Smile className="w-5 h-5 mr-2" />
            Feeling
          </Button>
        </div>
        <Button 
          onClick={handlePost} 
          disabled={!content.trim() || isSubmitting}
          className="px-6"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;