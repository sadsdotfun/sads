import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { markets, categories, sortOptions, Market } from "@/lib/markets";
import "./prediction-console.css";

function MarketCard({ market, onClick }: { market: Market; onClick: () => void }) {
  return (
    <div className="market-card" onClick={onClick} data-testid={`card-market-${market.id}`}>
      <div className="market-category">{market.category}</div>
      <h3 className="market-title">{market.title}</h3>
      <p className="market-favorite">Market favorite: {market.favoriteOutcome}</p>
      <div className="market-odds">
        <div className="implied-prob">
          <span className="prob-label">Implied:</span>
          <span className="prob-value">{market.impliedProbPercent}%</span>
        </div>
        <div className="yes-no">
          <span>Yes: {market.yesPrice.toFixed(2)}</span>
          <span>No: {market.noPrice.toFixed(2)}</span>
        </div>
      </div>
      <div className="market-footer">
        <span className="payout-text">Payout: 1.00 USDC per winning share</span>
        <button className="trade-btn" data-testid={`button-trade-${market.id}`}>Trade</button>
      </div>
    </div>
  );
}

export default function PredictionConsole() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("active");
  const [, setLocation] = useLocation();

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
        result.sort((a, b) => (1 - a.yesPrice) - (1 - b.yesPrice));
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
          <span className="console-title">SADS Prediction Console</span>
          <span className="status-pill">Mainnet • Live odds</span>
        </div>
        <button className="wallet-btn" data-testid="button-connect-wallet">
          Connect Wallet
        </button>
      </header>

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
    </div>
  );
}
