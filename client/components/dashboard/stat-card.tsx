'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isUp: boolean;
  };
  className?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  iconBgColor = 'bg-indigo-500/10',
  iconColor = 'text-indigo-400',
}: StatCardProps) {
  return (
    <Card className={cn('glass-card gradient-border hover:-translate-y-0.5 transition-all duration-300', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconBgColor, iconColor)}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-extrabold text-white font-mono tracking-tight">{value}</div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {trend && (
              <span
                className={cn(
                  'inline-flex items-center font-semibold',
                  trend.isUp ? 'text-emerald-400' : 'text-rose-400'
                )}
              >
                {trend.isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {trend.value}
              </span>
            )}
            {subtitle && <span className="text-slate-400">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
