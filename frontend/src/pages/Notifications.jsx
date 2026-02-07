import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, UserPlus, MessageSquare, Trash2, Check, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';
import api from '../lib/api';
import { toast } from 'sonner';
import { clsx } from 'clsx';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case 'comment': 
      case 'reply': return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-indigo-500" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Notifications</h2>
          <button 
            onClick={handleMarkAllRead}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Mark all read
          </button>
        </div>

        {/* List */}
        <div>
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-zinc-400">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <Link 
                key={notif._id} 
                to={notif.link || '#'} // Navigate to post/profile if link exists
                className={clsx(
                  "flex gap-4 p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors border-l-4",
                  notif.isRead ? "border-transparent" : "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10"
                )}
              >
                <div className="mt-1">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 dark:text-zinc-200">
                    <span className="font-semibold text-slate-900 dark:text-zinc-100">
                      {notif.sender?.name}
                    </span>
                    {' '}
                    {notif.type === 'like' && 'liked your post.'}
                    {notif.type === 'comment' && 'commented on your post.'}
                    {notif.type === 'follow' && 'started following you.'}
                    {notif.type === 'message' && 'sent you a message.'}
                  </p>
                  {notif.content && (
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      "{notif.content}"
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!notif.isRead && (
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 shrink-0" />
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;