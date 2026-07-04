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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Department, Employee } from '@/types';
import { apiGet } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Building2, Loader2 } from 'lucide-react';

const departmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters'),
  description: z.string().optional(),
  headId: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
  onSuccess: () => void;
}

export function DepartmentForm({
  open,
  onOpenChange,
  department,
  onSuccess,
}: DepartmentFormProps) {
  const { data: session } = useSession();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!department;

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      description: '',
      headId: 'NONE',
    },
  });

  useEffect(() => {
    if (open) {
      if (department) {
        form.reset({
          name: department.name,
          description: department.description || '',
          headId: department.headId || 'NONE',
        });
      } else {
        form.reset({
          name: '',
          description: '',
          headId: 'NONE',
        });
      }
      if (session?.user?.accessToken) {
        fetchEmployees();
      }
    }
  }, [open, department, session?.user?.accessToken]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const res = await apiGet<{ success: boolean; data: any[] }>('/employees?status=ACTIVE', session?.user?.accessToken);
      if (res.success) {
        setEmployees(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      toast.error('Could not load employees for department head selection');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const onSubmit = async (values: DepartmentFormValues) => {
    if (!session?.user?.accessToken) return;

    try {
      setSubmitting(true);
      const payload: any = {
        name: values.name,
        description: values.description || null,
        headId: values.headId && values.headId !== 'NONE' ? values.headId : null,
      };

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/departments/${department.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/departments`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Failed to ${isEdit ? 'update' : 'create'} department`);
      }

      toast.success(data.message || `Department ${isEdit ? 'updated' : 'created'} successfully`);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Save department error:', error);
      toast.error(error.message || 'An error occurred while saving department');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-slate-900 border-white/10 text-slate-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Building2 className="w-5 h-5 text-indigo-400" />
            {isEdit ? 'Edit Department' : 'Create Department'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isEdit
              ? 'Update department details and leadership.'
              : 'Add a new functional department to organize your workforce.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Department Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Engineering, Marketing, Finance"
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
              name="headId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Department Head</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-950 border-white/10">
                        <SelectValue placeholder="Select team leader" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-900 border-white/10 text-slate-200 max-h-60">
                      <SelectItem value="NONE">No Head Assigned</SelectItem>
                      {loadingEmployees ? (
                        <SelectItem value="loading" disabled>Loading employees...</SelectItem>
                      ) : (
                        employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName} ({emp.designation || 'Staff'})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief overview of the department's role and responsibilities..."
                      rows={3}
                      {...field}
                      className="bg-slate-950 border-white/10 text-slate-200 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    Saving...
                  </>
                ) : isEdit ? (
                  'Update Department'
                ) : (
                  'Create Department'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
