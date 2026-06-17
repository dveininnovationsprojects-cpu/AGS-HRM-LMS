import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function LeavePage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const { register, handleSubmit, reset } = useForm();

  const fetchLeaves = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/leaves', { params: { page, limit: 15 } });
      setLeaves(res.data.data.leaves || []);
      setPagination(res.data.data.pagination || { page: 1, totalPages: 1 });
    } catch { toast.error('Failed to load leaves'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/leaves/${id}/status`, { status });
      toast.success(`Leave ${status.toLowerCase()}`);
      fetchLeaves();
    } catch { toast.error('Failed to update status'); }
  };

  const columns = [
    { header: 'Employee', accessor: (r: any) => `${r.employee?.first_name} ${r.employee?.last_name}` },
    { header: 'Leave Type', accessor: 'leave_type' as const },
    { header: 'From', accessor: 'from_date' as const },
    { header: 'To', accessor: 'to_date' as const },
    { header: 'Days', accessor: 'no_of_days' as const },
    { header: 'Reason', accessor: (r: any) => <span className="line-clamp-1 max-w-[200px] block">{r.reason || '-'}</span> },
    { header: 'Status', accessor: (r: any) => (
      <span className={`badge ${r.status === 'Approved' ? 'status-approved' : r.status === 'Rejected' ? 'status-rejected' : 'status-pending'}`}>
        {r.status}
      </span>
    )},
    { header: 'Actions', accessor: (r: any) => r.status === 'Pending' ? (
      <div className="flex gap-1.5">
        <button onClick={() => updateStatus(r.id, 'Approved')} className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200 transition-colors">Approve</button>
        <button onClick={() => updateStatus(r.id, 'Rejected')} className="px-2.5 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors">Reject</button>
      </div>
    ) : null },
  ];

  const onSubmit = async (data: any) => {
    try {
      await api.post('/leaves', data);
      toast.success('Leave application submitted');
      setModalOpen(false);
      reset();
      fetchLeaves();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leave Management"
        subtitle="Manage employee leave requests"
        actions={
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Apply Leave
          </button>
        }
      />

      <DataTable columns={columns} data={leaves} loading={loading}
        pagination={{ page: pagination.page, totalPages: pagination.totalPages, onPageChange: fetchLeaves }}
        emptyText="No leave requests found."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Apply Leave" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Employee ID</label>
            <input {...register('employee_id', { required: true })} className="input-field" placeholder="Employee ID" type="number" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Leave Type</label>
            <select {...register('leave_type', { required: true })} className="input-field">
              <option value="">Select Type</option>
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Earned Leave</option>
              <option>Maternity Leave</option>
              <option>Paternity Leave</option>
              <option>Loss of Pay</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">From Date</label>
              <input type="date" {...register('from_date', { required: true })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">To Date</label>
              <input type="date" {...register('to_date', { required: true })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Reason</label>
            <textarea {...register('reason')} className="input-field resize-none" rows={2} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
