import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, Building2, Calendar, User, TrendingUp, CheckCircle2, AlertTriangle, Cpu, DollarSign, Award, Sparkles, Activity } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { BRANCH_DATA } from '../../data/branchData';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const generateSummaryText = (emp: any) => {
    const profitVal = (emp.revenue || 0) - (emp.cost || 0);
    const lakhs = (profitVal / 100000).toFixed(2);
    const isWorth = profitVal > 2000;
    
    return `AI Summary Report

**1. Is the employee worth it?**
${isWorth ? `✅ **Yes, absolutely.** ${emp.first_name} is currently a high-performing active contributor. With a positive net contribution of **$${profitVal.toLocaleString()} (~${lakhs} Lakhs)**, they provide strong economic value to the company.` : `⚠️ **Marginal / Needs Review.** The net yield is currently **$${profitVal.toLocaleString()}**. They require productivity enhancement or alignment to high-margin projects to offset operational overhead.`}

**2. Lifecycle Achievements & Best Actions:**
* **Recruitment:** Selected by HR Recruiter **${emp.recruiter || 'Priya N'}** and approved by panel lead **${emp.interviewer || 'Anand Kumar'}**.
* **Training Score:** **${emp.training_score || 92}%** (${emp.training_performance || 'Excellent'} Performance). They have successfully completed **${emp.courses_completed?.length || 1} course(s)** including *"${emp.courses_completed?.[0] || 'Quality Guidelines'}"*.
* **Best Action:** ${emp.training_performance === 'Excellent' ? 'Promote to leadership track, assign cross-functional mentor, and enroll in advanced client-relations training.' : 'Assign a senior buddy, schedule specialized workflow retraining, and conduct weekly feedback sessions.'}

**3. Financial Contribution:**
* **Generated Revenue:** $${(emp.revenue || 0).toLocaleString()}
* **Operational Cost:** $${(emp.cost || 0).toLocaleString()}
* **Net Contribution:** **$${profitVal.toLocaleString()} (~${lakhs} Lakhs)**
* **Profit Status:** \`${emp.profit_status || 'Normal Margin'}\``;
  };



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
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Employee DNA Card
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const summaryQuery = `Analyze the profile of employee ${employee.first_name} ${employee.last_name}`;
              const summaryResponse = generateSummaryText(employee);
              const event = new CustomEvent('trigger-chatbot', {
                detail: {
                  message: summaryQuery,
                  response: summaryResponse
                }
              });
              window.dispatchEvent(event);
            }} 
            className="btn-secondary relative group overflow-hidden bg-[#0c0e25] border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 hover:border-indigo-400/50 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="w-4 h-4 text-purple-400" />
            Ask AI Advisor
          </button>
        </div>
      </div>

      {/* Header DNA Card */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative bg-gradient-to-r from-[#0e112a] to-[#12163a] rounded-3xl shadow-2xl p-6 overflow-hidden"
      >
        {/* Futuristic glowing element and dot pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none ags-dot-grid" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-stretch gap-6 relative z-10">
          
          {/* Left Profile Section */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left justify-center lg:w-1/3 pr-0 lg:pr-6 gap-4">
            {employee.avatar ? (
              <img src={employee.avatar} className="w-24 h-24 rounded-2xl object-cover border border-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]" alt="" />
            ) : (
              <div className="w-24 h-24 bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                {employee.first_name?.[0]}{employee.last_name?.[0]}
              </div>
            )}
            
            <div className="space-y-1">
              <div className="flex items-center justify-center lg:justify-start gap-2.5 flex-wrap">
                <h2 className="text-2xl font-black text-slate-100">{employee.first_name} {employee.last_name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  employee.employment_status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                  employee.employment_status === 'On-Leave' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-rose-500/10 text-rose-400'
                }`}>
                  {employee.employment_status || 'Active'}
                </span>
              </div>
              <p className="text-sm text-indigo-300 font-medium">{employee.designation?.title || 'Associate'} · {employee.department?.name || 'Operations'}</p>
              <p className="text-xs text-slate-400">{employee.emp_code} · {employee.employment_type || 'Full-time'}</p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full">
              <span className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                📍 {BRANCH_DATA.find(b => b.id === employee.work_branch)?.city || employee.work_branch || 'Chennai'}, {employee.work_country || 'India'}
              </span>
              {employee.work_country === 'United States' && (
                <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase tracking-wider text-center flex items-center justify-center">
                  🇺🇸 Global HQ
                </span>
              )}
            </div>
          </div>

          {/* Right Metrics Grid Section */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
            
            {[
              {
                label: 'Selected By (HR)',
                value: employee.recruiter || 'HR Priya',
                desc: 'Recruitment Sourcing',
                color: 'text-blue-400 bg-blue-500/5'
              },
              {
                label: 'Assigned Trainer',
                value: employee.trainer || 'Trainer Arun',
                desc: 'Competency Mentor',
                color: 'text-purple-400 bg-purple-500/5'
              },
              {
                label: 'Direct Team Lead',
                value: employee.team_lead || 'TL Karthik',
                desc: 'Operations Delivery',
                color: 'text-indigo-400 bg-indigo-500/5'
              },
              {
                label: 'Training Score',
                value: `${employee.training_score || 92}%`,
                desc: `Rating: ${employee.training_performance || 'Excellent'}`,
                color: 'text-emerald-400 bg-emerald-500/5'
              },
              {
                label: 'Project Performance',
                value: `${employee.project_performance || 85}%`,
                desc: 'Delivery KPI',
                color: 'text-cyan-400 bg-cyan-500/5'
              },
              {
                label: 'Attendance Rate',
                value: '96%',
                desc: 'Monthly Average',
                color: 'text-amber-400 bg-amber-500/5'
              },
              {
                label: 'Client Feedback',
                value: '4.5 / 5',
                desc: 'Customer CSAT Rating',
                color: 'text-teal-400 bg-teal-500/5'
              },
              {
                label: 'Profit Generated',
                value: `${(profitLoss / 100000).toFixed(1)} Lakhs`,
                desc: `${profitLoss >= 0 ? '+' : ''}$${profitLoss.toLocaleString()} Net Yield`,
                color: profitLoss >= 0 ? 'text-emerald-400 bg-emerald-500/5' : 'text-rose-400 bg-rose-500/5'
              },
              {
                label: 'Risk Assessment',
                value: (employee.mistakes?.length > 2) ? 'High' : (employee.mistakes?.length > 0 ? 'Medium' : 'Low'),
                desc: `${employee.mistakes?.length || 0} SLA gap logs`,
                color: (employee.mistakes?.length > 2) ? 'text-rose-400 bg-rose-500/5' : ((employee.mistakes?.length > 0) ? 'text-amber-400 bg-amber-500/5' : 'text-emerald-400 bg-emerald-500/5')
              }
            ].map((metric) => (
              <div 
                key={metric.label}
                className={`p-3 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${metric.color}`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 truncate">{metric.label}</span>
                </div>
                <div className="mt-2.5">
                  <div className="text-base font-black leading-tight truncate">{metric.value}</div>
                  <div className="text-[9px] opacity-75 mt-0.5 truncate">{metric.desc}</div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </motion.div>
      {['Resigned', 'Terminated'].includes(employee.employment_status) && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-500/10 text-rose-300 rounded-2xl p-5 mb-5 text-sm flex gap-4 items-center">
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
        className="bg-[#0e112a] rounded-2xl shadow-card p-6 relative overflow-hidden"
      >
        {/* Background breathing dots overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none ags-dot-grid" />
        
        <h3 className="font-semibold text-slate-200 text-sm mb-6 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Employee Lifecycle Journey
        </h3>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6 md:gap-4">

          {/* Phase 1: Recruitment */}
          <div className="flex-1 relative z-10 bg-[#0c0e25]/60 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
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
            <div className="mt-4 text-[9px] text-slate-500">
              Talent Acquisition Completed
            </div>
          </div>

          {/* Phase 2: Onboarding & LMS */}
          <div className="flex-1 relative z-10 bg-[#0c0e25]/60 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
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
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-300 max-w-[120px] truncate" title={c}>
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
            <div className="mt-4 text-[9px] text-slate-500">
              Training & Onboarding Passed
            </div>
          </div>

          {/* Phase 3: Core Performance */}
          <div className="flex-1 relative z-10 bg-[#0c0e25]/60 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">
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
            <div className="mt-4 text-[9px] text-slate-500">
              Active Delivery Contribution
            </div>
          </div>

          {/* Phase 4: Retention or Offboarding */}
          {['Resigned', 'Terminated'].includes(employee.employment_status) ? (
            <div className="flex-1 relative z-10 bg-rose-500/5 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-rose-500/20 flex items-center justify-center text-xs font-bold text-rose-400">
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
                    <span className="font-semibold text-slate-200 text-[10px] bg-rose-500/10 p-1.5 rounded block leading-tight">
                      {employee.leaving_reason || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-[9px] text-rose-400 font-medium">
                Separated / Inactive
              </div>
            </div>
          ) : (
            <div className="flex-1 relative z-10 bg-emerald-500/5 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
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
              <div className="mt-4 text-[9px] text-emerald-400 font-medium animate-pulse">
                Active Career Path
              </div>
            </div>
          )}

        </div>
      </motion.div>

      <div className="space-y-5">
        
        {/* Financial Profitability & Cost Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
        >
          <div className="bg-[#0e112a] rounded-2xl shadow-card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Financial Profitability & Cost Metrics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-[#0c0e25]/60 rounded-xl p-3">
                <div className="text-xs text-slate-400">Monthly Revenue Contribution</div>
                <div className="text-lg font-bold text-slate-200 mt-1 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  {employee.revenue?.toLocaleString() || '0'}
                </div>
              </div>
              
              <div className="bg-[#0c0e25]/60 rounded-xl p-3">
                <div className="text-xs text-slate-400">Monthly Operating Cost</div>
                <div className="text-lg font-bold text-slate-200 mt-1 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-rose-400" />
                  {employee.cost?.toLocaleString() || '0'}
                </div>
              </div>

              <div className="bg-[#0c0e25]/60 rounded-xl p-3">
                <div className="text-xs text-slate-400">Net Profit / Loss Contribution</div>
                <div className={`text-lg font-bold mt-1 flex items-center gap-0.5 ${profitLoss > 0 ? 'text-emerald-400' : profitLoss < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                  {profitLoss > 0 ? '+' : ''}${profitLoss.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 bg-[#0c0e25]/80 rounded-xl gap-3">
              <div>
                <div className="text-xs text-slate-400">Assigned Project</div>
                <div className="text-sm font-semibold text-slate-200 mt-0.5">{employee.project || 'Bench / Support'}</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  employee.revenue_status === 'High' ? 'bg-emerald-500/10 text-emerald-400' :
                  employee.revenue_status === 'Low' ? 'bg-rose-500/10 text-rose-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  Revenue: {employee.revenue_status || 'Normal'}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  employee.profit_status === 'High Profit' ? 'bg-emerald-500/10 text-emerald-400' :
                  employee.profit_status === 'Loss Center' ? 'bg-rose-500/10 text-rose-400' :
                  employee.profit_status === 'Normal Margin' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-slate-500/10 text-slate-400'
                }`}>
                  {employee.profit_status || 'Cost Center'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Grid - 3 Columns */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {/* Contact Info */}
          <div className="bg-[#0e112a] rounded-2xl shadow-card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4">Contact Info</h3>
            <div className="space-y-4">
              <InfoRow icon={Mail} label="Work Email" value={employee.work_email} />
              <InfoRow icon={Mail} label="Personal Email" value={employee.personal_email} />
              <InfoRow icon={Phone} label="Phone Primary" value={employee.phone_primary} />
            </div>
          </div>

          {/* Compliance & Banking */}
          <div className="bg-[#0e112a] rounded-2xl shadow-card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4">Compliance & Banking</h3>
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

          {/* Bio-data */}
          <div className="bg-[#0e112a] rounded-2xl shadow-card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4">Bio-data</h3>
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
