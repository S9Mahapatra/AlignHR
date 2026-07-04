import { PrismaClient, Role, LeaveType, LeaveStatus, AttendanceStatus } from '@prisma/client';
import { hashPassword } from './utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AlignHR database...\n');

  // ─── 1. Clear all tables (in dependency order) ────────────────────────────
  console.log('🗑  Clearing existing data...');
  await prisma.payroll.deleteMany();
  await prisma.leave.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.department.updateMany({ data: { headId: null } });
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  console.log('   ✓ All tables cleared.\n');

  // ─── 2. Create departments ────────────────────────────────────────────────
  console.log('🏢 Creating departments...');
  const engineering = await prisma.department.create({
    data: { name: 'Engineering', description: 'Software development and engineering team' },
  });
  const hr = await prisma.department.create({
    data: { name: 'Human Resources', description: 'People operations and talent management' },
  });
  const marketing = await prisma.department.create({
    data: { name: 'Marketing', description: 'Brand, growth, and communications' },
  });
  const finance = await prisma.department.create({
    data: { name: 'Finance', description: 'Financial planning, accounting, and payroll' },
  });
  console.log(`   ✓ Created 4 departments.\n`);

  // ─── 3. Hash common password ──────────────────────────────────────────────
  const defaultPassword = await hashPassword('password123');

  // ─── 4. Create admin user + employee ──────────────────────────────────────
  console.log('👤 Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@alignhr.com',
      password: defaultPassword,
      role: Role.ADMIN,
    },
  });
  const adminEmployee = await prisma.employee.create({
    data: {
      userId: adminUser.id,
      firstName: 'Rajesh',
      lastName: 'Sharma',
      email: 'admin@alignhr.com',
      phone: '+91-9876543210',
      designation: 'Chief Executive Officer',
      departmentId: engineering.id,
      salary: 150000,
      gender: 'Male',
      dateOfBirth: new Date('1985-03-15'),
      address: '42, MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560001',
      dateOfJoining: new Date('2020-01-10'),
      emergencyContact: 'Priya Sharma',
      emergencyPhone: '+91-9876543211',
    },
  });
  console.log(`   ✓ Admin: admin@alignhr.com / password123\n`);

  // ─── 5. Create HR user + employee ─────────────────────────────────────────
  console.log('👤 Creating HR user...');
  const hrUser = await prisma.user.create({
    data: {
      email: 'hr@alignhr.com',
      password: defaultPassword,
      role: Role.HR,
    },
  });
  const hrEmployee = await prisma.employee.create({
    data: {
      userId: hrUser.id,
      firstName: 'Sneha',
      lastName: 'Patel',
      email: 'hr@alignhr.com',
      phone: '+91-9123456780',
      designation: 'HR Manager',
      departmentId: hr.id,
      salary: 95000,
      gender: 'Female',
      dateOfBirth: new Date('1990-07-22'),
      address: '15, Residency Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560025',
      dateOfJoining: new Date('2021-06-01'),
      emergencyContact: 'Amit Patel',
      emergencyPhone: '+91-9123456781',
    },
  });
  console.log(`   ✓ HR: hr@alignhr.com / password123\n`);

  // ─── 6. Set department heads ──────────────────────────────────────────────
  await prisma.department.update({ where: { id: engineering.id }, data: { headId: adminEmployee.id } });
  await prisma.department.update({ where: { id: hr.id }, data: { headId: hrEmployee.id } });

  // ─── 7. Create regular employees ─────────────────────────────────────────
  console.log('👥 Creating regular employees...');

  const employeesData = [
    {
      email: 'john@alignhr.com',
      firstName: 'John',
      lastName: 'Mathew',
      phone: '+91-9988776601',
      designation: 'Senior Software Engineer',
      departmentId: engineering.id,
      salary: 120000,
      gender: 'Male',
      dateOfBirth: new Date('1992-11-08'),
      address: '78, Koramangala 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560034',
      dateOfJoining: new Date('2022-03-15'),
      emergencyContact: 'Sarah Mathew',
      emergencyPhone: '+91-9988776602',
    },
    {
      email: 'jane@alignhr.com',
      firstName: 'Jane',
      lastName: 'D\'Souza',
      phone: '+91-9988776603',
      designation: 'Marketing Lead',
      departmentId: marketing.id,
      salary: 85000,
      gender: 'Female',
      dateOfBirth: new Date('1994-05-12'),
      address: '23, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560038',
      dateOfJoining: new Date('2022-08-01'),
      emergencyContact: 'Michael D\'Souza',
      emergencyPhone: '+91-9988776604',
    },
    {
      email: 'bob@alignhr.com',
      firstName: 'Bob',
      lastName: 'Kumar',
      phone: '+91-9988776605',
      designation: 'Financial Analyst',
      departmentId: finance.id,
      salary: 75000,
      gender: 'Male',
      dateOfBirth: new Date('1995-09-30'),
      address: '56, HSR Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560102',
      dateOfJoining: new Date('2023-01-10'),
      emergencyContact: 'Meena Kumar',
      emergencyPhone: '+91-9988776606',
    },
    {
      email: 'alice@alignhr.com',
      firstName: 'Alice',
      lastName: 'Verma',
      phone: '+91-9988776607',
      designation: 'Software Engineer',
      departmentId: engineering.id,
      salary: 90000,
      gender: 'Female',
      dateOfBirth: new Date('1996-02-18'),
      address: '12, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560066',
      dateOfJoining: new Date('2023-06-15'),
      emergencyContact: 'Rahul Verma',
      emergencyPhone: '+91-9988776608',
    },
    {
      email: 'charlie@alignhr.com',
      firstName: 'Charlie',
      lastName: 'Nair',
      phone: '+91-9988776609',
      designation: 'HR Executive',
      departmentId: hr.id,
      salary: 55000,
      gender: 'Male',
      dateOfBirth: new Date('1997-12-05'),
      address: '34, JP Nagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560078',
      dateOfJoining: new Date('2024-01-08'),
      emergencyContact: 'Lakshmi Nair',
      emergencyPhone: '+91-9988776610',
    },
  ];

  const createdEmployees = [];
  for (const empData of employeesData) {
    const user = await prisma.user.create({
      data: {
        email: empData.email,
        password: defaultPassword,
        role: Role.EMPLOYEE,
      },
    });

    const employee = await prisma.employee.create({
      data: {
        userId: user.id,
        ...empData,
      },
    });

    createdEmployees.push(employee);
  }

  console.log(`   ✓ Created ${createdEmployees.length} employees.\n`);

  // Collect all employee IDs for seed data
  const allEmployees = [adminEmployee, hrEmployee, ...createdEmployees];

  // ─── 8. Create attendance records for the last 7 days ─────────────────────
  console.log('📋 Creating attendance records...');
  let attendanceCount = 0;
  const today = new Date();

  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - dayOffset));
    const dayOfWeek = date.getUTCDay();

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    for (const emp of allEmployees) {
      // Randomly skip some employees (simulate absences — ~15% chance)
      if (Math.random() < 0.15) continue;

      const checkInHour = 8 + Math.floor(Math.random() * 2); // 8 or 9 AM
      const checkInMinute = Math.floor(Math.random() * 60);
      const checkIn = new Date(date);
      checkIn.setUTCHours(checkInHour, checkInMinute, 0, 0);

      const workHoursRandom = 7 + Math.random() * 3; // 7-10 hours
      const checkOut = new Date(checkIn.getTime() + workHoursRandom * 60 * 60 * 1000);

      let status: AttendanceStatus = 'PRESENT';
      if (checkInHour >= 10) status = 'LATE';
      if (workHoursRandom < 4) status = 'HALF_DAY';

      await prisma.attendance.create({
        data: {
          employeeId: emp.id,
          date,
          checkIn,
          checkOut,
          status,
          workHours: parseFloat(workHoursRandom.toFixed(2)),
          notes: dayOffset === 0 ? 'Today' : undefined,
        },
      });
      attendanceCount++;
    }
  }

  console.log(`   ✓ Created ${attendanceCount} attendance records.\n`);

  // ─── 9. Create leave requests ─────────────────────────────────────────────
  console.log('🏖  Creating leave requests...');
  const leaveRecords = [
    {
      employeeId: createdEmployees[0].id, // John
      leaveType: LeaveType.CASUAL,
      startDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 5)),
      endDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 7)),
      totalDays: 3,
      reason: 'Family function in hometown',
      status: LeaveStatus.PENDING,
    },
    {
      employeeId: createdEmployees[1].id, // Jane
      leaveType: LeaveType.SICK,
      startDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 3)),
      endDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 2)),
      totalDays: 2,
      reason: 'Fever and cold',
      status: LeaveStatus.APPROVED,
      approvedById: hrEmployee.id,
      approvedAt: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 4)),
    },
    {
      employeeId: createdEmployees[2].id, // Bob
      leaveType: LeaveType.EARNED,
      startDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 10)),
      endDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 14)),
      totalDays: 5,
      reason: 'Annual family vacation to Goa',
      status: LeaveStatus.PENDING,
    },
    {
      employeeId: createdEmployees[3].id, // Alice
      leaveType: LeaveType.CASUAL,
      startDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 5)),
      endDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 5)),
      totalDays: 1,
      reason: 'Personal errand',
      status: LeaveStatus.REJECTED,
      approvedById: hrEmployee.id,
      approvedAt: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 6)),
      rejectionNote: 'Critical project deadline, please reschedule',
    },
    {
      employeeId: createdEmployees[4].id, // Charlie
      leaveType: LeaveType.SICK,
      startDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1)),
      endDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 2)),
      totalDays: 2,
      reason: 'Dental surgery appointment',
      status: LeaveStatus.APPROVED,
      approvedById: hrEmployee.id,
      approvedAt: new Date(),
    },
    {
      employeeId: createdEmployees[0].id, // John — another leave
      leaveType: LeaveType.UNPAID,
      startDate: new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 1)),
      endDate: new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 3)),
      totalDays: 3,
      reason: 'Extended personal travel',
      status: LeaveStatus.PENDING,
    },
  ];

  for (const leave of leaveRecords) {
    await prisma.leave.create({ data: leave });
  }

  console.log(`   ✓ Created ${leaveRecords.length} leave requests.\n`);

  // ─── 10. Create payroll records for the current month ─────────────────────
  console.log('💰 Creating payroll records...');
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  let payrollCount = 0;

  for (const emp of allEmployees) {
    const basicSalary = emp.salary;
    const hra = basicSalary * 0.4;
    const da = basicSalary * 0.2;
    const bonuses = Math.random() > 0.7 ? Math.round(Math.random() * 10000) : 0;
    const deductions = Math.round(Math.random() * 2000);
    const gross = basicSalary + hra + da + bonuses;
    const tax = gross > 50000 ? gross * 0.1 : gross * 0.05;
    const netSalary = gross - deductions - tax;

    await prisma.payroll.create({
      data: {
        employeeId: emp.id,
        month: currentMonth,
        year: currentYear,
        basicSalary,
        hra,
        da,
        bonuses,
        deductions,
        tax: parseFloat(tax.toFixed(2)),
        netSalary: parseFloat(netSalary.toFixed(2)),
        status: Math.random() > 0.5 ? 'PAID' : 'DRAFT',
        paidAt: Math.random() > 0.5 ? new Date() : null,
      },
    });
    payrollCount++;
  }

  console.log(`   ✓ Created ${payrollCount} payroll records.\n`);

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log('══════════════════════════════════════════════');
  console.log('  🎉 Seed completed successfully!');
  console.log('══════════════════════════════════════════════');
  console.log(`  Departments:  4`);
  console.log(`  Users:        ${allEmployees.length}`);
  console.log(`  Employees:    ${allEmployees.length}`);
  console.log(`  Attendance:   ${attendanceCount}`);
  console.log(`  Leaves:       ${leaveRecords.length}`);
  console.log(`  Payroll:      ${payrollCount}`);
  console.log('══════════════════════════════════════════════');
  console.log('\n  Default credentials:');
  console.log('  Admin:    admin@alignhr.com / password123');
  console.log('  HR:       hr@alignhr.com    / password123');
  console.log('  Employee: john@alignhr.com  / password123');
  console.log('══════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
