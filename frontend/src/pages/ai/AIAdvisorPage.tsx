import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Zap, TrendingDown, BookOpen, Briefcase, Loader } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AGS Health Workforce AI Advisor. I can help you with:\n• Workforce insights and analytics\n• Attrition risk predictions\n• Training recommendations\n• Hiring strategies\n• Performance analysis\n\nWhat would you like to explore today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string>('');
  const [attrition, setAttrition] = useState<any[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', {
        message: input,
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
        content: 'I apologize, but I\'m temporarily unavailable. Please ensure the OpenAI API key is configured.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    setInsightsLoading(true);
    try {
      const res = await api.get('/ai/insights');
      setInsights(res.data.data.insights || '');
    } catch { toast.error('Failed to load insights'); }
    finally { setInsightsLoading(false); }
  };

  const loadAttrition = async () => {
    try {
      const res = await api.get('/ai/attrition');
      setAttrition(res.data.data.predictions || []);
    } catch { toast.error('Failed to load attrition data'); }
  };

  const quickPrompts = [
    'Why did operating profit decrease this month?',
    'Which HR recruiter hires the most proficient employees?',
    'Which trainer creates the highest-performing workforce?',
    'Which Team Lead contributes most to business growth?',
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="AI Advisor" subtitle="Powered by OpenAI — Intelligent workforce recommendations" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chat */}
        <div className="lg:col-span-2 bg-[#0e112a] rounded-2xl shadow-card border border-white/5 flex flex-col h-[600px]">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
            <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Workforce AI Advisor</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-400">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-primary/10 border border-primary/20' : 'bg-[#0c0e25] border border-white/10'}`}>
                    {msg.role === 'assistant' ? <Bot className="w-3.5 h-3.5 text-primary" /> : <User className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'assistant' ? 'bg-[#0c0e25] text-slate-200 border border-white/5 rounded-tl-none' : 'bg-primary text-[#060814] font-medium rounded-tr-none'}`}>
                    <div className="whitespace-pre-line">{msg.content}</div>
                    <div className={`text-xs mt-1 ${msg.role === 'assistant' ? 'text-slate-500' : 'text-emerald-700 font-semibold'}`}>
                      {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="bg-[#0c0e25] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none">
                  <Loader className="w-4 h-4 animate-spin text-slate-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-4 py-2 border-t border-white/5">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {quickPrompts.map((p, i) => (
                <button key={i} onClick={() => setInput(p)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 bg-[#0c0e25] hover:bg-primary/10 hover:text-primary text-slate-400 rounded-full border border-white/5 transition-colors">
                  {p.substring(0, 42)}...
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/5">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask the AI Advisor anything..."
                className="input-field flex-1"
                disabled={loading}
              />
              <button onClick={sendMessage} disabled={loading || !input.trim()} className="btn-primary px-4">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="space-y-4">
          {/* AI Insights */}
          <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Workforce Insights
              </h3>
              <button onClick={loadInsights} disabled={insightsLoading} className="text-xs text-primary hover:underline">
                {insightsLoading ? 'Loading...' : 'Generate'}
              </button>
            </div>
            {insights ? (
              <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{insights}</div>
            ) : (
              <div className="text-xs text-slate-500 text-center py-4">Click "Generate" for AI-powered workforce insights</div>
            )}
          </div>

          {/* Attrition Risk */}
          <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" /> Attrition Risk
              </h3>
              <button onClick={loadAttrition} className="text-xs text-primary hover:underline">Load</button>
            </div>
            <div className="space-y-2">
              {attrition.slice(0, 5).map((emp, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">{emp.first_name} {emp.last_name}</span>
                  <span className={emp.attrition_risk === 'High' ? 'status-rejected' : emp.attrition_risk === 'Medium' ? 'status-pending' : 'status-approved'}>
                    {emp.attrition_risk}
                  </span>
                </div>
              ))}
              {attrition.length === 0 && <div className="text-xs text-slate-500 text-center py-3">Click "Load" to see predictions</div>}
            </div>
          </div>

          {/* Quick AI Actions */}
          <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">Quick AI Analysis</h3>
            <div className="space-y-2">
              {[
                { label: 'Training Recommendations', icon: BookOpen, prompt: 'What training programs should we prioritize this quarter?' },
                { label: 'Hiring Strategy', icon: Briefcase, prompt: 'Based on current team structure, what positions should we hire for?' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => { setInput(action.prompt); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-[#0c0e25] hover:bg-primary/10 hover:text-primary text-slate-300 border border-white/5 rounded-xl transition-colors text-xs font-semibold text-left"
                >
                  <action.icon className="w-4 h-4 flex-shrink-0" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
