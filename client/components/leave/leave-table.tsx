'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { getInitials } from '@/lib/utils';
import { Leave } from '@/types';
import { CheckCircle2, XCircle, MessageSquare } from 'lucide-react';

interface LeaveTableProps {
  leaves: Leave[];
  isAdminOrHR?: boolean;
  onApprove?: (leave: Leave) => void;
  onReject?: (leave: Leave) => void;
}

export function LeaveTable({
  leaves,
  isAdminOrHR = false,
  onApprove,
  onReject,
}: LeaveTableProps) {
  if (leaves.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">
        No time-off records match the specified filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/5 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            {isAdminOrHR && <th className="py-3.5 px-6">Employee</th>}
            <th className="py-3.5 px-6">Type</th>
            <th className="py-3.5 px-4">Date Range</th>
            <th className="py-3.5 px-4">Duration</th>
            <th className="py-3.5 px-6">Reason & Feedback</th>
            <th className="py-3.5 px-4">Status</th>
            {isAdminOrHR && <th className="py-3.5 px-6 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {leaves.map((leave) => (
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
                    <span>HR: {leave.rejectionNote}</span>
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
                      {onApprove && (
                        <Button
                          size="sm"
                          onClick={() => onApprove(leave)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Approve
                        </Button>
                      )}
                      {onReject && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReject(leave)}
                          className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 h-8 text-xs font-medium"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </Button>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">
                      Reviewed
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
