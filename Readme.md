<![CDATA[# AlignHR — Human Resource Management System

> **Every workday, perfectly aligned.**

AlignHR is a modern, full-featured Human Resource Management System that digitizes core HR operations — employee onboarding, profile management, attendance tracking, leave management, payroll visibility, and approval workflows.

Built for the **Odoo Hackathon** problem statement.

---

## 🛠 Tech Stack

| Layer      | Technologies                                                   |
|------------|----------------------------------------------------------------|
| **Frontend** | Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · NextAuth.js · React Hook Form · Zod · Recharts · Lucide React |
| **Backend**  | Node.js · Express.js · TypeScript · Prisma ORM · PostgreSQL (Neon DB) · JWT · bcrypt |
| **Auth**     | NextAuth.js (Credentials Provider → Express backend) · JWT sessions |

---

## 📁 Project Structure

```
alignhr/
├── client/          → Next.js frontend application
│   ├── app/         → App router pages & API routes
│   ├── components/  → Reusable UI & feature components
│   ├── lib/         → Utilities, API client, auth config
│   ├── hooks/       → Custom React hooks
│   └── types/       → TypeScript type definitions
│
├── server/          → Express.js backend API
│   ├── src/
│   │   ├── config/       → App & database configuration
│   │   ├── controllers/  → Route handlers
│   │   ├── middleware/    → Auth, validation, error handling
│   │   ├── routes/       → API route definitions
│   │   ├── services/     → Business logic layer
│   │   ├── utils/        → Helper utilities
│   │   └── validations/  → Zod schemas
│   └── prisma/           → Database schema & migrations
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** database (recommended: [Neon DB](https://neon.tech))

### Backend Setup

```bash
cd server
npm install
cp .env.example .env          # Update with your DB URL & secrets
npx prisma generate
npx prisma db push
npm run seed                   # Seed demo data
npm run dev                    # Starts on http://localhost:5000
```

### Frontend Setup

```bash
cd client
npm install
cp .env.example .env.local     # Update with backend URL & NextAuth secret
npm run dev                    # Starts on http://localhost:3000
```

---

## 👥 Roles & Permissions

| Role       | Capabilities                                                                 |
|------------|------------------------------------------------------------------------------|
| **ADMIN**    | Full system access — manage users, employees, departments, payroll, settings |
| **HR**       | Manage employees, approve/reject leaves, view attendance, process payroll    |
| **EMPLOYEE** | View own profile, mark attendance, apply for leaves, view payslips           |

---

## 🔑 Demo Credentials

| Role     | Email                | Password     |
|----------|----------------------|--------------|
| Admin    | admin@alignhr.com    | password123  |
| HR       | hr@alignhr.com       | password123  |
| Employee | john@alignhr.com     | password123  |

---

## 📡 API Endpoints

| Method | Endpoint                     | Description                  | Access        |
|--------|------------------------------|------------------------------|---------------|
| POST   | `/api/auth/login`            | Login                        | Public        |
| POST   | `/api/auth/register`         | Register                     | Public        |
| GET    | `/api/auth/me`               | Current user profile         | Authenticated |
| GET    | `/api/employees`             | List all employees           | Admin, HR     |
| POST   | `/api/employees`             | Create employee              | Admin, HR     |
| GET    | `/api/employees/:id`         | Get employee details         | Authenticated |
| PUT    | `/api/employees/:id`         | Update employee              | Admin, HR     |
| DELETE | `/api/employees/:id`         | Delete employee              | Admin         |
| GET    | `/api/attendance`            | List attendance records      | Admin, HR     |
| POST   | `/api/attendance/check-in`   | Check in                     | Employee      |
| POST   | `/api/attendance/check-out`  | Check out                    | Employee      |
| GET    | `/api/attendance/my`         | My attendance                | Employee      |
| GET    | `/api/leaves`                | List all leave requests      | Admin, HR     |
| POST   | `/api/leaves`                | Apply for leave              | Employee      |
| PUT    | `/api/leaves/:id/approve`    | Approve leave                | Admin, HR     |
| PUT    | `/api/leaves/:id/reject`     | Reject leave                 | Admin, HR     |
| GET    | `/api/leaves/my`             | My leaves                    | Employee      |
| GET    | `/api/payroll`               | List all payroll             | Admin, HR     |
| POST   | `/api/payroll/generate`      | Generate payroll             | Admin         |
| GET    | `/api/payroll/my`            | My payslips                  | Employee      |
| GET    | `/api/departments`           | List departments             | Authenticated |
| POST   | `/api/departments`           | Create department            | Admin, HR     |
| PUT    | `/api/departments/:id`       | Update department            | Admin, HR     |
| DELETE | `/api/departments/:id`       | Delete department            | Admin         |
| GET    | `/api/dashboard/stats`       | Dashboard statistics         | Admin, HR     |

---

## 📄 License

MIT — built with ❤️ for the Odoo Hackathon.
]]>
