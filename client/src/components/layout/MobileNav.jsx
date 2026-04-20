import { NavLink } from 'react-router-dom';
import {
  RiHome4Line, RiHome4Fill,
  RiCompassLine, RiCompassFill,
  RiBellLine, RiBellFill,
  RiUser3Line, RiUser3Fill,
} from 'react-icons/ri';
import useAuthStore from '../../context/authStore';
import useNotificationStore from '../../context/notificationStore';

export default function MobileNav() {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const navItems = [
    { to: '/feed', icon: RiHome4Line, activeIcon: RiHome4Fill, label: 'Home' },
    { to: '/explore', icon: RiCompassLine, activeIcon: RiCompassFill, label: 'Explore' },
    { to: '/notifications', icon: RiBellLine, activeIcon: RiBellFill, label: 'Alerts', badge: unreadCount },
    { to: `/profile/${user?.username}`, icon: RiUser3Line, activeIcon: RiUser3Fill, label: 'Profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon: Icon, activeIcon: ActiveIcon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-brand-600' : 'text-slate-500 dark:text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-2xl relative">
                  {isActive ? <ActiveIcon /> : <Icon />}
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
