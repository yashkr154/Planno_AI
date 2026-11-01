import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Mail,
  CheckSquare,
  Briefcase,
  Image,
  Settings,
  ChevronDown,
  Plus,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  Search,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useEvent } from '../../contexts/EventContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { GeminiChatbot } from '../chat/GeminiChatbot';

export const DashboardLayout: React.FC = () => {
  const { events, activeEvent, setActiveEventId } = useEvent();
  const { theme, toggleTheme } = useTheme();
  const { user, loginWithGoogle, logout, firebaseUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Planner', path: '/dashboard/ai-planner', icon: Sparkles, badge: 'AI' },
    { name: 'Events', path: '/dashboard/events', icon: Calendar },
    { name: 'Venue Discovery', path: '/dashboard/venues', icon: Building2 },
    { name: 'Guest & RSVPs', path: '/dashboard/guests', icon: Users },
    { name: 'Invitations', path: '/dashboard/invitations', icon: Mail },
    { name: 'Budget & Finance', path: '/dashboard/finance', icon: DollarSign },
    { name: 'Timeline & Calendar', path: '/dashboard/calendar', icon: CheckSquare },
    { name: 'Vendors', path: '/dashboard/vendors', icon: Briefcase },
    { name: 'Gallery', path: '/dashboard/gallery', icon: Image },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-navy text-slate-800 dark:text-slate-100 flex flex-col md:flex-row transition-colors relative">
      
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white dark:bg-brand-charcoal border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-google-gradient flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Plano<span className="text-google-blue">AI</span>
          </span>
        </Link>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-brand-charcoal border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="hidden md:flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-google-gradient flex items-center justify-center text-white shadow-md shadow-google-blue/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white leading-none">
                  Plano<span className="text-google-blue">AI</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                  Workspace
                </span>
              </div>
            </Link>
          </div>

          {/* Active Event Selector */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
              Active Event
            </div>
            <div className="relative">
              <button
                onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-left transition-all"
              >
                <div className="truncate pr-2">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                    {activeEvent ? activeEvent.title : 'Select Event'}
                  </div>
                  {activeEvent && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {activeEvent.city} • {formatCurrency(activeEvent.budget, activeEvent.currency)}
                    </div>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
              </button>

              {/* Event Dropdown Menu */}
              {eventDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-1 space-y-1">
                  <div className="max-h-48 overflow-y-auto space-y-0.5">
                    {events.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => {
                          setActiveEventId(evt.id);
                          setEventDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition-colors ${
                          activeEvent?.id === evt.id
                            ? 'bg-google-blue/10 text-google-blue font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="truncate">{evt.title}</span>
                        {activeEvent?.id === evt.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                  <div className="pt-1 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setEventDropdownOpen(false);
                        navigate('/dashboard/ai-planner');
                      }}
                      className="w-full flex items-center space-x-2 p-2 rounded-lg text-xs font-semibold text-google-blue hover:bg-google-blue/10 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create New Event with AI</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/dashboard'
                  ? location.pathname === '/dashboard'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-google-blue text-white shadow-md shadow-google-blue/20 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-google-blue'
                          : 'bg-google-blue/10 text-google-blue dark:bg-google-blue/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 truncate">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-google-blue text-white flex items-center justify-center font-bold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate flex items-center space-x-1">
                  <span>{user?.name || 'Organizer'}</span>
                  {firebaseUser && (
                    <span title="Google Auth Verified">
                      <ShieldCheck className="w-3.5 h-3.5 text-google-green" />
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || ''}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-google-red hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Workspace Top Bar (Desktop) */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-white dark:bg-brand-charcoal border-b border-slate-200 dark:border-slate-800 transition-colors">
          
          {/* Quick Search */}
          <div className="flex items-center space-x-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks, venues, guests, expenses..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-google-blue transition-colors"
              />
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-4">
            
            {!firebaseUser && (
              <button
                onClick={loginWithGoogle}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-google-green" />
                <span>Google Sign-In</span>
              </button>
            )}

            {/* AI Generator CTA */}
            <button
              onClick={() => navigate('/dashboard/ai-planner')}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Planner Wizard</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'organizer'}`}
                  alt={user?.name || 'Profile'}
                  className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">{user?.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
                  </div>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Account Settings
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-google-red hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Floating Multi-Turn Gemini Chatbot Component */}
        <GeminiChatbot />

      </div>

    </div>
  );
};
