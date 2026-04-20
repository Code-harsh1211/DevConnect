import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiCodeSSlashFill, RiArrowRightLine, RiGithubFill,
  RiTwitterXFill, RiShieldCheckLine, RiFlashlightLine, RiTeamLine,
} from 'react-icons/ri';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const FEATURES = [
  { icon: RiCodeSSlashFill, title: 'Dev-First Posts', desc: 'Write in Markdown with code syntax highlighting. Share snippets, ideas, and insights the way devs think.' },
  { icon: RiFlashlightLine, title: 'Real-time Everything', desc: 'Instant notifications via Socket.io. Know the second someone likes, comments, or follows you.' },
  { icon: RiTeamLine, title: 'Build Your Network', desc: 'Follow developers who inspire you. Discover talent through skill tags and trending topics.' },
  { icon: RiShieldCheckLine, title: 'Secure & Fast', desc: 'JWT authentication, bcrypt passwords, and a blazing-fast REST API built with Node.js and MongoDB.' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Full-Stack Dev', avatar: 'https://i.pravatar.cc/48?img=47', text: 'Finally a social platform that gets developers. The markdown support alone makes it 10x better.' },
  { name: 'Marcus Webb', role: 'OSS Contributor', avatar: 'https://i.pravatar.cc/48?img=11', text: 'Found three collaborators for my open-source project in the first week. This is the future.' },
  { name: 'Yuki Tanaka', role: 'Frontend Engineer', avatar: 'https://i.pravatar.cc/48?img=56', text: 'The real-time notifications keep me engaged without being overwhelming. Beautifully designed.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 glass dark:glass-dark border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center shadow-glow">
              <RiCodeSSlashFill className="text-white text-lg" />
            </div>
            <span className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Dev<span className="text-brand-600">Connect</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 hero-gradient noise">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={stagger} initial="initial" animate="animate">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-sm font-medium mb-8">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
              Built for developers, by developers
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-6">
              Where great code<br />
              <span className="gradient-text">meets great community</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              DevConnect is the social network built for software engineers. Share knowledge in Markdown, get real-time feedback, and grow your professional network.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-base flex items-center gap-2 group px-8 py-3 shadow-glow">
                Start Building Your Network
                <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-3">
                Already have an account?
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating code card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="max-w-2xl mx-auto mt-16 card p-5 shadow-card-hover"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-2 text-xs text-slate-400 font-mono">devconnect_post.md</span>
          </div>
          <pre className="text-sm font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{`## Just shipped: useDebounce hook 🚀

\`\`\`typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
\`\`\`

Perfect for search inputs. Drop into any React project!`}</pre>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
            <span>❤️ 142 likes</span>
            <span>💬 38 comments</span>
            <span className="ml-auto">#react #hooks #typescript</span>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything a dev needs
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              No noise, no algorithm manipulation — just a clean platform built around developer workflows.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 card-hover"
              >
                <div className="w-11 h-11 bg-brand-50 dark:bg-brand-950/50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="text-brand-600 dark:text-brand-400 text-2xl" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-bold text-slate-900 dark:text-white text-center mb-14"
          >
            Loved by developers
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, avatar, text }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{name}</p>
                    <p className="text-xs text-slate-400">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-brand-600 relative overflow-hidden noise">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-800 opacity-80" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Ready to join the community?
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            Free forever. No ads. Just developers helping developers.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-colors shadow-lg text-base">
            Create Free Account <RiArrowRightLine />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <RiCodeSSlashFill className="text-brand-600" />
            <span>© 2025 DevConnect. Open source & free forever.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><RiGithubFill className="text-xl" /></a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><RiTwitterXFill className="text-xl" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
