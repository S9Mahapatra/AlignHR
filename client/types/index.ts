// ============================================================================
// AlignHR - TypeScript Type Definitions
// Shared types used across the entire frontend application.
// ============================================================================

// --- Enums / Union Types ---

export type Role = 'ADMIN' | 'HR' | 'EMPLOYEE';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type LeaveType = 'PAID' | 'SICK' | 'UNPAID';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';

export type PayrollStatus = 'DRAFT' | 'PROCESSED' | 'PAID';

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';

// --- Core Models ---

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  userId: string;
  user?: User;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  departmentId?: string;
  department?: Department;
  designation?: string;
  dateOfJoining: string;
  salary: number;
  status: EmployeeStatus;
  avatar?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  profile?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  headId?: string;
  head?: Employee;
  employees?: Employee[];
  _count?: { employees: number };
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employee?: Employee;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workHours?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Leave {
  id: string;
  employeeId: string;
  employee?: Employee;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: LeaveStatus;
  approvedById?: string;
  approvedBy?: Employee;
  approvedAt?: string;
  rejectionNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employee?: Employee;
  month: number;
  year: number;
  basicSalary: number;
  hra: number;
  da: number;
  deductions: number;
  bonuses: number;
  tax: number;
  netSalary: number;
  status: PayrollStatus;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Dashboard & Analytics ---

export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  pendingLeaves: number;
  todayPresent: number;
  recentActivities: Activity[];
  monthlyAttendance: MonthlyAttendance[];
  departmentDistribution: DepartmentDistribution[];
}

export interface Activity {
  id: string;
  type: 'leave' | 'attendance' | 'payroll';
  message: string;
  timestamp: string;
  employeeName: string;
}

export interface MonthlyAttendance {
  month: string;
  present: number;
  absent: number;
  late: number;
}

export interface DepartmentDistribution {
  name: string;
  count: number;
}

export interface LeaveBalance {
  casual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  earned: { total: number; used: number; remaining: number };
}

// --- API Response Wrappers ---

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
