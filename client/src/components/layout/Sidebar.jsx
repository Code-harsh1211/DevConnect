import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiHome4Line, RiHome4Fill,
  RiCompassLine, RiCompassFill,
  RiBellLine, RiBellFill,
  RiUser3Line, RiUser3Fill,
  RiLogoutBoxLine,
  RiMoonLine, RiSunLine,
  RiCodeSSlashFill,
} from 'react-icons/ri';
import useAuthStore from '../../context/authStore';
import useThemeStore from '../../context/themeStore';
import useNotificationStore from '../../context/notificationStore';
import Avatar from '../common/Avatar';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/feed', icon: RiHome4Line, activeIcon: RiHome4Fill, label: 'Home' },
    { to: '/explore', icon: RiCompassLine, activeIcon: RiCompassFill, label: 'Explore' },
    {
      to: '/notifications',
      icon: RiBellLine,
      activeIcon: RiBellFill,
      label: 'Notifications',
      badge: unreadCount,
    },
    {
      to: `/profile/${user?.username}`,
      icon: RiUser3Line,
      activeIcon: RiUser3Fill,
      label: 'Profile',
    },
  ];

  return (
    <div className="flex flex-col h-full px-4 py-6 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      {/* Logo */}
      <NavLink to="/feed" className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-glow">
          <RiCodeSSlashFill className="text-white text-xl" />
        </div>
        <span className="font-display text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Dev<span className="text-brand-600">Connect</span>
        </span>
      </NavLink>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon: Icon, activeIcon: ActiveIcon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl relative">
                  {isActive ? <ActiveIcon /> : <Icon />}
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="nav-link w-full text-left"
        >
          <span className="text-xl">{isDark ? <RiSunLine /> : <RiMoonLine />}</span>
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Logout */}
        <button onClick={handleLogout} className="nav-link w-full text-left text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
          <RiLogoutBoxLine className="text-xl" />
          <span>Logout</span>
        </button>

        {/* User info */}
        <NavLink to={`/profile/${user?.username}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mt-2">
          <Avatar src={user?.avatar} name={user?.name} size={36} />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{user?.username}</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
}
