import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, DollarSign, TrendingUp,
  Briefcase, BookOpen, AlertCircle, ArrowUpRight, ArrowDownRight,
  Trophy, UserX, Target, MapPin, Building2, Globe
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import api from '../../services/api';
import CountUp from '../../components/ui/CountUp';
import BranchMap from '../../components/ui/BranchMap';
import { BRANCH_DATA, GLOBAL_DATA, COUNTRIES, STATES_BY_COUNTRY, getAggregatedData, type BranchData } from '../../data/branchData';

const DEPT_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#64748b'];
const RETENTION_COLORS = ['#8b5cf6', '#10b981', '#06b6d4'];

const riskConfig: Record<string, string> = {
  Critical: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  High:     'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Medium:   'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Low:      'bg-sky-500/20 text-sky-300 border-sky-500/30',
};

// Curated themes for each KPI card (colors, soft glow gradients, borders)
const cardThemes: Record<number, { borderClass: string, shadowClass: string, color: string }> = {
  0: { borderClass: 'hover:border-emerald-500/60', shadowClass: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.18)]', color: '#10b981' }, // Employees
  1: { borderClass: 'hover:border-teal-500/60',    shadowClass: 'hover:shadow-[0_0_25px_rgba(20,184,166,0.18)]', color: '#14b8a6' }, // Active
  2: { borderClass: 'hover:border-indigo-500/60',  shadowClass: 'hover:shadow-[0_0_25px_rgba(99,102,241,0.18)]', color: '#6366f1' }, // Revenue
  3: { borderClass: 'hover:border-rose-500/60',    shadowClass: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.18)]',   color: '#f43f5e' }, // Cost
  4: { borderClass: 'hover:border-emerald-500/60', shadowClass: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.18)]', color: '#10b981' }, // Profit
  5: { borderClass: 'hover:border-orange-500/60',  shadowClass: 'hover:shadow-[0_0_25px_rgba(249,115,22,0.18)]',  color: '#f97316' }, // Attrition
  6: { borderClass: 'hover:border-purple-500/60',  shadowClass: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.18)]',  color: '#a855f7' }, // Hiring
  7: { borderClass: 'hover:border-sky-500/60',     shadowClass: 'hover:shadow-[0_0_25px_rgba(14,165,233,0.18)]',  color: '#0ea5e9' }, // Training
};

// Generates dynamic trend data based on selected branch and index
const getSparklineData = (cardIndex: number, branch: BranchData): number[] => {
  switch (cardIndex) {
    case 0: // Total Employees
      return branch.monthlyTrend.map((t, idx) => branch.headCount - (6 - idx) * 3 + t.joiners - t.leavers);
    case 1: // Active Employees
      return branch.monthlyTrend.map((t, idx) => branch.activeEmployees - (6 - idx) * 2 + t.joiners - t.leavers);
    case 2: // Revenue
      return branch.monthlyTrend.map(t => t.revenue);
    case 3: // Cost
      return branch.monthlyTrend.map((t, idx) => t.revenue - branch.profit * (0.8 + Math.sin(idx) * 0.05));
    case 4: // Net Profit
      return branch.monthlyTrend.map(t => t.revenue * (branch.profit / branch.revenue));
    case 5: // Attrition Rate
      return branch.monthlyTrend.map(t => t.leavers * 2.5 + 2);
    case 6: // Hiring Efficiency
      return [branch.hiringEfficiency - 4, branch.hiringEfficiency - 2, branch.hiringEfficiency + 1, branch.hiringEfficiency - 1, branch.hiringEfficiency, branch.hiringEfficiency + 2];
    case 7: // Training ROI
      return [branch.trainingROI - 12, branch.trainingROI - 8, branch.trainingROI + 4, branch.trainingROI - 2, branch.trainingROI, branch.trainingROI + 8];
    default:
      return [10, 20, 15, 30, 25, 40];
  }
};

const generateSparklinePath = (points: number[], width = 70, height = 24) => {
  if (points.length === 0) return '';
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  return points.map((val, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - 2 - ((val - min) / range) * (height - 4);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
};

const generateSparklineFillPath = (points: number[], width = 70, height = 24) => {
  if (points.length === 0) return '';
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const linePoints = points.map((val, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - 2 - ((val - min) / range) * (height - 4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `M 0,${height} L ${linePoints.join(' L ')} L ${width},${height} Z`;
};

const formatRevenue = (value: number) => {
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  return `$${(value / 1000).toFixed(0)}k`;
};

// Fade-in wrapper — fast, non-blocking, no unmount delay
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function DashboardPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    api.get('/dashboard/stats').catch(() => {});
  }, []);

  const b = getAggregatedData({
    country: selectedCountry,
    state: selectedState,
    branchId: selectedBranchId
  });

  const handleMapBranchSelect = (branch: BranchData) => {
    setSelectedCountry(branch.country);
    setSelectedState(branch.state);
    setSelectedBranchId(branch.id);
  };

  const statCards = [
    { title: 'Total Employees',   value: b.headCount,         icon: Users,       color: 'bg-emerald-500', change: '+5.2%',  up: true,  prefix: '',  suffix: '' },
    { title: 'Active Employees',  value: b.activeEmployees,   icon: UserCheck,   color: 'bg-teal-500',    change: '+2.1%',  up: true,  prefix: '',  suffix: '' },
    { title: 'Total Revenue',     value: b.revenue,           icon: DollarSign,  color: 'bg-indigo-500',  change: '+12.4%', up: true,  prefix: '$', suffix: '' },
    { title: 'Total Cost',        value: b.cost,              icon: DollarSign,  color: 'bg-rose-500',    change: '+3.1%',  up: false, prefix: '$', suffix: '' },
    { title: 'Net Profit',        value: b.profit,            icon: TrendingUp,  color: 'bg-emerald-600', change: '+18.5%', up: true,  prefix: '$', suffix: '' },
    { title: 'Attrition Rate',    value: b.attritionRate,     icon: AlertCircle, color: 'bg-orange-500',  change: '-1.2%',  up: true,  prefix: '',  suffix: '%' },
    { title: 'Hiring Efficiency', value: b.hiringEfficiency,  icon: Briefcase,   color: 'bg-purple-500',  change: '+4.2%',  up: true,  prefix: '',  suffix: '%' },
    { title: 'Training ROI',      value: b.trainingROI,       icon: BookOpen,    color: 'bg-sky-500',     change: '+12%',   up: true,  prefix: '',  suffix: '%' },
  ];

  const recruiterChartData = b.recruiterLeaderboard.map(r => ({
    name: r.name.split(' ')[0],
    Hired: r.hired,
    Active: r.active,
  }));

  const ttStyle = {
    backgroundColor: '#0e112a',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.05)',
    fontSize: 12,
    color: '#e2e8f0',
  };

  return (
    <div className="space-y-6">

      {/* ── Header + Dynamic Cascading Filters ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0f24]/60 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
        <div className="shrink-0">
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            Workforce Intelligence Overview
          </h1>
        </div>

        <div className="flex flex-row flex-nowrap items-end gap-3 shrink-0 overflow-x-auto pb-1">
          {/* Country Filter */}
          <div className="flex flex-col gap-1 shrink-0">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Country</span>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedState('all');
                setSelectedBranchId('all');
              }}
              className="bg-[#0e112a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="all">All Countries</option>
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          {selectedCountry !== 'all' && STATES_BY_COUNTRY[selectedCountry]?.length > 0 && (
            <div className="flex flex-col gap-1 shrink-0">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">State</span>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedBranchId('all');
                }}
                className="bg-[#0e112a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="all">All States</option>
                {STATES_BY_COUNTRY[selectedCountry].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* Branch Filter */}
          <div className="flex flex-col gap-1 shrink-0">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Branch</span>
            <select
              value={selectedBranchId}
              onChange={(e) => {
                const bid = e.target.value;
                setSelectedBranchId(bid);
                if (bid !== 'all') {
                  const found = BRANCH_DATA.find(b => b.id === bid);
                  if (found) {
                    setSelectedCountry(found.country);
                    setSelectedState(found.state);
                  }
                }
              }}
              className="bg-[#0e112a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="all">All Branches</option>
              {BRANCH_DATA
                .filter(br => {
                  if (selectedCountry !== 'all' && br.country !== selectedCountry) return false;
                  if (selectedState !== 'all' && br.state !== selectedState) return false;
                  return true;
                })
                .map(br => (
                  <option key={br.id} value={br.id}>{br.city} ({br.state})</option>
                ))
              }
            </select>
          </div>

          {/* Reset Filters */}
          {(selectedCountry !== 'all' || selectedState !== 'all' || selectedBranchId !== 'all') && (
            <div className="shrink-0">
              <button
                onClick={() => {
                  setSelectedCountry('all');
                  setSelectedState('all');
                  setSelectedBranchId('all');
                }}
                className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 rounded-lg text-xs font-semibold transition-all"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">

        {/* Card 1: Workforce Strength (Total & Active) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05, ease: 'easeOut' }}
          whileHover={{ y: -2 }}
          onMouseEnter={() => setHoveredCard(0)}
          onMouseLeave={() => setHoveredCard(null)}
          className="md:col-span-3 sm:col-span-1 relative overflow-hidden border border-white/5 p-4 rounded-xl transition-all duration-300 shadow-md hover:border-white/20 group cursor-pointer flex flex-col justify-between"
          style={{
            borderColor: hoveredCard === 0 ? '#10b981' : 'rgba(255,255,255,0.05)',
            boxShadow: hoveredCard === 0 ? '0 0 25px rgba(16,185,129,0.15)' : 'none',
            background: hoveredCard === 0
              ? 'radial-gradient(circle at 20px 20px, rgba(16,185,129,0.08) 0%, rgba(14,17,42,0.98) 75%)'
              : 'linear-gradient(135deg, rgba(14,17,42,0.8) 0%, rgba(9,11,27,0.95) 100%)'
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Workforce Strength</span>
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 notranslate" translate="no">
                <ArrowUpRight className="w-3 h-3" />
                +5.2%
              </div>
            </div>
            <div className="flex items-baseline gap-2 notranslate" translate="no">
              <span className="text-xl font-bold text-slate-100 font-mono tracking-tight leading-none">
                <CountUp target={b.headCount} />
              </span>
              <span className="text-[10px] text-slate-400">Total</span>
            </div>

            <div className="flex items-center gap-4 mt-2 text-[10.5px] text-slate-400 border-t border-white/5 pt-2 notranslate" translate="no">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>Active: <strong>{b.activeEmployees}</strong></span>
              </div>
              <span className="text-teal-400 font-semibold">{Math.round((b.activeEmployees / b.headCount) * 100)}% Active</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400 rounded-full" style={{ width: `${(b.activeEmployees / b.headCount) * 100}%` }} />
            </div>
            {/* Sparkline */}
            <div className="w-14 h-6 opacity-80 notranslate" translate="no">
              <svg width="100%" height="100%" viewBox="0 0 70 24">
                <defs>
                  <linearGradient id="sparkline-grad-0" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path d={generateSparklineFillPath(getSparklineData(0, b), 70, 24)} fill="url(#sparkline-grad-0)" />
                <path d={generateSparklinePath(getSparklineData(0, b), 70, 24)} fill="none" stroke="#10b981" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Financial Performance (Revenue, Cost & Profit) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.08, ease: 'easeOut' }}
          whileHover={{ y: -2 }}
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
          className="md:col-span-3 sm:col-span-1 relative overflow-hidden border border-white/5 p-4 rounded-xl transition-all duration-300 shadow-md hover:border-white/20 group cursor-pointer flex flex-col justify-between"
          style={{
            borderColor: hoveredCard === 1 ? '#6366f1' : 'rgba(255,255,255,0.05)',
            boxShadow: hoveredCard === 1 ? '0 0 25px rgba(99,102,241,0.15)' : 'none',
            background: hoveredCard === 1
              ? 'radial-gradient(circle at 20px 20px, rgba(99,102,241,0.08) 0%, rgba(14,17,42,0.98) 75%)'
              : 'linear-gradient(135deg, rgba(14,17,42,0.8) 0%, rgba(9,11,27,0.95) 100%)'
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" style={{ backgroundColor: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Financial Summary</span>
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 notranslate" translate="no">
                <ArrowUpRight className="w-3 h-3" />
                +18.5%
              </div>
            </div>

            <div className="flex items-baseline gap-2 notranslate" translate="no">
              <span className="text-xl font-bold text-slate-100 font-mono tracking-tight leading-none">
                <CountUp target={b.profit} prefix="$" />
              </span>
              <span className="text-[10px] text-slate-400">Net Profit</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 border-t border-white/5 pt-2 text-[10px] text-slate-400 notranslate" translate="no">
              <div>
                <span className="text-slate-500">Rev:</span> <strong className="text-slate-300">${(b.revenue / 1e6).toFixed(2)}M</strong>
              </div>
              <div>
                <span className="text-slate-500">Cost:</span> <strong className="text-slate-300">${(b.cost / 1e6).toFixed(2)}M</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500" style={{ width: `${Math.round((b.profit / b.revenue) * 100)}%` }} />
              <div className="h-full bg-rose-500" style={{ width: `${Math.round((b.cost / b.revenue) * 100)}%` }} />
            </div>
            {/* Sparkline */}
            <div className="w-14 h-6 opacity-80 notranslate" translate="no">
              <svg width="100%" height="100%" viewBox="0 0 70 24">
                <defs>
                  <linearGradient id="sparkline-grad-1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path d={generateSparklineFillPath(getSparklineData(4, b), 70, 24)} fill="url(#sparkline-grad-1)" />
                <path d={generateSparklinePath(getSparklineData(4, b), 70, 24)} fill="none" stroke="#6366f1" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Attrition Rate */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.11, ease: 'easeOut' }}
          whileHover={{ y: -2 }}
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
          className="md:col-span-3 sm:col-span-1 relative overflow-hidden border border-white/5 p-4 rounded-xl transition-all duration-300 shadow-md hover:border-white/20 group cursor-pointer flex flex-col justify-between"
          style={{
            borderColor: hoveredCard === 2 ? '#f97316' : 'rgba(255,255,255,0.05)',
            boxShadow: hoveredCard === 2 ? '0 0 25px rgba(249,115,22,0.15)' : 'none',
            background: hoveredCard === 2
              ? 'radial-gradient(circle at 20px 20px, rgba(249,115,22,0.08) 0%, rgba(14,17,42,0.98) 75%)'
              : 'linear-gradient(135deg, rgba(14,17,42,0.8) 0%, rgba(9,11,27,0.95) 100%)'
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: '#f97316' }}>
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Attrition Rate</span>
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 notranslate" translate="no">
                <ArrowDownRight className="w-3 h-3" />
                -1.2%
              </div>
            </div>

            <div className="flex items-baseline gap-2 notranslate" translate="no">
              <span className="text-xl font-bold text-slate-100 font-mono tracking-tight leading-none">
                <CountUp target={b.attritionRate} suffix="%" decimals={1} />
              </span>
              <span className="text-[10px] text-slate-400">Monthly Average</span>
            </div>
          </div>

          <div className="flex items-end justify-between mt-3">
            <span className="text-[9px] text-slate-500">Low Risk Alert</span>
            {/* Sparkline */}
            <div className="w-14 h-6 opacity-80 notranslate" translate="no">
              <svg width="100%" height="100%" viewBox="0 0 70 24">
                <defs>
                  <linearGradient id="sparkline-grad-2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path d={generateSparklineFillPath(getSparklineData(5, b), 70, 24)} fill="url(#sparkline-grad-2)" />
                <path d={generateSparklinePath(getSparklineData(5, b), 70, 24)} fill="none" stroke="#f97316" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Talent Performance (Hiring & Training) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.14, ease: 'easeOut' }}
          whileHover={{ y: -2 }}
          onMouseEnter={() => setHoveredCard(3)}
          onMouseLeave={() => setHoveredCard(null)}
          className="md:col-span-3 sm:col-span-1 relative overflow-hidden border border-white/5 p-4 rounded-xl transition-all duration-300 shadow-md hover:border-white/20 group cursor-pointer flex flex-col justify-between"
          style={{
            borderColor: hoveredCard === 3 ? '#a855f7' : 'rgba(255,255,255,0.05)',
            boxShadow: hoveredCard === 3 ? '0 0 25px rgba(168,85,247,0.15)' : 'none',
            background: hoveredCard === 3
              ? 'radial-gradient(circle at 20px 20px, rgba(168,85,247,0.08) 0%, rgba(14,17,42,0.98) 75%)'
              : 'linear-gradient(135deg, rgba(14,17,42,0.8) 0%, rgba(9,11,27,0.95) 100%)'
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" style={{ backgroundColor: 'rgba(168,85,247,0.1)', color: '#a855f7' }}>
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Talent Performance</span>
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />
                +4.2%
              </div>
            </div>

            <div className="flex items-baseline gap-2 notranslate" translate="no">
              <span className="text-xl font-bold text-slate-100 font-mono tracking-tight leading-none">
                <CountUp target={b.hiringEfficiency} suffix="%" />
              </span>
              <span className="text-[10px] text-slate-400">Hiring Efficiency</span>
            </div>

            <div className="flex items-center gap-4 mt-2 text-[10.5px] text-slate-400 border-t border-white/5 pt-2 notranslate" translate="no">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>Training ROI: <strong>{b.trainingROI}%</strong></span>
              </div>
              <span className="text-sky-400 font-semibold">Skill Gain</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden flex">
              <div className="h-full bg-purple-500" style={{ width: `${b.hiringEfficiency}%` }} />
            </div>
            {/* Sparkline */}
            <div className="w-14 h-6 opacity-80 notranslate" translate="no">
              <svg width="100%" height="100%" viewBox="0 0 70 24">
                <defs>
                  <linearGradient id="sparkline-grad-3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path d={generateSparklineFillPath(getSparklineData(6, b), 70, 24)} fill="url(#sparkline-grad-3)" />
                <path d={generateSparklinePath(getSparklineData(6, b), 70, 24)} fill="none" stroke="#a855f7" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── India Map + Branch Panel ── */}
      <FadeIn delay={0.3}>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

          {/* Map — 3 cols */}
          <div className="xl:col-span-3 bg-[#0a0f24] rounded-2xl border border-white/5 overflow-hidden" style={{ height: 420 }}>
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-200">
                AGS Health Branch Network — {selectedCountry === 'all' ? 'Global' : selectedCountry}
              </h3>
              <span className="ml-auto text-[10px] text-slate-500">Click marker to filter</span>
            </div>
            <div style={{ height: 374 }} className="notranslate" translate="no">
              <BranchMap
                selectedBranch={b}
                onBranchSelect={handleMapBranchSelect}
                selectedCountry={selectedCountry}
                selectedState={selectedState}
              />
            </div>
          </div>

          {/* Branch Detail — 2 cols */}
          <div className="xl:col-span-2 bg-[#0a0f24] rounded-2xl border border-white/5 overflow-hidden flex flex-col" style={{ height: 420 }}>
            {/* Branch header */}
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-500/10 to-transparent border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <motion.h3 key={`city-${b.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="text-base font-bold text-slate-100 notranslate" translate="no">{b.city}</motion.h3>
                {b.id !== 'all' && (
                  <motion.span key={`est-${b.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 ml-auto notranslate" translate="no">
                    Est. {b.established}
                  </motion.span>
                )}
              </div>
              <motion.p key={`addr-${b.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="text-[10px] text-slate-500 mt-0.5 truncate notranslate" translate="no">{b.address}</motion.p>
              {/* Mini KPIs */}
              <motion.div key={`kpi-${b.id}`} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="grid grid-cols-3 gap-2 mt-3 notranslate" translate="no">
                {[
                  { label: 'Attrition', val: `${b.attritionRate}%`, cls: 'text-orange-400' },
                  { label: 'SLA', val: `${b.slaCompliance}%`, cls: b.slaCompliance >= 90 ? 'text-emerald-400' : b.slaCompliance >= 80 ? 'text-amber-400' : 'text-rose-400' },
                  { label: 'LMS Score', val: `${b.avgLmsScore}%`, cls: 'text-sky-400' },
                ].map(k => (
                  <div key={k.label} className="text-center">
                    <p className={`text-base font-bold ${k.cls}`}>{k.val}</p>
                    <p className="text-[9px] text-slate-500">{k.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Dept pie */}
            <div className="px-4 py-3 border-b border-white/5 flex-shrink-0">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-2">Role Distribution</p>
              <motion.div key={`dept-${b.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="flex gap-3 items-center notranslate" translate="no">
                <ResponsiveContainer width={80} height={80}>
                  <PieChart>
                    <Pie data={b.topDepts} cx="50%" cy="50%" innerRadius={22} outerRadius={36} paddingAngle={2} dataKey="count">
                      {b.topDepts.map((_, i) => <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-0.5">
                  {b.topDepts.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: DEPT_COLORS[i] }} />
                        <span className="text-slate-400">{d.name}</span>
                      </div>
                      <span className="text-slate-200 font-medium notranslate" translate="no">{d.count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Resource health */}
            <div className="px-4 py-3 flex-1 flex flex-col gap-2">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Resource Health</p>
              <motion.div key={`health-${b.id}`} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center notranslate" translate="no">
                    <p className="text-lg font-bold text-amber-400">{b.benchStrength}</p>
                    <p className="text-[9px] text-slate-500">Bench Strength</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center notranslate" translate="no">
                    <p className="text-lg font-bold text-purple-400">{b.openPositions}</p>
                    <p className="text-[9px] text-slate-500">Open Positions</p>
                  </div>
                </div>
                {/* Revenue bar */}
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-500">Revenue Contribution</span>
                    <span className="text-emerald-400 font-semibold notranslate" translate="no">
                      ${(b.revenue / 1e6).toFixed(2)}M / ${(GLOBAL_DATA.revenue / 1e6).toFixed(2)}M
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(1, Math.min(100, Math.round((b.revenue / GLOBAL_DATA.revenue) * 100)))}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 mt-0.5 text-right notranslate" translate="no">
                    {Math.round((b.revenue / GLOBAL_DATA.revenue) * 100)}% of Global Revenue
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Headcount Trend */}
        <FadeIn delay={0.38} className="xl:col-span-3 h-full">
          <div className="bg-[#0e112a] rounded-2xl p-5 border border-white/5 h-full flex flex-col">
            <h3 className="font-semibold text-slate-200 mb-1 text-sm">Headcount Trend — {b.city}</h3>
            <p className="text-xs text-slate-400 mb-4">Monthly joiners vs leavers</p>
            <div className="notranslate" translate="no">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={b.monthlyTrend}>
                  <defs>
                    <linearGradient id="joinersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="leaversGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={ttStyle} itemStyle={{ color: '#e2e8f0' }} labelStyle={{ color: '#94a3b8' }} />
                  <Area type="monotone" dataKey="joiners" stroke="#10b981" strokeWidth={2.5} fill="url(#joinersGrad)" name="Joiners" dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }} />
                  <Area type="monotone" dataKey="leavers" stroke="#ef4444" strokeWidth={2.5} fill="url(#leaversGrad)" name="Leavers" dot={{ fill: '#ef4444', strokeWidth: 0, r: 4 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>

        {/* Revenue Performance */}
        <FadeIn delay={0.4} className="xl:col-span-2 h-full">
          <div className="bg-[#0e112a] rounded-2xl p-5 border border-white/5 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-slate-200 mb-1 text-sm">Revenue Performance</h3>
              <p className="text-xs text-slate-400 mb-4">Monthly revenue trend — {b.city}</p>
            </div>
            <div className="flex-1 min-h-[200px] mt-2 notranslate" translate="no">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={b.monthlyTrend} barSize={24}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.25} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={formatRevenue} axisLine={false} tickLine={false} width={45} />
                  <Tooltip
                    contentStyle={ttStyle}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Bar dataKey="revenue" fill="url(#revenueGrad)" radius={[4, 4, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ── Profit Contributors + Attrition Risk ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Top Profit Contributors */}
        <FadeIn delay={0.44} className="xl:col-span-3 h-full">
          <div className="bg-[#0e112a]/80 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden h-full flex flex-col">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/15 rounded-xl flex items-center justify-center">
                <Trophy className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Top Profit Contributors</h3>
                <p className="text-xs text-slate-500">{b.city} — highest net revenue generators</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">#</th>
                    <th className="text-left px-3 py-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Employee</th>
                    <th className="text-right px-3 py-3 text-[10px] text-emerald-500/70 font-semibold uppercase tracking-wider">Revenue</th>
                    <th className="text-right px-5 py-3 text-[10px] text-indigo-400/70 font-semibold uppercase tracking-wider">Net Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {b.topPerformers.map((emp, i) => {
                    const profitPct = Math.round((emp.profit / emp.revenue) * 100);
                    return (
                      <tr key={emp.name} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold notranslate ${
                            i === 0 ? 'bg-yellow-500/20 text-yellow-300' :
                            i === 1 ? 'bg-slate-400/15 text-slate-300' :
                                      'bg-orange-500/15 text-orange-300'
                          }`} translate="no">{i + 1}</span>
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-semibold text-slate-200 notranslate" translate="no">{emp.name}</p>
                          <p className="text-[10px] text-slate-500">{emp.role}</p>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="font-semibold text-emerald-400 notranslate" translate="no">${emp.revenue.toLocaleString()}</span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex flex-col items-end gap-1 notranslate" translate="no">
                            <span className="font-bold text-indigo-300">${emp.profit.toLocaleString()}</span>
                            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full" style={{ width: `${profitPct}%` }} />
                            </div>
                            <span className="text-[9px] text-slate-500">{profitPct}% margin</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        {/* AI Attrition Risk */}
        <FadeIn delay={0.46} className="xl:col-span-2 h-full">
          <div className="bg-[#0e112a]/80 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full" style={{ minHeight: 320 }}>
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 bg-orange-500/15 rounded-xl flex items-center justify-center">
                <UserX className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">AI Attrition Risk</h3>
                <p className="text-xs text-slate-500">{b.city} — Low SLA + LMS detection</p>
              </div>
            </div>

            {/* Ticker */}
            <div className="px-4 py-2 border-b border-white/5 flex-shrink-0 overflow-hidden">
              <p className="text-[9px] text-orange-400/70 font-bold uppercase tracking-wider mb-1.5">⚡ Live Risk Feed</p>
              <div className="overflow-hidden">
                <div className="marquee-content gap-2 notranslate" translate="no">
                  {[...b.attritionRisk, ...b.attritionRisk, ...b.attritionRisk, ...b.attritionRisk].map((emp, i) => (
                    <span key={i} className={`text-[9px] px-2 py-1 rounded-full border font-semibold whitespace-nowrap ${riskConfig[emp.risk]}`}>
                      {emp.name} · {emp.dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {b.attritionRisk.map((emp, i) => (
                <motion.div
                  key={emp.name + b.id + i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18, delay: i * 0.05, ease: 'easeOut' }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.025] border border-white/5 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-slate-300 notranslate" translate="no">
                    {emp.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-200 truncate notranslate" translate="no">{emp.name}</p>
                      <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-bold border ${riskConfig[emp.risk]}`}>{emp.risk}</span>
                    </div>
                    <div className="flex gap-3 mt-1 notranslate" translate="no">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] text-slate-500">SLA</span>
                        <div className="w-10 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500/80 rounded-full" style={{ width: `${emp.sla}%` }} />
                        </div>
                        <span className="text-[9px] text-rose-400">{emp.sla}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] text-slate-500">LMS</span>
                        <div className="w-10 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500/80 rounded-full" style={{ width: `${emp.lms}%` }} />
                        </div>
                        <span className="text-[9px] text-orange-400">{emp.lms}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ── Recruiter Leaderboard ── */}
      <FadeIn delay={0.5}>
        <div className="bg-[#0e112a]/80 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/15 rounded-xl flex items-center justify-center">
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Recruiter Performance Leaderboard</h3>
              <p className="text-xs text-slate-500">{b.city} — Hired → Retained → Revenue</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
            {/* Bar chart */}
            <div className="p-5 notranslate" translate="no">
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-3">Hired vs Active Headcount</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={recruiterChartData} barSize={24} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={ttStyle} itemStyle={{ color: '#e2e8f0' }} labelStyle={{ color: '#94a3b8' }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Hired" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Hired" />
                  <Bar dataKey="Active" fill="#10b981" radius={[4, 4, 0, 0]} name="Still Active" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Retention bars */}
            <div className="p-5">
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-4">Retention Rate</p>
              <div className="flex flex-col gap-5">
                {b.recruiterLeaderboard.map((r, i) => (
                  <div key={r.name} className="flex items-center gap-4">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 notranslate ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-300' :
                      i === 1 ? 'bg-slate-400/15 text-slate-300' :
                                'bg-orange-500/15 text-orange-300'
                    }`} translate="no">{i + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-slate-200 notranslate" translate="no">{r.name}</p>
                        <span className="text-[10px] font-bold notranslate" style={{ color: RETENTION_COLORS[i] }} translate="no">{r.retentionPct}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${r.retentionPct}%`, backgroundColor: RETENTION_COLORS[i] }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-500 mt-0.5 block notranslate" translate="no">{r.active}/{r.hired} retained</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

    </div>
  );
}
