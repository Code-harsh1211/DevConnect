import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  RiHeartFill, RiChat1Fill, RiUserFollowFill, RiAtLine, RiDeleteBinLine,
} from 'react-icons/ri';
import useNotificationStore from '../../context/notificationStore';
import Avatar from '../common/Avatar';

const TYPE_CONFIG = {
  like:    { icon: RiHeartFill,      color: 'text-red-500',   bg: 'bg-red-50 dark:bg-red-950/30' },
  comment: { icon: RiChat1Fill,      color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-950/30' },
  follow:  { icon: RiUserFollowFill, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  mention: { icon: RiAtLine,         color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30' },
};

export default function NotificationItem({ notification, index }) {
  const { deleteNotification } = useNotificationStore();
  const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.mention;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ delay: index * 0.04 }}
      className={`card p-4 flex items-start gap-3 group transition-all ${
        !notification.isRead ? 'border-l-4 border-l-brand-500' : ''
      }`}
    >
      {/* Sender avatar with type icon badge */}
      <div className="relative flex-shrink-0">
        <Link to={`/profile/${notification.sender?.username}`}>
          <Avatar src={notification.sender?.avatar} name={notification.sender?.name} size={42} />
        </Link>
        <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${cfg.bg}`}>
          <Icon className={`text-xs ${cfg.color}`} />
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
          <Link to={`/profile/${notification.sender?.username}`} className="font-semibold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400">
            {notification.sender?.name}
          </Link>{' '}
          {notification.type === 'follow' ? 'started following you' :
           notification.type === 'like' ? 'liked your post' :
           notification.type === 'comment' ? 'commented on your post' :
           'mentioned you'}
        </p>
        {notification.post?.content && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-xs">
            "{notification.post.content.slice(0, 80)}…"
          </p>
        )}
        <p className="text-xs text-slate-400 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Unread dot + delete */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {!notification.isRead && (
          <span className="w-2 h-2 bg-brand-500 rounded-full" />
        )}
        <button
          onClick={() => deleteNotification(notification._id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
        >
          <RiDeleteBinLine className="text-sm" />
        </button>
      </div>
    </motion.div>
  );
}
