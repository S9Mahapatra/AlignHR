'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * Wraps the application in NextAuth's SessionProvider for client-side
 * session access via useSession().
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
