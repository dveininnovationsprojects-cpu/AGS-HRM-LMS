import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, Clock, DollarSign, TrendingUp,
  Briefcase, BookOpen, AlertCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../services/api';
import CountUp from '../../components/ui/CountUp';
import PageHeader from '../../components/ui/PageHeader';

const COLORS = ['#10b981', '#34d399', '#059669', '#06b6d4', '#6ee7b7'];

const monthlyData = [
  { month: 'Aug', joiners: 4, leavers: 1 },
  { month: 'Sep', joiners: 6, leavers: 2 },
  { month: 'Oct', joiners: 8, leavers: 3 },
  { month: 'Nov', joiners: 5, leavers: 1 },
  { month: 'Dec', joiners: 7, leavers: 2 },
  { month: 'Jan', joiners: 9, leavers: 4 },
];

const attendanceData = [
  { day: 'Mon', present: 85, absent: 15 },
  { day: 'Tue', present: 88, absent: 12 },
  { day: 'Wed', present: 82, absent: 18 },
  { day: 'Thu', present: 90, absent: 10 },
  { day: 'Fri', present: 79, absent: 21 },
];

const deptData = [
  { name: 'Operations', value: 35 },
  { name: 'Admin', value: 20 },
  { name: 'IT', value: 15 },
  { name: 'Finance', value: 12 },
  { name: 'Others', value: 18 },
];

interface KPI {
  totalEmployees: number;
  activeEmployees: number;
  newJoinees: number;
  presentToday: number;
  absentToday: number;
  openPositions: number;
  pendingLeaves: number;
  activeCourses: number;
  revenue?: number;
  cost?: number;
  profit?: number;
  attritionRate?: number;
  hiringEfficiency?: number;
  trainingROI?: number;
}

const statCards = (kpis: KPI) => [
  { title: 'Total Employees', value: kpis.totalEmployees, icon: Users, color: 'bg-emerald-500', change: '+5.2%', up: true, prefix: '', suffix: '' },
  { title: 'Active Employees', value: kpis.activeEmployees, icon: UserCheck, color: 'bg-teal-500', change: '+2.1%', up: true, prefix: '', suffix: '' },
  { title: 'Total Revenue', value: kpis.revenue || 0, icon: DollarSign, color: 'bg-indigo-500', change: '+12.4%', up: true, prefix: '$', suffix: '' },
  { title: 'Total Cost', value: kpis.cost || 0, icon: DollarSign, color: 'bg-rose-500', change: '+3.1%', up: false, prefix: '$', suffix: '' },
  { title: 'Net Profit', value: kpis.profit || 0, icon: TrendingUp, color: 'bg-emerald-600', change: '+18.5%', up: true, prefix: '$', suffix: '' },
  { title: 'Attrition Rate', value: kpis.attritionRate || 0, icon: AlertCircle, color: 'bg-orange-500', change: '-1.2%', up: true, prefix: '', suffix: '%' },
  { title: 'Hiring Efficiency', value: kpis.hiringEfficiency || 0, icon: Briefcase, color: 'bg-purple-500', change: '+4.2%', up: true, prefix: '', suffix: '%' },
  { title: 'Training ROI', value: kpis.trainingROI || 0, icon: BookOpen, color: 'bg-sky-500', change: '+12%', up: true, prefix: '', suffix: '%' },
];

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPI>({
    totalEmployees: 0, activeEmployees: 0, newJoinees: 0,
    presentToday: 0, absentToday: 0, openPositions: 0,
    pendingLeaves: 0, activeCourses: 0,
    revenue: 0, cost: 0, profit: 0,
    attritionRate: 0, hiringEfficiency: 0, trainingROI: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setKpis(res.data.data.kpis || kpis))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = statCards(kpis);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle="Real-time workforce intelligence overview"
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="stat-card group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${card.up ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-100 mb-0.5">
                {loading ? (
                  <div className="skeleton w-16 h-7" />
                ) : (
                  <CountUp target={card.value} prefix={card.prefix} suffix={card.suffix} />
                )}
              </div>
              <div className="text-xs text-slate-400">{card.title}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Headcount Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-[#0e112a] rounded-2xl p-5 shadow-card border border-white/5"
        >
          <h3 className="font-semibold text-slate-200 mb-1 text-sm">Headcount Trend</h3>
          <p className="text-xs text-slate-400 mb-4">Monthly joiners vs leavers</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
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
              <Tooltip contentStyle={{ backgroundColor: '#0e112a', borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: 12 }} />
              <Area type="monotone" dataKey="joiners" stroke="#10b981" strokeWidth={2.5} fill="url(#joinersGrad)" name="Joiners" dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }} />
              <Area type="monotone" dataKey="leavers" stroke="#ef4444" strokeWidth={2.5} fill="url(#leaversGrad)" name="Leavers" dot={{ fill: '#ef4444', strokeWidth: 0, r: 4 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#0e112a] rounded-2xl p-5 shadow-card border border-white/5"
        >
          <h3 className="font-semibold text-slate-200 mb-1 text-sm">Department Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">Active employees by dept</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {deptData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0e112a', borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {deptData.slice(0, 4).map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-slate-400">{d.name}</span>
                </div>
                <span className="font-medium text-slate-200">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance Week */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#0e112a] rounded-2xl p-5 shadow-card border border-white/5"
        >
          <h3 className="font-semibold text-slate-200 mb-1 text-sm">Weekly Attendance</h3>
          <p className="text-xs text-slate-400 mb-4">Present vs Absent this week</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData} barSize={20} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0e112a', borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: 12 }} />
              <Bar dataKey="present" fill="#10b981" radius={[6, 6, 0, 0]} name="Present" />
              <Bar dataKey="absent" fill="#ef4444" radius={[6, 6, 0, 0]} name="Absent" />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#0e112a] rounded-2xl p-5 shadow-card border border-white/5"
        >
          <h3 className="font-semibold text-slate-200 mb-4 text-sm">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Employee', icon: '👤', path: '/employees/new', color: 'bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10' },
              { label: 'Post Job', icon: '💼', path: '/recruitment', color: 'bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 border border-purple-500/10' },
              { label: 'Mark Attendance', icon: '✅', path: '/attendance', color: 'bg-teal-500/5 hover:bg-teal-500/10 text-teal-400 border border-teal-500/10' },
              { label: 'Process Payroll', icon: '💰', path: '/payroll', color: 'bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 border border-amber-500/10' },
              { label: 'Create Course', icon: '📚', path: '/lms/courses', color: 'bg-sky-500/5 hover:bg-sky-500/10 text-sky-400 border border-sky-500/10' },
              { label: 'AI Insights', icon: '🤖', path: '/ai-advisor', color: 'bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 border border-rose-500/10' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.path}
                className={`flex items-center gap-2.5 px-3 py-3 rounded-xl transition-colors text-sm font-semibold border ${action.color}`}
              >
                <span className="text-base">{action.icon}</span>
                {action.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
