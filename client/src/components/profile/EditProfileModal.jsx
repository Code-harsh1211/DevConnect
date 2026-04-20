import { useState, useEffect } from 'react';
import { RiSaveLine, RiUser3Line, RiGlobalLine, RiMapPinLine, RiGithubLine } from 'react-icons/ri';
import api from '../../utils/api';
import useAuthStore from '../../context/authStore';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

export default function EditProfileModal({ isOpen, onClose, profile, onUpdate }) {
  const { updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: '',
    bio: '',
    skills: '',
    website: '',
    location: '',
    github: '',
    avatar: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        bio: profile.bio || '',
        skills: profile.skills?.join(', ') || '',
        website: profile.website || '',
        location: profile.location || '',
        github: profile.github || '',
        avatar: profile.avatar || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const { data } = await api.put('/users/profile', payload);
      updateUser(data);
      onUpdate?.(data);
      onClose();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Display Name', icon: RiUser3Line, type: 'text', placeholder: 'Your full name' },
    { name: 'website', label: 'Website', icon: RiGlobalLine, type: 'url', placeholder: 'https://yoursite.com' },
    { name: 'location', label: 'Location', icon: RiMapPinLine, type: 'text', placeholder: 'San Francisco, CA' },
    { name: 'github', label: 'GitHub Username', icon: RiGithubLine, type: 'text', placeholder: 'octocat' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <div className="p-6 space-y-5">
        {/* Avatar preview */}
        <div className="flex items-center gap-4">
          <Avatar src={form.avatar} name={form.name} size={64} />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Avatar URL</label>
            <input
              name="avatar"
              type="url"
              value={form.avatar}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="input-base text-sm"
            />
          </div>
        </div>

        {/* Fields */}
        {fields.map(({ name, label, icon: Icon, type, placeholder }) => (
          <div key={name}>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
              <Icon className="text-sm" /> {label}
            </label>
            <input
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="input-base text-sm"
            />
          </div>
        ))}

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            maxLength={300}
            placeholder="Tell the world about yourself…"
            className="input-base text-sm resize-none"
          />
          <p className="text-xs text-slate-400 text-right mt-1">{form.bio.length}/300</p>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Skills</label>
          <input
            name="skills"
            type="text"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, Node.js, Python, Go (comma-separated)"
            className="input-base text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <span className="spinner w-4 h-4" /> : <RiSaveLine />}
            Save Profile
          </button>
        </div>
      </div>
    </Modal>
  );
}
