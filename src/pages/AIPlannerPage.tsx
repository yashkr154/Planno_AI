import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Clock,
  Utensils,
  Palette,
  CheckSquare,
  ArrowRight,
  RefreshCw,
  Save,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useEvent } from '../contexts/EventContext';
import { generateEventBlueprint, detectCityFromPrompt } from '../services/aiService';
import { AIEventBlueprint } from '../types';
import { formatCurrency } from '../lib/utils';

export const AIPlannerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createEventFromBlueprint } = useEvent();

  const initialPromptState = (location.state as { initialPrompt?: string })?.initialPrompt || '';

  const [prompt, setPrompt] = useState(
    initialPromptState || 'a simple wedding in ranchi with 200 guests'
  );
  const [eventDate, setEventDate] = useState('2026-12-05');
  const [city, setCity] = useState('Ranchi');
  const [targetLocation, setTargetLocation] = useState('Radisson Blu Hotel / Banquet');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [blueprint, setBlueprint] = useState<AIEventBlueprint | null>(null);

  const popularCities = [
    'Ranchi', 'Mumbai', 'Delhi', 'Jaipur', 'Bengaluru', 'Kolkata',
    'Chennai', 'Hyderabad', 'Pune', 'Goa', 'Patna', 'Vadodara',
    'Ahmedabad', 'Surat', 'Rajkot', 'Lucknow', 'Chandigarh', 'Kochi'
  ];

  const allIndianCities = [
    'Ranchi', 'Mumbai', 'Delhi NCR', 'Jaipur', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad',
    'Pune', 'Goa', 'Patna', 'Vadodara', 'Ahmedabad', 'Surat', 'Rajkot', 'Lucknow', 'Chandigarh',
    'Bhopal', 'Indore', 'Kochi', 'Guwahati', 'Varanasi', 'Udaipur', 'Shimla', 'Bhubaneswar',
    'Raipur', 'Dehradun', 'Amritsar', 'Agra', 'Coimbatore', 'Mysore', 'Jodhpur', 'Jamshedpur',
    'Dhanbad', 'Nagpur', 'Visakhapatnam', 'Ludhiana', 'Nashik', 'Thane', 'Vijayawada', 'Madurai'
  ];

  const presets = [
    {
      title: 'Ranchi Celebration Wedding',
      prompt: 'a simple wedding in ranchi with 200 guests',
      city: 'Ranchi',
      location: 'Radisson Blu Hotel, Main Road',
      date: '2026-12-05'
    },
    {
      title: 'Jaipur Royal Palace Wedding',
      prompt: 'Organize a regal royal palace wedding in Jaipur for 350 guests with ₹25,00,000 budget',
      city: 'Jaipur',
      location: 'Rambagh Palace Grounds',
      date: '2026-12-18'
    },
    {
      title: 'Mumbai Corporate Gala',
      prompt: 'Plan an exclusive AI Product Launch Gala at Taj Lands End Mumbai for 200 delegates',
      city: 'Mumbai',
      location: 'The Taj Mahal Palace Colaba',
      date: '2026-11-20'
    },
    {
      title: 'DevFest Hackathon Bengaluru',
      prompt: 'Organize GDG DevFest Hackathon at Leela Palace Bengaluru for 800 developers with ₹15,00,000 budget',
      city: 'Bengaluru',
      location: 'The Leela Palace Convention Center',
      date: '2026-11-14'
    }
  ];

  // Sync city whenever user updates prompt text
  useEffect(() => {
    if (prompt) {
      const detected = detectCityFromPrompt(prompt);
      if (detected) {
        setCity(detected);
      }
    }
  }, [prompt]);

  const handleGenerate = async (customPrompt?: string) => {
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim()) return;

    setIsGenerating(true);
    setGenerationStep(1);

    const stepTimer1 = setTimeout(() => setGenerationStep(2), 700);
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 1400);

    try {
      const targetCity = city || 'Ranchi';
      const promptWithCity = `${activePrompt}${
        targetCity && !activePrompt.toLowerCase().includes(targetCity.toLowerCase())
          ? ` in ${targetCity}`
          : ''
      }`;
      const res = await generateEventBlueprint(promptWithCity);
      setBlueprint(res);
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  useEffect(() => {
    if (initialPromptState) {
      handleGenerate(initialPromptState);
    }
  }, []);

  const handleSaveBlueprint = () => {
    if (!blueprint) return;
    const created = createEventFromBlueprint(blueprint, eventDate, targetLocation, city);
    navigate('/dashboard', { state: { newEventId: created.id } });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Page Title & Banner */}
      <div className="bg-gradient-to-r from-google-blue via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pan-India Generative AI Planner</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
            AI Event Blueprint Generator
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Plan weddings, conferences, or parties in ANY city across India — Ranchi, Mumbai, Delhi, Jaipur, Bengaluru, Kolkata, Goa, Vadodara, and beyond.
          </p>
        </div>
      </div>

      {/* Prompt Intake Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Preset Selector Buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Pan-India Quick-Start Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(preset.prompt);
                  setCity(preset.city);
                  setTargetLocation(preset.location);
                  setEventDate(preset.date);
                }}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-google-blue/10 hover:border-google-blue/40 border border-slate-200/80 dark:border-slate-800 text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-google-blue flex items-center justify-between">
                  <span>{preset.title}</span>
                  <Zap className="w-3.5 h-3.5 text-google-yellow" />
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-1">{preset.city} • {preset.location}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Natural Language Prompt Area */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Event Vision & Prompt (Specify any city in India)
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. a simple wedding in ranchi with 200 guests..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-google-blue transition-colors"
          />
        </div>

        {/* Location & Date Details Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Date
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-google-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              City / Location (Select or Type Any City in India)
            </label>
            <div className="space-y-1.5">
              <select
                value={allIndianCities.includes(city) ? city : ''}
                onChange={(e) => {
                  if (e.target.value) setCity(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-google-blue"
              >
                <option value="">-- Choose Indian City or Type Below --</option>
                {allIndianCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <div className="relative">
                <input
                  type="text"
                  list="indian-cities-list"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Or type any Indian city (e.g. Ranchi, Mumbai, Jaipur)..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-google-blue font-bold text-google-blue"
                />
                <datalist id="indian-cities-list">
                  {allIndianCities.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Quick City Chip Shortcuts */}
            <div className="flex flex-wrap gap-1 mt-1.5 max-h-16 overflow-y-auto">
              {popularCities.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-colors ${
                    city.toLowerCase() === c.toLowerCase()
                      ? 'bg-google-blue text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Venue / Location Name
            </label>
            <input
              type="text"
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              placeholder="e.g. Radisson Blu Hotel, Main Road"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-google-blue"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !prompt.trim()}
            className="px-6 py-3 rounded-2xl bg-google-gradient text-white font-bold text-sm flex items-center space-x-2 shadow-lg hover:opacity-95 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Blueprint for {city}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Blueprint with AI</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Loading Progress State */}
      {isGenerating && (
        <div className="p-8 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-google-blue/10 text-google-blue flex items-center justify-center animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Generative AI Synthesizing Event Plan for {city}...
          </h3>
          <div className="max-w-md mx-auto space-y-2 text-xs text-slate-500">
            <div className={`flex items-center justify-between p-2 rounded-lg ${generationStep >= 1 ? 'text-google-blue font-semibold' : ''}`}>
              <span>Analyzing regional traditions for {city}...</span>
              {generationStep >= 1 && <CheckCircle2 className="w-4 h-4" />}
            </div>
            <div className={`flex items-center justify-between p-2 rounded-lg ${generationStep >= 2 ? 'text-google-blue font-semibold' : ''}`}>
              <span>Designing authentic local catering menu & decor...</span>
              {generationStep >= 2 && <CheckCircle2 className="w-4 h-4" />}
            </div>
            <div className={`flex items-center justify-between p-2 rounded-lg ${generationStep >= 3 ? 'text-google-blue font-semibold' : ''}`}>
              <span>Calculating itemized budget in INR (₹)...</span>
              {generationStep >= 3 && <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
        </div>
      )}

      {/* Generated Blueprint Preview Section */}
      {blueprint && !isGenerating && (
        <div className="space-y-6">
          
          {/* Blueprint Header */}
          <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-google-green uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>AI Blueprint Generated for {city}</span>
              </div>
              <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {blueprint.title}
              </h2>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-3">
                <span>Location: <strong className="text-google-blue">{city}</strong></span>
                <span>•</span>
                <span>Theme: <strong className="text-slate-700 dark:text-slate-300">{blueprint.theme}</strong></span>
                <span>•</span>
                <span>Estimated Guests: <strong className="text-slate-700 dark:text-slate-300">{blueprint.estimatedGuests}</strong></span>
                <span>•</span>
                <span>Target Budget: <strong className="text-google-blue">{formatCurrency(blueprint.suggestedBudget, 'INR')}</strong></span>
              </div>
            </div>

            <button
              onClick={handleSaveBlueprint}
              className="px-6 py-3 rounded-2xl bg-google-blue hover:bg-blue-600 text-white font-bold text-sm flex items-center space-x-2 shadow-lg transition-all shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Adopt & Create Event</span>
            </button>
          </div>

          {/* Grid Preview: Schedule & Menu */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Schedule Timeline */}
            <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-display font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                <Clock className="w-5 h-5 text-google-blue" />
                <span>Day-of Chronological Schedule ({city})</span>
              </div>
              <div className="space-y-3">
                {blueprint.schedule.map((item, i) => (
                  <div key={i} className="flex space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-extrabold text-google-blue w-20 shrink-0">{item.time}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{item.activity}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Catering Menu */}
            <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-display font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                <Utensils className="w-5 h-5 text-google-red" />
                <span>Authentic {city} Catering Menu Concept</span>
              </div>
              <div className="space-y-4">
                {blueprint.menu.map((cat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="text-xs font-bold text-google-red uppercase tracking-wider">{cat.category}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((item, j) => (
                        <span key={j} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Decor & Budget Expenses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Decor Concept */}
            <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-display font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                <Palette className="w-5 h-5 text-google-yellow" />
                <span>Decor Styling & Regional Concept</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {blueprint.decorConcept.description}
              </p>
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-2">Color Palette Accents:</div>
                <div className="flex space-x-2">
                  {blueprint.decorConcept.palette.map((color, i) => (
                    <div key={i} className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: color }} />
                      <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1.5">Key Styling Elements:</div>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {blueprint.decorConcept.keyElements.map((elem, i) => (
                    <li key={i}>{elem}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Estimated Itemized Expenses */}
            <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-display font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                <DollarSign className="w-5 h-5 text-google-green" />
                <span>Recommended Expense Allocation</span>
              </div>
              <div className="space-y-2">
                {blueprint.estimatedExpenses.map((exp, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{exp.category}</span>
                      <div className="text-[10px] text-slate-500">{exp.description}</div>
                    </div>
                    <span className="font-extrabold text-google-green">
                      {formatCurrency(exp.estimatedAmount, 'INR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
