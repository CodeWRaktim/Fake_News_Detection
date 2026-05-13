import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import ShieldIcon from '@mui/icons-material/Shield';
import { useTheme } from '../context/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { addToast } = useToast();
  const { dark, toggleTheme } = useTheme();

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '', width: '0%' };
    if (password.length < 4) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (password.length < 6) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
    if (password.length < 8) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(username.trim(), password);
        addToast('Welcome back! Login successful.', 'success');
      } else {
        await register(username.trim(), password);
        addToast('Account created! You can now login.', 'success');
        setMode('login');
        setPassword('');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Theme toggle in corner */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 focus-ring border border-gray-200 dark:border-gray-700"
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? (
          <LightModeIcon fontSize="small" className="text-yellow-400" />
        ) : (
          <DarkModeIcon fontSize="small" className="text-gray-600" />
        )}
      </button>

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <ShieldIcon className="text-brand-600 dark:text-brand-400" fontSize="large" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            TrustCheck AI
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {mode === 'login' ? 'Sign in to verify news authenticity' : 'Create your account to get started'}
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1" role="tablist">
              <button
                role="tab"
                aria-selected={mode === 'login'}
                onClick={() => { setMode('login'); setErrors({}); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Login
              </button>
              <button
                role="tab"
                aria-selected={mode === 'register'}
                onClick={() => { setMode('register'); setErrors({}); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  mode === 'register'
                    ? 'bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Register
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                id="auth-username"
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
                }}
                error={errors.username}
                autoComplete="username"
                aria-required="true"
              />

              <div>
                <Input
                  id="auth-password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  error={errors.password}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  aria-required="true"
                />

                {/* Password strength meter — only on register */}
                {mode === 'register' && password && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Password strength: <span className="font-semibold">{strength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          Built with Scikit-Learn, Flask & Explainable AI (LIME)
        </p>
      </div>
    </div>
  );
}
