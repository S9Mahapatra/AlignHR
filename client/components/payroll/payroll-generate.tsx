'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types';
import { apiGet } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Calculator, Loader2 } from 'lucide-react';

const generatePayrollSchema = z.object({
  month: z.string().min(1, 'Please select a month'),
  year: z.string().min(4, 'Enter a valid year'),
  employeeId: z.string().optional(),
  bonuses: z.string().optional(),
  deductions: z.string().optional(),
});

type GeneratePayrollFormValues = z.infer<typeof generatePayrollSchema>;

interface PayrollGenerateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const MONTHS = [
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

export function PayrollGenerate({
  open,
  onOpenChange,
  onSuccess,
}: PayrollGenerateProps) {
  const { data: session } = useSession();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<GeneratePayrollFormValues>({
    resolver: zodResolver(generatePayrollSchema),
    defaultValues: {
      month: String(new Date().getMonth() + 1),
      year: String(new Date().getFullYear()),
      employeeId: 'ALL',
      bonuses: '0',
      deductions: '0',
    },
  });

  useEffect(() => {
    if (open && session?.user?.accessToken) {
      fetchEmployees();
    }
  }, [open, session?.user?.accessToken]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const res = await apiGet<{ success: boolean; data: any[] }>('/api/employees?status=ACTIVE', session?.user?.accessToken);
      if (res.success) {
        setEmployees(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      toast.error('Could not load employees list');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const onSubmit = async (values: GeneratePayrollFormValues) => {
    if (!session?.user?.accessToken) return;

    try {
      setSubmitting(true);
      const payload: any = {
        month: parseInt(values.month, 10),
        year: parseInt(values.year, 10),
        bonuses: values.bonuses ? parseFloat(values.bonuses) : 0,
        deductions: values.deductions ? parseFloat(values.deductions) : 0,
      };

      if (values.employeeId && values.employeeId !== 'ALL') {
        payload.employeeId = values.employeeId;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payroll/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate payroll');
      }

      toast.success(data.message || 'Payroll generated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Generate payroll error:', error);
      toast.error(error.message || 'An error occurred while generating payroll');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-slate-900 border-white/10 text-slate-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Calculator className="w-5 h-5 text-indigo-400" />
            Generate Payroll
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Calculate basic salary, HRA, DA, tax, and net pay for the selected period.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Month</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-950 border-white/10">
                          <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
                        {MONTHS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="bg-slate-950 border-white/10 text-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Target Employee</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-950 border-white/10">
                        <SelectValue placeholder="Select employee or all" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-900 border-white/10 text-slate-200 max-h-60">
                      <SelectItem value="ALL">All Active Employees</SelectItem>
                      {loadingEmployees ? (
                        <SelectItem value="loading" disabled>Loading employees...</SelectItem>
                      ) : (
                        employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName} ({emp.employeeCode})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bonuses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Bonuses (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        className="bg-slate-950 border-white/10 text-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deductions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Other Deductions (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        className="bg-slate-950 border-white/10 text-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="bg-transparent border-white/10 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Payroll'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
