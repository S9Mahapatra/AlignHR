# AlignHR — Backend API

Express.js + TypeScript backend for the AlignHR Human Resource Management System.

## Tech Stack

- **Runtime:** Node.js + Express.js + TypeScript
- **ORM:** Prisma with PostgreSQL (Neon DB)
- **Auth:** JWT + bcryptjs
- **Validation:** Zod

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Update `DATABASE_URL` to point to your PostgreSQL (Neon) database.

### 3. Generate Prisma Client & Push Schema

```bash
npm run prisma:generate
npm run prisma:push
```

### 4. Seed the Database (Optional)

```bash
npm run seed
```

This creates sample departments, users (admin, HR, employees), attendance records, leave requests, and payroll records.

### 5. Start Development Server

```bash
npm run dev
```

The server starts on `http://localhost:5000` by default.

### 6. Build for Production

```bash
npm run build
npm start
```

## Default Seed Credentials

| Role     | Email              | Password    |
| -------- | ------------------ | ----------- |
| Admin    | admin@alignhr.com  | password123 |
| HR       | hr@alignhr.com     | password123 |
| Employee | john@alignhr.com   | password123 |

## API Routes

| Prefix            | Description         |
| ------------------ | ------------------- |
| `/api/auth`        | Authentication      |
| `/api/employees`   | Employee management |
| `/api/attendance`  | Attendance tracking |
| `/api/leaves`      | Leave management    |
| `/api/payroll`     | Payroll processing  |
| `/api/departments` | Department CRUD     |
| `/api/dashboard`   | Dashboard stats     |
