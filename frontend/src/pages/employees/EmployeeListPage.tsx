import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Download } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import CustomSelect from '../../components/ui/CustomSelect';
import toast from 'react-hot-toast';
import { COUNTRIES, STATES_BY_COUNTRY, BRANCH_DATA } from '../../data/branchData';

interface Employee {
  id: number;
  emp_code: string;
  first_name: string;
  last_name: string;
  work_email: string;
  employment_status: string;
  employment_type: string;
  date_of_joining: string;
  department?: { name: string };
  designation?: { title: string };
  avatar?: string;
  training_performance?: string;
  revenue_status?: string;
  profit_status?: string;
  leaving_reason?: string;
  date_of_leaving?: string;
  revenue?: number;
  cost?: number;
}

const statusStyle: Record<string, string> = {
  Active: 'status-active',
  Inactive: 'status-inactive',
  Resigned: 'status-resigned',
  Terminated: 'status-rejected',
  'On-Leave': 'status-pending',
};

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [trainingPerformance, setTrainingPerformance] = useState('');
  const [revenueStatus, setRevenueStatus] = useState('');
  const [profitStatus, setProfitStatus] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [branch, setBranch] = useState('');

  const fetchEmployees = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/employees', { 
        params: { 
          page, 
          limit: 15, 
          search, 
          status,
          training_performance: trainingPerformance,
          revenue_status: revenueStatus,
          profit_status: profitStatus,
          country,
          state,
          branch
        } 
      });
      setEmployees(res.data.data.employees || []);
      setPagination(res.data.data.pagination || { page: 1, totalPages: 1 });
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, [search, status, trainingPerformance, revenueStatus, profitStatus, country, state, branch]);

  const columns = [
    { header: 'Emp Code', accessor: 'emp_code' as keyof Employee },
    {
      header: 'Name',
      accessor: (row: Employee) => (
        <div className="flex items-center gap-3">
          {row.avatar ? (
            <img src={row.avatar} className="w-8 h-8 rounded-lg object-cover border border-white/10" alt="" />
          ) : (
            <div className="w-8 h-8 bg-primary/10 border border-primary/20 text-primary rounded-lg flex items-center justify-center text-xs font-bold font-mono">
              {row.first_name?.[0]}{row.last_name?.[0]}
            </div>
          )}
          <div>
            <div className="font-medium text-slate-200">{row.first_name} {row.last_name}</div>
            <div className="text-xs text-slate-400">{row.work_email}</div>
          </div>
        </div>
      ),
    },
    { header: 'Department', accessor: (row: Employee) => row.department?.name || '-' },
    { header: 'Designation', accessor: (row: Employee) => row.designation?.title || '-' },
    {
      header: 'Country',
      accessor: (row: any) => (
        <span className="font-semibold text-slate-200">{row.work_country || '-'}</span>
      )
    },
    {
      header: 'Branch',
      accessor: (row: any) => {
        const found = BRANCH_DATA.find(b => b.id === row.work_branch);
        return <span className="text-slate-400 text-xs">{found ? found.city : (row.work_branch || '-')}</span>;
      }
    },
    {
      header: 'Status',
      accessor: (row: Employee) => (
        <span className={statusStyle[row.employment_status] || 'badge bg-slate-500/10 text-slate-400 border border-slate-500/20'}>
          {row.employment_status}
        </span>
      ),
    },
    {
      header: 'Training Perf',
      accessor: (row: Employee) => {
        const perf = row.training_performance || 'Medium';
        const style = perf === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      perf === 'Poor' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/20';
        return <span className={`badge ${style} border text-xs`}>{perf}</span>;
      }
    },
    {
      header: 'Revenue',
      accessor: (row: Employee) => {
        const revVal = row.revenue || 0;
        const rev = row.revenue_status || 'Normal';
        const revStyle = rev === 'High' ? 'text-emerald-400 font-semibold' :
                         rev === 'Low' ? 'text-rose-400 font-semibold' : 'text-blue-400';
        return (
          <div className="text-xs">
            <div className="font-semibold text-slate-200">${revVal.toLocaleString()}</div>
            <div className={`${revStyle} text-[10px]`}>{rev}</div>
          </div>
        );
      }
    },
    {
      header: 'Profit Status',
      accessor: (row: Employee) => {
        const revVal = row.revenue || 0;
        const costVal = row.cost || 0;
        const profitVal = revVal - costVal;
        const prof = row.profit_status || 'Cost Center';
        const profStyle = prof.includes('Profit') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          prof.includes('Loss') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          prof.includes('Margin') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-slate-500/10 text-slate-400 border border-slate-500/20';
        return (
          <div className="space-y-1 text-xs">
            <div>
              <span className={`badge ${profStyle} text-[10px] px-1.5 py-0`}>{prof}</span>
            </div>
            <div className={`font-semibold ${profitVal > 0 ? 'text-emerald-400' : profitVal < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {profitVal > 0 ? '+' : ''}${profitVal.toLocaleString()}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Exit Info',
      accessor: (row: Employee) => {
        if (['Resigned', 'Terminated'].includes(row.employment_status)) {
          return (
            <div className="text-xs max-w-[180px]">
              <div className="font-semibold text-rose-400">{row.date_of_leaving}</div>
              <div className="text-slate-400 truncate" title={row.leaving_reason}>{row.leaving_reason || '-'}</div>
            </div>
          );
        }
        return <span className="text-slate-500">-</span>;
      }
    },
  ];

  const allStoredEmployees = JSON.parse(localStorage.getItem('ags_employees') || '[]');
  const usaCount = allStoredEmployees.filter((e: any) => e.work_country === 'United States').length;
  const indiaCount = allStoredEmployees.filter((e: any) => e.work_country === 'India').length;
  const philCount = allStoredEmployees.filter((e: any) => e.work_country === 'Philippines').length;
  const mexCount = allStoredEmployees.filter((e: any) => e.work_country === 'Mexico').length;

  const handleExport = async () => {
    const toastId = toast.loading('Preparing all matching records for export...');
    try {
      const res = await api.get('/employees', { 
        params: { 
          page: 1, 
          limit: 10000, 
          search, 
          status,
          training_performance: trainingPerformance,
          revenue_status: revenueStatus,
          profit_status: profitStatus,
          country,
          state,
          branch
        } 
      });
      
      const allFilteredEmployees = res.data.data.employees || [];

      if (allFilteredEmployees.length === 0) {
        toast.error('No data available to export', { id: toastId });
        return;
      }

      const headers = [
        'Emp Code', 'First Name', 'Last Name', 'Email', 'Department', 'Designation',
        'Country', 'State', 'Branch', 'Status', 'Training Performance', 'Revenue ($)', 'Cost ($)', 'Profit ($)', 'Profit Status'
      ];

      const csvData = allFilteredEmployees.map((emp: any) => {
        const profit = (emp.revenue || 0) - (emp.cost || 0);
        const branchObj = BRANCH_DATA.find(b => b.id === emp.work_branch);
        return [
          emp.emp_code || '',
          emp.first_name || '',
          emp.last_name || '',
          emp.work_email || '',
          emp.department?.name || '',
          emp.designation?.title || '',
          emp.work_country || '',
          emp.work_state || '',
          branchObj ? branchObj.city : (emp.work_branch || ''),
          emp.employment_status || '',
          emp.training_performance || '',
          emp.revenue || 0,
          emp.cost || 0,
          profit,
          emp.profit_status || ''
        ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
      });

      const csvContent = [headers.join(','), ...csvData].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employee_data_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${allFilteredEmployees.length} employee records successfully`, { id: toastId });
    } catch {
      toast.error('Failed to export employee data', { id: toastId });
    }
  };

  return (
    <div className="space-y-5">

      {/* Global Delivery Hubs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            name: 'United States',
            flag: '🇺🇸',
            branches: 'Washington, D.C. (HQ) · Scranton',
            count: usaCount,
            isHq: true,
            bgClass: 'from-blue-500/10 to-indigo-500/5 border-blue-500/10 text-blue-400 hover:border-blue-500/30',
            activeGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)] border-blue-500/50 bg-blue-500/5'
          },
          {
            name: 'India',
            flag: '🇮🇳',
            branches: 'Chennai · Vellore · Hyderabad · Tirupati · Bengaluru · Ahmedabad · Jaipur',
            count: indiaCount,
            isHq: false,
            bgClass: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/10 text-emerald-400 hover:border-emerald-500/30',
            activeGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)] border-emerald-500/50 bg-emerald-500/5'
          },
          {
            name: 'Philippines',
            flag: '🇵🇭',
            branches: 'Manila Delivery Center',
            count: philCount,
            isHq: false,
            bgClass: 'from-amber-500/10 to-orange-500/5 border-amber-500/10 text-amber-400 hover:border-amber-500/30',
            activeGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)] border-amber-500/50 bg-amber-500/5'
          },
          {
            name: 'Mexico',
            flag: '🇲🇽',
            branches: 'Mexico City Operations',
            count: mexCount,
            isHq: false,
            bgClass: 'from-purple-500/10 to-fuchsia-500/5 border-purple-500/10 text-purple-400 hover:border-purple-500/30',
            activeGlow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)] border-purple-500/50 bg-purple-500/5'
          }
        ].map((hub) => {
          const isSelected = country === hub.name;
          return (
            <motion.div
              key={hub.name}
              whileHover={{ scale: 1.015, y: -2 }}
              onClick={() => {
                if (isSelected) {
                  setCountry('');
                  setState('');
                  setBranch('');
                } else {
                  setCountry(hub.name);
                  setState('');
                  setBranch('');
                }
              }}
              className={`cursor-pointer rounded-2xl border p-6 bg-gradient-to-br transition-all duration-300 ${hub.bgClass} ${
                isSelected ? hub.activeGlow : 'border-white/5 bg-[#0e112a]/40'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <span className="text-3xl leading-none shrink-0">{hub.flag}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-100 flex items-center gap-2 truncate text-base">
                      <span className="truncate">{hub.name}</span>
                      {hub.isHq && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-blue-500/20 text-[9px] text-blue-300 font-extrabold uppercase border border-blue-500/30 tracking-wider">
                          HQ
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 truncate mt-1" title={hub.branches}>{hub.branches}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-4 border-l border-white/10 flex flex-col justify-center">
                  <div className="text-2xl font-black text-slate-100 leading-none">{hub.count}</div>
                  <div className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Employees</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters & Actions Row */}
      <div className="bg-[#0e112a] rounded-2xl shadow-card border border-white/5 p-4 flex flex-row flex-nowrap items-center gap-3 overflow-x-auto scrollbar-thin">
        <div className="relative flex-1 min-w-[180px] shrink-0 md:shrink">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 w-full"
          />
        </div>
        
        <CustomSelect
          value={status}
          onChange={setStatus}
          options={[
            { value: '', label: 'All Status' },
            { value: 'Active', label: 'Active' },
            { value: 'Resigned', label: 'Resigned' },
            { value: 'Terminated', label: 'Terminated' },
            { value: 'On-Leave', label: 'On-Leave' }
          ]}
          className="shrink-0 w-auto min-w-[130px]"
          placeholder="Status"
        />

        <CustomSelect
          value={country}
          onChange={(val) => {
            setCountry(val);
            setState('');
            setBranch('');
          }}
          options={[
            { value: '', label: 'All Countries' },
            { value: 'United States', label: 'United States', icon: '🇺🇸' },
            { value: 'India', label: 'India', icon: '🇮🇳' },
            { value: 'Philippines', label: 'Philippines', icon: '🇵🇭' },
            { value: 'Mexico', label: 'Mexico', icon: '🇲🇽' }
          ]}
          className="shrink-0 w-auto min-w-[150px] text-primary"
          placeholder="Country"
        />

        {country && STATES_BY_COUNTRY[country]?.length > 0 && (
          <CustomSelect
            value={state}
            onChange={(val) => {
              setState(val);
              setBranch('');
            }}
            options={[
              { value: '', label: 'All States' },
              ...STATES_BY_COUNTRY[country].map(s => ({ value: s, label: s }))
            ]}
            className="shrink-0 w-auto min-w-[150px] text-primary"
            placeholder="State"
          />
        )}

        <CustomSelect
          value={branch}
          onChange={setBranch}
          options={[
            { value: '', label: 'All Branches' },
            ...BRANCH_DATA
              .filter(br => {
                if (country && br.country !== country) return false;
                if (state && br.state !== state) return false;
                return true;
              })
              .map(br => ({ value: br.id, label: `${br.city} (${br.state})` }))
          ]}
          className="shrink-0 w-auto min-w-[150px] text-primary"
          placeholder="Branch"
        />

        <CustomSelect
          value={trainingPerformance}
          onChange={setTrainingPerformance}
          options={[
            { value: '', label: 'All Training Perf' },
            { value: 'Excellent', label: 'Excellent' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Poor', label: 'Poor' }
          ]}
          className="shrink-0 w-auto min-w-[150px]"
          placeholder="Training Perf"
        />

        <CustomSelect
          value={revenueStatus}
          onChange={setRevenueStatus}
          options={[
            { value: '', label: 'All Revenue' },
            { value: 'High', label: 'High' },
            { value: 'Normal', label: 'Normal' },
            { value: 'Low', label: 'Low' }
          ]}
          className="shrink-0 w-auto min-w-[140px]"
          placeholder="Revenue Status"
        />

        <CustomSelect
          value={profitStatus}
          onChange={setProfitStatus}
          options={[
            { value: '', label: 'All Profit Status' },
            { value: 'High Profit', label: 'High Profit' },
            { value: 'Normal Margin', label: 'Normal Margin' },
            { value: 'Loss Center', label: 'Loss Center' },
            { value: 'Cost Center (Support)', label: 'Cost Center (Support)' }
          ]}
          className="shrink-0 w-auto min-w-[160px]"
          placeholder="Profit Status"
        />

        <button 
          onClick={handleExport} 
          className="btn-secondary flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all rounded-xl shadow-sm text-sm font-semibold shrink-0 ml-auto"
        >
          <Download className="w-4 h-4" /> Export Data
        </button>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        loading={loading}
        onRowClick={(row) => navigate(`/employees/${row.id}`)}
        pagination={{
          page: pagination.page,
          totalPages: pagination.totalPages,
          onPageChange: fetchEmployees,
        }}
        emptyText="No employees found. Add your first employee to get started."
      />
    </div>
  );
}
