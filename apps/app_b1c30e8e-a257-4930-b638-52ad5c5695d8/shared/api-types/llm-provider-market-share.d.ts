/**
 * LLM Provider Market Share Types
 *
 * TypeScript type definitions for LLM provider market share data
 * These types are used across frontend for static data visualization
 */

/**
 * Represents an LLM provider's market share data
 */
export interface LlmProviderMarketShare {
  /** Name of the LLM provider */
  provider_name: string;
  /** Market share percentage (0-100) */
  market_share_percentage: number;
}

/**
 * Array of LLM provider market share data
 */
export type LlmProviderMarketShareList = LlmProviderMarketShare[];

/**
 * Static Market Share Service interface
 */
export interface StaticMarketShareService {
  getStaticMarketShareData(): LlmProviderMarketShareList;
}