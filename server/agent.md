# AlignHR Backend Agent Guide

## Purpose

This file defines how AI coding agents should work on the AlignHR backend.

## General Rules

- Work only inside the `server/` folder unless the user asks otherwise.
- Do not create `.env.example`.
- Use only `.env`.
- Do not hardcode secrets.
- Keep `.env` in `.gitignore`.
- Keep code clean, typed, modular, and production-friendly.
- Follow the existing folder structure.
- Do not mix controller logic with database logic.
- Do not return password hashes in API responses.

## Backend API Agent

Responsible for:

- Creating REST routes
- Creating controllers
- Calling services
- Returning clean API responses
- Handling API errors consistently

Rules:

- Controllers should be thin.
- Services should contain business logic.
- Routes should only connect endpoints to controllers and middleware.

## Auth Agent

Responsible for:

- Register API
- Login API
- JWT generation
- Password hashing
- Protected route middleware
- Role-based access

Rules:

- Use bcrypt for password hashing.
- Use JWT for authentication.
- Add authenticated user info to `req.user`.
- Employees can only access their own records.
- ADMIN and HR can access management endpoints.

## Database Agent

Responsible for:

- Prisma schema
- Database relations
- Seed data
- Prisma migrations

Rules:

- Use PostgreSQL with Neon DB.
- Use proper enums.
- Use relational models.
- Keep employee data linked to user records.
- Use cascading behavior carefully.

## Validation Agent

Responsible for:

- Zod schemas
- Request body validation
- Params validation
- Query validation

Rules:

- Every POST and PATCH route must validate request data.
- Return helpful validation errors.
- Never trust frontend input.

## Security Agent

Responsible for:

- Auth protection
- Role protection
- Secure password handling
- Safe API responses

Rules:

- Never expose password hash.
- Never allow employee users to access another employee's data.
- Validate ownership for employee-only routes.
- Use HTTP status codes properly.

## Testing and Quality Agent

Responsible for:

- Running TypeScript checks
- Checking Prisma schema
- Checking route imports
- Checking API consistency
- Checking seed script

Before finishing, verify:

- `npm run dev` works
- `npm run build` works
- Prisma client generates successfully
- All routes are registered
- No TypeScript errors
- No missing imports
- No `.env.example` file exists
