import { useState, useEffect, useRef, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { markets } from "@/lib/markets";
import { useWallet } from "@/hooks/useWallet";
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from "lightweight-charts";
import "./trading-page.css";

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const generatePredictionData = (baseValue: number, days: number): CandleData[] => {
  const data: CandleData[] = [];
  let value = baseValue - 0.15 + Math.random() * 0.1;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = 0.03;
    const trend = (baseValue - value) * 0.02;
    const change = trend + (Math.random() - 0.5) * volatility;
    
    const open = value;
    const close = Math.max(0.01, Math.min(0.99, value + change));
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    data.push({
      time: date.toISOString().split('T')[0],
      open: Math.max(0.01, Math.min(0.99, open)),
      high: Math.max(0.01, Math.min(0.99, high)),
      low: Math.max(0.01, Math.min(0.99, low)),
      close: Math.max(0.01, Math.min(0.99, close)),
    });
    
    value = close;
  }
  return data;
};

function PredictionChart({ data, title }: { data: CandleData[]; title: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0a0a15' },
        textColor: '#888888',
      },
      grid: {
        vertLines: { color: 'rgba(179, 116, 255, 0.1)' },
        horzLines: { color: 'rgba(179, 116, 255, 0.1)' },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: '#b374ff',
          width: 1,
          style: 2,
          labelBackgroundColor: '#b374ff',
        },
        horzLine: {
          color: '#b374ff',
          width: 1,
          style: 2,
          labelBackgroundColor: '#b374ff',
        },
      },
      timeScale: {
        borderColor: 'rgba(179, 116, 255, 0.2)',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(179, 116, 255, 0.2)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      handleScroll: true,
      handleScale: true,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    candlestickSeries.setData(data);

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#b374ff',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    const volumeData = data.map((d) => ({
      time: d.time,
      value: Math.floor(Math.random() * 1000000) + 100000,
      color: d.close >= d.open ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
    }));

    volumeSeries.setData(volumeData);

    chart.timeScale().fitContent();

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div className="prediction-chart-wrapper">
      <div className="chart-toolbar">
        <div className="chart-symbol">
          <span className="symbol-icon">📊</span>
          <span className="symbol-name">{title}</span>
          <span className="symbol-type">· Prediction Market</span>
        </div>
        <div className="chart-controls">
          <span className="chart-interval">1D</span>
          <span className="chart-type">Candles</span>
        </div>
      </div>
      <div ref={chartContainerRef} className="chart-canvas" />
      <div className="chart-footer">
        <span className="tv-attribution">Powered by TradingView Lightweight Charts</span>
      </div>
    </div>
  );
}

export default function TradingPage() {
  const [, params] = useRoute("/markets/:id");
  const [, setLocation] = useLocation();
  const [selectedSide, setSelectedSide] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");
  const { authenticated, shortAddress, connect, disconnect, placeBet } = useWallet();
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const market = markets.find(m => m.id === params?.id);

  const chartData = useMemo(() => {
    if (!market) return [];
    return generatePredictionData(market.yesPrice, 90);
  }, [market?.yesPrice, market?.id]);

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
            <PredictionChart data={chartData} title={market.title} />
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

            {authenticated ? (
              <button 
                className="submit-trade-btn connected" 
                onClick={async () => {
                  if (amountNum <= 0) return;
                  setIsPlacingBet(true);
                  const result = await placeBet(amountNum, market.id, selectedSide);
                  setIsPlacingBet(false);
                  if (result.success) {
                    setAmount("");
                    alert(`Trade placed! TX: ${result.txId}`);
                  } else {
                    alert(`Trade failed: ${result.error}`);
                  }
                }}
                disabled={isPlacingBet || amountNum <= 0}
                data-testid="button-submit-trade"
              >
                {isPlacingBet ? "Placing trade..." : `Trade ${selectedSide.toUpperCase()}`}
              </button>
            ) : (
              <button 
                className="submit-trade-btn" 
                onClick={connect}
                data-testid="button-connect-trade"
              >
                Connect Phantom to trade
              </button>
            )}

            {authenticated && (
              <div className="wallet-status">
                <span className="wallet-address">{shortAddress}</span>
                <button className="disconnect-btn" onClick={disconnect} data-testid="button-disconnect-trade">Disconnect</button>
              </div>
            )}

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
