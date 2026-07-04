// ============================================================================
// AlignHR - NextAuth Configuration
// Credentials-based auth with JWT strategy. Communicates with Express backend.
// ============================================================================

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiPost } from '@/lib/api';

// Extend NextAuth types for our custom user fields
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'ADMIN' | 'HR' | 'EMPLOYEE';
      employeeId: string;
      accessToken: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'HR' | 'EMPLOYEE';
    employeeId: string;
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await apiPost<{
            data: {
              user: { id: string; email: string; role: 'ADMIN' | 'HR' | 'EMPLOYEE' };
              employee: { id: string; firstName: string; lastName: string };
              token: string;
            };
          }>('/api/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, employee, token } = response.data;

          return {
            id: user.id,
            email: user.email,
            name: `${employee.firstName} ${employee.lastName}`,
            role: user.role,
            employeeId: employee.id,
            accessToken: token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign in, merge user data into the JWT token
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.name = user.name as string;
        token.role = (user as { role: 'ADMIN' | 'HR' | 'EMPLOYEE' }).role;
        token.employeeId = (user as { employeeId: string }).employeeId;
        token.accessToken = (user as { accessToken: string }).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Copy JWT fields into the session object for client-side access
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        employeeId: token.employeeId,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
