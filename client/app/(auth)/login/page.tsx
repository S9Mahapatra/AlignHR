'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Lock, Mail, ShieldCheck, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.info(`Filled credentials for ${demoEmail}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back to AlignHR!');
        const session = await getSession();
        const role = session?.user?.role;
        if (role === 'ADMIN' || role === 'HR') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/employee');
        }
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-[#030712] relative overflow-hidden animate-in fade-in duration-700">
      {/* Soft abstract ambient glowing background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Logo & Tagline */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AlignHR
            </h1>
          </Link>
          <p className="text-slate-400 text-sm">
            Every workday, perfectly aligned.
          </p>
        </div>

        {/* Login Card */}
        <Card className="glass-card gradient-border shadow-2xl">
          <CardContent className="p-7 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Sign directly in</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your work credentials to access the portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                  Work Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-950/80 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 h-10 text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                    Password
                  </Label>
                  <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">Forgot?</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-950/80 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 h-10 text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold h-11 transition-all duration-200 shadow-lg shadow-indigo-500/20 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Workspace
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-white/5 text-center text-xs text-slate-400">
              New employee without an account?{' '}
              <Link href="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline">
                Register Work Profile
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials Interactive Card */}
        <Card className="glass-card bg-slate-900/60 border-white/10">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <ShieldCheck className="w-4 h-4" />
                Demo Credentials Card
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-mono">1-Click Auto Fill</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoFill('admin@alignhr.com', 'Admin@123')}
                className="h-auto py-2.5 px-3 flex flex-col items-start gap-1 bg-slate-950/50 border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/10 text-left transition-all"
              >
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Admin / HR Role
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate w-full">admin@alignhr.com</div>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoFill('employee@alignhr.com', 'Employee@123')}
                className="h-auto py-2.5 px-3 flex flex-col items-start gap-1 bg-slate-950/50 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-left transition-all"
              >
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Employee Role
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate w-full">employee@alignhr.com</div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
