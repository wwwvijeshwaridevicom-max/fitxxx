'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-brand-surface-cardDark" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative p-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 border ${
        isDark 
          ? 'bg-brand-charcoal text-white border-brand-surface-borderDark hover:border-brand-crimson/50' 
          : 'bg-brand-surface-light text-brand-black border-brand-surface-borderLight hover:border-brand-crimson/50'
      } ${className}`}
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="w-4 h-4 text-brand-charcoal transition-transform duration-300" />
      )}
    </button>
  );
}
