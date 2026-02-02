import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Eye, EyeOff, EyeClosed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      // Simulate saving a token
      localStorage.setItem('token', 'mock-jwt-token'); 
      toast.success('Welcome back to NetVerse!');
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 p-8 animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-400 bg-clip-text text-transparent mb-2">
            NetVerse
          </h1>
          <p className="text-slate-500 dark:text-zinc-400">Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 dark:text-zinc-100 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg py-2.5 pl-10 pr-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 dark:text-zinc-100 transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {!showPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-zinc-400">
              <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              Remember me
            </label>
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Forgot password?</a>
          </div>

          <Button 
            type="submit" 
            className="w-full py-2.5 mt-2" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : (
              <>
                Sign In <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500 dark:text-zinc-400">
          Don't have an account? <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;