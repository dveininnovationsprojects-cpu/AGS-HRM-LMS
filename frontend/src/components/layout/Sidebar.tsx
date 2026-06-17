import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import {
  LayoutDashboard, Users, UserCheck, Clock, DollarSign, Briefcase,
  BookOpen, GraduationCap, TrendingUp, BarChart3, Bot, FileText,
  Building2, ChevronLeft, ChevronRight, Menu, Layers, TrendingDown
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Employees', icon: Users, path: '/employees' },
  { label: 'Departments', icon: Building2, path: '/departments' },
  { label: 'Attendance', icon: Clock, path: '/attendance' },
  { label: 'Leave Management', icon: UserCheck, path: '/leaves' },
  { label: 'Payroll', icon: DollarSign, path: '/payroll' },
  { label: 'Recruitment', icon: Briefcase, path: '/recruitment' },
  { label: 'LMS Courses', icon: BookOpen, path: '/lms/courses' },
  { label: 'Training', icon: GraduationCap, path: '/training' },
  { label: 'Performance', icon: TrendingUp, path: '/performance' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Profit & Loss Analyzer', icon: TrendingDown, path: '/profit-loss' },
  { label: 'AI Advisor', icon: Bot, path: '/ai-advisor' },
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
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
          <Layers className="w-5 h-5 text-primary" />
        </div>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-slate-100 font-bold text-sm leading-tight">AGS Health</div>
            <div className="text-primary text-xs font-medium tracking-wide">Workforce Intel</div>
          </motion.div>
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
