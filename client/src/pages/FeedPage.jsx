import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { RiHome4Fill } from 'react-icons/ri';
import api from '../utils/api';
import useAuthStore from '../context/authStore';
import { getSocket } from '../utils/socket';
import CreatePost from '../components/posts/CreatePost';
import PostList from '../components/posts/PostList';

export default function FeedPage() {
  const { user } = useAuthStore();

  const fetchFeed = useCallback(async (page) => {
    const { data } = await api.get(`/posts/feed?page=${page}&limit=10`);
    return data;
  }, []);

  // Pass real-time new post stream to PostList
  const newPostsStream = useCallback((handler) => {
    const socket = getSocket();
    if (socket) socket.on('new_post', handler);
    return () => { if (socket) socket.off('new_post', handler); };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-2.5 pb-1">
        <RiHome4Fill className="text-xl text-brand-600" />
        <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Home Feed</h1>
      </div>

      {/* Create post */}
      <CreatePost
        onPostCreated={(post) => {
          // handled by PostList real-time stream for followers;
          // re-render via a key prop trick would also work
          window.location.reload();
        }}
      />

      {/* Feed */}
      <PostList
        fetchFn={fetchFeed}
        emptyTitle="Your feed is empty"
        emptyDesc="Follow some developers to see their posts here, or explore the community!"
        emptyIcon="🌱"
        newPostsStream={newPostsStream}
      />
    </motion.div>
  );
}
