import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, TrendingDown, DollarSign, Search, 
  User, ShieldCheck, Briefcase, Award 
} from 'lucide-react';

// ==========================================
// 1. MOCK DATA: HIRED CANDIDATES ROI
// ==========================================
interface HiredCandidate {
  id: string;
  name: string;
  role: string;
  recruiter: string;
  mentor: string;
  revenue: number;
  cost: number;
  hire_date: string;
}

const HIRED_DATA: HiredCandidate[] = [
  { id: 'EMP-001', name: 'Arjun Kumar', role: 'Frontend Developer', recruiter: 'Swetha K', mentor: 'Ganapathi V', revenue: 8500, cost: 3200, hire_date: '2025-08-10' },
  { id: 'EMP-002', name: 'Deepika Rajan', role: 'Backend Engineer', recruiter: 'Jayachitra P', mentor: 'Eswar NS', revenue: 2500, cost: 4000, hire_date: '2025-09-15' },
  { id: 'EMP-003', name: 'Karthik S', role: 'IoT Systems Architect', recruiter: 'Dinagaran I', mentor: 'Navin', revenue: 9200, cost: 4500, hire_date: '2025-10-05' },
  { id: 'EMP-004', name: 'Priya V', role: 'UI/UX Designer', recruiter: 'Swetha K', mentor: 'Ganapathi V', revenue: 1500, cost: 2800, hire_date: '2025-11-20' },
  { id: 'EMP-005', name: 'Rahul M', role: 'Data Scientist', recruiter: 'Jayachitra P', mentor: 'Eswar NS', revenue: 7800, cost: 3500, hire_date: '2026-01-12' },
  { id: 'EMP-006', name: 'Sneha P', role: 'Embedded Engineer', recruiter: 'Dinagaran I', mentor: 'Navin', revenue: 5000, cost: 2000, hire_date: '2026-02-18' },
];

// ==========================================
// 2. MAIN ROI DASHBOARD COMPONENT
// ==========================================
export default function RecruitmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic Calculations
  const metrics = useMemo(() => {
    let totalProfit = 0;
    let totalLoss = 0;
    let profitCount = 0;
    let lossCount = 0;

    HIRED_DATA.forEach(emp => {
      const margin = emp.revenue - emp.cost;
      if (margin > 0) {
        totalProfit += margin;
        profitCount++;
      } else {
        totalLoss += Math.abs(margin);
        lossCount++;
      }
    });

    return { totalProfit, totalLoss, profitCount, lossCount, netMargin: totalProfit - totalLoss };
  }, []);

  const filteredData = HIRED_DATA.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.recruiter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.mentor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Award className="text-emerald-400" /> Quality of Hire & ROI
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track financial performance, recruiters, and mentors of hired candidates.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" placeholder="Search by name, HR, or Mentor..." 
            className="w-full bg-[#0c0e25] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-colors shadow-sm"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0e112a] border border-white/5 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-2 text-slate-400 text-sm font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" /> Total Hires
          </div>
          <div className="text-3xl font-black text-white">{HIRED_DATA.length}</div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-2 text-emerald-400 text-sm font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" /> Profitable Hires
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-emerald-400">{metrics.profitCount}</div>
            <div className="text-sm font-semibold text-emerald-500/70">(+${metrics.totalProfit.toLocaleString()})</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-2 text-rose-400 text-sm font-bold uppercase tracking-wider">
            <TrendingDown className="w-4 h-4" /> Loss Centers
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-rose-400">{metrics.lossCount}</div>
            <div className="text-sm font-semibold text-rose-500/70">(-${metrics.totalLoss.toLocaleString()})</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-2 text-indigo-400 text-sm font-bold uppercase tracking-wider">
            <DollarSign className="w-4 h-4" /> Net ROI
          </div>
          <div className="text-3xl font-black text-indigo-400">
            {metrics.netMargin > 0 ? '+' : ''}${metrics.netMargin.toLocaleString()}
          </div>
        </motion.div>
      </div>

      {/* Main ROI Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0e112a] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#0c0e25]">
          <h2 className="font-bold text-slate-200">Employee Financial Tracking Ledger</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0c0e25]/50 border-b border-white/5 text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-semibold">Employee</th>
                <th className="p-4 font-semibold">Recruiter (HR)</th>
                <th className="p-4 font-semibold">Assigned Mentor</th>
                <th className="p-4 font-semibold text-right">Revenue</th>
                <th className="p-4 font-semibold text-right">Cost</th>
                <th className="p-4 font-semibold text-right">Net Margin</th>
                <th className="p-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((emp) => {
                const profit = emp.revenue - emp.cost;
                const isProfit = profit > 0;

                return (
                  <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">{emp.name}</div>
                          <div className="text-xs text-slate-500">{emp.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-500" /> {emp.recruiter}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> {emp.mentor}
                      </div>
                    </td>
                    <td className="p-4 text-right text-sm font-semibold text-slate-300">
                      ${emp.revenue.toLocaleString()}
                    </td>
                    <td className="p-4 text-right text-sm font-semibold text-slate-300">
                      ${emp.cost.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`text-sm font-black ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfit ? '+' : ''}${profit.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                        isProfit 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {isProfit ? 'Profit' : 'Loss'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-sm">
                    No records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}