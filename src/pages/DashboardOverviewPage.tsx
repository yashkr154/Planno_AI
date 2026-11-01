import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  MapPin,
  Clock,
  Building2,
  CheckSquare,
  Edit3,
  Check
} from 'lucide-react';
import { useEvent } from '../contexts/EventContext';
import { formatCurrency, formatDate } from '../lib/utils';

export const DashboardOverviewPage: React.FC = () => {
  const { events, activeEvent, tasks, guests, toggleTask, updateEvent, getEventMetrics } = useEvent();
  const navigate = useNavigate();

  const activeEventId = activeEvent ? activeEvent.id : '';
  const metrics = activeEventId ? getEventMetrics(activeEventId) : null;

  const activeTasks = tasks.filter((t) => t.eventId === activeEventId);
  const activeGuests = guests.filter((g) => g.eventId === activeEventId);

  const [editBudgetModalOpen, setEditBudgetModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState(activeEvent?.budget || 1000000);

  const handleUpdateBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeEvent && newBudget > 0) {
      updateEvent(activeEvent.id, { budget: newBudget });
      setEditBudgetModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-google-blue/10 via-purple-500/10 to-google-red/10 dark:from-google-blue/20 dark:to-purple-900/20 p-6 rounded-3xl border border-google-blue/20">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-google-blue uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Command Center Overview</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {activeEvent ? activeEvent.title : 'Welcome to PlanoAI'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 flex items-center space-x-3">
            {activeEvent && (
              <>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDate(activeEvent.date)}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeEvent.location}, {activeEvent.city}</span>
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setNewBudget(activeEvent?.budget || 1000000);
              setEditBudgetModalOpen(true);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-google-blue font-bold text-xs flex items-center space-x-1.5 shadow-sm border border-google-blue/30"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Event Budget</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/ai-planner')}
            className="px-4 py-2.5 rounded-xl bg-google-gradient text-white font-semibold text-xs flex items-center space-x-2 shadow-md hover:opacity-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Event Plan</span>
          </button>
        </div>
      </div>

      {/* 90% Budget Threshold Alert Banner */}
      {metrics && metrics.percentSpent >= 90 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <div className="font-bold text-sm">Budget Threshold Warning ({metrics.percentSpent}% Spent)</div>
              <div className="text-xs text-amber-700 dark:text-amber-300">
                You have reached {metrics.percentSpent}% of total event budget ({formatCurrency(metrics.actualCost, activeEvent?.currency)} of {formatCurrency(metrics.totalBudget, activeEvent?.currency)}).
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setNewBudget(activeEvent?.budget || 1000000);
                setEditBudgetModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-semibold text-xs shrink-0 hover:bg-amber-600 transition-colors"
            >
              Increase Budget
            </button>
          </div>
        </div>
      )}

      {/* Vital Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Budget Card with Inline Edit Trigger */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 relative group">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Budget Allocated</span>
            <button
              onClick={() => {
                setNewBudget(activeEvent?.budget || 1000000);
                setEditBudgetModalOpen(true);
              }}
              className="p-1.5 rounded-lg bg-google-blue/10 text-google-blue hover:bg-google-blue hover:text-white transition-colors"
              title="Edit Budget"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(metrics?.totalBudget || 0, activeEvent?.currency)}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>Actual Incurred:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatCurrency(metrics?.actualCost || 0, activeEvent?.currency)}
            </span>
          </div>
        </div>

        {/* Confirmed RSVPs */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Attending RSVPs</span>
            <div className="p-2 rounded-xl bg-google-green/10 text-google-green">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {metrics?.attendingGuests || 0} / {activeEvent?.guestCount || 0}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>Response Rate:</span>
            <span className="font-semibold text-google-green">
              {metrics?.totalGuests ? Math.round(((metrics.attendingGuests) / metrics.totalGuests) * 100) : 0}% Confirmed
            </span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Checklist Tasks</span>
            <div className="p-2 rounded-xl bg-google-yellow/10 text-google-yellow">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {metrics?.pendingTasksCount || 0}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>Completed:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {activeTasks.length - (metrics?.pendingTasksCount || 0)} of {activeTasks.length}
            </span>
          </div>
        </div>

        {/* Total Events Managed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Events Portfolio</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {events.length}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>Active Status:</span>
            <span className="font-semibold text-google-blue">
              {events.filter((e) => e.status === 'planning' || e.status === 'confirmed').length} In Progress
            </span>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Task Checklist & Financial Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Urgent Checklist Tasks */}
        <div className="lg:col-span-7 bg-white dark:bg-brand-charcoal p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Upcoming Tasks & Rehearsal Milestones
              </h3>
              <p className="text-xs text-slate-500">Priority items for {activeEvent?.title}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/calendar')}
              className="text-xs font-semibold text-google-blue hover:underline flex items-center space-x-1"
            >
              <span>View Timeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeTasks.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No tasks created yet for this event. Use AI Planner to generate a checklist.
              </div>
            ) : (
              activeTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-google-blue/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        task.completed
                          ? 'bg-google-green border-google-green text-white'
                          : 'border-slate-300 dark:border-slate-700 bg-transparent'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="truncate">
                      <div
                        className={`text-xs font-semibold ${
                          task.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center space-x-2">
                        <span>{task.category}</span>
                        <span>•</span>
                        <span>Due {formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      task.priority === 'high'
                        ? 'bg-google-red/10 text-google-red'
                        : task.priority === 'medium'
                        ? 'bg-google-yellow/10 text-amber-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions & Event Snapshot */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Event Card Spotlight */}
          {activeEvent && (
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-google-blue text-white">
                  {activeEvent.type}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Theme: {activeEvent.theme || 'Modern'}
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold">{activeEvent.title}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{activeEvent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase">Venue & Location</div>
                  <div className="font-semibold text-slate-200 truncate">{activeEvent.location}, {activeEvent.city}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase">Allocated Budget</div>
                  <div className="font-semibold text-google-yellow">{formatCurrency(activeEvent.budget, activeEvent.currency)}</div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => navigate('/dashboard/invitations')}
                  className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                >
                  Invitations
                </button>
                <button
                  onClick={() => navigate('/dashboard/finance')}
                  className="w-full py-2 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-semibold text-xs transition-colors"
                >
                  Manage Finance
                </button>
              </div>
            </div>
          )}

          {/* Quick Action Navigation Grid */}
          <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/dashboard/ai-planner')}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-google-blue/10 hover:text-google-blue text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-200/60 dark:border-slate-800 transition-colors text-left"
              >
                <Sparkles className="w-4 h-4 text-google-blue" />
                <span>AI Generator</span>
              </button>

              <button
                onClick={() => navigate('/dashboard/venues')}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-google-red/10 hover:text-google-red text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-200/60 dark:border-slate-800 transition-colors text-left"
              >
                <Building2 className="w-4 h-4 text-google-red" />
                <span>Find Venues</span>
              </button>

              <button
                onClick={() => navigate('/dashboard/guests')}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-google-green/10 hover:text-google-green text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-200/60 dark:border-slate-800 transition-colors text-left"
              >
                <Users className="w-4 h-4 text-google-green" />
                <span>Manage RSVPs</span>
              </button>

              <button
                onClick={() => navigate('/dashboard/finance')}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-google-yellow/10 hover:text-google-yellow text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-200/60 dark:border-slate-800 transition-colors text-left"
              >
                <DollarSign className="w-4 h-4 text-google-yellow" />
                <span>Ledger Export</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Budget Modal */}
      {editBudgetModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Edit Total Event Budget
            </h3>
            <p className="text-xs text-slate-500">
              Update total allocated budget limit for <strong className="text-slate-700 dark:text-slate-200">{activeEvent?.title}</strong>.
            </p>

            <form onSubmit={handleUpdateBudgetSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Budget ({activeEvent?.currency || 'INR'} ₹)
                </label>
                <input
                  type="number"
                  required
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  step={10000}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-google-blue focus:outline-none focus:border-google-blue"
                />
              </div>

              {/* Quick Budget Presets */}
              <div className="flex flex-wrap gap-1.5">
                {[500000, 1000000, 1500000, 2500000, 5000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setNewBudget(amt)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-google-blue hover:text-white text-[11px] font-semibold transition-colors"
                  >
                    {formatCurrency(amt, 'INR')}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditBudgetModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-google-blue text-white font-bold flex items-center space-x-1 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Budget</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
