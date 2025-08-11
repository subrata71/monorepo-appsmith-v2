/**
 * Item API Client
 * 
 * API functions for item management using TanStack Query
 * This module handles all HTTP requests related to items
 */

import type { Item, NewItem } from '../model/types';

// Base API URL - will be /api/v1 based on backend configuration
const API_BASE = '/api/v1';

/**
 * Fetch all items
 */
export const fetchItems = async (): Promise<{ data: Item[] }> => {
  const response = await fetch(`${API_BASE}/items`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch items: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Fetch a specific item by ID
 */
export const fetchItem = async (id: string): Promise<{ data: Item }> => {
  const response = await fetch(`${API_BASE}/items/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch item ${id}: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Create a new item
 */
export const createItem = async (newItem: NewItem): Promise<{ data: Item }> => {
  const response = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newItem),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create item: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Mark an item as done - This is the key API call for the toast functionality
 * This function triggers the backend event that we need to detect
 */
export const markItemDone = async (id: string): Promise<{ data: Item; message: string }> => {
  const response = await fetch(`${API_BASE}/items/${id}/markDone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Item not found');
    }
    throw new Error(`Failed to mark item as done: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Update an item
 */
export const updateItem = async (id: string, updates: Partial<Item>): Promise<{ data: Item }> => {
  const response = await fetch(`${API_BASE}/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update item ${id}: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Delete an item
 */
export const deleteItem = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/items/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete item ${id}: ${response.statusText}`);
  }
};