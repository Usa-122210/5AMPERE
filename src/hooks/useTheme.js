import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '5ampere-theme';

function getSystemPreference() {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // localStorage may be unavailable
  }
  return null;
}

function getInitialTheme() {
  return getSavedTheme() || getSystemPreference();
}

export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme);

  const isDark = theme === 'dark';

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;

    // Add transition class briefly for smooth theme change
    root.classList.add('theme-transition');
    root.classList.toggle('dark', theme === 'dark');

    const timeout = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 350);

    return () => clearTimeout(timeout);
  }, [theme]);

  // Listen for OS preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      // Only follow OS if user hasn't manually set a preference
      if (!getSavedTheme()) {
        setThemeState(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return useMemo(() => ({
    theme,
    isDark,
    setTheme,
    toggleTheme,
  }), [theme, isDark, setTheme, toggleTheme]);
}

