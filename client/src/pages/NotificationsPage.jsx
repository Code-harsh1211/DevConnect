import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiBellFill, RiCheckDoubleLine } from 'react-icons/ri';
import useNotificationStore from '../context/notificationStore';
import NotificationItem from '../components/notifications/NotificationItem';
import { PageLoader } from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

export default function NotificationsPage() {
  const { notifications, loading, fetchNotifications, markAllRead, unreadCount } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    // Mark as read after a short delay
    const t = setTimeout(() => markAllRead(), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading && notifications.length === 0) return <PageLoader />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <RiBellFill className="text-xl text-brand-600" />
          <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          {unreadCount > 0 && (
            <span className="badge bg-brand-100 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-bold">
              {unreadCount} new
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <RiCheckDoubleLine /> Mark all read
          </button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="All caught up!"
          description="You have no notifications yet. When someone likes or comments on your posts, you'll see it here."
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {notifications.map((n, i) => (
              <NotificationItem key={n._id} notification={n} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
