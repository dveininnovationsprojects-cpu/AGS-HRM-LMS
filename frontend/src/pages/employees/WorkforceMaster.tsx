import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, TrendingUp, TrendingDown, DollarSign, Search, Plus, 
  Download, Edit, ArrowLeft, Mail, Phone, Building2, User, Award, 
  Cpu, CheckCircle2, Save, Activity, AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

// --- INTERFACES ---
interface Department { id: string; name: string; }
interface Designation { id: string; title: string; }
interface Employee {
  id: string;
  emp_code: string;
  first_name: string;
  last_name: string;
  work_email: string;
  phone_primary: string;
  gender: string;
  employment_status: 'Active' | 'Inactive' | 'Resigned' | 'Terminated' | 'On-Leave';
  employment_type: string;
  date_of_joining: string;
  department: Department;
  designation: Designation;
  training_performance: 'Excellent' | 'Medium' | 'Poor';
  revenue_status: 'High' | 'Normal' | 'Low';
  profit_status: 'High Profit' | 'Normal Margin' | 'Loss Center' | 'Cost Center';
  revenue: number;
  cost: number;
  project: string;
  team_lead: string;
  recruiter: string;
  trainer: string;
  mistakes: string[];
  courses_completed: string[];
  ai_recommendation: string;
}

const DEPARTMENTS: Department[] = [
  { id: 'D1', name: 'Engineering & Development' },
  { id: 'D2', name: 'Hardware & IoT' },
  { id: 'D3', name: 'Human Resources' }
];

const DESIGNATIONS: Designation[] = [
  { id: 'DS1', title: 'Senior Full-Stack Developer' },
  { id: 'DS2', title: 'Embedded Systems Engineer' },
  { id: 'DS3', title: 'HR Lead' }
];

// Persistent Static Database
const INITIAL_RESOURCES: Employee[] = [
  {
    id: '1',
    emp_code: 'AGS-1001',
    first_name: 'Arjun',
    last_name: 'Kumar',
    work_email: 'arjun.k@agshealth.com',
    phone_primary: '+91 9444512345',
    gender: 'Male',
    employment_status: 'Active',
    employment_type: 'Full-Time',
    date_of_joining: '2024-06-15',
    department: DEPARTMENTS[0],
    designation: DESIGNATIONS[0],
    training_performance: 'Excellent',
    revenue_status: 'High',
    profit_status: 'High Profit',
    revenue: 9500,
    cost: 3200,
    project: 'AGS-HRM-LMS',
    team_lead: 'Kishore V',
    recruiter: 'Jayachitra P (HR)',
    trainer: 'Ganapathi V',
    mistakes: [],
    courses_completed: ['React 18 Architecture', 'Redux Masterclass'],
    ai_recommendation: 'Exceptional net yield contributor. Ready for technical leadership track assignment.'
  },
  {
    id: '2',
    emp_code: 'AGS-1002',
    first_name: 'Deepika',
    last_name: 'Rajan',
    work_email: 'deepika.r@agshealth.com',
    phone_primary: '+91 9444598765',
    gender: 'Female',
    employment_status: 'Active',
    employment_type: 'Full-Time',
    date_of_joining: '2025-01-10',
    department: DEPARTMENTS[1],
    designation: DESIGNATIONS[1],
    training_performance: 'Poor',
    revenue_status: 'Low',
    profit_status: 'Cost Center',
    revenue: 1200,
    cost: 2800,
    project: 'Smart Parking IoT',
    team_lead: 'Eswar NS',
    recruiter: 'Swetha K (HR)',
    trainer: 'Navin',
    mistakes: ['SLA violation on device communication microservice patch.'],
    courses_completed: ['Basic Firmware Compilation'],
    ai_recommendation: 'Operating loss center. Intervention required: Cross-train onto stable client accounts.'
  }
];

export default function WorkforceMaster() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [employees, setEmployees] = useState<Employee[]>(INITIAL_RESOURCES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Determine current active workflow view dynamically from path string
  const activeView = useMemo(() => {
    const path = location.pathname;
    if (path.includes('profit-loss')) return 'PROFIT_LOSS';
    if (path.includes('employees/new')) return 'FORM_NEW';
    if (path.includes('edit')) return 'FORM_EDIT';
    if (id) return 'DETAILS';
    return 'LIST';
  }, [location.pathname, id]);

  const metrics = useMemo(() => {
    const active = employees.length;
    const profitable = employees.filter(e => (e.revenue - e.cost) > 0).length;
    const totalRev = employees.reduce((acc, e) => acc + e.revenue, 0);
    const totalCost = employees.reduce((acc, e) => acc + e.cost, 0);
    return { active, profitable, totalRev, totalCost, margin: totalRev - totalCost };
  }, [employees]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <div className="text-xs font-semibold text-emerald-400 tracking-wider animate-pulse">LOADING SUITE ROUTING LAYOUT...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {activeView === 'LIST' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">Workforce Master Management</h1>
                <p className="text-slate-400 text-sm mt-0.5">Comprehensive grid containing full-scale financial yield records.</p>
              </div>
              <button onClick={() => navigate('/employees/new')} className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all shadow-md">
                <Plus className="w-4 h-4" /> Onboard Employee
              </button>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#0e112a] p-4 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Active Staff</div>
                <div className="text-2xl font-black text-white">{metrics.active}</div>
              </div>
              <div className="bg-[#0e112a] p-4 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Profit Assets</div>
                <div className="text-2xl font-black text-emerald-400">{metrics.profitable}</div>
              </div>
              <div className="bg-[#0e112a] p-4 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Operating Cost</div>
                <div className="text-2xl font-black text-rose-400">${metrics.totalCost.toLocaleString()}</div>
              </div>
              <div className="bg-[#0e112a] p-4 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Net Margin</div>
                <div className="text-2xl font-black text-indigo-400">${metrics.margin.toLocaleString()}</div>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-[#0e112a] border border-white/5 rounded-2xl p-4 shadow-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" placeholder="Search operational roster dynamically..." 
                  className="w-full bg-[#060814] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 outline-none"
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Interactive Data Table */}
            <div className="bg-[#0e112a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0c0e25] border-b border-white/5 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Resource Details</th>
                    <th className="p-4">Primary Mapping</th>
                    <th className="p-4">Client Project</th>
                    <th className="p-4">Margin Profile</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {employees.filter(e => e.first_name.toLowerCase().includes(searchQuery.toLowerCase())).map(emp => (
                    <tr key={emp.id} className="hover:bg-white/[0.01] transition-colors cursor-pointer" onClick={() => navigate(`/employees/${emp.id}`)}>
                      <td className="p-4 font-semibold text-slate-200">{emp.first_name} {emp.last_name}</td>
                      <td className="p-4 text-sm text-slate-400">{emp.designation.title}</td>
                      <td className="p-4"><span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-xs">{emp.project}</span></td>
                      <td className="p-4 font-bold text-emerald-400">${(emp.revenue - emp.cost).toLocaleString()}</td>
                      <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                        <button onClick={() => navigate(`/employees/${emp.id}/edit`)} className="p-2 bg-white/5 text-slate-400 hover:text-emerald-400 rounded-lg"><Edit className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeView === 'DETAILS' && <EmployeeDetailsPanel employees={employees} id={id} onBack={() => navigate('/employees')} />}
        {activeView === 'PROFIT_LOSS' && <ProfitLossAnalyzerView employees={employees} onBack={() => navigate('/employees')} />}
        {(activeView === 'FORM_NEW' || activeView === 'FORM_EDIT') && (
          <EmployeeFormPanel 
            employees={employees} id={id} onBack={() => navigate('/employees')} 
            onSave={(updatedList) => {
              setEmployees(updatedList);
              navigate('/employees');
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// SUB-PANEL: DYNAMIC DETAILS (Mapped seamlessly from route)
// =========================================================
function EmployeeDetailsPanel({ employees, id, onBack }: any) {
  const emp = employees.find((e: any) => e.id === id);
  if (!emp) return <div className="p-6 text-slate-400">Resource identifier mismatch. Profile missing.</div>;

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h2 className="text-xl font-bold text-white">{emp.first_name} {emp.last_name} — System Insight</h2>
          <p className="text-xs text-slate-500">Operational cross-section parameters dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0e112a] border border-white/5 rounded-3xl p-6 shadow-xl grid grid-cols-3 gap-4">
            <div className="p-4 bg-[#0c0e25] rounded-xl text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Revenue</div>
              <div className="text-xl font-black text-emerald-400">${emp.revenue}</div>
            </div>
            <div className="p-4 bg-[#0c0e25] rounded-xl text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Cost</div>
              <div className="text-xl font-black text-rose-400">${emp.cost}</div>
            </div>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
              <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">Net Margin</div>
              <div className="text-xl font-black text-white">${emp.revenue - emp.cost}</div>
            </div>
          </div>

          <div className="bg-[#0e112a] border border-white/5 rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> Structure Mapping</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-[#0c0e25] rounded-xl"><span className="text-xs text-slate-500 block">Team Lead</span><span className="font-semibold text-slate-200">{emp.team_lead}</span></div>
              <div className="p-3 bg-[#0c0e25] rounded-xl"><span className="text-xs text-slate-500 block">Recruiter</span><span className="font-semibold text-slate-200">{emp.recruiter}</span></div>
              <div className="p-3 bg-[#0c0e25] rounded-xl"><span className="text-xs text-slate-500 block">Trainer</span><span className="font-semibold text-slate-200">{emp.trainer}</span></div>
              <div className="p-3 bg-indigo-500/10 rounded-xl"><span className="text-xs text-indigo-400 block">Client Account</span><span className="font-semibold text-white">{emp.project}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0e112a] border border-white/5 rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2"><Cpu className="w-4 h-4 text-purple-400" /> AI Advisor</h3>
            <p className="text-xs text-purple-200 bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl leading-relaxed">{emp.ai_recommendation}</p>
          </div>

          <div className="bg-[#0e112a] border border-white/5 rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold text-slate-200 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Incident Logs</h3>
            {emp.mistakes.length > 0 ? emp.mistakes.map((m: string, i: number) => (
              <div key={i} className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 p-3 rounded-xl">{m}</div>
            )) : <div className="text-xs text-slate-500 text-center py-2">No SLA alignment errors found.</div>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// =========================================================
// SUB-PANEL: DYNAMIC EXECUTIVE P&L INTERFACE
// =========================================================
function ProfitLossAnalyzerView({ employees, onBack }: any) {
  const chartData = employees.map((e: any) => ({ name: e.first_name, Yield: e.revenue, Operation: e.cost }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl"><ArrowLeft className="w-5 h-5" /></button>
        <h2 className="text-xl font-bold text-white">Visual Roster Profitability Analytics</h2>
      </div>

      <div className="bg-[#0e112a] border border-white/5 rounded-3xl p-6 shadow-2xl">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff40" fontSize={11} tickLine={false} />
              <YAxis stroke="#ffffff40" fontSize={11} tickLine={false} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#0e112a', border: '1px solid #ffffff10' }} />
              <Bar dataKey="Yield" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="Operation" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

// =========================================================
// SUB-PANEL: REFACTOR FORM PATTERN (Saves into unified DB)
// =========================================================
function EmployeeFormPanel({ employees, id, onBack, onSave }: any) {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [rev, setRev] = useState(4000);
  const [cst, setCst] = useState(2000);

  useEffect(() => {
    if (id) {
      const match = employees.find((e: any) => e.id === id);
      if (match) {
        setFirst(match.first_name);
        setLast(match.last_name);
        setRev(match.revenue);
        setCst(match.cost);
      }
    }
  }, [id, employees]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!first) return toast.error('First Name required');

    let updatedList;
    if (id) {
      updatedList = employees.map((e: any) => e.id === id ? { ...e, first_name: first, last_name: last, revenue: rev, cost: cst } : e);
      toast.success('Operational metrics synced update successfully!');
    } else {
      const newEmp: Employee = {
        id: String(Date.now()),
        emp_code: `AGS-${1000 + employees.length + 1}`,
        first_name: first,
        last_name: last,
        work_email: `${first.toLowerCase()}@agshealth.com`,
        phone_primary: '+91 9444500000',
        gender: 'Male',
        employment_status: 'Active',
        employment_type: 'Full-Time',
        date_of_joining: '2026-06-18',
        department: DEPARTMENTS[0],
        designation: DESIGNATIONS[0],
        training_performance: 'Medium',
        revenue_status: 'Normal',
        profit_status: (rev - cst) > 2000 ? 'High Profit' : 'Normal Margin',
        revenue: rev,
        cost: cst,
        project: 'AGS-HRM-LMS',
        team_lead: 'Kishore V',
        recruiter: 'Jayachitra P (HR)',
        trainer: 'Ganapathi V',
        mistakes: [],
        courses_completed: ['Enterprise Pipeline Architecture'],
        ai_recommendation: 'Newly onboarded deployment module parameter asset.'
      };
      updatedList = [newEmp, ...employees];
      toast.success('New tactical workforce resource deployed!');
    }
    onSave(updatedList);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto bg-[#0e112a] border border-white/5 rounded-3xl p-6 shadow-2xl">
      <h2 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-3">{id ? 'Modify Roster Matrix' : 'Deploy Advanced Asset'}</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
          <input type="text" className="w-full bg-[#060814] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500" value={first} onChange={e => setFirst(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
          <input type="text" className="w-full bg-[#060814] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500" value={last} onChange={e => setLast(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Revenue ($)</label>
          <input type="number" className="w-full bg-[#060814] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500" value={rev} onChange={e => setRev(Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cost ($)</label>
          <input type="number" className="w-full bg-[#060814] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500" value={cst} onChange={e => setCst(Number(e.target.value))} />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <button type="button" onClick={onBack} className="text-xs font-bold text-slate-400 px-4 py-2">Cancel</button>
          <button type="submit" className="bg-emerald-500 text-black text-xs font-black px-5 py-2.5 rounded-xl flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Commit Data</button>
        </div>
      </form>
    </motion.div>
  );
}