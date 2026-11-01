import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Plus,
  MapPin,
  Users,
  DollarSign,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useEvent } from '../contexts/EventContext';
import { EventStatus, EventType } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';

export const EventsPage: React.FC = () => {
  const { events, activeEvent, setActiveEventId, addEvent, deleteEvent } = useEvent();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('wedding');
  const [date, setDate] = useState('2026-12-15');
  const [city, setCity] = useState('Ranchi');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState(1000000);
  const [guestCount, setGuestCount] = useState(200);

  const filteredEvents = events.filter((e) => {
    if (statusFilter === 'all') return true;
    return e.status === statusFilter;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addEvent({
      title,
      type,
      description: `${type} event planned for ${guestCount} guests in ${city}.`,
      date,
      location: location || `${city} Banquet Hall`,
      city: city || 'Ranchi',
      guestCount,
      budget,
      estimatedCost: Math.round(budget * 0.9),
      actualCost: 0,
      disbursedAmount: 0,
      outstandingAmount: Math.round(budget * 0.9),
      status: 'planning',
      theme: 'Modern Celebration',
      currency: 'INR',
    });

    setModalOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Pan-India Event Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your full portfolio of weddings, hackathons, and corporate conferences across India.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard/ai-planner')}
            className="px-4 py-2.5 rounded-xl bg-google-gradient text-white font-semibold text-xs flex items-center space-x-2 shadow-md hover:opacity-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate with AI</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-semibold text-xs flex items-center space-x-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {['all', 'planning', 'confirmed', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              statusFilter === tab
                ? 'bg-google-blue text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Events Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => {
          const isActive = activeEvent?.id === evt.id;

          return (
            <div
              key={evt.id}
              className={`p-6 rounded-3xl bg-white dark:bg-brand-charcoal border transition-all space-y-4 flex flex-col justify-between ${
                isActive
                  ? 'border-google-blue ring-2 ring-google-blue/20 shadow-lg'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                
                {/* Type & Status Row */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-google-blue/10 text-google-blue dark:bg-google-blue/20">
                    {evt.type}
                  </span>
                  <div className="flex items-center space-x-2">
                    {isActive && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-google-green/10 text-google-green">
                        Active Selection
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        evt.status === 'completed'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          : 'bg-google-yellow/10 text-amber-600'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{evt.description}</p>
                </div>

                {/* Event Details Grid */}
                <div className="pt-2 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{formatDate(evt.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{evt.location}, {evt.city}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center space-x-1 text-slate-500">
                      <Users className="w-3.5 h-3.5" />
                      <span>{evt.guestCount} Guests</span>
                    </span>
                    <span className="font-extrabold text-google-blue">
                      {formatCurrency(evt.budget, evt.currency)}
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {!isActive ? (
                  <button
                    onClick={() => setActiveEventId(evt.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-google-blue hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Select as Active
                  </button>
                ) : (
                  <span className="text-xs font-bold text-google-green flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Current Workspace</span>
                  </span>
                )}

                <button
                  onClick={() => deleteEvent(evt.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-google-red hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Create Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Create New Event
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ranchi Grand Wedding Reception"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="wedding">Wedding</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="conference">Conference</option>
                    <option value="birthday">Birthday</option>
                    <option value="corporate">Corporate</option>
                    <option value="party">Party</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    City (Anywhere in India)
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Ranchi, Jaipur, Mumbai, Delhi"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Venue Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Radisson / Banquet Hall"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Guest Count
                  </label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-google-blue text-white font-semibold"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
