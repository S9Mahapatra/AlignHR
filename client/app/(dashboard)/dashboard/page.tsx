"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { RefreshCw, Clock, Calendar, Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet, apiPost } from "@/lib/api";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Charts } from "@/components/dashboard/charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import type { DashboardStats } from "@/types";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const role = session?.user?.role || "EMPLOYEE";
  const userName = session?.user?.name || "User";

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [departmentDistribution, setDepartmentDistribution] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [statsRes, trendRes, deptRes, activityRes] = await Promise.allSettled([
        apiGet("/api/dashboard/stats", token),
        apiGet("/api/dashboard/attendance-trend", token),
        apiGet("/api/dashboard/department-distribution", token),
        apiGet("/api/dashboard/recent-activity", token),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value);
      if (trendRes.status === "fulfilled") setAttendanceTrend(trendRes.value || []);
      if (deptRes.status === "fulfilled") setDepartmentDistribution(deptRes.value || []);
      if (activityRes.status === "fulfilled") setActivities(activityRes.value || []);
    } catch {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const isAdminOrHR = role === "ADMIN" || role === "HR";

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Welcome back, {userName.split(" ")[0]}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Here&apos;s what&apos;s happening in your organization today.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDashboardData}
          disabled={isLoading}
          className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isAdminOrHR ? (
        /* Admin/HR Dashboard */
        <>
          <StatsCards stats={stats} isLoading={isLoading} />
          <Charts
            attendanceTrend={attendanceTrend}
            departmentDistribution={departmentDistribution}
            isLoading={isLoading}
          />
          <RecentActivity activities={activities} isLoading={isLoading} />
        </>
      ) : (
        /* Employee Dashboard */
        <EmployeeDashboard token={token} isLoading={isLoading} />
      )}
    </div>
  );
}

/** Employee-specific dashboard with personal stats and quick actions. */
function EmployeeDashboard({
  token,
  isLoading: parentLoading,
}: {
  token: string | undefined;
  isLoading: boolean;
}) {
  const [myStats, setMyStats] = useState({
    attendanceThisMonth: 0,
    pendingLeaves: 0,
    nextPayslip: "—",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  const fetchMyStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiGet("/api/dashboard/my-stats", token);
      if (res) {
        setMyStats({
          attendanceThisMonth: res.attendanceThisMonth || 0,
          pendingLeaves: res.pendingLeaves || 0,
          nextPayslip: res.nextPayslip || "—",
        });
      }
    } catch {
      // Silently handle — stats may not be available
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMyStats();
  }, [fetchMyStats]);

  const handleQuickCheckIn = async () => {
    if (!token) return;
    setCheckingIn(true);
    try {
      await apiPost("/api/attendance/check-in", {}, token);
      toast.success("Checked in successfully!");
    } catch {
      toast.error("Failed to check in. You may have already checked in today.");
    } finally {
      setCheckingIn(false);
    }
  };

  const loading = parentLoading || isLoading;

  const personalCards = [
    {
      label: "Attendance This Month",
      value: `${myStats.attendanceThisMonth} days`,
      icon: Clock,
      bg: "bg-indigo-500/20 text-indigo-400",
    },
    {
      label: "Pending Leaves",
      value: `${myStats.pendingLeaves}`,
      icon: Calendar,
      bg: "bg-amber-500/20 text-amber-400",
    },
    {
      label: "Next Payslip",
      value: myStats.nextPayslip,
      icon: Wallet,
      bg: "bg-emerald-500/20 text-emerald-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Personal Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {loading
          ? [...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 bg-slate-800 rounded-xl" />
            ))
          : personalCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">{card.label}</p>
                      <p className="text-xl font-bold text-white mt-0.5">
                        {card.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={handleQuickCheckIn}
            disabled={checkingIn}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 h-12 text-white"
          >
            <Clock className="w-4 h-4 mr-2" />
            {checkingIn ? "Checking in..." : "Quick Check In"}
          </Button>
          <Link href="/leaves">
            <Button
              variant="outline"
              className="w-full border-white/10 text-slate-300 hover:bg-white/5 hover:text-white h-12"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Apply for Leave
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
