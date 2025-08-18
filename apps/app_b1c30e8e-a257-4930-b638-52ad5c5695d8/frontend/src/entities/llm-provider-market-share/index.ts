/**
 * LLM Provider Market Share Entity
 *
 * Public API for the LLM provider market share entity
 * Provides static data and types for market share visualization
 */

// Export types
export type {
  LlmProviderMarketShare,
  LlmProviderMarketShareList,
  IStaticMarketShareService,
} from './model/types';

// Export static data service
export {
  StaticMarketShareService,
  STATIC_MARKET_SHARE_DATA,
} from './lib/static-data';
