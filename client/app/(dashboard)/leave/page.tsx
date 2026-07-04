'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import { FormInput } from '@/components/shared/form-input';
import { Form } from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { getInitials } from '@/lib/utils';
import { apiGet, apiPost, apiPatch } from '@/lib/api';
import { leaveFormSchema } from '@/lib/validations';
import { LEAVE_TYPES } from '@/lib/constants';
import { toast } from 'sonner';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  Clock,
  Sparkles,
  Loader2,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { Leave, Employee } from '@/types';

type LeaveFormValues = z.infer<typeof leaveFormSchema>;

export default function LeavePage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const isAdminOrHR = session?.user?.role === 'ADMIN' || session?.user?.role === 'HR';

  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [currentEmp, setCurrentEmp] = useState<Employee | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [applyOpen, setApplyOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Approval comment modal state
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [comment, setComment] = useState('');

  const fetchLeaves = useCallback(async () => {
    if (!token) return;
    try {
      const endpoint = isAdminOrHR ? '/api/leaves' : '/api/leaves/me';
      const response = await apiGet<{ success: boolean; data: Leave[] }>(endpoint, token);
      setLeaves(response?.data || []);
      
      if (!isAdminOrHR) {
        const empResponse = await apiGet<{ success: boolean; data: Employee }>('/api/employees/me/profile', token);
        if (empResponse.success && empResponse.data) {
           setCurrentEmp(empResponse.data);
        }
      } else {
        const myProfile = await apiGet<{ success: boolean; data: Employee }>('/api/employees/me/profile', token);
        if (myProfile.success && myProfile.data) {
          setCurrentEmp(myProfile.data);
        }
      }
    } catch (error) {
      toast.error('Failed to load leave records.');
    }
  }, [token, isAdminOrHR]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      leaveType: 'PAID',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      reason: '',
    },
  });

  const onApplySubmit = async (values: LeaveFormValues) => {
    if (!token) return;
    try {
      setSubmitting(true);
      const start = new Date(values.startDate);
      const end = new Date(values.endDate);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);
      
      const payload = {
        leaveType: values.leaveType,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        totalDays: days,
        remarks: values.reason,
      };

      await apiPost('/api/leaves', payload, token);
      toast.success(`Leave request submitted for ${days} day(s). Awaiting HR approval.`);
      form.reset();
      setApplyOpen(false);
      fetchLeaves();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit leave application.');
    } finally {
      setSubmitting(false);
    }
  };

  const openApprovalModal = (leave: Leave, type: 'APPROVE' | 'REJECT') => {
    setSelectedLeave(leave);
    setActionType(type);
    setComment('');
  };

  const handleConfirmAction = async () => {
    if (!selectedLeave || !actionType || !token) return;

    try {
      const endpoint = actionType === 'APPROVE' 
        ? `/api/leaves/${selectedLeave.id}/approve` 
        : `/api/leaves/${selectedLeave.id}/reject`;
        
      await apiPatch(endpoint, { adminComment: comment }, token);
      
      if (actionType === 'APPROVE') {
        toast.success(`Approved time off for ${selectedLeave.employee?.firstName}! ${comment ? 'Comment added.' : ''}`);
      } else {
        toast.error(`Rejected time off for ${selectedLeave.employee?.firstName}. Reason logged.`);
      }
      fetchLeaves();
    } catch (error: any) {
      toast.error(error.message || 'Action failed.');
    } finally {
      setSelectedLeave(null);
      setActionType(null);
    }
  };

  const displayedLeaves = leaves.filter(l => {
    const matchesRole = isAdminOrHR ? true : (l.employeeId === currentEmp?.id);
    const matchesStatus = filterStatus === 'ALL' ? true : l.status === filterStatus;
    const matchesSearch = !searchQuery || 
      l.employee?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.employee?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.reason?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            {isAdminOrHR ? 'Workforce Time-Off Administration' : 'My Time-Off Applications'}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Leave & Time-Off Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isAdminOrHR
              ? 'Review employee leave applications, monitor availability, and log approval feedback.'
              : 'Apply for vacation, sick days, or unpaid leave and track your statutory balances.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setApplyOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-semibold text-white shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Apply Leave
          </Button>
        </div>
      </div>

      {/* 3 Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Casual / Earned (PAID)', bal: '10 Days Left', used: '5 Used', color: 'border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 to-slate-900', text: 'text-indigo-400' },
          { label: 'Sick Leave (SICK)', bal: '5 Days Left', used: '2 Used', color: 'border-rose-500/20 bg-gradient-to-br from-rose-950/20 to-slate-900', text: 'text-rose-400' },
          { label: 'Unpaid Leave (UNPAID)', bal: 'Unlimited', used: '0 Used', color: 'border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-slate-900', text: 'text-amber-400' },
        ].map((item, idx) => (
          <Card key={idx} className={`glass-card ${item.color}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-300">{item.label}</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className={`text-3xl font-extrabold font-mono ${item.text}`}>{item.bal}</div>
              <div className="text-xs text-slate-400 mt-1">{item.used} this calendar year</div>
            </CardContent>
            <CardFooter className="pt-2 border-t border-white/5 bg-slate-950/30 text-xs text-slate-500 justify-between">
              <span>Annual Policy Quota</span>
              <span className="text-slate-400">Refills Jan 1</span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <Button
              key={st}
              size="sm"
              variant={filterStatus === st ? 'default' : 'outline'}
              onClick={() => setFilterStatus(st)}
              className={`text-xs h-8 ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white border-0'
                  : 'bg-slate-950/50 border-white/10 text-slate-300 hover:bg-white/5'
              }`}
            >
              {st === 'ALL' ? 'All Requests' : st}
            </Button>
          ))}
        </div>

        {isAdminOrHR && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by employee or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-950 border-white/10 text-slate-200 h-9 text-xs"
            />
          </div>
        )}
      </div>

      {/* Leave Requests Table / Queue */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg text-white">
              {isAdminOrHR ? 'Organization Leave History & Approvals' : 'My Leave Applications Log'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Showing {displayedLeaves.length} record(s) matching selected filters
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {isAdminOrHR && <th className="py-3.5 px-6">Employee</th>}
                <th className="py-3.5 px-6">Leave Type</th>
                <th className="py-3.5 px-4">Date Range</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-6">Reason & Feedback</th>
                <th className="py-3.5 px-4">Status</th>
                {isAdminOrHR && <th className="py-3.5 px-6 text-right">Approval Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayedLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-800/40 transition-colors">
                  {isAdminOrHR && (
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-white/10">
                          <AvatarImage src={leave.employee?.avatar || undefined} />
                          <AvatarFallback className="bg-indigo-600/30 text-indigo-300 text-xs font-bold">
                            {leave.employee ? getInitials(leave.employee.firstName, leave.employee.lastName) : 'EMP'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-white">
                            {leave.employee ? `${leave.employee.firstName} ${leave.employee.lastName}` : 'Employee'}
                          </div>
                          <div className="text-xs text-slate-400">{leave.employee?.designation || 'Staff'}</div>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="py-4 px-6">
                    <StatusBadge status={leave.leaveType} />
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-slate-300">
                    <div>{leave.startDate}</div>
                    <div className="text-slate-500">to {leave.endDate}</div>
                  </td>
                  <td className="py-4 px-4 font-mono text-xs font-bold text-white">
                    {leave.totalDays} Day{leave.totalDays > 1 ? 's' : ''}
                  </td>
                  <td className="py-4 px-6 max-w-xs">
                    <div className="text-slate-200 text-xs leading-relaxed">{leave.reason}</div>
                    {leave.rejectionNote && (
                      <div className="text-[11px] text-rose-400 mt-1 p-1.5 rounded bg-rose-500/10 border border-rose-500/20 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 shrink-0" />
                        <span>HR Feedback: {leave.rejectionNote}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={leave.status} />
                  </td>
                  {isAdminOrHR && (
                    <td className="py-4 px-6 text-right">
                      {leave.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => openApprovalModal(leave, 'APPROVE')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs font-medium"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openApprovalModal(leave, 'REJECT')}
                            className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 h-8 text-xs font-medium"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">
                          Reviewed by {leave.approvedBy ? `${leave.approvedBy.firstName}` : 'HR'}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {displayedLeaves.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              No leave applications found matching the selected filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Apply Leave Modal */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="sm:max-w-[480px] bg-slate-900 border-white/10 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <CalendarIcon className="w-5 h-5 text-indigo-400" />
              Apply for Time Off
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Submit your dates and reason. Your reporting manager will be notified immediately.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onApplySubmit)} className="space-y-4 py-2">
              <FormInput
                control={form.control}
                name="leaveType"
                label="Leave Type"
                type="select"
                options={LEAVE_TYPES.map(t => ({ value: t.value, label: t.label }))}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  control={form.control}
                  name="startDate"
                  label="Start Date"
                  type="date"
                />
                <FormInput
                  control={form.control}
                  name="endDate"
                  label="End Date"
                  type="date"
                />
              </div>

              <FormInput
                control={form.control}
                name="reason"
                label="Reason for Leave"
                type="textarea"
                placeholder="Briefly describe the purpose of your time off..."
                rows={3}
              />

              <DialogFooter className="pt-4 border-t border-white/5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setApplyOpen(false)}
                  disabled={submitting}
                  className="bg-transparent border-white/10 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20 font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Leave Application'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Approve / Reject Modal with Comment Field */}
      <Dialog open={!!selectedLeave} onOpenChange={(open) => !open && setSelectedLeave(null)}>
        <DialogContent className="sm:max-w-[450px] bg-slate-900 border-white/10 text-slate-100">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 text-lg font-semibold ${actionType === 'APPROVE' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {actionType === 'APPROVE' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              {actionType === 'APPROVE' ? 'Approve Leave Application' : 'Reject Leave Application'}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              You are about to {actionType?.toLowerCase()} the time-off request for{' '}
              <strong className="text-white">{selectedLeave?.employee?.firstName} {selectedLeave?.employee?.lastName}</strong> ({selectedLeave?.totalDays} days).
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Add HR Comment / Feedback {actionType === 'REJECT' && '(Required for Rejection)'}
            </label>
            <Textarea
              placeholder={actionType === 'APPROVE' ? 'e.g. Approved! Have a restful vacation.' : 'e.g. Due to critical sprint release, please reschedule to next week.'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="bg-slate-950 border-white/10 text-slate-200 text-sm resize-none"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-white/5">
            <Button
              variant="outline"
              onClick={() => setSelectedLeave(null)}
              className="bg-transparent border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={actionType === 'REJECT' && !comment.trim()}
              className={actionType === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium' : 'bg-rose-600 hover:bg-rose-700 text-white font-medium'}
            >
              Confirm {actionType === 'APPROVE' ? 'Approval' : 'Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
