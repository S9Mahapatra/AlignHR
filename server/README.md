# AlignHR Backend

> **Every workday, perfectly aligned.**

AlignHR is a role-based Human Resource Management System backend providing REST APIs for employee profile management, attendance tracking, leave and time-off management, payroll visibility, and Admin/HR approval workflows.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| TypeScript | Type safety |
| Prisma ORM | Database ORM |
| PostgreSQL | Database |
| Neon DB | Cloud PostgreSQL hosting |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Zod | Request validation |
| cookie-parser | Cookie handling |
| morgan | HTTP logging |
| CORS | Cross-origin resource sharing |

## Folder Structure

```
server/
├── src/
│   ├── config/
│   │   ├── env.ts              # Environment variables
│   │   └── prisma.ts           # Prisma client singleton
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── employee.controller.ts
│   │   ├── attendance.controller.ts
│   │   ├── leave.controller.ts
│   │   └── payroll.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT authentication
│   │   ├── role.middleware.ts   # Role-based authorization
│   │   ├── error.middleware.ts  # Centralized error handling
│   │   └── validate.middleware.ts # Zod validation
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── employee.routes.ts
│   │   ├── attendance.routes.ts
│   │   ├── leave.routes.ts
│   │   └── payroll.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── employee.service.ts
│   │   ├── attendance.service.ts
│   │   ├── leave.service.ts
│   │   └── payroll.service.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── response.ts
│   │   └── async-handler.ts
│   ├── validations/
│   │   ├── auth.validation.ts
│   │   ├── employee.validation.ts
│   │   ├── attendance.validation.ts
│   │   ├── leave.validation.ts
│   │   └── payroll.validation.ts
│   ├── types/
│   │   └── express.d.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── memory.md
├── agent.md
├── package.json
├── tsconfig.json
├── .env
├── .gitignore
└── README.md
```

## Environment Variables

This backend uses only `.env` (not `.env.example`).

Create a `.env` file in `server/`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require"

PORT=5000
NODE_ENV=development

JWT_SECRET="replace_with_strong_secret"
JWT_EXPIRES_IN="7d"

CLIENT_URL="http://localhost:3000"
BCRYPT_SALT_ROUNDS=10
```

## Setup Commands

```bash
# 1. Install dependencies
cd server
npm install

# 2. Configure environment
# Edit .env with your Neon DB credentials

# 3. Generate Prisma client
npm run prisma:generate

# 4. Run database migration
npm run prisma:migrate

# 5. Seed the database
npm run prisma:seed

# 6. Start development server
npm run dev
```

## Neon DB Setup

1. Create an account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Paste it into `.env` as `DATABASE_URL`
5. Run migrations: `npm run prisma:migrate`

## Prisma Commands

```bash
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run migrations (dev)
npm run prisma:studio     # Open Prisma Studio GUI
npm run prisma:seed       # Seed database with demo data
```

## API Routes

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT |
| GET | `/api/auth/me` | JWT | Get current user profile |

### Employees (`/api/employees`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/employees` | JWT | ADMIN, HR | List all employees |
| GET | `/api/employees/:id` | JWT | ADMIN, HR | Get employee by ID |
| PATCH | `/api/employees/:id` | JWT | ADMIN, HR | Update employee |
| DELETE | `/api/employees/:id` | JWT | ADMIN | Delete employee |
| GET | `/api/employees/me/profile` | JWT | Any | Get own profile |
| PATCH | `/api/employees/me/profile` | JWT | Any | Update own profile |

### Attendance (`/api/attendance`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/attendance/check-in` | JWT | Any | Check in |
| POST | `/api/attendance/check-out` | JWT | Any | Check out |
| GET | `/api/attendance/me` | JWT | Any | Get own attendance |
| GET | `/api/attendance` | JWT | ADMIN, HR | Get all attendance |
| PATCH | `/api/attendance/:id` | JWT | ADMIN, HR | Update attendance |

### Leave (`/api/leaves`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/leaves` | JWT | Any | Apply for leave |
| GET | `/api/leaves/me` | JWT | Any | Get own leave requests |
| GET | `/api/leaves` | JWT | ADMIN, HR | Get all leave requests |
| PATCH | `/api/leaves/:id/approve` | JWT | ADMIN, HR | Approve leave |
| PATCH | `/api/leaves/:id/reject` | JWT | ADMIN, HR | Reject leave |

### Payroll (`/api/payroll`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/payroll/me` | JWT | Any | Get own payroll |
| GET | `/api/payroll` | JWT | ADMIN, HR | Get all payroll |
| GET | `/api/payroll/:employeeId` | JWT | ADMIN, HR | Get employee payroll |
| POST | `/api/payroll` | JWT | ADMIN, HR | Create payroll record |
| PATCH | `/api/payroll/:id` | JWT | ADMIN, HR | Update payroll record |

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@alignhr.com | Admin@123 |
| HR | hr@alignhr.com | Hr@123 |
| Employee | employee@alignhr.com | Employee@123 |

## Auth Flow

1. **Register** — `POST /api/auth/register` with name, employeeId, email, password, role
2. **Login** — `POST /api/auth/login` with email and password → returns JWT token
3. **Access Protected Routes** — Include `Authorization: Bearer <token>` header
4. **Get Profile** — `GET /api/auth/me` returns current user with profile

## Role Permissions

| Action | ADMIN | HR | EMPLOYEE |
|--------|-------|-----|----------|
| Register users | ✅ (via seed) | ✅ | ✅ |
| View all employees | ✅ | ✅ | ❌ |
| Update any employee | ✅ | ✅ | ❌ |
| Delete employee | ✅ | ❌ | ❌ |
| View own profile | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ (limited) |
| Check in/out | ✅ | ✅ | ✅ |
| View own attendance | ✅ | ✅ | ✅ |
| View all attendance | ✅ | ✅ | ❌ |
| Apply for leave | ✅ | ✅ | ✅ |
| Approve/reject leave | ✅ | ✅ | ❌ |
| View own payroll | ✅ | ✅ | ✅ |
| Manage payroll | ✅ | ✅ | ❌ |

## Seed Command

```bash
npm run prisma:seed
```

Seeds the database with:
- 1 Admin user
- 1 HR user
- 8 Employee users
- Employee profiles for all users
- Attendance records (last 7 working days)
- Leave requests (mix of PENDING, APPROVED, REJECTED)
- Payroll records (current month)

## Security

- All passwords are hashed with bcrypt
- JWT tokens expire after 7 days
- Password hashes are never returned in API responses
- Role-based middleware protects admin/HR endpoints
- Employees can only access their own data
- ADMIN accounts cannot be created via public registration
