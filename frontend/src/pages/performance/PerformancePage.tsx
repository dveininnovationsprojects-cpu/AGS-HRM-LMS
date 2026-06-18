import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, TrendingUp } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const radarData = [
  { subject: 'Quality', score: 85 },
  { subject: 'Productivity', score: 78 },
  { subject: 'Teamwork', score: 90 },
  { subject: 'Communication', score: 72 },
  { subject: 'Innovation', score: 65 },
  { subject: 'Leadership', score: 70 },
];

export default function PerformancePage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const { register, handleSubmit, reset } = useForm();

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const [rr, kr] = await Promise.all([
        api.get('/performance', { params: { page, limit: 15 } }),
        api.get('/performance/kpi'),
      ]);
      setReviews(rr.data.data.reviews || []);
      setPagination(rr.data.data.pagination || { page: 1, totalPages: 1 });
      setKpis(kr.data.data.kpis || {});
    } catch { toast.error('Failed to load performance data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (data: any) => {
    try {
      await api.post('/performance', data);
      toast.success('Performance review created');
      setModalOpen(false);
      reset();
      fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-800 fill-slate-800'}`} />
      ))}
      <span className="ml-1 text-xs text-slate-400">{Number(rating || 0).toFixed(1)}</span>
    </div>
  );

  const columns = [
    { header: 'Employee', accessor: (r: any) => `${r.employee?.first_name} ${r.employee?.last_name}` },
    { header: 'Period', accessor: 'review_period' as const },
    { header: 'Rating', accessor: (r: any) => renderStars(r.overall_rating) },
    { header: 'Goals Achieved', accessor: (r: any) => r.goals_achieved ? <span className="text-emerald-400 font-medium">{r.goals_achieved}%</span> : '-' },
    { header: 'Status', accessor: (r: any) => <span className={r.status === 'Completed' ? 'status-approved' : 'status-pending'}>{r.status}</span> },
    { header: 'Reviewed By', accessor: 'reviewed_by' as const },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Performance Management"
        subtitle="Track KPIs, goals and employee reviews"
        actions={
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> New Review
          </button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Reviews', value: kpis.total_reviews || 0, color: 'bg-blue-500' },
          { label: 'Completed', value: kpis.completed || 0, color: 'bg-emerald-500' },
          { label: 'Avg Rating', value: Number(kpis.avg_rating || 0).toFixed(1) + '★', color: 'bg-amber-500' },
          { label: 'High Performers', value: kpis.high_performers || 0, color: 'bg-purple-500' },
          { label: 'Needs Improvement', value: kpis.low_performers || 0, color: 'bg-red-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card text-center">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-2 mx-auto`}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold text-slate-100">{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Radar chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0e112a] rounded-2xl p-5 shadow-card border border-white/5">
        <h3 className="font-semibold text-slate-200 text-sm mb-4">Average Performance Dimensions</h3>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <PolarRadiusAxis tick={{ fontSize: 10, fill: '#475569' }} domain={[0, 100]} />
            <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      <DataTable columns={columns} data={reviews} loading={loading}
        pagination={{ page: pagination.page, totalPages: pagination.totalPages, onPageChange: fetchData }}
        emptyText="No performance reviews. Create the first review to get started."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Performance Review" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Employee ID *</label>
              <input type="number" {...register('employee_id', { required: true })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Review Period *</label>
              <input {...register('review_period', { required: true })} className="input-field" placeholder="Q1 2026" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Overall Rating (1-5)</label>
              <input type="number" step="0.5" min="1" max="5" {...register('overall_rating')} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Goals Achieved (%)</label>
              <input type="number" min="0" max="100" {...register('goals_achieved')} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Strengths</label>
            <textarea {...register('strengths')} className="input-field resize-none" rows={2} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Areas for Improvement</label>
            <textarea {...register('areas_of_improvement')} className="input-field resize-none" rows={2} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
            <select {...register('status')} className="input-field">
              <option>Draft</option><option>In-Progress</option><option>Completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Review</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
