# AlignHR

**Every workday, perfectly aligned.**

## Overview

AlignHR is a full-stack Human Resource Management System (HRMS) built for a hackathon. It provides a robust solution for managing employees, tracking attendance, processing leave requests, and generating payroll, all backed by a secure role-based access control system.

## Problem Statement

Modern HR systems are often fragmented, difficult to scale, and have poor user experiences. Organizations struggle with disjointed tools for tracking attendance, managing leave approvals, and calculating payroll. AlignHR solves this by unifying all core HR processes into a single, scalable, and intuitive platform with distinct portals for Employees, HR personnel, and Administrators.

## Features

- **Role-Based Access Control (RBAC)**: Secure access for ADMIN, HR, and EMPLOYEE roles.
- **Employee Profiles**: Manage personal and professional details.
- **Attendance Tracking**: Clock in/out functionality with automatic work hours calculation.
- **Leave Management**: Seamlessly apply, review, and approve/reject leave requests.
- **Payroll Processing**: Automated net salary calculation based on basic salary, allowances, and deductions.
- **Responsive Dashboard**: Beautiful and intuitive UI for all devices.

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, NextAuth.js
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL (Neon Serverless Postgres)
- **ORM**: Prisma
- **Validation**: Zod
- **Security**: bcryptjs, jsonwebtoken (JWT)

## Architecture

```mermaid
flowchart LR
    User[Employee / HR / Admin] --> Client[Next.js Client]
    Client --> Auth[NextAuth JWT Session]
    Client --> API[Express REST API]
    API --> Middleware[Auth + Role Middleware]
    Middleware --> Services[Business Logic Services]
    Services --> Prisma[Prisma ORM]
    Prisma --> Neon[(Neon PostgreSQL)]
```

## User Workflow

```mermaid
flowchart TD
    A[User Opens AlignHR] --> B{Authenticated?}
    B -->|No| C[Login / Register]
    B -->|Yes| D{Role}
    D -->|Employee| E[Employee Dashboard]
    D -->|HR/Admin| F[Admin Dashboard]
    E --> G[Profile]
    E --> H[Attendance Check-in / Check-out]
    E --> I[Apply Leave]
    E --> J[View Payroll]
    F --> K[Manage Employees]
    F --> L[Review Attendance]
    F --> M[Approve / Reject Leave]
    F --> N[Manage Payroll]
```

## Auth Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Next.js Client
    participant N as NextAuth
    participant S as Express Server
    participant D as Neon DB

    U->>C: Enter email and password
    C->>N: Submit credentials
    N->>S: POST /api/auth/login
    S->>D: Find user by email
    D-->>S: Return user
    S->>S: Compare bcrypt password
    S->>S: Generate JWT
    S-->>N: Return user and token
    N-->>C: Save JWT session
    C->>C: Redirect based on role
```

## Leave Approval Workflow

```mermaid
flowchart TD
    A[Employee Applies Leave] --> B[Leave Status: Pending]
    B --> C[HR/Admin Reviews Request]
    C --> D{Decision}
    D -->|Approve| E[Status: Approved]
    D -->|Reject| F[Status: Rejected]
    E --> G[Employee Sees Updated Status]
    F --> G
```

## Attendance Workflow

```mermaid
flowchart TD
    A[Employee Opens Attendance Page] --> B{Checked In Today?}
    B -->|No| C[Check In]
    B -->|Yes| D{Checked Out?}
    D -->|No| E[Check Out]
    D -->|Yes| F[View Attendance Record]
    C --> G[Create Attendance Record]
    E --> H[Calculate Work Hours]
    H --> I{Work Hours < 4?}
    I -->|Yes| J[Mark Half-Day]
    I -->|No| K[Mark Present]
```

## Database Relationship Overview

```mermaid
erDiagram
    User ||--|| EmployeeProfile : has
    User ||--o{ Attendance : records
    User ||--o{ LeaveRequest : requests
    User ||--o{ Payroll : receives

    User {
        string id
        string name
        string employeeId
        string email
        string password
        Role role
    }

    EmployeeProfile {
        string id
        string userId
        string department
        string designation
        string phone
        string address
        EmployeeStatus status
    }

    Attendance {
        string id
        string userId
        datetime date
        datetime checkIn
        datetime checkOut
        AttendanceStatus status
        float workHours
    }

    LeaveRequest {
        string id
        string userId
        LeaveType leaveType
        datetime startDate
        datetime endDate
        int totalDays
        LeaveStatus status
    }

    Payroll {
        string id
        string userId
        float basicSalary
        float allowances
        float deductions
        float netSalary
        int month
        int year
    }
```

## Folder Structure

```txt
alignhr/
├── client/          # Next.js Frontend
├── server/          # Express.js Backend
├── README.md
└── .gitignore
```

## API Route Overview

**Auth:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

**Employees:**
- `GET /api/employees`
- `GET /api/employees/:id`
- `PATCH /api/employees/:id`
- `DELETE /api/employees/:id`
- `GET /api/employees/me/profile`
- `PATCH /api/employees/me/profile`

**Attendance:**
- `POST /api/attendance/check-in`
- `POST /api/attendance/check-out`
- `GET /api/attendance/me`
- `GET /api/attendance`
- `PATCH /api/attendance/:id`

**Leaves:**
- `POST /api/leaves`
- `GET /api/leaves/me`
- `GET /api/leaves`
- `PATCH /api/leaves/:id/approve`
- `PATCH /api/leaves/:id/reject`

**Payroll:**
- `GET /api/payroll/me`
- `GET /api/payroll`
- `GET /api/payroll/:employeeId`
- `POST /api/payroll`
- `PATCH /api/payroll/:id`

## Environment Variables

This project uses only `.env` files. It does not use `.env.example`.

### Server (`server/.env`)
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require"
PORT=5000
NODE_ENV=development
JWT_SECRET="replace_with_strong_secret"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:3000"
BCRYPT_SALT_ROUNDS=10
```

### Client (`client/.env`)
```env
NEXTAUTH_SECRET="replace_with_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

## Setup Guide

### Neon DB Setup
1. Create a free PostgreSQL database on [Neon.tech](https://neon.tech).
2. Copy the direct connection string and place it in your `server/.env` file as `DATABASE_URL`.

### Prisma Setup & Running the Server
```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### Running the Client
```bash
cd client
npm install
npm run dev
```

## Demo Credentials

You can use the following seeded accounts to test the application:

**Admin:**
- email: admin@alignhr.com
- password: Admin@123

**HR:**
- email: hr@alignhr.com
- password: Hr@123

**Employee:**
- email: employee@alignhr.com
- password: Employee@123

## Hackathon Demo Flow
1. Login as Admin and view the overview dashboard.
2. Login as Employee to check-in for attendance and request a leave.
3. Login as HR to review the employee's attendance and approve the leave request.
4. Login as Admin to generate payroll for the employee.
5. Login as Employee to verify the approved leave and view the new payroll.

## Future Scope
- Mobile application using React Native.
- Real-time chat integration for employee communication.
- Advanced analytics and reporting dashboards.
- AI-driven performance review suggestions.

## Contributors
- The AlignHR Team

## License
MIT License
