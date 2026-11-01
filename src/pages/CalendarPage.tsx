import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  CheckSquare,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useEvent } from '../contexts/EventContext';
import { formatDate } from '../lib/utils';

export const CalendarPage: React.FC = () => {
  const { activeEvent, tasks, addTask, toggleTask, deleteTask } = useEvent();

  const activeEventId = activeEvent ? activeEvent.id : '';
  const eventTasks = tasks.filter((t) => t.eventId === activeEventId);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [syncingCalendar, setSyncingCalendar] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState(activeEvent?.date || '2026-11-20');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [assignedTo, setAssignedTo] = useState('Yash Kumar');

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !activeEventId) return;

    addTask({
      eventId: activeEventId,
      title,
      category,
      dueDate,
      completed: false,
      priority,
      assignedTo,
    });

    setAddModalOpen(false);
    setTitle('');
  };

  const handleGoogleCalendarSync = () => {
    setSyncingCalendar(true);
    setTimeout(() => {
      setSyncingCalendar(false);
      setSyncedSuccess(true);
      setTimeout(() => setSyncedSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Milestones & Google Calendar Sync
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chronological task checklists, rehearsals, and calendar OAuth synchronization for {activeEvent?.title}.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleGoogleCalendarSync}
            disabled={syncingCalendar}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            {syncingCalendar ? (
              <RefreshCw className="w-4 h-4 animate-spin text-google-blue" />
            ) : (
              <CalendarIcon className="w-4 h-4 text-google-blue" />
            )}
            <span>{syncedSuccess ? 'Synced to Google Calendar!' : 'Sync to Google Calendar'}</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-semibold text-xs flex items-center space-x-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone Task</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-brand-charcoal rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Chronological Checklist
          </h3>
          <span className="text-xs text-slate-500">
            {eventTasks.filter((t) => t.completed).length} of {eventTasks.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {eventTasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No tasks logged for this event. Use "Add Milestone Task" or "AI Planner" to create tasks.
            </div>
          ) : (
            eventTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  task.completed
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-google-blue/30 shadow-xs'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      task.completed
                        ? 'bg-google-green border-google-green text-white'
                        : 'border-slate-300 dark:border-slate-700 bg-transparent'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <div className="truncate">
                    <div
                      className={`text-sm font-semibold ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                      <span>Category: {task.category}</span>
                      <span>•</span>
                      <span>Assigned: {task.assignedTo || 'Unassigned'}</span>
                      <span>•</span>
                      <span>Due {formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      task.priority === 'high'
                        ? 'bg-google-red/10 text-google-red'
                        : task.priority === 'medium'
                        ? 'bg-google-yellow/10 text-amber-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-google-red hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Add Milestone Task
            </h3>

            <form onSubmit={handleAddTaskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Confirm Catering Menu with Chef"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Venue / Catering / Decor"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-google-blue text-white font-semibold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
