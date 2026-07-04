"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import type { Employee, Department } from "@/types";

const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  departmentId: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  dateOfJoining: z.string().min(1, "Joining date is required"),
  salary: z.coerce.number().min(0, "Salary must be positive"),
  password: z.string().optional(),
  role: z.enum(["ADMIN", "HR", "EMPLOYEE"]),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  mode: "create" | "edit";
  employee?: Employee | null;
  onSuccess: () => void;
  onCancel: () => void;
  token: string | undefined;
}

export function EmployeeForm({
  mode,
  employee,
  onSuccess,
  onCancel,
  token,
}: EmployeeFormProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(
      mode === "create"
        ? employeeSchema.refine((d) => d.password && d.password.length >= 6, {
            message: "Password must be at least 6 characters",
            path: ["password"],
          })
        : employeeSchema
    ),
    defaultValues: {
      firstName: employee?.firstName || "",
      lastName: employee?.lastName || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      departmentId: employee?.departmentId || "",
      designation: employee?.designation || "",
      dateOfJoining: employee?.dateOfJoining
        ? new Date(employee.dateOfJoining).toISOString().split("T")[0]
        : "",
      salary: employee?.salary || 0,
      password: "",
      role: (employee?.role as "ADMIN" | "HR" | "EMPLOYEE") || "EMPLOYEE",
    },
  });

  const fetchDepartments = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiGet("/api/departments", token);
      setDepartments(res || []);
    } catch {
      // Departments may not be available yet
    }
  }, [token]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const onSubmit = async (data: EmployeeFormData) => {
    if (!token) return;
    setIsSubmitting(true);

    try {
      const payload = { ...data };
      if (mode === "edit" && !payload.password) {
        delete payload.password;
      }

      if (mode === "create") {
        await apiPost("/api/employees", payload, token);
      } else {
        await apiPut(`/api/employees/${employee?.id}`, payload, token);
      }

      onSuccess();
    } catch {
      toast.error(
        mode === "create"
          ? "Failed to create employee"
          : "Failed to update employee"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const departmentId = watch("departmentId");
  const roleValue = watch("role");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-slate-300">
            First Name <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="firstName"
            {...register("firstName")}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
            placeholder="John"
          />
          {errors.firstName && (
            <p className="text-xs text-rose-400">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-slate-300">
            Last Name <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="lastName"
            {...register("lastName")}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="text-xs text-rose-400">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300">
            Email <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
            placeholder="john@company.com"
            disabled={mode === "edit"}
          />
          {errors.email && (
            <p className="text-xs text-rose-400">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-300">
            Phone
          </Label>
          <Input
            id="phone"
            {...register("phone")}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
            placeholder="+91 9876543210"
          />
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label className="text-slate-300">
            Department <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={departmentId}
            onValueChange={(val) => setValue("departmentId", val)}
          >
            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.departmentId && (
            <p className="text-xs text-rose-400">
              {errors.departmentId.message}
            </p>
          )}
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <Label htmlFor="designation" className="text-slate-300">
            Designation <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="designation"
            {...register("designation")}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
            placeholder="Software Engineer"
          />
          {errors.designation && (
            <p className="text-xs text-rose-400">
              {errors.designation.message}
            </p>
          )}
        </div>

        {/* Date of Joining */}
        <div className="space-y-2">
          <Label htmlFor="dateOfJoining" className="text-slate-300">
            Date of Joining <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="dateOfJoining"
            type="date"
            {...register("dateOfJoining")}
            className="bg-slate-800/50 border-slate-700 text-white focus:border-indigo-500 [color-scheme:dark]"
          />
          {errors.dateOfJoining && (
            <p className="text-xs text-rose-400">
              {errors.dateOfJoining.message}
            </p>
          )}
        </div>

        {/* Salary */}
        <div className="space-y-2">
          <Label htmlFor="salary" className="text-slate-300">
            Salary (INR) <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="salary"
            type="number"
            {...register("salary")}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
            placeholder="50000"
          />
          {errors.salary && (
            <p className="text-xs text-rose-400">{errors.salary.message}</p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label className="text-slate-300">
            Role <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={roleValue}
            onValueChange={(val) =>
              setValue("role", val as "ADMIN" | "HR" | "EMPLOYEE")
            }
          >
            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="EMPLOYEE">Employee</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-xs text-rose-400">{errors.role.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-300">
            Password{" "}
            {mode === "create" && <span className="text-rose-500">*</span>}
            {mode === "edit" && (
              <span className="text-slate-500">(leave empty to keep current)</span>
            )}
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
            placeholder={mode === "edit" ? "••••••••" : "Min 6 characters"}
          />
          {errors.password && (
            <p className="text-xs text-rose-400">{errors.password.message}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/10 text-slate-300 hover:bg-white/5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : mode === "create" ? (
            "Create Employee"
          ) : (
            "Update Employee"
          )}
        </Button>
      </div>
    </form>
  );
}
