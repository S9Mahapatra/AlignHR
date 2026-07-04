# AlignHR — Frontend Client

A modern HR Management System frontend built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

## Features

- 🌙 Premium dark theme with glassmorphism design
- 🔐 Role-based authentication (Admin, HR, Employee)
- 📊 Interactive dashboard with charts (Recharts)
- 👥 Employee management with CRUD operations
- 🏢 Department organization
- 📅 Attendance tracking with check-in/out
- 🏖️ Leave management with approval workflow
- 💰 Payroll processing and reports
- 📱 Fully responsive design

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | React framework (App Router) |
| TypeScript | Type safety |
| Tailwind CSS v3 | Utility-first styling |
| shadcn/ui | UI component library |
| NextAuth.js | Authentication |
| React Hook Form + Zod | Form handling & validation |
| Recharts | Data visualization |
| Sonner | Toast notifications |
| Lucide React | Icon library |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (default: `http://localhost:5000`)

### Installation

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your values
# NEXTAUTH_SECRET=your-secret-here
# NEXTAUTH_URL=http://localhost:3000
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
client/
├── app/                    # Next.js App Router
│   ├── api/auth/           # NextAuth API routes
│   ├── (dashboard)/        # Protected routes with sidebar layout
│   ├── login/              # Login page
│   ├── globals.css         # Global styles & CSS variables
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing/redirect page
├── components/
│   ├── layout/             # Sidebar, Header components
│   ├── providers/          # Context providers
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, API client, auth config
└── types/                  # TypeScript type definitions
```

## Design System

- **Colors**: Indigo/Violet gradient primary, deep navy backgrounds
- **Cards**: Glassmorphism with `backdrop-blur-xl`
- **Font**: Inter (Google Fonts)
- **Animations**: Fade-in, slide-up, shimmer loading states
- **Borders**: Subtle white/5 opacity borders

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXTAUTH_SECRET` | Secret for JWT encryption | (required) |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000` |

## License

Private — All rights reserved.
