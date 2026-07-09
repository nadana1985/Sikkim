'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mountain, Menu, X, Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Monasteries', href: '/monasteries' },
  { name: 'Map', href: '/map' },
  { name: 'Festivals', href: '/festivals' },
  { name: 'About', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themeOptions = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Monastery<span className="text-orange-600">360</span>
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side: theme toggle + mobile menu */}
          <div className="flex items-center space-x-2">
            {/* Theme toggle */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                onBlur={() => setTimeout(() => setShowThemeMenu(false), 150)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Toggle theme"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : theme === 'light' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Monitor className="h-5 w-5" />
                )}
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTheme(option.value);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center px-3 py-2 text-sm transition-colors ${
                        theme === option.value
                          ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <option.icon className="h-4 w-4 mr-2" />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-orange-600 focus:outline-none focus:text-orange-600"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
