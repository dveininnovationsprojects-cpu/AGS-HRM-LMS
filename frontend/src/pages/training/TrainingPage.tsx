import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, Award, DollarSign, TrendingUp,
  BookOpen, Star, User, MapPin, Activity, CheckCircle2, AlertCircle,
  HelpCircle, UserCheck, Sparkles, GraduationCap
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function TrainingPage() {
  const [tab, setTab] = useState<'overview' | 'batches' | 'trainers'>('overview');
  const [batches, setBatches] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [trainerPerf, setTrainerPerf] = useState<any[]>([]);
  const [outcomes, setOutcomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail panel state
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, batchesRes, trainersRes] = await Promise.all([
        api.get('/training/stats'),
        api.get('/training/batches'),
        api.get('/training/trainers')
      ]);

      setStats(statsRes.data.data.stats || {});
      setTrainerPerf(statsRes.data.data.trainerPerformance || []);
      setOutcomes(statsRes.data.data.outcomes || []);
      setBatches(batchesRes.data.data.batches || []);
      setTrainers(trainersRes.data.data.trainers || []);
      
      // Auto select first batch if available
      if (batchesRes.data.data.batches?.length > 0) {
        setSelectedBatch(batchesRes.data.data.batches[0]);
      }
    } catch {
      toast.error('Failed to load training dashboard details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Find top performers and refresher candidates
  const getLearnerHighlights = () => {
    const topLearners: any[] = [];
    const refresherNeeded: any[] = [];

    batches.forEach(b => {
      b.trainees?.forEach((tr: any) => {
        if (tr.score >= 90) {
          topLearners.push({ ...tr, batch_name: b.batch_name, trainer_name: b.trainer_name });
        } else if (tr.score !== null && tr.score < 65) {
          refresherNeeded.push({ ...tr, batch_name: b.batch_name, trainer_name: b.trainer_name });
        }
      });
    });

    return { topLearners, refresherNeeded };
  };

  const { topLearners, refresherNeeded } = getLearnerHighlights();

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-9 h-9 text-primary animate-pulse" /> Training & Workforce ROI
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track trainers, employee batches, operational guidelines compliance, and training program profitability.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-2 pb-px">
        {[
          { id: 'overview', label: 'ROI Dashboard', icon: TrendingUp },
          { id: 'batches', label: 'Batches & Curriculums', icon: BookOpen },
          { id: 'trainers', label: 'Trainers Matrix', icon: Star }
        ].map(t => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'border-primary text-primary font-bold bg-white/5 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:rounded-t-lg'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6 h-32 animate-pulse skeleton" />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat-card flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Batches</span>
                    <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-white">{stats.totalBatches}</span>
                    <span className="text-xs block text-slate-500 mt-1">Trainer led programs</span>
                  </div>
                </div>

                <div className="stat-card flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Trainees Enrolled</span>
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-white">{stats.totalTrainees}</span>
                    <span className="text-xs block text-emerald-400 mt-1">Average {stats.avgScore}% pass grade</span>
                  </div>
                </div>

                <div className="stat-card flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Training Budget (Cost)</span>
                    <DollarSign className="w-5 h-5 text-rose-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-rose-400">${stats.totalCost?.toLocaleString()}</span>
                    <span className="text-xs block text-slate-500 mt-1">
                      Trainer: ${stats.totalTrainerCost} | Emp: ${stats.totalEmployeeCost}
                    </span>
                  </div>
                </div>

                <div className="stat-card flex flex-col justify-between ring-1 ring-primary/20 bg-primary/5">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-xs font-semibold uppercase tracking-wider">Net Training Profit (ROI)</span>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-primary">${stats.netProfit?.toLocaleString()}</span>
                    <span className="text-xs block text-emerald-400 font-bold mt-1">
                      ROI: +{stats.roi}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trainer Profitability Comparison Chart */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="text-base font-bold text-white">Trainer ROI & Sourcing Profits</h3>
                      <p className="text-xs text-slate-400">Comparing program delivery cost with trainee billing returns</p>
                    </div>
                  </div>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trainerPerf} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="trainer_name" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0e112a', border: '1px solid rgba(255,255,255,0.08)' }} />
                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                        <Bar dataKey="cost" name="Training Cost" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="revenue" name="Revenue Gain" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="profit" name="Net Profit" fill="#10b981" opacity={0.6} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Training Program Impact */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h3 className="text-base font-bold text-white">Guidelines Certification Performance</h3>
                      <p className="text-xs text-slate-400">SLA Accuracy score improvement: pre-training vs post-training cohort average</p>
                    </div>
                  </div>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={outcomes} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: '#0e112a', border: '1px solid rgba(255,255,255,0.08)' }} />
                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                        <Bar dataKey="before" name="Pre-Training Score" fill="#64748b" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="after" name="Post-Training Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Trainee Diagnostics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performers */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      <div>
                        <h3 className="text-base font-bold text-white">Top Training Accomplishments</h3>
                        <p className="text-xs text-slate-400">Employees achieving expert credentials (90%+ score)</p>
                      </div>
                    </div>
                    <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{topLearners.length} Candidates</span>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {topLearners.length === 0 ? (
                      <p className="text-sm text-slate-500 py-6 text-center">No evaluations certified with honours yet.</p>
                    ) : (
                      topLearners.map((tl, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs">
                              {tl.score}%
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-200">{tl.name} <span className="text-xs text-slate-500 font-normal">({tl.emp_code})</span></div>
                              <div className="text-xs text-slate-400 truncate max-w-[200px] md:max-w-xs">{tl.batch_name} • {tl.trainer_name}</div>
                            </div>
                          </div>
                          <span className="text-xs text-primary font-semibold flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5" /> High Performer
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Refresher Recommended */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      <div>
                        <h3 className="text-base font-bold text-white">Refresher Training Alerts</h3>
                        <p className="text-xs text-slate-400">Employees scoring below 65% needing trainer pairing</p>
                      </div>
                    </div>
                    <span className="badge bg-amber-500/10 text-amber-400 border border-amber-500/20">{refresherNeeded.length} Alerts</span>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {refresherNeeded.length === 0 ? (
                      <p className="text-sm text-slate-500 py-6 text-center">All evaluated trainees meet Pass requirements.</p>
                    ) : (
                      refresherNeeded.map((rn, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-xs">
                              {rn.score}%
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-200">{rn.name} <span className="text-xs text-slate-500 font-normal">({rn.emp_code})</span></div>
                              <div className="text-xs text-slate-400 truncate max-w-[200px] md:max-w-xs">{rn.batch_name} • {rn.trainer_name}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const batch = batches.find(b => b.batch_name === rn.batch_name);
                              if (batch) {
                                setTab('batches');
                                setSelectedBatch(batch);
                              }
                            }}
                            className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 transition-all"
                          >
                            Inspect Batch
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* BATCHES TAB */}
          {tab === 'batches' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column: Batches List */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">All Batches ({batches.length})</h3>
                </div>
                <div className="space-y-3">
                  {batches.map(b => {
                    const isSelected = selectedBatch?.id === b.id;
                    const ongoing = b.status === 'Ongoing';
                    const completed = b.status === 'Completed';
                    const scoreCount = b.trainees?.filter((t: any) => t.score !== null).length || 0;
                    const traineeCount = b.trainees?.length || 0;

                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBatch(b)}
                        className={`p-4 rounded-xl border cursor-pointer hover:border-primary/40 hover:bg-white/5 transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                            : 'border-white/5 bg-[#0e112a]/40'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-bold text-white truncate">{b.batch_name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            completed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            ongoing ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                            'bg-slate-500/10 text-slate-400 border border-white/10'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-1">{b.program_name}</p>
                        
                        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-2.5">
                          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {b.trainer_name}</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {traineeCount} Trainees</span>
                        </div>

                        {completed && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Evaluated {scoreCount} / {traineeCount} candidates
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Batch Details */}
              <div className="lg:col-span-2">
                {selectedBatch ? (
                  <div className="glass-card p-6 space-y-6">
                    {/* Header */}
                    <div className="border-b border-white/5 pb-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {selectedBatch.batch_name}
                          </h2>
                          <p className="text-xs text-primary font-medium mt-1">{selectedBatch.program_name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {selectedBatch.start_date} to {selectedBatch.end_date}</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selectedBatch.venue} ({selectedBatch.mode})</span>
                        </div>
                      </div>
                    </div>

                    {/* Trainer Card */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
                      <img
                        src={selectedBatch.trainer_avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                        alt={selectedBatch.trainer_name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/20"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assigned Lead Trainer</span>
                        <h4 className="text-sm font-bold text-white">{selectedBatch.trainer_name}</h4>
                        <p className="text-xs text-slate-400">Responsible for grading, compliance reviews, and curriculum delivery.</p>
                      </div>
                    </div>

                    {/* Financial Audit */}
                    <div>
                      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                        <DollarSign className="w-4.5 h-4.5 text-primary" /> Training Batch Financial Audit
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="text-xs text-slate-500">Total Program Cost</div>
                          <div className="text-lg font-bold text-white mt-1">
                            ${((selectedBatch.trainer_cost || 0) + (selectedBatch.material_cost || 0) + (selectedBatch.trainees?.reduce((sum: number, t: any) => sum + (t.employee_cost || 0), 0) || 0)).toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            Trainer: ${selectedBatch.trainer_cost} | Material: ${selectedBatch.material_cost}
                          </div>
                        </div>

                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="text-xs text-slate-500">Trainee Revenue Value</div>
                          <div className="text-lg font-bold text-white mt-1">
                            ${(selectedBatch.trainees?.reduce((sum: number, t: any) => sum + (t.revenue_generated || 0), 0) || 0).toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            Operational billing boost YTD
                          </div>
                        </div>

                        <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                          <div className="text-xs text-primary">Net profit margin</div>
                          <div className="text-lg font-bold text-primary mt-1">
                            ${((selectedBatch.trainees?.reduce((sum: number, t: any) => sum + (t.revenue_generated || 0), 0) || 0) - ((selectedBatch.trainer_cost || 0) + (selectedBatch.material_cost || 0) + (selectedBatch.trainees?.reduce((sum: number, t: any) => sum + (t.employee_cost || 0), 0) || 0))).toLocaleString()}
                          </div>
                          <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                            ROI: {((selectedBatch.trainer_cost || 0) + (selectedBatch.material_cost || 0) + (selectedBatch.trainees?.reduce((sum: number, t: any) => sum + (t.employee_cost || 0), 0) || 0)) > 0 
                              ? Math.round((((selectedBatch.trainees?.reduce((sum: number, t: any) => sum + (t.revenue_generated || 0), 0) || 0) - ((selectedBatch.trainer_cost || 0) + (selectedBatch.material_cost || 0) + (selectedBatch.trainees?.reduce((sum: number, t: any) => sum + (t.employee_cost || 0), 0) || 0))) / ((selectedBatch.trainer_cost || 0) + (selectedBatch.material_cost || 0) + (selectedBatch.trainees?.reduce((sum: number, t: any) => sum + (t.employee_cost || 0), 0) || 0))) * 100)
                              : 0}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* What they did (Curriculum) */}
                    <div>
                      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                        <Activity className="w-4.5 h-4.5 text-indigo-400" /> Curriculum & Training Activities
                      </h3>
                      <div className="space-y-2">
                        {selectedBatch.curriculum?.map((curr: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 p-2 rounded-lg bg-white/5 border border-white/5">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">{idx + 1}</span>
                            <span>{curr}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enrolled Trainees (Mapping) */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <Users className="w-4.5 h-4.5 text-emerald-400" /> Trainee Mapping & Performance Logs
                        </h3>
                      </div>
                      <div className="border border-white/5 rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#0c0e25] text-slate-400 font-semibold border-b border-white/5">
                              <th className="p-3">Employee Name</th>
                              <th className="p-3">Emp Code</th>
                              <th className="p-3">Department</th>
                              <th className="p-3 text-center">Score</th>
                              <th className="p-3">Status</th>
                              <th className="p-3">Activities Done / Feedback</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedBatch.trainees?.map((tr: any) => (
                              <tr
                                key={tr.employee_id}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                              >
                                <td className="p-3 font-bold text-slate-200">{tr.name}</td>
                                <td className="p-3 text-slate-400">{tr.emp_code}</td>
                                <td className="p-3 text-slate-400">{tr.dept_name}</td>
                                <td className="p-3 text-center">
                                  {tr.score !== null ? (
                                    <span className={`px-2 py-0.5 rounded font-bold ${
                                      tr.score >= 90 ? 'bg-emerald-500/10 text-emerald-400' :
                                      tr.score >= 70 ? 'bg-indigo-500/10 text-indigo-400' :
                                      'bg-rose-500/10 text-rose-400'
                                    }`}>
                                      {tr.score}%
                                    </span>
                                  ) : (
                                    <span className="text-slate-500">-</span>
                                  )}
                                </td>
                                <td className="p-3">
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                    tr.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    tr.status === 'Ongoing' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  }`}>
                                    {tr.status || 'Enrolled'}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-400 max-w-[200px] truncate">{tr.activities_done || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[300px]">
                    <HelpCircle className="w-12 h-12 text-slate-600 mb-3" />
                    <h3 className="text-white font-bold mb-1">No Batch Selected</h3>
                    <p className="text-xs">Select a training batch from the list on the left to inspect financials, curriculum, and attendee grades.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TRAINERS TAB */}
          {tab === 'trainers' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {trainers.map(t => (
                <div key={t.id} className="glass-card p-6 space-y-4 hover:border-primary/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                  {/* Floating Rank/Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-bold">
                    <Star className="w-3.5 h-3.5 fill-primary" /> {t.rating} / 5.0
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={t.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                      alt={t.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/10 group-hover:ring-primary/40 transition-all duration-300"
                    />
                    <div>
                      <h4 className="text-base font-extrabold text-white">{t.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block ${
                        t.type === 'Internal' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {t.type} Trainer
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Specialization</span>
                    <p className="text-xs text-slate-200 font-semibold">{t.specialization}</p>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">{t.bio}</p>

                  <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 text-center">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Batches</div>
                      <div className="text-sm font-bold text-white mt-1">{t.batches_count || 0}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Trainees</div>
                      <div className="text-sm font-bold text-white mt-1">{t.total_trainees || 0}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Net Yield</div>
                      <div className={`text-sm font-bold mt-1 ${t.net_profit >= 0 ? 'text-primary' : 'text-rose-400'}`}>
                        ${t.net_profit ? t.net_profit.toLocaleString() : 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
