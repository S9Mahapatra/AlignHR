import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/session-provider';
import { ToastProvider } from '@/components/providers/toast-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AlignHR — HR Management System',
  description:
    'A modern, full-featured HR Management System for managing employees, attendance, leaves, payroll, and departments.',
  keywords: ['HR', 'Human Resources', 'Employee Management', 'Payroll', 'Attendance'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
