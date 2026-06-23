import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, TrendingDown, DollarSign, Search, 
  User, ShieldCheck, Award, ChevronLeft, ChevronRight 
} from 'lucide-react';

// ==========================================
// 1. DATA TYPES
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

// Function to fetch real employee data from LocalStorage
const getLocalEmployees = (): any[] => {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  const data = localStorage.getItem('ags_employees');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// ==========================================
// 2. MAIN ROI DASHBOARD COMPONENT
// ==========================================
export default function RecruitmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hiredData, setHiredData] = useState<HiredCandidate[]>([]);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of employees per page

  // Fetch and format data on mount
  useEffect(() => {
    const rawEmployees = getLocalEmployees();
    
    // Map raw global employee data to the Quality of Hire format
    const formattedData: HiredCandidate[] = rawEmployees.map((e: any) => ({
      id: e.id || e.emp_code || Math.random().toString(),
      name: `${e.first_name || ''} ${e.last_name || ''}`.trim() || 'Unknown',
      // Handle both object and string formats for designation
      role: typeof e.designation === 'object' ? e.designation?.title : e.designation || 'Associate',
      recruiter: e.recruiter || 'Not Assigned',
      // Combining trainer or team lead as the Mentor
      mentor: e.trainer || e.team_lead || 'Not Assigned',
      revenue: Number(e.revenue) || 0,
      cost: Number(e.cost) || 0,
      hire_date: e.date_of_joining || 'Unknown'
    }));

    setHiredData(formattedData);
  }, []);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Dynamic Calculations based on fetched DB data
  const metrics = useMemo(() => {
    let totalProfit = 0;
    let totalLoss = 0;
    let profitCount = 0;
    let lossCount = 0;

    hiredData.forEach(emp => {
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
  }, [hiredData]);

  // Search filtering
  const filteredData = hiredData.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.recruiter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.mentor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic Calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    // Added pb-24 here to ensure the page scrolls past the floating widget
    <div className="space-y-6 pb-24">
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
          <div className="text-3xl font-black text-white">{hiredData.length}</div>
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

      {/* Main ROI Table with Redesigned Pagination */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0e112a] border border-white/5 rounded-2xl shadow-xl flex flex-col">
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#0c0e25] rounded-t-2xl">
          <h2 className="font-bold text-slate-200">Employee Financial Tracking Ledger</h2>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-10 bg-[#0c0e25]/95 backdrop-blur-md">
              <tr className="border-b border-white/5 text-xs text-slate-400 uppercase tracking-wider">
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
              {paginatedData.map((emp) => {
                const profit = emp.revenue - emp.cost;
                const isProfit = profit > 0;

                return (
                  <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30 shrink-0">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200 truncate max-w-[200px]" title={emp.name}>{emp.name}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]">{emp.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-500 shrink-0" /> 
                        <span className="truncate max-w-[150px]">{emp.recruiter}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" /> 
                        <span className="truncate max-w-[150px]">{emp.mentor}</span>
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
                    No data found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination Controls */}
        {filteredData.length > 0 && (
          <div className="p-4 border-t border-white/5 bg-[#0c0e25]/80 flex flex-col md:flex-row items-center justify-between gap-4 rounded-b-2xl">
            <div className="text-sm text-slate-400">
              Showing <span className="font-semibold text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-200">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-semibold text-slate-200">{filteredData.length}</span> entries
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium text-slate-300 bg-[#060814] hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-[#060814] disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              
              <div className="text-sm font-semibold text-white px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-lg">
                {currentPage} / {totalPages}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium text-slate-300 bg-[#060814] hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-[#060814] disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}