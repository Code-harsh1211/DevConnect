import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiCompassFill, RiSearchLine } from 'react-icons/ri';
import api from '../utils/api';
import PostList from '../components/posts/PostList';

const TRENDING = ['javascript', 'react', 'python', 'webdev', 'opensource', 'nodejs', 'typescript', 'rust', 'go', 'devops'];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTag, setActiveTag] = useState(searchParams.get('tag') || '');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const tag = searchParams.get('tag') || '';
    setActiveTag(tag);
  }, [searchParams]);

  const fetchPosts = useCallback(async (page) => {
    const params = new URLSearchParams({ page, limit: 10 });
    if (activeTag) params.set('tag', activeTag);
    const { data } = await api.get(`/posts?${params}`);
    return data;
  }, [activeTag]);

  const handleTagClick = (tag) => {
    if (activeTag === tag) {
      setActiveTag('');
      setSearchParams({});
    } else {
      setActiveTag(tag);
      setSearchParams({ tag });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-1">
        <RiCompassFill className="text-xl text-brand-600" />
        <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Explore</h1>
      </div>

      {/* Search bar */}
      <div className="relative">
        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts, tags, developers…"
          className="input-base pl-11 py-3.5"
        />
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleTagClick('')}
          className={`badge px-3 py-1.5 text-xs font-semibold transition-all ${
            !activeTag
              ? 'bg-brand-600 text-white shadow-glow'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          All
        </button>
        {TRENDING.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`badge px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTag === tag
                ? 'bg-brand-600 text-white shadow-glow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {activeTag && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing posts tagged <span className="font-semibold text-brand-600 dark:text-brand-400">#{activeTag}</span>
        </p>
      )}

      <PostList
        key={activeTag}
        fetchFn={fetchPosts}
        emptyTitle="No posts found"
        emptyDesc={activeTag ? `No posts with #${activeTag} yet. Be the first!` : 'No posts yet. Start the conversation!'}
        emptyIcon="🔍"
      />
    </motion.div>
  );
}
