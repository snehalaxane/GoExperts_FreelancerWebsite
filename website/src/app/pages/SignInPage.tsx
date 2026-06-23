import { useEffect, useState } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import logoFallback from '@/assets/0772c85ef8b5349a958c92c3b3261c8a881ce229.png';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

export default function SignInPage() {
  const { site_logo } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    if (message) {
      toast.info(message);
    }
  }, []);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const logoUrl = logoFallback;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        const user = response.data.user;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', user.full_name);

        // Redirect based on redirect param or primary role
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirect');

        if (redirectTo) {
          navigate(redirectTo);
        } else if (user.roles?.includes('investor')) {
          localStorage.setItem('userType', 'investor');
          navigate('/dashboard-investor');
        } else if (user.roles?.includes('startup_creator')) {
          localStorage.setItem('userType', 'startup_creator');
          navigate('/dashboard-startup');
        } else {
          // Set initial userType for marketplace roles
          const currentType = localStorage.getItem('userType');
          if (!currentType) {
            if (user.roles?.includes('freelancer')) {
              localStorage.setItem('userType', 'freelancer');
            } else {
              localStorage.setItem('userType', 'client');
            }
          }
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      // Handle "email not verified" case — store token so resend-verification API works
      if (status === 403 && message?.includes('verify')) {
        const errorUser = error?.response?.data?.user;
        const errorToken = error?.response?.data?.token;
        if (errorToken) localStorage.setItem('token', errorToken);
        if (errorUser) {
          localStorage.setItem('user', JSON.stringify(errorUser));
          localStorage.setItem('isLoggedIn', 'true');
        }
        toast.error('Please verify your email first. Check your inbox or request a new link.');
        if (errorUser?.roles?.includes('investor')) {
          navigate('/dashboard-investor');
        } else if (errorUser?.roles?.includes('startup_creator')) {
          navigate('/dashboard-startup');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(message || 'Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
     {/* The entire background is now the fluid glass canvas */}
<div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-50/60 via-orange-50/50 to-slate-100 min-h-screen relative overflow-hidden backdrop-blur-xl">
  
  {/* Large, soft ambient light blobs that melt into the background */}
  <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F24C20]/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[6000ms]" />
  <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#044071]/80 rounded-full blur-[140px] pointer-events-none opacity-20" />

  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    // {/* Clean, borderless layout that sits directly on the glass environment */}
    className="w-full max-w-md relative z-10"
  >
    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-10 transition-colors text-sm font-medium group">
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      Back to home
    </Link>

    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <img src={logoUrl} alt="Go Experts" className="h-10 w-auto object-contain" />
      </div>
      <h1 className="text-4xl font-bold mb-2 text-slate-900 tracking-tight">Welcome back</h1>
      <p className="text-slate-500 text-base">Sign in to your account to continue</p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-6 mb-8">
      <div>
        <label className="block text-sm font-semibold mb-2 text-slate-700">Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            placeholder="enter mail"
            required
            // {/* Soft translucent input glass pills */}
            className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-white/80 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F24C20]/60 focus:bg-white/90 transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-slate-700">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className="w-full pl-12 pr-12 py-3.5 bg-white/60 border border-white/80 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F24C20]/60 focus:bg-white/90 transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded border-slate-300/80 bg-white/50 text-[#F24C20] focus:ring-[#F24C20]" 
          />
          <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors font-medium">Remember me</span>
        </label>
        <Link to="/forgot-password" className="text-sm text-[#F24C20] hover:text-[#e0431b] transition-colors font-semibold">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-[#F24C20] hover:bg-[#e0431b] text-white rounded-2xl font-bold transition-all shadow-lg shadow-[#F24C20]/20 active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>

    <div className="text-center text-slate-500 text-sm font-medium">
      Don't have an account?{' '}
      <Link to="/signup" className="text-[#F24C20] hover:text-[#e0431b] transition-colors font-bold">
        Sign up
      </Link>
    </div>
  </motion.div>
</div>

      {/* Right Side - Illustration */}
    <motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  className="
    hidden lg:flex flex-1 items-center justify-center p-8
    bg-gradient-to-br
    from-[#EAD2C6]/90
    via-[#F4DDD2]/90
    to-[#F24C20]/90
    backdrop-blur-2xl
    border-l border-white/20
    relative overflow-hidden
  "
>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(242,76,32,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(242,76,32,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative z-10 text-center">
          <div className="text-8xl mb-8">🚀</div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Start Your Journey</h2>
          <p className="text-xl text-muted-foreground max-w-md">
            Join thousands of professionals finding success on Go Experts
          </p>
        </div>
      </motion.div>
    </div>
  );
}
