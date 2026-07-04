'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { ActivityItem, MOCK_ACTIVITIES } from '@/lib/mock-data';
import { Activity, Clock } from 'lucide-react';

interface ActivityFeedProps {
  activities?: ActivityItem[];
  title?: string;
  description?: string;
  limit?: number;
}

export function ActivityFeed({
  activities = MOCK_ACTIVITIES,
  title = 'Recent Activity Feed',
  description = 'Real-time updates across workforce operations',
  limit = 5,
}: ActivityFeedProps) {
  const displayed = activities.slice(0, limit);

  return (
    <Card className="glass-card flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          {title}
        </CardTitle>
        <CardDescription className="text-slate-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayed.map((act) => (
          <div key={act.id} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
            <Avatar className="h-8 w-8 mt-0.5 border border-white/10 shrink-0">
              <AvatarImage src={act.user.avatar || undefined} />
              <AvatarFallback className="bg-indigo-600/30 text-indigo-300 text-xs font-bold">
                {getInitials(act.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-200 flex items-center justify-between gap-2">
                <span className="truncate">{act.title}</span>
                <span className="text-[10px] text-slate-500 font-mono shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {act.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{act.description}</p>
            </div>
          </div>
        ))}
        {displayed.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs">No recent activities logged.</div>
        )}
      </CardContent>
    </Card>
  );
}
