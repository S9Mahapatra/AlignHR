"use client";

import { Clock, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatDate, formatTime } from "@/lib/utils";
import type { Attendance } from "@/types";

const statusVariant: Record<string, "success" | "destructive" | "warning"> = {
  PRESENT: "success",
  ABSENT: "destructive",
  HALF_DAY: "warning",
  LATE: "warning",
};

interface AttendanceTableProps {
  attendance: Attendance[];
  showEmployee: boolean;
}

export function AttendanceTable({
  attendance,
  showEmployee,
}: AttendanceTableProps) {
  if (attendance.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">
            No attendance records
          </h3>
          <p className="text-sm text-slate-400">
            No attendance data found for the selected criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-slate-400">Date</TableHead>
              {showEmployee && (
                <TableHead className="text-slate-400">Employee</TableHead>
              )}
              <TableHead className="text-slate-400">Check In</TableHead>
              <TableHead className="text-slate-400">Check Out</TableHead>
              <TableHead className="text-slate-400 hidden sm:table-cell">
                Work Hours
              </TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.map((record) => (
              <TableRow key={record.id} className="border-white/5">
                <TableCell className="text-slate-300 text-sm">
                  {formatDate(record.date)}
                </TableCell>
                {showEmployee && (
                  <TableCell className="text-slate-300 text-sm">
                    {record.employee
                      ? `${record.employee.firstName} ${record.employee.lastName}`
                      : "—"}
                  </TableCell>
                )}
                <TableCell className="text-sm">
                  {record.checkIn ? (
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Clock className="w-3 h-3" />
                      {formatTime(record.checkIn)}
                    </span>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {record.checkOut ? (
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <Clock className="w-3 h-3" />
                      {formatTime(record.checkOut)}
                    </span>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </TableCell>
                <TableCell className="text-slate-300 text-sm hidden sm:table-cell">
                  {record.workHours ? `${record.workHours}h` : "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusVariant[record.status] || "secondary"}
                  >
                    {record.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
