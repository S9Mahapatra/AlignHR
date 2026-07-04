"use client";

import {
  CalendarCheck,
  CalendarX,
  Clock,
  LogIn,
  LogOut,
  Wallet,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";

interface Activity {
  id: string;
  type:
    | "leave_applied"
    | "leave_approved"
    | "leave_rejected"
    | "check_in"
    | "check_out"
    | "payroll_generated";
  message: string;
  employeeName: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
  isLoading: boolean;
}

const activityConfig: Record<
  Activity["type"],
  { icon: React.ElementType; color: string; bg: string }
> = {
  leave_applied: {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/20",
  },
  leave_approved: {
    icon: CalendarCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
  },
  leave_rejected: {
    icon: CalendarX,
    color: "text-rose-400",
    bg: "bg-rose-500/20",
  },
  check_in: {
    icon: LogIn,
    color: "text-indigo-400",
    bg: "bg-indigo-500/20",
  },
  check_out: {
    icon: LogOut,
    color: "text-violet-400",
    bg: "bg-violet-500/20",
  },
  payroll_generated: {
    icon: Wallet,
    color: "text-teal-400",
    bg: "bg-teal-500/20",
  },
};

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6">
        <div className="h-4 w-32 bg-slate-800 rounded mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-lg bg-slate-800 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 bg-slate-800 rounded" />
                <div className="h-3 w-1/4 bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
        <Link
          href="/attendance"
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View all
        </Link>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">
          No recent activity
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;
            return (
              <div
                key={activity.id}
                className={cn(
                  "flex items-start gap-3 group",
                  index !== activities.length - 1 &&
                    "pb-4 border-b border-white/5"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                    config.bg
                  )}
                >
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-white">
                      {activity.employeeName}
                    </span>{" "}
                    {activity.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
