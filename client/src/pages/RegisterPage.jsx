import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiCodeSSlashFill, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine,
  RiUser3Line, RiAtLine,
} from 'react-icons/ri';
import useAuthStore from '../context/authStore';
import toast from 'react-hot-toast';

const STEPS = ['Account', 'Profile'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) errs.username = 'Only letters, numbers, underscores';
    else if (form.username.length < 3) errs.username = 'Minimum 3 characters';
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    return errs;
  };

  const handleNext = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.username.trim()) errs.username = 'Required';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) errs.username = 'Letters, numbers, underscores only';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const result = await register(form);
    if (result.success) {
      toast.success('Welcome to DevConnect! 🎉');
      navigate('/feed');
    } else {
      toast.error(result.error);
    }
  };

  const fieldClass = (field) =>
    `input-base ${errors[field] ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : ''}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-glow">
            <RiCodeSSlashFill className="text-white text-xl" />
          </div>
          <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Dev<span className="text-brand-600">Connect</span>
          </span>
        </Link>

        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Join DevConnect</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Create your free account — takes 30 seconds</p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-7">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i <= step ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>{i + 1}</div>
                <span className={`text-xs font-medium ${i === step ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 w-8 rounded ${i < step ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <RiUser3Line className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Ada Lovelace" className={`${fieldClass('name')} pl-10`} />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Username</label>
                  <div className="relative">
                    <RiAtLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input name="username" type="text" value={form.username} onChange={handleChange} placeholder="ada_codes" className={`${fieldClass('username')} pl-10`} />
                  </div>
                  {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                </div>
                <button type="button" onClick={handleNext} className="btn-primary w-full py-3">Continue →</button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Email</label>
                  <div className="relative">
                    <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="ada@example.com" className={`${fieldClass('email')} pl-10`} autoComplete="email" />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className={`${fieldClass('password')} pl-10 pr-10`} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setStep(0)} className="btn-secondary flex-1 py-3">← Back</button>
                  <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
                    {loading ? <span className="spinner w-5 h-5" /> : null}
                    {loading ? 'Creating…' : 'Create Account'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
          Already a member?{' '}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
