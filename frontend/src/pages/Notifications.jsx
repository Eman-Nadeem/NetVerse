import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, UserPlus, MessageSquare, Trash2, Check, Bell, CircleDot, UserCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import { useNotificationStore } from '../store/notificationStore';
import api from '../lib/api';

const Notifications = () => {
  const { notifications, loading, fetchNotifications, markAllAsRead, removeNotification } = useNotificationStore();
  const [processingIds, setProcessingIds] = useState(new Set());

  // Filter out message notifications - they show as badge on chat button instead
  const displayNotifications = notifications.filter(n => n.type !== 'message');

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    const success = await markAllAsRead();
    if (success) {
      toast.success('All notifications marked as read');
    } else {
      toast.error('Failed to mark as read');
    }
  };

  const handleAcceptRequest = async (e, notif) => {
    e.preventDefault();
    e.stopPropagation();
    setProcessingIds(prev => new Set([...prev, notif._id]));
    try {
      await api.post(`/users/${notif.sender._id}/accept`);
      removeNotification(notif._id);
      toast.success(`Accepted ${notif.sender.name}'s follow request`);
    } catch (error) {
      toast.error('Failed to accept request');
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(notif._id);
        return next;
      });
    }
  };

  const handleDeclineRequest = async (e, notif) => {
    e.preventDefault();
    e.stopPropagation();
    setProcessingIds(prev => new Set([...prev, notif._id]));
    try {
      await api.post(`/users/${notif.sender._id}/decline`);
      removeNotification(notif._id);
      toast.success('Follow request declined');
    } catch (error) {
      toast.error('Failed to decline request');
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(notif._id);
        return next;
      });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case 'comment': 
      case 'reply': return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-indigo-500" />;
      case 'followRequest': return <UserPlus className="w-5 h-5 text-amber-500" />;
      case 'followAccepted': return <UserCheck className="w-5 h-5 text-green-500" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'story': return <CircleDot className="w-5 h-5 text-pink-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getNotificationMessage = (type) => {
    switch (type) {
      case 'like': return 'liked your post.';
      case 'comment': return 'commented on your post.';
      case 'reply': return 'replied to your comment.';
      case 'follow': return 'started following you.';
      case 'followRequest': return 'requested to follow you.';
      case 'followAccepted': return 'accepted your follow request.';
      case 'message': return 'sent you a message.';
      case 'story': return 'posted a new story.';
      default: return 'sent you a notification.';
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
          ) : displayNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-zinc-400">No notifications yet</p>
            </div>
          ) : (
            displayNotifications.map((notif) => (
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
                    {getNotificationMessage(notif.type)}
                  </p>
                  {notif.content && (
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      "{notif.content}"
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'Just now'}
                  </p>
                  
                  {/* Accept/Decline buttons for follow requests */}
                  {notif.type === 'followRequest' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => handleAcceptRequest(e, notif)}
                        disabled={processingIds.has(notif._id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={(e) => handleDeclineRequest(e, notif)}
                        disabled={processingIds.has(notif._id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Decline
                      </button>
                    </div>
                  )}
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