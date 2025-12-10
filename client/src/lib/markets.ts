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
    favoriteOutcome: "JD Vance",
    impliedProbPercent: 55,
    yesPrice: 0.55,
    noPrice: 0.45,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/republican-presidential-nominee-2028",
    polymarketSlug: "republican-presidential-nominee-2028"
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
    sourceUrl: "https://polymarket.com/event/democratic-presidential-nominee-2028",
    polymarketSlug: "democratic-presidential-nominee-2028"
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
    sourceUrl: "https://polymarket.com/event/time-2025-person-of-the-year",
    polymarketSlug: "time-2025-person-of-the-year"
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
    id: "btc-dip-80k",
    category: "Crypto",
    title: "Will Bitcoin dip to $80k by Dec 31?",
    favoriteOutcome: "Dips below $80,000",
    impliedProbPercent: 40,
    yesPrice: 0.40,
    noPrice: 0.60,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/what-price-will-bitcoin-hit-in-2025",
    polymarketSlug: "what-price-will-bitcoin-hit-in-2025"
  },
  {
    id: "eth-5000-2025",
    category: "Crypto",
    title: "What price will Ethereum hit in 2025?",
    favoriteOutcome: "$5,000",
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
    id: "elon-tweets-dec",
    category: "Social / Meme",
    title: "Elon Musk tweets in December 2025",
    favoriteOutcome: "1400+ tweets",
    impliedProbPercent: 54,
    yesPrice: 0.54,
    noPrice: 0.46,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/elon-musk-of-tweets-december-2025",
    polymarketSlug: "elon-musk-of-tweets-december-2025"
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
    id: "presidential-winner-2028",
    category: "Politics",
    title: "2028 Presidential Election Winner",
    favoriteOutcome: "J.D. Vance",
    impliedProbPercent: 30,
    yesPrice: 0.30,
    noPrice: 0.70,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/presidential-election-winner-2028",
    polymarketSlug: "presidential-election-winner-2028"
  },
  {
    id: "trump-out-2025",
    category: "Politics",
    title: "Trump out as President in 2025?",
    favoriteOutcome: "No",
    impliedProbPercent: 1,
    yesPrice: 0.01,
    noPrice: 0.99,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/trump-out-as-president-in-2025",
    polymarketSlug: "trump-out-as-president-in-2025"
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
    id: "trump-say-polymarket",
    category: "Social / Meme",
    title: "Will Trump say Polymarket by Dec 31?",
    favoriteOutcome: "No",
    impliedProbPercent: 6,
    yesPrice: 0.06,
    noPrice: 0.94,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/will-trump-say-polymarket-by-december-31",
    polymarketSlug: "will-trump-say-polymarket-by-december-31"
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
    title: "Super Bowl LX Champion 2026",
    favoriteOutcome: "Los Angeles R",
    impliedProbPercent: 17,
    yesPrice: 0.17,
    noPrice: 0.83,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/super-bowl-champion-2026-731",
    polymarketSlug: "super-bowl-champion-2026-731"
  },
  {
    id: "trump-meet-maduro",
    category: "Politics",
    title: "Will Trump talk to Maduro again by Dec 31?",
    favoriteOutcome: "Yes",
    impliedProbPercent: 52,
    yesPrice: 0.52,
    noPrice: 0.48,
    source: "Polymarket",
    sourceUrl: "https://polymarket.com/event/will-trump-talk-to-nicols-maduro-again-by-december-31",
    polymarketSlug: "will-trump-talk-to-nicols-maduro-again-by-december-31"
  }
];

export const categories = ["All", "Economy", "Politics", "Crypto", "Gaming", "Culture", "Social / Meme"];

export const sortOptions = [
  { value: "active", label: "Most Active" },
  { value: "ending", label: "Ending Soon" },
  { value: "edge", label: "Highest Implied Edge" }
];
