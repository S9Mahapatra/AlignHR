'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { toast } from 'sonner';
import { User, Lock, Shield, Bell, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const names = session?.user?.name ? session.user.name.split(' ') : ['User', 'Name'];
  const initialFirstName = names[0] || '';
  const initialLastName = names.slice(1).join(' ') || '';

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      email: session?.user?.email || '',
      phone: '+91 98765 43210',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = async (values: ProfileFormValues) => {
    try {
      setSavingProfile(true);
      // Simulate API call or call endpoint if employee update is permitted
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Profile information updated successfully');
      if (update) {
        await update({
          ...session,
          user: {
            ...session?.user,
            name: `${values.firstName} ${values.lastName}`,
            email: values.email,
          },
        });
      }
    } catch (error) {
      toast.error('Failed to update profile information');
    } finally {
      setSavingProfile(false);
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    try {
      setSavingPassword(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      toast.success('Password updated successfully. Please use your new password next time you sign in.');
      passwordForm.reset();
    } catch (error) {
      toast.error('Failed to update password. Verify your current password is correct.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Account Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your personal identity, login credentials, and notification preferences.
        </p>
      </div>

      <div className="flex items-center gap-4 p-6 rounded-xl bg-slate-900/80 border border-white/5 backdrop-blur-xl">
        <Avatar className="h-16 w-16 border-2 border-indigo-500/30">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-lg font-bold">
            {getInitials(initialFirstName, initialLastName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-white">{session?.user?.name || 'Authorized User'}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-slate-400">{session?.user?.email}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Shield className="w-3 h-3 mr-1" />
              {session?.user?.role || 'EMPLOYEE'}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-900/90 border border-white/5 p-1 rounded-xl">
          <TabsTrigger
            value="profile"
            className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
          >
            <User className="w-4 h-4 mr-2" />
            Profile Information
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
          >
            <Lock className="w-4 h-4 mr-2" />
            Security & Password
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-white">Personal Information</CardTitle>
              <CardDescription className="text-slate-400">
                Update your contact details and how your name is displayed across AlignHR.
              </CardDescription>
            </CardHeader>

            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">First Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-950 border-white/10 text-slate-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-950 border-white/10 text-slate-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-950 border-white/10 text-slate-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-950 border-white/10 text-slate-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>

                <CardFooter className="border-t border-white/5 bg-slate-950/30 px-6 py-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      'Save Profile'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-white">Change Password</CardTitle>
              <CardDescription className="text-slate-400">
                Ensure your account is using a long, randomized password to stay secure.
              </CardDescription>
            </CardHeader>

            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <CardContent className="space-y-4 max-w-md">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Current Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            className="bg-slate-950 border-white/10 text-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            className="bg-slate-950 border-white/10 text-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            className="bg-slate-950 border-white/10 text-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter className="border-t border-white/5 bg-slate-950/30 px-6 py-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={savingPassword}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20"
                  >
                    {savingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <KeyRound className="mr-2 h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-white">Notification Preferences</CardTitle>
              <CardDescription className="text-slate-400">
                Choose what HR announcements and approval requests you get notified about.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-950/40 border border-white/5">
                <div>
                  <h4 className="font-medium text-slate-200">Leave Approval Updates</h4>
                  <p className="text-xs text-slate-400">Receive email alerts when your leave request is approved or rejected.</p>
                </div>
                <div className="text-emerald-400 font-medium text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Enabled
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-950/40 border border-white/5">
                <div>
                  <h4 className="font-medium text-slate-200">Monthly Payslip Generation</h4>
                  <p className="text-xs text-slate-400">Get notified instantly when a new salary slip is disbursed to your account.</p>
                </div>
                <div className="text-emerald-400 font-medium text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Enabled
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
