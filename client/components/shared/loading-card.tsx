'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingCardProps {
  count?: number;
  className?: string;
}

export function LoadingCard({ count = 1, className }: LoadingCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} className={cn('glass-card animate-pulse', className)}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <Skeleton className="h-4 w-1/3 bg-slate-800 rounded" />
            <Skeleton className="h-8 w-8 rounded-lg bg-slate-800" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-1/2 bg-slate-800 rounded mb-2" />
            <Skeleton className="h-3 w-3/4 bg-slate-800/60 rounded" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export function LoadingTable({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-white/5 overflow-hidden bg-slate-900/80 backdrop-blur-xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-20 bg-slate-800 rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-5 w-24 bg-slate-800/80 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}
