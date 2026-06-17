import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Building2 } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/ui/Modal';
import PageHeader from '../../components/ui/PageHeader';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function DepartmentsPage() {
  const [depts, setDepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchDepts = () => {
    setLoading(true);
    api.get('/departments').then(r => setDepts(r.data.data.departments || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDepts(); }, []);

  const openCreate = () => { setEditing(null); reset({}); setModalOpen(true); };
  const openEdit = (dept: any) => { setEditing(dept); reset(dept); setModalOpen(true); };

  const onSubmit = async (data: any) => {
    try {
      if (editing) {
        await api.put(`/departments/${editing.id}`, data);
        toast.success('Department updated');
      } else {
        await api.post('/departments', data);
        toast.success('Department created');
      }
      setModalOpen(false);
      fetchDepts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Management"
        subtitle="Manage organizational departments"
        actions={
          <button onClick={openCreate} className="btn-primary flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)
          : depts.map((dept, i) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-[#0e112a] rounded-2xl p-5 shadow-card border border-white/5 hover:border-primary/20 hover:shadow-card-hover transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center border border-white/5">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <button
                  onClick={() => openEdit(dept)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-200 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="font-semibold text-slate-200 text-sm">{dept.name}</div>
              {dept.description && <div className="text-xs text-slate-400 mt-1 line-clamp-2">{dept.description}</div>}
              {dept.head_name && <div className="text-xs text-primary mt-2 font-semibold">Head: {dept.head_name}</div>}
            </motion.div>
          ))
        }
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Department' : 'New Department'} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Department Name <span className="text-red-500">*</span></label>
            <input {...register('name', { required: 'Name is required' })} className="input-field" placeholder="e.g., Operations" />
            {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
            <textarea {...register('description')} className="input-field resize-none" rows={2} placeholder="Optional description" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Department Code</label>
            <input {...register('code')} className="input-field" placeholder="e.g., NRS" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
