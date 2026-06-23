import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, LogOut, ChevronDown, Globe, Sparkles } from 'lucide-react';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { setSidebarMobileOpen } from '../../store/slices/uiSlice';
import { useState } from 'react';
import toast from 'react-hot-toast';

const worldLanguages = [
  { name: 'Spanish (Español)', code: 'es' },
  { name: 'French (Français)', code: 'fr' },
  { name: 'German (Deutsch)', code: 'de' },
  { name: 'Arabic (العربية)', code: 'ar' },
  { name: 'Japanese (日本語)', code: 'ja' },
  { name: 'Chinese (中文)', code: 'zh-CN' },
  { name: 'Portuguese (Português)', code: 'pt' },
  { name: 'Telugu (తెలుగు)', code: 'te' },
  { name: 'Kannada (ಕನ್ನಡ)', code: 'kn' },
  { name: 'Malayalam (മലയാളം)', code: 'ml' },
  { name: 'Bengali (বাংলা)', code: 'bn' },
  { name: 'Russian (Русский)', code: 'ru' },
  { name: 'Italian (Italiano)', code: 'it' },
  { name: 'Korean (한국어)', code: 'ko' },
  { name: 'Urdu (اردو)', code: 'ur' },
  { name: 'Gujarati (ગુજરાતી)', code: 'gu' }
];

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((s: RootState) => s.auth.user);
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  // Client Attraction Simulator state
  const [showSimulator, setShowSimulator] = useState(false);
  const [prodLift, setProdLift] = useState(15);
  const [particles, setParticles] = useState<{ id: number; x: number; size: number; color: string }[]>([]);

  const triggerSparkles = () => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      size: Math.random() * 8 + 4,
      color: Math.random() > 0.5 ? '#10b981' : '#6366f1'
    }));
    setParticles(newParticles);
    setTimeout(() => {
      setParticles([]);
    }, 2500);
  };
  
  // Get initial language from localStorage
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('currentLanguage') || 'en');

  const changeLanguage = (langCode: string) => {
    if (langCode === currentLang) return; // Prevent reload if same language is clicked

    localStorage.setItem('currentLanguage', langCode);

    if (langCode === 'en') {
      // Cleanly remove all Google Translate cookies for English
      const domains = [
        window.location.hostname,
        '.' + window.location.hostname,
        'localhost',
        '.localhost'
      ];
      domains.forEach(domain => {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });
    } else {
      // Set precise cookie for other languages
      const cookieVal = `/en/${langCode}`;
      document.cookie = `googtrans=${cookieVal}; path=/`;
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname}`;
      
      if (window.location.hostname.includes('.')) {
        const parts = window.location.hostname.split('.');
        if (parts.length >= 2) {
          const rootDomain = '.' + parts.slice(-2).join('.');
          document.cookie = `googtrans=${cookieVal}; path=/; domain=${rootDomain}`;
        }
      }
    }

    // Reload the window to apply changes cleanly without DOM corruption
    window.location.reload();
  };

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-[#060814]/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center gap-4 shadow-sm sticky top-0 z-10">
      <button
        onClick={() => dispatch(setSidebarMobileOpen(true))}
        className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 flex-wrap">
        <Globe className="w-4 h-4 text-emerald-500 mr-1 hidden sm:block animate-pulse" />
        
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
            currentLang === 'en'
              ? 'bg-primary/15 text-primary border-primary/35 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
              : 'bg-[#0c0e25] hover:bg-primary/10 text-slate-300 hover:text-primary border-white/10 hover:border-primary/30'
          }`}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('ta')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
            currentLang === 'ta'
              ? 'bg-primary/15 text-primary border-primary/35 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
              : 'bg-[#0c0e25] hover:bg-primary/10 text-slate-300 hover:text-primary border-white/10 hover:border-primary/30'
          }`}
        >
          தமிழ்
        </button>
        <button
          onClick={() => changeLanguage('hi')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
            currentLang === 'hi'
              ? 'bg-primary/15 text-primary border-primary/35 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
              : 'bg-[#0c0e25] hover:bg-primary/10 text-slate-300 hover:text-primary border-white/10 hover:border-primary/30'
          }`}
        >
          हिन्दी
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
              !['en', 'ta', 'hi'].includes(currentLang)
                ? 'bg-primary/15 text-primary border-primary/35 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                : 'bg-[#0c0e25] hover:bg-primary/10 text-slate-300 hover:text-primary border-white/10 hover:border-primary/30'
            }`}
          >
            <span>{!['en', 'ta', 'hi'].includes(currentLang) ? worldLanguages.find(l => l.code === currentLang)?.name.split(' ')[0] || 'More' : 'More'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showMoreMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
              <div className="absolute left-0 top-full mt-2 w-72 bg-[#0e112a] rounded-xl shadow-glass border border-white/5 p-3 grid grid-cols-2 gap-1.5 z-50 max-h-72 overflow-y-auto scrollbar-thin">
                {worldLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setShowMoreMenu(false);
                      changeLanguage(lang.code);
                    }}
                    className={`text-left text-[11px] px-2 py-1.5 rounded-lg border transition-all truncate ${
                      currentLang === lang.code
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'bg-[#090b1e] hover:bg-primary/10 text-slate-300 hover:text-primary border-white/5'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Client Attraction Widget: AGS Platform Health Index */}
        <div className="relative">
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-bold transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.1)] relative group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping absolute left-3 top-[44%]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute left-3 top-[44%]"></span>
            <span className="pl-3.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              AGS Pulse: <span className="text-white">98%</span>
            </span>
          </button>

          {showSimulator && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSimulator(false)} />
              <div className="absolute right-0 top-full mt-3 w-80 bg-gradient-to-b from-[#0e112a] to-[#0a0d20] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-indigo-500/20 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">AGS Intelligence</h4>
                    <h3 className="text-sm font-black text-slate-100 mt-0.5">Talent Yield Simulator</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-[10px] font-black text-emerald-400">DEMO MODE</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Simulate Productivity Lift:</span>
                      <span className="font-bold text-emerald-400">+{prodLift}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="30" 
                      value={prodLift} 
                      onChange={(e) => setProdLift(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                    />
                  </div>

                  <div className="bg-[#060814]/80 p-3 rounded-xl space-y-2 border border-white/5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Predicted Revenue Increase:</span>
                      <span className="font-semibold text-emerald-400">+${(prodLift * 2450).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Predicted Talent Retention:</span>
                      <span className="font-semibold text-indigo-400">{98 + Math.min(2, Math.round(prodLift/10))}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">ROI Assessment:</span>
                      <span className="font-bold text-emerald-400">{prodLift > 15 ? '🚀 High Yield' : '📈 Steady Growth'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      triggerSparkles();
                      toast.success('Simulated Growth Target Applied!', {
                        icon: '✨',
                        style: {
                          background: '#0e112a',
                          color: '#fff',
                          border: '1px solid rgba(16, 185, 129, 0.2)'
                        }
                      });
                    }}
                    className="w-full btn-primary py-2 text-xs font-extrabold flex items-center justify-center gap-1.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Spotlight Client Success
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Separator line */}
        <div className="h-6 w-[1px] bg-white/10 hidden sm:block"></div>

        {/* Clean Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/25 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-all duration-300"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>

      {/* Floating Sparkles Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full animate-float-sparkle"
            style={{
              left: `${p.x}%`,
              bottom: '-20px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              opacity: 0.8,
              animationDelay: `${Math.random() * 0.4}s`,
              animationDuration: `${1.5 + Math.random() * 1}s`
            }}
          />
        ))}
      </div>

      {/* Self-contained CSS for rising sparkles */}
      <style>{`
        @keyframes floatSparkle {
          0% {
            transform: translateY(10px) scale(1) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-110vh) scale(0.3) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-sparkle {
          animation-name: floatSparkle;
          animation-timing-function: cubic-bezier(0.1, 0.8, 0.3, 1);
          animation-fill-mode: forwards;
        }
      `}</style>
    </header>
  );
}