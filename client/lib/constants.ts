export const APP_NAME = "AlignHR";
export const APP_TAGLINE = "Every workday, perfectly aligned.";

export const COLORS = {
  background: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#4F46E5",
  primaryDark: "#3730A3",
  accent: "#7C3AED",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  success: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",
  info: "#2563EB",
};

export const ROLES = [
  { value: "EMPLOYEE", label: "Employee", description: "Standard employee access to personal records and requests." },
  { value: "HR", label: "HR Manager", description: "Manage workforce, attendance, leave approvals, and onboarding." },
  { value: "ADMIN", label: "System Admin", description: "Full organization control, payroll processing, and system settings." },
];

export const DEPARTMENTS = [
  "Engineering",
  "Product & Design",
  "Human Resources",
  "Finance & Payroll",
  "Sales & Marketing",
  "Customer Success",
  "Legal & Compliance",
  "Operations",
];

export const DESIGNATIONS = [
  "Software Engineer",
  "Senior Frontend Engineer",
  "Backend Architect",
  "Product Designer",
  "HR Specialist",
  "HR Manager",
  "Financial Analyst",
  "Payroll Manager",
  "Sales Executive",
  "Operations Lead",
];

export const LEAVE_TYPES = [
  { value: "PAID", label: "Paid Time Off (Casual / Earned)", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  { value: "SICK", label: "Sick Leave", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  { value: "UNPAID", label: "Unpaid Leave", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
];

export const ATTENDANCE_STATUS_COLORS: Record<string, string> = {
  PRESENT: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  ABSENT: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  HALF_DAY: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  LEAVE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export const LEAVE_STATUS_COLORS: Record<string, string> = {
  APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};
