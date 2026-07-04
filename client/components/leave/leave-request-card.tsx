'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import { getInitials } from '@/lib/utils';
import { Leave } from '@/types';
import { Calendar as CalendarIcon, Clock, MessageSquare } from 'lucide-react';

interface LeaveRequestCardProps {
  leave: Leave;
  showEmployee?: boolean;
  onActionClick?: (leave: Leave, action: 'APPROVE' | 'REJECT') => void;
}

export function LeaveRequestCard({
  leave,
  showEmployee = false,
  onActionClick,
}: LeaveRequestCardProps) {
  return (
    <Card className="glass-card p-4 hover:border-white/10 transition-all">
      <CardContent className="p-0 space-y-3">
        <div className="flex items-start justify-between gap-3">
          {showEmployee && leave.employee ? (
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8 border border-white/10">
                <AvatarImage src={leave.employee.avatar || undefined} />
                <AvatarFallback className="bg-indigo-600/30 text-indigo-300 text-xs font-bold">
                  {getInitials(leave.employee.firstName, leave.employee.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold text-white">
                  {leave.employee.firstName} {leave.employee.lastName}
                </div>
                <div className="text-xs text-slate-400">{leave.employee.designation || 'Staff'}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
              <span>Time-Off Request</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <StatusBadge status={leave.leaveType} showIcon={false} />
            <StatusBadge status={leave.status} />
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-white/5 flex items-center justify-between font-mono text-xs">
          <div className="text-slate-300">
            {leave.startDate} <span className="text-slate-500">to</span> {leave.endDate}
          </div>
          <div className="font-bold text-indigo-400">
            {leave.totalDays} Day{leave.totalDays > 1 ? 's' : ''}
          </div>
        </div>

        {leave.reason && (
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2 rounded-lg border border-white/5">
            "{leave.reason}"
          </p>
        )}

        {leave.rejectionNote && (
          <div className="text-[11px] text-rose-400 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span>HR Note: {leave.rejectionNote}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
