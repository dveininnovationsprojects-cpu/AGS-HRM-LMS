import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const selectedCountry = watch('work_country');
  const AGS_LOCATIONS: Record<string, string[]> = {
    'United States': ['Washington, D.C. (HQ)', 'Scranton, PA'],
    'India': ['Chennai', 'Vellore', 'Tirupati', 'Hyderabad', 'Bengaluru', 'Ahmedabad', 'Jaipur'],
    'Philippines': ['Manila'],
    'Mexico': ['Mexico City']
  };

  useEffect(() => {
    api.get('/departments').then(r => setDepartments(r.data.data.departments || []));
    api.get('/designations').then(r => setDesignations(r.data.data.designations || []));
    if (isEdit) {
      api.get(`/employees/${id}`).then(r => {
        const emp = r.data.data.employee;
        reset({
          ...emp,
          dept_id: emp.department?.id || '',
          designation_id: emp.designation?.id || '',
        });
      });
    }
  }, [id]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/employees/${id}`, data);
        toast.success('Employee updated successfully');
      } else {
        await api.post('/employees', data);
        toast.success('Employee created successfully');
      }
      navigate('/employees');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', required = false, options }: any) => (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      {options ? (
        <select {...register(name, required ? { required: `${label} is required` } : {})} className="input-field">
          <option value="">Select {label}</option>
          {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={type} {...register(name, required ? { required: `${label} is required` } : {})} className="input-field" />
      )}
      {errors[name] && <p className="text-red-400 text-xs mt-0.5">{errors[name]?.message as string}</p>}
    </div>
  );

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/employees')} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-100">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h1>
          <p className="text-sm text-slate-400">Fill in the employee information below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0e112a]/95 backdrop-blur-md rounded-2xl p-6 shadow-card border border-white/5">
          <h2 className="font-semibold text-slate-200 text-sm mb-4 pb-2 border-b border-white/5">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="First Name" name="first_name" required />
            <Field label="Middle Name" name="middle_name" />
            <Field label="Last Name" name="last_name" />
            <Field label="Date of Birth" name="date_of_birth" type="date" />
            <Field label="Gender" name="gender" options={[{value:'Male',label:'Male'},{value:'Female',label:'Female'},{value:'Other',label:'Other'}]} />
            <Field label="Blood Group" name="blood_group" options={['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b=>({value:b,label:b}))} />
            <Field label="Phone Primary" name="phone_primary" />
            <Field label="Personal Email" name="personal_email" type="email" />
            <Field label="Nationality" name="nationality" />
          </div>
        </motion.div>

        {/* Work Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0e112a]/95 backdrop-blur-md rounded-2xl p-6 shadow-card border border-white/5">
          <h2 className="font-semibold text-slate-200 text-sm mb-4 pb-2 border-b border-white/5">Work Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Work Email" name="work_email" type="email" required />
            <Field label="Department" name="dept_id" options={departments.map(d => ({value:d.id,label:d.name}))} />
            <Field label="Designation" name="designation_id" options={designations.map(d => ({value:d.id,label:d.title}))} />
            <Field label="Date of Joining" name="date_of_joining" type="date" required />
            <Field label="Employment Type" name="employment_type" options={[
              {value:'Full-Time',label:'Full-Time'},{value:'Part-Time',label:'Part-Time'},
              {value:'Contract',label:'Contract'},{value:'Intern',label:'Intern'},
            ]} />
            <Field label="Employment Status" name="employment_status" options={[
              {value:'Active',label:'Active'},{value:'Inactive',label:'Inactive'},
              {value:'On-Leave',label:'On-Leave'},
            ]} />
            <Field label="Work Country" name="work_country" required options={[
              {value:'United States',label:'United States'},
              {value:'India',label:'India'},
              {value:'Philippines',label:'Philippines'},
              {value:'Mexico',label:'Mexico'}
            ]} />
            <Field label="Work Branch" name="work_branch" required options={(AGS_LOCATIONS[selectedCountry] || []).map(b => ({value:b,label:b}))} />
          </div>
        </motion.div>

        {/* Identity */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[#0e112a]/95 backdrop-blur-md rounded-2xl p-6 shadow-card border border-white/5">
          <h2 className="font-semibold text-slate-200 text-sm mb-4 pb-2 border-b border-white/5">Identity & Banking</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Aadhaar Number" name="aadhaar_number" />
            <Field label="PAN Number" name="pan_number" />
            <Field label="Bank Account Number" name="bank_account_number" />
            <Field label="Bank IFSC Code" name="bank_ifsc" />
            <Field label="Bank Name" name="bank_name" />
            <Field label="UAN Number" name="uan_number" />
          </div>
        </motion.div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/employees')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 font-semibold">
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : isEdit ? 'Update Employee' : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
