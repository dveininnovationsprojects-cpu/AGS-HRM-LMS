import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Search, User, Briefcase, Award } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';

export default function ProfitLossPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'profitable' | 'loss'>('profitable');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get('/analytics/executive')
      .then(res => {
        setEmployees(res.data.data.employeeProfitability || []);
      })
      .catch(() => toast.error('Failed to load employee profitability data'))
      .finally(() => setLoading(false));
  }, []);

  // Reset page when switching tabs or typing search
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  // Split into categories
  const profitableEmployees = employees.filter((e: any) => e.profit > 0);
  const lossEmployees = employees.filter((e: any) => e.profit <= 0);

  // Filter based on active tab and search query
  const targetList = activeTab === 'profitable' ? profitableEmployees : lossEmployees;
  
  const filteredList = targetList.filter((e: any) => {
    const s = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(s) ||
      e.dept.toLowerCase().includes(s) ||
      e.project.toLowerCase().includes(s) ||
      e.tl.toLowerCase().includes(s) ||
      (e.profit_status && e.profit_status.toLowerCase().includes(s))
    );
  });

  const itemsPerPage = 15;
  const paginatedEmployees = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Totals calculations
  const totalProfit = profitableEmployees.reduce((sum: number, e: any) => sum + e.profit, 0);
  const totalLoss = Math.abs(lossEmployees.reduce((sum: number, e: any) => sum + e.profit, 0));
  const netMargin = totalProfit - totalLoss;

  const columns = [
    { 
      header: 'Employee', 
      accessor: (r: any) => (
        <div className="flex items-center gap-2.5">
          {r.avatar ? (
            <img src={r.avatar} className="w-7 h-7 rounded-lg object-cover border border-white/10" alt="" />
          ) : (
            <div className="w-7 h-7 bg-primary/10 border border-primary/20 text-primary rounded-lg flex items-center justify-center text-[10px] font-bold">
              {r.name?.[0]}
            </div>
          )}
          <div>
            <span className="font-semibold text-slate-200">{r.name}</span>
            {['Resigned', 'Terminated'].includes(r.status) && (
              <div className="text-[10px] text-rose-400 font-medium leading-none mt-0.5">
                {r.status}: {r.leaving_reason || 'Exit'}
              </div>
            )}
          </div>
        </div>
      )
    },
    { header: 'Department', accessor: 'dept' },
    { header: 'Active Project', accessor: 'project' },
    { header: 'Team Lead', accessor: 'tl' },
    {
      header: 'Training Perf',
      accessor: (r: any) => {
        const perf = r.training_performance || 'Medium';
        const style = perf === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      perf === 'Poor' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        return <span className={`badge ${style} text-[10px]`}>{perf}</span>;
      }
    },
    { header: 'Monthly Revenue', accessor: (r: any) => `$${r.revenue.toLocaleString()}` },
    { header: 'Monthly Cost', accessor: (r: any) => `$${r.cost.toLocaleString()}` },
    { 
      header: 'Net Margin', 
      accessor: (r: any) => {
        const diff = r.profit;
        return (
          <span className={`font-semibold ${diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            {diff > 0 ? '+' : ''}${diff.toLocaleString()}
          </span>
        );
      }
    },
    { 
      header: 'Profit Status', 
      accessor: (r: any) => {
        const prof = r.profit_status || 'Cost Center';
        const style = prof.includes('Profit') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      prof.includes('Loss') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      prof.includes('Margin') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-slate-500/10 text-slate-400 border border-slate-500/20';
        return <span className={`badge ${style} text-[10px]`}>{prof}</span>;
      }
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Profit & Loss Analyzer" 
        subtitle="Granular evaluation of employee profitability and cost leakages" 
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <div className="flex justify-between items-start mb-3">
            <div className="w-8 h-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">Assets</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{profitableEmployees.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">Profitable Employees</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="stat-card">
          <div className="flex justify-between items-start mb-3">
            <div className="w-8 h-8 bg-rose-500/10 text-rose-400 rounded-lg flex items-center justify-center border border-rose-500/20">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-rose-400 font-semibold">Leakers / Support</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{lossEmployees.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">Loss & Cost Centers</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <div className="flex justify-between items-start mb-3">
            <div className="w-8 h-8 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center border border-indigo-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-indigo-400 font-semibold">Net Contribution</span>
          </div>
          <div className={`text-2xl font-bold ${netMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netMargin >= 0 ? '+' : '-'}${Math.abs(netMargin).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Monthly Net Margin</div>
        </motion.div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#0e112a] border border-white/5 p-4 rounded-2xl shadow-card">
        {/* Toggleable Tabs */}
        <div className="flex gap-1 bg-[#0c0e25] border border-white/5 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('profitable')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'profitable' ? 'bg-primary text-[#060814] shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            📈 Profitable Assets ({profitableEmployees.length})
          </button>
          <button 
            onClick={() => setActiveTab('loss')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'loss' ? 'bg-rose-500/20 text-rose-300 shadow-sm border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            📉 Loss & Cost Centers ({lossEmployees.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, project, tl..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* Table Ledger */}
      <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
        <DataTable
          columns={columns}
          data={paginatedEmployees}
          onRowClick={(row) => navigate(`/employees/${row.id}`)}
          pagination={{
            page: currentPage,
            totalPages: Math.ceil(filteredList.length / itemsPerPage),
            onPageChange: (p) => setCurrentPage(p),
          }}
          emptyText={activeTab === 'profitable' ? 'No profitable employee records found.' : 'No loss or cost support employees found.'}
        />
      </div>
    </div>
  );
}
