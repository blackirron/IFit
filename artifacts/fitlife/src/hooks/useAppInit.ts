import { useState, useEffect } from 'react';
import { seedData, useFitLifeData } from './useData';

export function useAppInit() {
  const [isReady, setIsReady] = useState(false);
  const data = useFitLifeData();

  useEffect(() => {
    if (!data.seeded) {
      seedData(data);
    }
    setIsReady(true);
  }, [data.seeded]);

  return isReady;
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('fitlife_theme');
      if (stored === '"dark"' || stored === 'dark') return 'dark';
      if (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    window.localStorage.setItem('fitlife_theme', JSON.stringify(theme));
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return { theme, toggleTheme };
}
