'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShieldCheck,
  Users,
  Clock,
  Calendar,
  DollarSign,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  BarChart3,
  Layers
} from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#roles" className="hover:text-white transition-colors">Role Benefits</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#preview" className="hover:text-white transition-colors">Preview</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium shadow-lg shadow-indigo-500/25 border-0">
                Get Started
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 md:pt-32 md:pb-40 overflow-hidden">
        {/* Ambient glow lights */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -z-10 flex justify-center">
          <div className="w-[800px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-transparent blur-[130px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Hackathon-Ready Enterprise HRMS
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            {APP_TAGLINE.split(',')[0]}, <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
              perfectly aligned.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            A modern Human Resource Management System built for employee onboarding, real-time attendance tracking, automated leave approvals, and crystal-clear payroll visibility.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/25 font-semibold">
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base border-white/10 bg-slate-900/50 hover:bg-white/5 text-slate-200 font-semibold">
                Sign In to Demo
              </Button>
            </Link>
          </div>

          {/* Quick stats banner */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/5">
            <div>
              <div className="text-2xl font-bold text-white font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Digitized Operations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-400 font-mono">3 Roles</div>
              <div className="text-xs text-slate-400 mt-0.5">Admin, HR & Employee</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">&lt; 1 sec</div>
              <div className="text-xs text-slate-400 mt-0.5">Real-Time Clock In</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-violet-400 font-mono">Automated</div>
              <div className="text-xs text-slate-400 mt-0.5">Tax & Salary Payroll</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-24 bg-slate-950/50 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Digitize Your Core HR Operations
            </h2>
            <p className="text-slate-400 text-base">
              Say goodbye to fragmented spreadsheets and email threads. AlignHR unites every workforce module under one sleek, high-performance interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Users className="w-6 h-6 text-indigo-400" />,
                title: "Employee Profiles",
                desc: "Centralized employee directories with comprehensive personal, departmental, emergency contact, and compensation histories."
              },
              {
                icon: <Clock className="w-6 h-6 text-emerald-400" />,
                title: "Attendance Tracking",
                desc: "Instant clock-in/out widgets with automatic work hour calculations, half-day detection, and monthly visual calendars."
              },
              {
                icon: <Calendar className="w-6 h-6 text-amber-400" />,
                title: "Leave Approvals",
                desc: "Streamlined time-off requests with real-time balance tracking for casual, sick, and earned leaves with 1-click HR approval queues."
              },
              {
                icon: <DollarSign className="w-6 h-6 text-violet-400" />,
                title: "Payroll Visibility",
                desc: "Transparent monthly payslips with automated computation of basic salary, HRA, DA, bonuses, tax withholdings, and net disbursements."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
                title: "Role-Based Access",
                desc: "Enterprise-grade RBAC security isolating sensitive salary and organizational settings to authorized Admin and HR personnel."
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-rose-400" />,
                title: "HR Analytics Dashboard",
                desc: "Interactive visual charts tracking departmental headcount distribution, daily attendance rates, and recent activity logs."
              }
            ].map((feat, idx) => (
              <Card key={idx} className="glass-card gradient-border hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Benefits Section */}
      <section id="roles" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Tailored for Every Stakeholder
            </h2>
            <p className="text-slate-400 text-base">
              Whether you are managing 500 employees or checking your own payslip, AlignHR delivers an interface crafted specifically for your daily workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                role: "Employees",
                badge: "Self-Service Portal",
                color: "border-indigo-500/30 bg-indigo-500/5",
                items: [
                  "1-click daily attendance clock-in & clock-out",
                  "View live leave balances & request time off in seconds",
                  "Download monthly compensation slips & tax breakdowns",
                  "Update personal emergency contacts & address details"
                ]
              },
              {
                role: "HR Managers",
                badge: "Workforce Control",
                color: "border-violet-500/30 bg-violet-500/5",
                items: [
                  "Approve or reject leave requests with custom feedback",
                  "Monitor daily organization-wide present & absent rates",
                  "Onboard new joiners and assign departmental mentors",
                  "Track attendance anomalies and late arrivals seamlessly"
                ]
              },
              {
                role: "System Admins",
                badge: "Executive Governance",
                color: "border-emerald-500/30 bg-emerald-500/5",
                items: [
                  "1-click automated monthly payroll computation & disbursement",
                  "Manage department hierarchies & leadership assignments",
                  "Full control over employee status, salaries & role permissions",
                  "Real-time audit logs of system activities and data exports"
                ]
              }
            ].map((col, idx) => (
              <div key={idx} className={`p-8 rounded-2xl border ${col.color} backdrop-blur-xl flex flex-col justify-between space-y-6`}>
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {col.badge}
                  </span>
                  <h3 className="text-2xl font-bold text-white">{col.role}</h3>
                  <ul className="space-y-3.5 pt-2">
                    {col.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/login">
                  <Button variant="outline" className="w-full bg-transparent border-white/10 hover:bg-white/5 text-slate-200">
                    Explore {col.role} View
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section id="preview" className="py-24 bg-slate-950/80 border-t border-white/5 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Designed with Precision & Polish
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Built with state-of-the-art glassmorphism, responsive data grids, and zero visual clutter. Experience what modern enterprise software should feel like.
            </p>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl overflow-hidden p-2 sm:p-4">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 mb-4 bg-slate-950/60 rounded-t-lg">
              <div className="w-3 h-3 rounded-full bg-rose-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="text-xs text-slate-400 font-mono ml-2">alignhr.app/dashboard/admin</span>
            </div>

            {/* Simulated UI layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left p-2 sm:p-4">
              <div className="col-span-1 hidden md:block space-y-2 p-3 rounded-xl bg-slate-950/40 border border-white/5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Navigation</div>
                {['Dashboard', 'Employees', 'Attendance', 'Leave Approvals', 'Payroll', 'Settings'].map((item, i) => (
                  <div key={i} className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${i === 0 ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400'}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="col-span-1 md:col-span-3 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                    <div className="text-xs text-slate-400">Total Workforce</div>
                    <div className="text-2xl font-bold text-white mt-1">128 Staff</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                    <div className="text-xs text-slate-400">Present Today</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">96.4%</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                    <div className="text-xs text-slate-400">Pending Leaves</div>
                    <div className="text-2xl font-bold text-amber-400 mt-1">4 Requests</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-3">
                  <div className="text-sm font-semibold text-white">Recent Workforce Activity</div>
                  {[
                    { name: 'Sarah Jenkins', action: 'Approved 3 days casual leave for Lucas Silva', time: '10m ago' },
                    { name: 'John Doe', action: 'Clocked in at 08:55 AM (On Time)', time: '1h ago' },
                    { name: 'Liam Gallagher', action: 'Onboarded as Product Manager in Product & Design', time: '4h ago' }
                  ].map((act, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-xs sm:text-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                          {act.name[0]}
                        </div>
                        <span className="text-slate-200 font-medium">{act.name}</span>
                        <span className="text-slate-400 hidden sm:inline">— {act.action}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-xs">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-slate-900/80 border border-indigo-500/20 backdrop-blur-2xl space-y-8 shadow-2xl relative">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Ready to Align Your Workday?
              </h2>
              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
                Step inside our hackathon demo environment right now. Test Admin, HR, or Employee workflows in one click.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-base bg-white text-slate-950 hover:bg-slate-100 font-bold shadow-lg">
                  Get Started For Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/20 bg-transparent hover:bg-white/10 text-white font-bold">
                  Sign In to Live Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#030712] text-sm text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">{APP_NAME}</span>
            <span className="text-slate-500">|</span>
            <span>{APP_TAGLINE}</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <span className="text-slate-600">© 2026 AlignHR. Built for Odoo Hackathon.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
