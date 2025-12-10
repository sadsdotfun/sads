import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { markets, categories, sortOptions, Market } from "@/lib/markets";
import { useWallet } from "@/hooks/useWallet";
import { SettledMarketModal } from "@/components/SettledMarketModal";
import "./prediction-console.css";

interface LivePriceData {
  yesPrice: number;
  noPrice: number;
  impliedProbPercent: number;
  isLive: boolean;
}

function MarketCard({ market, liveData, onClick, onSettledClick }: { market: Market; liveData?: LivePriceData; onClick: () => void; onSettledClick: () => void }) {
  const yesPrice = liveData?.yesPrice ?? market.yesPrice;
  const noPrice = liveData?.noPrice ?? market.noPrice;
  const impliedProb = liveData?.impliedProbPercent ?? market.impliedProbPercent;
  const isLive = liveData?.isLive ?? false;
  const isHighConviction = impliedProb >= 70 || impliedProb <= 10;
  const isSettled = impliedProb === 0 || impliedProb === 100;

  const handleClick = () => {
    if (isSettled) {
      onSettledClick();
      return;
    }
    onClick();
  };
  
  return (
    <div 
      className={`card-container noselect ${isHighConviction ? 'pulse-glow' : ''} ${isSettled ? 'settled' : ''}`}
      data-testid={`card-market-${market.id}`}
      onClick={handleClick}
    >
      <div className="card-canvas">
        <div className="tracker tr-1"></div>
        <div className="tracker tr-2"></div>
        <div className="tracker tr-3"></div>
        <div className="tracker tr-4"></div>
        <div className="tracker tr-5"></div>
        <div className="tracker tr-6"></div>
        <div className="tracker tr-7"></div>
        <div className="tracker tr-8"></div>
        <div className="tracker tr-9"></div>
        <div className="tracker tr-10"></div>
        <div className="tracker tr-11"></div>
        <div className="tracker tr-12"></div>
        <div className="tracker tr-13"></div>
        <div className="tracker tr-14"></div>
        <div className="tracker tr-15"></div>
        <div className="tracker tr-16"></div>
        <div className="tracker tr-17"></div>
        <div className="tracker tr-18"></div>
        <div className="tracker tr-19"></div>
        <div className="tracker tr-20"></div>
        <div className="tracker tr-21"></div>
        <div className="tracker tr-22"></div>
        <div className="tracker tr-23"></div>
        <div className="tracker tr-24"></div>
        <div className="tracker tr-25"></div>
        <div className="market-card-inner">
          <div className="card-top-row">
            <div className="market-category">{market.category}</div>
            <div className="privacy-shield">
              {isLive && <span className="live-badge">LIVE</span>}
              <span className="shield-icon">🛡</span>
              <span className="shield-text">Level 5</span>
            </div>
          </div>
          <h3 className="market-title">{market.title}</h3>
          <p className="market-favorite">Consensus Signal: {market.favoriteOutcome}</p>
          <div className="market-odds">
            <div className="implied-prob">
              <span className="prob-label">Probability:</span>
              <span className="prob-value">{impliedProb}%</span>
            </div>
            <div className="yes-no">
              <span>Yes: {yesPrice.toFixed(2)}</span>
              <span>No: {noPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="market-footer">
            <div className="footer-left">
              <span className="private-settlement">Autonomous Settlement</span>
              <span className="payout-text">Payout: 1.00 USDC per verified signal</span>
            </div>
            <button className="trade-btn" data-testid={`button-trade-${market.id}`}>Trade</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PredictionConsole() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("active");
  const [, setLocation] = useLocation();
  const [autonomousCount, setAutonomousCount] = useState(84219);
  const [livePrices, setLivePrices] = useState<Record<string, LivePriceData>>({});
  const [showSettledModal, setShowSettledModal] = useState(false);
  const { authenticated, shortAddress, connect, disconnect } = useWallet();

  useEffect(() => {
    const hasLoadedTerminal = sessionStorage.getItem('sads_terminal_loaded');
    if (!hasLoadedTerminal) {
      setLocation('/terminal');
    }
  }, [setLocation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutonomousCount(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketPrice = useCallback(async (market: Market) => {
    if (!market.polymarketSlug) return null;
    
    try {
      const slugResponse = await fetch(`/api/polymarket/slug/${market.polymarketSlug}`);
      if (!slugResponse.ok) return null;
      
      const slugData = await slugResponse.json();
      if (!slugData.markets || slugData.markets.length === 0) return null;
      
      const favoriteOutcome = market.favoriteOutcome?.toLowerCase() || '';
      const priceMatch = favoriteOutcome.match(/\$?([\d,]+)/);
      const priceTarget = priceMatch ? priceMatch[1].replace(',', '') : null;
      const keywords = favoriteOutcome.split(/[\s]+/).filter((w: string) => w.length > 2);
      
      const matchedMarket = slugData.markets.find((m: any) => {
        const groupTitle = (m.groupItemTitle || '').toLowerCase().replace(',', '');
        const question = (m.question || '').toLowerCase();
        
        if (priceTarget && groupTitle.includes(priceTarget)) {
          return true;
        }
        
        return keywords.some((keyword: string) => 
          groupTitle.includes(keyword) || question.includes(keyword)
        );
      }) || slugData.markets[0];
      
      let outcomePrices = matchedMarket?.outcomePrices;
      if (typeof outcomePrices === 'string') {
        outcomePrices = JSON.parse(outcomePrices);
      }
      
      if (outcomePrices && Array.isArray(outcomePrices) && outcomePrices.length >= 2) {
        const yesPrice = parseFloat(outcomePrices[0]);
        const noPrice = parseFloat(outcomePrices[1]);
        return {
          yesPrice,
          noPrice,
          impliedProbPercent: Math.round(yesPrice * 100),
          isLive: true
        };
      }
    } catch (err) {
      console.error(`Failed to fetch price for ${market.id}:`, err);
    }
    return null;
  }, []);

  useEffect(() => {
    const fetchAllPrices = async () => {
      const pricePromises = markets.map(async (market) => {
        const priceData = await fetchMarketPrice(market);
        return { id: market.id, data: priceData };
      });
      
      const results = await Promise.all(pricePromises);
      const newPrices: Record<string, LivePriceData> = {};
      
      results.forEach(({ id, data }) => {
        if (data) {
          newPrices[id] = data;
        }
      });
      
      setLivePrices(newPrices);
    };

    fetchAllPrices();
    const interval = setInterval(fetchAllPrices, 30000);
    return () => clearInterval(interval);
  }, [fetchMarketPrice]);

  const filteredMarkets = useMemo(() => {
    let result = activeCategory === "All" 
      ? [...markets] 
      : markets.filter(m => m.category === activeCategory);
    
    switch (sortBy) {
      case "active":
        result.sort((a, b) => {
          const aProb = livePrices[a.id]?.impliedProbPercent ?? a.impliedProbPercent;
          const bProb = livePrices[b.id]?.impliedProbPercent ?? b.impliedProbPercent;
          return bProb - aProb;
        });
        break;
      case "ending":
        result.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case "edge":
        result.sort((a, b) => {
          const aYes = livePrices[a.id]?.yesPrice ?? a.yesPrice;
          const bYes = livePrices[b.id]?.yesPrice ?? b.yesPrice;
          return (1 - bYes) - (1 - aYes);
        });
        break;
    }
    return result;
  }, [activeCategory, sortBy, livePrices]);

  const handleMarketClick = (marketId: string) => {
    setLocation(`/markets/${marketId}`);
  };

  return (
    <div className="console-page" data-testid="prediction-console">
      <div className="console-bg-island"></div>
      <div className="console-bg-islandt"></div>
      <svg height="0" width="0">
        <filter id="console-octave1">
          <feTurbulence type="fractalNoise" baseFrequency="0.0004" numOctaves={8} seed={4} result="o1"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0008" numOctaves={8} seed={4} result="o2"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0001" numOctaves={8} seed={4} result="o3"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0018" numOctaves={8} seed={4} result="o4"></feTurbulence>
          <feMerge result="finalIsland">
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o3"></feMergeNode>
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o3"></feMergeNode>
          </feMerge>
          <feGaussianBlur in="finalIsland" stdDeviation="5" result="noiseo"></feGaussianBlur>
          <feTurbulence type="fractalNoise" baseFrequency="0.0008" numOctaves={8} seed={4} result="o1"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0016" numOctaves={8} seed={4} result="o2"></feTurbulence>
          <feMerge result="noiseo">
            <feMergeNode in="o2"></feMergeNode>
            <feMergeNode in="o4"></feMergeNode>
            <feMergeNode in="noiseo"></feMergeNode>
          </feMerge>
          <feGaussianBlur in="noiseo" stdDeviation="5" result="noiseo"></feGaussianBlur>
          <feTurbulence type="fractalNoise" baseFrequency="0.0016" numOctaves={8} seed={4} result="o1"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.002" numOctaves={8} seed={4} result="o2"></feTurbulence>
          <feMerge result="noiseo">
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="noiseo"></feMergeNode>
          </feMerge>
          <feGaussianBlur in="noiseo" stdDeviation="5" result="noiseo"></feGaussianBlur>
          <feDiffuseLighting in="noiseo" surfaceScale={12} diffuseConstant={1} lightingColor="#b374ff" result="lit">
            <feDistantLight azimuth={90} elevation={0}></feDistantLight>
          </feDiffuseLighting>
          <feBlend in="lit" in2="SourceGraphic" mode="normal"></feBlend>
        </filter>
        <filter id="console-octave2">
          <feTurbulence type="fractalNoise" baseFrequency="0.0004" numOctaves={8} seed={4} result="o1"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0008" numOctaves={8} seed={4} result="o2"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0001" numOctaves={8} seed={4} result="o3"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0018" numOctaves={8} seed={4} result="o4"></feTurbulence>
          <feMerge result="finalIsland">
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o3"></feMergeNode>
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o3"></feMergeNode>
          </feMerge>
          <feGaussianBlur in="finalIsland" stdDeviation="5" result="noiseo"></feGaussianBlur>
          <feDiffuseLighting in="noiseo" surfaceScale={8} diffuseConstant={1} lightingColor="#8b5cf6" result="lit">
            <feDistantLight azimuth={180} elevation={0}></feDistantLight>
          </feDiffuseLighting>
          <feBlend in="lit" in2="SourceGraphic" mode="normal"></feBlend>
        </filter>
      </svg>
      <div className="console-content">
      <header className="console-header">
        <div className="header-left">
          <img src="/logo.png" alt="SADS" className="console-logo" />
          <div className="header-text">
            <span className="console-title">SADS Prediction Console</span>
            <span className="console-subtitle">Autonomous Prediction Markets. Autonomous by Default. Encrypted by Design.</span>
          </div>
          <span className="status-pill">Mainnet • Live odds</span>
          <Link href="/" className="home-btn" data-testid="button-home">
            GO HOME
          </Link>
        </div>
        <div className="header-right">
          <div className="anonymity-indicator">
            <span className="privacy-dot"></span>
            <span className="privacy-text">Autonomous Mode: On</span>
          </div>
          <div className="wallet-container">
            {authenticated ? (
              <>
                <button className="wallet-btn connected" onClick={disconnect} data-testid="button-disconnect-wallet">
                  {shortAddress}
                </button>
                <span className="wallet-note">Phantom Connected</span>
              </>
            ) : (
              <>
                <button className="wallet-btn" onClick={connect} data-testid="button-connect-wallet">
                  Connect Phantom
                </button>
                <span className="wallet-note">Zero tracking. Zero profiling.</span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="privacy-marquee">
        <div className="marquee-track">
          <div className="marquee-content">
            <span>On SADS, your predictions exist without a trace. Machine learning drives signals. Zero user profiling.</span>
            <span className="marquee-divider">◆</span>
            <span>Autonomous predictions executed in the last 24h: <strong>{autonomousCount.toLocaleString()}</strong></span>
            <span className="marquee-divider">◆</span>
            <span>Wallet routing obfuscation active. No signatures tied to identity.</span>
            <span className="marquee-divider">◆</span>
          </div>
          <div className="marquee-content">
            <span>On SADS, your predictions exist without a trace. Machine learning drives signals. Zero user profiling.</span>
            <span className="marquee-divider">◆</span>
            <span>Autonomous predictions executed in the last 24h: <strong>{autonomousCount.toLocaleString()}</strong></span>
            <span className="marquee-divider">◆</span>
            <span>Wallet routing obfuscation active. No signatures tied to identity.</span>
            <span className="marquee-divider">◆</span>
          </div>
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
            liveData={livePrices[market.id]}
            onClick={() => handleMarketClick(market.id)}
            onSettledClick={() => setShowSettledModal(true)}
          />
        ))}
      </div>

      <footer className="console-footer">
        <p className="footer-text">
          SADS operates without custodial accounts. Predictions are isolated on-chain. Wallet unlinking enforced.
        </p>
      </footer>
      </div>

      <SettledMarketModal 
        isOpen={showSettledModal} 
        onClose={() => setShowSettledModal(false)} 
      />
    </div>
  );
}
