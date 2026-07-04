'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Calendar, Clock, FileText, UserPlus, ArrowUpRight, ShieldCheck, Users } from 'lucide-react';

interface QuickActionItem {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

interface QuickActionsProps {
  items?: QuickActionItem[];
  title?: string;
  description?: string;
}

export function QuickActions({
  title = 'Quick Actions',
  description = 'Frequent shortcuts for daily workforce management',
  items = [
    { label: 'Apply Leave Request', description: 'Submit time off for HR approval', href: '/leave', icon: <Calendar className="w-4 h-4 text-indigo-400" /> },
    { label: 'View Attendance Log', description: 'Check monthly check-in history', href: '/attendance', icon: <Clock className="w-4 h-4 text-emerald-400" /> },
    { label: 'Download Payslip', description: 'Get salary slips & tax breakdown', href: '/payroll', icon: <FileText className="w-4 h-4 text-violet-400" /> },
    { label: 'Onboard Employee', description: 'Add new staff to department', href: '/employees/new', icon: <UserPlus className="w-4 h-4 text-amber-400" /> },
  ],
}: QuickActionsProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          {title}
        </CardTitle>
        <CardDescription className="text-slate-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((act, idx) => (
          <Link
            key={idx}
            href={act.href}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:bg-slate-800/80 hover:border-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                {act.icon}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">{act.label}</div>
                <div className="text-xs text-slate-400 truncate">{act.description}</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0 ml-2" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
