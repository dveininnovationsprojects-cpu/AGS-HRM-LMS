import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Download } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';

interface Employee {
  id: number;
  emp_code: string;
  first_name: string;
  last_name: string;
  work_email: string;
  employment_status: string;
  employment_type: string;
  date_of_joining: string;
  department?: { name: string };
  designation?: { title: string };
  avatar?: string;
  training_performance?: string;
  revenue_status?: string;
  profit_status?: string;
  leaving_reason?: string;
  date_of_leaving?: string;
  revenue?: number;
  cost?: number;
}

const statusStyle: Record<string, string> = {
  Active: 'status-active',
  Inactive: 'status-inactive',
  Resigned: 'status-resigned',
  Terminated: 'status-rejected',
  'On-Leave': 'status-pending',
};

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [trainingPerformance, setTrainingPerformance] = useState('');
  const [revenueStatus, setRevenueStatus] = useState('');
  const [profitStatus, setProfitStatus] = useState('');

  const fetchEmployees = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/employees', { 
        params: { 
          page, 
          limit: 15, 
          search, 
          status,
          training_performance: trainingPerformance,
          revenue_status: revenueStatus,
          profit_status: profitStatus
        } 
      });
      setEmployees(res.data.data.employees || []);
      setPagination(res.data.data.pagination || { page: 1, totalPages: 1 });
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, [search, status, trainingPerformance, revenueStatus, profitStatus]);

  const columns = [
    { header: 'Emp Code', accessor: 'emp_code' as keyof Employee },
    {
      header: 'Name',
      accessor: (row: Employee) => (
        <div className="flex items-center gap-3">
          {row.avatar ? (
            <img src={row.avatar} className="w-8 h-8 rounded-lg object-cover border border-white/10" alt="" />
          ) : (
            <div className="w-8 h-8 bg-primary/10 border border-primary/20 text-primary rounded-lg flex items-center justify-center text-xs font-bold font-mono">
              {row.first_name?.[0]}{row.last_name?.[0]}
            </div>
          )}
          <div>
            <div className="font-medium text-slate-200">{row.first_name} {row.last_name}</div>
            <div className="text-xs text-slate-400">{row.work_email}</div>
          </div>
        </div>
      ),
    },
    { header: 'Department', accessor: (row: Employee) => row.department?.name || '-' },
    { header: 'Designation', accessor: (row: Employee) => row.designation?.title || '-' },
    {
      header: 'Status',
      accessor: (row: Employee) => (
        <span className={statusStyle[row.employment_status] || 'badge bg-slate-500/10 text-slate-400 border border-slate-500/20'}>
          {row.employment_status}
        </span>
      ),
    },
    {
      header: 'Training Perf',
      accessor: (row: Employee) => {
        const perf = row.training_performance || 'Medium';
        const style = perf === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      perf === 'Poor' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/20';
        return <span className={`badge ${style} border text-xs`}>{perf}</span>;
      }
    },
    {
      header: 'Revenue',
      accessor: (row: Employee) => {
        const revVal = row.revenue || 0;
        const rev = row.revenue_status || 'Normal';
        const revStyle = rev === 'High' ? 'text-emerald-400 font-semibold' :
                         rev === 'Low' ? 'text-rose-400 font-semibold' : 'text-blue-400';
        return (
          <div className="text-xs">
            <div className="font-semibold text-slate-200">${revVal.toLocaleString()}</div>
            <div className={`${revStyle} text-[10px]`}>{rev}</div>
          </div>
        );
      }
    },
    {
      header: 'Profit Status',
      accessor: (row: Employee) => {
        const revVal = row.revenue || 0;
        const costVal = row.cost || 0;
        const profitVal = revVal - costVal;
        const prof = row.profit_status || 'Cost Center';
        const profStyle = prof.includes('Profit') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          prof.includes('Loss') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          prof.includes('Margin') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-slate-500/10 text-slate-400 border border-slate-500/20';
        return (
          <div className="space-y-1 text-xs">
            <div>
              <span className={`badge ${profStyle} text-[10px] px-1.5 py-0`}>{prof}</span>
            </div>
            <div className={`font-semibold ${profitVal > 0 ? 'text-emerald-400' : profitVal < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {profitVal > 0 ? '+' : ''}${profitVal.toLocaleString()}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Exit Info',
      accessor: (row: Employee) => {
        if (['Resigned', 'Terminated'].includes(row.employment_status)) {
          return (
            <div className="text-xs max-w-[180px]">
              <div className="font-semibold text-rose-400">{row.date_of_leaving}</div>
              <div className="text-slate-400 truncate" title={row.leaving_reason}>{row.leaving_reason || '-'}</div>
            </div>
          );
        }
        return <span className="text-slate-500">-</span>;
      }
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Employee Management"
        subtitle="Manage your workforce master data"
        actions={
          <>
            <button onClick={() => window.open('/api/v1/reports/employees/excel', '_blank')} className="btn-secondary flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => navigate('/employees/new')} className="btn-primary flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Employee
            </button>
          </>
        }
      />

      {/* Filters */}
      <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input-field w-auto min-w-[140px]"
        >
          <option value="">All Status</option>
          <option>Active</option>
          <option>Resigned</option>
          <option>Terminated</option>
          <option>On-Leave</option>
        </select>
        <select
          value={trainingPerformance}
          onChange={(e) => setTrainingPerformance(e.target.value)}
          className="input-field w-auto min-w-[140px]"
        >
          <option value="">All Training Perf</option>
          <option>Excellent</option>
          <option>Medium</option>
          <option>Poor</option>
        </select>
        <select
          value={revenueStatus}
          onChange={(e) => setRevenueStatus(e.target.value)}
          className="input-field w-auto min-w-[140px]"
        >
          <option value="">All Revenue</option>
          <option>High</option>
          <option>Normal</option>
          <option>Low</option>
        </select>
        <select
          value={profitStatus}
          onChange={(e) => setProfitStatus(e.target.value)}
          className="input-field w-auto min-w-[140px]"
        >
          <option value="">All Profit Status</option>
          <option>High Profit</option>
          <option>Normal Margin</option>
          <option>Loss Center</option>
          <option>Cost Center (Support)</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        loading={loading}
        onRowClick={(row) => navigate(`/employees/${row.id}`)}
        pagination={{
          page: pagination.page,
          totalPages: pagination.totalPages,
          onPageChange: fetchEmployees,
        }}
        emptyText="No employees found. Add your first employee to get started."
      />
    </div>
  );
}
