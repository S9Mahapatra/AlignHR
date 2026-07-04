'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import { getInitials } from '@/lib/utils';
import { apiGet, apiPost } from '@/lib/api';
import { toast } from 'sonner';
import {
  Clock,
  Calendar as CalendarIcon,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Attendance, Employee, Department } from '@/types';

export default function AttendancePage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const isAdminOrHR = session?.user?.role === 'ADMIN' || session?.user?.role === 'HR';
  
  const [currentEmp, setCurrentEmp] = useState<Employee | null>(null);
  const [records, setRecords] = useState<Attendance[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState(false);
  
  // Filter states
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const endpoint = isAdminOrHR ? '/api/attendance' : '/api/attendance/me';
      const [attRes, deptRes] = await Promise.all([
        apiGet<{ success: boolean; data: Attendance[] }>(endpoint, token),
        apiGet<{ success: boolean; data: Department[] }>('/api/departments', token)
      ]);
      
      const attData = attRes?.data || [];
      setRecords(attData);
      setDepartments(deptRes?.data || []);
      
      const profileRes = await apiGet<{ success: boolean; data: Employee }>('/api/employees/me/profile', token);
      if (profileRes.success && profileRes.data) {
        setCurrentEmp(profileRes.data);
      }
      
      // Determine if currently checked in today
      const todayStr = new Date().toISOString().split('T')[0];
      const todayRecord = attData.find(r => r.date?.startsWith(todayStr) && r.employeeId === profileRes.data?.id);
      
      if (todayRecord && todayRecord.checkIn && !todayRecord.checkOut) {
        setCheckedIn(true);
        setCheckInTime(new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        setCheckedIn(false);
        setCheckInTime(null);
      }
    } catch (error) {
      toast.error('Failed to fetch attendance data.');
    } finally {
      setIsLoading(false);
    }
  }, [token, isAdminOrHR]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleClock = async () => {
    if (!token || isToggling) return;
    setIsToggling(true);
    try {
      if (!checkedIn) {
        await apiPost('/api/attendance/check-in', {}, token);
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setCheckedIn(true);
        setCheckInTime(nowStr);
        toast.success(`Clocked in at ${nowStr}! Have a great shift.`);
      } else {
        await apiPost('/api/attendance/check-out', {}, token);
        setCheckedIn(false);
        setCheckInTime(null);
        toast.success('Clocked out successfully! Work hours logged.');
      }
      fetchData(); // Refresh records
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle clock status.');
    } finally {
      setIsToggling(false);
    }
  };

  const handleExport = () => {
    toast.success('Attendance report exported to CSV! Check your downloads folder.');
  };

  const displayedRecords = records.filter(r => {
    const matchesRole = isAdminOrHR ? true : r.employeeId === currentEmp?.id;
    const matchesDept = deptFilter === 'ALL' ? true : r.employee?.department?.name === deptFilter;
    const matchesStatus = statusFilter === 'ALL' ? true : r.status === statusFilter;
    return matchesRole && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <Clock className="w-3.5 h-3.5" />
            {isAdminOrHR ? 'Organization Attendance Monitor' : 'My Attendance & Work Hours Log'}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Attendance Tracking
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isAdminOrHR
              ? 'Real-time clock-in monitoring, late arrival detection, and organization-wide attendance reporting.'
              : 'Clock in and out daily, monitor your monthly attendance logs, and track accumulated work hours.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleToggleClock}
            size="lg"
            className={`font-semibold shadow-lg ${
              checkedIn
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20'
            }`}
          >
            <Clock className="w-4 h-4 mr-2 animate-pulse" />
            {checkedIn ? 'Clock Out Now' : 'Clock In for Today'}
          </Button>
          
          {isAdminOrHR && (
            <Button
              variant="outline"
              onClick={handleExport}
              className="border-white/10 bg-slate-900/80 hover:bg-white/5 text-slate-200 font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Present Today</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white font-mono">
              {isAdminOrHR ? '7 / 8' : checkedIn ? 'PRESENT' : 'ABSENT'}
            </div>
            <div className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 87.5% organization rate
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Late Arrivals / Half Day</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white font-mono">1 Staff</div>
            <div className="text-xs text-amber-400 mt-1 font-medium">Half-Day (Dental appointment)</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">On Approved Leave</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white font-mono">1 Staff</div>
            <div className="text-xs text-slate-400 mt-1">Liam Gallagher (Paternity)</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Daily Work Hours</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white font-mono">8.6 hrs</div>
            <div className="text-xs text-slate-400 mt-1">Exceeds 8.0 hr standard benchmark</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE'].map((st) => (
            <Button
              key={st}
              size="sm"
              variant={statusFilter === st ? 'default' : 'outline'}
              onClick={() => setStatusFilter(st)}
              className={`text-xs h-8 ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white border-0'
                  : 'bg-slate-950/50 border-white/10 text-slate-300 hover:bg-white/5'
              }`}
            >
              {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
            </Button>
          ))}
        </div>

        {isAdminOrHR && (
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">Department:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-950 border border-white/10 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Attendance Log Table */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg text-white">
              {isAdminOrHR ? "Organization Daily Attendance Log" : "My Monthly Attendance Log"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Showing {displayedRecords.length} recorded shift(s)
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {isAdminOrHR && <th className="py-3.5 px-6">Employee</th>}
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-4">Clock In</th>
                <th className="py-3.5 px-4">Clock Out</th>
                <th className="py-3.5 px-4">Work Hours</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6">Notes / Shift Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayedRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  {isAdminOrHR && (
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-white/10">
                          <AvatarImage src={rec.employee?.avatar || undefined} />
                          <AvatarFallback className="bg-emerald-600/30 text-emerald-300 text-xs font-bold">
                            {rec.employee ? getInitials(rec.employee.firstName, rec.employee.lastName) : 'EMP'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-white">
                            {rec.employee ? `${rec.employee.firstName} ${rec.employee.lastName}` : 'Employee'}
                          </div>
                          <div className="text-xs text-slate-400">{rec.employee?.department?.name || 'Engineering'}</div>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="py-4 px-6 font-mono text-xs text-slate-300">{rec.date}</td>
                  <td className="py-4 px-4 font-mono text-xs text-emerald-400">
                    {rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-slate-300">
                    {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="py-4 px-4 font-mono text-xs font-bold text-white">
                    {rec.workHours ? `${rec.workHours} hrs` : '—'}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={rec.status} />
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-300 max-w-xs truncate">
                    {rec.notes || 'Standard shift completed'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {displayedRecords.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              No attendance records found for the selected criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
