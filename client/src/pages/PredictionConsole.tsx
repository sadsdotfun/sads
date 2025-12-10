import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { markets, categories, sortOptions, Market } from "@/lib/markets";
import "./prediction-console.css";

function MarketCard({ market, onClick }: { market: Market; onClick: () => void }) {
  const isHighConviction = market.impliedProbPercent >= 70 || market.impliedProbPercent <= 10;
  
  return (
    <div 
      className={`market-card ${isHighConviction ? 'pulse-glow' : ''}`} 
      onClick={onClick} 
      data-testid={`card-market-${market.id}`}
    >
      <div className="card-top-row">
        <div className="market-category">{market.category}</div>
        <div className="privacy-shield">
          <span className="shield-icon">🛡</span>
          <span className="shield-text">Level 5</span>
        </div>
      </div>
      <h3 className="market-title">{market.title}</h3>
      <p className="market-favorite">Consensus Signal: {market.favoriteOutcome}</p>
      <div className="market-odds">
        <div className="implied-prob">
          <span className="prob-label">Probability:</span>
          <span className="prob-value">{market.impliedProbPercent}%</span>
        </div>
        <div className="yes-no">
          <span>Yes: {market.yesPrice.toFixed(2)}</span>
          <span>No: {market.noPrice.toFixed(2)}</span>
        </div>
      </div>
      <div className="market-footer">
        <div className="footer-left">
          <span className="private-settlement">Private Settlement</span>
          <span className="payout-text">Payout: 1.00 USDC per verified signal</span>
        </div>
        <button className="trade-btn" data-testid={`button-trade-${market.id}`}>Trade</button>
      </div>
      <div className="card-hover-reveal">
        <div className="mini-chart">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i} 
              className="mini-bar" 
              style={{ height: `${30 + Math.random() * 50}%` }}
            />
          ))}
        </div>
        <div className="hover-info">
          <span>Resolution: Dec 31, 2025</span>
          <span>Stability: High</span>
        </div>
      </div>
    </div>
  );
}

export default function PredictionConsole() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("active");
  const [, setLocation] = useLocation();
  const [privateCount, setPrivateCount] = useState(84219);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrivateCount(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredMarkets = useMemo(() => {
    let result = activeCategory === "All" 
      ? [...markets] 
      : markets.filter(m => m.category === activeCategory);
    
    switch (sortBy) {
      case "active":
        result.sort((a, b) => b.impliedProbPercent - a.impliedProbPercent);
        break;
      case "ending":
        result.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case "edge":
        result.sort((a, b) => (1 - b.yesPrice) - (1 - a.yesPrice));
        break;
    }
    return result;
  }, [activeCategory, sortBy]);

  const handleMarketClick = (marketId: string) => {
    setLocation(`/markets/${marketId}`);
  };

  return (
    <div className="console-page" data-testid="prediction-console">
      <header className="console-header">
        <div className="header-left">
          <img src="/logo.png" alt="SADS" className="console-logo" />
          <div className="header-text">
            <span className="console-title">SADS Prediction Console</span>
            <span className="console-subtitle">Autonomous Prediction Markets. Private by Default. Encrypted by Design.</span>
          </div>
          <span className="status-pill">Mainnet • Live odds</span>
        </div>
        <div className="header-right">
          <div className="anonymity-indicator">
            <span className="privacy-dot"></span>
            <span className="privacy-text">Private Mode: On</span>
          </div>
          <div className="wallet-container">
            <button className="wallet-btn" data-testid="button-connect-wallet">
              Connect Wallet
            </button>
            <span className="wallet-note">Zero tracking. Zero profiling.</span>
          </div>
        </div>
      </header>

      <div className="privacy-marquee">
        <div className="marquee-content">
          <span>On SADS, your predictions exist without a trace. Machine learning drives signals. Zero user profiling.</span>
          <span className="marquee-divider">◆</span>
          <span>Private predictions executed in the last 24h: <strong>{privateCount.toLocaleString()}</strong></span>
          <span className="marquee-divider">◆</span>
          <span>Wallet routing obfuscation active. No signatures tied to identity.</span>
          <span className="marquee-divider">◆</span>
        </div>
      </div>

      <div className="filters-row">
        <div className="category-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              data-testid={`filter-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select 
          className="sort-select" 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          data-testid="select-sort"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="markets-grid">
        {filteredMarkets.map(market => (
          <MarketCard 
            key={market.id} 
            market={market} 
            onClick={() => handleMarketClick(market.id)}
          />
        ))}
      </div>

      <footer className="console-footer">
        <p className="footer-text">
          SADS operates without custodial accounts. Predictions are isolated on-chain. Wallet unlinking enforced.
        </p>
      </footer>
    </div>
  );
}
