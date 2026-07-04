"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  DollarSign,
  Edit,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { apiGet } from "@/lib/api";
import { formatDate, formatTime, formatCurrency, getInitials } from "@/lib/utils";
import { EmployeeForm } from "@/components/employees/employee-form";
import type { Employee, Attendance, Leave, Payroll } from "@/types";

const statusVariant: Record<string, "success" | "secondary" | "warning" | "destructive"> = {
  ACTIVE: "success",
  INACTIVE: "secondary",
  ON_LEAVE: "warning",
  TERMINATED: "destructive",
};

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const role = session?.user?.role || "EMPLOYEE";
  const isAdminOrHR = role === "ADMIN" || role === "HR";
  const router = useRouter();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchEmployee = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [empRes, attRes, leaveRes, payRes] = await Promise.allSettled([
        apiGet<{ success: boolean; data: any }>("/api/employees/" + id, token),
        apiGet<{ success: boolean; data: any[] }>("/api/attendance?employeeId=" + id, token),
        apiGet<{ success: boolean; data: any[] }>("/api/leaves?employeeId=" + id, token),
        apiGet<{ success: boolean; data: any[] }>("/api/payroll/" + id, token),
      ]);

      if (empRes.status === "fulfilled") setEmployee(empRes.value?.data || empRes.value);
      if (attRes.status === "fulfilled") setAttendance(attRes.value?.data || attRes.value || []);
      if (leaveRes.status === "fulfilled") setLeaves(leaveRes.value?.data || leaveRes.value || []);
      if (payRes.status === "fulfilled") setPayrolls(payRes.value?.data || payRes.value || []);
    } catch {
      toast.error("Failed to fetch employee details");
    } finally {
      setIsLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleEditSuccess = () => {
    setIsEditOpen(false);
    fetchEmployee();
    toast.success("Employee updated successfully!");
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-8 w-24 bg-slate-800" />
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-8">
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full bg-slate-800" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 bg-slate-800" />
              <Skeleton className="h-4 w-32 bg-slate-800" />
            </div>
          </div>
        </div>
        <Skeleton className="h-64 bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <User className="w-12 h-12 text-slate-600 mb-4" />
        <p className="text-slate-400">Employee not found</p>
        <Button
          variant="outline"
          className="mt-4 border-white/10 text-slate-300"
          onClick={() => router.push("/employees")}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/employees")}
        className="text-slate-400 hover:text-white -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Employees
      </Button>

      {/* Profile Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-2xl font-bold">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-2xl font-bold text-white">{fullName}</h1>
              <Badge variant={statusVariant[employee.status] || "secondary"}>
                {employee.status}
              </Badge>
            </div>
            <p className="text-slate-400 mt-1">{employee.designation}</p>
            <p className="text-sm text-slate-500">
              {employee.department?.name || "No Department"} • {employee.employeeCode}
            </p>
          </div>
          {isAdminOrHR && (
            <Button
              onClick={() => setIsEditOpen(true)}
              variant="outline"
              className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-900/80 border border-white/5">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-white"
          >
            Attendance
          </TabsTrigger>
          <TabsTrigger
            value="leaves"
            className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-white"
          >
            Leaves
          </TabsTrigger>
          <TabsTrigger
            value="payroll"
            className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-white"
          >
            Payroll
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                <InfoRow icon={Mail} label="Email" value={employee.email} />
                <InfoRow icon={Phone} label="Phone" value={employee.phone || "—"} />
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={employee.dateOfBirth ? formatDate(employee.dateOfBirth) : "—"}
                />
                <InfoRow icon={User} label="Gender" value={employee.gender || "—"} />
                <InfoRow icon={MapPin} label="Address" value={employee.address || "—"} />
              </div>
            </div>

            {/* Employment Info */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">
                Employment Information
              </h3>
              <div className="space-y-4">
                <InfoRow
                  icon={Building2}
                  label="Department"
                  value={employee.department?.name || "—"}
                />
                <InfoRow
                  icon={Briefcase}
                  label="Designation"
                  value={employee.designation || "—"}
                />
                <InfoRow
                  icon={Calendar}
                  label="Joining Date"
                  value={employee.dateOfJoining ? formatDate(employee.dateOfJoining) : "—"}
                />
                <InfoRow
                  icon={DollarSign}
                  label="Salary"
                  value={employee.salary ? formatCurrency(employee.salary) : "—"}
                />
                <InfoRow
                  icon={User}
                  label="Employee Code"
                  value={employee.employeeCode || "—"}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-slate-400">Date</TableHead>
                  <TableHead className="text-slate-400">Check In</TableHead>
                  <TableHead className="text-slate-400">Check Out</TableHead>
                  <TableHead className="text-slate-400">Work Hours</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-slate-500 py-12"
                    >
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  attendance.map((a) => (
                    <TableRow key={a.id} className="border-white/5">
                      <TableCell className="text-slate-300">
                        {formatDate(a.date)}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {a.checkIn ? formatTime(a.checkIn) : "—"}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {a.checkOut ? formatTime(a.checkOut) : "—"}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {a.workHours ? `${a.workHours}h` : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            a.status === "PRESENT"
                              ? "success"
                              : a.status === "ABSENT"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {a.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Leaves Tab */}
        <TabsContent value="leaves">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-slate-400">Type</TableHead>
                  <TableHead className="text-slate-400">Start</TableHead>
                  <TableHead className="text-slate-400">End</TableHead>
                  <TableHead className="text-slate-400">Days</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaves.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-slate-500 py-12"
                    >
                      No leave records found
                    </TableCell>
                  </TableRow>
                ) : (
                  leaves.map((l) => (
                    <TableRow key={l.id} className="border-white/5">
                      <TableCell>
                        <Badge variant="outline" className="text-slate-300 border-white/10">
                          {l.leaveType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {formatDate(l.startDate)}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {formatDate(l.endDate)}
                      </TableCell>
                      <TableCell className="text-slate-300">{l.totalDays}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            l.status === "APPROVED"
                              ? "success"
                              : l.status === "REJECTED"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {l.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-slate-400">Month/Year</TableHead>
                  <TableHead className="text-slate-400">Basic</TableHead>
                  <TableHead className="text-slate-400">Net Salary</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrolls.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-slate-500 py-12"
                    >
                      No payroll records found
                    </TableCell>
                  </TableRow>
                ) : (
                  payrolls.map((p) => (
                    <TableRow key={p.id} className="border-white/5">
                      <TableCell className="text-slate-300">
                        {p.month}/{p.year}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {formatCurrency(p.basicSalary)}
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {formatCurrency(p.netSalary)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            p.status === "PAID"
                              ? "success"
                              : p.status === "PROCESSED"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Edit Employee
            </DialogTitle>
          </DialogHeader>
          <EmployeeForm
            mode="edit"
            employee={employee}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditOpen(false)}
            token={token}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Reusable info row for employee details. */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm text-slate-200">{value}</p>
      </div>
    </div>
  );
}
