# AlignHR Backend Memory

## Project

AlignHR is a Human Resource Management System for managing employees, attendance, leave requests, payroll visibility, and HR/Admin approval workflows.

## Backend Purpose

The backend provides secure REST APIs for the AlignHR frontend. It handles authentication, authorization, employee data, attendance tracking, leave management, payroll records, and role-based access control.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Neon DB
- JWT authentication
- bcrypt
- Zod validation

## Roles

- ADMIN
- HR
- EMPLOYEE

## Core Modules

1. Authentication
2. Employee Management
3. Attendance Management
4. Leave Management
5. Payroll Management
6. Role-Based Access Control

## Auth Rules

- Passwords are hashed using bcrypt.
- Login returns a JWT token.
- Protected routes require JWT.
- Admin and HR can access management APIs.
- Employees can only access their own profile, attendance, leave, and payroll.
- Password hashes must never be returned in API responses.

## Environment Rule

Only `.env` is used.
Do not create `.env.example`.

## Database

Database is PostgreSQL hosted on Neon DB.

## Prisma Models

- User
- EmployeeProfile
- Attendance
- LeaveRequest
- Payroll

## API Style

Use REST APIs with clean JSON responses.

Success response format:

```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": {}
}
```

Error response format:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Backend Quality Rules

- Keep controllers thin.
- Put business logic in services.
- Use Zod validation.
- Use centralized error handling.
- Use async handler for route functions.
- Use role middleware for Admin/HR APIs.
- Keep code modular and scalable.
