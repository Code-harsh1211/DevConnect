import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import MobileNav from './MobileNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex">
      {/* Left Sidebar — hidden on mobile */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 xl:ml-72 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24 lg:pb-6">
          <Outlet />
        </div>
      </main>

      {/* Right panel — desktop only */}
<aside className="group hidden xl:flex flex-col w-80 fixed top-0 right-[-300px] h-full z-30 transition-all duration-300 hover:right-0">
  <RightPanel />
</aside>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
