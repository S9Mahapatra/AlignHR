'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Clock, AlertCircle, Shield, User, Briefcase } from 'lucide-react';

export type StatusBadgeType =
  | 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE'
  | 'APPROVED' | 'REJECTED' | 'PENDING'
  | 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED'
  | 'PAID' | 'PROCESSED' | 'DRAFT'
  | 'ADMIN' | 'HR' | 'EMPLOYEE';

interface StatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const getBadgeStyle = (val: string) => {
    switch (val.toUpperCase()) {
      // Success / Active / Approved / Present / Paid
      case 'PRESENT':
      case 'APPROVED':
      case 'ACTIVE':
      case 'PAID':
        return {
          variant: 'success' as const,
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: <CheckCircle2 className="w-3 h-3 mr-1" />
        };

      // Error / Absent / Rejected / Terminated
      case 'ABSENT':
      case 'REJECTED':
      case 'TERMINATED':
        return {
          variant: 'destructive' as const,
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          icon: <XCircle className="w-3 h-3 mr-1" />
        };

      // Warning / Half Day / Pending / On Leave / Processed
      case 'HALF_DAY':
      case 'PENDING':
      case 'ON_LEAVE':
      case 'PROCESSED':
        return {
          variant: 'warning' as const,
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: <Clock className="w-3 h-3 mr-1" />
        };

      // Info / Leave / Roles
      case 'LEAVE':
      case 'ADMIN':
        return {
          variant: 'secondary' as const,
          bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          icon: <Shield className="w-3 h-3 mr-1" />
        };

      case 'HR':
        return {
          variant: 'secondary' as const,
          bg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
          icon: <Briefcase className="w-3 h-3 mr-1" />
        };

      case 'EMPLOYEE':
      case 'DRAFT':
      case 'INACTIVE':
      default:
        return {
          variant: 'outline' as const,
          bg: 'bg-slate-800/80 text-slate-300 border-white/10',
          icon: <User className="w-3 h-3 mr-1" />
        };
    }
  };

  const style = getBadgeStyle(status);

  return (
    <Badge
      variant="outline"
      className={cn('inline-flex items-center font-medium text-xs px-2.5 py-0.5 rounded-md transition-colors', style.bg, className)}
    >
      {showIcon && style.icon}
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}
