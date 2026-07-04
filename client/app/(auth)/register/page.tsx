'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/shared/form-input';
import { registerSchema } from '@/lib/validations';
import { apiPost } from '@/lib/api';
import { DEPARTMENTS, DESIGNATIONS, ROLES } from '@/lib/constants';
import { toast } from 'sonner';
import { Layers, ArrowRight, Loader2, Sparkles } from 'lucide-react';

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      employeeId: 'EMP-009',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'EMPLOYEE',
      department: 'Engineering',
      designation: 'Software Engineer',
      phone: '',
      address: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setSubmitting(true);
      const [firstName, ...lastParts] = values.fullName.trim().split(' ');
      const lastName = lastParts.join(' ') || 'User';

      await apiPost('/auth/register', {
        name: values.fullName.trim(),
        employeeId: values.employeeId,
        email: values.email,
        password: values.password,
        role: values.role,
        department: values.department,
        designation: values.designation,
        phone: values.phone,
        address: values.address,
      });

      toast.success('Account created successfully! Please sign in with your new credentials.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 sm:p-6 lg:p-8 relative selection:bg-indigo-500/30">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10 animate-fade-in my-8">
        <div className="flex flex-col items-center mb-6 text-center">
          <Link href="/" className="flex items-center gap-2.5 mb-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AlignHR
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Join the Workday Revolution
          </div>
        </div>

        <Card className="glass-card border-white/10 shadow-2xl bg-slate-900/90 backdrop-blur-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-white text-center">Create your account</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Enter your professional details to set up your AlignHR profile and dashboard access.
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 max-h-[65vh] overflow-y-auto px-6 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    control={form.control}
                    name="fullName"
                    label="Full Name"
                    placeholder="e.g. Liam Gallagher"
                  />
                  <FormInput
                    control={form.control}
                    name="employeeId"
                    label="Employee ID"
                    placeholder="e.g. EMP-009"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    control={form.control}
                    name="email"
                    label="Work Email Address"
                    type="email"
                    placeholder="liam@alignhr.com"
                  />
                  <FormInput
                    control={form.control}
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormInput
                    control={form.control}
                    name="role"
                    label="System Role"
                    type="select"
                    options={[
                      { value: 'EMPLOYEE', label: 'Employee' },
                      { value: 'HR', label: 'HR Manager' },
                      { value: 'ADMIN', label: 'Admin' }
                    ]}
                  />
                  <FormInput
                    control={form.control}
                    name="department"
                    label="Department"
                    type="select"
                    options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
                  />
                  <FormInput
                    control={form.control}
                    name="designation"
                    label="Designation"
                    type="select"
                    options={DESIGNATIONS.map(d => ({ value: d, label: d }))}
                  />
                </div>

                <FormInput
                  control={form.control}
                  name="address"
                  label="Residential Address"
                  placeholder="800 Brannan St, Suite 200, San Francisco, CA 94103"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <FormInput
                    control={form.control}
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                  />
                  <FormInput
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4 pt-6 px-6 border-t border-white/5 bg-slate-950/30">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-semibold text-white shadow-lg shadow-indigo-500/20"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-slate-400">
                  Already have an account?{' '}
                  <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium underline-offset-4 hover:underline">
                    Sign in here
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
