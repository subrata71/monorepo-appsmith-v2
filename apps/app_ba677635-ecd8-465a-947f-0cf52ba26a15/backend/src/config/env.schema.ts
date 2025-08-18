export const envSchema = {
  type: 'object',
  properties: {
    APP_DATABASE_URL: { type: 'string' },
  },
  required: ['APP_DATABASE_URL'],
} as const;
