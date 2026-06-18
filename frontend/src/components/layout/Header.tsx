import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, LogOut, ChevronDown, Globe } from 'lucide-react';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { setSidebarMobileOpen } from '../../store/slices/uiSlice';
import { useState, useEffect, useRef } from 'react';
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
  
  // Translation States
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('currentLanguage') || 'en');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const translateIntervalRef = useRef<any>(null);

  // Synchronize Google Translate drop-down on initial mount
  useEffect(() => {
    const storedLang = localStorage.getItem('currentLanguage') || 'en';
    changeLanguage(storedLang, true);
    
    return () => {
      if (translateIntervalRef.current) {
        clearInterval(translateIntervalRef.current);
      }
    };
  }, []);

  const changeLanguage = (langCode: string, silent = false) => {
    setCurrentLang(langCode);
    localStorage.setItem('currentLanguage', langCode);
    
    // Clear any pending translation polling
    if (translateIntervalRef.current) {
      clearInterval(translateIntervalRef.current);
      translateIntervalRef.current = null;
    }
    
    // Set Google Translate cookie
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    if (window.location.hostname.includes('.')) {
      const parts = window.location.hostname.split('.');
      if (parts.length > 2) {
        const rootDomain = '.' + parts.slice(-2).join('.');
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${rootDomain}`;
      }
    }

    let attempts = 0;
    const maxAttempts = 20; // Poll for 4 seconds (20 * 200ms)
    
    const tryTranslate = () => {
      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectEl) {
        if (selectEl.value !== langCode) {
          selectEl.value = langCode;
          selectEl.dispatchEvent(new Event('change'));
        } else {
          selectEl.dispatchEvent(new Event('change'));
        }
        
        const isTranslated = document.documentElement.classList.contains('translated-ltr') || 
                             document.documentElement.classList.contains('translated-rtl') ||
                             document.body.classList.contains('translated-ltr') ||
                             document.body.classList.contains('translated-rtl');
                             
        if (langCode === 'en' || isTranslated || attempts > 8) {
          if (translateIntervalRef.current) {
            clearInterval(translateIntervalRef.current);
            translateIntervalRef.current = null;
          }
        }
      }
      attempts++;
      if (attempts >= maxAttempts) {
        if (translateIntervalRef.current) {
          clearInterval(translateIntervalRef.current);
          translateIntervalRef.current = null;
        }
      }
    };

    tryTranslate();
    translateIntervalRef.current = setInterval(tryTranslate, 200);
    
    if (!silent) {
      toast.success(`Language set to ${
        langCode === 'ta' ? 'Tamil' : 
        langCode === 'hi' ? 'Hindi' : 
        langCode === 'en' ? 'English' : 
        worldLanguages.find(l => l.code === langCode)?.name.split(' ')[0] || 'Selected Language'
      }`);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-[#060814]/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center gap-4 shadow-sm sticky top-0 z-10">
      {/* Mobile menu toggle */}
      <button
        onClick={() => dispatch(setSidebarMobileOpen(true))}
        className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Custom styled translation bar replacing the old search bar */}
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

        {/* More popular languages */}
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
                      changeLanguage(lang.code);
                      setShowMoreMenu(false);
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

      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-[#060814] flex items-center justify-center text-sm font-bold shadow-sm">
              {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-slate-200">{user?.firstName || 'Admin'} {user?.lastName || 'User'}</div>
              <div className="text-xs text-slate-500">{user?.roles?.[0] || 'Super Admin'}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0e112a] rounded-xl shadow-glass border border-white/5 py-1 z-50">
              <div className="px-4 py-2 border-b border-white/5">
                <div className="text-sm font-medium text-slate-200">{user?.firstName || 'Admin'} {user?.lastName || 'User'}</div>
                <div className="text-xs text-slate-500">{user?.email || 'admin@agshealth.com'}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
