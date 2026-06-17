import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, DollarSign, AlertCircle, Briefcase, BookOpen, Users, CheckCircle2, Target, ShieldAlert, Zap } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import toast from 'react-hot-toast';

const COLORS = ['#10b981', '#34d399', '#059669', '#06b6d4', '#6ee7b7'];

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [executive, setExecutive] = useState<any>({});
  const [teamData, setTeamData] = useState<any>({});
  const [recruitment, setRecruitment] = useState<any>({});
  const [training, setTraining] = useState<any>({});
  const [leakage, setLeakage] = useState<any>({});
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('executive');
  const [currentPage, setCurrentPage] = useState(1);

  // Scorecard filters state
  const [scorecardSearch, setScorecardSearch] = useState('');
  const [scorecardStatus, setScorecardStatus] = useState('');
  const [scorecardTrainingPerf, setScorecardTrainingPerf] = useState('');
  const [scorecardRevenueStatus, setScorecardRevenueStatus] = useState('');
  const [scorecardProfitStatus, setScorecardProfitStatus] = useState('');

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [scorecardSearch, scorecardStatus, scorecardTrainingPerf, scorecardRevenueStatus, scorecardProfitStatus]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/analytics/executive'),
      api.get('/analytics/profitability-teams'),
      api.get('/analytics/recruitment-hr'),
      api.get('/analytics/training-roi'),
      api.get('/analytics/cost-leakage'),
    ]).then(([e, t, r, tr, l]) => {
      setExecutive(e.data.data || {});
      setTeamData(t.data.data || {});
      setRecruitment(r.data.data || {});
      setTraining(tr.data.data || {});
      setLeakage(l.data.data || {});
    }).catch(() => toast.error('Failed to load platform analytics'))
    .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: 'executive', label: 'Executive Overview' },
    { id: 'teams', label: 'Teams & TL Profitability' },
    { id: 'recruitment', label: 'Recruiter Performance' },
    { id: 'training', label: 'Training ROI' },
    { id: 'leakage', label: 'Cost Leakages' }
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  // Datasets
  const monthlyData = executive.monthlyJoiners || [];
  const deptProfitability = executive.departmentChart || [];
  const employeeProfitabilityList = executive.employeeProfitability || [];
  const filteredEmployees = employeeProfitabilityList.filter((e: any) => {
    if (scorecardSearch) {
      const searchLower = scorecardSearch.toLowerCase();
      const nameMatch = e.name?.toLowerCase().includes(searchLower);
      const deptMatch = e.dept?.toLowerCase().includes(searchLower);
      const projMatch = e.project?.toLowerCase().includes(searchLower);
      const tlMatch = e.tl?.toLowerCase().includes(searchLower);
      if (!nameMatch && !deptMatch && !projMatch && !tlMatch) return false;
    }
    if (scorecardStatus && e.status !== scorecardStatus) return false;
    if (scorecardTrainingPerf && e.training_performance !== scorecardTrainingPerf) return false;
    if (scorecardRevenueStatus && e.revenue_status !== scorecardRevenueStatus) return false;
    if (scorecardProfitStatus && e.profit_status !== scorecardProfitStatus) return false;
    return true;
  });

  const itemsPerPage = 15;
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const teamsList = teamData.teams || [];
  const recruiterList = recruitment.recruiters || [];
  const funnelData = recruitment.funnel || [];
  const sourceData = recruitment.sources || [];
  const trainerList = training.trainers || [];
  const trainingOutcomes = training.outcomes || [];
  const leakageList = leakage.leakages || [];
  const leakageSuggestions = leakage.suggestions || [];
  const utilizationData = leakage.utilization || [];

  return (
    <div className="space-y-5">
      <PageHeader title="Workforce Intelligence Analytics" subtitle="Unified HRM & LMS Decision-Support Platform" />

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-[#0c0e25] border border-white/5 p-1 rounded-xl w-fit overflow-x-auto max-w-full">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-primary text-[#060814] shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. EXECUTIVE TAB */}
      {activeTab === 'executive' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Platform Revenue', value: '$1.25M', change: '+12.4%', up: true, bg: 'bg-emerald-500', icon: DollarSign },
              { label: 'Operating Costs', value: '$910K', change: '+3.1%', up: false, bg: 'bg-rose-500', icon: DollarSign },
              { label: 'Workforce Profit', value: '$340K', change: '+18.5%', up: true, bg: 'bg-indigo-500', icon: TrendingUp },
              { label: 'Training ROI YTD', value: '148%', change: '+12.0%', up: true, bg: 'bg-purple-500', icon: BookOpen },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-[#060814]" />
                    </div>
                    <span className={`text-[10px] font-semibold ${s.up ? 'text-emerald-400' : 'text-amber-400'}`}>{s.change}</span>
                  </div>
                  <div className="text-xl font-bold text-slate-100">{s.value}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Revenue vs Cost Area Chart */}
            <div className="bg-[#0e112a] rounded-2xl p-5 shadow-card border border-white/5">
              <h3 className="font-semibold text-slate-200 text-sm mb-1">Revenue vs Operating Cost</h3>
              <p className="text-xs text-slate-400 mb-4">6-Month Workforce Financial Trend</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0e112a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revenueGrad)" name="Revenue" dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} fill="url(#costGrad)" name="Cost" dot={{ fill: '#ef4444', r: 4, strokeWidth: 0 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Department Profitability */}
            <div className="bg-[#0e112a] rounded-2xl p-5 shadow-card border border-white/5">
              <h3 className="font-semibold text-slate-200 text-sm mb-1">Department Profitability</h3>
              <p className="text-xs text-slate-400 mb-4">Revenue, Cost & Net Profit by Department</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={deptProfitability} barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0e112a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, fontSize: 12 }} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar dataKey="cost" fill="#ef4444" radius={[4, 4, 0, 0]} name="Cost" />
                  <Bar dataKey="profit" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Net Margin" />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Employee Profitability Scorecard */}
          <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-1">Employee Profitability Scorecard</h3>
            <p className="text-xs text-slate-400 mb-4">Click on any employee to view their individual journey & AI recommendation</p>
            
            {/* Scorecard Filters */}
            <div className="bg-[#0c0e25] border border-white/5 p-3 rounded-xl flex flex-wrap gap-2.5 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search scorecard by name, project, tl..."
                  value={scorecardSearch}
                  onChange={(e) => setScorecardSearch(e.target.value)}
                  className="input-field"
                />
              </div>
              <select
                value={scorecardStatus}
                onChange={(e) => setScorecardStatus(e.target.value)}
                className="input-field w-auto min-w-[130px]"
              >
                <option value="">All Status</option>
                <option>Active</option>
                <option>Resigned</option>
                <option>Terminated</option>
                <option>On-Leave</option>
              </select>
              <select
                value={scorecardTrainingPerf}
                onChange={(e) => setScorecardTrainingPerf(e.target.value)}
                className="input-field w-auto min-w-[130px]"
              >
                <option value="">All Training Perf</option>
                <option>Excellent</option>
                <option>Medium</option>
                <option>Poor</option>
              </select>
              <select
                value={scorecardRevenueStatus}
                onChange={(e) => setScorecardRevenueStatus(e.target.value)}
                className="input-field w-auto min-w-[130px]"
              >
                <option value="">All Revenue</option>
                <option>High</option>
                <option>Normal</option>
                <option>Low</option>
              </select>
              <select
                value={scorecardProfitStatus}
                onChange={(e) => setScorecardProfitStatus(e.target.value)}
                className="input-field w-auto min-w-[130px]"
              >
                <option value="">All Profit Status</option>
                <option>High Profit</option>
                <option>Normal Margin</option>
                <option>Loss Center</option>
                <option>Cost Center (Support)</option>
              </select>
            </div>

            <DataTable
              columns={[
                { 
                  header: 'Employee', 
                  accessor: (r: any) => (
                    <div className="flex items-center gap-2.5">
                      {r.avatar ? (
                        <img src={r.avatar} className="w-7 h-7 rounded-lg object-cover border border-white/10" alt="" />
                      ) : (
                        <div className="w-7 h-7 bg-primary/10 border border-primary/20 text-primary rounded-lg flex items-center justify-center text-[10px] font-bold">
                          {r.name?.[0]}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-slate-200">{r.name}</span>
                        {['Resigned', 'Terminated'].includes(r.status) && (
                          <div className="text-[10px] text-rose-400 font-medium">
                            {r.status}: {r.leaving_reason || 'Exit'}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                },
                { header: 'Department', accessor: 'dept' },
                { header: 'Active Project', accessor: 'project' },
                { header: 'Team Lead', accessor: 'tl' },
                {
                  header: 'Training Perf',
                  accessor: (r: any) => {
                    const perf = r.training_performance || 'Medium';
                    const style = perf === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  perf === 'Poor' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                  'bg-blue-500/10 text-blue-400 border-blue-500/20';
                    return <span className={`badge ${style} border text-[10px]`}>{perf}</span>;
                  }
                },
                {
                  header: 'Fin Status',
                  accessor: (r: any) => {
                    const rev = r.revenue_status || 'Normal';
                    const prof = r.profit_status || 'Cost Center';
                    const profStyle = prof.includes('Profit') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                      prof.includes('Loss') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                      prof.includes('Margin') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                      'bg-slate-500/10 text-slate-400 border border-slate-500/20';
                    return (
                      <div className="space-y-0.5 text-[10px]">
                        <div className="text-slate-400">Rev: <span className="font-semibold text-slate-200">{rev}</span></div>
                        <div className={`badge ${profStyle} text-[9px] px-1 py-0`}>{prof}</div>
                      </div>
                    );
                  }
                },
                { header: 'Monthly Revenue', accessor: (r: any) => `$${r.revenue.toLocaleString()}` },
                { header: 'Monthly Cost', accessor: (r: any) => `$${r.cost.toLocaleString()}` },
                { 
                  header: 'Net Margin', 
                  accessor: (r: any) => {
                    const diff = r.revenue - r.cost;
                    return (
                      <span className={`font-semibold ${diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                        {diff > 0 ? '+' : ''}${diff.toLocaleString()}
                      </span>
                    );
                  }
                },
                { 
                  header: 'Attrition Risk', 
                  accessor: (r: any) => (
                    <span className={r.risk === 'High' ? 'status-rejected' : r.risk === 'Medium' ? 'status-pending' : 'status-approved'}>
                      {r.risk}
                    </span>
                  ) 
                },
              ]}
              data={paginatedEmployees}
              onRowClick={(row) => navigate(`/employees/${row.id}`)}
              pagination={{
                page: currentPage,
                totalPages: Math.ceil(filteredEmployees.length / itemsPerPage),
                onPageChange: (p) => setCurrentPage(p),
              }}
            />
          </div>
        </motion.div>
      )}

      {/* 2. TEAMS & TL PROFITABILITY TAB */}
      {activeTab === 'teams' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Highest Net Profit Team', value: 'Anand Kumar (Ops)', metric: '$19,500/mo', bg: 'bg-emerald-500', icon: TrendingUp },
              { label: 'Highest Margin Team', value: 'Anand Kumar (Ops)', metric: '45.8%', bg: 'bg-indigo-500', icon: Target },
              { label: 'Underperforming Team', value: 'Charles Dev (IT)', metric: '-$2,500/mo', bg: 'bg-rose-500', icon: AlertCircle }
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="stat-card flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-slate-400">{s.label}</div>
                    <div className="text-base font-bold text-slate-100 mt-1.5">{s.value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Value: <span className="font-semibold text-slate-200">{s.metric}</span></div>
                  </div>
                  <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4 text-[#060814]" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4">Team Leads Effectiveness & Profitability Ranking</h3>
            <DataTable
              columns={[
                { header: 'Team Lead', accessor: 'tl_name' },
                { header: 'Department', accessor: 'department' },
                { header: 'Headcount', accessor: 'headcount' },
                { header: 'Monthly Cost', accessor: (r: any) => `$${r.cost.toLocaleString()}` },
                { header: 'Monthly Revenue', accessor: (r: any) => `$${r.revenue.toLocaleString()}` },
                { 
                  header: 'Net Profit', 
                  accessor: (r: any) => (
                    <span className={`font-semibold ${r.profit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {r.profit > 0 ? '+' : ''}${r.profit.toLocaleString()}
                    </span>
                  )
                },
                { header: 'Net Margin', accessor: (r: any) => `${r.margin}%` },
                { header: 'SLA Adherence', accessor: (r: any) => `${r.sla_compliance}%` },
                { header: 'Team Health', accessor: (r: any) => <span className="badge bg-primary/10 text-primary border border-primary/20">{r.health_score}/100</span> },
              ]}
              data={teamsList}
            />
          </div>
        </motion.div>
      )}

      {/* 3. RECRUITER PERFORMANCE TAB */}
      {activeTab === 'recruitment' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-4">HR Recruiter Proficiency Scorecard</h3>
              <DataTable
                columns={[
                  { header: 'Recruiter Name', accessor: 'recruiter_name' },
                  { header: 'Candidates Hired', accessor: 'candidates_hired' },
                  { header: 'Hiring Success %', accessor: (r: any) => `${r.success_rate}%` },
                  { header: 'YTD Retention %', accessor: (r: any) => `${r.retention_rate}%` },
                  { header: 'Avg Days to Hire', accessor: (r: any) => `${r.avg_days_to_hire} Days` },
                  { header: 'Recruitment Cost', accessor: (r: any) => `$${r.cost_per_hire.toLocaleString()} / Hire` },
                  { header: 'Profitability Index', accessor: (r: any) => <span className="font-bold text-slate-200">{r.profit_index}/10</span> },
                ]}
                data={recruiterList}
              />
            </div>

            <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-4">Source Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" outerRadius={70} paddingAngle={2} dataKey="value">
                    {sourceData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0e112a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. TRAINING ROI TAB */}
      {activeTab === 'training' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-4">Trainer Impact & Effectiveness Engine</h3>
              <DataTable
                columns={[
                  { header: 'Trainer Name', accessor: 'trainer_name' },
                  { header: 'Batches Managed', accessor: 'batches' },
                  { header: 'Trainer Rating', accessor: (r: any) => `${r.rating}★` },
                  { header: 'Skill Gain %', accessor: (r: any) => `+${r.improvement}%` },
                  { header: 'Delivery Cost', accessor: (r: any) => `$${r.training_cost.toLocaleString()}` },
                  { header: 'Business Impact', accessor: (r: any) => `$${r.business_impact.toLocaleString()}` },
                  { header: 'Training ROI', accessor: (r: any) => <span className="font-bold text-emerald-400">+{r.roi}%</span> },
                ]}
                data={trainerList}
              />
            </div>

            <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-4">Skill Assessment Outcomes</h3>
              <p className="text-xs text-slate-400 mb-3">Pre-training vs Post-training scores %</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={trainingOutcomes} barSize={8} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0e112a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, fontSize: 12 }} />
                  <Bar dataKey="before" fill="#ef4444" radius={[3, 3, 0, 0]} name="Before" />
                  <Bar dataKey="after" fill="#10b981" radius={[3, 3, 0, 0]} name="After" />
                  <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* 5. COST LEAKAGE TAB */}
      {activeTab === 'leakage' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            <div className="lg:col-span-2 bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" /> Active Operations Cost Leakages
              </h3>
              <DataTable
                columns={[
                  { header: 'Leakage Description', accessor: 'category' },
                  { 
                    header: 'Severity Impact', 
                    accessor: (r: any) => (
                      <span className={r.impact === 'High' ? 'status-rejected' : r.impact === 'Medium' ? 'status-pending' : 'status-approved'}>
                        {r.impact}
                      </span>
                    )
                  },
                  { header: 'Estimated Loss', accessor: (r: any) => <span className="font-bold text-rose-400">${r.amount.toLocaleString()} / mo</span> },
                  { header: 'Root Cause Details', accessor: 'description', className: 'text-xs text-slate-400' },
                ]}
                data={leakageList}
              />
            </div>

            <div className="space-y-4">
              {/* Utilization distribution */}
              <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
                <h3 className="font-semibold text-slate-200 text-xs mb-3 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primary" /> Resource Allocation</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={utilizationData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                      {utilizationData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0e112a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-2">
                  {utilizationData.map((d: any, i: number) => (
                    <div key={d.name} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-slate-400">{d.name}</span>
                      </div>
                      <span className="font-medium text-slate-200">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Cost Suggestions */}
              <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-5">
                <h3 className="font-semibold text-slate-200 text-xs mb-3 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> AI Optimization Plan</h3>
                <div className="space-y-2">
                  {leakageSuggestions.map((s: any) => (
                    <div key={s.id} className="p-2.5 bg-primary/5 rounded-xl border border-primary/10 text-xs text-slate-300">
                      • {s.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
