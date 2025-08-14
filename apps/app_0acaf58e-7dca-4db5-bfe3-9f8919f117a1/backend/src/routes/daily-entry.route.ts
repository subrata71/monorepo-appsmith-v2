/**
 * Daily Entry Routes
 * 
 * HTTP route handlers for daily entry endpoints
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { DailyEntryService } from '../services/daily-entry.service';
import { DailyEntryRepository } from '../repositories/daily-entry.repo';
import { getTodayDate } from '../utils/date';

// Request/Response schemas
const createDailyEntrySchema = z.object({
  sentence: z.string().min(1, 'Sentence is required').max(200, 'Sentence cannot exceed 200 characters'),
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
});

const updateDailyEntrySchema = z.object({
  sentence: z.string().min(1, 'Sentence is required').max(200, 'Sentence cannot exceed 200 characters'),
});

const getDailyEntryQuerySchema = z.object({
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
});

// Mock user ID for now (in a real app, this would come from authentication)
const MOCK_USER_ID = 'user-123';

export async function dailyEntryRoutes(fastify: FastifyInstance) {
  // Initialize dependencies
  const dailyEntryRepo = new DailyEntryRepository(fastify.db);
  const dailyEntryService = new DailyEntryService(dailyEntryRepo);

  /**
   * GET /api/v1/daily-entry
   * Get today's daily entry for the authenticated user
   */
  fastify.get(
    '/daily-entry',
    {
      schema: {
        tags: ['DailyEntry'],
        summary: "Get today's daily entry for the authenticated user",
        description: "Returns the user's entry for a specific date (defaults to today if not provided)",
        querystring: getDailyEntryQuerySchema,
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  entryDate: { type: 'string', format: 'date' },
                  sentence: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['id', 'userId', 'entryDate', 'sentence', 'createdAt', 'updatedAt'],
              },
            },
            required: ['data'],
          },
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { entryDate } = request.query as { entryDate?: string };
        
        const entry = await dailyEntryService.getEntry({
          userId: MOCK_USER_ID,
          entryDate: entryDate || getTodayDate(),
        });

        if (!entry) {
          return reply.status(404).send({ message: 'Entry not found for the specified date' });
        }

        return reply.send({ data: entry });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );

  /**
   * POST /api/v1/daily-entry
   * Create a daily entry for today
   */
  fastify.post(
    '/daily-entry',
    {
      schema: {
        tags: ['DailyEntry'],
        summary: 'Create a daily entry for today',
        description: 'Create a new one-sentence entry for the authenticated user for the given date (default: today). Only one per user per day.',
        body: createDailyEntrySchema,
        response: {
          201: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  entryDate: { type: 'string', format: 'date' },
                  sentence: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['id', 'userId', 'entryDate', 'sentence', 'createdAt', 'updatedAt'],
              },
            },
            required: ['data'],
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          409: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { sentence, entryDate } = request.body as { sentence: string; entryDate?: string };
        
        const entry = await dailyEntryService.createEntry({
          userId: MOCK_USER_ID,
          sentence,
          entryDate: entryDate || getTodayDate(),
        });

        return reply.status(201).send({ data: entry });
      } catch (error) {
        fastify.log.error(error);
        
        if (error instanceof Error) {
          if (error.message.includes('already exists')) {
            return reply.status(409).send({ message: error.message });
          }
          if (error.message.includes('empty') || error.message.includes('exceed')) {
            return reply.status(400).send({ message: error.message });
          }
        }
        
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );

  /**
   * PUT /api/v1/daily-entry
   * Update today's daily entry
   */
  fastify.put(
    '/daily-entry',
    {
      schema: {
        tags: ['DailyEntry'],
        summary: "Update today's daily entry",
        description: 'Update the one-sentence entry for the authenticated user for today. Only allowed before midnight.',
        body: updateDailyEntrySchema,
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  entryDate: { type: 'string', format: 'date' },
                  sentence: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['id', 'userId', 'entryDate', 'sentence', 'createdAt', 'updatedAt'],
              },
            },
            required: ['data'],
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          403: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { sentence } = request.body as { sentence: string };
        
        const entry = await dailyEntryService.updateEntry({
          userId: MOCK_USER_ID,
          sentence,
          entryDate: getTodayDate(), // Only allow updating today's entry
        });

        return reply.send({ data: entry });
      } catch (error) {
        fastify.log.error(error);
        
        if (error instanceof Error) {
          if (error.message.includes('not found')) {
            return reply.status(404).send({ message: error.message });
          }
          if (error.message.includes('Cannot edit')) {
            return reply.status(403).send({ message: error.message });
          }
          if (error.message.includes('empty') || error.message.includes('exceed')) {
            return reply.status(400).send({ message: error.message });
          }
        }
        
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
}