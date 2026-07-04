"use client";

import { Users, Building2, CalendarClock, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

interface StatCardItem {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards: StatCardItem[] = [
    {
      label: "Total Employees",
      value: stats?.totalEmployees || 0,
      icon: Users,
      gradient: "from-indigo-500 to-blue-500",
      iconBg: "bg-indigo-500/20 text-indigo-400",
    },
    {
      label: "Departments",
      value: stats?.totalDepartments || 0,
      icon: Building2,
      gradient: "from-violet-500 to-purple-500",
      iconBg: "bg-violet-500/20 text-violet-400",
    },
    {
      label: "Pending Leaves",
      value: stats?.pendingLeaves || 0,
      icon: CalendarClock,
      gradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-500/20 text-amber-400",
    },
    {
      label: "Present Today",
      value: stats?.presentToday || 0,
      icon: UserCheck,
      gradient: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-500/20 text-emerald-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-20 bg-slate-800 rounded" />
                <div className="h-7 w-14 bg-slate-800 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                  card.iconBg
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400">{card.label}</p>
                <p className="text-2xl font-bold text-white mt-0.5">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
