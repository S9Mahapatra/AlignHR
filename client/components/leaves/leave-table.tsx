"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X, FileText, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { apiPut } from "@/lib/api";
import type { Leave } from "@/types";

const statusVariant: Record<string, "warning" | "success" | "destructive"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
};

const leaveTypeColor: Record<string, string> = {
  CASUAL: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  SICK: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  EARNED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  UNPAID: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

interface LeaveTableProps {
  leaves: Leave[];
  showEmployee: boolean;
  isAdminOrHR: boolean;
  onRefresh: () => void;
  token: string | undefined;
}

export function LeaveTable({
  leaves,
  showEmployee,
  isAdminOrHR,
  onRefresh,
  token,
}: LeaveTableProps) {
  const [approveId, setApproveId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    if (!approveId || !token) return;
    setIsProcessing(true);
    try {
      await apiPut(`/api/leaves/${approveId}/approve`, {}, token);
      toast.success("Leave approved successfully");
      onRefresh();
    } catch {
      toast.error("Failed to approve leave");
    } finally {
      setIsProcessing(false);
      setApproveId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectId || !token) return;
    setIsProcessing(true);
    try {
      await apiPut(
        `/api/leaves/${rejectId}/reject`,
        { rejectionNote },
        token
      );
      toast.success("Leave rejected");
      onRefresh();
    } catch {
      toast.error("Failed to reject leave");
    } finally {
      setIsProcessing(false);
      setRejectId(null);
      setRejectionNote("");
    }
  };

  if (leaves.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">
            No leave requests
          </h3>
          <p className="text-sm text-slate-400">
            No leave records found for the selected filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                {showEmployee && (
                  <TableHead className="text-slate-400">Employee</TableHead>
                )}
                <TableHead className="text-slate-400">Leave Type</TableHead>
                <TableHead className="text-slate-400">Start Date</TableHead>
                <TableHead className="text-slate-400">End Date</TableHead>
                <TableHead className="text-slate-400 hidden sm:table-cell">
                  Days
                </TableHead>
                <TableHead className="text-slate-400 hidden md:table-cell">
                  Reason
                </TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                {isAdminOrHR && (
                  <TableHead className="text-slate-400 text-right">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((leave) => (
                <TableRow key={leave.id} className="border-white/5">
                  {showEmployee && (
                    <TableCell className="text-slate-300 text-sm">
                      {leave.employee
                        ? `${leave.employee.firstName} ${leave.employee.lastName}`
                        : "—"}
                    </TableCell>
                  )}
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded-md border ${
                        leaveTypeColor[leave.leaveType] ||
                        "bg-slate-500/20 text-slate-300"
                      }`}
                    >
                      {leave.leaveType}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {formatDate(leave.startDate)}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {formatDate(leave.endDate)}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm hidden sm:table-cell">
                    {leave.days}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm max-w-[200px] truncate hidden md:table-cell">
                    {leave.reason || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[leave.status] || "secondary"}>
                      {leave.status}
                    </Badge>
                  </TableCell>
                  {isAdminOrHR && (
                    <TableCell className="text-right">
                      {leave.status === "PENDING" && (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                            onClick={() => setApproveId(leave.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            onClick={() => setRejectId(leave.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Approve Confirmation Dialog */}
      <Dialog open={!!approveId} onOpenChange={() => setApproveId(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Approve Leave</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to approve this leave request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setApproveId(null)}
              className="border-white/10 text-slate-300 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isProcessing ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog with Note */}
      <Dialog open={!!rejectId} onOpenChange={() => setRejectId(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Reject Leave</DialogTitle>
            <DialogDescription className="text-slate-400">
              Provide a reason for rejecting this leave request (optional).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="text-slate-300">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Rejection Note
            </Label>
            <Textarea
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setRejectId(null);
                setRejectionNote("");
              }}
              className="border-white/10 text-slate-300 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {isProcessing ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
