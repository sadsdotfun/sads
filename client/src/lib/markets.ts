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
  tokenId?: string;
  polymarketSlug?: string;
}

export const markets: Market[] = [
  {
    id: "fed-rate-cuts-2025",
    category: "Economy",
    title: "Fed rate cut in December 2025?",
    favoriteOutcome: "25 bps cut",
    impliedProbPercent: 95,
    yesPrice: 0.95,
    noPrice: 0.05,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/fed-decision-in-december",
    polymarketSlug: "fed-decision-in-december"
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
    sourceUrl: "https://polymarket.com/event/2028-republican-presidential-nomination",
    polymarketSlug: "2028-republican-presidential-nomination"
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
    sourceUrl: "https://polymarket.com/event/2028-democratic-presidential-nomination",
    polymarketSlug: "2028-democratic-presidential-nomination"
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
    sourceUrl: "https://polymarket.com/event/times-2025-person-of-the-year",
    polymarketSlug: "times-2025-person-of-the-year"
  },
  {
    id: "btc-hit-95k-2025",
    category: "Crypto",
    title: "What price will Bitcoin hit in 2025?",
    favoriteOutcome: "Ends above $95,000",
    impliedProbPercent: 61,
    yesPrice: 0.61,
    noPrice: 0.39,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/what-price-will-bitcoin-hit-in-2025",
    polymarketSlug: "what-price-will-bitcoin-hit-in-2025"
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
    sourceUrl: "https://polymarket.com/event/bitcoin-price-on-december-15",
    polymarketSlug: "bitcoin-price-on-december-15"
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
    sourceUrl: "https://polymarket.com/event/what-price-will-ethereum-hit-in-2025",
    polymarketSlug: "what-price-will-ethereum-hit-in-2025"
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
    sourceUrl: "https://polymarket.com/event/gta-vi-released-in-2025",
    polymarketSlug: "gta-vi-released-in-2025"
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
    sourceUrl: "https://polymarket.com/event/will-gta-6-cost-100",
    polymarketSlug: "will-gta-6-cost-100"
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
    sourceUrl: "https://polymarket.com/event/elon-musk-of-tweets-december-5-december-12",
    polymarketSlug: "elon-musk-of-tweets-december-5-december-12"
  },
  {
    id: "trump-tariffs-china",
    category: "Economy",
    title: "Trump imposes 100% tariff on China before July?",
    favoriteOutcome: "No",
    impliedProbPercent: 15,
    yesPrice: 0.15,
    noPrice: 0.85,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/trump-imposes-100-tariff-on-china-before-july",
    polymarketSlug: "trump-imposes-100-tariff-on-china-before-july"
  },
  {
    id: "us-recession-2025",
    category: "Economy",
    title: "Will the US enter a recession in 2025?",
    favoriteOutcome: "No",
    impliedProbPercent: 3,
    yesPrice: 0.03,
    noPrice: 0.97,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/us-recession-in-2025",
    polymarketSlug: "us-recession-in-2025"
  },
  {
    id: "desantis-2028",
    category: "Politics",
    title: "Will Ron DeSantis run for President in 2028?",
    favoriteOutcome: "Yes",
    impliedProbPercent: 48,
    yesPrice: 0.48,
    noPrice: 0.52,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/will-ron-desantis-run-for-president-in-2028",
    polymarketSlug: "will-ron-desantis-run-for-president-in-2028"
  },
  {
    id: "trump-pardon-jan6",
    category: "Politics",
    title: "Trump pardons Jan 6 defendants?",
    favoriteOutcome: "Yes",
    impliedProbPercent: 89,
    yesPrice: 0.89,
    noPrice: 0.11,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/trump-pardons-jan-6-defendants",
    polymarketSlug: "trump-pardons-jan-6-defendants"
  },
  {
    id: "sol-ath-2025",
    category: "Crypto",
    title: "Solana all time high before 2026?",
    favoriteOutcome: "No",
    impliedProbPercent: 7,
    yesPrice: 0.07,
    noPrice: 0.93,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/solana-all-time-high-before-2026",
    polymarketSlug: "solana-all-time-high-before-2026"
  },
  {
    id: "btc-150k-2025",
    category: "Crypto",
    title: "Will Bitcoin hit $150,000 in 2025?",
    favoriteOutcome: "No",
    impliedProbPercent: 8,
    yesPrice: 0.08,
    noPrice: 0.92,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/when-will-bitcoin-hit-150k",
    polymarketSlug: "when-will-bitcoin-hit-150k"
  },
  {
    id: "nintendo-switch-2",
    category: "Gaming",
    title: "Nintendo Switch 2 released in 2025?",
    favoriteOutcome: "Yes",
    impliedProbPercent: 85,
    yesPrice: 0.85,
    noPrice: 0.15,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/nintendo-switch-2-2025",
    polymarketSlug: "nintendo-switch-2-2025"
  },
  {
    id: "oscars-best-picture",
    category: "Culture",
    title: "2025 Oscar Best Picture Winner",
    favoriteOutcome: "Anora",
    impliedProbPercent: 42,
    yesPrice: 0.42,
    noPrice: 0.58,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/oscars-best-picture",
    polymarketSlug: "oscars-best-picture"
  },
  {
    id: "super-bowl-winner",
    category: "Culture",
    title: "Super Bowl LIX Winner",
    favoriteOutcome: "Kansas City Chiefs",
    impliedProbPercent: 28,
    yesPrice: 0.28,
    noPrice: 0.72,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/super-bowl-lix-champion",
    polymarketSlug: "super-bowl-lix-champion"
  },
  {
    id: "trump-truth-social",
    category: "Social / Meme",
    title: "Will Trump post on X in 2025?",
    favoriteOutcome: "Yes",
    impliedProbPercent: 67,
    yesPrice: 0.67,
    noPrice: 0.33,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/will-trump-post-on-x-in-2025",
    polymarketSlug: "will-trump-post-on-x-in-2025"
  }
];

export const categories = ["All", "Economy", "Politics", "Crypto", "Gaming", "Culture", "Social / Meme"];

export const sortOptions = [
  { value: "active", label: "Most Active" },
  { value: "ending", label: "Ending Soon" },
  { value: "edge", label: "Highest Implied Edge" }
];
