import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, UserCheck, GraduationCap, Building2, TrendingUp, Award, ShieldCheck, IndianRupee, Target, Activity } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';

export default function PerformancePage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const er = await api.get('/employees', { params: { limit: 200 } });
      setEmployees(er.data.data.employees || []);
    } catch {
      toast.error('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hrNames = ['Priya Sharma', 'Rahul Dravid', 'Anita Desai', 'Vikram Singh', 'Kavitha S'];
  const trainers = ['Karthik N', 'Suresh Kumar', 'Deepa M', 'Rajesh V', 'Gowtham R'];
  const cities = ['Chennai', 'Madurai', 'Coimbatore', 'Trichy', 'Salem'];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Excellent': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: Award, glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]' };
      case 'Good': return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: ShieldCheck, glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]' };
      default: return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: TrendingUp, glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]' };
    }
  };

  const mappedData = employees.map((emp) => {
    const hrName = hrNames[emp.id % hrNames.length];
    const trainerName = trainers[(emp.id + 1) % trainers.length];
    const hireCity = emp.city || emp.work_location || cities[emp.id % cities.length];

    // Custom Performance logic: mapping to requested statuses
    const statusVal = emp.id % 10;
    const performanceStatus = statusVal === 0 ? 'Excellent' : (statusVal < 5 ? 'Good' : 'Normal');

    let profit = 0;
    let trainingScore = 0;
    let onFieldStatus = '';

    if (performanceStatus === 'Excellent') {
      profit = 50000 + ((emp.id * 1234) % 50000);
      trainingScore = 90 + (emp.id % 11);
      onFieldStatus = (emp.id % 2 === 0) ? 'Outstanding' : 'Highly Effective';
    } else if (performanceStatus === 'Good') {
      profit = 20000 + ((emp.id * 1234) % 30000);
      trainingScore = 75 + (emp.id % 15);
      onFieldStatus = (emp.id % 2 === 0) ? 'Steady Progress' : 'Meeting Goals';
    } else {
      profit = 5000 + ((emp.id * 1234) % 15000);
      trainingScore = 60 + (emp.id % 15);
      onFieldStatus = (emp.id % 2 === 0) ? 'Needs Support' : 'Learning Phase';
    }

    return {
      ...emp,
      hrName,
      trainerName,
      hireCity,
      performanceStatus,
      profit,
      trainingScore,
      onFieldStatus
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredData = mappedData.filter(emp => {
    const matchesSearch = `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.emp_code && emp.emp_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      emp.hireCity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? emp.performanceStatus === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Performance Tracking"

      />

      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0e112a] p-4 rounded-2xl border border-white/5 shadow-lg gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or city..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setStatusFilter(null); // Automatically clear the performance filter when searching
            }}
            className="input-field pl-10 w-full bg-[#151936] border-white/10 text-sm placeholder:text-slate-500 focus:border-primary/50 transition-all duration-300"
          />
        </div>

        {/* Quick Stats Summary */}
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div
            onClick={() => setStatusFilter(statusFilter === 'Excellent' ? null : 'Excellent')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border whitespace-nowrap cursor-pointer transition-all duration-300 ${statusFilter === 'Excellent'
                ? 'bg-emerald-500/20 border-emerald-400 ring-1 ring-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">
              Excellent: {mappedData.filter(d => d.performanceStatus === 'Excellent').length}
              <span className="opacity-80 ml-1">({formatCurrency(mappedData.filter(d => d.performanceStatus === 'Excellent').reduce((acc, curr) => acc + curr.profit, 0))})</span>
            </span>
          </div>
          <div
            onClick={() => setStatusFilter(statusFilter === 'Good' ? null : 'Good')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border whitespace-nowrap cursor-pointer transition-all duration-300 ${statusFilter === 'Good'
                ? 'bg-blue-500/20 border-blue-400 ring-1 ring-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                : 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20'
              }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">
              Good: {mappedData.filter(d => d.performanceStatus === 'Good').length}
              <span className="opacity-80 ml-1">({formatCurrency(mappedData.filter(d => d.performanceStatus === 'Good').reduce((acc, curr) => acc + curr.profit, 0))})</span>
            </span>
          </div>
          <div
            onClick={() => setStatusFilter(statusFilter === 'Normal' ? null : 'Normal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border whitespace-nowrap cursor-pointer transition-all duration-300 ${statusFilter === 'Normal'
                ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20'
              }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">
              Normal: {mappedData.filter(d => d.performanceStatus === 'Normal').length}
              <span className="opacity-80 ml-1">({formatCurrency(mappedData.filter(d => d.performanceStatus === 'Normal').reduce((acc, curr) => acc + curr.profit, 0))})</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#0e112a] rounded-2xl p-5 border border-white/5 h-[280px] animate-pulse flex flex-col justify-between"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-white/5 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="h-10 bg-white/5 rounded-lg w-full" />
                  <div className="h-10 bg-white/5 rounded-lg w-full" />
                </div>
              </motion.div>
            ))
          ) : filteredData.length > 0 ? (
            filteredData.map((emp, idx) => {
              const statusConfig = getStatusConfig(emp.performanceStatus);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={emp.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.3), layout: { duration: 0.3 } }}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="group relative bg-[#0e112a] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl"
                >
                  {/* Decorative background gradient */}
                  <div className={`absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl rounded-full transition-colors duration-500 ${statusConfig.bg.split('/')[0]}`} />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-3">
                      {emp.avatar_url ? (
                        <img src={emp.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white/10 shadow-md" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-lg shadow-md">
                          {emp.first_name?.[0]}{emp.last_name?.[0]}
                        </div>
                      )}
                      <div>
                        <h3 className="text-slate-100 font-semibold truncate max-w-[150px]">{emp.first_name} {emp.last_name}</h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{emp.emp_code}</p>
                      </div>
                    </div>

                    <div className={`flex flex-col items-end gap-1 ${statusConfig.glow}`}>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} flex items-center gap-1.5 backdrop-blur-sm`}>
                        <StatusIcon className="w-3 h-3" />
                        {emp.performanceStatus}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 relative z-10">

                    <div className="bg-[#151936]/50 p-3 rounded-xl border border-white/[0.02] hover:bg-[#151936] transition-colors">
                      <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">Joining Date</span>
                      </div>
                      <p className="text-sm text-slate-200 font-semibold">{emp.date_of_joining ? new Date(emp.date_of_joining).toLocaleDateString('en-IN') : 'N/A'}</p>
                    </div>

                    <div className="bg-[#151936]/50 p-3 rounded-xl border border-white/[0.02] hover:bg-[#151936] transition-colors">
                      <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">Hire City</span>
                      </div>
                      <p className="text-sm text-slate-200 font-semibold truncate" title={emp.hireCity}>{emp.hireCity}</p>
                    </div>

                    <div className="bg-[#151936]/50 p-3 rounded-xl border border-white/[0.02] hover:bg-[#151936] transition-colors">
                      <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">HR Selected By</span>
                      </div>
                      <p className="text-sm text-slate-200 font-semibold truncate" title={emp.hrName}>{emp.hrName}</p>
                    </div>

                    <div className="bg-[#151936]/50 p-3 rounded-xl border border-white/[0.02] hover:bg-[#151936] transition-colors">
                      <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">Training Mentor</span>
                      </div>
                      <p className="text-sm text-slate-200 font-semibold truncate" title={emp.trainerName}>{emp.trainerName}</p>
                    </div>

                    <div className="bg-[#151936]/50 p-3 rounded-xl border border-white/[0.02] hover:bg-[#151936] transition-colors">
                      <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">Profit Generated</span>
                      </div>
                      <p className="text-sm text-emerald-400 font-semibold truncate">{formatCurrency(emp.profit)}</p>
                    </div>

                    <div className="bg-[#151936]/50 p-3 rounded-xl border border-white/[0.02] hover:bg-[#151936] transition-colors">
                      <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                        <Target className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">Training Score</span>
                      </div>
                      <p className="text-sm text-slate-200 font-semibold truncate">{emp.trainingScore}%</p>
                    </div>

                    <div className="bg-[#151936]/50 p-3 rounded-xl border border-white/[0.02] hover:bg-[#151936] transition-colors">
                      <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">On-Field Work</span>
                      </div>
                      <p className="text-sm text-slate-200 font-semibold truncate">{emp.onFieldStatus}</p>
                    </div>

                    <div className="col-span-2 bg-[#151936]/50 p-3 rounded-xl border border-white/[0.02] hover:bg-[#151936] transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">Current Dept</span>
                      </div>
                      <p className="text-sm text-slate-200 font-semibold bg-white/5 px-2 py-0.5 rounded-md">
                        {emp.department?.name || 'Unassigned'}
                      </p>
                    </div>

                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-[#0e112a] rounded-2xl border border-white/5"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-slate-200 font-semibold text-lg">No records found</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-sm">
                We couldn't find any employees matching your search criteria. Try adjusting your filters.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
