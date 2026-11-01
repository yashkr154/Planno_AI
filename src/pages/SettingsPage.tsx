import React, { useState } from 'react';
import {
  Settings,
  User,
  DollarSign,
  Moon,
  Sun,
  Download,
  Trash2,
  CheckCircle2,
  Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useEvent } from '../contexts/EventContext';
import { exportToCSV } from '../lib/utils';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { events, tasks, expenses, guests } = useEvent();

  const [name, setName] = useState(user?.name || 'Yash Kumar');
  const [email, setEmail] = useState(user?.email || 'yashkr5006@gmail.com');
  const [role, setRole] = useState(user?.role || 'Event Director');
  const [currency, setCurrency] = useState(user?.preferredCurrency || 'INR');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, role, preferredCurrency: currency });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportFullJSON = () => {
    const backupData = {
      user,
      events,
      tasks,
      expenses,
      guests,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plannoai_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Account & Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize currency formatting, themes, profile information, and JSON data backup.
        </p>
      </div>

      {/* Profile Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Organizer Profile
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Organizer Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                <option value="INR">Indian Rupee (₹ INR)</option>
                <option value="USD">US Dollar ($ USD)</option>
                <option value="EUR">Euro (€ EUR)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-bold text-google-green flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile Updated!</span>
              </span>
            ) : (
              <div />
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* Theme Preference */}
      <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
            Appearance Mode
          </h3>
          <p className="text-xs text-slate-500">
            Switch between Google Clean Light Mode and Deep Navy Obsidian Dark Mode.
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center space-x-2 transition-colors"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Full Data Backup */}
      <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
            Workspace Data Export
          </h3>
          <p className="text-xs text-slate-500">
            Download full JSON export of all events, tasks, budgets, and attendee records.
          </p>
        </div>

        <button
          onClick={handleExportFullJSON}
          className="px-4 py-2.5 rounded-xl bg-google-gradient text-white font-bold text-xs flex items-center space-x-2 shadow-md hover:opacity-95 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download JSON Backup</span>
        </button>
      </div>

    </div>
  );
};
