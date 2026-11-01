import React, { useState } from 'react';
import {
  Users,
  Plus,
  Mail,
  QrCode,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Download,
  Upload,
  Search,
  Filter
} from 'lucide-react';
import { useEvent } from '../contexts/EventContext';
import { Guest } from '../types';
import { exportToCSV } from '../lib/utils';

export const GuestManagementPage: React.FC = () => {
  const { activeEvent, guests, addGuest, updateGuestRSVP, deleteGuest, sendGuestInvitation } = useEvent();

  const activeEventId = activeEvent ? activeEvent.id : '';
  const eventGuests = guests.filter((g) => g.eventId === activeEventId);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeQRGuest, setActiveQRGuest] = useState<Guest | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [diet, setDiet] = useState('Vegetarian');
  const [group, setGroup] = useState('General');

  const filteredGuests = eventGuests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || g.rsvpStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !activeEventId) return;

    addGuest({
      eventId: activeEventId,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: phone || '+91 98765 43210',
      rsvpStatus: 'pending',
      plusOne: false,
      dietPreferences: diet,
      group,
    });

    setAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const handleExportCSV = () => {
    exportToCSV(`guest_list_${activeEvent?.title.replace(/\s+/g, '_')}.csv`, eventGuests);
  };

  const attendingCount = eventGuests.filter((g) => g.rsvpStatus === 'attending').length;
  const pendingCount = eventGuests.filter((g) => g.rsvpStatus === 'pending').length;
  const declinedCount = eventGuests.filter((g) => g.rsvpStatus === 'declined').length;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Guest Management & RSVP Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track attendee RSVPs, table allocations, dietary preferences, and check-in QR codes for {activeEvent?.title}.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-semibold text-xs flex items-center space-x-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* RSVP Status Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Attending Confirmed</div>
            <div className="text-2xl font-extrabold text-google-green mt-1">{attendingCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-google-green/10 text-google-green">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Pending Responses</div>
            <div className="text-2xl font-extrabold text-amber-500 mt-1">{pendingCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Declined / Unavailable</div>
            <div className="text-2xl font-extrabold text-google-red mt-1">{declinedCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-google-red/10 text-google-red">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guest by name, email, phone..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-google-blue"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {['all', 'attending', 'pending', 'declined'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === status
                  ? 'bg-google-blue text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white dark:bg-brand-charcoal rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="p-4">Attendee Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Group / Dietary</th>
                <th className="p-4">RSVP Status</th>
                <th className="p-4">QR Token</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No guest records found for this view. Click "Add Guest" to populate attendee list.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {guest.name}
                      {guest.tableNumber && (
                        <div className="text-[10px] font-normal text-slate-400">{guest.tableNumber}</div>
                      )}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div>{guest.email}</div>
                      <div className="text-[10px] text-slate-400">{guest.phone}</div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">{guest.group || 'General'}</span>
                      <div className="text-[10px] text-slate-400">{guest.dietPreferences || 'Regular'}</div>
                    </td>
                    <td className="p-4">
                      <select
                        value={guest.rsvpStatus}
                        onChange={(e) =>
                          updateGuestRSVP(guest.id, e.target.value as 'attending' | 'declined' | 'pending')
                        }
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider focus:outline-none border-none cursor-pointer ${
                          guest.rsvpStatus === 'attending'
                            ? 'bg-google-green/10 text-google-green'
                            : guest.rsvpStatus === 'declined'
                            ? 'bg-google-red/10 text-google-red'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        <option value="attending">Attending</option>
                        <option value="pending">Pending</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setActiveQRGuest(guest)}
                        className="font-mono text-[11px] font-bold text-google-blue hover:underline flex items-center space-x-1"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>{guest.qrToken}</span>
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => sendGuestInvitation(guest.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          guest.invitationSent
                            ? 'text-google-green bg-google-green/10'
                            : 'text-slate-400 hover:text-google-blue hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={guest.invitationSent ? 'Invitation Sent' : 'Send Invite'}
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteGuest(guest.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-google-red hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Guest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Guest Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Add New Event Guest
            </h3>
            <form onSubmit={handleAddGuestSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Ananya Patel"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Group Category
                  </label>
                  <input
                    type="text"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    placeholder="VIP / Family"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Diet Preference
                  </label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Jain Vegetarian">Jain Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Regular">Regular</option>
                  </select>
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
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Pass Preview Modal */}
      {activeQRGuest && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-google-blue">
              Check-In QR Badge Token
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              {activeQRGuest.name}
            </h3>

            {/* Mock QR Code Visual */}
            <div className="w-48 h-48 mx-auto bg-slate-900 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 text-white">
              <QrCode className="w-32 h-32 text-white" />
              <div className="font-mono text-xs text-google-yellow">{activeQRGuest.qrToken}</div>
            </div>

            <p className="text-xs text-slate-500">
              Present at event entry desk for instant automated check-in scanning.
            </p>

            <button
              onClick={() => setActiveQRGuest(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs"
            >
              Close Token Pass
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
