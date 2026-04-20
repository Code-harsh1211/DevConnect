import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiUserFollowLine, RiUserUnfollowLine, RiEditLine,
  RiGlobalLine, RiMapPinLine, RiGithubLine,
  RiUserLine, RiNewspaperLine,
} from 'react-icons/ri';
import api from '../utils/api';
import useAuthStore from '../context/authStore';
import Avatar from '../components/common/Avatar';
import PostList from '../components/posts/PostList';
import EditProfileModal from '../components/profile/EditProfileModal';
import { PageLoader } from '../components/common/Spinner';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { username } = useParams();
  const { user: me } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [tab, setTab] = useState('posts');
  const [showEdit, setShowEdit] = useState(false);

  const isOwn = me?.username === username;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/users/${username}`);
        setProfile(data);
        setFollowing(data.followers?.some((f) => f._id === me?._id || f === me?._id));
        setFollowersCount(data.followers?.length || 0);
      } catch {
        setProfile(null);
      }
      setLoading(false);
    };
    fetch();
  }, [username, me?._id]);

  const handleFollow = async () => {
    try {
      const { data } = await api.post(`/users/${profile._id}/follow`);
      setFollowing(data.isFollowing);
      setFollowersCount(data.followersCount);
      toast.success(data.isFollowing ? `Following ${profile.name}` : `Unfollowed ${profile.name}`);
    } catch {
      toast.error('Something went wrong');
    }
  };

  const fetchPosts = useCallback(async (page) => {
    const { data } = await api.get(`/users/${username}/posts?page=${page}&limit=10`);
    // API returns array; wrap for PostList
    return { posts: Array.isArray(data) ? data : data.posts, page: 1, pages: 1 };
  }, [username]);

  if (loading) return <PageLoader />;
  if (!profile) return (
    <div className="text-center py-20 text-slate-400">User not found.</div>
  );

  const stats = [
    { label: 'Followers', value: followersCount },
    { label: 'Following', value: profile.following?.length || 0 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Profile card */}
      <div className="card overflow-visible">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-brand-500 via-brand-600 to-indigo-600 relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=40")', backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="ring-4 ring-white dark:ring-slate-800 rounded-full relative z-10 translate-y-1">
              <Avatar src={profile.avatar} name={profile.name} size={80} />
            </div>
            <div className="flex gap-2 mt-14">
              {isOwn ? (
                <button onClick={() => setShowEdit(true)} className="btn-secondary flex items-center gap-1.5 text-sm py-2">
                  <RiEditLine /> Edit Profile
                </button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleFollow}
                  className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                    following
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600'
                      : 'btn-primary'
                  }`}
                >
                  {following ? <><RiUserUnfollowLine /> Unfollow</> : <><RiUserFollowLine /> Follow</>}
                </motion.button>
              )}
            </div>
          </div>

          {/* Name & bio */}
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">@{profile.username}</p>
          {profile.bio && <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{profile.bio}</p>}

          {/* Meta info */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-4">
            {profile.location && (
              <span className="flex items-center gap-1"><RiMapPinLine className="text-brand-400" />{profile.location}</span>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400">
                <RiGlobalLine className="text-brand-400" />{profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {profile.github && (
              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400">
                <RiGithubLine />github.com/{profile.github}
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-5">
            {stats.map(({ label, value }) => (
              <div key={label}>
                <span className="font-display font-bold text-lg text-slate-900 dark:text-white">{value}</span>
                <span className="text-xs text-slate-400 ml-1.5">{label}</span>
              </div>
            ))}
          </div>

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <span key={skill} className="badge bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-medium text-xs">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-100 dark:border-slate-800 pb-0">
        {[
          { id: 'posts', label: 'Posts', icon: RiNewspaperLine },
          { id: 'about', label: 'About', icon: RiUserLine },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px ${
              tab === id
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Icon /> {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'posts' && (
        <PostList
          key={username}
          fetchFn={fetchPosts}
          emptyTitle="No posts yet"
          emptyDesc={isOwn ? "Share your first post with the community!" : `${profile.name} hasn't posted yet.`}
          emptyIcon="📝"
        />
      )}

      {tab === 'about' && (
        <div className="card p-6 space-y-4">
          <h3 className="font-display font-bold text-slate-900 dark:text-white">About {profile.name}</h3>
          {profile.bio ? (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{profile.bio}</p>
          ) : (
            <p className="text-sm text-slate-400 italic">No bio provided yet.</p>
          )}
          {profile.skills?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-center">
              <p className="font-display font-bold text-2xl text-slate-900 dark:text-white">{followersCount}</p>
              <p className="text-xs text-slate-400 mt-0.5">Followers</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-center">
              <p className="font-display font-bold text-2xl text-slate-900 dark:text-white">{profile.following?.length || 0}</p>
              <p className="text-xs text-slate-400 mt-0.5">Following</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit profile modal */}
      <EditProfileModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        profile={profile}
        onUpdate={(updated) => setProfile((p) => ({ ...p, ...updated }))}
      />
    </motion.div>
  );
}
