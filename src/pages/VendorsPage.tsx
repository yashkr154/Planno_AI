import React, { useState } from 'react';
import {
  Briefcase,
  Star,
  Phone,
  Mail,
  CheckCircle2,
  MapPin,
  Sparkles,
  Send
} from 'lucide-react';
import { useEvent } from '../contexts/EventContext';
import { Vendor } from '../types';

export const VendorsPage: React.FC = () => {
  const { vendors } = useEvent();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quoteVendor, setQuoteVendor] = useState<Vendor | null>(null);
  const [requestedSuccess, setRequestedSuccess] = useState(false);

  const categories = ['all', 'Catering', 'Decoration', 'Photography', 'Sound & AV'];

  const filteredVendors = vendors.filter((v) => {
    if (selectedCategory === 'all') return true;
    return v.category === selectedCategory;
  });

  const handleSendQuoteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestedSuccess(true);
    setTimeout(() => {
      setRequestedSuccess(false);
      setQuoteVendor(null);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-google-blue uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verified Partner Directory</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Vendors & Quotation Network
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Connect with trusted event partners, caterers, stage decorators, and AV technicians across India (Ranchi, Mumbai, Delhi, Jaipur, Bengaluru, Vadodara, and beyond).
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              selectedCategory === cat
                ? 'bg-google-blue text-white shadow-sm'
                : 'bg-white dark:bg-brand-charcoal text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Partners' : cat}
          </button>
        ))}
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between hover:border-google-blue/40 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-google-blue uppercase tracking-wider">
                      {vendor.category} • {vendor.city}
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                      {vendor.name}
                    </h3>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center space-x-1 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{vendor.rating}</span>
                </div>
              </div>

              {/* Services List */}
              <div className="flex flex-wrap gap-1.5">
                {vendor.services.map((srv, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    {srv}
                  </span>
                ))}
              </div>

              {/* Price & Contact */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-extrabold text-google-green">{vendor.priceRange}</span>
                <div className="flex items-center space-x-2 text-slate-500">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{vendor.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setQuoteVendor(vendor)}
                className="w-full py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Quotation</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Request Modal */}
      {quoteVendor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Request Quote: {quoteVendor.name}
            </h3>

            {requestedSuccess ? (
              <div className="py-8 text-center space-y-2 text-google-green">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <div className="font-bold text-sm">Quotation Request Dispatched!</div>
                <p className="text-xs text-slate-500">The vendor team will respond with a customized proposal shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSendQuoteRequest} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Requirements & Dates
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe requirement, guest count, and date..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-3 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setQuoteVendor(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-google-blue text-white font-semibold"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
