import { create } from 'zustand';
import api from '../utils/api';
import { connectSocket, disconnectSocket } from '../utils/socket';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      connectSocket(data._id);
      set({ user: data, token: data.token, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      connectSocket(data._id);
      set({ user: data, token: data.token, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    disconnectSocket();
    set({ user: null, token: null });
  },

  updateUser: (updatedData) => {
    const merged = { ...get().user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(merged));
    set({ user: merged });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
