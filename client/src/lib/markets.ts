export interface Market {
  id: string;
  category: string;
  title: string;
  favoriteOutcome: string;
  impliedProbPercent: number;
  yesPrice: number;
  noPrice: number;
  source: string;
  sourceUrl: string;
}

export const markets: Market[] = [
  {
    id: "fed-rate-cuts-2025",
    category: "Economy",
    title: "How many Fed rate cuts in 2025?",
    favoriteOutcome: "3 cuts (75 bps)",
    impliedProbPercent: 97,
    yesPrice: 0.97,
    noPrice: 0.03,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/search/2025-predictions"
  },
  {
    id: "gop-nominee-2028",
    category: "Politics",
    title: "Republican Presidential Nominee 2028",
    favoriteOutcome: "J.D. Vance",
    impliedProbPercent: 55,
    yesPrice: 0.55,
    noPrice: 0.45,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/search/all"
  },
  {
    id: "dem-nominee-2028",
    category: "Politics",
    title: "Democratic Presidential Nominee 2028",
    favoriteOutcome: "Gavin Newsom",
    impliedProbPercent: 37,
    yesPrice: 0.37,
    noPrice: 0.63,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/search/all"
  },
  {
    id: "time-poy-2025",
    category: "Culture",
    title: "Time 2025 Person of the Year",
    favoriteOutcome: "Artificial Intelligence",
    impliedProbPercent: 69,
    yesPrice: 0.69,
    noPrice: 0.31,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/search/all"
  },
  {
    id: "btc-hit-95k-2025",
    category: "Crypto",
    title: "What price will Bitcoin hit in 2025?",
    favoriteOutcome: "Ends above $95,000",
    impliedProbPercent: 72,
    yesPrice: 0.73,
    noPrice: 0.29,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/what-price-will-bitcoin-hit-in-2025"
  },
  {
    id: "btc-dec15-range",
    category: "Crypto",
    title: "Bitcoin price on December 15, 2025",
    favoriteOutcome: "$92k–$94k range",
    impliedProbPercent: 16,
    yesPrice: 0.18,
    noPrice: 0.86,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/bitcoin-price-on-december-15"
  },
  {
    id: "eth-5000-2025",
    category: "Crypto",
    title: "What price will Ethereum hit in 2025?",
    favoriteOutcome: "Hits $5,000",
    impliedProbPercent: 3,
    yesPrice: 0.03,
    noPrice: 0.97,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/search/all"
  },
  {
    id: "gta-2025-release",
    category: "Gaming",
    title: "GTA VI released in 2025?",
    favoriteOutcome: "Yes",
    impliedProbPercent: 1,
    yesPrice: 0.01,
    noPrice: 0.99,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/gta-vi-released-in-2025"
  },
  {
    id: "gta-before-june-2026",
    category: "Gaming",
    title: "GTA VI released before June 2026?",
    favoriteOutcome: "Yes",
    impliedProbPercent: 4,
    yesPrice: 0.04,
    noPrice: 0.96,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/will-gta-6-cost-100"
  },
  {
    id: "elon-tweets-week",
    category: "Social / Meme",
    title: "Elon Musk # tweets (Dec 5–12, 2025)",
    favoriteOutcome: "440–459 tweets",
    impliedProbPercent: 19,
    yesPrice: 0.19,
    noPrice: 0.81,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/search/all"
  }
];

export const categories = ["All", "Economy", "Politics", "Crypto", "Gaming", "Culture", "Social / Meme"];

export const sortOptions = [
  { value: "active", label: "Most Active" },
  { value: "ending", label: "Ending Soon" },
  { value: "edge", label: "Highest Implied Edge" }
];
