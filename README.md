# SADS.FUN - Solana Autonomous Discovery System

A quantum-themed prediction market interface that displays live Polymarket data with TradingView-style candlestick charts. Built with privacy-focused design and Nintendo-inspired 3D UI elements.

## 🚀 Live Features

- **20 Live Prediction Markets** - Real-time data from Polymarket's CLOB API
- **TradingView Candlestick Charts** - Professional trading charts using lightweight-charts library
- **3D Hover Effects** - Nintendo-style card animations with depth tracking
- **Phantom Wallet Integration** - Connect Solana wallet for trading (coming soon)
- **Settled Market Detection** - Markets at 0%/100% display as settled with terminal popup

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **TailwindCSS** with custom design tokens
- **lightweight-charts v5** - TradingView's charting library
- **Framer Motion** - Smooth animations and page transitions
- **Three.js** - WebGL background effects and quantum orb
- **Wouter** - Lightweight client-side routing

### Backend Stack
- **Express.js** with TypeScript
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Data persistence (ready for production)
- **Zod** - Runtime validation for API requests

### External Integrations

#### Polymarket API Integration
```
Frontend → /api/polymarket/slug/{slug} → Polymarket CLOB API → Live Prices
```

The app proxies requests to Polymarket's Central Limit Order Book API to fetch:
- Real-time YES/NO prices
- Market outcomes and probabilities
- Event metadata and titles

**Polling Strategy:**
- Console page: All markets every 30 seconds
- Trading page: Single market every 10 seconds
- Prices update in real-time with LIVE badge indicator

#### TradingView Charts (lightweight-charts v5)
- Candlestick series for price history visualization
- Volume histogram overlay
- Interactive zoom, pan, and crosshair
- Custom purple theme matching app design

### Data Flow

```
┌─────────────────┐     ┌──────────────┐     ┌────────────────┐
│  markets.ts     │────▶│ API Routes   │────▶│ Polymarket API │
│  (20 markets)   │     │ /api/poly... │     │ (CLOB prices)  │
└─────────────────┘     └──────────────┘     └────────────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐     ┌──────────────┐
│ PredictionConsole│◀───│ Live Prices  │
│ (market cards)  │     │ (30s poll)   │
└─────────────────┘     └──────────────┘
         │
         ▼ (click)
┌─────────────────┐     ┌──────────────┐
│  TradingPage    │◀───│ Price History│
│  (charts)       │     │ (10s poll)   │
└─────────────────┘     └──────────────┘
```

## 📁 Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks (useWallet)
│   │   ├── lib/            # Utilities and data
│   │   │   ├── markets.ts  # Market configurations with Polymarket slugs
│   │   │   ├── polymarket.ts # Polymarket API utilities
│   │   │   └── queryClient.ts
│   │   └── pages/          # Route components
│   │       ├── PredictionConsole.tsx  # Main market grid
│   │       ├── TradingPage.tsx        # Individual market trading
│   │       └── Nexus.tsx              # Landing page
├── server/
│   ├── routes.ts           # API endpoints including Polymarket proxy
│   ├── storage.ts          # Database abstraction layer
│   └── index.ts            # Express server setup
└── shared/
    └── schema.ts           # Drizzle schemas and Zod validation
```

## 🔧 Key Files Explained

### `client/src/lib/markets.ts`
Defines all 20 prediction markets with:
- Unique IDs and titles
- Polymarket slugs for API matching
- Favorite outcomes for price matching
- Category classifications

### `client/src/lib/polymarket.ts`
Utilities for Polymarket integration:
- `fetchMarketPrice()` - Fetches live prices for a market
- `matchPolymarketOutcome()` - Matches outcomes using keywords/prices
- `isMarketSettled()` - Detects resolved markets

### `server/routes.ts`
API endpoints:
- `GET /api/polymarket/slug/:slug` - Proxies to Polymarket CLOB API
- `POST /api/predict` - Risk prediction endpoint

### `client/src/pages/TradingPage.tsx`
Trading interface with:
- TradingView candlestick charts (lightweight-charts v5)
- Order book simulation
- YES/NO trading buttons
- Live price polling

## 🎨 Design System

### Colors
- Primary Purple: `#b374ff`
- Background: `#0a0a15`
- Success Green: `#22c55e`
- Error Red: `#ef4444`

### 3D Card Effects
Cards use CSS transforms with mouse tracking for depth:
- `transform: perspective(1000px) rotateX() rotateY()`
- Tracker elements for gradient glow effects
- Pulse animation for high-conviction markets

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📊 Market Categories

- **Politics** - Elections, government events
- **Crypto** - Bitcoin, Solana price predictions
- **Entertainment** - Gaming, Oscars, media
- **Economics** - Recession, Federal Reserve
- **Sports** - Super Bowl, championships

## 🔐 Privacy Features

- No custodial accounts required
- Wallet unlinking enforced
- Autonomous settlement system
- Level 5 privacy shield indicators

## 📈 Future Roadmap

- [ ] Solana USDC betting integration
- [ ] Historical price data from Polymarket
- [ ] Portfolio tracking
- [ ] Social features and leaderboards
- [ ] Mobile-optimized experience

---

Built with ❤️ using React, TypeScript, and the Polymarket API
