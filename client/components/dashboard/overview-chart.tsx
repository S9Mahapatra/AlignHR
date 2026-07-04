'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';
import { MOCK_DEPARTMENTS } from '@/lib/mock-data';

interface OverviewChartProps {
  title?: string;
  description?: string;
}

export function OverviewChart({
  title = 'Workforce Distribution & Attendance',
  description = 'Department headcount and operational efficiency metrics',
}: OverviewChartProps) {
  const totalEmp = 8;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          {title}
        </CardTitle>
        <CardDescription className="text-slate-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {MOCK_DEPARTMENTS.map((dept) => {
          const count = dept._count?.employees || 1;
          const pct = Math.round((count / totalEmp) * 100);
          return (
            <div key={dept.id} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-200">{dept.name}</span>
                <span className="text-slate-400 font-mono text-xs">{count} Staff ({pct}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1.5 text-indigo-300 mt-4">
          <div className="font-bold flex items-center gap-1.5 text-white">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Statutory Compliance: 100%
          </div>
          <p className="text-slate-300">
            All tax withholdings, attendance logs, and leave allowances are aligned with Odoo hackathon enterprise guidelines.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
