import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0 });

  const fetchRecords = async (page = 1) => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await api.get('/attendance', { params: { page, limit: 15, date_from: today, date_to: today } });
      setRecords(res.data.data.records || []);
      setStats(res.data.data.stats || { present: 0, absent: 0, late: 0 });
      setPagination(res.data.data.pagination || { page: 1, totalPages: 1 });
    } catch { toast.error('Failed to load attendance'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, []);

  const weeklyData = [
    { day: 'Mon', present: 85, absent: 15 },
    { day: 'Tue', present: 88, absent: 12 },
    { day: 'Wed', present: 82, absent: 18 },
    { day: 'Thu', present: 90, absent: 10 },
    { day: 'Fri', present: 79, absent: 21 },
  ];

  const columns = [
    { header: 'Employee', accessor: (r: any) => (
      <div>
        <div className="font-medium text-slate-200">{r.employee?.first_name} {r.employee?.last_name}</div>
        <div className="text-xs text-slate-400">{r.employee?.emp_code}</div>
      </div>
    )},
    { header: 'Date', accessor: 'attendance_date' as const },
    { header: 'Check In', accessor: (r: any) => r.check_in_time ? new Date(r.check_in_time).toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'}) : '-' },
    { header: 'Check Out', accessor: (r: any) => r.check_out_time ? new Date(r.check_out_time).toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'}) : '-' },
    { header: 'Hours', accessor: (r: any) => r.work_hours ? `${r.work_hours}h` : '-' },
    { header: 'Status', accessor: (r: any) => (
      <span className={`badge ${r.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : r.status === 'Late' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
        {r.status}
      </span>
    )},
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Attendance Management" subtitle="Track daily attendance and work hours" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Present Today", value: stats.present, icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" },
          { label: "Absent Today", value: stats.absent, icon: XCircle, color: "text-red-400 bg-red-500/10 border border-red-500/20" },
          { label: "Late Arrivals", value: stats.late, icon: Clock, color: "text-amber-400 bg-amber-500/10 border border-amber-500/20" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-100">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0e112a] rounded-2xl p-5 shadow-card border border-white/5">
        <h3 className="font-semibold text-slate-200 text-sm mb-4">Weekly Attendance Overview</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#0e112a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, fontSize: 12 }} />
            <Bar dataKey="present" fill="#10b981" radius={[6, 6, 0, 0]} name="Present" />
            <Bar dataKey="absent" fill="#ef4444" radius={[6, 6, 0, 0]} name="Absent" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <DataTable
        columns={columns}
        data={records}
        loading={loading}
        pagination={{ page: pagination.page, totalPages: pagination.totalPages, onPageChange: fetchRecords }}
        emptyText="No attendance records for today yet."
      />
    </div>
  );
}
