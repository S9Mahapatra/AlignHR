'use client';

import React from 'react';
import { Department } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Building2, Users, Edit, Trash2, UserCheck } from 'lucide-react';

interface DepartmentCardProps {
  department: Department;
  isAdmin: boolean;
  onEdit: (dept: Department) => void;
  onDelete: (id: string) => void;
}

export function DepartmentCard({
  department,
  isAdmin,
  onEdit,
  onDelete,
}: DepartmentCardProps) {
  const employeeCount = department._count?.employees ?? department.employees?.length ?? 0;

  return (
    <Card className="glass-card gradient-border hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                {department.name}
              </h3>
              <Badge variant="secondary" className="mt-1 bg-slate-800/80 text-slate-300 border-white/5 text-xs">
                <Users className="w-3 h-3 mr-1 text-indigo-400" />
                {employeeCount} {employeeCount === 1 ? 'Employee' : 'Employees'}
              </Badge>
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                onClick={() => onEdit(department)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                onClick={() => onDelete(department.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="py-2">
          <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px]">
            {department.description || 'No department description provided.'}
          </p>
        </CardContent>
      </div>

      <CardFooter className="pt-4 mt-2 border-t border-white/5 bg-slate-950/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7 border border-white/10">
            <AvatarImage src={department.head?.avatar || undefined} />
            <AvatarFallback className="bg-indigo-600/30 text-indigo-300 text-[10px]">
              {department.head ? getInitials(department.head.firstName, department.head.lastName) : 'N/A'}
            </AvatarFallback>
          </Avatar>
          <div className="text-xs">
            <span className="text-slate-500 block">Department Head</span>
            <span className="font-medium text-slate-300">
              {department.head ? `${department.head.firstName} ${department.head.lastName}` : 'Not Assigned'}
            </span>
          </div>
        </div>

        {department.head && (
          <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400" title="Head Assigned">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
