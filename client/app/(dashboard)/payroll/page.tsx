'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Payroll } from '@/types';
import { apiGet } from '@/lib/api';
import { PayrollTable } from '@/components/payroll/payroll-table';
import { PayrollGenerate } from '@/components/payroll/payroll-generate';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Wallet, Plus, Filter, RefreshCw, DollarSign, TrendingUp, ShieldCheck } from 'lucide-react';

const MONTHS = [
  { value: 'ALL', label: 'All Months' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export default function PayrollPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'HR';
  const canGenerate = session?.user?.role === 'ADMIN';

  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchPayrolls();
    }
  }, [session?.user?.accessToken, selectedMonth, selectedYear]);

  const fetchPayrolls = async () => {
    if (!session?.user?.accessToken) return;

    try {
      setLoading(true);
      const endpoint = isAdmin ? '/api/payroll' : '/api/payroll/my';
      const params = new URLSearchParams();
      if (selectedMonth !== 'ALL') params.append('month', selectedMonth);
      if (selectedYear) params.append('year', selectedYear);

      const url = `${endpoint}?${params.toString()}`;
      const res = await apiGet(url, session.user.accessToken);
      if (res.success) {
        setPayrolls(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch payroll:', error);
      toast.error('Could not load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    if (!session?.user?.accessToken) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payroll/${id}/pay`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.user.accessToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update payroll status');
      }

      toast.success('Payroll marked as PAID');
      fetchPayrolls();
    } catch (error: any) {
      toast.error(error.message || 'Error marking payroll as paid');
    }
  };

  const totalPayout = payrolls.reduce((acc, p) => acc + p.netSalary, 0);
  const averageSalary = payrolls.length > 0 ? totalPayout / payrolls.length : 0;
  const paidCount = payrolls.filter((p) => p.status === 'PAID').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            {isAdmin ? 'Payroll Management' : 'My Payslips'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isAdmin
              ? 'Generate, review, and disburse employee monthly compensation.'
              : 'View and download your monthly compensation slips and tax breakdowns.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPayrolls}
            className="border-white/10 hover:bg-white/5"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </Button>
          {canGenerate && (
            <Button
              onClick={() => setGenerateOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Generate Payroll
            </Button>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Net Disbursed</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white font-mono">{formatCurrency(totalPayout)}</div>
              <p className="text-xs text-slate-400 mt-1">For selected filter period</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Average Net Salary</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white font-mono">{formatCurrency(averageSalary)}</div>
              <p className="text-xs text-slate-400 mt-1">Per processed record</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Payment Status</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {paidCount} / {payrolls.length}
              </div>
              <p className="text-xs text-slate-400 mt-1">Slips marked as PAID</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Filter Records:</span>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[150px] bg-slate-950 border-white/10 text-slate-200">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[110px] bg-slate-950 border-white/10 text-slate-200">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <PayrollTable
        payrolls={payrolls}
        isAdmin={isAdmin}
        onMarkAsPaid={canGenerate ? handleMarkAsPaid : undefined}
        isLoading={loading}
      />

      {canGenerate && (
        <PayrollGenerate
          open={generateOpen}
          onOpenChange={setGenerateOpen}
          onSuccess={fetchPayrolls}
        />
      )}
    </div>
  );
}
