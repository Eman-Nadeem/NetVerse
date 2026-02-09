// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { MapPin, Link as LinkIcon, Calendar, Settings, Edit3, UserPlus, UserMinus, MessageSquare } from 'lucide-react';
// import { Avatar } from '../components/ui/Avatar';
// import { Button } from '../components/ui/Button';
// import PostCard from '../components/posts/PostCard';
// import api from '../lib/api';
// import { toast } from 'sonner';
// import { useAuthStore } from '../store/authStore';

// const Profile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user: currentUser } = useAuthStore();
  
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [selectedTab, setSelectedTab] = useState('posts');
//   const [loading, setLoading] = useState(true);
//   const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
//   const [isFollowing, setIsFollowing] = useState(false);

//   const isMyProfile = !id || id === currentUser?._id;

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       setLoading(true);
//       try {
//         // Fetch User: Use ID from URL if present, else 'me'
//         const userRes = await api.get(isMyProfile ? '/auth/me' : `/users/profile/${id}`);
//         const userData = userRes.data.data;
        
//         setUser(userData);
//         setIsFollowing(userData.isFollowing || false);

//         // Fetch User's Posts
//         const postsRes = await api.get(`/users/${userData._id}/posts`);
//         setPosts(postsRes.data.data);

//       } catch (error) {
//         console.error("Failed to load profile", error);
//         if(error.response?.status === 404) toast.error('User not found');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileData();
//   }, [id, isMyProfile]);

//   const handleFollow = async () => {
//     if (!user) return;
//     try {
//       const res = await api.post(`/users/follow/${user._id}`);
//       const data = res.data.data;
      
//       setIsFollowing(data.isFollowing);
      
//       // Update follower count locally for instant feedback
//       setUser(prev => ({
//         ...prev,
//         followersCount: prev.followersCount + (data.isFollowing ? 1 : -1)
//       }));

//       toast.success(data.isFollowing ? 'Followed successfully' : 'Unfollowed');
//     } catch (error) {
//       toast.error('Action failed');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto pb-10 space-y-6">
//         <div className="h-64 bg-slate-200 dark:bg-zinc-800 rounded-b-3xl animate-pulse" />
//         <div className="px-6 -mt-12 flex justify-between items-end">
//            <div className="w-32 h-32 bg-slate-300 dark:bg-zinc-700 rounded-full animate-pulse ring-4 ring-slate-50 dark:ring-zinc-950" />
//            <div className="h-10 w-32 bg-slate-200 dark:bg-zinc-800 rounded-full animate-pulse" />
//         </div>
//         <div className="px-6 space-y-4">
//            <div className="h-8 w-1/3 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
//            <div className="h-4 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
//         </div>
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <div className="max-w-4xl mx-auto pb-10">
//       {/* Profile Info Card */}
//       <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden mb-6">
//         <div className="relative">
//           {/* Cover Photo Placeholder */}
//           <div className="h-40 md:h-64 bg-linear-to-tr from-indigo-600 via-purple-500 to-pink-500 rounded-b-3xl" />
          
//           <div className="px-6 flex justify-between items-end -mt-12 md:-mt-16 relative z-10">
//             <Avatar 
//               src={user.avatar} 
//               alt={user.name}
//               size="xl" 
//               className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-slate-50 dark:ring-zinc-950"
//             />
            
//             <div className="flex gap-2 pb-2">
//               {!isMyProfile && (
//                 <>
//                   <Button 
//                     variant="secondary" 
//                     className="rounded-full px-4"
//                     onClick={async () => {
//                       try {
//                         const res = await api.post('/chats', { userId: user._id });
//                         navigate(`/chats/${res.data.data._id}`);
//                       } catch (error) {
//                         toast.error('Could not open chat');
//                       }
//                     }}
//                   >
//                     <MessageSquare className="w-4 h-4" />
//                   </Button>
//                   <Button 
//                     variant={isFollowing ? "secondary" : "primary"} 
//                     className="rounded-full px-6"
//                     onClick={handleFollow}
//                   >
//                     {isFollowing ? (
//                       <>Following <UserMinus className="w-4 h-4 ml-2"/></>
//                     ) : (
//                       <>Follow <UserPlus className="w-4 h-4 ml-2"/></>
//                     )}
//                   </Button>
//                 </>
//               )}
              
//               {isMyProfile && (
//                 <>
//                   <Link to="/settings" className="md:hidden">
//                     <Button variant="secondary" className="rounded-full p-2">
//                       <Settings className="w-5 h-5" />
//                     </Button>
//                   </Link>
//                   <Button variant="primary" className="rounded-full px-6">
//                     <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//         {/* Profile Details */}
//         <div className="px-6 mt-4">
//           <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-zinc-50">
//             {user.name}
//           </h1>
//           <p className="text-indigo-600 dark:text-indigo-400 font-medium">@{user.username}</p>
          
//           <p className="mt-4 text-slate-700 dark:text-zinc-300 whitespace-pre-line max-w-lg leading-relaxed">
//             {user.bio || 'No bio yet.'}
//           </p>

//           <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500 dark:text-zinc-400">
//             <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {user.location || 'Unknown'}</div>
//             <div className="flex items-center gap-1.5">
//               <LinkIcon className="w-4 h-4" /> 
//               {user.website ? (
//                 <a href={user.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{user.website}</a>
//               ) : (
//                 'No website'
//               )}
//             </div>
//             <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {new Date(user.createdAt).toLocaleDateString()}</div>
//           </div>

//           <div className="flex gap-8 mt-8 py-4 border-y border-slate-100 dark:border-zinc-800/50 justify-center">
//             <div className="flex gap-1.5 items-center">
//               <span className="font-bold text-slate-900 dark:text-zinc-100">{posts.length}</span>
//               <span className="text-slate-500 text-sm">Posts</span>
//             </div>

//             {/* Followers Link */}
//             <Link 
//               to={`/profile/${user._id}/followers`} 
//               className="flex gap-1.5 items-center hover:bg-slate-50 dark:hover:bg-zinc-800/50 px-3 py-1 rounded-xl transition-colors"
//             >
//               <span className="font-bold text-slate-900 dark:text-zinc-100">{user.followersCount}</span>
//               <span className="text-slate-500 text-sm">Followers</span>
//             </Link>

//             {/* Following Link */}
//             <Link 
//               to={`/profile/${user._id}/following`} 
//               className="flex gap-1.5 items-center hover:bg-slate-50 dark:hover:bg-zinc-800/50 px-3 py-1 rounded-xl transition-colors"
//             >
//               <span className="font-bold text-slate-900 dark:text-zinc-100">{user.followingCount}</span>
//               <span className="text-slate-500 text-sm">Following</span>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="shadow-sm border border-slate-200 dark:border-zinc-800/50 rounded-2xl bg-white dark:bg-zinc-900 flex w-full border-b">
//         {['posts', 'media', 'likes'].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setSelectedTab(tab)}
//             className={`flex-1 py-4 font-semibold text-sm transition-all relative capitalize ${
//               selectedTab === tab ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
//             }`}
//           >
//             {tab}
//             {selectedTab === tab && (
//               <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3/4 h-1 rounded-full bg-linear-to-r from-indigo-600 via-purple-500 to-pink-500" />
//             )}
//           </button>
//         ))}
//       </div>
//       {/* Tab Content */}
//       <div className="pt-5">
//         {selectedTab === 'posts' && (
//           <div className="flex flex-col gap-4">
//             {posts.map((post) => (
//               <PostCard
//                 key={post._id}
//                 post={post}
//                 currentUserId={currentUser?._id}
//                 showComments={openCommentsPostId === post._id}
//                 onToggleComments={() => setOpenCommentsPostId(openCommentsPostId === post._id ? null : post._id)}
//               />
//             ))}
//             {posts.length === 0 && (
//               <div className="text-center py-10 text-slate-500">No posts yet</div>
//             )}
//           </div>
//         )}
//         {selectedTab !== 'posts' && (
//            <div className="p-8 text-center text-slate-500 dark:text-zinc-400">Feature coming soon!</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;

// basic profile page 

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Link as LinkIcon, Calendar, Settings, Edit3, UserPlus, UserMinus, MessageSquare, ShieldCheck, Sparkles, Lock, Clock } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import PostCard from '../components/posts/PostCard';
import EditProfileModal from '../components/profile/EditProfileModal';
import api from '../lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { clsx } from 'clsx';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isMyProfile = !id || id === currentUser?._id;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const userRes = await api.get(isMyProfile ? '/auth/me' : `/users/profile/${id}`);
        const userData = userRes.data.data;
        setUser(userData);
        setIsFollowing(userData.isFollowing || false);
        setIsRequested(userData.isRequested || false);

        const postsRes = await api.get(`/users/${userData._id}/posts`);
        setPosts(postsRes.data.data);
      } catch (error) {
        if(error.response?.status === 404) toast.error('User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [id, isMyProfile]);

  const handleFollow = async () => {
    if (!user) return;
    try {
      const res = await api.post(`/users/follow/${user._id}`);
      const data = res.data.data;
      setIsFollowing(data.isFollowing);
      setIsRequested(data.isRequested || false);
      
      // Only update follower count if actually following (not just requested)
      if (data.isFollowing) {
        setUser(prev => ({
          ...prev,
          followersCount: prev.followersCount + 1
        }));
        toast.success(`Now following ${user.name}`);
      } else if (data.isRequested) {
        toast.success('Follow request sent');
      } else {
        setUser(prev => ({
          ...prev,
          followersCount: Math.max(0, prev.followersCount - 1)
        }));
        toast.success(`Unfollowed ${user.name}`);
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
    // Update auth store if it's own profile
    if (isMyProfile) {
      useAuthStore.getState().updateUser(updatedUser);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pb-10 space-y-8 animate-pulse px-4">
        <div className="h-48 md:h-64 bg-slate-200 dark:bg-zinc-800 rounded-[2.5rem]" />
        <div className="px-8 -mt-20 flex justify-between items-end">
           <div className="w-32 h-32 bg-slate-300 dark:bg-zinc-700 rounded-3xl ring-8 ring-slate-50 dark:ring-zinc-950" />
        </div>
        <div className="space-y-4 px-4">
          <div className="h-10 w-48 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-4 w-full max-w-md bg-slate-200 dark:bg-zinc-800 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      {/* Profile Header Card */}
      <div className="relative group mb-8">
        {/* Cover Photo with Mesh Gradient */}
        <div className="h-48 md:h-72 bg-linear-to-tr from-indigo-600 via-purple-500 to-pink-500 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-indigo-500/10">
            <div className="absolute inset-0 bg-black/10" />
            <Sparkles className="absolute top-6 right-6 text-white/20 w-12 h-12" />
        </div>
        
        <div className="px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 md:-mt-20 gap-4 relative z-10">
          <div className="relative group/avatar self-center md:self-auto">
            <div className="absolute inset-0 bg-indigo-500/50 rounded-4xl md:rounded-[2.5rem] blur-xl opacity-0 group-hover/avatar:opacity-70 transition-opacity duration-500" />
            <Avatar 
              src={user.avatar} 
              alt={user.name}
              className="relative w-32 h-32 md:w-44 md:h-44 rounded-4xl md:rounded-[2.5rem] ring-[6px] md:ring-10 ring-slate-50 dark:ring-zinc-950 shadow-2xl transition-all duration-500 group-hover/avatar:scale-[1.02]"
            />
            {user.isOnline && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-zinc-950 rounded-full shadow-lg" />
            )}
          </div>
          
          <div className="flex gap-3 mb-2 w-full md:w-auto justify-center md:justify-end">
            {!isMyProfile ? (
              <>
                <button 
                  onClick={async () => {
                    try {
                      const res = await api.post('/chats', { userId: user._id });
                      navigate(`/chats/${res.data.data._id}`);
                    } catch (error) { toast.error('Could not open chat'); }
                  }}
                  className="p-4 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-zinc-800"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <Button 
                  variant={isFollowing ? "secondary" : isRequested ? "secondary" : "primary"} 
                  className="rounded-2xl px-8 h-12 font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                  onClick={handleFollow}
                >
                  {isFollowing ? 'Unfollow' : isRequested ? (
                    <><Clock className="w-4 h-4 mr-2" /> Requested</>
                  ) : 'Follow User'}
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/settings">
                  <button className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 transition-all shadow-lg">
                    <Settings className="w-5 h-5 text-slate-500" />
                  </button>
                </Link>
                <Button 
                  onClick={() => setShowEditModal(true)}
                  className="rounded-2xl px-8 font-black text-xs uppercase tracking-widest shadow-indigo-500/20 shadow-lg"
                >
                  <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Identity */}
        <div className="px-4 md:px-8 mt-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {user.name}
            </h1>
            {user.isVerified && <ShieldCheck className="w-6 h-6 text-indigo-500 fill-indigo-500/10" />}
          </div>
          <p className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wide">@{user.username}</p>
          
          <p className="mt-4 text-slate-600 dark:text-zinc-400 text-lg leading-relaxed max-w-2xl font-medium">
            {user.bio || "This explorer is still writing their story..."}
          </p>

          <div className="flex flex-wrap gap-6 mt-6 text-sm font-bold text-slate-400 dark:text-zinc-500">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-zinc-800/50">
              <MapPin className="w-4 h-4 text-indigo-500" /> {user.location || 'Not specified'}
            </div>
            {user.website && (
              <a href={user.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-indigo-500 transition-colors">
                <LinkIcon className="w-4 h-4" /> {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex justify-center gap-6 md:gap-10 mt-10 p-6 bg-slate-50 dark:bg-zinc-900/50 rounded-4xl border border-slate-100 dark:border-zinc-800/50">
            {[
              { label: 'Posts', count: posts.length, link: null },
              { label: 'Followers', count: user.followersCount, link: `/profile/${user._id}/followers` },
              { label: 'Following', count: user.followingCount, link: `/profile/${user._id}/following` }
            ].map((stat) => (
              stat.link ? (
                <Link 
                  key={stat.label} 
                  to={stat.link}
                  className="flex flex-col items-center px-4 py-2 -mx-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{stat.count}</span>
                  <span className="text-[10px] uppercase tracking-[0.15em] font-black text-slate-400 mt-1">{stat.label}</span>
                </Link>
              ) : (
                <div key={stat.label} className="flex flex-col items-center px-4 py-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{stat.count}</span>
                  <span className="text-[10px] uppercase tracking-[0.15em] font-black text-slate-400 mt-1">{stat.label}</span>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="sticky top-20 z-10 p-1 bg-slate-100/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 flex gap-1 mb-8">
        {['posts', 'media', 'likes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={clsx(
              "flex-1 py-3 font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300",
              selectedTab === tab 
                ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                : "text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Feed Content */}
      <div className="space-y-6">
        {/* Private Account Message */}
        {!isMyProfile && user.accountType === 'private' && !isFollowing && (
          <div className="text-center py-20 bg-slate-50 dark:bg-zinc-900/30 rounded-4xl border border-dashed border-slate-200 dark:border-zinc-800">
            <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">This Account is Private</h3>
            <p className="text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
              {isRequested 
                ? 'Follow request sent. You\'ll see their posts once they approve your request.'
                : 'Follow this account to see their photos and videos.'}
            </p>
          </div>
        )}

        {/* Show posts only if public account, own profile, or following */}
        {(isMyProfile || user.accountType !== 'private' || isFollowing) && selectedTab === 'posts' && (
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={currentUser?._id}
                onUpdate={(updatedPost) => setPosts(posts.map(p => p._id === updatedPost._id ? { ...p, ...updatedPost } : p))}
                onDelete={(deletedId) => setPosts(posts.filter(p => p._id !== deletedId))}
                showComments={openCommentsPostId === post._id}
                onToggleComments={() => setOpenCommentsPostId(openCommentsPostId === post._id ? null : post._id)}
              />
            ))}
            {posts.length === 0 && (
              <div className="text-center py-20 bg-slate-50 dark:bg-zinc-900/30 rounded-4xl border border-dashed border-slate-200 dark:border-zinc-800">
                <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No activity yet</p>
              </div>
            )}
          </div>
        )}
        {(isMyProfile || user.accountType !== 'private' || isFollowing) && selectedTab !== 'posts' && (
           <div className="py-20 text-center bg-slate-50 dark:bg-zinc-900/30 rounded-4xl">
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">Archiving {selectedTab}...</p>
           </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;