import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, Users, DollarSign, Clock, TrendingUp } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';
import { useState } from 'react';

const reports = [
  {
    id: 'employees',
    title: 'Employee Master Report',
    description: 'Complete list of all employees with department, designation, and status',
    icon: Users,
    color: 'bg-blue-500',
    endpoint: '/api/v1/reports/employees/excel',
    filename: 'employees.xlsx',
  },
  {
    id: 'payroll',
    title: 'Payroll Report',
    description: 'Monthly payroll summary with gross, deductions, and net salary',
    icon: DollarSign,
    color: 'bg-emerald-500',
    endpoint: '/api/v1/reports/payroll/excel',
    filename: 'payroll.xlsx',
  },
  {
    id: 'attendance',
    title: 'Attendance Report',
    description: 'Daily and monthly attendance records with work hours analysis',
    icon: Clock,
    color: 'bg-purple-500',
    endpoint: null,
    filename: null,
  },
  {
    id: 'performance',
    title: 'Performance Report',
    description: 'Employee performance ratings, KPI scores, and goal achievement',
    icon: TrendingUp,
    color: 'bg-amber-500',
    endpoint: null,
    filename: null,
  },
];

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [payrollMonth, setPayrollMonth] = useState(new Date().getMonth() + 1);
  const [payrollYear, setPayrollYear] = useState(new Date().getFullYear());

  const downloadReport = async (report: typeof reports[0]) => {
    if (!report.endpoint) {
      toast('This report will be available in the next release', { icon: '🚧' });
      return;
    }
    setDownloading(report.id);
    try {
      const url = report.id === 'payroll'
        ? `${report.endpoint}?month=${payrollMonth}&year=${payrollYear}`
        : report.endpoint;

      const token = localStorage.getItem('accessToken');
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = report.filename!;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success(`${report.title} downloaded`);
    } catch {
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports Center"
        subtitle="Generate and export workforce reports"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, i) => {
          const Icon = report.icon;
          const isDownloading = downloading === report.id;
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#0e112a] rounded-2xl p-6 shadow-card border border-white/5 hover:border-primary/20 hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${report.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-200 text-sm">{report.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{report.description}</p>

                  {report.id === 'payroll' && (
                    <div className="flex gap-2 mt-3">
                      <select value={payrollMonth} onChange={e => setPayrollMonth(Number(e.target.value))} className="input-field py-1 text-xs w-auto">
                        {Array.from({length:12},(_,i) => <option key={i+1} value={i+1}>{new Date(0,i).toLocaleString('en',{month:'short'})}</option>)}
                      </select>
                      <select value={payrollYear} onChange={e => setPayrollYear(Number(e.target.value))} className="input-field py-1 text-xs w-auto">
                        {[2023,2024,2025,2026].map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={() => downloadReport(report)}
                    disabled={isDownloading}
                    className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-400 disabled:opacity-50 transition-colors"
                  >
                    {isDownloading ? (
                      <>
                        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        Download Excel
                        {!report.endpoint && <span className="text-slate-500 font-normal">(Coming soon)</span>}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info card */}
      <div className="bg-[#0e112a] border border-white/5 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <FileSpreadsheet className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-slate-200 mb-1">Scheduled Reports</div>
            <p className="text-xs text-slate-400">
              Automated scheduled reports can be configured to be sent via email on a daily, weekly, or monthly basis.
              Contact your system administrator to set up scheduled report delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
