'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon, FolderOpen, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FolderOpen,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm transition-all duration-300',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
        <Icon className="w-7 h-7 animate-pulse" />
      </div>

      <h3 className="text-lg font-bold text-slate-200 mb-1 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
