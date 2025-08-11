/**
 * Item Entity Types
 * 
 * Type definitions for the Item entity following FSD conventions
 * These types are used throughout the frontend for item management
 */

// Re-export types from the shared API types for consistency
export type { Item, NewItem } from '@shared/api-types/item.js';

// Additional frontend-specific types for the Item entity
export interface ItemDisplayProps {
  item: Item;
  onMarkDone?: (itemId: string) => void;
  onEdit?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
}

export interface ItemFormData {
  title: string;
  status?: 'pending' | 'done';
}

// Status display configuration
export const ITEM_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    variant: 'secondary' as const,
    icon: 'circle'
  },
  done: {
    label: 'Done',
    variant: 'default' as const,
    icon: 'check-circle'
  }
} as const;

export type ItemStatus = keyof typeof ITEM_STATUS_CONFIG;