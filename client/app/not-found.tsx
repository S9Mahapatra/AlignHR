'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Layers, ArrowLeft, Home, HelpCircle } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-md w-full text-center space-y-8 relative z-10 animate-fade-in">
        <Link href="/" className="inline-flex items-center gap-2.5 mx-auto group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {APP_NAME}
          </span>
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            Error 404 • Page Not Found
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Off the Radar
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            The workspace page or employee record you are looking for does not exist, has been archived, or you lack the required role permissions.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="text-xs text-slate-400">
            Need help navigating AlignHR?
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/20">
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full bg-transparent border-white/10 hover:bg-white/5 text-slate-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-xs text-slate-600 font-mono">
          AlignHR System Governance • Every workday, perfectly aligned.
        </div>
      </div>
    </div>
  );
}
