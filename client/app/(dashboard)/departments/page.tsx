'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Department } from '@/types';
import { apiGet, apiDelete } from '@/lib/api';
import { DepartmentCard } from '@/components/departments/department-card';
import { DepartmentForm } from '@/components/departments/department-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Building2, Plus, Search, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';

export default function DepartmentsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'HR';
  const canManage = session?.user?.role === 'ADMIN';

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchDepartments();
    }
  }, [session?.user?.accessToken]);

  const fetchDepartments = async () => {
    if (!session?.user?.accessToken) return;

    try {
      setLoading(true);
      const res = await apiGet('/api/departments', session.user.accessToken);
      if (res.success) {
        setDepartments(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      toast.error('Could not load departments list');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedDept(null);
    setFormOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setSelectedDept(dept);
    setFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId || !session?.user?.accessToken) return;

    try {
      setDeleting(true);
      const res = await apiDelete(`/api/departments/${deleteId}`, session.user.accessToken);
      if (res.success) {
        toast.success(res.message || 'Department deleted successfully');
        fetchDepartments();
      }
    } catch (error: any) {
      toast.error(error.message || 'Error deleting department. Ensure no employees are assigned.');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalEmployees = departments.reduce(
    (acc, d) => acc + (d._count?.employees ?? d.employees?.length ?? 0),
    0
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Departments
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Organize workforce units, assign leadership, and track departmental headcount.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDepartments}
            className="border-white/10 hover:bg-white/5"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </Button>
          {isAdmin && (
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Department
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-950 border-white/10 text-slate-200 w-full"
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
          <div>
            Total Departments: <span className="text-white font-bold">{departments.length}</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <div>
            Assigned Personnel: <span className="text-indigo-400 font-bold">{totalEmployees}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="w-full text-center py-16 text-slate-400">
          Loading departmental directory...
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="w-full text-center py-16 bg-slate-900/40 border border-white/5 rounded-xl text-slate-400">
          <Building2 className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-lg font-medium text-slate-300">No departments found</p>
          <p className="text-sm">
            {searchQuery
              ? 'Try adjusting your search criteria.'
              : 'Create your first department to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              isAdmin={canManage}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {isAdmin && (
        <DepartmentForm
          open={formOpen}
          onOpenChange={setFormOpen}
          department={selectedDept}
          onSuccess={fetchDepartments}
        />
      )}

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px] bg-slate-900 border-white/10 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this department? This action cannot be undone. Any employees assigned to this department must be reassigned first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleting}
              className="bg-transparent border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Department'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
