'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency } from '@/lib/utils';
import { Payroll } from '@/types';
import { Wallet, Download, DollarSign, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface PayrollCardProps {
  payroll: Payroll;
  onDownload?: (payroll: Payroll) => void;
  onMarkPaid?: (id: string) => void;
  isAdminOrHR?: boolean;
}

export function PayrollCard({
  payroll,
  onDownload,
  onMarkPaid,
  isAdminOrHR = false,
}: PayrollCardProps) {
  const handleDownload = () => {
    if (onDownload) {
      onDownload(payroll);
    } else {
      toast.success(`Salary slip downloaded for ${payroll.month}/${payroll.year}`);
    }
  };

  return (
    <Card className="glass-card gradient-border hover:border-white/10 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-white">
              {payroll.month}/{payroll.year} Compensation
            </CardTitle>
            <div className="text-xs text-slate-400">
              {payroll.employee ? `${payroll.employee.firstName} ${payroll.employee.lastName}` : 'Direct Deposit'}
            </div>
          </div>
        </div>
        <StatusBadge status={payroll.status} />
      </CardHeader>

      <CardContent className="py-4 space-y-3">
        <div className="flex items-baseline justify-between border-b border-white/5 pb-3">
          <span className="text-xs text-slate-400 uppercase font-mono">Net Payable</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono tracking-tight">
            {formatCurrency(payroll.netSalary)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
          <div className="flex justify-between p-1.5 rounded bg-slate-950/40">
            <span className="text-slate-500">Basic:</span>
            <span>{formatCurrency(payroll.basicSalary)}</span>
          </div>
          <div className="flex justify-between p-1.5 rounded bg-slate-950/40">
            <span className="text-slate-500">HRA/DA:</span>
            <span>{formatCurrency(payroll.hra + payroll.da)}</span>
          </div>
          <div className="flex justify-between p-1.5 rounded bg-slate-950/40">
            <span className="text-slate-500">Bonuses:</span>
            <span className="text-emerald-400">+{formatCurrency(payroll.bonuses)}</span>
          </div>
          <div className="flex justify-between p-1.5 rounded bg-slate-950/40">
            <span className="text-slate-500">Tax/Ded:</span>
            <span className="text-rose-400">-{formatCurrency(payroll.tax + payroll.deductions)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="w-full bg-slate-950/50 border-white/10 hover:bg-white/5 text-xs h-8 text-slate-300"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Slip
        </Button>

        {isAdminOrHR && payroll.status !== 'PAID' && onMarkPaid && (
          <Button
            size="sm"
            onClick={() => onMarkPaid(payroll.id)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Mark Paid
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
