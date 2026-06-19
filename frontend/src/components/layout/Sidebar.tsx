import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import {
  LayoutDashboard, Users, Briefcase, BookOpen, GraduationCap,
  TrendingUp, BarChart3, FileText, ChevronLeft, ChevronRight,
  Menu, TrendingDown
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Employees', icon: Users, path: '/employees' },
  { label: 'Recruitment', icon: Briefcase, path: '/recruitment' },
  { label: 'LMS Courses', icon: BookOpen, path: '/lms/courses' },
  { label: 'Training', icon: GraduationCap, path: '/training' },
  { label: 'Performance', icon: TrendingUp, path: '/performance' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Profit & Loss Analyzer', icon: TrendingDown, path: '/profit-loss' },
  { label: 'Reports', icon: FileText, path: '/reports' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const { sidebarCollapsed, sidebarMobileOpen } = useSelector((s: RootState) => s.ui);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={clsx(
        'relative z-30 flex flex-col h-full flex-shrink-0',
        'gradient-primary shadow-xl',
        'lg:translate-x-0 transition-transform duration-300',
        sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        'fixed lg:relative'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 h-16">
        {sidebarCollapsed ? (
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0 mx-auto">
            <img
              src="https://cdn-bpead.nitrocdn.com/BBpeMUqwtpRtLgerjeQhQjKhWBtMWEQP/assets/images/optimized/rev-e5326ea/www.agshealth.com/wp-content/uploads/2022/09/ags-siticon.png"
              alt="AGS Health"
              className="w-7 h-7 object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1 pl-1">
            <img
              src="https://cdn-bpead.nitrocdn.com/BBpeMUqwtpRtLgerjeQhQjKhWBtMWEQP/assets/images/optimized/rev-e5326ea/www.agshealth.com/wp-content/uploads/2022/09/AGS-Health-Logo-White.svg"
              alt="AGS Health"
              className="h-6 w-auto object-contain"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={sidebarCollapsed ? item.label : undefined}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group border border-transparent',
                isActive
                  ? 'bg-primary/10 text-primary border-primary/10 font-semibold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-slate-100'
              )}
            >
              <Icon className={clsx('w-5 h-5 flex-shrink-0', isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-200')} />
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && !sidebarCollapsed && (
                <motion.div
                  layoutId="active-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all duration-200 text-xs font-medium"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
