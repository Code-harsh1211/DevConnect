import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSendPlaneFill, RiImageAddLine, RiCodeSSlashLine, RiCloseLine } from 'react-icons/ri';
import api from '../../utils/api';
import useAuthStore from '../../context/authStore';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [showExtras, setShowExtras] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean);

      const { data } = await api.post('/posts', {
        content: content.trim(),
        tags: parsedTags,
        image: image.trim(),
      });

      onPostCreated?.(data);
      setContent('');
      setTags('');
      setImage('');
      setShowExtras(false);
      toast.success('Post published! 🚀');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish post');
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = content.length;
  const limit = 3000;
  const remaining = limit - charCount;

  return (
    <div className="card p-5 space-y-4">
      <div className="flex gap-3">
        <Avatar src={user?.avatar} name={user?.name} size={42} className="flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setShowExtras(true)}
            placeholder="Share something with the dev community… (Markdown supported ✨)"
            rows={showExtras ? 4 : 2}
            maxLength={limit}
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 resize-none outline-none leading-relaxed"
          />

          <AnimatePresence>
            {showExtras && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-3"
              >
                {/* Image URL input */}
                <div className="flex items-center gap-2">
                  <RiImageAddLine className="text-slate-400 text-lg flex-shrink-0" />
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image URL (optional)"
                    className="input-base py-2 text-xs"
                  />
                  {image && (
                    <button onClick={() => setImage('')} className="text-slate-400 hover:text-red-500">
                      <RiCloseLine />
                    </button>
                  )}
                </div>

                {/* Tags input */}
                <div className="flex items-center gap-2">
                  <RiCodeSSlashLine className="text-slate-400 text-lg flex-shrink-0" />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Tags: javascript, react, webdev (comma-separated)"
                    className="input-base py-2 text-xs"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
        <span className={`text-xs font-mono ${remaining < 100 ? 'text-red-500' : 'text-slate-400'}`}>
          {remaining} chars left
        </span>

        <div className="flex items-center gap-2">
          {showExtras && (
            <button
              onClick={() => setShowExtras(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              Collapse
            </button>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!content.trim() || submitting || charCount > limit}
            className="btn-primary flex items-center gap-2 py-2 text-sm"
          >
            {submitting ? (
              <span className="spinner w-4 h-4" />
            ) : (
              <RiSendPlaneFill />
            )}
            {submitting ? 'Publishing…' : 'Publish'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
