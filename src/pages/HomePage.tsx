import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  Building2,
  DollarSign,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Star,
  Zap,
  Globe
} from 'lucide-react';
import { Hero3DScene } from '../components/3d/Hero3DScene';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [promptInput, setPromptInput] = useState('');

  const handleStartPlanning = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptInput.trim()) {
      navigate('/dashboard/ai-planner', { state: { initialPrompt: promptInput } });
    } else {
      navigate('/dashboard/ai-planner');
    }
  };

  const samplePrompts = [
    'Organize an outdoor Gujarati royal wedding in Vadodara for 300 guests with ₹25,00,000 budget',
    'Plan Tech Innovation Hackathon in Science City Ahmedabad for 800 developers with ₹15,00,000 budget',
    'Corporate AI Product Unveil Gala & Dinner at Surya Palace Vadodara for 180 delegates',
  ];

  return (
    <div className="min-h-screen bg-brand-softWhite dark:bg-brand-navy text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden">
        
        {/* Background Radial Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-google-blue/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy & Prompt Intake */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-google-blue/10 dark:bg-google-blue/20 border border-google-blue/30 text-google-blue text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Generative AI Event Orchestration</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Dream It. <span className="gradient-text-google">Plan It.</span> Celebrate It.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                PlanoAI unites natural-language event generation, intelligent venue discovery, automated RSVP invitations, and real-time budget analytics into a unified command center.
              </p>

              {/* Natural Language Prompt Input */}
              <form onSubmit={handleStartPlanning} className="pt-2">
                <div className="relative max-w-xl mx-auto lg:mx-0">
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="e.g. Royal Wedding in Vadodara for 300 guests with ₹25L budget..."
                    className="w-full pl-5 pr-36 py-4 rounded-2xl bg-white dark:bg-brand-charcoal border-2 border-slate-200 dark:border-slate-700/80 shadow-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-google-blue transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-google-gradient text-white font-semibold text-xs sm:text-sm flex items-center space-x-1.5 shadow-md hover:opacity-95 transition-all"
                  >
                    <span>Generate AI Plan</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>

                {/* Preset Prompt Starter Pills */}
                <div className="pt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
                  <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1 py-1">
                    <Zap className="w-3 h-3 text-google-yellow" />
                    <span>Try asking:</span>
                  </span>
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPromptInput(p)}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-google-blue/10 hover:text-google-blue text-slate-600 dark:text-slate-300 transition-colors text-left truncate max-w-xs"
                    >
                      "{p.slice(0, 38)}..."
                    </button>
                  ))}
                </div>
              </form>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-google-green" />
                  <span>Google Gemini 2.5 API</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-google-blue" />
                  <span>Pan-India Verified Venues</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-google-yellow" />
                  <span>Live RSVP & Budget Analytics</span>
                </div>
              </div>

            </div>

            {/* Right 3D Interactive Canvas */}
            <div className="lg:col-span-5 relative">
              <Hero3DScene />
            </div>

          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-20 bg-white dark:bg-brand-charcoal transition-colors border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-google-blue mb-2">
              Integrated Capabilities
            </h2>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Everything You Need for Flawless Event Execution
            </h3>
            <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              From natural language prompts to financial ledger exports, PlanoAI equips organizers with end-to-end intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-google-blue/50 transition-all hover:shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-google-blue/10 dark:bg-google-blue/20 text-google-blue flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                AI Event Blueprint Wizard
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Describe your vision in natural language. Gemini AI generates chronological schedules, catering menus, decor concepts, and task checklists instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-google-red/50 transition-all hover:shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-google-red/10 dark:bg-google-red/20 text-google-red flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                Smart Venue Discovery & Ranking
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Explore verified venues in Vadodara and Ahmedabad. AI matches capacity and budget requirements with Google Maps deep-links.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-google-yellow/50 transition-all hover:shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-google-yellow/10 dark:bg-google-yellow/20 text-google-yellow flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                Automated RSVPs & QR Tokens
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose branded invitation themes (Google Vibrant, Royal Gold, Cyber Neon). Generate unique attendee QR check-in tokens and dispatch invitations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-google-green/50 transition-all hover:shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-google-green/10 dark:bg-google-green/20 text-google-green flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                Real-Time Budget Dashboard
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Track estimated vs actual incurred expenses with Recharts category charts, 90% threshold alert notifications, and single-click CSV export.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-google-blue/50 transition-all hover:shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                Google Calendar Sync
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Synchronize key event milestones, speaker rehearsal slots, and vendor payment deadlines directly to your calendar.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-google-red/50 transition-all hover:shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                Multi-Currency & Theme Support
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Toggle seamlessly between Google Clean Light Mode & Deep Navy Obsidian Dark Mode with support for INR ₹, USD $, and EUR €.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Venue Teaser Section */}
      <section id="venues" className="py-20 bg-brand-softWhite dark:bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs uppercase font-bold tracking-widest text-google-blue mb-2">
                Curated Venues
              </h2>
              <h3 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
                Featured Locations Across India (Ranchi, Mumbai, Delhi, Jaipur, Bengaluru, & More)
              </h3>
            </div>
            <button
              onClick={() => navigate('/dashboard/venues')}
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-sm font-semibold text-google-blue hover:underline"
            >
              <span>Explore All Verified Venues</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Venue 1 */}
            <div className="rounded-2xl overflow-hidden bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-md group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"
                  alt="Laxmi Vilas Palace"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-bold flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>4.9 / 5.0</span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="text-xs font-bold text-google-blue uppercase tracking-wider">Vadodara</div>
                <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Laxmi Vilas Palace Lawns & Durbar Hall
                </h4>
                <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Up to 1,200 Guests</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Royal Heritage</span>
                  </span>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    From ₹8,50,000 / day
                  </span>
                  <button
                    onClick={() => navigate('/dashboard/venues')}
                    className="text-xs font-bold text-google-blue hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Venue 2 */}
            <div className="rounded-2xl overflow-hidden bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-md group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
                  alt="Science City Convention"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-bold flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>4.8 / 5.0</span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="text-xs font-bold text-google-red uppercase tracking-wider">Ahmedabad</div>
                <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Science City Convention & Auditorium Center
                </h4>
                <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Up to 1,500 Guests</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tech Conference</span>
                  </span>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    From ₹4,50,000 / day
                  </span>
                  <button
                    onClick={() => navigate('/dashboard/venues')}
                    className="text-xs font-bold text-google-blue hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Venue 3 */}
            <div className="rounded-2xl overflow-hidden bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-md group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                  alt="Surya Palace"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-bold flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>4.7 / 5.0</span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="text-xs font-bold text-google-yellow uppercase tracking-wider">Vadodara</div>
                <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Grand Mercure Surya Palace
                </h4>
                <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Up to 500 Guests</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Luxury Hotel</span>
                  </span>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    From ₹3,00,000 / day
                  </span>
                  <button
                    onClick={() => navigate('/dashboard/venues')}
                    className="text-xs font-bold text-google-blue hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-google-gradient text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Plan Your Next Unforgettable Event?
          </h2>
          <p className="text-base text-white/90 max-w-2xl mx-auto">
            Experience the future of generative event planning. Generate schedules, budgets, venues, and invitations in seconds.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => navigate('/dashboard/ai-planner')}
              className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm shadow-xl flex items-center space-x-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-google-yellow" />
              <span>Launch AI Planner Free</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
