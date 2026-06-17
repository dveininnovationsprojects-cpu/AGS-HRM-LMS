import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Users } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/ui/Modal';
import DataTable from '../../components/ui/DataTable';
import PageHeader from '../../components/ui/PageHeader';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function TrainingPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [skillMatrix, setSkillMatrix] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'batches' | 'skill-matrix'>('batches');
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [br, sm] = await Promise.all([api.get('/training/batches'), api.get('/training/skill-matrix')]);
      setBatches(br.data.data.batches || []);
      setSkillMatrix(sm.data.data.skillMatrix || []);
    } catch { toast.error('Failed to load training data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (data: any) => {
    try {
      await api.post('/training/batches', data);
      toast.success('Training batch created');
      setModalOpen(false);
      reset();
      fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const batchColumns = [
    { header: 'Training Program', accessor: 'title' as const },
    { header: 'Trainer', accessor: 'trainer_name' as const },
    { header: 'Start Date', accessor: 'start_date' as const },
    { header: 'End Date', accessor: 'end_date' as const },
    { header: 'Venue', accessor: 'venue' as const },
    { header: 'Capacity', accessor: 'max_participants' as const },
    { header: 'Status', accessor: (r: any) => <span className={r.status === 'Completed' ? 'status-approved' : r.status === 'Ongoing' ? 'badge bg-primary/10 text-primary border border-primary/20' : 'status-pending'}>{r.status || 'Scheduled'}</span> },
  ];

  const skillColumns = [
    { header: 'Employee', accessor: (r: any) => `${r.first_name} ${r.last_name} (${r.emp_code})` },
    { header: 'Enrolled', accessor: 'courses_enrolled' as const },
    { header: 'Completed', accessor: 'courses_completed' as const },
    { header: 'Avg Progress', accessor: (r: any) => `${Math.round(r.avg_progress || 0)}%` },
    { header: 'Skill Level', accessor: (r: any) => {
      const score = (r.courses_completed / Math.max(r.courses_enrolled, 1)) * 100;
      return <span className={score >= 80 ? 'status-approved' : score >= 50 ? 'badge bg-primary/10 text-primary border border-primary/20' : 'status-pending'}>{score >= 80 ? 'Expert' : score >= 50 ? 'Intermediate' : 'Beginner'}</span>;
    }},
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Training Management"
        subtitle="Manage training batches and skill development"
        actions={
          tab === 'batches' && (
            <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Create Batch
            </button>
          )
        }
      />

      <div className="flex gap-1 bg-[#0c0e25] border border-white/5 p-1 rounded-xl w-fit">
        {[['batches', 'Training Batches'], ['skill-matrix', 'Skill Matrix']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as any)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-primary text-[#060814] shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
            {label}
          </button>
        ))}
      </div>

      <DataTable
        columns={tab === 'batches' ? batchColumns : skillColumns}
        data={tab === 'batches' ? batches : skillMatrix}
        loading={loading}
        emptyText={tab === 'batches' ? 'No training batches scheduled.' : 'No skill data available.'}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Training Batch">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Program Title *</label>
            <input {...register('title', { required: true })} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Start Date</label>
              <input type="date" {...register('start_date')} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">End Date</label>
              <input type="date" {...register('end_date')} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Trainer Name</label>
              <input {...register('trainer_name')} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Max Participants</label>
              <input type="number" {...register('max_participants')} defaultValue={20} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Venue</label>
            <input {...register('venue')} className="input-field" placeholder="Conference Room A / Online" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Batch</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
