import { prisma } from '../config/database';

/**
 * Get dashboard statistics for admin/HR.
 */
export const getStats = async () => {
  const today = new Date();
  const todayDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  // Run all counts in parallel
  const [
    totalEmployees,
    totalDepartments,
    pendingLeaves,
    todayPresent,
  ] = await Promise.all([
    prisma.employee.count({ where: { status: 'ACTIVE' } }),
    prisma.department.count(),
    prisma.leave.count({ where: { status: 'PENDING' } }),
    prisma.attendance.count({ where: { date: todayDate } }),
  ]);

  // Recent activities: last 10 leaves + last 10 attendance records, merged and sorted
  const [recentLeaves, recentAttendances] = await Promise.all([
    prisma.leave.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: {
          select: { firstName: true, lastName: true },
        },
      },
    }),
    prisma.attendance.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: {
          select: { firstName: true, lastName: true },
        },
      },
    }),
  ]);

  // Normalize into a unified activity list
  const recentActivities = [
    ...recentLeaves.map((l) => ({
      type: 'leave' as const,
      id: l.id,
      employeeName: `${l.employee.firstName} ${l.employee.lastName}`,
      description: `${l.leaveType} leave (${l.status})`,
      date: l.createdAt,
    })),
    ...recentAttendances.map((a) => ({
      type: 'attendance' as const,
      id: a.id,
      employeeName: `${a.employee.firstName} ${a.employee.lastName}`,
      description: `Attendance: ${a.status}`,
      date: a.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  // Monthly attendance counts for the last 6 months
  const monthlyAttendance = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

    const count = await prisma.attendance.count({
      where: {
        date: {
          gte: new Date(Date.UTC(monthDate.getFullYear(), monthDate.getMonth(), 1)),
          lte: new Date(Date.UTC(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate())),
        },
      },
    });

    monthlyAttendance.push({
      month: monthDate.toLocaleString('default', { month: 'short' }),
      year: monthDate.getFullYear(),
      count,
    });
  }

  // Department distribution
  const departmentDistribution = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { employees: true } },
    },
    orderBy: { name: 'asc' },
  });

  return {
    totalEmployees,
    totalDepartments,
    pendingLeaves,
    todayPresent,
    recentActivities,
    monthlyAttendance,
    departmentDistribution: departmentDistribution.map((d) => ({
      department: d.name,
      count: d._count.employees,
    })),
  };
};
