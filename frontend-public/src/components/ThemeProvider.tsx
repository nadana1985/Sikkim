'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return safe defaults during SSR or when context is not available
    return {
      theme: 'system' as Theme,
      resolvedTheme: 'light' as 'light' | 'dark',
      setTheme: () => {},
    };
  }
  return context;
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    return (localStorage.getItem('monastery360-theme') as Theme) || 'system';
  } catch {
    return 'system';
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Resolve the actual theme
  const resolveTheme = useCallback((t: Theme) => {
    const resolved = t === 'system' ? getSystemTheme() : t;
    setResolvedTheme(resolved);

    // Apply to document
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    const stored = getStoredTheme();
    setThemeState(stored);
    resolveTheme(stored);
    setMounted(true);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const current = getStoredTheme();
      if (current === 'system') {
        resolveTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [resolveTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('monastery360-theme', newTheme);
    } catch {
      // localStorage not available
    }
    resolveTheme(newTheme);
  }, [resolveTheme]);

  // Prevent hydration mismatch by rendering children only after mount
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'system', resolvedTheme: 'light', setTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
