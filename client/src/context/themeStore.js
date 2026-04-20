import { create } from 'zustand';

const getInitialTheme = () => {
  const stored = localStorage.getItem('theme');
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const useThemeStore = create((set) => ({
  isDark: getInitialTheme(),

  toggleTheme: () =>
    set((state) => {
      const next = !state.isDark;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return { isDark: next };
    }),

  applyTheme: () => {
    const isDark = getInitialTheme();
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  },
}));

export default useThemeStore;
