import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Loader, Zap, HelpCircle } from 'lucide-react';
import api from '../../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CHATBOT_LOGO = 'https://branition.com/assets/img/users/logos/15060-qJ7ZZ6J.webp?v2';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AGS Health Workforce AI Advisor. How can I help you analyze our workforce analytics, performance, or financial margins today? Click the '?' icon above to see suggested analytical queries.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Typing state for advisor greeting bubble
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTypedText('');
      return;
    }
    
    let isMounted = true;
    let index = 0;
    let currentText = '';
    let timer: any;
    const fullText = "Hii, I am your AI Advisor";
    
    const tick = () => {
      if (!isMounted) return;
      
      currentText = fullText.slice(0, index + 1);
      index++;
      setTypedText(currentText);
      
      if (index < fullText.length) {
        timer = setTimeout(tick, 100); // Typing speed
      } else {
        // Finished typing! Wait 2 seconds, then clear the message so it disappears
        timer = setTimeout(() => {
          if (isMounted) {
            setTypedText('');
          }
        }, 2000);
      }
    };
    
    timer = setTimeout(tick, 1500); // Initial delay before typing starts
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen]);

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

  // Custom markdown bold & lists parser (renders styled emerald green text)
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
            return <strong key={partIdx} className="font-bold text-emerald-300">{part}</strong>;
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
            return <strong key={partIdx} className="font-bold text-emerald-300">{part}</strong>;
          }
          return part;
        });
        return (
          <div key={lineIdx} className="flex gap-1.5 text-xs mt-1">
            <span className="text-emerald-400 font-bold">{numberPrefix}</span>
            <span className="flex-1 font-normal text-slate-300">{parsedClean}</span>
          </div>
        );
      }

      const parts = line.split(/\*\*([\s\S]*?)\*\*/g);
      const parsedLine = parts.map((part, partIdx) => {
        if (partIdx % 2 === 1) {
          return <strong key={partIdx} className="font-bold text-emerald-300">{part}</strong>;
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popup Chatbox Panel with Neon Accent Glows */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute bottom-20 right-0 w-[370px] max-w-[calc(100vw-2rem)] h-[490px] max-h-[calc(100vh-8rem)] bg-[#090b1e]/98 backdrop-blur-md rounded-2xl border border-emerald-500/25 shadow-[0_0_25px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden"
          >
            {/* Top glowing neon light accent */}
            <div className="h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 w-full flex-shrink-0" />

            {/* Glowing background blob animations inside chat container */}
            <div className="absolute inset-0 bg-[#090b1e]/98 -z-10" />
            <div className="absolute top-1/4 left-1/4 w-28 h-28 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-teal-500/5 rounded-full blur-[60px] pointer-events-none -z-10" />

            {/* Header */}
            <div className="bg-[#060814] px-4 py-3 flex items-center justify-between border-b border-emerald-500/20">
              <div className="flex items-center gap-2.5">
                <img
                  src={CHATBOT_LOGO}
                  alt="Workforce AI Advisor Logo"
                  className="w-8 h-8 rounded-full border border-emerald-500/30 object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 tracking-wide">Workforce AI Advisor</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-slate-400 font-semibold">ONLINE & SECURE</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Suggestions Trigger Button (?) */}
                <button
                  onClick={() => setShowPrompts(!showPrompts)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    showPrompts
                      ? 'bg-emerald-500/25 text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'bg-[#0c0e25] hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 border-emerald-500/15'
                  }`}
                  title="Suggested Queries"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                {/* Close Button Inside the Chatbot UI Header */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-[#0c0e25] hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 border border-emerald-500/15 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-emerald-500/20 bg-[#060814] flex items-center justify-center">
                    {msg.role === 'assistant' ? (
                      <img src={CHATBOT_LOGO} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className={`max-w-[80%] px-3.5 py-2 rounded-xl border leading-relaxed ${
                    msg.role === 'assistant' 
                      ? 'bg-[#060814]/80 text-slate-200 border-emerald-500/15 rounded-tl-none shadow-[0_2px_8px_rgba(0,0,0,0.2)]' 
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-[#060814] border-emerald-500/20 rounded-tr-none font-medium shadow-[0_2px_8px_rgba(16,185,129,0.15)]'
                  }`}>
                    <div className="space-y-1.5">
                      {msg.role === 'assistant' ? parseMarkdown(msg.content) : msg.content}
                    </div>
                    <div className={`text-[8.5px] mt-1 text-right ${
                      msg.role === 'assistant' ? 'text-slate-500' : 'text-emerald-950 font-bold'
                    }`}>
                      {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-emerald-500/20 bg-[#060814] flex items-center justify-center">
                    <img src={CHATBOT_LOGO} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-[#060814]/80 border border-emerald-500/15 px-3.5 py-2 rounded-xl rounded-tl-none flex items-center gap-2">
                    <Loader className="w-3 h-3 animate-spin text-emerald-400" />
                    <span className="text-[9.5px] text-slate-400">Analyzing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Collapsible Suggestions / Quick Prompts Drawer */}
            <AnimatePresence>
              {showPrompts && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 py-3 bg-[#060814] border-t border-emerald-500/25 overflow-hidden flex-shrink-0"
                >
                  <p className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Suggested Analytical Queries
                  </p>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1.5 scrollbar-thin">
                    {quickPrompts.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          sendMessage(q.prompt);
                          setShowPrompts(false); // Hide panel after query selection
                        }}
                        className="w-full text-center px-4 py-2.5 bg-[#090b1e]/90 hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-teal-500/20 hover:text-emerald-300 text-slate-300 rounded-xl border border-emerald-500/15 hover:border-emerald-500/40 shadow-sm hover:shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all duration-300 font-semibold text-xs tracking-wide cursor-pointer"
                        title={q.prompt}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Footer Area */}
            <div className="p-3 bg-[#060814]/60 border-t border-emerald-500/20 flex gap-2 flex-shrink-0">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask Advisor about workforce..."
                className="input-field text-xs flex-1 bg-[#090b1e] border-emerald-500/20 focus:border-emerald-500/50 focus:ring-emerald-500/10 text-slate-200"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="btn-primary px-3.5 py-1.5 text-xs flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 border-emerald-500/20 text-[#060814]"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typing Bubble above the Floating Action Button */}
      <AnimatePresence>
        {!isOpen && typedText && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="px-3.5 py-2 mb-1 bg-[#090b1e]/95 backdrop-blur-md rounded-xl border border-emerald-500/35 shadow-[0_0_15px_rgba(16,185,129,0.25)] text-emerald-400 text-xs font-semibold tracking-wide whitespace-nowrap relative select-none cursor-pointer hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300"
            onClick={() => setIsOpen(true)}
          >
            <span>{typedText}</span>
            <span className="inline-block w-1 h-3.5 bg-emerald-400 ml-0.5 animate-pulse align-middle" />
            
            {/* Tooltip triangle point */}
            <div className="absolute -bottom-1.5 right-[22px] w-2.5 h-2.5 bg-[#090b1e] border-r border-b border-emerald-500/35 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (Only Launcher) */}
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
        className="w-14 h-14 rounded-full bg-[#060814] flex items-center justify-center shadow-[0_0_18px_rgba(16,185,129,0.35)] hover:shadow-[0_0_28px_rgba(16,185,129,0.7)] border-2 border-emerald-500/50 relative overflow-hidden"
      >
        <img
          src={CHATBOT_LOGO}
          alt="AI Advisor Logo"
          className="w-full h-full object-cover"
        />
      </motion.button>
    </div>
  );
}
