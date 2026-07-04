'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { getInitials, formatCurrency } from '@/lib/utils';
import { Employee } from '@/types';
import { Mail, Phone, Building2, ExternalLink, Shield } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onViewDetails?: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
  isAdminOrHR?: boolean;
}

export function EmployeeCard({
  employee,
  onViewDetails,
  onEdit,
  isAdminOrHR = false,
}: EmployeeCardProps) {
  return (
    <Card className="glass-card p-5 hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between group">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors">
              <AvatarImage src={employee.avatar || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold text-sm">
                {getInitials(employee.firstName, employee.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-white text-base leading-tight group-hover:text-indigo-300 transition-colors">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-xs text-indigo-400 font-medium mt-0.5">{employee.designation || 'Staff Member'}</p>
            </div>
          </div>
          <StatusBadge status={employee.status} />
        </div>

        <div className="space-y-2 py-2 border-y border-white/5 text-xs text-slate-300 font-sans">
          <div className="flex items-center gap-2 text-slate-400 truncate">
            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">Department: <strong className="text-slate-200">{employee.department?.name || 'General'}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center gap-2 text-slate-400 truncate">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{employee.phone}</span>
            </div>
          )}
          {isAdminOrHR && employee.salary && (
            <div className="flex items-center justify-between pt-1 font-mono text-emerald-400 font-semibold">
              <span>Base Salary:</span>
              <span>{formatCurrency(employee.salary)}/mo</span>
            </div>
          )}
        </div>
      </CardContent>

      <div className="pt-4 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails && onViewDetails(employee)}
          className="w-full bg-slate-950/50 border-white/10 hover:bg-white/5 text-xs h-8 text-slate-300"
        >
          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
          View Profile
        </Button>
        {isAdminOrHR && onEdit && (
          <Button
            size="sm"
            onClick={() => onEdit(employee)}
            className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs h-8 px-3 font-medium transition-colors"
          >
            Edit
          </Button>
        )}
      </div>
    </Card>
  );
}
