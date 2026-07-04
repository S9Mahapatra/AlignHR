"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Plus, Calendar, CheckCircle, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet } from "@/lib/api";
import { LeaveTable } from "@/components/leaves/leave-table";
import { LeaveForm } from "@/components/leaves/leave-form";
import type { Leave } from "@/types";

interface LeaveBalance {
  casual: number;
  sick: number;
  earned: number;
  remaining: {
    casual: number;
    sick: number;
    earned: number;
  };
}

export default function LeavesPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const role = session?.user?.role || "EMPLOYEE";
  const isAdminOrHR = role === "ADMIN" || role === "HR";

  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchLeaves = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const endpoint = isAdminOrHR ? "/api/leaves" : "/api/leaves/my";
      const [leavesRes, balanceRes] = await Promise.allSettled([
        apiGet(endpoint, token),
        !isAdminOrHR ? apiGet("/api/leaves/balance", token) : Promise.resolve(null),
      ]);

      if (leavesRes.status === "fulfilled") setLeaves(leavesRes.value || []);
      if (balanceRes.status === "fulfilled" && balanceRes.value) {
        setLeaveBalance(balanceRes.value);
      }
    } catch {
      toast.error("Failed to fetch leave data");
    } finally {
      setIsLoading(false);
    }
  }, [token, isAdminOrHR]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const filteredLeaves =
    statusFilter === "all"
      ? leaves
      : leaves.filter((l) => l.status === statusFilter);

  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchLeaves();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Leaves
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isAdminOrHR
              ? "Manage employee leave requests"
              : "Apply for leave and track your requests"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdminOrHR && pendingCount > 0 && (
            <Badge
              variant="warning"
              className="px-3 py-1.5 text-sm"
            >
              <Clock className="w-3 h-3 mr-1" />
              {pendingCount} Pending
            </Badge>
          )}
          {!isAdminOrHR && (
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Apply for Leave
            </Button>
          )}
        </div>
      </div>

      {/* Leave Balance for Employees */}
      {!isAdminOrHR && leaveBalance && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <LeaveBalanceCard
            label="Casual Leave"
            used={leaveBalance.casual - (leaveBalance.remaining?.casual ?? 0)}
            total={leaveBalance.casual}
            remaining={leaveBalance.remaining?.casual ?? 0}
            color="indigo"
          />
          <LeaveBalanceCard
            label="Sick Leave"
            used={leaveBalance.sick - (leaveBalance.remaining?.sick ?? 0)}
            total={leaveBalance.sick}
            remaining={leaveBalance.remaining?.sick ?? 0}
            color="emerald"
          />
          <LeaveBalanceCard
            label="Earned Leave"
            used={leaveBalance.earned - (leaveBalance.remaining?.earned ?? 0)}
            total={leaveBalance.earned}
            remaining={leaveBalance.remaining?.earned ?? 0}
            color="amber"
          />
        </div>
      )}

      {/* Status Filter Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="bg-slate-900/80 border border-white/5">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-white"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="PENDING"
            className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-white"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="APPROVED"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-white"
          >
            Approved
          </TabsTrigger>
          <TabsTrigger
            value="REJECTED"
            className="data-[state=active]:bg-rose-500/20 data-[state=active]:text-white"
          >
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-4">
          {isLoading ? (
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 bg-slate-800 rounded-lg" />
              ))}
            </div>
          ) : (
            <LeaveTable
              leaves={filteredLeaves}
              showEmployee={isAdminOrHR}
              isAdminOrHR={isAdminOrHR}
              onRefresh={fetchLeaves}
              token={token}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Leave Application Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Apply for Leave
            </DialogTitle>
          </DialogHeader>
          <LeaveForm
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
            token={token}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Leave balance card component */
function LeaveBalanceCard({
  label,
  used,
  total,
  remaining,
  color,
}: {
  label: string;
  used: number;
  total: number;
  remaining: number;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; bar: string }> = {
    indigo: {
      bg: "bg-indigo-500/20",
      text: "text-indigo-400",
      bar: "bg-indigo-500",
    },
    emerald: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      bar: "bg-emerald-500",
    },
    amber: {
      bg: "bg-amber-500/20",
      text: "text-amber-400",
      bar: "bg-amber-500",
    },
  };

  const c = colorMap[color] || colorMap.indigo;
  const percentage = total > 0 ? ((total - remaining) / total) * 100 : 0;

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
            <Calendar className={`w-4 h-4 ${c.text}`} />
          </div>
          <span className="text-sm text-slate-300">{label}</span>
        </div>
        <span className={`text-lg font-bold ${c.text}`}>{remaining}</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-1.5">
        <div
          className={`${c.bar} h-1.5 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">
        {used} used of {total} days
      </p>
    </div>
  );
}
