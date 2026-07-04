'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { getInitials, formatCurrency } from '@/lib/utils';
import { MOCK_EMPLOYEES } from '@/lib/mock-data';
import { toast } from 'sonner';
import {
  User,
  Briefcase,
  DollarSign,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit3,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const isAdminOrHR = session?.user?.role === 'ADMIN' || session?.user?.role === 'HR';
  const isAdmin = session?.user?.role === 'ADMIN';

  const [employee, setEmployee] = useState(
    MOCK_EMPLOYEES.find(e => e.email === session?.user?.email) || MOCK_EMPLOYEES[2]
  );
  
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [phone, setPhone] = useState(employee.phone || '');
  const [address, setAddress] = useState(employee.address || '');
  const [city, setCity] = useState(employee.city || '');
  const [emergencyContact, setEmergencyContact] = useState(employee.emergencyContact || '');
  const [emergencyPhone, setEmergencyPhone] = useState(employee.emergencyPhone || '');
  
  // Admin only edit fields
  const [designation, setDesignation] = useState(employee.designation || '');
  const [salary, setSalary] = useState(String(employee.salary || 120000));

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setEmployee(prev => ({
        ...prev,
        phone,
        address,
        city,
        emergencyContact,
        emergencyPhone,
        designation: isAdminOrHR ? designation : prev.designation,
        salary: isAdmin ? parseFloat(salary) : prev.salary,
      }));

      toast.success('Profile information updated successfully!');
      setEditOpen(false);
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
      {/* Profile Header Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/50 via-slate-900/90 to-violet-900/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-indigo-500/30 shadow-xl">
                <AvatarImage src={employee.avatar || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-2xl font-bold">
                  {getInitials(employee.name || employee.firstName, employee.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-white" title="Active Account">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {employee.name || `${employee.firstName} ${employee.lastName}`}
                </h1>
                <StatusBadge status={employee.profile?.status || employee.status || 'UNKNOWN'} />
                <StatusBadge status={session?.user?.role || employee.user?.role || 'EMPLOYEE'} />
              </div>
              <div className="text-base font-medium text-indigo-300">
                {employee.designation} • <span className="text-slate-300">{employee.department?.name || 'Engineering'}</span>
              </div>
              <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 font-mono">
                <span>ID: {employee.employeeCode}</span>
                <span>•</span>
                <span>Joined: {new Date(employee.dateOfJoining).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setEditOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/20"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Grid: Personal Details & Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Card */}
        <Card className="glass-card flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              Personal & Contact Details
            </CardTitle>
            <CardDescription className="text-slate-400">Your verified residential address and emergency contacts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Address</span>
              <span className="col-span-2 text-white font-mono">{employee.email}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone Number</span>
              <span className="col-span-2 text-white font-mono">{employee.phone || '+1 (555) 000-0000'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Residential Address</span>
              <span className="col-span-2 text-white">{employee.address}, {employee.city}, {employee.state} {employee.zipCode}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2">
              <span className="text-slate-400 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Emergency Contact</span>
              <span className="col-span-2 text-white">
                <div>{employee.emergencyContact || 'Jane Doe (Spouse)'}</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{employee.emergencyPhone || '+1 (555) 999-9999'}</div>
              </span>
            </div>
          </CardContent>
          <CardFooter className="pt-3 border-t border-white/5 bg-slate-950/30 text-xs text-slate-500">
            Last verified by HR Operations on Jan 2026
          </CardFooter>
        </Card>

        {/* Job Details Card */}
        <Card className="glass-card flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-violet-400" />
              Job & Organizational Details
            </CardTitle>
            <CardDescription className="text-slate-400">Department placement and leadership hierarchy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
              <span className="text-slate-400">Department</span>
              <span className="col-span-2 text-white font-semibold">{employee.department?.name || 'Engineering'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
              <span className="text-slate-400">Designation</span>
              <span className="col-span-2 text-white">{employee.designation}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
              <span className="text-slate-400">Reporting Manager</span>
              <span className="col-span-2 text-white">Sarah Jenkins (Chief Technology Officer)</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2">
              <span className="text-slate-400">Employment Status</span>
              <span className="col-span-2"><StatusBadge status={employee.profile?.status || employee.status || 'UNKNOWN'} /></span>
            </div>
          </CardContent>
          <CardFooter className="pt-3 border-t border-white/5 bg-slate-950/30 text-xs text-slate-500">
            Full-time permanent employee contract
          </CardFooter>
        </Card>
      </div>

      {/* Grid: Salary Overview & Documents Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salary Overview Card */}
        <Card className="glass-card flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Compensation & Salary Overview
            </CardTitle>
            <CardDescription className="text-slate-400">Current annual and monthly earnings breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-teal-950/30 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Annual Base Salary</div>
                <div className="text-2xl font-bold text-white font-mono mt-1">{formatCurrency(employee.salary)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Monthly Gross</div>
                <div className="text-lg font-bold text-emerald-300 font-mono mt-0.5">{formatCurrency((employee.salary) / 12)}</div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-white/5 text-slate-300">
                <span>House Rent Allowance (HRA 40%)</span>
                <span className="font-mono text-emerald-400">+{formatCurrency((employee.salary * 0.4) / 12)} /mo</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5 text-slate-300">
                <span>Dearness Allowance (DA 20%)</span>
                <span className="font-mono text-emerald-400">+{formatCurrency((employee.salary * 0.2) / 12)} /mo</span>
              </div>
              <div className="flex justify-between py-1.5 text-slate-300">
                <span>Standard Income Tax Deduction</span>
                <span className="font-mono text-rose-400">-{formatCurrency((employee.salary * 0.15) / 12)} /mo</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-3 border-t border-white/5 bg-slate-950/30 text-xs text-slate-400 justify-between">
            <span>Direct deposit bank: Chase ****4392</span>
            <span className="text-indigo-400">Next payout: July 30</span>
          </CardFooter>
        </Card>

        {/* Documents Section Card */}
        <Card className="glass-card flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Verified HR Documents
            </CardTitle>
            <CardDescription className="text-slate-400">Official certificates and compliance disclosures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'Employment Offer Letter & Terms.pdf', size: '2.4 MB', date: 'Mar 2024', status: 'VERIFIED' },
              { title: 'Form W-4 Tax Withholding 2026.pdf', size: '1.1 MB', date: 'Jan 2026', status: 'VERIFIED' },
              { title: 'Confidentiality & NDA Agreement.pdf', size: '3.8 MB', date: 'Mar 2024', status: 'VERIFIED' },
              { title: 'Direct Deposit Authorization Form.pdf', size: '890 KB', date: 'Mar 2024', status: 'VERIFIED' }
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:bg-slate-800/60 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{doc.title}</div>
                    <div className="text-xs text-slate-400 font-mono">{doc.size} • Uploaded {doc.date}</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter className="pt-3 border-t border-white/5 bg-slate-950/30 text-xs text-slate-500 justify-between">
            <span>All 4 mandatory documents uploaded</span>
            <span className="text-emerald-400 font-medium">100% Compliant</span>
          </CardFooter>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px] bg-slate-900 border-white/10 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Edit3 className="w-5 h-5 text-indigo-400" />
              Edit Profile Information
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Update your contact details and emergency information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 max-h-[60vh] overflow-y-auto px-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone Number</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-slate-950 border-white/10 text-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Address</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-slate-950 border-white/10 text-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">City & State</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-slate-950 border-white/10 text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Emergency Contact</label>
                <Input
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="bg-slate-950 border-white/10 text-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Emergency Phone</label>
                <Input
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="bg-slate-950 border-white/10 text-slate-200"
                />
              </div>
            </div>

            {isAdminOrHR && (
              <div className="pt-3 border-t border-white/10 space-y-4 bg-slate-950/40 p-3 rounded-xl border border-indigo-500/20">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Admin / HR Privileged Fields
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Designation</label>
                    <Input
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="bg-slate-900 border-white/10 text-slate-200"
                    />
                  </div>
                  {isAdmin && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Annual Base Salary ($)</label>
                      <Input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="bg-slate-900 border-white/10 text-slate-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-white/5">
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={saving}
              className="bg-transparent border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
