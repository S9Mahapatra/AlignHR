import { Router } from 'express';
import authRoutes from './auth.routes';
import employeeRoutes from './employee.routes';
import attendanceRoutes from './attendance.routes';
import leaveRoutes from './leave.routes';
import payrollRoutes from './payroll.routes';
import departmentRoutes from './department.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/employees', employeeRoutes);
router.use('/api/attendance', attendanceRoutes);
router.use('/api/leaves', leaveRoutes);
router.use('/api/payroll', payrollRoutes);
router.use('/api/departments', departmentRoutes);
router.use('/api/dashboard', dashboardRoutes);

export default router;
