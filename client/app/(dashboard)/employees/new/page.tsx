"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeForm } from "@/components/employees/employee-form";
import Link from "next/link";

export default function NewEmployeePage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const router = useRouter();

  const handleSuccess = () => {
    toast.success("Employee created successfully!");
    router.push("/employees");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/dashboard"
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          <Home className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <Link
          href="/employees"
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          Employees
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-slate-200">New Employee</span>
      </nav>

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

      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Add New Employee
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Fill in the details to create a new employee record
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 md:p-8">
        <EmployeeForm
          mode="create"
          onSuccess={handleSuccess}
          onCancel={() => router.push("/employees")}
          token={token}
        />
      </div>
    </div>
  );
}
