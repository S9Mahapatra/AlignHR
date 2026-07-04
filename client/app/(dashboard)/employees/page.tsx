"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Plus, Search, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet } from "@/lib/api";
import { EmployeeTable } from "@/components/employees/employee-table";
import { EmployeeForm } from "@/components/employees/employee-form";
import { MOCK_EMPLOYEES, MOCK_DEPARTMENTS } from "@/lib/mock-data";
import type { Employee, Department } from "@/types";

export default function EmployeesPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const role = session?.user?.role || "EMPLOYEE";
  const isAdminOrHR = role === "ADMIN" || role === "HR";

  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchEmployees = useCallback(async () => {
    if (!token) {
      setEmployees(MOCK_EMPLOYEES);
      setDepartments(MOCK_DEPARTMENTS);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([
        apiGet<{ success: boolean; data: any[] }>("/api/employees", token),
        apiGet<{ success: boolean; data: any[] }>("/api/departments", token),
      ]);
      const empData = empRes?.data || [];
      const deptData = deptRes?.data || [];
      setEmployees(empData.length > 0 ? empData : MOCK_EMPLOYEES);
      setDepartments(deptData.length > 0 ? deptData : MOCK_DEPARTMENTS);
    } catch {
      setEmployees(MOCK_EMPLOYEES);
      setDepartments(MOCK_DEPARTMENTS);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    let result = employees;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name?.toLowerCase().includes(q) ||
          e.firstName?.toLowerCase().includes(q) ||
          e.lastName?.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q) ||
          e.employeeCode?.toLowerCase().includes(q)
      );
    }

    if (filterDept !== "all") {
      result = result.filter((e) => e.departmentId === filterDept);
    }

    if (filterStatus !== "all") {
      result = result.filter((e) => e.status === filterStatus);
    }

    return result;
  }, [employees, search, filterDept, filterStatus]);

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    fetchEmployees();
    toast.success("Employee created successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Employees
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your organization&apos;s workforce
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEmployees}
            disabled={isLoading}
            className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {isAdminOrHR && (
            <Button
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-3">
            <Select
              value={filterDept}
              onValueChange={(val) => {
                setFilterDept(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-700 text-white">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={(val) => {
                setFilterStatus(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[150px] bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                <SelectItem value="TERMINATED">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      {isLoading ? (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 bg-slate-800 rounded-lg" />
          ))}
        </div>
      ) : (
        <EmployeeTable
          employees={paginatedEmployees}
          isAdminOrHR={isAdminOrHR}
          onRefresh={fetchEmployees}
          token={token}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredEmployees.length)} of{" "}
            {filteredEmployees.length} employees
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-white/10 text-slate-300 hover:bg-white/5"
            >
              Previous
            </Button>
            <span className="text-sm text-slate-400 px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-white/10 text-slate-300 hover:bg-white/5"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add Employee Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Add New Employee
            </DialogTitle>
          </DialogHeader>
          <EmployeeForm
            mode="create"
            onSuccess={handleFormSuccess}
            onCancel={() => setIsDialogOpen(false)}
            token={token}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
