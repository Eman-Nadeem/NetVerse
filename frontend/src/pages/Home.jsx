import React from 'react';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';

// Mock Data matching your NetVerse api model (Post.js)
const MOCK_POSTS = [
  {
    _id: '1',
    content: 'Just deployed the Netverse backend! 🚀 It uses Node.js, Express, and MongoDB. The real-time chat feature is working perfectly with Socket.IO. #coding #webdev',
    author: { 
      _id: '101', 
      name: 'Eman Nadeem', 
      username: 'eman', 
      avatar: 'https://i.pravatar.cc/150?img=32' 
    },
    images: [],
    likes: ['102', '103', '104'],
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
  },
  {
    _id: '2',
    content: 'Beautiful sunset today! 🌅 Nature is amazing.',
    author: { 
      _id: '102', 
      name: 'Jane Doe', 
      username: 'jane', 
      avatar: 'https://i.pravatar.cc/150?img=5' 
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', publicId: 'sunset1' },
      { url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80', publicId: 'sunset2' },
      { url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80', publicId: 'sunset3' }
    ],
    likes: ['101'],
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    _id: '3',
    content: 'Working on the new frontend design. Glassmorphism is tricky but looks so clean.',
    author: { 
      _id: '103', 
      name: 'Alex Smith', 
      username: 'alex', 
      avatar: 'https://i.pravatar.cc/150?img=11' 
    },
    images: [],
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  }
];

const Home = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Create Post Input */}
      <CreatePost />

      {/* Feed Stream */}
      <div>
        {MOCK_POSTS.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      
      {/* End of feed indicator */}
      <div className="text-center py-8 text-slate-400 dark:text-zinc-600 text-sm">
        You're all caught up!
      </div>
    </div>
  );
};

export default Home;