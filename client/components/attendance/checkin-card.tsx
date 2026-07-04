'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, LogOut, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface CheckinCardProps {
  onClockChange?: (checkedIn: boolean, time: string) => void;
  initialCheckedIn?: boolean;
}

export function CheckinCard({ onClockChange, initialCheckedIn = false }: CheckinCardProps) {
  const [checkedIn, setCheckedIn] = useState(initialCheckedIn);
  const [checkInTime, setCheckInTime] = useState<string | null>(initialCheckedIn ? '08:55 AM' : null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  const handleToggle = () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!checkedIn) {
      setCheckedIn(true);
      setCheckInTime(nowStr);
      setCheckOutTime(null);
      toast.success(`Clocked in at ${nowStr}! Have an awesome workday.`);
      if (onClockChange) onClockChange(true, nowStr);
    } else {
      setCheckedIn(false);
      setCheckOutTime(nowStr);
      toast.success(`Clocked out at ${nowStr}! Shift hours recorded.`);
      if (onClockChange) onClockChange(false, nowStr);
    }
  };

  return (
    <Card className="glass-card gradient-border relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className={`w-5 h-5 ${checkedIn ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
            Live Workday Clock
          </CardTitle>
          <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
            checkedIn
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-slate-800 border-white/10 text-slate-400'
          }`}>
            {checkedIn ? 'SHIFT ACTIVE' : 'OFF DUTY'}
          </span>
        </div>
        <CardDescription className="text-slate-400">
          Record daily attendance with automatic timestamping and geolocation verification.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-white/5 font-mono text-center">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-sans">Clock In</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{checkInTime || '--:--'}</div>
          </div>
          <div className="border-l border-white/5">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-sans">Clock Out</div>
            <div className="text-lg font-bold text-slate-300 mt-0.5">{checkOutTime || '--:--'}</div>
          </div>
        </div>

        <Button
          onClick={handleToggle}
          size="lg"
          className={`w-full font-bold shadow-lg text-sm sm:text-base h-12 ${
            checkedIn
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20'
          }`}
        >
          <Clock className="w-5 h-5 mr-2" />
          {checkedIn ? 'Clock Out of Shift' : 'Clock In for Today'}
        </Button>
      </CardContent>
    </Card>
  );
}
