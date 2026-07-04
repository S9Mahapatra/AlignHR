"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AttendanceTrendItem {
  month: string;
  present: number;
  absent: number;
}

interface DepartmentDistItem {
  name: string;
  count: number;
}

interface ChartsProps {
  attendanceTrend: AttendanceTrendItem[];
  departmentDistribution: DepartmentDistItem[];
  isLoading: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-white mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export function Charts({
  attendanceTrend,
  departmentDistribution,
  isLoading,
}: ChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6 h-[350px] animate-pulse"
          >
            <div className="h-4 w-32 bg-slate-800 rounded mb-6" />
            <div className="h-full bg-slate-800/50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Attendance Trend */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-6">
          Attendance Trend
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={attendanceTrend}>
            <defs>
              <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
            />
            <Area
              type="monotone"
              dataKey="present"
              name="Present"
              stroke="#10b981"
              fill="url(#presentGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="absent"
              name="Absent"
              stroke="#f43f5e"
              fill="url(#absentGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Department Distribution */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-6">
          Department Distribution
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={departmentDistribution}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              name="Employees"
              fill="url(#barGrad)"
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
