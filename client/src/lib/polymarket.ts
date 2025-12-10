/**
 * POLYMARKET LIVE DATA INTEGRATION
 * ================================
 * 
 * This module provides utilities for fetching and matching live prediction market
 * data from Polymarket's API via our backend proxy.
 * 
 * ## Architecture Overview
 * 
 * 1. Frontend requests market data via `/api/polymarket/slug/{slug}`
 * 2. Backend proxies requests to Polymarket's CLOB (Central Limit Order Book) API
 * 3. Response contains event details and market outcomes with live prices
 * 4. Frontend matches outcomes to display correct probabilities
 * 
 * ## Data Flow
 * 
 * Market Config (markets.ts) → Polymarket Slug → API Request → Outcome Matching → Live Prices
 * 
 * ## Polling Strategy
 * 
 * - Console page: Fetches all markets on mount, refreshes every 30 seconds
 * - Trading page: Fetches specific market on mount, refreshes every 10 seconds
 * - Settled markets (0%/100%): Visually distinguished, click shows terminal modal
 */

export interface PolymarketOutcome {
  question: string;
  outcomePrices?: [string, string];
  clobTokenIds: [string, string];
  groupItemTitle?: string;
}

export interface PolymarketResponse {
  event: {
    title: string;
    slug: string;
  };
  markets: PolymarketOutcome[];
}

export interface LivePriceData {
  yesPrice: number;
  noPrice: number;
  impliedProbPercent: number;
  isLive: boolean;
}

/**
 * Normalizes a string for comparison by:
 * - Converting to lowercase
 * - Removing special characters
 * - Removing extra whitespace
 */
export function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts numeric price target from a string (e.g., "$150,000" → "150000")
 */
export function extractPriceTarget(str: string): string | null {
  const match = str.match(/\$?([\d,]+)/);
  return match ? match[1].replace(/,/g, '') : null;
}

/**
 * Matches the correct Polymarket outcome based on the market's favorite outcome.
 * 
 * Strategy:
 * 1. Try exact price target match (e.g., "Bitcoin $150k" matches "$150,000" groupItemTitle)
 * 2. Try keyword matching on question text
 * 3. Fallback to first market with valid prices
 * 
 * @param markets - Array of Polymarket outcomes
 * @param favoriteOutcome - The expected outcome from our market config
 * @returns The matched outcome or null
 */
export function matchPolymarketOutcome(
  markets: PolymarketOutcome[],
  favoriteOutcome: string
): PolymarketOutcome | null {
  if (!markets || markets.length === 0) return null;

  const normalizedFavorite = normalizeForComparison(favoriteOutcome);
  const priceTarget = extractPriceTarget(favoriteOutcome);
  const keywords = normalizedFavorite.split(' ').filter(w => w.length > 2);

  // Strategy 1: Price target matching
  if (priceTarget) {
    const priceMatch = markets.find(m => {
      const groupTitle = normalizeForComparison(m.groupItemTitle || '');
      return groupTitle.includes(priceTarget);
    });
    if (priceMatch?.outcomePrices) return priceMatch;
  }

  // Strategy 2: Keyword matching
  const keywordMatch = markets.find(m => {
    const question = normalizeForComparison(m.question || '');
    const groupTitle = normalizeForComparison(m.groupItemTitle || '');
    const combined = question + ' ' + groupTitle;
    return keywords.some(kw => combined.includes(kw));
  });
  if (keywordMatch?.outcomePrices) return keywordMatch;

  // Strategy 3: Fallback to first with prices
  const fallback = markets.find(m => m.outcomePrices);
  return fallback || null;
}

/**
 * Parses Polymarket outcome prices into our standardized format.
 * 
 * Polymarket returns prices as strings in format ["0.75", "0.25"]
 * where index 0 is YES price and index 1 is NO price.
 * 
 * @param outcome - The matched Polymarket outcome
 * @returns LivePriceData with parsed prices
 */
export function parsePrices(outcome: PolymarketOutcome): LivePriceData {
  const [yesStr, noStr] = outcome.outcomePrices || ['0.5', '0.5'];
  const yesPrice = parseFloat(yesStr);
  const noPrice = parseFloat(noStr);
  
  return {
    yesPrice,
    noPrice,
    impliedProbPercent: Math.round(yesPrice * 100),
    isLive: true,
  };
}

/**
 * Fetches live price data for a market from Polymarket.
 * 
 * @param polymarketSlug - The Polymarket event slug
 * @param favoriteOutcome - Expected outcome for matching
 * @returns LivePriceData or null if fetch fails
 */
export async function fetchMarketPrice(
  polymarketSlug: string,
  favoriteOutcome: string
): Promise<LivePriceData | null> {
  try {
    const response = await fetch(`/api/polymarket/slug/${polymarketSlug}`);
    if (!response.ok) return null;

    const data: PolymarketResponse = await response.json();
    if (!data.markets || data.markets.length === 0) return null;

    const matchedOutcome = matchPolymarketOutcome(data.markets, favoriteOutcome);
    if (!matchedOutcome?.outcomePrices) return null;

    return parsePrices(matchedOutcome);
  } catch (error) {
    console.error(`Failed to fetch price for ${polymarketSlug}:`, error);
    return null;
  }
}

/**
 * Determines if a market is settled (resolved) based on its probability.
 * Markets showing 0% or 100% are considered settled.
 */
export function isMarketSettled(impliedProbPercent: number): boolean {
  return impliedProbPercent === 0 || impliedProbPercent === 100;
}
