import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Play } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';

export default function PayrollPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>({});
  const [processing, setProcessing] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const fetchPayroll = async (page = 1) => {
    setLoading(true);
    try {
      const [pr, sr] = await Promise.all([
        api.get('/payroll', { params: { page, limit: 15, month, year } }),
        api.get('/payroll/summary', { params: { month, year } }),
      ]);
      setRecords(pr.data.data.records || []);
      setPagination(pr.data.data.pagination || { page: 1, totalPages: 1 });
      setSummary(sr.data.data.summary || {});
    } catch { toast.error('Failed to load payroll'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPayroll(); }, [month, year]);

  const processPayroll = async () => {
    setProcessing(true);
    try {
      const res = await api.post('/payroll/process', { month, year });
      toast.success(`Payroll processed: ${res.data.data.processed} employees`);
      fetchPayroll();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payroll processing failed');
    } finally { setProcessing(false); }
  };

  const columns = [
    { header: 'Employee', accessor: (r: any) => `${r.employee?.first_name} ${r.employee?.last_name}` },
    { header: 'Emp Code', accessor: (r: any) => r.employee?.emp_code },
    { header: 'Month/Year', accessor: (r: any) => `${r.month}/${r.year}` },
    { header: 'Gross Salary', accessor: (r: any) => `₹${Number(r.gross_salary || 0).toLocaleString('en-IN')}` },
    { header: 'Deductions', accessor: (r: any) => `₹${Number(r.total_deductions || 0).toLocaleString('en-IN')}` },
    { header: 'Net Salary', accessor: (r: any) => <span className="font-semibold text-primary">₹{Number(r.net_salary || 0).toLocaleString('en-IN')}</span> },
    { header: 'Working Days', accessor: 'working_days' as const },
    { header: 'Status', accessor: (r: any) => <span className={`badge ${r.status === 'Processed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span> },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payroll Management"
        subtitle="Process and manage employee salaries"
        actions={
          <div className="flex items-center gap-2">
            <select value={month} onChange={e => setMonth(Number(e.target.value))} className="input-field w-auto">
              {Array.from({length:12},(_,i) => <option key={i+1} value={i+1}>{new Date(0,i).toLocaleString('en',{month:'long'})}</option>)}
            </select>
            <select value={year} onChange={e => setYear(Number(e.target.value))} className="input-field w-auto">
              {[2023,2024,2025,2026].map(y => <option key={y}>{y}</option>)}
            </select>
            <button onClick={processPayroll} disabled={processing} className="btn-primary flex items-center gap-1.5">
              <Play className="w-4 h-4" />
              {processing ? 'Processing...' : 'Process Payroll'}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: summary.total_employees || 0, icon: Users, color: 'bg-blue-500' },
          { label: 'Total Gross', value: `₹${Number(summary.total_gross || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'bg-emerald-500', isStr: true },
          { label: 'Total Deductions', value: `₹${Number(summary.total_deductions || 0).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'bg-red-500', isStr: true },
          { label: 'Net Payroll', value: `₹${Number(summary.total_net || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'bg-primary', isStr: true },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold text-slate-800 truncate">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <DataTable columns={columns} data={records} loading={loading}
        pagination={{ page: pagination.page, totalPages: pagination.totalPages, onPageChange: fetchPayroll }}
        emptyText="No payroll records for this period. Click 'Process Payroll' to generate."
      />
    </div>
  );
}
