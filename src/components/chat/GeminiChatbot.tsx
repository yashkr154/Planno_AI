import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  X,
  Minimize2,
  Maximize2,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { sendChatMessage, ChatMessage } from '../../services/aiService';

type ModelType = 'gemini-4-argon' | 'gemini-3.8-flash' | 'gemini-3.1-flash-lite';

export const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      content: 'Hello! I am your PlanoAI Gemini Concierge. I can assist with wedding logistics, DevFest hackathon schedules, catering thali options, or real-time venue lookups with Google Maps grounding. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Model & System Instruction Controls
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini-3.8-flash');
  const [role, setRole] = useState('Event Director & Logistics Advisor');
  const [enableMaps, setEnableMaps] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Format conversation history for API
    const history = messages
      .concat(userMessage)
      .filter((m) => m.content)
      .map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        content: m.content,
      }));

    const systemInstruction = `You are an AI Event Concierge with role: "${role}". Provide helpful, accurate, and structured advice for event planning, catering menus, decor budgets, and location discovery in Gujarat, India.`;

    const res = await sendChatMessage(history, selectedModel, systemInstruction, enableMaps);

    const botMessage: ChatMessage = {
      id: 'msg-' + (Date.now() + 1),
      sender: 'bot',
      content: res.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groundingMetadata: res.groundingMetadata,
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-google-gradient text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 group"
          title="Open Gemini AI Assistant"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="text-xs font-extrabold pr-1">Ask Gemini Assistant</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl transition-all duration-300 flex flex-col ${
            isMinimized ? 'w-80 h-16' : 'w-96 sm:w-[420px] h-[580px]'
          }`}
        >
          {/* Top Bar Header */}
          <div className="p-4 bg-slate-900 text-white rounded-t-3xl flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-google-gradient flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold font-display flex items-center space-x-1">
                  <span>Gemini Event Concierge</span>
                  {enableMaps && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-google-green text-white font-mono">
                      Maps Grounded
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-300">
                  Model: <span className="text-google-yellow font-mono">{selectedModel}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Configure Model & Roles"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-google-red hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Configuration Dropdown Drawer */}
              {showConfig && (
                <div className="p-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs space-y-2.5 shrink-0">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Gemini Model Selector
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="gemini-3.8-flash">gemini-3.8-flash (General Tasks)</option>
                      <option value="gemini-4-argon">gemini-4-argon (Complex Reasoning)</option>
                      <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Responses)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      AI Chatbot Role / Instruction
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="Event Director & Logistics Advisor">Event Director & Logistics Advisor</option>
                      <option value="Royal Gujarati Wedding Cultural Specialist">Royal Gujarati Wedding Cultural Specialist</option>
                      <option value="DevFest Hackathon Lead & Tech Coordinator">DevFest Hackathon Lead & Tech Coordinator</option>
                      <option value="Catering & Thali Menu Designer">Catering & Thali Menu Designer</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                      Enable Google Maps Grounding
                    </span>
                    <input
                      type="checkbox"
                      checked={enableMaps}
                      onChange={(e) => setEnableMaps(e.target.checked)}
                      className="w-4 h-4 rounded text-google-blue focus:ring-google-blue"
                    />
                  </div>
                </div>
              )}

              {/* Scrollable Message Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-1.5 shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-google-blue text-white rounded-br-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                      {/* Google Maps Grounding Badges if available */}
                      {msg.groundingMetadata?.groundingChunks?.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] space-y-1">
                          <div className="font-bold text-google-green flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>Grounded with Google Maps Sources:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {msg.groundingMetadata.groundingChunks.map((chunk: any, i: number) => (
                              <a
                                key={i}
                                href={chunk.web?.uri || chunk.maps?.uri || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white font-medium flex items-center space-x-1 text-[9px]"
                              >
                                <span>{chunk.web?.title || chunk.maps?.title || 'Map Source'}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center space-x-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 w-fit">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-google-blue" />
                    <span>Gemini is thinking...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Form */}
              <form onSubmit={handleSend} className="p-3 bg-white dark:bg-brand-charcoal border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about venues, menus, budgets, tasks..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-google-blue"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white disabled:opacity-50 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
