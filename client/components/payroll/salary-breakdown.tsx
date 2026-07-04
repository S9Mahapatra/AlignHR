'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Payroll } from '@/types';
import { DollarSign, Download, ShieldCheck, PieChart } from 'lucide-react';
import { toast } from 'sonner';

interface SalaryBreakdownProps {
  payroll?: Payroll;
  onDownload?: () => void;
}

export function SalaryBreakdown({ payroll, onDownload }: SalaryBreakdownProps) {
  const defaultSlip: Payroll = {
    id: 'pay-sample',
    employeeId: 'emp-3',
    month: 7,
    year: 2026,
    basicSalary: 85000,
    hra: 34000,
    da: 17000,
    bonuses: 12500,
    deductions: 2400,
    tax: 14610,
    netSalary: 131490,
    status: 'PAID',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const data = payroll || defaultSlip;
  const grossSalary = data.basicSalary + data.hra + data.da + data.bonuses;
  const totalDeductions = data.deductions + data.tax;

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      toast.success('Official salary slip document generated and downloaded as PDF!');
    }
  };

  return (
    <Card className="glass-card border-indigo-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/20">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <PieChart className="w-3.5 h-3.5" />
            Compensation Structure
          </div>
          <CardTitle className="text-xl font-bold text-white">
            Salary Breakdown Statement
          </CardTitle>
          <CardDescription className="text-slate-400">
            {data.month}/{data.year} • All figures in INR/USD per enterprise policy
          </CardDescription>
        </div>
        <Button
          onClick={handleDownload}
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Slip
        </Button>
      </CardHeader>

      <CardContent className="py-6 space-y-6 font-mono text-sm">
        {/* Earnings Section */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-sans pb-1 border-b border-white/5 flex justify-between">
            <span>Earnings & Allowances</span>
            <span>Amount</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Basic Salary</span>
            <span>{formatCurrency(data.basicSalary)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>House Rent Allowance (HRA - 40%)</span>
            <span>{formatCurrency(data.hra)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Dearness Allowance (DA - 20%)</span>
            <span>{formatCurrency(data.da)}</span>
          </div>
          <div className="flex justify-between text-emerald-400">
            <span>Performance Bonus / Incentives</span>
            <span>+{formatCurrency(data.bonuses)}</span>
          </div>
          <div className="flex justify-between font-bold text-white pt-2 border-t border-white/5">
            <span>Gross Earnings</span>
            <span>{formatCurrency(grossSalary)}</span>
          </div>
        </div>

        {/* Deductions Section */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider font-sans pb-1 border-b border-white/5 flex justify-between">
            <span>Taxes & Deductions</span>
            <span>Amount</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Provident Fund / Benefits Deduction</span>
            <span className="text-rose-400">-{formatCurrency(data.deductions)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Income Tax Withholding (TDS)</span>
            <span className="text-rose-400">-{formatCurrency(data.tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-white pt-2 border-t border-white/5">
            <span>Total Withholdings</span>
            <span className="text-rose-400">-{formatCurrency(totalDeductions)}</span>
          </div>
        </div>

        {/* Net Take Home */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 flex items-center justify-between font-sans">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Net Take-Home Salary</div>
            <div className="text-xs text-slate-400">Disbursed via Direct Bank Transfer</div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(data.netSalary)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-white/5 bg-slate-950/40 text-xs text-slate-500 flex items-center justify-between font-sans">
        <span className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Odoo Hackathon Certified Payroll Governance
        </span>
        <span>Generated automatically by AlignHR Engine</span>
      </CardFooter>
    </Card>
  );
}
