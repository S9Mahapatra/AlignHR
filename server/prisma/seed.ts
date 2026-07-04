import { PrismaClient, Role, LeaveType, LeaveStatus, AttendanceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function main() {
  console.log('🌱 Seeding AlignHR database...\n');

  // ─── 1. Clear all tables ──────────────────────────────────────────────────
  console.log('🗑  Clearing existing data...');
  await prisma.payroll.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.employeeProfile.deleteMany();
  await prisma.user.deleteMany();
  console.log('   ✓ All tables cleared.\n');

  // ─── 2. Hash passwords ───────────────────────────────────────────────────
  const adminPassword = await hashPassword('Admin@123');
  const hrPassword = await hashPassword('Hr@123');
  const employeePassword = await hashPassword('Employee@123');

  // ─── 3. Create Admin user ────────────────────────────────────────────────
  console.log('👤 Creating Admin user...');
  const adminUser = await prisma.user.create({
    data: {
      name: 'Rajesh Sharma',
      employeeId: 'ADM001',
      email: 'admin@alignhr.com',
      password: adminPassword,
      role: Role.ADMIN,
      profile: {
        create: {
          phone: '+91-9876543210',
          address: '42, MG Road, Bengaluru',
          department: 'Management',
          designation: 'System Administrator',
          joiningDate: new Date('2020-01-10'),
          status: 'ACTIVE',
        },
      },
    },
  });
  console.log('   ✓ Admin: admin@alignhr.com / Admin@123\n');

  // ─── 4. Create HR user ───────────────────────────────────────────────────
  console.log('👤 Creating HR user...');
  const hrUser = await prisma.user.create({
    data: {
      name: 'Sneha Patel',
      employeeId: 'HR001',
      email: 'hr@alignhr.com',
      password: hrPassword,
      role: Role.HR,
      profile: {
        create: {
          phone: '+91-9123456780',
          address: '15, Residency Road, Bengaluru',
          department: 'Human Resources',
          designation: 'HR Manager',
          joiningDate: new Date('2021-06-01'),
          status: 'ACTIVE',
        },
      },
    },
  });
  console.log('   ✓ HR: hr@alignhr.com / Hr@123\n');

  // ─── 5. Create Employee users ────────────────────────────────────────────
  console.log('👥 Creating Employee users...');

  const employeesData = [
    {
      name: 'Tushar Kanti Dey',
      employeeId: 'EMP001',
      email: 'employee@alignhr.com',
      department: 'Engineering',
      designation: 'Frontend Engineer',
      phone: '9876543210',
      address: 'Kolkata, West Bengal',
      joiningDate: new Date('2023-03-15'),
    },
    {
      name: 'John Mathew',
      employeeId: 'EMP002',
      email: 'john@alignhr.com',
      department: 'Engineering',
      designation: 'Senior Software Engineer',
      phone: '+91-9988776601',
      address: '78, Koramangala, Bengaluru',
      joiningDate: new Date('2022-03-15'),
    },
    {
      name: 'Jane D\'Souza',
      employeeId: 'EMP003',
      email: 'jane@alignhr.com',
      department: 'Marketing',
      designation: 'Marketing Lead',
      phone: '+91-9988776603',
      address: '23, Indiranagar, Bengaluru',
      joiningDate: new Date('2022-08-01'),
    },
    {
      name: 'Bob Kumar',
      employeeId: 'EMP004',
      email: 'bob@alignhr.com',
      department: 'Finance',
      designation: 'Financial Analyst',
      phone: '+91-9988776605',
      address: '56, HSR Layout, Bengaluru',
      joiningDate: new Date('2023-01-10'),
    },
    {
      name: 'Alice Verma',
      employeeId: 'EMP005',
      email: 'alice@alignhr.com',
      department: 'Engineering',
      designation: 'Software Engineer',
      phone: '+91-9988776607',
      address: '12, Whitefield, Bengaluru',
      joiningDate: new Date('2023-06-15'),
    },
    {
      name: 'Charlie Nair',
      employeeId: 'EMP006',
      email: 'charlie@alignhr.com',
      department: 'Human Resources',
      designation: 'HR Executive',
      phone: '+91-9988776609',
      address: '34, JP Nagar, Bengaluru',
      joiningDate: new Date('2024-01-08'),
    },
    {
      name: 'Priya Menon',
      employeeId: 'EMP007',
      email: 'priya@alignhr.com',
      department: 'Engineering',
      designation: 'Backend Engineer',
      phone: '+91-9988776611',
      address: '67, BTM Layout, Bengaluru',
      joiningDate: new Date('2023-09-01'),
    },
    {
      name: 'Vikram Singh',
      employeeId: 'EMP008',
      email: 'vikram@alignhr.com',
      department: 'Marketing',
      designation: 'Content Strategist',
      phone: '+91-9988776613',
      address: '89, Jayanagar, Bengaluru',
      joiningDate: new Date('2024-02-15'),
    },
  ];

  const createdEmployeeUsers = [];
  for (const emp of employeesData) {
    const user = await prisma.user.create({
      data: {
        name: emp.name,
        employeeId: emp.employeeId,
        email: emp.email,
        password: employeePassword,
        role: Role.EMPLOYEE,
        profile: {
          create: {
            phone: emp.phone,
            address: emp.address,
            department: emp.department,
            designation: emp.designation,
            joiningDate: emp.joiningDate,
            status: 'ACTIVE',
          },
        },
      },
    });
    createdEmployeeUsers.push(user);
  }
  console.log(`   ✓ Created ${createdEmployeeUsers.length} employees.\n`);

  // Collect all user IDs
  const allUsers = [adminUser, hrUser, ...createdEmployeeUsers];

  // ─── 6. Create attendance records for the last 7 days ─────────────────────
  console.log('📋 Creating attendance records...');
  let attendanceCount = 0;
  const today = new Date();

  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - dayOffset));
    const dayOfWeek = date.getUTCDay();

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    for (const user of allUsers) {
      // Randomly skip some users (~15% chance = absence)
      if (Math.random() < 0.15) continue;

      const checkInHour = 8 + Math.floor(Math.random() * 2);
      const checkInMinute = Math.floor(Math.random() * 60);
      const checkIn = new Date(date);
      checkIn.setUTCHours(checkInHour, checkInMinute, 0, 0);

      const workHoursRandom = 7 + Math.random() * 3; // 7-10 hours
      const checkOut = new Date(checkIn.getTime() + workHoursRandom * 60 * 60 * 1000);

      let status: AttendanceStatus = 'PRESENT';
      if (workHoursRandom < 4) status = 'HALF_DAY';

      await prisma.attendance.create({
        data: {
          userId: user.id,
          date,
          checkIn,
          checkOut,
          status,
          workHours: parseFloat(workHoursRandom.toFixed(2)),
          remarks: dayOffset === 0 ? 'Today' : undefined,
        },
      });
      attendanceCount++;
    }
  }
  console.log(`   ✓ Created ${attendanceCount} attendance records.\n`);

  // ─── 7. Create leave requests ─────────────────────────────────────────────
  console.log('🏖  Creating leave requests...');
  const leaveRecords = [
    {
      userId: createdEmployeeUsers[0].id,
      leaveType: LeaveType.PAID,
      startDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 5)),
      endDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 7)),
      totalDays: 3,
      remarks: 'Family function in hometown',
      status: LeaveStatus.PENDING,
    },
    {
      userId: createdEmployeeUsers[1].id,
      leaveType: LeaveType.SICK,
      startDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 3)),
      endDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 2)),
      totalDays: 2,
      remarks: 'Fever and cold',
      status: LeaveStatus.APPROVED,
      reviewedBy: hrUser.id,
      reviewedAt: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 4)),
      adminComment: 'Get well soon',
    },
    {
      userId: createdEmployeeUsers[2].id,
      leaveType: LeaveType.PAID,
      startDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 10)),
      endDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 14)),
      totalDays: 5,
      remarks: 'Annual family vacation to Goa',
      status: LeaveStatus.PENDING,
    },
    {
      userId: createdEmployeeUsers[3].id,
      leaveType: LeaveType.UNPAID,
      startDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 5)),
      endDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 5)),
      totalDays: 1,
      remarks: 'Personal errand',
      status: LeaveStatus.REJECTED,
      reviewedBy: hrUser.id,
      reviewedAt: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 6)),
      adminComment: 'Critical project deadline, please reschedule',
    },
    {
      userId: createdEmployeeUsers[4].id,
      leaveType: LeaveType.SICK,
      startDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1)),
      endDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 2)),
      totalDays: 2,
      remarks: 'Dental surgery appointment',
      status: LeaveStatus.APPROVED,
      reviewedBy: hrUser.id,
      reviewedAt: new Date(),
      adminComment: 'Approved. Take care.',
    },
    {
      userId: createdEmployeeUsers[5].id,
      leaveType: LeaveType.PAID,
      startDate: new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 1)),
      endDate: new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 3)),
      totalDays: 3,
      remarks: 'Extended personal travel',
      status: LeaveStatus.PENDING,
    },
  ];

  for (const leave of leaveRecords) {
    await prisma.leaveRequest.create({ data: leave });
  }
  console.log(`   ✓ Created ${leaveRecords.length} leave requests.\n`);

  // ─── 8. Create payroll records ────────────────────────────────────────────
  console.log('💰 Creating payroll records...');
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  let payrollCount = 0;

  const salaries = [150000, 95000, 80000, 120000, 85000, 75000, 90000, 55000, 95000, 70000];

  for (let i = 0; i < allUsers.length; i++) {
    const user = allUsers[i];
    const basicSalary = salaries[i] || 60000;
    const allowances = Math.round(basicSalary * 0.3);
    const deductions = Math.round(basicSalary * 0.1);
    const netSalary = basicSalary + allowances - deductions;

    await prisma.payroll.create({
      data: {
        userId: user.id,
        basicSalary,
        allowances,
        deductions,
        netSalary,
        month: currentMonth,
        year: currentYear,
        status: Math.random() > 0.5 ? 'PAID' : 'DRAFT',
      },
    });
    payrollCount++;
  }
  console.log(`   ✓ Created ${payrollCount} payroll records.\n`);

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log('══════════════════════════════════════════════');
  console.log('  🎉 Seed completed successfully!');
  console.log('══════════════════════════════════════════════');
  console.log(`  Users:        ${allUsers.length}`);
  console.log(`  Profiles:     ${allUsers.length}`);
  console.log(`  Attendance:   ${attendanceCount}`);
  console.log(`  Leaves:       ${leaveRecords.length}`);
  console.log(`  Payroll:      ${payrollCount}`);
  console.log('══════════════════════════════════════════════');
  console.log('\n  Demo credentials:');
  console.log('  Admin:    admin@alignhr.com    / Admin@123');
  console.log('  HR:       hr@alignhr.com       / Hr@123');
  console.log('  Employee: employee@alignhr.com / Employee@123');
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
