import { RiUserAddLine } from "react-icons/ri";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { RiUserAddLine, RiUserCheckLine } from 'react-icons/ri';
import api from '../../utils/api';
import useAuthStore from '../../context/authStore';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

export default function RightPanel() {
  const { user, updateUser } = useAuthStore();
  const [suggestions, setSuggestions] = useState([]);
  const [following, setFollowing] = useState(new Set(user?.following?.map(f => f._id || f) || []));

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await api.get('/users/suggestions');
        setSuggestions(data);
      } catch {}
    };
    fetchSuggestions();
  }, []);

  const handleFollow = async (targetUser) => {
  try {
    await api.post(`/users/${targetUser._id}/follow`);

    const isNowFollowing = !following.has(targetUser._id);

    setFollowing((prev) => {
      const next = new Set(prev);
      if (isNowFollowing) next.add(targetUser._id);
      else next.delete(targetUser._id);
      return next;
    });
    console.log("follow clicked");
    // 🔥 ADD THIS LINE
    fetchPosts();

    toast.success(
      isNowFollowing
        ? `Following ${targetUser.name}`
        : `Unfollowed ${targetUser.name}`
    );
  } catch {
    toast.error('Something went wrong');
  }
};

  const trendingTags = ['javascript', 'react', 'python', 'webdev', 'opensource', 'nodejs', 'typescript'];

  return (
    <div className="flex flex-col h-full px-4 py-6 border-l border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 overflow-y-auto">
      {/* Who to follow */}
      {suggestions.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-slate-900 dark:text-white mb-4">Who to Follow</h3>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3"
              >
                <Link to={`/profile/${s.username}`}>
                  <Avatar src={s.avatar} name={s.name} size={38} />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${s.username}`} className="font-semibold text-sm text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 truncate block">
                    {s.name}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{s.username}</p>
                </div>
                <button
                  onClick={() => handleFollow(s)}
                  className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    following.has(s._id)
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      : 'bg-brand-600 hover:bg-brand-700 text-white'
                  }`}
                >
                  {following.has(s._id) ? <RiUserCheckLine /> : <RiUserAddLine />}
                  {following.has(s._id) ? 'Following' : 'Follow'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Trending tags */}
      <div>
        <h3 className="font-display font-bold text-slate-900 dark:text-white mb-4">Trending Tags</h3>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <Link key={tag} to={`/explore?tag=${tag}`} className="tag">
              #{tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-slate-400 dark:text-slate-600 pt-4">
        <p>© 2025 DevConnect</p>
        <p className="mt-1">Built for developers, by developers.</p>
      </div>
    </div>
  );
}
