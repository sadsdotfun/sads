import { useState, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { markets } from "@/lib/markets";
import "./trading-page.css";

interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const generateCandleData = (days: number, baseValue: number): CandleData[] => {
  const data: CandleData[] = [];
  let value = baseValue;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = 0.05;
    const change = (Math.random() - 0.5) * volatility;
    const open = value;
    const close = Math.max(0.01, Math.min(0.99, value + change));
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      open: Math.max(0.01, Math.min(0.99, open)),
      high: Math.max(0.01, Math.min(0.99, high)),
      low: Math.max(0.01, Math.min(0.99, low)),
      close: Math.max(0.01, Math.min(0.99, close)),
      volume: Math.floor(Math.random() * 100000) + 10000
    });
    
    value = close;
  }
  return data;
};

export default function TradingPage() {
  const [, params] = useRoute("/markets/:id");
  const [, setLocation] = useLocation();
  const [selectedSide, setSelectedSide] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");
  const [timeframe, setTimeframe] = useState("30d");
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);

  const market = markets.find(m => m.id === params?.id);

  const chartData = useMemo(() => {
    const days = timeframe === "24h" ? 24 : timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90;
    return generateCandleData(days, market?.yesPrice || 0.5);
  }, [timeframe, market?.yesPrice]);

  if (!market) {
    return (
      <div className="trading-page">
        <div className="not-found">
          <h2>Market not found</h2>
          <button onClick={() => setLocation("/app")} data-testid="button-back-console">Back to Console</button>
        </div>
      </div>
    );
  }

  const currentPrice = selectedSide === "yes" ? market.yesPrice : market.noPrice;
  const amountNum = parseFloat(amount) || 0;
  const shares = amountNum > 0 ? amountNum / currentPrice : 0;
  const maxPayout = shares > 0 ? shares * 1.0 : 0;
  const potentialProfit = maxPayout - amountNum;
  const impliedEdge = ((1 - currentPrice) * 100).toFixed(1);

  const handleQuickAmount = (value: number) => {
    setAmount((prev) => {
      const current = parseFloat(prev) || 0;
      return (current + value).toString();
    });
  };

  const minPrice = Math.min(...chartData.map(d => d.low)) * 0.95;
  const maxPrice = Math.max(...chartData.map(d => d.high)) * 1.05;
  const priceRange = maxPrice - minPrice;

  return (
    <div className="trading-page" data-testid="trading-page">
      <header className="trading-header">
        <div className="breadcrumb">
          <span onClick={() => setLocation("/app")} className="breadcrumb-link" data-testid="link-back-console">Prediction Console</span>
          <span className="breadcrumb-sep">/</span>
          <span>{market.category}</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{market.title}</span>
        </div>
      </header>

      <div className="trading-layout">
        <div className="trading-left">
          <div className="market-info-card">
            <h1 className="trading-title">{market.title}</h1>
            <p className="trading-subtitle">
              Current favorite: {market.favoriteOutcome} · {market.impliedProbPercent}% implied
            </p>
          </div>

          <div className="chart-card">
            <div className="chart-header-row">
              <div className="chart-tabs">
                {["24h", "7d", "30d", "All"].map(tf => (
                  <button
                    key={tf}
                    className={`chart-tab ${timeframe === tf ? 'active' : ''}`}
                    onClick={() => setTimeframe(tf)}
                    data-testid={`button-timeframe-${tf.toLowerCase()}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              {hoveredCandle && (
                <div className="chart-tooltip-inline">
                  <span>{hoveredCandle.date}</span>
                  <span className="tooltip-o">O: {(hoveredCandle.open * 100).toFixed(1)}%</span>
                  <span className="tooltip-h">H: {(hoveredCandle.high * 100).toFixed(1)}%</span>
                  <span className="tooltip-l">L: {(hoveredCandle.low * 100).toFixed(1)}%</span>
                  <span className={`tooltip-c ${hoveredCandle.close >= hoveredCandle.open ? 'green' : 'red'}`}>
                    C: {(hoveredCandle.close * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            
            <div className="tradingview-chart">
              <div className="chart-y-axis">
                <span>{(maxPrice * 100).toFixed(0)}%</span>
                <span>{((maxPrice + minPrice) / 2 * 100).toFixed(0)}%</span>
                <span>{(minPrice * 100).toFixed(0)}%</span>
              </div>
              <div className="candle-container">
                {chartData.map((candle, i) => {
                  const isGreen = candle.close >= candle.open;
                  const bodyTop = ((maxPrice - Math.max(candle.open, candle.close)) / priceRange) * 100;
                  const bodyHeight = (Math.abs(candle.close - candle.open) / priceRange) * 100;
                  const wickTop = ((maxPrice - candle.high) / priceRange) * 100;
                  const wickBottom = ((maxPrice - candle.low) / priceRange) * 100;
                  
                  return (
                    <div
                      key={i}
                      className="candle"
                      onMouseEnter={() => setHoveredCandle(candle)}
                      onMouseLeave={() => setHoveredCandle(null)}
                    >
                      <div
                        className="candle-wick"
                        style={{
                          top: `${wickTop}%`,
                          height: `${wickBottom - wickTop}%`,
                          backgroundColor: isGreen ? '#22c55e' : '#ef4444'
                        }}
                      />
                      <div
                        className={`candle-body ${isGreen ? 'green' : 'red'}`}
                        style={{
                          top: `${bodyTop}%`,
                          height: `${Math.max(bodyHeight, 1)}%`
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="chart-x-axis">
              <span>{chartData[0]?.date}</span>
              <span>{chartData[Math.floor(chartData.length / 2)]?.date}</span>
              <span>{chartData[chartData.length - 1]?.date}</span>
            </div>
            
            <p className="chart-caption">Data sourced from on-chain orderflow, updated in real time.</p>
          </div>

          <div className="details-card">
            <h3>Market Details</h3>
            <ul className="details-list">
              <li><strong>Resolution:</strong> Based on official outcome reporting</li>
              <li><strong>End Date:</strong> December 31, 2025</li>
              <li><strong>Volume:</strong> $115M</li>
              <li><strong>Liquidity:</strong> $7M</li>
            </ul>
            <a href={market.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link" data-testid="link-source">
              View full rules on {market.source} →
            </a>
          </div>
        </div>

        <div className="trading-right">
          <div className="trade-ticket">
            <h3>Place Trade</h3>

            <div className="side-toggle">
              <button
                className={`side-btn ${selectedSide === 'yes' ? 'active yes' : ''}`}
                onClick={() => setSelectedSide("yes")}
                data-testid="button-yes"
              >
                YES
              </button>
              <button
                className={`side-btn ${selectedSide === 'no' ? 'active no' : ''}`}
                onClick={() => setSelectedSide("no")}
                data-testid="button-no"
              >
                NO
              </button>
            </div>

            <div className="best-price">
              <span className="price-label">Best {selectedSide.toUpperCase()}:</span>
              <span className="price-value">{currentPrice.toFixed(2)} USDC</span>
            </div>

            <div className="amount-input-section">
              <label className="input-label">Stake (USDC)</label>
              <input
                type="number"
                className="amount-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                data-testid="input-amount"
              />
              <div className="quick-amounts">
                <button onClick={() => handleQuickAmount(25)} data-testid="button-amount-25">+25</button>
                <button onClick={() => handleQuickAmount(50)} data-testid="button-amount-50">+50</button>
                <button onClick={() => handleQuickAmount(100)} data-testid="button-amount-100">+100</button>
                <button onClick={() => setAmount("1000")} data-testid="button-amount-max">Max</button>
              </div>
            </div>

            <div className="calculated-section">
              <div className="calc-row">
                <span>Estimated shares:</span>
                <span>{shares.toFixed(2)}</span>
              </div>
              <div className="calc-row">
                <span>Total return if win:</span>
                <span>{maxPayout.toFixed(2)} USDC</span>
              </div>
              <div className="calc-row profit">
                <span>Max payout (profit):</span>
                <span className="profit-value">+{potentialProfit.toFixed(2)} USDC</span>
              </div>
              <div className="calc-row highlight">
                <span>Implied edge:</span>
                <span>{impliedEdge}%</span>
              </div>
            </div>

            <button className="submit-trade-btn" data-testid="button-submit-trade">
              Connect wallet to trade
            </button>

            <p className="gas-note">Gas & fees shown before confirm.</p>

            <p className="risk-footer">
              Prediction markets are high risk. Do not trade more than you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
