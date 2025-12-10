import { useState, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { markets } from "@/lib/markets";
import "./trading-page.css";

const generateChartData = () => {
  const data = [];
  let value = 0.45 + Math.random() * 0.2;
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    value = Math.max(0.1, Math.min(0.95, value + (Math.random() - 0.5) * 0.08));
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: value
    });
  }
  return data;
};

export default function TradingPage() {
  const [, params] = useRoute("/markets/:id");
  const [, setLocation] = useLocation();
  const [selectedSide, setSelectedSide] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");
  const [timeframe, setTimeframe] = useState("30d");

  const market = markets.find(m => m.id === params?.id);
  const chartData = useMemo(() => generateChartData(), []);

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
  const shares = amount ? parseFloat(amount) / currentPrice : 0;
  const maxPayout = shares * 1.0;
  const impliedEdge = ((1 - currentPrice) * 100).toFixed(1);

  const handleQuickAmount = (value: number) => {
    setAmount((prev) => {
      const current = parseFloat(prev) || 0;
      return (current + value).toString();
    });
  };

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
            <div className="chart-area">
              <div className="simple-chart">
                {chartData.map((point, i) => (
                  <div
                    key={i}
                    className="chart-bar"
                    style={{ height: `${point.value * 100}%` }}
                    title={`${point.date}: ${(point.value * 100).toFixed(0)}%`}
                  />
                ))}
              </div>
              <div className="chart-labels">
                <span>{chartData[0]?.date}</span>
                <span>{chartData[chartData.length - 1]?.date}</span>
              </div>
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
                <span>Max payout:</span>
                <span>{maxPayout.toFixed(2)} USDC</span>
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
