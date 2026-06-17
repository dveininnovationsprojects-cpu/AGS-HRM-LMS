import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Briefcase, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import Modal from '../../components/ui/Modal';
import DataTable from '../../components/ui/DataTable';
import PageHeader from '../../components/ui/PageHeader';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function RecruitmentPage() {
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [funnel, setFunnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'requisitions' | 'candidates'>('requisitions');
  const [jrModal, setJrModal] = useState(false);
  const [candModal, setCandModal] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const { register: regJr, handleSubmit: hsJr, reset: resetJr } = useForm();
  const { register: regCand, handleSubmit: hsCand, reset: resetCand } = useForm();

  useEffect(() => {
    Promise.all([
      api.get('/recruitment/requisitions'),
      api.get('/recruitment/candidates'),
      api.get('/recruitment/funnel'),
      api.get('/departments'),
    ]).then(([jr, cand, fn, dept]) => {
      setRequisitions(jr.data.data.requisitions || []);
      setCandidates(cand.data.data.candidates || []);
      setFunnel(fn.data.data.funnel || []);
      setDepartments(dept.data.data.departments || []);
    }).catch(() => toast.error('Failed to load data'))
    .finally(() => setLoading(false));
  }, []);

  const onCreateJr = async (data: any) => {
    try {
      await api.post('/recruitment/requisitions', data);
      toast.success('Job requisition created');
      setJrModal(false);
      resetJr();
      const res = await api.get('/recruitment/requisitions');
      setRequisitions(res.data.data.requisitions || []);
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const onCreateCand = async (data: any) => {
    try {
      await api.post('/recruitment/candidates', data);
      toast.success('Candidate added');
      setCandModal(false);
      resetCand();
      const res = await api.get('/recruitment/candidates');
      setCandidates(res.data.data.candidates || []);
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const jrColumns = [
    { header: 'Req #', accessor: 'req_number' as const },
    { header: 'Position', accessor: 'title' as const },
    { header: 'Openings', accessor: 'openings' as const },
    { header: 'Status', accessor: (r: any) => <span className={r.status === 'Open' ? 'status-active' : 'status-inactive'}>{r.status}</span> },
    { header: 'Created', accessor: (r: any) => new Date(r.created_at).toLocaleDateString() },
  ];

  const candColumns = [
    { header: 'Name', accessor: (r: any) => `${r.first_name} ${r.last_name}` },
    { header: 'Email', accessor: 'email' as const },
    { header: 'Position', accessor: (r: any) => r.requisition?.title || '-' },
    { header: 'Stage', accessor: (r: any) => <span className="badge bg-primary/10 text-primary border border-primary/20">{r.current_stage}</span> },
    { header: 'Source', accessor: 'source' as const },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Recruitment Management"
        subtitle="Manage job requisitions and candidate pipeline"
        actions={
          <>
            <button onClick={() => setJrModal(true)} className="btn-secondary flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> Post Job</button>
            <button onClick={() => setCandModal(true)} className="btn-primary flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Candidate</button>
          </>
        }
      />

      {/* Funnel Chart */}
      {funnel.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0e112a] rounded-2xl p-5 shadow-card border border-white/5">
          <h3 className="font-semibold text-slate-200 text-sm mb-4">Candidate Pipeline Funnel</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnel} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="current_stage" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#0e112a', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} name="Candidates" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0c0e25] border border-white/5 p-1 rounded-xl w-fit">
        {['requisitions', 'candidates'].map(t => (
          <button key={t} onClick={() => setTab(t as any)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? 'bg-primary text-[#060814] shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
            {t}
          </button>
        ))}
      </div>

      <DataTable
        columns={tab === 'requisitions' ? jrColumns : candColumns}
        data={tab === 'requisitions' ? requisitions : candidates}
        loading={loading}
        emptyText={tab === 'requisitions' ? 'No job requisitions. Post a job to get started.' : 'No candidates in pipeline.'}
      />

      {/* Job Requisition Modal */}
      <Modal open={jrModal} onClose={() => setJrModal(false)} title="Post Job Requisition" size="md">
        <form onSubmit={hsJr(onCreateJr)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Job Title *</label>
              <input {...regJr('title', { required: true })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Department</label>
              <select {...regJr('dept_id')} className="input-field">
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Openings</label>
              <input type="number" {...regJr('openings')} defaultValue={1} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Experience (years)</label>
              <input type="number" {...regJr('experience_years')} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Job Description</label>
            <textarea {...regJr('job_description')} className="input-field resize-none" rows={3} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setJrModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Requisition</button>
          </div>
        </form>
      </Modal>

      {/* Candidate Modal */}
      <Modal open={candModal} onClose={() => setCandModal(false)} title="Add Candidate" size="sm">
        <form onSubmit={hsCand(onCreateCand)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">First Name *</label>
              <input {...regCand('first_name', { required: true })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Last Name</label>
              <input {...regCand('last_name')} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email *</label>
            <input type="email" {...regCand('email', { required: true })} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Job Requisition</label>
            <select {...regCand('requisition_id')} className="input-field">
              <option value="">Select Position</option>
              {requisitions.filter(r => r.status === 'Open').map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Source</label>
            <select {...regCand('source')} className="input-field">
              <option>LinkedIn</option><option>Naukri</option><option>Referral</option>
              <option>Company Website</option><option>Campus</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Stage</label>
            <select {...regCand('current_stage')} className="input-field">
              <option>Applied</option><option>Screening</option><option>Interview-1</option>
              <option>Interview-2</option><option>Offer</option><option>Hired</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setCandModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Candidate</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
