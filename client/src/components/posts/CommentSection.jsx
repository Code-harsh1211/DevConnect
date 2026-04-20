import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { RiSendPlaneFill, RiDeleteBinLine } from 'react-icons/ri';
import api from '../../utils/api';
import useAuthStore from '../../context/authStore';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

export default function CommentSection({ postId, initialComments }) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { content: text.trim() });
      setComments((prev) => [...prev, data]);
      setText('');
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 space-y-3">
      {/* Comment input */}
      {user && (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Avatar src={user.avatar} name={user.name} size={32} />
          <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-brand-500/30 focus-within:border-brand-500 transition-all">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment…"
              className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none"
              maxLength={500}
            />
            <motion.button
              type="submit"
              disabled={!text.trim() || submitting}
              whileTap={{ scale: 0.9 }}
              className="text-brand-600 disabled:text-slate-300 dark:disabled:text-slate-600 transition-colors"
            >
              <RiSendPlaneFill className="text-lg" />
            </motion.button>
          </div>
        </form>
      )}

      {/* Comments list */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {comments.length === 0 && (
            <p className="text-xs text-center text-slate-400 py-2">No comments yet. Be the first!</p>
          )}
          {comments.map((c) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 group"
            >
              <Link to={`/profile/${c.user?.username}`} className="flex-shrink-0 mt-0.5">
                <Avatar src={c.user?.avatar} name={c.user?.name} size={28} />
              </Link>
              <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl px-3 py-2">
                <div className="flex items-baseline gap-1.5">
                  <Link to={`/profile/${c.user?.username}`} className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400">
                    {c.user?.name}
                  </Link>
                  <span className="text-[10px] text-slate-400">
                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">{c.content}</p>
              </div>
              {user?._id === (c.user?._id || c.user) && (
                <button
                  onClick={() => handleDelete(c._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                >
                  <RiDeleteBinLine className="text-sm" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
