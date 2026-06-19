import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Mail, Phone, Building2, Calendar, User, TrendingUp, CheckCircle2, AlertTriangle, Cpu, DollarSign, Award } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/employees/${id}`)
      .then(r => setEmployee(r.data.data.employee))
      .catch(() => toast.error('Employee not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!employee) return <div className="text-center py-20 text-slate-400">Employee not found.</div>;

  const InfoRow = ({ icon: Icon, label, value, avatar }: any) => (
    <div className="flex items-start gap-3">
      {avatar ? (
        <img src={avatar} className="w-8 h-8 rounded-lg flex-shrink-0 mt-0.5 object-cover border border-white/10" alt="" />
      ) : (
        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/5">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      )}
      <div>
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-sm font-semibold text-slate-200">{value || '-'}</div>
      </div>
    </div>
  );

  const profitLoss = (employee.revenue || 0) - (employee.cost || 0);

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/employees')} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-100">Workforce Profile Insight</h1>
        </div>
        <button onClick={() => navigate(`/employees/${id}/edit`)} className="btn-primary flex items-center gap-1.5 font-semibold">
          <Edit className="w-4 h-4 text-[#060814]" /> Edit Profile
        </button>
      </div>

      {/* Header Info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {employee.avatar ? (
            <img src={employee.avatar} className="w-20 h-20 rounded-2xl flex-shrink-0 object-cover border border-primary/20 shadow-sm" alt="" />
          ) : (
            <div className="w-20 h-20 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0 shadow-sm">
              {employee.first_name?.[0]}{employee.last_name?.[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-slate-100">{employee.first_name} {employee.middle_name} {employee.last_name}</h2>
              <span className="status-active">{employee.employment_status || 'Active'}</span>
            </div>
            <p className="text-sm text-slate-300 mt-1">{employee.designation?.title || 'Associate'} · {employee.department?.name || 'Operations'}</p>
            <p className="text-xs text-slate-400 mt-1">{employee.emp_code} · {employee.employment_type || 'Full-time'}</p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-xs font-semibold flex items-center gap-1">
                📍 {employee.work_branch || 'Chennai'}, {employee.work_country || 'India'}
              </span>
              {employee.work_country === 'United States' && (
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider">
                  🇺🇸 Global Headquarters
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      {['Resigned', 'Terminated'].includes(employee.employment_status) && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl p-5 mb-5 text-sm flex gap-4 items-center">
          <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-400 flex-shrink-0 text-xl font-bold">⚠️</div>
          <div className="flex-1">
            <div className="font-semibold text-rose-200 uppercase tracking-wider mb-1">Separation Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2 text-xs">
              <div><span className="text-slate-400">Date of Separation:</span> <span className="font-semibold text-slate-200">{employee.date_of_leaving || '-'}</span></div>
              <div><span className="text-slate-400">Separation Status:</span> <span className="font-semibold text-slate-200">{employee.employment_status}</span></div>
              <div className="sm:col-span-2 mt-1"><span className="text-slate-400">Reason for Exit:</span> <span className="font-semibold text-slate-200">{employee.leaving_reason || '-'}</span></div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Visual Lifecycle Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-6 relative overflow-hidden"
      >
        {/* Background breathing dots overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none ags-dot-grid" />
        
        <h3 className="font-semibold text-slate-200 text-sm mb-6 pb-2 border-b border-white/5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Employee Lifecycle Journey
        </h3>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6 md:gap-4">
          
          {/* Timeline Connector Line for desktop */}
          <div className="hidden md:block absolute top-7 left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-blue-500/40 via-emerald-500/40 to-slate-500/20 z-0" />

          {/* Phase 1: Recruitment */}
          <div className="flex-1 relative z-10 bg-[#0c0e25]/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-400">
                  1
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Attraction & Sourcing</span>
              </div>
              
              <div className="space-y-2 mt-1">
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Recruiter:</span>
                  <span className="font-semibold text-slate-300">{employee.recruiter || 'Bhavya Rao'}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Panel:</span>
                  <span className="font-semibold text-slate-300">{employee.interviewer || 'VP Operations'}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Joined Date:</span>
                  <span className="font-semibold text-emerald-400">{employee.date_of_joining}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-white/5 text-[9px] text-slate-500">
              Talent Acquisition Completed
            </div>
          </div>

          {/* Phase 2: Onboarding & LMS */}
          <div className="flex-1 relative z-10 bg-[#0c0e25]/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400">
                  2
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Integration & LMS</span>
              </div>
              
              <div className="space-y-2 mt-1">
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Trainer:</span>
                  <span className="font-semibold text-slate-300">{employee.trainer || 'Meera Jasmine'}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Perf Score:</span>
                  <span className={`font-semibold badge ${
                    employee.training_performance === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400' :
                    employee.training_performance === 'Poor' ? 'bg-rose-500/10 text-rose-400' :
                    'bg-blue-500/10 text-blue-400'
                  } border border-transparent px-1.5 py-0 text-[10px]`}>
                    {employee.training_performance || 'Medium'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  <span className="block mb-1">Certifications:</span>
                  <div className="flex flex-wrap gap-1">
                    {(employee.courses_completed || []).map((c: string, idx: number) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-300 border border-white/5 max-w-[120px] truncate" title={c}>
                        ✓ {c}
                      </span>
                    ))}
                    {(!employee.courses_completed || employee.courses_completed.length === 0) && (
                      <span className="text-[10px] text-slate-500">None completed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-white/5 text-[9px] text-slate-500">
              Training & Onboarding Passed
            </div>
          </div>

          {/* Phase 3: Core Performance */}
          <div className="flex-1 relative z-10 bg-[#0c0e25]/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-400">
                  3
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400">Growth & Productivity</span>
              </div>
              
              <div className="space-y-2 mt-1">
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Project:</span>
                  <span className="font-semibold text-slate-300 truncate max-w-[100px]" title={employee.project}>{employee.project || 'Bench'}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Net Yield:</span>
                  <span className={`font-semibold ${
                    profitLoss > 0 ? 'text-emerald-400' :
                    profitLoss < 0 ? 'text-rose-400' :
                    'text-slate-400'
                  }`}>
                    {profitLoss > 0 ? '+' : ''}${profitLoss.toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>SLA Gaps:</span>
                  <span className={`font-semibold ${
                    employee.mistakes && employee.mistakes.length > 0 ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    {employee.mistakes ? employee.mistakes.length : 0} logged
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-white/5 text-[9px] text-slate-500">
              Active Delivery Contribution
            </div>
          </div>

          {/* Phase 4: Retention or Offboarding */}
          {['Resigned', 'Terminated'].includes(employee.employment_status) ? (
            <div className="flex-1 relative z-10 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-xs font-bold text-rose-400">
                    4
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400">Offboarding & separation</span>
                </div>
                
                <div className="space-y-2 mt-1">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Exit Date:</span>
                    <span className="font-semibold text-rose-400">{employee.date_of_leaving}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span className="block mb-1">Reason:</span>
                    <span className="font-semibold text-slate-200 text-[10px] bg-rose-500/10 p-1.5 rounded border border-rose-500/10 block leading-tight">
                      {employee.leaving_reason || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-rose-500/10 text-[9px] text-rose-400 font-medium">
                Separated / Inactive
              </div>
            </div>
          ) : (
            <div className="flex-1 relative z-10 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400">
                    4
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Retention & Growth</span>
                </div>
                
                <div className="space-y-2 mt-1">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Retained:</span>
                    <span className="font-semibold text-emerald-400">Yes</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Status:</span>
                    <span className="font-semibold text-slate-200">{employee.employment_status || 'Active'}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span className="block mb-1">Career Goal:</span>
                    <span className="text-[10px] text-emerald-300 font-medium block leading-tight">
                      Promote to Fast-track Leadership path
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-emerald-500/10 text-[9px] text-emerald-400 font-medium animate-pulse">
                Active Career Path
              </div>
            </div>
          )}

        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Core Journey (TL, Trainer, Recruiter, Interviewer) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-4 border-b border-white/5 pb-2">Hiring & Guidance</h3>
              <div className="space-y-4">
                <InfoRow icon={User} label="HR Recruiter" value={employee.recruiter} avatar={employee.recruiter_avatar} />
                <InfoRow icon={User} label="Interviewer (Panel)" value={employee.interviewer} avatar={employee.interviewer_avatar} />
                <InfoRow icon={Building2} label="Direct Team Lead (TL)" value={employee.team_lead} avatar={employee.team_lead_avatar} />
              </div>
            </div>

            <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-4 border-b border-white/5 pb-2">Training & Development</h3>
              <div className="space-y-4">
                <InfoRow icon={User} label="Assigned Trainer" value={employee.trainer} avatar={employee.trainer_avatar} />
                <InfoRow icon={Award} label="Training Performance" value={employee.training_performance || 'Medium'} />
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/5">
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-400">Completed Courses</div>
                    <div className="mt-1.5 space-y-1">
                      {employee.courses_completed && employee.courses_completed.length > 0 ? (
                        employee.courses_completed.map((c: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span className="line-clamp-1">{c}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">No courses completed yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project & Revenue Panel */}
          <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Financial Profitability & Cost Metrics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-[#0c0e25]/60 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-slate-400">Monthly Revenue Contribution</div>
                <div className="text-lg font-bold text-slate-200 mt-1 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  {employee.revenue?.toLocaleString() || '0'}
                </div>
              </div>
              
              <div className="bg-[#0c0e25]/60 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-slate-400">Monthly Operating Cost</div>
                <div className="text-lg font-bold text-slate-200 mt-1 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-rose-400" />
                  {employee.cost?.toLocaleString() || '0'}
                </div>
              </div>

              <div className="bg-[#0c0e25]/60 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-slate-400">Net Profit / Loss Contribution</div>
                <div className={`text-lg font-bold mt-1 flex items-center gap-0.5 ${profitLoss > 0 ? 'text-emerald-400' : profitLoss < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                  {profitLoss > 0 ? '+' : ''}${profitLoss.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 bg-[#0c0e25]/80 rounded-xl border border-white/5 gap-3">
              <div>
                <div className="text-xs text-slate-400">Assigned Project</div>
                <div className="text-sm font-semibold text-slate-200 mt-0.5">{employee.project || 'Bench / Support'}</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  employee.revenue_status === 'High' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  employee.revenue_status === 'Low' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  Revenue: {employee.revenue_status || 'Normal'}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  employee.profit_status === 'High Profit' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  employee.profit_status === 'Loss Center' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  employee.profit_status === 'Normal Margin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {employee.profit_status || 'Cost Center'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-4 border-b border-white/5 pb-2">Contact Info</h3>
              <div className="space-y-4">
                <InfoRow icon={Mail} label="Work Email" value={employee.work_email} />
                <InfoRow icon={Mail} label="Personal Email" value={employee.personal_email} />
                <InfoRow icon={Phone} label="Phone Primary" value={employee.phone_primary} />
              </div>
            </div>

            <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-4 border-b border-white/5 pb-2">Compliance & Banking</h3>
              <div className="space-y-3">
                {[
                  { label: 'PAN Number', value: employee.pan_number ? '****' + employee.pan_number.slice(-4) : '-' },
                  { label: 'Bank Account', value: employee.bank_account_number ? '****' + employee.bank_account_number.slice(-4) : '-' },
                  { label: 'IFSC Code', value: employee.bank_ifsc },
                  { label: 'UAN Number', value: employee.uan_number },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm py-1">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-semibold text-slate-200">{item.value || '-'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </motion.div>

        {/* Sidebar Gaps, Mistakes & AI Recommendations */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-5">
          
          {/* Incident / Gaps / Mistakes Log */}
          <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4 border-b border-white/5 pb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> SLA Gaps & Incident Logs
            </h3>
            <div className="space-y-2.5">
              {employee.mistakes && employee.mistakes.length > 0 ? (
                employee.mistakes.map((m: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-300">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>{m}</div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 text-center py-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-emerald-400">
                  No mistakes or SLA gaps logged.
                </div>
              )}
            </div>
          </div>

          {/* AI Advisor Panel */}
          <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4 border-b border-white/5 pb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-primary" /> AI Advisor Recommendation
            </h3>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Next Steps Action Plan</div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {employee.ai_recommendation || 'No active recommendations available.'}
              </p>
            </div>
          </div>

          {/* Personal Metadata */}
          <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4 border-b border-white/5 pb-2">Bio-data</h3>
            <div className="space-y-3">
              {[
                { label: 'Gender', value: employee.gender },
                { label: 'Date of Birth', value: employee.date_of_birth },
                { label: 'Blood Group', value: employee.blood_group },
                { label: 'Nationality', value: employee.nationality },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-xs py-1">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-semibold text-slate-200">{item.value || '-'}</span>
                </div>
              ))}
            </div>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
