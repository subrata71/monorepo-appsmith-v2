/**
 * Daily Entry API
 *
 * API functions for daily entry operations
 */

import { get, post, put, handleError } from './index';
import type { components } from '@app/shared/api-types/generated-types';

// Types from generated API types
type DailyEntry = components['schemas']['DailyEntry'];
type DailyEntryCreateRequest = components['schemas']['DailyEntryCreateRequest'];
type DailyEntryUpdateRequest = components['schemas']['DailyEntryUpdateRequest'];
type DailyEntryResponse = components['schemas']['DailyEntryResponse'];

// Date utilities
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get daily entry for a specific date (defaults to today)
 */
export const getDailyEntry = async (
  entryDate?: string
): Promise<DailyEntry | null> => {
  try {
    const response = await get('/daily-entry', {
      params: {
        query: entryDate ? { entryDate } : {},
      },
    });

    if (response.error) {
      if (response.response?.status === 404) {
        return null; // Entry not found is expected
      }
      handleError(response.error);
    }

    const data = response.data as DailyEntryResponse;
    return data.data;
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 404
    ) {
      return null; // Entry not found is expected
    }
    throw error;
  }
};

/**
 * Create a new daily entry
 */
export const createDailyEntry = async (
  sentence: string,
  entryDate?: string
): Promise<DailyEntry> => {
  try {
    const requestData: DailyEntryCreateRequest = {
      sentence,
      ...(entryDate && { entryDate }),
    };

    const response = await post('/daily-entry', {
      body: requestData,
    });

    if (response.error) {
      handleError(response.error);
    }

    const data = response.data as DailyEntryResponse;
    return data.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Update an existing daily entry
 */
export const updateDailyEntry = async (
  sentence: string
): Promise<DailyEntry> => {
  try {
    const requestData: DailyEntryUpdateRequest = {
      sentence,
    };

    const response = await put('/daily-entry', {
      body: requestData,
    });

    if (response.error) {
      handleError(response.error);
    }

    const data = response.data as DailyEntryResponse;
    return data.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get today's daily entry
 */
export const getTodaysDailyEntry = async (): Promise<DailyEntry | null> => {
  return await getDailyEntry(getTodayDate());
};

/**
 * Create today's daily entry
 */
export const createTodaysDailyEntry = async (
  sentence: string
): Promise<DailyEntry> => {
  return await createDailyEntry(sentence, getTodayDate());
};
