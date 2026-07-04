'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import { getInitials, formatCurrency } from '@/lib/utils';
import { MOCK_EMPLOYEES, MOCK_LEAVES, MOCK_PAYROLLS, MOCK_ACTIVITIES } from '@/lib/mock-data';
import { toast } from 'sonner';
import {
  Clock,
  Calendar,
  DollarSign,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  FileText,
  Briefcase,
  User,
  Activity,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function EmployeeDashboardPage() {
  const { data: session } = useSession();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const employee = MOCK_EMPLOYEES.find(e => e.email === session?.user?.email) || MOCK_EMPLOYEES[2];
  const myLeaves = MOCK_LEAVES.filter(l => l.employeeId === employee.id || l.employeeId === 'emp-3').slice(0, 3);
  const latestPayroll = MOCK_PAYROLLS[0];

  const handleClockToggle = () => {
    if (!checkedIn) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCheckedIn(true);
      setCheckInTime(now);
      toast.success(`Clocked in successfully at ${now}! Have a productive workday.`);
    } else {
      setCheckedIn(false);
      toast.success('Clocked out successfully! Your daily work hours have been recorded.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-slate-900/80 to-violet-900/40 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden shadow-xl">
        <div className="pointer-events-none absolute right-0 top-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="flex items-center gap-5 z-10">
          <Avatar className="h-16 w-16 border-2 border-indigo-500/40 shadow-lg">
            <AvatarImage src={employee.avatar || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold text-xl">
              {getInitials(employee.firstName, employee.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              {employee.designation || 'Staff Member'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {employee.firstName}! 👋
            </h1>
            <p className="text-sm text-slate-400">
              Department: <span className="text-slate-200 font-medium">{employee.department?.name || 'Engineering'}</span> • Employee ID: <span className="font-mono text-indigo-400">{employee.employeeCode}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10">
          <Button
            onClick={handleClockToggle}
            size="lg"
            className={`h-12 px-6 font-semibold shadow-lg transition-all ${
              checkedIn
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20'
            }`}
          >
            <Clock className="w-4 h-4 mr-2 animate-pulse" />
            {checkedIn ? 'Clock Out Now' : 'Clock In for Today'}
          </Button>
          <Link href="/leave">
            <Button variant="outline" size="lg" className="h-12 w-full sm:w-auto bg-slate-900/80 border-white/10 hover:bg-white/5 text-slate-200 font-medium">
              Request Time Off
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: Profile Completion, Today Status, Leave Balance, Payroll Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today Status Card */}
        <Card className="glass-card flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today Status</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold text-white mb-1">
              {checkedIn ? 'PRESENT' : 'NOT CLOCKED IN'}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Check-in: <strong className="text-slate-200 font-mono">{checkInTime || '08:55 AM'}</strong></span>
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t border-white/5 bg-slate-950/30 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            On Time Arrival
          </CardFooter>
        </Card>

        {/* Leave Balance Card */}
        <Card className="glass-card flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Leave Balance</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold text-white mb-1 font-mono">18 Days</div>
            <div className="text-xs text-slate-400">
              10 Casual • 5 Sick • 3 Earned
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t border-white/5 bg-slate-950/30 text-xs text-indigo-400 font-medium flex justify-between">
            <span>Annual Allocation</span>
            <Link href="/leave" className="hover:underline flex items-center">View <ChevronRight className="w-3 h-3" /></Link>
          </CardFooter>
        </Card>

        {/* Payroll Summary Card */}
        <Card className="glass-card flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Net Salary</span>
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold text-white mb-1 font-mono">
              {formatCurrency(latestPayroll.netSalary)}
            </div>
            <div className="text-xs text-slate-400">
              June 2026 Payslip Processed
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t border-white/5 bg-slate-950/30 text-xs text-violet-400 font-medium flex justify-between">
            <span>Status: PAID</span>
            <Link href="/payroll" className="hover:underline flex items-center">Payslip <ChevronRight className="w-3 h-3" /></Link>
          </CardFooter>
        </Card>

        {/* Profile Completion Card */}
        <Card className="glass-card flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Profile Health</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold text-white mb-1 font-mono">100%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-full" />
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t border-white/5 bg-slate-950/30 text-xs text-slate-400 font-medium flex justify-between">
            <span>Verified Employee</span>
            <Link href="/profile" className="text-indigo-400 hover:underline flex items-center">Edit <ChevronRight className="w-3 h-3" /></Link>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Actions & Recent Leave Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="glass-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-slate-400">Frequent shortcuts for your daily tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Apply Leave Request', desc: 'Submit time off for HR approval', href: '/leave', icon: <Calendar className="w-4 h-4 text-indigo-400" /> },
              { label: 'View Attendance Log', desc: 'Check monthly check-in history', href: '/attendance', icon: <Clock className="w-4 h-4 text-emerald-400" /> },
              { label: 'Download Payslip', desc: 'Get salary slips & tax breakdown', href: '/payroll', icon: <FileText className="w-4 h-4 text-violet-400" /> },
              { label: 'Edit Profile Info', desc: 'Update emergency contact & address', href: '/profile', icon: <User className="w-4 h-4 text-amber-400" /> },
            ].map((act, idx) => (
              <Link key={idx} href={act.href} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:bg-slate-800/80 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {act.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{act.label}</div>
                    <div className="text-xs text-slate-400">{act.desc}</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Leave Requests & Activity Feed */}
        <Card className="glass-card lg:col-span-2 flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Recent Leave Requests & Activity
              </CardTitle>
              <CardDescription className="text-slate-400">Status updates on your submitted applications</CardDescription>
            </div>
            <Link href="/leave">
              <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 text-xs">
                View All <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="space-y-3">
            {myLeaves.map((leave) => (
              <div key={leave.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:bg-slate-900/90 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{leave.leaveType} LEAVE</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">{leave.totalDays} Days</span>
                  </div>
                  <p className="text-xs text-slate-400">{leave.reason}</p>
                  <div className="text-[11px] text-slate-500 font-mono pt-0.5">
                    {leave.startDate} to {leave.endDate}
                  </div>
                </div>
                <div>
                  <StatusBadge status={leave.status} />
                </div>
              </div>
            ))}

            {myLeaves.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No recent leave requests found.
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-3 border-t border-white/5 bg-slate-950/30 text-xs text-slate-400 justify-between">
            <span>Next company holiday: Independence Day (Aug 15)</span>
            <span className="text-indigo-400">HR Helpdesk Available 24/7</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
