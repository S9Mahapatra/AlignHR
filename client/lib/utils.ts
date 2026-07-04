import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string or Date object to a human-readable Indian locale format.
 * Example: "05 Jan 2025"
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date string or Date object to a time string in Indian locale.
 * Example: "09:30 AM"
 */
export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a number as Indian Rupee currency.
 * Example: ₹1,50,000.00
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

/**
 * Extracts initials from a full name or first/last name pair.
 * Examples:
 *   getInitials("Rajesh Sharma") → "RS"
 *   getInitials("Sushruta", "Mahapatra") → "SM"
 */
export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName) return '??';
  
  if (lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  
  const parts = firstName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0]?.substring(0, 2).toUpperCase() || '??';
}
