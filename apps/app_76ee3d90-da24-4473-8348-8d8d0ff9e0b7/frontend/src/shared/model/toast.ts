/**
 * Toast Types and Models
 * 
 * Shared types for the toast notification system
 * According to tech spec: Toast model with id, message, type, createdAt, duration
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  createdAt: string;
  duration?: number; // Duration in milliseconds, defaults to 3000
}

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Default configuration
export const TOAST_CONFIG = {
  DEFAULT_DURATION: 3000, // 3 seconds as per spec
  MAX_TOASTS: 3, // Maximum 3 stacked toasts as per spec
  POSITION: 'bottom-right' as const,
} as const;