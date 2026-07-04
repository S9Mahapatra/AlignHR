'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import AdminDashboardPage from './admin/page';
import EmployeeDashboardPage from './employee/page';
import { Loader2 } from 'lucide-react';

export default function DashboardIndexPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-sm font-medium">Loading your workday dashboard...</p>
        </div>
      </div>
    );
  }

  const role = session?.user?.role || 'EMPLOYEE';

  if (role === 'ADMIN' || role === 'HR') {
    return <AdminDashboardPage />;
  }

  return <EmployeeDashboardPage />;
}
