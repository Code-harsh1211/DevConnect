import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDistanceToNow } from 'date-fns';
import {
  RiHeartLine, RiHeartFill,
  RiChat1Line, RiShareLine,
  RiMoreLine, RiEditLine, RiDeleteBinLine,
  RiCheckLine,
} from 'react-icons/ri';
import api from '../../utils/api';
import useAuthStore from '../../context/authStore';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';
import CommentSection from './CommentSection';
import EditPostModal from './EditPostModal';

export default function PostCard({ post, onDelete, onUpdate }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(post.likes?.includes(user?._id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwner = user?._id === (post.author?._id || post.author);

  const handleLike = async () => {
    if (!user) return navigate('/login');
    try {
      const prev = liked;
      setLiked(!prev);
      setLikesCount((c) => (prev ? c - 1 : c + 1));
      await api.post(`/posts/${post._id}/like`);
    } catch {
      setLiked(liked);
      setLikesCount(post.likes?.length || 0);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success('Post deleted');
      onDelete?.(post._id);
    } catch {
      toast.error('Failed to delete post');
    }
    setShowMenu(false);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="card p-5 space-y-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.author?.username}`}>
              <Avatar src={post.author?.avatar} name={post.author?.name} size={42} className="hover:ring-2 hover:ring-brand-400 transition-all" />
            </Link>
            <div>
              <Link to={`/profile/${post.author?.username}`} className="font-semibold text-sm text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                {post.author?.name}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <span>@{post.author?.username}</span>
                <span>·</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                {post.isEdited && <span className="italic">(edited)</span>}
              </div>
            </div>
          </div>

          {/* Post menu */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
              >
                <RiMoreLine className="text-lg" />
              </button>
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -4 }}
                    className="absolute right-0 top-8 z-20 card py-1 w-40 shadow-lg"
                    onMouseLeave={() => setShowMenu(false)}
                  >
                    <button
                      onClick={() => { setShowEditModal(true); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <RiEditLine /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <RiDeleteBinLine /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose-content text-sm leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {/* Image */}
        {post.image && (
          <img
            src={post.image}
            alt="Post attachment"
            className="w-full rounded-xl object-cover max-h-80 border border-slate-100 dark:border-slate-700"
          />
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Link key={tag} to={`/explore?tag=${tag}`} className="tag text-xs">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 pt-1 border-t border-slate-50 dark:border-slate-700/50">
          {/* Like */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              liked
                ? 'text-red-500 bg-red-50 dark:bg-red-950/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
            }`}
          >
            <motion.span animate={liked ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
              {liked ? <RiHeartFill /> : <RiHeartLine />}
            </motion.span>
            <span>{likesCount}</span>
          </motion.button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              showComments
                ? 'text-brand-600 bg-brand-50 dark:bg-brand-950/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30'
            }`}
          >
            <RiChat1Line />
            <span>{post.comments?.length || 0}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-all ml-auto"
          >
            {copied ? <RiCheckLine className="text-green-500" /> : <RiShareLine />}
          </button>
        </div>

        {/* Comments */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <CommentSection postId={post._id} initialComments={post.comments || []} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Edit Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={post}
        onUpdate={onUpdate}
      />
    </>
  );
}
