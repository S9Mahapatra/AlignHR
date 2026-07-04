"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { LogIn, LogOut, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiGet, apiPost } from "@/lib/api";
import { formatTime } from "@/lib/utils";

interface CheckInOutProps {
  token: string | undefined;
}

interface TodayStatus {
  checkedIn: boolean;
  checkedOut: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  workHours: number | null;
}

export function CheckInOut({ token }: CheckInOutProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayStatus, setTodayStatus] = useState<TodayStatus>({
    checkedIn: false,
    checkedOut: false,
    checkInTime: null,
    checkOutTime: null,
    workHours: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTodayStatus = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiGet("/api/attendance/today", token);
      if (res) {
        setTodayStatus({
          checkedIn: !!res.checkIn,
          checkedOut: !!res.checkOut,
          checkInTime: res.checkIn || null,
          checkOutTime: res.checkOut || null,
          workHours: res.workHours || null,
        });
      }
    } catch {
      // First time today — not checked in
    }
  }, [token]);

  useEffect(() => {
    fetchTodayStatus();
  }, [fetchTodayStatus]);

  const handleCheckIn = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      await apiPost("/api/attendance/check-in", {}, token);
      toast.success("Checked in successfully! ☀️");
      fetchTodayStatus();
    } catch {
      toast.error("Failed to check in. You may have already checked in today.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      await apiPost("/api/attendance/check-out", {}, token);
      toast.success("Checked out successfully! 🌙");
      fetchTodayStatus();
    } catch {
      toast.error("Failed to check out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dateString = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-indigo-500/10 backdrop-blur-xl border border-indigo-500/20 rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Time Display */}
        <div>
          <p className="text-sm text-slate-400 mb-1">{dateString}</p>
          <p className="text-4xl md:text-5xl font-bold text-white font-mono tracking-wider">
            {timeString}
          </p>

          {/* Status Info */}
          <div className="mt-4 space-y-1">
            {todayStatus.checkedIn && todayStatus.checkInTime && (
              <p className="text-sm text-slate-300 flex items-center gap-2">
                <LogIn className="w-4 h-4 text-emerald-400" />
                Checked in at{" "}
                <span className="text-emerald-400 font-medium">
                  {formatTime(todayStatus.checkInTime)}
                </span>
              </p>
            )}
            {todayStatus.checkedOut && todayStatus.checkOutTime && (
              <p className="text-sm text-slate-300 flex items-center gap-2">
                <LogOut className="w-4 h-4 text-rose-400" />
                Checked out at{" "}
                <span className="text-rose-400 font-medium">
                  {formatTime(todayStatus.checkOutTime)}
                </span>
              </p>
            )}
            {todayStatus.workHours !== null && todayStatus.checkedOut && (
              <p className="text-sm text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Total work hours:{" "}
                <span className="text-indigo-400 font-medium">
                  {todayStatus.workHours}h
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-3">
          {todayStatus.checkedOut ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-sm text-emerald-400 font-medium">
                Day completed!
              </p>
            </div>
          ) : todayStatus.checkedIn ? (
            <Button
              onClick={handleCheckOut}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white h-14 px-8 text-lg shadow-lg shadow-rose-500/20"
            >
              <LogOut className="w-5 h-5 mr-2" />
              {isLoading ? "Processing..." : "Check Out"}
            </Button>
          ) : (
            <Button
              onClick={handleCheckIn}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white h-14 px-8 text-lg shadow-lg shadow-indigo-500/20"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {isLoading ? "Processing..." : "Check In"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
