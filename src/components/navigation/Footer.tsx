import React from 'react';
import { Sparkles, Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800 transition-colors py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-google-gradient flex items-center justify-center text-white font-bold text-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Plano<span className="text-google-blue">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your next-generation AI-powered event orchestration platform for celebrations and conferences.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#ai-planner" className="hover:text-google-blue transition-colors">AI Event Generator</a></li>
              <li><a href="#venues" className="hover:text-google-blue transition-colors">Venue Discovery</a></li>
              <li><a href="#features" className="hover:text-google-blue transition-colors">Budget Analytics</a></li>
              <li><a href="#features" className="hover:text-google-blue transition-colors">Automated RSVPs</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Use Cases</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><span className="hover:text-google-blue transition-colors cursor-pointer">Royal Weddings</span></li>
              <li><span className="hover:text-google-blue transition-colors cursor-pointer">DevFest Hackathons</span></li>
              <li><span className="hover:text-google-blue transition-colors cursor-pointer">Corporate Summits</span></li>
              <li><span className="hover:text-google-blue transition-colors cursor-pointer">Private Celebrations</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-xs text-slate-400 mb-3">Get the latest AI event planning guides & venue listings.</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-google-blue"
              />
              <button className="px-3 py-2 bg-google-blue hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 PlanoAI Platform. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-2 md:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-google-red fill-google-red" />
            <span>for event organizers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
