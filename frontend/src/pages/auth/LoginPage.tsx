import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';

interface LoginForm {
  email: string;
  password: string;
}

import ParticleBackground from '../../components/ui/ParticleBackground';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((s: RootState) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!');
    } else {
      toast.error(result.payload as string || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-transparent">
      {/* Dynamic Animated Particle Canvas System */}
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 border border-white/10 shadow-glass relative">
          {/* Header logo / branding */}
          <div className="flex flex-col items-center justify-center mb-8 text-center">
            <img 
              src="https://cdn-bpead.nitrocdn.com/BBpeMUqwtpRtLgerjeQhQjKhWBtMWEQP/assets/images/optimized/rev-e5326ea/www.agshealth.com/wp-content/uploads/2022/09/AGS-Health-Logo-White.svg" 
              alt="AGS Health Logo" 
              className="h-10 w-auto mb-4"
            />
            <p className="text-primary text-xs font-semibold tracking-widest uppercase mt-1">Workforce Intelligence Platform</p>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-lg font-bold text-slate-200">Sign in</h2>
            <p className="text-slate-400 text-xs mt-1">Enter your credentials to access the platform</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email address</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })}
                placeholder="admin@agshealth.com"
                className="input-field"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">
                <input type="checkbox" className="rounded bg-[#0c0e25] border-white/10 text-primary focus:ring-primary/20" />
                Remember me
              </label>
              <a href="#" className="text-xs text-primary hover:underline font-semibold">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base font-bold mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-slate-500 mt-8 tracking-wider uppercase">
          © 2026 AGS Health Workforce Intelligence Platform. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
