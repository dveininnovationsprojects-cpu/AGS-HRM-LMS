import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface LeakageCategory {
  id: string;
  name: string;
  amount: number;
  pct: number;
  why: string;
  resources: { id: number; name: string; dept: string; cost: number; avatar?: string }[];
  resolutionText: string;
  actionLabel: string;
  resolvedSavingPct: number;
}

export default function LeakagePage() {
  const navigate = useNavigate();

  // Initial Leakage Categories (Workforce Wastages)
  const [categories, setCategories] = useState<LeakageCategory[]>([
    {
      id: 'bench',
      name: 'Unbillable Bench & Support Cost',
      amount: 120000,
      pct: 56,
      why: 'Delay in transitioning active employees to billable client contracts post-onboarding. Skill profiles do not match current pipeline requirements, resulting in idle payroll costs.',
      resources: [
        { id: 1, name: 'Anand Kumar', dept: 'Operations', cost: 5900, avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
        { id: 2, name: 'Elango M', dept: 'Operations', cost: 9500, avatar: 'https://randomuser.me/api/portraits/men/16.jpg' },
        { id: 3, name: 'Ganesh Prabhu', dept: 'IT', cost: 15400, avatar: 'https://randomuser.me/api/portraits/men/20.jpg' }
      ],
      resolutionText: 'Reallocate resources to active billing slots or assign short-term billable delivery assignments.',
      actionLabel: 'Reallocate Bench Resources',
      resolvedSavingPct: 45
    },
    {
      id: 'training',
      name: 'Training & Skill Mismatch Churn',
      amount: 45000,
      pct: 21,
      why: 'Training expenses incurred for resources who fail specialized assessments or leave the organization during onboarding due to insufficient mentorship and high course complexity.',
      resources: [
        { id: 4, name: 'Charles Dev', dept: 'IT', cost: 10600, avatar: 'https://randomuser.me/api/portraits/men/17.jpg' },
        { id: 5, name: 'Jaya Ram', dept: 'Operations', cost: 5000, avatar: 'https://randomuser.me/api/portraits/women/21.jpg' }
      ],
      resolutionText: 'Deploy a senior buddy system and divide training modules into progressive milestones with micro-tests.',
      actionLabel: 'Approve Buddy Program Budget',
      resolvedSavingPct: 35
    },
    {
      id: 'sla',
      name: 'SLA Gaps & Deductions',
      amount: 18000,
      pct: 9,
      why: 'Direct penalty fees billed by clients due to claim coding mistakes, processing delays, and SLA metrics failures. Driven by lack of senior oversight on high-risk employee files.',
      resources: [
        { id: 3, name: 'Ganesh Prabhu', dept: 'IT', cost: 15400, avatar: 'https://randomuser.me/api/portraits/men/20.jpg' }
      ],
      resolutionText: 'Setup senior supervisor claim audits and automated validation alerts before billing submittals.',
      actionLabel: 'Activate Senior Supervisor Audits',
      resolvedSavingPct: 60
    },
    {
      id: 'recruitment',
      name: 'Early Attrition Recruitment Fees',
      amount: 30000,
      pct: 14,
      why: 'Agency placement fees and search costs sunk into employees who resign or are terminated within 90 days of onboarding due to expectations mismatch.',
      resources: [
        { id: 2, name: 'Elango M', dept: 'Operations', cost: 9500, avatar: 'https://randomuser.me/api/portraits/men/16.jpg' },
        { id: 5, name: 'Jaya Ram', dept: 'Operations', cost: 5000, avatar: 'https://randomuser.me/api/portraits/women/21.jpg' }
      ],
      resolutionText: 'Revise sourcing profiles to align with department expectations and implement early alignment interviews.',
      actionLabel: 'Reform Recruitment Sourcing Profile',
      resolvedSavingPct: 30
    }
  ]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('bench');
  const [resolvedStatus, setResolvedStatus] = useState<Record<string, boolean>>({});

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || categories[0];

  const handleResolveAction = (catId: string, name: string, savingPct: number, amt: number) => {
    if (resolvedStatus[catId]) return;

    setResolvedStatus(prev => ({ ...prev, [catId]: true }));
    
    // Calculate simulated savings
    const savings = Math.round(amt * (savingPct / 100));

    // Update categories state locally to simulate actual wastage reduction
    setCategories(prev => prev.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          amount: c.amount - savings
        };
      }
      return c;
    }));

    toast.success(`Efficiency Resolution Activated: Saved $${savings.toLocaleString()}!`, {
      style: {
        background: '#0e112a',
        color: '#fff',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }
    });
  };

  // Recalculate total monthly leakage
  const totalMonthlyLeakage = categories.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Cost Leakage Diagnostics</h1>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
          OPERATIONAL EFFICIENCY ANALYZER
        </span>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0e112a] rounded-2xl shadow-card p-5">
          <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Total Monthly Leakage</div>
          <div className="text-2xl font-black text-rose-400 mt-1.5">${totalMonthlyLeakage.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Operational Sunk Cost</div>
        </div>
        
        <div className="bg-[#0e112a] rounded-2xl shadow-card p-5">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Major Leakage Area</div>
          <div className="text-lg font-black text-slate-200 mt-1.5">Unbillable Bench Hours</div>
          <div className="text-xs text-slate-400 mt-1">Cost contribution: 56%</div>
        </div>

        <div className="bg-[#0e112a] rounded-2xl shadow-card p-5">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Average Mitigation Rate</div>
          <div className="text-lg font-black text-emerald-400 mt-1.5">42.5% reduction</div>
          <div className="text-xs text-slate-400 mt-1">Active resolution potential</div>
        </div>

        <div className="bg-[#0e112a] rounded-2xl shadow-card p-5">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Impacted Pool</div>
          <div className="text-lg font-black text-slate-200 mt-1.5">8 employees</div>
          <div className="text-xs text-slate-400 mt-1">Requires alignment optimization</div>
        </div>
      </div>

      {/* Visual Chart Section */}
      <div className="bg-[#0e112a] rounded-2xl shadow-card p-5">
        <h3 className="font-semibold text-slate-200 text-sm mb-4">
          Cost Leakage Distribution Index
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Custom SVG Bar Chart */}
          <div className="md:col-span-2 bg-[#0c0e25]/60 p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-slate-400">Total Monthly Cost Impact per Category</span>
              <span className="text-[10px] text-slate-500">Scale: USD</span>
            </div>
            
            {/* Visual SVG representation */}
            <div className="space-y-4">
              {categories.map((c) => {
                const widthPct = totalMonthlyLeakage > 0 ? (c.amount / 120000) * 100 : 0;
                const isSelected = c.id === selectedCategoryId;
                return (
                  <div 
                    key={c.id} 
                    onClick={() => setSelectedCategoryId(c.id)}
                    className={`group cursor-pointer p-2.5 rounded-xl transition-all ${
                      isSelected ? 'bg-indigo-500/10 border border-indigo-500/25' : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className={isSelected ? 'text-indigo-300' : 'text-slate-300'}>{c.name}</span>
                      <span className={isSelected ? 'text-indigo-400 font-bold' : 'text-slate-400'}>
                        ${c.amount.toLocaleString()} ({c.pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSelected ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-rose-500 group-hover:bg-rose-400'
                        }`} 
                        style={{ width: `${Math.min(100, widthPct)}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Analytics Card */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-[#0c0e25]/80 p-5 rounded-2xl border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency Insight</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                By targeting cost centers like bench alignment and onboarding support buddys, the system simulates an annual overhead savings of over <strong>$90,000</strong>.
              </p>
              <div className="border-t border-white/5 pt-3">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Mitigation status</span>
                <span className="text-sm font-extrabold text-emerald-400 mt-1 block">Active Auditing Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Diagnostics Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Side: Diagnostics Details */}
        <div className="lg:col-span-2 bg-[#0e112a] rounded-2xl shadow-card p-5 space-y-5">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-semibold text-slate-200 text-sm">Root Cause Diagnostics</h3>
            <p className="text-xs text-indigo-300 mt-0.5">{selectedCategory.name}</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Root Cause Summary</span>
              <p className="text-slate-300 leading-relaxed mt-1">{selectedCategory.why}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Operational Resolution Action Plan</span>
              <p className="text-slate-300 leading-relaxed mt-1">{selectedCategory.resolutionText}</p>
            </div>

            <div className="bg-[#0c0e25]/80 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-300">Diagnostics Resolution Simulator</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Simulate cost reduction on this leakage point</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-[9px] font-black text-indigo-400 uppercase">Interactive</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mt-4">
                <div className="text-xs">
                  <div className="text-slate-400">Potential Savings: <span className="font-bold text-emerald-400">{selectedCategory.resolvedSavingPct}%</span></div>
                  <div className="text-slate-400 mt-0.5">Estimated Turnaround: <span className="font-bold text-white">${Math.round(selectedCategory.amount * (selectedCategory.resolvedSavingPct / 100)).toLocaleString()}</span></div>
                </div>

                {!resolvedStatus[selectedCategory.id] ? (
                  <button
                    onClick={() => handleResolveAction(selectedCategory.id, selectedCategory.name, selectedCategory.resolvedSavingPct, selectedCategory.amount)}
                    className="btn-primary py-2 px-4 text-xs font-bold rounded-lg shadow-md"
                  >
                    {selectedCategory.actionLabel}
                  </button>
                ) : (
                  <div className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-bold py-2 px-4 rounded-lg text-center">
                    ✓ Resolution Plan Active
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Impacted Employees List */}
        <div className="lg:col-span-1 bg-[#0e112a] rounded-2xl shadow-card p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-semibold text-slate-200 text-sm">Impacted Resources Pool</h3>
              <p className="text-xs text-slate-400 mt-0.5">Employees tied to this cost leakage</p>
            </div>

            <div className="space-y-2">
              {selectedCategory.resources.map((emp) => (
                <div 
                  key={emp.id}
                  className="p-3 bg-[#0c0e25]/60 rounded-xl border border-white/5 flex items-center justify-between hover:bg-[#0c0e25] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {emp.avatar ? (
                      <img src={emp.avatar} className="w-8 h-8 rounded-lg object-cover border border-white/10" alt="" />
                    ) : (
                      <div className="w-8 h-8 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                        {emp.name?.[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{emp.name}</div>
                      <div className="text-[10px] text-slate-500">{emp.dept} department</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-rose-400">${emp.cost.toLocaleString()}/mo</div>
                    <button 
                      onClick={() => navigate(`/employees/${emp.id}`)}
                      className="text-[10px] text-indigo-400 hover:underline mt-0.5 block"
                    >
                      View DNA Card
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-500 leading-normal">
              Click on any employee above to view their full lifecycle logs and competency dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
