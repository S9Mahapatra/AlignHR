'use client';

import React, { useState } from 'react';
import { Payroll } from '@/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency, getInitials } from '@/lib/utils';
import { CheckCircle2, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface PayrollTableProps {
  payrolls: Payroll[];
  isAdmin: boolean;
  onMarkAsPaid?: (id: string) => void;
  isLoading?: boolean;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function PayrollTable({
  payrolls,
  isAdmin,
  onMarkAsPaid,
  isLoading = false,
}: PayrollTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (status: Payroll['status']) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="success">PAID</Badge>;
      case 'PROCESSED':
        return <Badge variant="warning">PROCESSED</Badge>;
      case 'DRAFT':
        return <Badge variant="secondary">DRAFT</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full text-center py-12 text-slate-400">
        Loading payroll records...
      </div>
    );
  }

  if (payrolls.length === 0) {
    return (
      <div className="w-full text-center py-12 bg-slate-900/40 border border-white/5 rounded-xl text-slate-400">
        <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
        <p className="text-lg font-medium text-slate-300">No payroll records found</p>
        <p className="text-sm">Paylips will appear here once they are generated.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/5 overflow-hidden bg-slate-900/80 backdrop-blur-xl">
      <Table>
        <TableHeader className="bg-slate-950/50">
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="w-12"></TableHead>
            {isAdmin && <TableHead>Employee</TableHead>}
            <TableHead>Period</TableHead>
            <TableHead className="text-right">Basic</TableHead>
            <TableHead className="text-right">Allowances</TableHead>
            <TableHead className="text-right">Deductions</TableHead>
            <TableHead className="text-right">Net Salary</TableHead>
            <TableHead>Status</TableHead>
            {isAdmin && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrolls.map((payroll) => {
            const isExpanded = expandedId === payroll.id;
            const totalAllowances = (payroll.hra || 0) + (payroll.da || 0) + (payroll.bonuses || 0);
            const totalDeductions = (payroll.deductions || 0) + (payroll.tax || 0);

            return (
              <React.Fragment key={payroll.id}>
                <TableRow className="border-white/5 hover:bg-slate-800/40 transition-colors">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-white"
                      onClick={() => toggleExpand(payroll.id)}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-white/10">
                          <AvatarImage src={payroll.employee?.avatar || undefined} />
                          <AvatarFallback className="bg-indigo-600/30 text-indigo-300 text-xs">
                            {payroll.employee ? getInitials(payroll.employee.firstName, payroll.employee.lastName) : 'EMP'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-200">
                            {payroll.employee ? `${payroll.employee.firstName} ${payroll.employee.lastName}` : 'Unknown Employee'}
                          </div>
                          <div className="text-xs text-slate-400">
                            {payroll.employee?.designation || 'Staff'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="font-medium text-slate-300">
                    {MONTHS[payroll.month - 1]} {payroll.year}
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-300">
                    {formatCurrency(payroll.basicSalary)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-emerald-400">
                    +{formatCurrency(totalAllowances)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-rose-400">
                    -{formatCurrency(totalDeductions)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-white">
                    {formatCurrency(payroll.netSalary)}
                  </TableCell>
                  <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      {payroll.status === 'PROCESSED' && onMarkAsPaid && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          onClick={() => onMarkAsPaid(payroll.id)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                          Mark Paid
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
                {isExpanded && (
                  <TableRow className="bg-slate-950/40 border-white/5 hover:bg-slate-950/40">
                    <TableCell colSpan={isAdmin ? 9 : 8} className="p-4 bg-slate-950/30">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-lg bg-slate-900/60 border border-white/5">
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Earnings Breakdown</h4>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between text-slate-300">
                              <span>Basic Salary:</span>
                              <span className="font-mono">{formatCurrency(payroll.basicSalary)}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>HRA (40%):</span>
                              <span className="font-mono text-emerald-400">+{formatCurrency(payroll.hra)}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>DA (20%):</span>
                              <span className="font-mono text-emerald-400">+{formatCurrency(payroll.da)}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>Bonuses:</span>
                              <span className="font-mono text-emerald-400">+{formatCurrency(payroll.bonuses)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Deductions & Tax</h4>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between text-slate-300">
                              <span>Income Tax:</span>
                              <span className="font-mono text-rose-400">-{formatCurrency(payroll.tax)}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>Other Deductions:</span>
                              <span className="font-mono text-rose-400">-{formatCurrency(payroll.deductions)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Payment Info</h4>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between text-slate-300">
                              <span>Status:</span>
                              <span>{getStatusBadge(payroll.status)}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>Paid Date:</span>
                              <span>{payroll.paidAt ? new Date(payroll.paidAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-slate-300 pt-2 border-t border-white/10 font-semibold">
                              <span>Total Net Pay:</span>
                              <span className="font-mono text-indigo-400">{formatCurrency(payroll.netSalary)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
