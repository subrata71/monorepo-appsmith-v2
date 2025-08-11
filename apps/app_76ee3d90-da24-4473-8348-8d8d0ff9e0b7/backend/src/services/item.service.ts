/**
 * Item Service - Business logic for managing items and todo functionality
 */

import { itemRepo } from '../repositories/item.repo.js';
import { Item, NewItem } from '../db/schema.js';
import { FastifyInstance } from 'fastify';
import { log } from '../utils/index.js';

export function makeItemService(app: FastifyInstance) {
  const repo = app.repositories.item ?? itemRepo(app.db as any);

  return {
    /**
     * Get all items
     */
    getItems: () => {
      log.info('Fetching all items');
      return repo.findAll();
    },

    /**
     * Get a specific item by ID
     */
    async getItem(id: string) {
      log.info(`Fetching item ${id}`);
      const found = await repo.findById(id);
      if (!found) throw new Error('Item not found');
      return found;
    },

    /**
     * Create a new item
     */
    createItem: (data: NewItem) => {
      log.info('Creating new item');
      return repo.create(data);
    },

    /**
     * Mark an item as done - this is the key functionality for the toast feature
     */
    async markItemDone(id: string) {
      log.info(`Marking item ${id} as done`);
      
      // First verify the item exists
      const item = await repo.findById(id);
      if (!item) {
        throw new Error('Item not found');
      }
      
      // Check if already done
      if (item.status === 'done') {
        log.info(`Item ${id} is already marked as done`);
        return item;
      }
      
      // Mark as done
      const updatedItem = await repo.markAsDone(id);
      
      log.info(`Successfully marked item ${id} as done`);
      return updatedItem;
    },

    /**
     * Update item
     */
    updateItem: (id: string, changes: Partial<Item>) => {
      log.info(`Updating item ${id}`);
      return repo.update(id, changes);
    },

    /**
     * Remove item
     */
    removeItem: (id: string) => {
      log.info(`Removing item ${id}`);
      return repo.delete(id);
    },
  };
}

export type ItemService = ReturnType<typeof makeItemService>;