export const APP_CONFIG = {
  APP_NAME: 'App Template',
  VERSION: '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
} as const;

export const ROUTES = {
  HOME: '/',
} as const;
