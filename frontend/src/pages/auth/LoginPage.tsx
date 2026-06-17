import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';

interface LoginForm {
  email: string;
  password: string;
}

// Interactive Rotating & Inward Spiraling Canvas Particle System
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinate tracker
    const mouse = { x: width / 2, y: height / 2, active: false };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    interface Dot {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      spiralSpeed: number;
      color: string;
    }

    const dots: Dot[] = [];
    const maxDots = 280;

    // Create dots distributed at various radius distances from center
    for (let i = 0; i < maxDots; i++) {
      const startRadius = Math.random() * Math.max(width, height) * 0.85;
      dots.push({
        angle: Math.random() * Math.PI * 2,
        radius: startRadius,
        speed: (Math.random() * 0.0015 + 0.0005) * (Math.random() > 0.5 ? 1 : -1),
        spiralSpeed: Math.random() * 0.6 + 0.3, // inward speed
        size: Math.random() * 2.2 + 0.8,
        color: 'rgba(16, 185, 129, ', // emerald green base
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark blue-black radial gradient for corporate background
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 20,
        width / 2, height / 2, Math.max(width, height) * 0.9
      );
      bgGrad.addColorStop(0, '#090b24'); // AGS Blue base
      bgGrad.addColorStop(1, '#05060f'); // Dark black base
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxDist = Math.max(width, height) * 0.5;

      // Update and draw each particle
      dots.forEach((dot) => {
        // Rotate around center
        dot.angle += dot.speed;

        // Spiral inwards towards the center
        dot.radius -= dot.spiralSpeed;

        // Reset dot when it reaches close to the center
        if (dot.radius < 30) {
          dot.radius = Math.max(width, height) * 0.65 + Math.random() * 180;
          dot.angle = Math.random() * Math.PI * 2;
        }

        // Make size & opacity fade when approaching center
        const distanceRatio = Math.min(dot.radius / maxDist, 1.0);
        const sizeMultiplier = distanceRatio * 1.1;
        const currentSize = Math.max(dot.size * sizeMultiplier, 0.4);
        const opacity = Math.min(0.85 * distanceRatio, 0.8);

        // Visual position coordinates
        let x = centerX + Math.cos(dot.angle) * dot.radius;
        let y = centerY + Math.sin(dot.angle) * dot.radius;

        // Interactive mouse repulsion
        if (mouse.active) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const limitDist = 130;
          if (dist < limitDist) {
            const force = (limitDist - dist) / limitDist; // scale force from 0 to 1
            x += (dx / dist) * force * 22; // push particles away
            y += (dy / dist) * force * 22;
          }
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(x, y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `${dot.color}${opacity})`;
        ctx.fill();
      });

      // Render glowing trail under pointer position
      if (mouse.active) {
        ctx.beginPath();
        const cursorGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 90
        );
        cursorGlow.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
        cursorGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.04)');
        cursorGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = cursorGlow;
        ctx.arc(mouse.x, mouse.y, 90, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10 pointer-events-none" />;
}

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
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Layers className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100">AGS Health</h1>
            <p className="text-primary text-xs font-semibold tracking-wider uppercase mt-1">Workforce Intelligence Platform</p>
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
