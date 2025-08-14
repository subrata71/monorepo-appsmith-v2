/**
 * Daily Entry Service
 * 
 * Business logic for daily entry operations
 */

import { DailyEntryRepository } from '../repositories/daily-entry.repo';
import type { DailyEntry, NewDailyEntry } from '../db/schema';
import { getTodayDate, canEditEntry } from '../utils/date';

export interface CreateDailyEntryRequest {
  userId: string;
  sentence: string;
  entryDate?: string; // Optional, defaults to today
}

export interface UpdateDailyEntryRequest {
  userId: string;
  sentence: string;
  entryDate?: string; // Optional, defaults to today
}

export interface GetDailyEntryRequest {
  userId: string;
  entryDate?: string; // Optional, defaults to today
}

export class DailyEntryService {
  constructor(private dailyEntryRepo: DailyEntryRepository) {}

  /**
   * Create a new daily entry
   */
  async createEntry(request: CreateDailyEntryRequest): Promise<DailyEntry> {
    const { userId, sentence, entryDate = getTodayDate() } = request;
    
    // Validate sentence
    if (!sentence.trim()) {
      throw new Error('Sentence cannot be empty');
    }
    
    if (sentence.length > 200) {
      throw new Error('Sentence cannot exceed 200 characters');
    }
    
    // Check if entry already exists for this date
    const existingEntry = await this.dailyEntryRepo.findByUserAndDate(userId, entryDate);
    if (existingEntry) {
      throw new Error('Entry already exists for this date');
    }
    
    const newEntry: NewDailyEntry = {
      userId,
      entryDate,
      sentence: sentence.trim(),
    };
    
    return await this.dailyEntryRepo.create(newEntry);
  }

  /**
   * Get daily entry for a user and date
   */
  async getEntry(request: GetDailyEntryRequest): Promise<DailyEntry | null> {
    const { userId, entryDate = getTodayDate() } = request;
    
    return await this.dailyEntryRepo.findByUserAndDate(userId, entryDate);
  }

  /**
   * Update an existing daily entry
   */
  async updateEntry(request: UpdateDailyEntryRequest): Promise<DailyEntry> {
    const { userId, sentence, entryDate = getTodayDate() } = request;
    
    // Validate sentence
    if (!sentence.trim()) {
      throw new Error('Sentence cannot be empty');
    }
    
    if (sentence.length > 200) {
      throw new Error('Sentence cannot exceed 200 characters');
    }
    
    // Check if entry exists
    const existingEntry = await this.dailyEntryRepo.findByUserAndDate(userId, entryDate);
    if (!existingEntry) {
      throw new Error('Entry not found for this date');
    }
    
    // Check if editing is allowed (only for today's entry before midnight)
    if (!canEditEntry(entryDate)) {
      throw new Error('Cannot edit entries from previous days');
    }
    
    const updatedEntry = await this.dailyEntryRepo.update(userId, entryDate, sentence.trim());
    
    if (!updatedEntry) {
      throw new Error('Failed to update entry');
    }
    
    return updatedEntry;
  }

  /**
   * Get all entries for a user
   */
  async getEntriesByUser(
    userId: string, 
    options: { limit?: number; offset?: number } = {}
  ): Promise<DailyEntry[]> {
    return await this.dailyEntryRepo.findByUser(userId, options);
  }
}