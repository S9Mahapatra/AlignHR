'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/shared/form-input';
import { leaveFormSchema } from '@/lib/validations';
import { LEAVE_TYPES } from '@/lib/constants';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';

type LeaveFormValues = z.infer<typeof leaveFormSchema>;

interface LeaveFormProps {
  onSuccess?: (values: LeaveFormValues) => void;
  onCancel?: () => void;
}

export function LeaveForm({ onSuccess, onCancel }: LeaveFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      leaveType: 'PAID',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      reason: '',
    },
  });

  const onSubmit = async (values: LeaveFormValues) => {
    try {
      setSubmitting(true);
      await new Promise((res) => setTimeout(res, 600));
      toast.success('Leave application submitted successfully!');
      if (onSuccess) onSuccess(values);
      form.reset();
    } catch (error) {
      toast.error('Failed to submit time-off application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          control={form.control}
          name="leaveType"
          label="Leave Type"
          type="select"
          options={LEAVE_TYPES.map((t) => ({ value: t.value, label: t.label }))}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput control={form.control} name="startDate" label="Start Date" type="date" />
          <FormInput control={form.control} name="endDate" label="End Date" type="date" />
        </div>

        <FormInput
          control={form.control}
          name="reason"
          label="Reason / Comments"
          type="textarea"
          placeholder="Provide context for your reporting manager..."
          rows={3}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
              className="bg-transparent border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/20"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
