import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { loginWithGoogle, loginWithEmail, loginWithDemo, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    try {
      await loginWithEmail(email, password);
      navigate(fromPath, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      navigate(fromPath, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Google sign-in was canceled or failed.');
    }
  };

  const handleQuickDemo = async () => {
    setError(null);
    try {
      await loginWithDemo('demo.organizer@plannoai.com', 'Demo Organizer');
      navigate(fromPath, { replace: true });
    } catch (err: any) {
      setError('Could not launch demo session.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-softWhite dark:bg-brand-navy flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-xl bg-google-gradient flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
            Plano<span className="text-google-blue">AI</span>
          </span>
        </Link>
        <h2 className="mt-6 font-display text-2xl font-bold text-slate-900 dark:text-white">
          Sign in to Event Command Center
        </h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Sign in with Google Account, Email Credentials, or Instant Demo
        </p>
      </div>

      {/* Auth Box */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-brand-charcoal py-8 px-4 shadow-xl border border-slate-200/80 dark:border-slate-800 sm:rounded-2xl sm:px-10 space-y-4">
          
          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-google-red/10 border border-google-red/30 text-google-red text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700 shadow-sm transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-google-green" />
            <span>Sign in with Google Account</span>
          </button>

          {/* Quick Demo Launch Button */}
          <button
            onClick={handleQuickDemo}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-google-blue/10 dark:bg-google-blue/20 hover:bg-google-blue/20 text-google-blue font-bold text-xs border border-google-blue/30 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Instant Guest Demo Login</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-brand-charcoal px-2 text-slate-400 font-semibold">
                Or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-google-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-google-blue"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don't have an account?{' '}
            <Link to="/signup" className="text-google-blue font-semibold hover:underline">
              Create one now
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { loginWithEmail, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      await loginWithEmail(email, password, name);
      navigate(fromPath, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      navigate(fromPath, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Google sign-up was canceled or failed.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-softWhite dark:bg-brand-navy flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-xl bg-google-gradient flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
            Plano<span className="text-google-blue">AI</span>
          </span>
        </Link>
        <h2 className="mt-6 font-display text-2xl font-bold text-slate-900 dark:text-white">
          Create Your Organizer Account
        </h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Get started planning events in any city across India
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-brand-charcoal py-8 px-4 shadow-xl border border-slate-200/80 dark:border-slate-800 sm:rounded-2xl sm:px-10 space-y-4">
          
          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-google-red/10 border border-google-red/30 text-google-red text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700 shadow-sm transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-google-green" />
            <span>Sign up with Google Account</span>
          </button>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-google-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-google-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-google-blue"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-google-gradient text-white font-bold text-sm shadow-md hover:opacity-95 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-google-blue font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
