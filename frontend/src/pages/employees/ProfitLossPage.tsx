import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import toast from 'react-hot-toast';

export default function ProfitLossPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'profitable' | 'loss'>('profitable');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  
  // Interactive Simulation States
  const [selectedProjectSim, setSelectedProjectSim] = useState('Operations Core');
  const [assignedMentors, setAssignedMentors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setLoading(true);
    api.get('/analytics/executive')
      .then(res => {
        setEmployees(res.data.data.employeeProfitability || []);
      })
      .catch(() => toast.error('Failed to load employee profitability data'))
      .finally(() => setLoading(false));
  }, []);

  // Reset page and selection when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  // Split into categories
  const profitableEmployees = employees.filter((e: any) => e.profit > 0);
  const lossEmployees = employees.filter((e: any) => e.profit <= 0);

  // Filter based on active tab and search query
  const targetList = activeTab === 'profitable' ? profitableEmployees : lossEmployees;
  
  const filteredList = targetList.filter((e: any) => {
    const s = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(s) ||
      e.dept.toLowerCase().includes(s) ||
      e.project.toLowerCase().includes(s) ||
      e.tl.toLowerCase().includes(s) ||
      (e.profit_status && e.profit_status.toLowerCase().includes(s))
    );
  });

  const itemsPerPage = 10;
  const paginatedEmployees = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Totals calculations
  const totalProfit = profitableEmployees.reduce((sum: number, e: any) => sum + e.profit, 0);
  const totalLoss = Math.abs(lossEmployees.reduce((sum: number, e: any) => sum + e.profit, 0));
  const netMargin = totalProfit - totalLoss;

  // Department contribution percentages
  const deptProfits: Record<string, number> = {};
  profitableEmployees.forEach(e => {
    deptProfits[e.dept] = (deptProfits[e.dept] || 0) + e.profit;
  });
  const totalDeptProfits = Object.values(deptProfits).reduce((a, b) => a + b, 0) || 1;

  const deptLosses: Record<string, number> = {};
  lossEmployees.forEach(e => {
    deptLosses[e.dept] = (deptLosses[e.dept] || 0) + Math.abs(e.profit);
  });
  const totalDeptLosses = Object.values(deptLosses).reduce((a, b) => a + b, 0) || 1;

  // Simulated project details
  const projectRates: Record<string, number> = {
    'Operations Core': 18000,
    'Cloud Infrastructure': 24000,
    'Enterprise Delivery': 30000
  };

  const handleApproveAllocation = (empId: number) => {
    const rate = projectRates[selectedProjectSim];
    
    // Update local state to simulate live database assignment
    setEmployees(prev => prev.map(emp => {
      if (emp.id === empId) {
        const updatedCost = emp.cost;
        const updatedRevenue = rate;
        const updatedProfit = updatedRevenue - updatedCost;
        const updatedStatus = updatedProfit > 0 ? 'High Profit' : 'Normal Margin';
        
        const updatedEmp = {
          ...emp,
          project: selectedProjectSim,
          revenue: updatedRevenue,
          profit: updatedProfit,
          profit_status: updatedStatus
        };
        
        // Update selected employee reference if it's currently selected
        if (selectedEmployee && selectedEmployee.id === empId) {
          setSelectedEmployee(updatedEmp);
        }
        
        return updatedEmp;
      }
      return emp;
    }));

    toast.success(`Client Allocation Approved: Moved to ${selectedProjectSim}!`, {
      style: {
        background: '#0e112a',
        color: '#fff',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }
    });
  };

  const columns = [
    { 
      header: 'Employee', 
      accessor: (r: any) => (
        <div className="flex items-center gap-2.5">
          {r.avatar ? (
            <img src={r.avatar} className="w-7 h-7 rounded-lg object-cover" alt="" />
          ) : (
            <div className="w-7 h-7 bg-[#0c0e25] text-indigo-400 rounded-lg flex items-center justify-center text-[10px] font-bold">
              {r.name?.[0]}
            </div>
          )}
          <div>
            <span className="font-semibold text-slate-200">{r.name}</span>
            {['Resigned', 'Terminated'].includes(r.status) && (
              <div className="text-[10px] text-rose-400 font-medium leading-none mt-0.5">
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
      header: 'Training Performance',
      accessor: (r: any) => {
        const perf = r.training_performance || 'Medium';
        const style = perf === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400' :
                      perf === 'Poor' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-blue-500/10 text-blue-400';
        return <span className={`badge ${style} text-[10px]`}>{perf}</span>;
      }
    },
    { header: 'Monthly Revenue', accessor: (r: any) => `$${r.revenue.toLocaleString()}` },
    { header: 'Monthly Cost', accessor: (r: any) => `$${r.cost.toLocaleString()}` },
    { 
      header: 'Net Margin', 
      accessor: (r: any) => {
        const diff = r.profit;
        return (
          <span className={`font-semibold ${diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            {diff > 0 ? '+' : ''}${diff.toLocaleString()}
          </span>
        );
      }
    },
    { 
      header: 'Profit Status', 
      accessor: (r: any) => {
        const prof = r.profit_status || 'Cost Center';
        const style = prof.includes('Profit') ? 'bg-emerald-500/10 text-emerald-400' :
                      prof.includes('Loss') ? 'bg-rose-500/10 text-rose-400' :
                      prof.includes('Margin') ? 'bg-blue-500/10 text-blue-400' :
                      'bg-slate-500/10 text-slate-400';
        return <span className={`badge ${style} text-[10px]`}>{prof}</span>;
      }
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0e112a] rounded-2xl shadow-card p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Profitable Assets</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{profitableEmployees.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">Active Value Generators</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-[#0e112a] rounded-2xl shadow-card p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Loss & Cost Centers</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{lossEmployees.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">Bench & Non-Billable Support</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0e112a] rounded-2xl shadow-card p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Net Monthly Contribution</span>
          </div>
          <div className={`text-2xl font-bold ${netMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netMargin >= 0 ? '+' : '-'}${Math.abs(netMargin).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Total Optimized Net Margin</div>
        </motion.div>
      </div>

      {/* Executive P&L Insights Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Profit Drivers Card */}
        <div className="bg-[#0e112a] rounded-2xl shadow-card p-5">
          <h3 className="font-semibold text-slate-200 text-sm mb-4">
            Corporate Profit Drivers (Yield Optimization)
          </h3>
          <div className="space-y-4">
            {Object.entries(deptProfits).map(([dept, val]) => {
              const pct = Math.round((val / totalDeptProfits) * 100);
              return (
                <div key={dept}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{dept} Department Yield:</span>
                    <span className="font-bold text-slate-200">{pct}% of Net Profit</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            
            <div className="bg-[#0c0e25]/60 p-3.5 rounded-xl space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Top Performing Asset Contributors</span>
              <div className="space-y-1">
                {profitableEmployees.slice(0, 3).map((e: any) => (
                  <div key={e.id} className="flex justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{e.name} ({e.dept})</span>
                    <span className="text-emerald-400 font-bold">+${e.profit.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed italic bg-emerald-500/5 p-2.5 rounded-xl">
              Why: High revenue yields are generated by allocating key resources directly to premium billable client systems and encouraging the completion of advanced training programs.
            </p>
          </div>
        </div>

        {/* Cost Leakage & Loss Areas Card */}
        <div className="bg-[#0e112a] rounded-2xl shadow-card p-5">
          <h3 className="font-semibold text-slate-200 text-sm mb-4">
            Corporate Cost Leakages (Risk Mitigation)
          </h3>
          <div className="space-y-4">
            {Object.entries(deptLosses).map(([dept, val]) => {
              const pct = Math.round((val / totalDeptLosses) * 100);
              return (
                <div key={dept}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{dept} Department Deficits:</span>
                    <span className="font-bold text-slate-200">{pct}% of Net Deficit</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            
            <div className="bg-[#0c0e25]/60 p-3.5 rounded-xl space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider">Unassigned Cost Center Instances</span>
              <div className="space-y-1">
                {lossEmployees.slice(0, 3).map((e: any) => (
                  <div key={e.id} className="flex justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{e.name} ({e.dept})</span>
                    <span className="text-rose-400 font-bold">-${Math.abs(e.profit).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed italic bg-rose-500/5 p-2.5 rounded-xl">
              Why: Cost leakage is primarily due to unassigned resources sitting on the bench, incurring operating salary costs without corresponding client-billing contracts.
            </p>
          </div>
        </div>
      </div>

      {/* Main Ledger Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Side: Ledger */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#0e112a] p-4 rounded-2xl shadow-card">
            {/* Toggleable Tabs */}
            <div className="flex gap-1 bg-[#0c0e25] p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('profitable')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'profitable' ? 'bg-primary text-[#060814] shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Profitable Assets ({profitableEmployees.length})
              </button>
              <button 
                onClick={() => setActiveTab('loss')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'loss' ? 'bg-rose-500/20 text-rose-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Loss & Cost Centers ({lossEmployees.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search by name, project, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field px-4"
              />
            </div>
          </div>

          {/* Table Ledger */}
          <div className="bg-[#0e112a] rounded-2xl shadow-card p-5">
            <DataTable
              columns={columns}
              data={paginatedEmployees}
              onRowClick={(row) => setSelectedEmployee(row)}
              pagination={{
                page: currentPage,
                totalPages: Math.ceil(filteredList.length / itemsPerPage),
                onPageChange: (p) => setCurrentPage(p),
              }}
              emptyText={activeTab === 'profitable' ? 'No profitable employee records found.' : 'No loss or cost support employees found.'}
            />
          </div>
        </div>

        {/* Right Side: Interactive Dossier */}
        <div className="lg:col-span-1">
          <div className="bg-[#0e112a] rounded-2xl shadow-card p-5 h-full flex flex-col justify-between">
            {selectedEmployee ? (
              <div className="space-y-5">
                {/* Selected Employee Header */}
                <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                  {selectedEmployee.avatar ? (
                    <img src={selectedEmployee.avatar} className="w-12 h-12 rounded-xl object-cover" alt="" />
                  ) : (
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-lg font-bold">
                      {selectedEmployee.name?.[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-black text-slate-200 text-base leading-snug">{selectedEmployee.name}</h3>
                    <p className="text-xs text-indigo-300">{selectedEmployee.dept} · {selectedEmployee.project}</p>
                  </div>
                </div>

                {/* Profitability Cost Analysis (Profitability Engine) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Profitability Engine & Cost Analysis
                  </h4>
                  <div className="bg-[#0c0e25]/60 p-3.5 rounded-xl space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Recruitment Cost:</span>
                      <span className="font-semibold text-slate-200">${Math.round(selectedEmployee.cost * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Training & Mentorship:</span>
                      <span className="font-semibold text-slate-200">${Math.round(selectedEmployee.cost * 0.10).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Salary & Operations:</span>
                      <span className="font-semibold text-slate-200">${Math.round(selectedEmployee.cost * 0.85).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/5 pt-2 flex justify-between font-bold">
                      <span className="text-slate-300">Total Cost incurred:</span>
                      <span className="text-slate-200">${selectedEmployee.cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-300">Revenue Generated:</span>
                      <span className="text-emerald-400">${selectedEmployee.revenue.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/5 pt-2 flex justify-between font-extrabold text-sm">
                      <span className="text-slate-200">Net Profit / Loss:</span>
                      <span className={selectedEmployee.profit > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {selectedEmployee.profit > 0 ? '+' : ''}${selectedEmployee.profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Sourcing & Performance Analysis */}
                <div className="space-y-2 text-xs">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Financial Performance Analysis
                  </h4>
                  <div className="bg-[#0c0e25]/60 p-3.5 rounded-xl space-y-2 text-slate-300 leading-relaxed text-[11px]">
                    {selectedEmployee.profit > 0 ? (
                      <div>
                        <strong>Revenue Growth Factors:</strong>
                        <ul className="list-disc pl-4 mt-1 space-y-1">
                          <li>Assigned directly to high-margin client billing: {selectedEmployee.project}.</li>
                          <li>Competency level validated as {selectedEmployee.training_performance || 'Optimal'} training performance.</li>
                          <li>Operational cost overhead restricted below 50% of revenue.</li>
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <strong>Cost Leakage Factors:</strong>
                        <ul className="list-disc pl-4 mt-1 space-y-1 text-rose-300/90">
                          <li>Allocated to support bench, generating zero direct client-contract revenue.</li>
                          <li>Fixed salary and mentorship overhead ($ {selectedEmployee.cost.toLocaleString()}/mo) active without billing offsets.</li>
                          <li>Recruitment and initial training expenses are currently not amortized.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interactive Revenue Optimization Simulator */}
                {selectedEmployee.profit <= 0 && (
                  <div className="space-y-3 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                    <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                      Revenue Simulation Engine
                    </h4>
                    <div className="space-y-2 text-xs">
                      <label className="text-slate-400 block text-[10px]">Simulate Project Allocation:</label>
                      <select 
                        value={selectedProjectSim} 
                        onChange={(e) => setSelectedProjectSim(e.target.value)}
                        className="w-full bg-[#0c0e25] text-slate-200 border border-white/10 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                      >
                        <option value="Operations Core">Operations Core (Yield: +$18,000/mo)</option>
                        <option value="Cloud Infrastructure">Cloud Infrastructure (Yield: +$24,000/mo)</option>
                        <option value="Enterprise Delivery">Enterprise Delivery (Yield: +$30,000/mo)</option>
                      </select>
                      
                      <div className="bg-[#060814]/70 p-2.5 rounded-lg space-y-1.5 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Simulated Net Margin:</span>
                          <span className="text-emerald-400 font-bold">+${(projectRates[selectedProjectSim] - selectedEmployee.cost).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Revenue Turnaround:</span>
                          <span className="text-emerald-400 font-semibold">+${(projectRates[selectedProjectSim] - selectedEmployee.profit).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleApproveAllocation(selectedEmployee.id)}
                        className="w-full btn-primary py-2 text-xs font-black rounded-lg"
                      >
                        Approve Allocation & Activate Profit
                      </button>
                    </div>
                  </div>
                )}

                {/* Pre-emptive Risk and Action Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Performance Risk Assessment
                  </h4>
                  
                  {(() => {
                    const isMentorAssigned = assignedMentors[selectedEmployee.id];
                    let riskScore = 8;
                    if (selectedEmployee.training_performance === 'Poor') riskScore = 60;
                    else if (selectedEmployee.training_performance === 'Medium') riskScore = 30;
                    
                    if (selectedEmployee.project === 'Bench' || selectedEmployee.project?.includes('Support')) riskScore += 25;
                    if (selectedEmployee.profit <= 0) riskScore += 10;
                    riskScore = Math.min(95, riskScore);

                    if (isMentorAssigned) riskScore = 12;

                    const meterColor = riskScore > 65 ? 'text-rose-400' : riskScore > 35 ? 'text-amber-400' : 'text-emerald-400';
                    const meterBg = riskScore > 65 ? 'bg-rose-500/10 text-rose-300' : riskScore > 35 ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300';

                    return (
                      <div className="space-y-3">
                        <div className={`p-3 rounded-xl flex items-center justify-between ${meterBg}`}>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400">Underperformance Risk</div>
                            <div className={`text-lg font-black mt-0.5 ${meterColor}`}>{riskScore}%</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            riskScore > 65 ? 'bg-rose-500/20 text-rose-300' :
                            riskScore > 35 ? 'bg-amber-500/20 text-amber-300' :
                            'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {riskScore > 65 ? 'High Risk' : riskScore > 35 ? 'Medium Risk' : 'Low Risk'}
                          </span>
                        </div>

                        {riskScore > 30 && !isMentorAssigned && (
                          <button
                            onClick={() => {
                              setAssignedMentors(prev => ({ ...prev, [selectedEmployee.id]: true }));
                              toast.success(`Mentor buddy assigned to ${selectedEmployee.name}!`, {
                                style: { background: '#0e112a', color: '#fff', border: '1px solid rgba(16, 185, 129, 0.2)' }
                              });
                            }}
                            className="w-full btn-secondary text-xs py-2 rounded-xl border border-indigo-500/25 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-300 flex items-center justify-center gap-1.5 font-bold transition-all"
                          >
                            Assign Mentor Proactively
                          </button>
                        )}
                        {isMentorAssigned && (
                          <div className="w-full text-center text-xs py-2 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold border border-emerald-500/25">
                            Mentor Buddy Active - Risk Mitigated
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div className="pt-2 border-t border-white/5 space-y-2">
                  <p className="text-[10px] text-slate-500 text-center leading-normal">
                    To evaluate comprehensive lifecycle logs, training achievements, and unique banking credentials:
                  </p>
                  <button
                    onClick={() => navigate(`/employees/${selectedEmployee.id}`)}
                    className="w-full btn-primary py-2 text-xs font-black rounded-xl"
                  >
                    View DNA Card
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-4 my-auto">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center font-bold text-lg">
                  $
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">Talent Profitability Analyzer</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                    Select an employee in the ledger table on the left to activate the Profitability Engine and view detailed revenue optimization reasons.
                  </p>
                </div>
                
                {/* Highlighted high risk employee */}
                {(() => {
                  const highestRiskEmp = employees.find((e: any) => e.training_performance === 'Poor');
                  if (!highestRiskEmp) return null;
                  return (
                    <div 
                      onClick={() => setSelectedEmployee(highestRiskEmp)}
                      className="mt-4 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl cursor-pointer hover:bg-rose-500/10 transition-colors text-left w-full space-y-1.5"
                    >
                      <div className="text-[9px] uppercase font-extrabold text-rose-400 tracking-wider">Action Required</div>
                      <div className="text-xs font-semibold text-slate-200">{highestRiskEmp.name} (Bench Support Loss)</div>
                      <div className="text-[10px] text-slate-400">Click to analyze profit turnaround.</div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
