import React, { useState } from 'react';
import {
  Mail,
  Sparkles,
  Send,
  Eye,
  Copy,
  Check,
  CheckCircle2,
  Calendar,
  MapPin,
  QrCode,
  UserPlus,
  Search,
  Filter,
  Clock,
  UserCheck,
  UserX
} from 'lucide-react';
import { useEvent } from '../contexts/EventContext';
import { INVITATION_TEMPLATES } from '../lib/demoData';
import { formatDate } from '../lib/utils';

export const InvitationPage: React.FC = () => {
  const { activeEvent, guests, addGuest, sendGuestInvitation } = useEvent();

  // Direct Recipient Email Input State
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientCategory, setRecipientCategory] = useState<'VIP' | 'Family' | 'Friend' | 'Colleague'>('VIP');
  const [sendImmediately, setSendImmediately] = useState(true);

  // Template & Copy State
  const [selectedTemplate, setSelectedTemplate] = useState(INVITATION_TEMPLATES[0]);
  const [customTitle, setCustomTitle] = useState(activeEvent?.title || 'You are Cordially Invited');
  const [customMessage, setCustomMessage] = useState(
    `We request the pleasure of your company to celebrate ${activeEvent?.title || 'our grand occasion'}. Join us for an unforgettable event filled with joy, culture, and celebration.`
  );

  // UI Feedback States
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dispatchSuccessModal, setDispatchSuccessModal] = useState<string | null>(null);

  // Filter guests for active event
  const activeEventGuests = guests.filter((g) => g.eventId === activeEvent?.id);
  const pendingInvites = activeEventGuests.filter((g) => !g.invitationSent);
  const sentInvites = activeEventGuests.filter((g) => g.invitationSent);

  const filteredGuests = activeEventGuests.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Send Direct Invitation to a specific recipient email
  const handleSendDirectInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientEmail.trim() || !activeEvent) return;

    // Check if guest already exists
    const existing = activeEventGuests.find(
      (g) => g.email.toLowerCase() === recipientEmail.trim().toLowerCase()
    );

    let guestIdToSend: string;

    if (existing) {
      guestIdToSend = existing.id;
    } else {
      const newGuestId = 'g-' + Date.now();
      addGuest({
        eventId: activeEvent.id,
        name: recipientName.trim(),
        email: recipientEmail.trim(),
        phone: '+91 98765 43210',
        rsvpStatus: 'pending',
        plusOne: true,
        category: recipientCategory,
      });
      guestIdToSend = newGuestId;
    }

    if (sendImmediately) {
      sendGuestInvitation(guestIdToSend);
      setDispatchSuccessModal(`Invitation pass sent to ${recipientName} (${recipientEmail})!`);
    } else {
      setDispatchSuccessModal(`Added ${recipientName} (${recipientEmail}) to recipient list.`);
    }

    // Reset inputs
    setRecipientName('');
    setRecipientEmail('');
  };

  const handleCopyLink = (guestId?: string) => {
    const url = `https://plannoai.dev/rsvp?evt=${activeEvent?.id || 'demo'}&pass=${guestId || 'general'}`;
    navigator.clipboard.writeText(url);
    setCopiedLinkId(guestId || 'general');
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const handleBulkDispatch = () => {
    if (pendingInvites.length === 0) return;
    pendingInvites.forEach((g) => sendGuestInvitation(g.id));
    setDispatchSuccessModal(`Bulk dispatch completed! Sent ${pendingInvites.length} invitation emails.`);
  };

  return (
    <div className="space-y-8">
      
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-google-blue uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Branded Digital Invitation Studio</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Send Event Invitations to Specific Recipients
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Specify recipient names and email addresses to dispatch personalized digital invitation passes with QR tokens.
          </p>
        </div>

        {/* Quick Stats Chips */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-3 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase">Total Recipients</div>
            <div className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
              {activeEventGuests.length}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="text-xs text-google-green font-semibold uppercase">Invites Sent</div>
            <div className="font-display text-lg font-extrabold text-google-green">
              {sentInvites.length}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="text-xs text-amber-500 font-semibold uppercase">Pending</div>
            <div className="font-display text-lg font-extrabold text-amber-500">
              {pendingInvites.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Send Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Direct Recipient Input Form & Design Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Send Invitation To Whom (Email & Name Input Box) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border-2 border-google-blue/30 shadow-lg space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-display font-bold text-base">
              <UserPlus className="w-5 h-5 text-google-blue" />
              <span>Send Invitation To Whom</span>
            </div>

            <form onSubmit={handleSendDirectInvitation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Name <span className="text-google-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-google-blue"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Email Address <span className="text-google-red">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-google-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={recipientCategory}
                    onChange={(e) => setRecipientCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-google-blue"
                  >
                    <option value="VIP">VIP Guest</option>
                    <option value="Family">Family Member</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague / Delegate</option>
                  </select>
                </div>

                <div className="flex items-end pb-1">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sendImmediately}
                      onChange={(e) => setSendImmediately(e.target.checked)}
                      className="w-4 h-4 rounded text-google-blue focus:ring-google-blue"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Send Email Pass Now
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-google-gradient hover:opacity-95 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Invitation to {recipientName || 'Recipient'}</span>
              </button>
            </form>
          </div>

          {/* Design Theme Picker */}
          <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Invitation Design Theme
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {INVITATION_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedTemplate.id === tpl.id
                      ? 'border-google-blue ring-2 ring-google-blue/20 bg-google-blue/5'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className={`h-12 rounded-xl bg-gradient-to-r ${tpl.previewBg} mb-2 flex items-center justify-center text-white font-bold text-xs`}>
                    Preview
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{tpl.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Customization */}
          <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Host Copywriting
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Headline
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Personal Host Message
              </label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => handleCopyLink()}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                {copiedLinkId === 'general' ? <Check className="w-4 h-4 text-google-green" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLinkId === 'general' ? 'Link Copied!' : 'Copy General RSVP Link'}</span>
              </button>

              <button
                onClick={handleBulkDispatch}
                disabled={pendingInvites.length === 0}
                className="w-full py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-semibold flex items-center justify-center space-x-1.5 shadow-md transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Bulk Send Pending ({pendingInvites.length})</span>
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Live Interactive Branded Card Preview */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <Eye className="w-4 h-4 text-google-blue" />
            <span>Live Branded Invitation Pass Preview</span>
          </div>

          <div className={`p-8 sm:p-12 rounded-3xl bg-gradient-to-br ${selectedTemplate.previewBg} text-white shadow-2xl space-y-6 relative overflow-hidden border border-white/20`}>
            
            {/* Ambient Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center space-y-4 relative z-10 max-w-lg mx-auto">
              <div className="w-12 h-12 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="text-xs font-bold uppercase tracking-widest text-amber-300">
                You Are Cordially Invited
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                {customTitle}
              </h2>

              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light">
                {customMessage}
              </p>

              {/* Event Details Card */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{formatDate(activeEvent?.date || '2026-12-05')} at {activeEvent?.time || '10:00 AM'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{activeEvent?.location || 'Laxmi Vilas Palace'}, {activeEvent?.city || 'Vadodara'}</span>
                </div>
              </div>

              {/* Recipient Dynamic Pass Preview */}
              <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-black/30 text-xs">
                <div className="flex items-center space-x-2 text-left">
                  <QrCode className="w-6 h-6 text-amber-300 shrink-0" />
                  <div>
                    <div className="font-bold text-white text-xs">
                      {recipientName || 'Sample Recipient'}
                    </div>
                    <div className="text-[10px] text-amber-300 font-mono truncate">
                      {recipientEmail || 'recipient@example.com'}
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-google-green text-white font-bold text-[10px] uppercase shrink-0">
                  Valid QR Token
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Recipient Management & Dispatch Table ("Who to Send Invitations To") */}
      <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Recipient Dispatch Directory ({activeEventGuests.length})
            </h3>
            <p className="text-xs text-slate-500">
              Manage invitation delivery status and resend email passes individually.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recipient name or email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-google-blue"
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-3">Recipient Name</th>
                <th className="pb-3 px-3">Email Address</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">RSVP Status</th>
                <th className="pb-3 px-3">Invitation Email</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No recipients found. Use the form above to send an invitation to anyone by email!
                  </td>
                </tr>
              ) : (
                filteredGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {g.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono">
                      {g.email}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                        {g.category || 'Guest'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          g.rsvpStatus === 'attending'
                            ? 'bg-google-green/10 text-google-green'
                            : g.rsvpStatus === 'declined'
                            ? 'bg-google-red/10 text-google-red'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {g.rsvpStatus === 'attending' ? (
                          <UserCheck className="w-3 h-3" />
                        ) : g.rsvpStatus === 'declined' ? (
                          <UserX className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span className="capitalize">{g.rsvpStatus}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          g.invitationSent
                            ? 'bg-google-blue/10 text-google-blue'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {g.invitationSent ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Sent & Tokenized</span>
                          </>
                        ) : (
                          <span>Not Sent Yet</span>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          sendGuestInvitation(g.id);
                          setDispatchSuccessModal(`Sent invitation pass to ${g.name} (${g.email})!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-google-blue hover:bg-blue-600 text-white font-semibold text-[11px] shadow-sm transition-all"
                      >
                        {g.invitationSent ? 'Resend Pass' : 'Send Pass'}
                      </button>
                      <button
                        onClick={() => handleCopyLink(g.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] hover:bg-slate-200"
                        title="Copy direct guest link"
                      >
                        {copiedLinkId === g.id ? 'Copied!' : 'Link'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Dispatch Confirmation Modal */}
      {dispatchSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-google-green/10 text-google-green flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Invitation Action Complete
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {dispatchSuccessModal}
            </p>
            <button
              onClick={() => setDispatchSuccessModal(null)}
              className="w-full py-2.5 rounded-xl bg-google-blue text-white font-semibold text-xs shadow-md hover:bg-blue-600 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
