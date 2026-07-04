'use client';

import { Toaster } from 'sonner';

/**
 * Sonner toast notification provider configured for dark theme.
 * Positioned at top-right with rich colors and close buttons.
 */
export function ToastProvider() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(24px)',
        },
      }}
    />
  );
}
