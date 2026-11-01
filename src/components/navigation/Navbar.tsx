import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Moon, Sun, ArrowRight, Menu, X, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-brand-navy/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-google-gradient flex items-center justify-center text-white shadow-md shadow-google-blue/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Plano<span className="text-google-blue">AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 -mt-1">
                AI Event Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-google-blue dark:hover:text-google-blue transition-colors">
              Features
            </a>
            <a href="#ai-planner" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-google-blue dark:hover:text-google-blue transition-colors">
              AI Planner
            </a>
            <a href="#venues" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-google-blue dark:hover:text-google-blue transition-colors">
              Venues
            </a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-google-blue dark:hover:text-google-blue transition-colors">
              Community
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-semibold text-sm shadow-md shadow-google-blue/25 transition-all hover:shadow-lg"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-google-blue transition-colors px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-google-gradient text-white font-bold text-sm shadow-md transition-all hover:opacity-95 hover:scale-[1.02]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-brand-navy border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 dark:text-slate-200 py-2"
          >
            Features
          </a>
          <a
            href="#ai-planner"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 dark:text-slate-200 py-2"
          >
            AI Planner
          </a>
          <a
            href="#venues"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 dark:text-slate-200 py-2"
          >
            Venues
          </a>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-semibold text-sm"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-google-gradient text-white font-bold text-sm shadow-md"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
