import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Clock, Users } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/ui/Modal';
import PageHeader from '../../components/ui/PageHeader';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState<any>({});
  const { register, handleSubmit, reset } = useForm();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const [cr, ar] = await Promise.all([api.get('/lms/courses'), api.get('/lms/analytics')]);
      setCourses(cr.data.data.courses || []);
      setAnalytics(ar.data.data.overall || {});
    } catch { toast.error('Failed to load courses'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const onSubmit = async (data: any) => {
    try {
      await api.post('/lms/courses', data);
      toast.success('Course created');
      setModalOpen(false);
      reset();
      fetchCourses();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const categoryColors: Record<string, string> = {
    Technical: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    Compliance: 'bg-red-500/10 text-red-400 border border-red-500/20',
    'Soft Skills': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    Operations: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    Leadership: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    Safety: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Learning Management System"
        subtitle="Manage courses and learning paths"
        actions={
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Create Course
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Courses', value: analytics.total_courses || courses.length, color: 'bg-blue-500' },
          { label: 'Total Enrollments', value: analytics.total_enrollments || 0, color: 'bg-emerald-500' },
          { label: 'Completions', value: analytics.completions || 0, color: 'bg-purple-500' },
          { label: 'Avg Progress', value: `${Math.round(analytics.avg_progress || 0)}%`, color: 'bg-amber-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-100">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)
          : courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-[#0e112a] rounded-2xl p-5 shadow-card border border-white/5 hover:border-primary/20 hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 gradient-primary rounded-xl flex items-center justify-center border border-white/5">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <span className={`badge ${categoryColors[course.category] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                  {course.category}
                </span>
              </div>
              <h3 className="font-semibold text-slate-200 text-sm mb-1 line-clamp-2">{course.title}</h3>
              {course.description && <p className="text-xs text-slate-400 line-clamp-2 mb-3">{course.description}</p>}
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration_hours}h</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Level: {course.level || 'Beginner'}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className={`badge ${course.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                  {course.status || 'Draft'}
                </span>
                <button className="text-xs text-primary hover:underline font-semibold">View Details</button>
              </div>
            </motion.div>
          ))
        }
        {!loading && courses.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No courses yet. Create your first course to get started.</p>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Course" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Course Title *</label>
              <input {...register('title', { required: true })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
              <select {...register('category')} className="input-field">
                <option>Technical</option><option>Compliance</option><option>Soft Skills</option>
                <option>Operations</option><option>Leadership</option><option>Safety</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Level</label>
              <select {...register('level')} className="input-field">
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Duration (hours)</label>
              <input type="number" {...register('duration_hours')} className="input-field" defaultValue={1} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select {...register('status')} className="input-field">
                <option>Draft</option><option>Published</option><option>Archived</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
              <textarea {...register('description')} className="input-field resize-none" rows={3} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Thumbnail URL</label>
              <input {...register('thumbnail_url')} className="input-field" placeholder="https://..." />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Course</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
