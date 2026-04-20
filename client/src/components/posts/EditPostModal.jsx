import { useState, useEffect } from 'react';
import { RiSaveLine } from 'react-icons/ri';
import api from '../../utils/api';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';

export default function EditPostModal({ isOpen, onClose, post, onUpdate }) {
  const [content, setContent] = useState(post?.content || '');
  const [tags, setTags] = useState(post?.tags?.join(', ') || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setContent(post.content || '');
      setTags(post.tags?.join(', ') || '');
    }
  }, [post]);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean);
      const { data } = await api.put(`/posts/${post._id}`, { content, tags: parsedTags });
      onUpdate?.(data);
      onClose();
      toast.success('Post updated!');
    } catch {
      toast.error('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post">
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Content (Markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            maxLength={3000}
            className="input-base font-mono text-sm resize-none"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{content.length}/3000</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="javascript, react, webdev"
            className="input-base text-sm"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={saving || !content.trim()} className="btn-primary flex items-center gap-2">
            {saving ? <span className="spinner w-4 h-4" /> : <RiSaveLine />}
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
