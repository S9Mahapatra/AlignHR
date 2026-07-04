"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet } from "@/lib/api";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { CheckInOut } from "@/components/attendance/check-in-out";
import type { Attendance } from "@/types";

export default function AttendancePage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const role = session?.user?.role || "EMPLOYEE";
  const isAdminOrHR = role === "ADMIN" || role === "HR";

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchAttendance = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const endpoint = isAdminOrHR
        ? `/api/attendance?date=${dateFilter}`
        : "/api/attendance/my";
      const res = await apiGet(endpoint, token);
      setAttendance(res || []);
    } catch {
      toast.error("Failed to fetch attendance data");
    } finally {
      setIsLoading(false);
    }
  }, [token, isAdminOrHR, dateFilter]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Attendance
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {isAdminOrHR
            ? "Track and manage employee attendance"
            : "View your attendance records and check in/out"}
        </p>
      </div>

      {/* Check In/Out Card for Employees */}
      {!isAdminOrHR && <CheckInOut token={token} />}

      {/* Date Filter for Admin/HR */}
      {isAdminOrHR && (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <Label className="text-slate-300 text-sm">Filter by Date:</Label>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-auto bg-slate-800/50 border-slate-700 text-white [color-scheme:dark]"
            />
          </div>
        </div>
      )}

      {/* Attendance Table */}
      {isLoading ? (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 bg-slate-800 rounded-lg" />
          ))}
        </div>
      ) : (
        <AttendanceTable
          attendance={attendance}
          showEmployee={isAdminOrHR}
        />
      )}
    </div>
  );
}
