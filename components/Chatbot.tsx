import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, ExternalLink, Tag } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { COMPANY_PHONE } from '../constants';
import { ChatMessage, ChatSender, Promotion } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: "Welcome to Glammys Executive Suites. I am your Virtual Concierge. Ask me about our signature suites, amenities, or our exclusive seasonal promotions!",
      sender: ChatSender.BOT,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePromos, setActivePromos] = useState<Promotion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Refresh promotions whenever chat opens
  useEffect(() => {
    if (isOpen) {
      const promos = StorageService.getPromotions().filter(p => p.isActive);
      setActivePromos(promos);
    }
  }, [isOpen]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const query = customText || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: query,
      sender: ChatSender.USER,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: ChatSender.BOT,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "I am having trouble connecting to the concierge network right now. Please chat directly with our front desk team on WhatsApp for immediate assistance.",
          sender: ChatSender.BOT,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsApp = (queryContext?: string) => {
    const defaultText = "Hello Glammys Executive Suites, I was chatting with your AI Concierge and would like to speak to an agent about bookings and specials.";
    const text = encodeURIComponent(queryContext || defaultText);
    window.open(`https://wa.me/${COMPANY_PHONE}?text=${text}`, '_blank');
  };

  // Helper to check if message suggests talking to an agent
  const shouldShowAgentButton = (text: string) => {
    const lower = text.toLowerCase();
    return (
      lower.includes('whatsapp') ||
      lower.includes('agent') ||
      lower.includes('concierge') ||
      lower.includes('team') ||
      lower.includes('quote') ||
      lower.includes('contact us')
    );
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 text-richBlack p-4 rounded-full shadow-2xl hover:shadow-[0_0_25px_rgba(212,163,43,0.6)] transition-all flex items-center gap-2 font-black"
        aria-label="Virtual Concierge"
      >
        {isOpen ? <X size={24} /> : (
          <>
            <Sparkles size={20} />
            <span className="hidden sm:inline text-[11px] uppercase tracking-widest font-black pr-1">Concierge</span>
          </>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[540px] z-50 bg-zinc-950 border border-gold-500/30 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-zinc-900 via-charcoal to-zinc-900 p-4 border-b border-gold-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shadow-inner">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-white font-bold text-base leading-tight">Glammys Concierge</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">24/7 AI Hospitality Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Action Chips (Promotions) */}
            {activePromos.length > 0 && (
              <div className="bg-charcoal/80 border-b border-zinc-800 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[9px] uppercase tracking-wider text-gold-400 font-black flex items-center gap-1 flex-shrink-0">
                  <Tag size={12} /> Specials:
                </span>
                {activePromos.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSend(undefined, `Tell me more about the ${p.title} promotion`)}
                    className="text-[10px] whitespace-nowrap bg-zinc-900 hover:bg-gold-500 hover:text-black text-gray-300 border border-gold-500/20 rounded-full px-2.5 py-1 font-semibold transition-colors"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === ChatSender.USER ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === ChatSender.USER
                        ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-richBlack font-semibold rounded-tr-none shadow-md'
                        : 'bg-zinc-900 text-gray-200 border border-gold-500/20 rounded-tl-none shadow-lg'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Agent WhatsApp Handoff CTA Button */}
                  {msg.sender === ChatSender.BOT && shouldShowAgentButton(msg.text) && (
                    <button
                      onClick={() => openWhatsApp(msg.text)}
                      className="mt-2 text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <ExternalLink size={13} /> Chat with Front Desk on WhatsApp
                    </button>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 p-3.5 rounded-2xl rounded-tl-none border border-gold-500/20 flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-medium">Concierge is typing</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce delay-150"></span>
                      <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce delay-300"></span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => handleSend(e)} className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about rates, discounts, check-in..."
                className="flex-1 bg-zinc-900 text-white placeholder-zinc-500 border border-zinc-800 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-gold-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gold-500 text-richBlack p-3 rounded-xl hover:bg-gold-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
