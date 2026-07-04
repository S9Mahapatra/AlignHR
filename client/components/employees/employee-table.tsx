"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Eye, Edit, Trash2, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate, getInitials } from "@/lib/utils";
import { apiDelete } from "@/lib/api";
import { useState } from "react";
import type { Employee } from "@/types";

const statusVariant: Record<string, "success" | "secondary" | "warning" | "destructive"> = {
  ACTIVE: "success",
  INACTIVE: "secondary",
  ON_LEAVE: "warning",
  TERMINATED: "destructive",
};

interface EmployeeTableProps {
  employees: Employee[];
  isAdminOrHR: boolean;
  onRefresh: () => void;
  token: string | undefined;
}

export function EmployeeTable({
  employees,
  isAdminOrHR,
  onRefresh,
  token,
}: EmployeeTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId || !token) return;
    setIsDeleting(true);
    try {
      await apiDelete(`/api/employees/${deleteId}`, token);
      toast.success("Employee deleted successfully");
      onRefresh();
    } catch {
      toast.error("Failed to delete employee");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (employees.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">
            No employees found
          </h3>
          <p className="text-sm text-slate-400">
            Try adjusting your search or filters, or add a new employee.
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
                <TableHead className="text-slate-400">Employee</TableHead>
                <TableHead className="text-slate-400 hidden md:table-cell">
                  Department
                </TableHead>
                <TableHead className="text-slate-400 hidden lg:table-cell">
                  Designation
                </TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400 hidden lg:table-cell">
                  Joining Date
                </TableHead>
                {isAdminOrHR && (
                  <TableHead className="text-slate-400 text-right">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => {
                const fullName = `${emp.firstName} ${emp.lastName}`;
                return (
                  <TableRow
                    key={emp.id}
                    className="border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                    onClick={() => router.push(`/employees/${emp.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs">
                            {getInitials(fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {fullName}
                          </p>
                          <p className="text-xs text-slate-500">{emp.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-300 text-sm">
                      {emp.department?.name || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-300 text-sm">
                      {emp.designation || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[emp.status] || "secondary"}>
                        {emp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-300 text-sm">
                      {emp.dateOfJoining ? formatDate(emp.dateOfJoining) : "—"}
                    </TableCell>
                    {isAdminOrHR && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-white"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-slate-900 border-white/10 text-white"
                          >
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/employees/${emp.id}`);
                              }}
                              className="text-slate-300 focus:text-white focus:bg-white/5"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/employees/${emp.id}`);
                              }}
                              className="text-slate-300 focus:text-white focus:bg-white/5"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(emp.id);
                              }}
                              className="text-rose-400 focus:text-rose-300 focus:bg-rose-500/10"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this employee? This action cannot
              be undone. All associated data including attendance, leave, and
              payroll records will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="border-white/10 text-slate-300 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
