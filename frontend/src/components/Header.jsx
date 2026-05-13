import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ShieldIcon from '@mui/icons-material/Shield';

export default function Header() {
  const { username, isAuthenticated, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between py-4 px-2 mb-6 animate-fade-in" role="banner">
      {/* Logo */}
      <div className="flex items-center gap-2" aria-label="TrustCheck AI Home">
        <ShieldIcon className="text-brand-600 dark:text-brand-400" fontSize="medium" />
        <span className="text-sm font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          TrustCheck AI
        </span>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 focus-ring"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? (
            <LightModeIcon fontSize="small" className="text-yellow-400" />
          ) : (
            <DarkModeIcon fontSize="small" className="text-gray-600" />
          )}
        </button>

        {/* User profile dropdown */}
        {isAuthenticated && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 focus-ring"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <AccountCircleIcon fontSize="small" className="text-brand-600 dark:text-brand-400" />
              <span className="text-sm font-semibold hidden sm:inline">{username}</span>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-xl animate-fade-in z-50"
                role="menu"
              >
                <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-bold truncate mt-1">{username}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-xl transition-colors"
                  role="menuitem"
                >
                  <LogoutIcon fontSize="small" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
