'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency, getInitials } from '@/lib/utils';
import { MOCK_EMPLOYEES, MOCK_LEAVES, MOCK_PAYROLLS, MOCK_DEPARTMENTS, MOCK_ACTIVITIES } from '@/lib/mock-data';
import { toast } from 'sonner';
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  DollarSign,
  Building2,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Activity,
  TrendingUp,
  BarChart3,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [leaves, setLeaves] = useState(MOCK_LEAVES);
  const pendingLeaves = leaves.filter(l => l.status === 'PENDING');
  
  const totalEmployees = MOCK_EMPLOYEES.length;
  const presentToday = 7;
  const absentToday = 1;
  const monthlyPayrollTotal = MOCK_PAYROLLS.reduce((acc, p) => acc + p.netSalary, 0) + 480000;
  const totalDepartments = MOCK_DEPARTMENTS.length;
  const newJoiners = 2;

  const handleApprove = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'APPROVED' as const } : l));
    toast.success('Leave request approved! The employee has been notified.');
  };

  const handleReject = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'REJECTED' as const } : l));
    toast.error('Leave request rejected. Notification sent.');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <Layers className="w-3.5 h-3.5" />
            Executive Workforce Governance
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Admin & HR Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time organizational analytics, leave approval queues, and payroll oversight.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/employees/new">
            <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-semibold text-white shadow-lg shadow-indigo-500/20">
              <UserPlus className="w-4 h-4 mr-2" />
              Onboard Employee
            </Button>
          </Link>
          <Link href="/payroll">
            <Button variant="outline" className="border-white/10 bg-slate-900/80 hover:bg-white/5 text-slate-200 font-medium">
              Run Payroll
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Employees</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white font-mono">{totalEmployees}</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +12% this quarter
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Present Today</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white font-mono">{presentToday} / {totalEmployees}</div>
            <div className="text-xs text-slate-400 mt-1">87.5% attendance rate</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Absent Today</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <UserX className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white font-mono">{absentToday}</div>
            <div className="text-xs text-slate-400 mt-1">1 on approved paternity</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Leaves</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white font-mono">{pendingLeaves.length}</div>
            <div className="text-xs text-amber-400 mt-1 font-medium">Requires HR review</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Monthly Payroll</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white font-mono">{formatCurrency(monthlyPayrollTotal)}</div>
            <div className="text-xs text-slate-400 mt-1">June 2026 Disbursed</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Departments</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white font-mono">{totalDepartments}</div>
            <div className="text-xs text-slate-400 mt-1">{newJoiners} new joiners this month</div>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Leave Approval Queue & Attendance Summary / Visual Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Approval Queue */}
        <Card className="glass-card lg:col-span-2 flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                Leave Approval Queue ({pendingLeaves.length})
              </CardTitle>
              <CardDescription className="text-slate-400">Action required for submitted employee time-off applications</CardDescription>
            </div>
            <Link href="/leave">
              <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 text-xs font-medium">
                Manage All <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="space-y-3">
            {pendingLeaves.map((leave) => (
              <div key={leave.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:bg-slate-900/90 transition-all">
                <div className="flex items-start sm:items-center gap-3">
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarImage src={leave.employee?.avatar || undefined} />
                    <AvatarFallback className="bg-indigo-600/30 text-indigo-300 font-bold">
                      {leave.employee ? getInitials(leave.employee.firstName, leave.employee.lastName) : 'EMP'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        {leave.employee ? `${leave.employee.firstName} ${leave.employee.lastName}` : 'Employee'}
                      </span>
                      <StatusBadge status={leave.leaveType} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{leave.reason}</p>
                    <div className="text-[11px] text-slate-500 font-mono mt-1">
                      {leave.startDate} to {leave.endDate} ({leave.totalDays} Days)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(leave.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(leave.id)}
                    className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-medium"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}

            {pendingLeaves.length === 0 && (
              <div className="text-center py-12 bg-slate-950/30 rounded-xl border border-white/5 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                <p className="text-sm font-semibold text-slate-300">All caught up!</p>
                <p className="text-xs">There are no pending leave requests awaiting review.</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-3 border-t border-white/5 bg-slate-950/30 text-xs text-slate-400 justify-between">
            <span>Automated SLA reminder: Review within 24 hours</span>
            <span className="text-indigo-400">SaaS Workflow Active</span>
          </CardFooter>
        </Card>

        {/* Attendance Summary & Department Visual Bars */}
        <Card className="glass-card lg:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Workforce Distribution
            </CardTitle>
            <CardDescription className="text-slate-400">Headcount breakdown by department</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {MOCK_DEPARTMENTS.map((dept) => {
              const count = dept._count?.employees || 1;
              const pct = Math.round((count / totalEmployees) * 100);
              return (
                <div key={dept.id} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-200">{dept.name}</span>
                    <span className="text-slate-400 font-mono text-xs">{count} Staff ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1.5 text-indigo-300 mt-4">
              <div className="font-bold flex items-center gap-1.5 text-white">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Payroll Accuracy: 100%
              </div>
              <p className="text-slate-300">
                All tax deductions and HRA/DA allowances comply with statutory financial benchmarks.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table Preview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Table Preview */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Employee Table Preview
              </CardTitle>
              <CardDescription className="text-slate-400">Active team members and designations</CardDescription>
            </div>
            <Link href="/employees">
              <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 text-xs">
                Full Directory <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-6">Employee</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_EMPLOYEES.slice(0, 5).map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-white/10">
                          <AvatarImage src={emp.avatar || undefined} />
                          <AvatarFallback className="bg-indigo-600/30 text-indigo-300 text-xs">
                            {getInitials(emp.firstName, emp.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-white">{emp.firstName} {emp.lastName}</div>
                          <div className="text-xs text-slate-400">{emp.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-300">{emp.employeeCode}</td>
                    <td className="py-3 px-4 text-slate-300">{emp.department?.name || 'Engineering'}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={emp.user?.role || 'EMPLOYEE'} />
                    </td>
                    <td className="py-3 px-6 text-right">
                      <StatusBadge status={emp.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Recent Employee Activity */}
        <Card className="glass-card lg:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Recent Activity Feed
            </CardTitle>
            <CardDescription className="text-slate-400">Real-time audit log of system events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_ACTIVITIES.slice(0, 4).map((act) => (
              <div key={act.id} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200">{act.title}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{act.description}</p>
                  <div className="text-[10px] text-slate-500 font-mono">{act.timestamp}</div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="pt-3 border-t border-white/5 bg-slate-950/30 text-xs text-slate-500 justify-center">
            Log retention: 90 Days Enterprise Policy
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
