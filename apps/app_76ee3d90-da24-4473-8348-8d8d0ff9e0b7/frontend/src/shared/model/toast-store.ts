/**
 * Toast Store
 * 
 * Zustand store for managing toast notifications state
 * Handles showing, dismissing, and stacking toasts (max 3 as per spec)
 */

import { create } from 'zustand';
import { toast as sonnerToast } from 'sonner';
import type { Toast, ToastOptions } from './toast';
import { TOAST_CONFIG } from './toast';

interface ToastState {
  toasts: Toast[];
}

interface ToastActions {
  showToast: (message: string, options?: ToastOptions) => string;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
}

type ToastStore = ToastState & ToastActions;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  showToast: (message: string, options: ToastOptions = {}): string => {
    const {
      type = 'info',
      duration = TOAST_CONFIG.DEFAULT_DURATION,
      action,
    } = options;

    // Generate unique ID
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newToast: Toast = {
      id,
      message,
      type,
      createdAt: new Date().toISOString(),
      duration,
    };

    // Show toast using Sonner
    const sonnerOptions = {
      id,
      duration,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    };

    switch (type) {
      case 'success':
        sonnerToast.success(message, sonnerOptions);
        break;
      case 'error':
        sonnerToast.error(message, sonnerOptions);
        break;
      case 'warning':
        sonnerToast.warning(message, sonnerOptions);
        break;
      case 'info':
      default:
        sonnerToast.info(message, sonnerOptions);
        break;
    }

    // Update store state - manage max 3 toasts as per spec
    set((state) => {
      const newToasts = [newToast, ...state.toasts];
      
      // Keep only max 3 toasts - remove oldest if exceeding
      if (newToasts.length > TOAST_CONFIG.MAX_TOASTS) {
        const excessToasts = newToasts.slice(TOAST_CONFIG.MAX_TOASTS);
        // Dismiss excess toasts from Sonner
        excessToasts.forEach(t => sonnerToast.dismiss(t.id));
        return {
          toasts: newToasts.slice(0, TOAST_CONFIG.MAX_TOASTS),
        };
      }

      return { toasts: newToasts };
    });

    return id;
  },

  dismissToast: (id: string) => {
    // Dismiss from Sonner
    sonnerToast.dismiss(id);
    
    // Remove from store state
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    }));
  },

  clearAllToasts: () => {
    // Dismiss all from Sonner
    sonnerToast.dismiss();
    
    // Clear store state
    set({ toasts: [] });
  },
}));