/**
 * Item Entity Public API
 * 
 * Exports all public interfaces from the Item entity layer
 * Following Feature-Sliced Design conventions
 */

// Types and models
export type { 
  Item, 
  NewItem, 
  ItemDisplayProps, 
  ItemFormData,
  ItemStatus
} from './model/types';
export { ITEM_STATUS_CONFIG } from './model/types';

// API functions
export {
  fetchItems,
  fetchItem,
  createItem,
  markItemDone,
  updateItem,
  deleteItem
} from './api/itemApi';

// UI Components
export { ItemCard } from './ui/ItemCard';