import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Briefcase, Users, User, ShieldCheck, Search, Filter, 
  ChevronRight, MoreVertical, Calendar, Mail, Phone, MapPin, 
  Award, BrainCircuit, Activity, CheckCircle2, X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

// ==========================================
// 1. ADVANCED MOCK DATA & TYPES
// ==========================================
type Stage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  stage: Stage;
  source: string;
  match_score: number;
  applied_date: string;
  recruiter: string;
  mentor: string;
  feedback: string;
  skills: string[];
}

const MOCK_REQUISITIONS = [
  { id: 'REQ-001', title: 'Senior Frontend Developer', dept: 'Engineering', openings: 2, applicants: 14, status: 'Active', created_at: '2026-06-01' },
  { id: 'REQ-002', title: 'IoT Systems Architect', dept: 'Hardware', openings: 1, applicants: 8, status: 'Active', created_at: '2026-06-10' },
  { id: 'REQ-003', title: 'Backend Engineer', dept: 'Engineering', openings: 3, applicants: 22, status: 'Active', created_at: '2026-06-12' },
];

const INITIAL_CANDIDATES: Candidate[] = [
  { id: 'C1', name: 'Arjun Kumar', email: 'arjun.k@example.com', role: 'Senior Frontend Developer', stage: 'Interview', source: 'LinkedIn', match_score: 92, applied_date: '2026-06-14', recruiter: 'Swetha K', mentor: 'Ganapathi V', feedback: 'Strong React skills. Culture fit.', skills: ['React', 'TypeScript', 'Tailwind'] },
  { id: 'C2', name: 'Deepika Rajan', email: 'deepika.r@example.com', role: 'Backend Engineer', stage: 'Offer', source: 'Referral', match_score: 88, applied_date: '2026-06-10', recruiter: 'Jayachitra P', mentor: 'Eswar NS', feedback: 'Excellent API design knowledge.', skills: ['Node.js', 'PostgreSQL', 'AWS'] },
  { id: 'C3', name: 'Karthik S', email: 'karthik.s@example.com', role: 'IoT Systems Architect', stage: 'Screening', source: 'Website', match_score: 75, applied_date: '2026-06-17', recruiter: 'Dinagaran I', mentor: 'Navin', feedback: 'Reviewing hardware portfolio.', skills: ['C++', 'ESP32', 'RTOS'] },
  { id: 'C4', name: 'Priya V', email: 'priya.v@example.com', role: 'Senior Frontend Developer', stage: 'Applied', source: 'Naukri', match_score: 85, applied_date: '2026-06-18', recruiter: 'Swetha K', mentor: 'Pending', feedback: 'Resume looks good. Schedule call.', skills: ['React', 'Redux', 'CSS'] },
  { id: 'C5', name: 'Rahul M', email: 'rahul.m@example.com', role: 'Backend Engineer', stage: 'Hired', source: 'Campus', match_score: 95, applied_date: '2026-05-20', recruiter: 'Jayachitra P', mentor: 'Eswar NS', feedback: 'Top performer in coding test.', skills: ['Java', 'Spring Boot', 'Microservices'] },
];

const PIPELINE_STAGES: Stage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

// ==========================================
// 2. MAIN ATS DASHBOARD COMPONENT
// ==========================================
export default function RecruitmentATS() {
  const [activeView, setActiveView] = useState<'PIPELINE' | 'JOBS' | 'ANALYTICS'>('PIPELINE');
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [requisitions, setRequisitions] = useState(MOCK_REQUISITIONS);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showCandModal, setShowCandModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const { register: regCand, handleSubmit: hsCand, reset: resetCand } = useForm();
  const { register: regJob, handleSubmit: hsJob, reset: resetJob } = useForm();

  // Handlers
  const handleAddCandidate = (data: any) => {
    const newCand: Candidate = {
      id: `C${Date.now()}`,
      name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      role: data.role,
      stage: 'Applied',
      source: data.source,
      match_score: Math.floor(Math.random() * 30) + 70, // Mock AI Score
      applied_date: new Date().toISOString().split('T')[0],
      recruiter: 'Current User',
      mentor: 'Pending Allocation',
      feedback: 'Newly added to system.',
      skills: ['Pending Review']
    };
    setCandidates([newCand, ...candidates]);
    setShowCandModal(false);
    resetCand();
    toast.success('Candidate injected into pipeline!');
  };

  const handleAddJob = (data: any) => {
    const newJob = {
      id: `REQ-00${requisitions.length + 1}`,
      title: data.title,
      dept: data.dept,
      openings: Number(data.openings),
      applicants: 0,
      status: 'Active',
      created_at: new Date().toISOString().split('T')[0]
    };
    setRequisitions([newJob, ...requisitions]);
    setShowJobModal(false);
    resetJob();
    toast.success('Job Requisition Published!');
  };

  const updateCandidateStage = (id: string, newStage: Stage) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, stage: newStage } : c));
    toast.success(`Candidate moved to ${newStage}`);
    setSelectedCandidate(null); // Close modal if open
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="text-emerald-400" /> Talent Acquisition Suite
          </h1>
          <p className="text-slate-400 text-sm mt-1">End-to-end recruitment lifecycle and pipeline management.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowJobModal(true)} className="bg-[#0c0e25] border border-white/10 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/5 transition-all flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Post Job
          </button>
          <button onClick={() => setShowCandModal(true)} className="bg-emerald-500 text-[#060814] px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <Plus className="w-4 h-4" /> Add Candidate
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0e112a] border border-white/5 p-3 rounded-2xl shadow-xl gap-4">
        <div className="flex gap-2">
          {[
            { id: 'PIPELINE', label: 'Kanban Pipeline', icon: <Activity className="w-4 h-4" /> },
            { id: 'JOBS', label: 'Active Requisitions', icon: <Briefcase className="w-4 h-4" /> },
            { id: 'ANALYTICS', label: 'Funnel Analytics', icon: <BarChart className="w-4 h-4" /> }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeView === tab.id ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        
        {activeView === 'PIPELINE' && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" placeholder="Search candidates..." 
              className="w-full bg-[#060814] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-colors"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeView === 'PIPELINE' && (
          <PipelineBoard 
            candidates={candidates.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()))} 
            onSelectCandidate={setSelectedCandidate} 
          />
        )}
        {activeView === 'JOBS' && <RequisitionsList jobs={requisitions} />}
        {activeView === 'ANALYTICS' && <RecruitmentAnalytics candidates={candidates} />}
      </AnimatePresence>

      {/* Candidate Profile Advanced Modal */}
      {selectedCandidate && (
        <CandidateProfileModal 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
          onStageChange={(stage) => updateCandidateStage(selectedCandidate.id, stage)}
        />
      )}

      {/* Form Modals (Simplified versions of your original) */}
      {showCandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0e112a] w-full max-w-lg rounded-3xl border border-white/10 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Sourcing New Candidate</h2>
            <form onSubmit={hsCand(handleAddCandidate)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input {...regCand('first_name')} placeholder="First Name" className="bg-[#060814] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500" required />
                <input {...regCand('last_name')} placeholder="Last Name" className="bg-[#060814] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500" required />
              </div>
              <input {...regCand('email')} type="email" placeholder="Email Address" className="w-full bg-[#060814] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500" required />
              <select {...regCand('role')} className="w-full bg-[#060814] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500" required>
                <option value="">Select Target Requisition</option>
                {requisitions.map(r => <option key={r.id} value={r.title}>{r.title}</option>)}
              </select>
              <select {...regCand('source')} className="w-full bg-[#060814] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500">
                <option value="LinkedIn">LinkedIn</option><option value="Referral">Employee Referral</option>
                <option value="Campus">Campus Drive</option><option value="Website">Company Website</option>
              </select>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowCandModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:bg-white/5">Cancel</button>
                <button type="submit" className="bg-emerald-500 text-black px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-400">Add to Pipeline</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requisition Modal (Simplified) */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0e112a] w-full max-w-lg rounded-3xl border border-white/10 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Create Job Requisition</h2>
            <form onSubmit={hsJob(handleAddJob)} className="space-y-4">
              <input {...regJob('title')} placeholder="Job Title (e.g., UI/UX Designer)" className="w-full bg-[#060814] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500" required />
              <div className="grid grid-cols-2 gap-4">
                <select {...regJob('dept')} className="bg-[#060814] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500" required>
                  <option value="">Department</option><option value="Engineering">Engineering</option><option value="Hardware">Hardware</option><option value="HR">HR</option>
                </select>
                <input {...regJob('openings')} type="number" placeholder="No. of Openings" min="1" className="bg-[#060814] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500" required />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowJobModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:bg-white/5">Cancel</button>
                <button type="submit" className="bg-emerald-500 text-black px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-400">Post Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

// 1. KANBAN PIPELINE BOARD
function PipelineBoard({ candidates, onSelectCandidate }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 overflow-x-auto pb-4">
      {PIPELINE_STAGES.map(stage => {
        const stageCandidates = candidates.filter((c: any) => c.stage === stage);
        return (
          <div key={stage} className="min-w-[300px] w-[300px] flex-shrink-0 bg-[#0c0e25] rounded-2xl border border-white/5 p-4 flex flex-col max-h-[70vh]">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <h3 className="font-bold text-slate-200">{stage}</h3>
              <span className="bg-white/10 text-slate-300 text-xs font-bold px-2.5 py-1 rounded-lg">{stageCandidates.length}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
              {stageCandidates.map((c: any) => (
                <div 
                  key={c.id} 
                  onClick={() => onSelectCandidate(c)}
                  className="bg-[#151936] p-4 rounded-xl border border-white/5 cursor-pointer hover:border-indigo-500/40 hover:shadow-lg transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{c.name}</div>
                    {/* AI Score Badge */}
                    <div className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${c.match_score >= 90 ? 'bg-emerald-500/20 text-emerald-400' : c.match_score >= 75 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      <BrainCircuit className="w-3 h-3" /> {c.match_score}%
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mb-3">{c.role}</div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.applied_date}</span>
                    <span className="bg-white/5 px-2 py-1 rounded-md">{c.source}</span>
                  </div>
                </div>
              ))}
              {stageCandidates.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-white/10 rounded-xl">No candidates</div>
              )}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

// 2. REQUISITIONS LIST VIEW
function RequisitionsList({ jobs }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {jobs.map((job: any) => (
        <div key={job.id} className="bg-[#0e112a] border border-white/5 rounded-2xl p-5 shadow-xl hover:border-emerald-500/20 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
              {job.status}
            </div>
            <button className="text-slate-500 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{job.title}</h3>
          <p className="text-sm text-slate-400 mb-6">{job.dept} Department</p>
          
          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Openings</div>
              <div className="text-lg font-black text-slate-200">{job.openings}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Applicants Pipeline</div>
              <div className="text-lg font-black text-indigo-400">{job.applicants}</div>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// 3. RECRUITMENT ANALYTICS DASHBOARD
function RecruitmentAnalytics({ candidates }: any) {
  const funnelData = PIPELINE_STAGES.map(stage => ({
    stage,
    count: candidates.filter((c: any) => c.stage === stage).length
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0e112a] p-6 rounded-3xl border border-white/5 shadow-xl">
          <h3 className="font-bold text-slate-200 mb-6">Drop-off Funnel Dynamics</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" barSize={24}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff05" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis type="category" dataKey="stage" tickLine={false} axisLine={false} tick={{fill: '#cbd5e1', fontSize: 12}} width={80} />
                <RechartsTooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#0e112a', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0e112a] p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col justify-center">
          <h3 className="font-bold text-slate-200 mb-6">AI Sourcing Efficiency</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Average Match Score</span>
                <span className="text-emerald-400 font-bold">85%</span>
              </div>
              <div className="w-full bg-[#0c0e25] h-3 rounded-full overflow-hidden border border-white/5">
                <div className="bg-emerald-500 h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Offer Acceptance Rate</span>
                <span className="text-indigo-400 font-bold">72%</span>
              </div>
              <div className="w-full bg-[#0c0e25] h-3 rounded-full overflow-hidden border border-white/5">
                <div className="bg-indigo-500 h-full w-[72%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              </div>
            </div>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mt-4">
              <p className="text-xs text-emerald-300 leading-relaxed">
                <strong className="text-emerald-400">System Insight:</strong> Employee Referrals yield the highest AI match scores (90%+). Recommend incentivizing internal referral programs for upcoming IoT requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 4. RICH CANDIDATE PROFILE MODAL
function CandidateProfileModal({ candidate, onClose, onStageChange }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0e112a] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/10 shadow-2xl flex flex-col md:flex-row custom-scrollbar">
        
        {/* Left Panel: Profile Info */}
        <div className="w-full md:w-1/3 bg-[#0c0e25] p-8 border-r border-white/5 flex flex-col">
          <div className="flex justify-between items-start md:hidden mb-4">
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-3xl font-black text-indigo-400 mb-6 shadow-inner mx-auto md:mx-0">
            {candidate.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center md:text-left">{candidate.name}</h2>
          <p className="text-sm font-semibold text-indigo-400 text-center md:text-left mt-1">{candidate.role}</p>
          
          <div className="mt-8 space-y-4 flex-1">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Mail className="w-4 h-4 text-slate-500" /> {candidate.email}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Phone className="w-4 h-4 text-slate-500" /> +91 9876543210
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <MapPin className="w-4 h-4 text-slate-500" /> Chennai, TN
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="text-xs font-bold text-slate-500 uppercase mb-3">AI Match Score</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#060814] h-2 rounded-full border border-white/5 overflow-hidden">
                <div className={`h-full rounded-full ${candidate.match_score >= 90 ? 'bg-emerald-500' : candidate.match_score >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${candidate.match_score}%` }}></div>
              </div>
              <span className="font-black text-white">{candidate.match_score}%</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Pipeline Actions & Feedback */}
        <div className="w-full md:w-2/3 p-8">
          <div className="hidden md:flex justify-end mb-4">
            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
          </div>

          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Action: Change Pipeline Stage</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {PIPELINE_STAGES.map(stage => (
              <button 
                key={stage} onClick={() => onStageChange(stage)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${candidate.stage === stage ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-[#0c0e25] border border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20'}`}
              >
                {stage}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#0c0e25] p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-2"><User className="w-3.5 h-3.5" /> Handled By (HR)</div>
              <div className="font-semibold text-slate-200">{candidate.recruiter}</div>
            </div>
            <div className="bg-[#0c0e25] p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-2"><ShieldCheck className="w-3.5 h-3.5" /> Assigned Mentor</div>
              <div className="font-semibold text-indigo-400">{candidate.mentor}</div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Interview Feedback & Skills</h3>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 mb-6">
            <p className="text-sm text-indigo-200 leading-relaxed">"{candidate.feedback}"</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill: string) => (
              <span key={skill} className="px-3 py-1.5 bg-[#060814] border border-white/10 rounded-lg text-xs font-medium text-slate-300">
                {skill}
              </span>
            ))}
          </div>

        </div>
      </motion.div>
    </div>
  );
}