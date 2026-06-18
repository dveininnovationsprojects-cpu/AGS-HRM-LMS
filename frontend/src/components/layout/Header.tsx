import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, LogOut, ChevronDown } from 'lucide-react';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { setSidebarMobileOpen } from '../../store/slices/uiSlice';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((s: RootState) => s.auth.user);
  const [showUserMenu, setShowUserMenu] = useState(false);

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

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search employees, courses, reports..."
            className="w-full pl-9 pr-4 py-2 bg-[#0c0e25] border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
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
