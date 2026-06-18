import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Loader, Zap } from 'lucide-react';
import api from '../../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CHATBOT_LOGO = 'https://branition.com/assets/img/users/logos/15060-qJ7ZZ6J.webp?v2';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AGS Health Workforce AI Advisor. How can I help you analyze our workforce analytics, performance, or financial margins today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: messageText,
        history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
      });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.data.response,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m temporarily offline. Please verify the connection.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Top 5 Performers', prompt: 'Who are the top 5 performing employees, their recruiters, trainers, TLs, and revenue?' },
    { label: 'IT Team Drop Cause', prompt: "Why is the IT team's performance dropping? (Root Cause Analysis)" },
    { label: 'Underperformance Trace', prompt: 'What are the trace details (HR, LMS score, current TL) of underperforming employees?' },
    { label: 'Poor Performance Loss', prompt: 'How much financial loss has the company incurred so far due to poor performers?' },
    { label: 'AI Mitigation Plan', prompt: "What is the AI's suggestion to prevent further loss from underperforming resources?" },
    { label: 'Sourcing Failures & Loss', prompt: "Which HR recruiter's candidates fail the most, and what is the total loss?" },
    { label: 'Best Trainer/TL Combo', prompt: 'Which Trainer and Team Lead combo is the most successful?' },
  ];

  // Custom markdown bold & lists parser for clean answers (removes raw ** asterisks)
  const parseMarkdown = (text: string) => {
    if (!text) return '';
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const isNumbered = /^\d+\.\s/.test(line.trim());

      if (isBullet) {
        const cleanLine = line.replace(/^\s*[•-]\s*/, '');
        const cleanParts = cleanLine.split(/\*\*([\s\S]*?)\*\*/g);
        const parsedClean = cleanParts.map((part, partIdx) => {
          if (partIdx % 2 === 1) {
            return <strong key={partIdx} className="font-bold text-cyan-300">{part}</strong>;
          }
          return part;
        });
        return (
          <li key={lineIdx} className="ml-4 list-disc pl-0.5 text-xs text-slate-300 my-0.5">
            {parsedClean}
          </li>
        );
      }

      if (isNumbered) {
        const numberPrefix = line.match(/^\s*(\d+\.)\s*/)?.[1] || '';
        const cleanLine = line.replace(/^\s*\d+\.\s*/, '');
        const cleanParts = cleanLine.split(/\*\*([\s\S]*?)\*\*/g);
        const parsedClean = cleanParts.map((part, partIdx) => {
          if (partIdx % 2 === 1) {
            return <strong key={partIdx} className="font-bold text-cyan-300">{part}</strong>;
          }
          return part;
        });
        return (
          <div key={lineIdx} className="flex gap-1.5 text-xs mt-1">
            <span className="text-cyan-400 font-bold">{numberPrefix}</span>
            <span className="flex-1 font-normal text-slate-300">{parsedClean}</span>
          </div>
        );
      }

      const parts = line.split(/\*\*([\s\S]*?)\*\*/g);
      const parsedLine = parts.map((part, partIdx) => {
        if (partIdx % 2 === 1) {
          return <strong key={partIdx} className="font-bold text-cyan-300">{part}</strong>;
        }
        return part;
      });

      return (
        <p key={lineIdx} className="min-h-[1em] text-xs text-slate-300">
          {parsedLine}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Floating Action Button with User's Circular Logo & repeating jump/bounce animation */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { y: 0 } : { y: [0, -10, 0] }}
        transition={isOpen ? { duration: 0.15 } : {
          y: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 2.2,
            ease: "easeInOut"
          }
        }}
        className="w-14 h-14 rounded-full bg-[#060814] flex items-center justify-center shadow-[0_0_18px_rgba(6,182,212,0.4)] hover:shadow-[0_0_28px_rgba(6,182,212,0.75)] border-2 border-cyan-500/50 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-cyan-400" />
            </motion.div>
          ) : (
            <motion.img
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              src={CHATBOT_LOGO}
              alt="AI Advisor Logo"
              className="w-full h-full object-cover"
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Popup Chatbox Panel with Cyan/Teal Glowing Accents */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: -12, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-[min(440px,calc(100vw-2rem))] h-[580px] max-h-[calc(100vh-6rem)] bg-[#090b1e]/98 backdrop-blur-md rounded-2xl border border-cyan-500/25 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#060814] px-5 py-4 flex items-center justify-between border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <img
                  src={CHATBOT_LOGO}
                  alt="Workforce AI Advisor Logo"
                  className="w-9 h-9 rounded-full border border-cyan-500/30 object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-cyan-400 tracking-wide">Workforce AI Advisor</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-semibold tracking-wider">ONLINE & SECURE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-cyan-500/20 bg-[#060814] flex items-center justify-center">
                    {msg.role === 'assistant' ? (
                      <img src={CHATBOT_LOGO} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-xl border leading-relaxed ${
                    msg.role === 'assistant' 
                      ? 'bg-[#060814]/80 text-slate-200 border-cyan-500/15 rounded-tl-none shadow-[0_2px_8px_rgba(0,0,0,0.2)]' 
                      : 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-900 border-cyan-500/20 rounded-tr-none font-medium shadow-[0_2px_8px_rgba(6,182,212,0.15)]'
                  }`}>
                    {/* Render message through the clean markdown bold/list parser */}
                    <div className="space-y-1.5">
                      {msg.role === 'assistant' ? parseMarkdown(msg.content) : msg.content}
                    </div>
                    <div className={`text-[9px] mt-1.5 text-right ${
                      msg.role === 'assistant' ? 'text-slate-500' : 'text-cyan-950 font-bold'
                    }`}>
                      {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-cyan-500/20 bg-[#060814] flex items-center justify-center">
                    <img src={CHATBOT_LOGO} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-[#060814]/80 border border-cyan-500/15 px-4 py-2.5 rounded-xl rounded-tl-none flex items-center gap-2">
                    <Loader className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span className="text-[10px] text-slate-400">Advisor is analyzing data...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Analytical Queries Prompts */}
            <div className="px-4 py-3 bg-[#060814]/90 border-t border-cyan-500/20">
              <p className="text-[9px] font-bold text-cyan-500 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Platform Decision-Support Queries
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pb-1.5 scrollbar-thin">
                {quickPrompts.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q.prompt)}
                    className="text-[9.5px] px-2.5 py-1 bg-[#090b1e] hover:bg-cyan-500/10 hover:text-cyan-400 text-slate-300 rounded-md border border-cyan-500/15 hover:border-cyan-500/35 transition-all flex-shrink-0 font-medium"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="p-3 bg-[#060814]/60 border-t border-cyan-500/20 flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask the AI Advisor about workforce..."
                className="input-field text-xs flex-1 bg-[#090b1e] border-cyan-500/20 focus:border-cyan-500/50 focus:ring-cyan-500/10 text-slate-200"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="btn-primary px-3.5 py-1.5 text-xs flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 border-cyan-500/20 text-[#060814]"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
