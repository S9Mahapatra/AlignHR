'use client';

import React from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface FormInputProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'textarea' | 'select';
  description?: string;
  options?: Option[];
  disabled?: boolean;
  className?: string;
  rows?: number;
}

export function FormInput<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  description,
  options = [],
  disabled = false,
  className,
  rows = 3,
}: FormInputProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-slate-300 text-sm font-medium">{label}</FormLabel>
          <FormControl>
            {type === 'textarea' ? (
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                {...field}
                className="bg-slate-950 border-white/10 text-slate-200 resize-none focus:border-indigo-500"
              />
            ) : type === 'select' ? (
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
                <FormControl>
                  <SelectTrigger className="bg-slate-950 border-white/10 text-slate-200 focus:border-indigo-500">
                    <SelectValue placeholder={placeholder || 'Select an option'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-slate-900 border-white/10 text-slate-200 max-h-60">
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                value={field.value || ''}
                className="bg-slate-950 border-white/10 text-slate-200 focus:border-indigo-500"
              />
            )}
          </FormControl>
          {description && <FormDescription className="text-xs text-slate-400">{description}</FormDescription>}
          <FormMessage className="text-xs text-rose-400" />
        </FormItem>
      )}
    />
  );
}
