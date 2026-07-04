# AlignHR Client - Agent Instructions

## Architecture
- /app - Next.js App Router pages
- /components/ui - shadcn/ui primitives
- /components/layout - Sidebar, Header
- /components/providers - SessionProvider, ToastProvider
- /components/[feature] - Feature-specific components
- /lib - Utilities, API client, auth config
- /hooks - Custom React hooks
- /types - TypeScript type definitions

## Patterns
- Use 'use client' for interactive components
- Use useSession() for auth state
- Use api client from @/lib/api for data fetching
- Use sonner toast for notifications
- Use React Hook Form + Zod for forms
- Use shadcn/ui components for UI
- Use cn() from @/lib/utils for conditional classes

## File Conventions
- Page components: app/[route]/page.tsx (server components by default)
- Layout components: app/[route]/layout.tsx
- Client components: must have 'use client' directive
- Types: import from @/types
- UI components: import from @/components/ui/[component]

## Design Tokens
- Glass cards: use `glass-card` class or Card component
- Gradient text: use `gradient-text` class
- Status badges: use Badge with appropriate variant
- Animations: use `animate-fade-in`, `animate-slide-up` classes

## Data Flow
1. useSession() → get accessToken
2. apiGet/apiPost/... with token → fetch from backend
3. Handle loading/error states
4. Display with shadcn/ui components
5. Toast notifications for success/error feedback
