'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { EmployeeForm } from './employee-form';
import { Employee } from '@/types';
import { UserPlus, UserCheck } from 'lucide-react';

interface EmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
  onSuccess?: () => void;
}

export function EmployeeModal({
  open,
  onOpenChange,
  employee,
  onSuccess,
}: EmployeeModalProps) {
  const isEditing = !!employee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] bg-slate-900 border-white/10 text-slate-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            {isEditing ? (
              <>
                <UserCheck className="w-5 h-5 text-indigo-400" />
                Edit Employee Profile: {employee.firstName} {employee.lastName}
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 text-indigo-400" />
                Onboard New Organization Staff
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isEditing
              ? 'Update departmental assignment, designation, compensation figures, or statutory status.'
              : 'Enter mandatory personnel details to provision an AlignHR workspace account.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <EmployeeForm
            initialData={employee || undefined}
            onSuccess={() => {
              if (onSuccess) onSuccess();
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
