# AlignHR Client - Memory

## Project Overview
- HR Management System frontend built with Next.js 14
- Uses App Router, TypeScript, Tailwind CSS, shadcn/ui
- Auth via NextAuth.js with JWT sessions
- Backend API at /api on Express server

## Key Decisions
- Dark theme with glassmorphism design
- Role-based UI (ADMIN, HR, EMPLOYEE)
- Client-side data fetching with native fetch
- Sonner for toast notifications
- Recharts for dashboard charts

## Design System
- Primary: Indigo/Violet gradient (#6366f1 → #8b5cf6)
- Background: Deep navy (#030712, #0f172a, #1e293b)
- Card backgrounds: Glass effect with backdrop-blur-xl
- Accent colors: Emerald (success), Rose (danger), Amber (warning), Sky (info)
- Font: Inter
- Border radius: rounded-xl for cards, rounded-lg for inputs

## Authentication
- NextAuth.js with CredentialsProvider
- JWT session strategy (24h expiry)
- Roles: ADMIN, HR, EMPLOYEE
- Token passed via session.user.accessToken

## API Communication
- Typed fetch wrapper in lib/api.ts
- Token passed as parameter (works server-side and client-side)
- Backend at NEXT_PUBLIC_API_URL (default http://localhost:5000)
