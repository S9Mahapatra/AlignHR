'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Leave } from '@/types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface LeaveApprovalModalProps {
  leave: Leave | null;
  actionType: 'APPROVE' | 'REJECT' | null;
  onClose: () => void;
  onConfirm: (leaveId: string, action: 'APPROVE' | 'REJECT', comment?: string) => void;
}

export function LeaveApprovalModal({
  leave,
  actionType,
  onClose,
  onConfirm,
}: LeaveApprovalModalProps) {
  const [comment, setComment] = useState('');

  if (!leave || !actionType) return null;

  const handleConfirm = () => {
    onConfirm(leave.id, actionType, comment);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={!!leave} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] bg-slate-900 border-white/10 text-slate-100">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 text-lg font-semibold ${actionType === 'APPROVE' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {actionType === 'APPROVE' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {actionType === 'APPROVE' ? 'Approve Leave Application' : 'Reject Leave Application'}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            You are about to {actionType.toLowerCase()} the time-off request for{' '}
            <strong className="text-white">{leave.employee?.firstName} {leave.employee?.lastName}</strong> ({leave.totalDays} days).
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
            onClick={onClose}
            className="bg-transparent border-white/10 hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={actionType === 'REJECT' && !comment.trim()}
            className={actionType === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium' : 'bg-rose-600 hover:bg-rose-700 text-white font-medium'}
          >
            Confirm {actionType === 'APPROVE' ? 'Approval' : 'Rejection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
