import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './context/authStore';
import useThemeStore from './context/themeStore';
import useNotificationStore from './context/notificationStore';
import { connectSocket, getSocket } from './utils/socket';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import ExplorePage from './pages/ExplorePage';
import PostDetailPage from './pages/PostDetailPage';

// Layout
import AppLayout from './components/layout/AppLayout';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user ? <Navigate to="/feed" replace /> : children;
};

export default function App() {
  const { user } = useAuthStore();
  const { applyTheme } = useThemeStore();
  const { addNotification, fetchUnreadCount } = useNotificationStore();

  // Apply saved theme on mount
  useEffect(() => {
    applyTheme();
  }, []);

  // Connect socket and listen for notifications
  useEffect(() => {
    if (user) {
      const socket = connectSocket(user._id);
      fetchUnreadCount();

      socket.on('notification', (notification) => {
        addNotification(notification);
      });

      return () => {
        socket.off('notification');
      };
    }
  }, [user?._id]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '12px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected (inside app shell) */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
