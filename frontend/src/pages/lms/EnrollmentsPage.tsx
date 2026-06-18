import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const { register, handleSubmit, reset } = useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [er, cr] = await Promise.all([api.get('/lms/enrollments'), api.get('/lms/courses')]);
      setEnrollments(er.data.data.enrollments || []);
      setCourses(cr.data.data.courses || []);
    } catch { toast.error('Failed to load enrollments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (data: any) => {
    try {
      await api.post('/lms/enroll', data);
      toast.success('Enrolled successfully');
      setModalOpen(false);
      reset();
      fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const columns = [
    { header: 'Employee', accessor: (r: any) => `${r.employee?.first_name} ${r.employee?.last_name} (${r.employee?.emp_code})` },
    { header: 'Course', accessor: (r: any) => r.course?.title },
    { header: 'Category', accessor: (r: any) => r.course?.category },
    {
      header: 'Progress',
      accessor: (r: any) => (
        <div className="flex items-center gap-2 w-24">
          <div className="flex-1 bg-slate-100 rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${r.progress_percentage || 0}%` }} />
          </div>
          <span className="text-xs text-slate-500 w-9 text-right">{r.progress_percentage || 0}%</span>
        </div>
      ),
    },
    { header: 'Status', accessor: (r: any) => <span className={`badge ${r.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : r.status === 'In-Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{r.status}</span> },
    { header: 'Enrolled', accessor: (r: any) => new Date(r.created_at).toLocaleDateString() },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Course Enrollments"
        subtitle="Track employee learning progress"
        actions={
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Enroll Employee
          </button>
        }
      />

      <DataTable columns={columns} data={enrollments} loading={loading} emptyText="No enrollments yet." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Enroll Employee" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Employee ID *</label>
            <input type="number" {...register('employee_id', { required: true })} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Course *</label>
            <select {...register('course_id', { required: true })} className="input-field">
              <option value="">Select Course</option>
              {courses.filter(c => c.status === 'Published').map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Enroll</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
