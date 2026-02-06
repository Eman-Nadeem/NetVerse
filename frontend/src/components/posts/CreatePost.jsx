import React, { useState, useRef } from 'react';
import { Image, Smile, X, Loader2 } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import api from '../../lib/api';

// Destructure onPostCreated from props
const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]); // Array of File objects
  const [imagePreviews, setImagePreviews] = useState([]);   // Array of URLs
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 4) {
      toast.error('You can only upload up to 4 images');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setSelectedImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // Remove an image from selection
  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!content.trim() && selectedImages.length === 0) {
      toast.error('Please add text or an image');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // We must use FormData for file uploads
      const formData = new FormData();
      formData.append('content', content);
      // Append each image file with the key 'images' (matches backend multer field)
      selectedImages.forEach(file => {
        formData.append('images', file);
      });
      // Note: Axios automatically sets Content-Type for FormData
      await api.post('/posts', formData);
      
      toast.success('Post created successfully!');
      setContent('');
      setSelectedImages([]);
      setImagePreviews([]);
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

      {/* Image Preview Grid */}
      {imagePreviews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 mb-2">
          {imagePreviews.map((src, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-700">
              <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
        <div className="flex gap-2">
          {/* Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="hidden"
          />

          <Button 
            variant="ghost" 
            className="text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            onClick={() => fileInputRef.current.click()}
          >
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
          disabled={!content.trim() && selectedImages.length === 0 || isSubmitting}
          className="px-6"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Posting...
            </>
          ) : (
            'Post'
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;