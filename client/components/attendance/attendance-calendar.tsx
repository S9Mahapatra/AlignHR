'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Attendance } from '@/types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttendanceCalendarProps {
  records?: Attendance[];
  monthName?: string;
  year?: number;
}

export function AttendanceCalendar({
  records = [],
  monthName = 'July',
  year = 2026,
}: AttendanceCalendarProps) {
  const daysInMonth = 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDayStatus = (day: number) => {
    const dayStr = `${year}-07-${String(day).padStart(2, '0')}`;
    const rec = records.find(r => r.date === dayStr);
    if (rec) return rec.status;
    if (day % 7 === 0 || day % 7 === 6) return 'WEEKEND';
    if (day <= 4) return 'PRESENT';
    return undefined;
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            Monthly Attendance Calendar
          </CardTitle>
          <CardDescription className="text-slate-400">
            {monthName} {year} • Workday visual summary
          </CardDescription>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8 border-white/10 bg-slate-950">
            <ChevronLeft className="w-4 h-4 text-slate-300" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 border-white/10 bg-slate-950">
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 pb-2 border-b border-white/5 uppercase font-mono">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div className="text-rose-400">Sat</div><div className="text-rose-400">Sun</div>
        </div>
        <div className="grid grid-cols-7 gap-2 pt-3">
          {days.map((day) => {
            const status = getDayStatus(day);
            const isToday = day === new Date().getDate();
            return (
              <div
                key={day}
                className={`p-2 sm:p-3 rounded-xl border min-h-[64px] flex flex-col justify-between transition-all ${
                  isToday
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                    : status === 'WEEKEND'
                    ? 'border-white/5 bg-slate-950/30 opacity-50'
                    : 'border-white/5 bg-slate-900/60 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold ${isToday ? 'text-indigo-300' : 'text-slate-300'}`}>
                    {day}
                  </span>
                  {isToday && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />}
                </div>
                <div className="mt-1">
                  {status === 'PRESENT' && <StatusBadge status="PRESENT" showIcon={false} className="text-[10px] px-1 py-0" />}
                  {status === 'ABSENT' && <StatusBadge status="ABSENT" showIcon={false} className="text-[10px] px-1 py-0" />}
                  {status === 'HALF_DAY' && <StatusBadge status="HALF_DAY" showIcon={false} className="text-[10px] px-1 py-0" />}
                  {status === 'LEAVE' && <StatusBadge status="LEAVE" showIcon={false} className="text-[10px] px-1 py-0" />}
                  {status === 'WEEKEND' && <span className="text-[9px] text-slate-500 uppercase font-mono">Off</span>}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
