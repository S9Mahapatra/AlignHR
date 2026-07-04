'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className={cn('flex-1 space-y-6 p-4 md:p-6 lg:p-8 animate-fade-in max-w-7xl mx-auto w-full', className)} {...props}>
      {children}
    </div>
  );
}
