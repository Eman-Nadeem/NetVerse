import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import api from '../../lib/api';

const CreateStoryModal = ({ isOpen, onClose, onStoryCreated }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image or video');

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('media', file);
    formData.append('caption', caption);

    try {
      await api.post('/stories', formData);
      toast.success('Story posted!');
      onStoryCreated();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload story');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setCaption('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Add to Story</h2>
          <button onClick={handleClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Upload Area */}
          {!preview ? (
            <div 
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <ImageIcon className="w-12 h-12 text-slate-400 mb-2" />
              <p className="text-slate-600 dark:text-zinc-400 font-medium">Tap to add photo or video</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*,video/*" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden h-64 bg-black mb-4">
              {file.type.startsWith('video') ? (
                <video src={preview} controls className="w-full h-full object-contain" />
              ) : (
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              )}
              <button 
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Caption Input */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-3 text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-24 mb-4"
            maxLength={500}
          />

          <Button 
            onClick={handleSubmit} 
            disabled={!file || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sharing...</> : 'Share to Story'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;