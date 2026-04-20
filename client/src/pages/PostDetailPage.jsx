import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiArrowLeftLine } from 'react-icons/ri';
import api from '../utils/api';
import PostCard from '../components/posts/PostCard';
import { PageLoader } from '../components/common/Spinner';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch {
        setPost(null);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <PageLoader />;
  if (!post) return (
    <div className="text-center py-20 text-slate-400">Post not found.</div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium">
        <RiArrowLeftLine /> Back
      </button>
      <PostCard
        post={post}
        onDelete={() => navigate('/feed')}
        onUpdate={(updated) => setPost(updated)}
      />
    </motion.div>
  );
}
