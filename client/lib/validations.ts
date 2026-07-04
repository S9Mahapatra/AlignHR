import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  employeeId: z.string().min(3, "Employee ID must be at least 3 characters (e.g. EMP-009)"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  role: z.enum(["EMPLOYEE", "HR", "ADMIN"]),
  department: z.string().min(2, "Please select or enter a department"),
  designation: z.string().min(2, "Please enter job designation"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter full residential address"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const leaveFormSchema = z.object({
  leaveType: z.enum(["PAID", "SICK", "UNPAID"]),
  startDate: z.string().min(1, "Please select start date"),
  endDate: z.string().min(1, "Please select end date"),
  reason: z.string().min(5, "Please provide a brief reason (at least 5 characters)"),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

export const employeeCreateSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  departmentId: z.string().optional(),
  designation: z.string().min(2, "Designation required"),
  salary: z.coerce.number().min(0, "Salary must be a positive number"),
  role: z.enum(["EMPLOYEE", "HR", "ADMIN"]).default("EMPLOYEE"),
  password: z.string().min(6, "Initial password required"),
});
