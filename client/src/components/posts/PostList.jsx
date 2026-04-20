import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiRefreshLine } from 'react-icons/ri';
import PostCard from './PostCard';
import { SkeletonPost } from '../common/Spinner';
import EmptyState from '../common/EmptyState';

export default function PostList({ fetchFn, emptyTitle, emptyDesc, emptyIcon, newPostsStream }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newPosts, setNewPosts] = useState([]);

  const load = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const data = await fetchFn(pageNum);
      const incoming = data.posts || data;
      if (append) {
        setPosts((prev) => [...prev, ...incoming]);
      } else {
        setPosts(incoming);
      }
      setHasMore(data.page < data.pages);
      setPage(pageNum);
    } catch {}
    setLoading(false);
    setLoadingMore(false);
  }, [fetchFn]);

  useEffect(() => {
    load(1, false);
  }, [load]);

  // Listen for real-time new posts
  useEffect(() => {
    if (!newPostsStream) return;
    const handler = (post) => {
      setNewPosts((prev) => [post, ...prev]);
    };
    newPostsStream(handler);
  }, [newPostsStream]);

  const handleShowNew = () => {
    setPosts((prev) => [...newPosts, ...prev]);
    setNewPosts([]);
  };

  const handleDelete = (id) => setPosts((prev) => prev.filter((p) => p._id !== id));
  const handleUpdate = (updated) => setPosts((prev) => prev.map((p) => p._id === updated._id ? updated : p));

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <SkeletonPost key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* New posts banner */}
      <AnimatePresence>
        {newPosts.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            onClick={handleShowNew}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold shadow-glow hover:bg-brand-700 transition-all"
          >
            <RiRefreshLine className="animate-spin" />
            {newPosts.length} new {newPosts.length === 1 ? 'post' : 'posts'} — click to load
          </motion.button>
        )}
      </AnimatePresence>

      {posts.length === 0 ? (
        <EmptyState icon={emptyIcon || '📭'} title={emptyTitle || 'Nothing here yet'} description={emptyDesc} />
      ) : (
        <AnimatePresence initial={false}>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </AnimatePresence>
      )}

      {hasMore && (
        <button
          onClick={() => load(page + 1, true)}
          disabled={loadingMore}
          className="w-full btn-secondary flex items-center justify-center gap-2"
        >
          {loadingMore ? <span className="spinner w-4 h-4" /> : null}
          {loadingMore ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  );
}
