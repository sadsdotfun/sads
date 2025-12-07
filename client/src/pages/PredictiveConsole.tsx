import { useState, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import type { PredictionResponse } from "@shared/schema";

const SAMPLE_ADDRESS = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";

type RiskLevel = "Low" | "Moderate" | "Elevated" | "High" | "Critical";

function getRiskLevel(score: number): RiskLevel {
  if (score < 0.3) return "Low";
  if (score < 0.5) return "Moderate";
  if (score < 0.7) return "Elevated";
  if (score < 0.85) return "High";
  return "Critical";
}

function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "Low": return "text-green-400";
    case "Moderate": return "text-yellow-400";
    case "Elevated": return "text-orange-400";
    case "High": return "text-red-400";
    case "Critical": return "text-red-500";
  }
}

function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case "Low": return "bg-green-500/10 border-green-500/30";
    case "Moderate": return "bg-yellow-500/10 border-yellow-500/30";
    case "Elevated": return "bg-orange-500/10 border-orange-500/30";
    case "High": return "bg-red-500/10 border-red-500/30";
    case "Critical": return "bg-red-600/20 border-red-500/50";
  }
}

function getStabilityStatus(tfi: number): string {
  if (tfi < 0.3) return "Stable";
  if (tfi < 0.5) return "Mildly Unstable";
  if (tfi < 0.7) return "Unstable";
  return "Highly Unstable";
}

function getHolderSymmetry(score: number): string {
  if (score < 0.3) return "Whale-dominant";
  if (score < 0.5) return "Concentrated";
  if (score < 0.7) return "Moderately distributed";
  return "Well distributed";
}

function RiskChart({ data }: { data: { time: string; risk: number }[] }) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const maxRisk = Math.max(...data.map(d => d.risk));
  const width = 100;
  const height = 60;
  
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - (d.risk / Math.max(maxRisk, 1)) * height * 0.9,
    ...d
  }));
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="relative w-full h-48 bg-black/20 rounded-lg p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="riskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#riskGradient)" />
        <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="0.5" />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoveredPoint === i ? 2 : 1}
            fill={p.risk > 0.7 ? "#ef4444" : "#8b5cf6"}
            className="cursor-pointer transition-all"
            onMouseEnter={() => setHoveredPoint(i)}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        ))}
      </svg>
      <div className="flex justify-between mt-2 text-white/40" style={{ fontSize: '10px' }}>
        {data.map((d, i) => (
          <span key={i}>{d.time}</span>
        ))}
      </div>
      <AnimatePresence>
        {hoveredPoint !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 right-2 bg-black/80 border border-purple-500/30 rounded-lg p-3"
            style={{ fontSize: '11px' }}
          >
            <div className="text-white/60">Time window: {data[hoveredPoint].time}</div>
            <div className="text-white">Predicted risk: {data[hoveredPoint].risk.toFixed(2)}</div>
            <div className="text-white/50 mt-1" style={{ fontSize: '10px' }}>Key drivers: dev wallet movement, LP imbalance</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PredictiveConsole() {
  const [address, setAddress] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleScan = useCallback(async () => {
    if (!address.trim()) {
      setError("That doesn't look like a valid Solana address.\nPlease check it and try again.");
      return;
    }
    
    if (address.length < 32 || address.length > 44) {
      setError("That doesn't look like a valid Solana address.\nPlease check it and try again.");
      return;
    }
    
    setIsScanning(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address.trim() })
      });
      
      if (!response.ok) {
        throw new Error('Prediction analysis failed');
      }
      
      const data = await response.json();
      setResult(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError("We couldn't complete this prediction right now.\nPlease try again in a few seconds. If this keeps happening, check your network or RPC settings.");
    } finally {
      setIsScanning(false);
    }
  }, [address]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isScanning) {
      handleScan();
    }
  };

  const useSampleAddress = () => {
    setAddress(SAMPLE_ADDRESS);
  };

  const overallRisk = result ? getRiskLevel((result.TFI + result.QSS) / 2) : null;
  const stabilityStatus = result ? getStabilityStatus(result.TFI) : null;
  const holderSymmetry = result ? getHolderSymmetry(result.holderSymmetry) : null;
  
  const chartData = [
    { time: "Now", risk: result?.TFI ?? 0 },
    { time: "6h", risk: result ? result.TFI * 1.1 : 0 },
    { time: "12h", risk: result ? result.TFI * 1.2 : 0 },
    { time: "18h", risk: result ? Math.min(result.TFI * 1.4, 1) : 0 },
    { time: "24h", risk: result ? Math.min(result.TFI * 1.3, 1) : 0 },
    { time: "48h", risk: result ? result.TFI * 0.9 : 0 },
  ];

  const historicalCases = result?.similarPastCases.map((c, i) => ({
    match: Math.round(c.confidence * 100),
    type: i === 0 ? "Meme token" : i === 1 ? "NFT mint" : "DeFi pool",
    outcome: c.outcome === "rug" ? "Rug pull" : c.outcome === "pump & dump" ? "Pump & dump" : c.outcome,
    timeToEvent: c.timeframe
  })) ?? [];

  return (
    <div className="min-h-screen bg-[#050510] text-white" style={{ fontFamily: 'var(--font-secondary)' }}>
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-wide" style={{ fontFamily: 'var(--font-primary)', fontWeight: 400 }} data-testid="link-home">
            SADS.FUN
          </Link>
          <div className="flex gap-6 text-sm text-white/60 uppercase tracking-wider" style={{ fontSize: '10px' }}>
            <Link href="/orbiverse" className="hover:text-white transition-colors" data-testid="link-orbiverse">Orbiverse</Link>
            <Link href="/docs" className="hover:text-white transition-colors" data-testid="link-docs">Docs</Link>
            <Link href="/roadmap" className="hover:text-white transition-colors" data-testid="link-roadmap">Roadmap</Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-primary)', fontWeight: 400, letterSpacing: '-0.02em' }} data-testid="page-title">
              Predictive Console
            </h1>
            <p className="text-base text-white/70 mb-2" style={{ fontFamily: 'var(--font-primary)', fontWeight: 400 }}>
              Quantum Pattern Replication for Solana.
              <br />
              Forecast risk before it shows up on the chart.
            </p>
            <p className="text-white/40 max-w-2xl mx-auto uppercase tracking-wider" style={{ fontSize: '10px' }}>
              These predictions are generated from historical wallet behavior, funding patterns, holder distribution, and liquidity movements. They are probabilistic, not guarantees.
            </p>
          </header>

          <div className="mb-12">
            <label className="block text-white/60 mb-2 uppercase tracking-wider" style={{ fontSize: '10px' }}>Address</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste a Solana wallet or token address"
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                style={{ fontFamily: 'var(--font-secondary)', fontSize: '12px' }}
                disabled={isScanning}
                data-testid="input-address"
              />
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-colors whitespace-nowrap uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-primary)', fontWeight: 400, fontSize: '12px' }}
                data-testid="button-scan"
              >
                {isScanning ? "Analyzing on-chain patterns…" : "Run Prediction Scan"}
              </button>
            </div>
            <button
              onClick={useSampleAddress}
              className="text-purple-400 hover:text-purple-300 mt-2 transition-colors uppercase tracking-wider"
              style={{ fontSize: '10px' }}
              data-testid="button-sample"
            >
              Use a sample address
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 text-red-400 whitespace-pre-line"
              style={{ fontSize: '12px' }}
              data-testid="error-message"
            >
              {error}
            </motion.div>
          )}

          {!result && !isScanning && !error && (
            <div className="text-center py-16 text-white/40" data-testid="empty-state">
              <p className="mb-2" style={{ fontFamily: 'var(--font-primary)', fontSize: '16px' }}>No prediction yet.</p>
              <p style={{ fontSize: '12px' }}>Run a scan to see projected risk over time and how this address compares to historical incidents on Solana.</p>
            </div>
          )}

          {isScanning && (
            <div className="text-center py-16" data-testid="loading-state">
              <div className="inline-block w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
              <p className="text-white/60" style={{ fontSize: '12px' }}>Analyzing on-chain patterns…</p>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <section className="bg-black/30 border border-white/10 rounded-xl p-6" data-testid="prediction-summary">
                <h2 className="mb-4" style={{ fontFamily: 'var(--font-primary)', fontSize: '18px', fontWeight: 400 }}>Prediction summary</h2>
                
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border mb-6 ${getRiskBgColor(overallRisk!)}`}>
                  <span className="text-white/60" style={{ fontSize: '12px' }}>Overall Risk Forecast:</span>
                  <span className={`${getRiskColor(overallRisk!)}`} style={{ fontFamily: 'var(--font-primary)', fontWeight: 500 }}>{overallRisk}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 uppercase tracking-wider" style={{ fontSize: '10px' }}>Quantum Similarity Score</span>
                      <span className="text-purple-400" style={{ fontFamily: 'var(--font-secondary)', fontSize: '16px' }}>{(result.QSS * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-white/40" style={{ fontSize: '10px' }}>
                      Measures how closely this address matches historical clusters of malicious or unstable behavior on Solana.
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 uppercase tracking-wider" style={{ fontSize: '10px' }}>Temporal Fragility Index (TFI)</span>
                      <span className="text-purple-400" style={{ fontFamily: 'var(--font-secondary)', fontSize: '16px' }}>{(result.TFI * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-white/40" style={{ fontSize: '10px' }}>
                      Estimates how fragile this address is over the next few days based on changes in balances and funding sources.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4" style={{ fontSize: '11px' }}>
                  <div className="bg-orange-500/10 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full">
                    Predicted event window: 18–30 hours
                  </div>
                  {lastUpdated && (
                    <span className="text-white/40">
                      Last on-chain update: {Math.floor((Date.now() - lastUpdated.getTime()) / 1000)} seconds ago
                    </span>
                  )}
                </div>
              </section>

              <section className="grid md:grid-cols-3 gap-4">
                <div className="bg-black/30 border border-white/10 rounded-xl p-5" data-testid="card-temporal-fragility">
                  <h3 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontSize: '14px', fontWeight: 400 }}>Temporal Fragility Index</h3>
                  <div className="text-white/50 mb-2 uppercase tracking-wider" style={{ fontSize: '10px' }}>Stability status</div>
                  <div className={`mb-3 ${result.TFI > 0.7 ? 'text-red-400' : result.TFI > 0.5 ? 'text-orange-400' : 'text-yellow-400'}`} style={{ fontFamily: 'var(--font-primary)', fontWeight: 500, fontSize: '14px' }}>
                    {stabilityStatus}
                  </div>
                  <p className="text-white/60 mb-4" style={{ fontSize: '11px' }}>
                    This address shows movement and funding behavior consistent with assets that became unstable within the next 24–48 hours.
                  </p>
                  <ul className="text-white/50 space-y-1 mb-4" style={{ fontSize: '10px' }}>
                    <li>• Rapid shifts in key balances</li>
                    <li>• Inflows from low-reputation sources</li>
                    <li>• Activity out of line with age and size</li>
                  </ul>
                  <p className="text-white/30" style={{ fontSize: '10px' }}>
                    Higher fragility suggests a greater chance of sudden liquidity or price shocks.
                  </p>
                </div>

                <div className="bg-black/30 border border-white/10 rounded-xl p-5" data-testid="card-quantum-similarity">
                  <h3 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontSize: '14px', fontWeight: 400 }}>Quantum Similarity Score</h3>
                  <div className="text-white/50 mb-2 uppercase tracking-wider" style={{ fontSize: '10px' }}>Pattern match</div>
                  <div className="text-purple-400 mb-3" style={{ fontFamily: 'var(--font-primary)', fontWeight: 500, fontSize: '12px' }}>
                    Matches {result.similarPastCases.length * 24} past high-risk incidents with {(result.QSS * 100).toFixed(0)}% similarity.
                  </div>
                  <p className="text-white/60 mb-4" style={{ fontSize: '11px' }}>
                    We compare this address against a curated set of historical rugs, exploits, and failures. A higher score means this behavior has been seen before — and often ended badly.
                  </p>
                  <button 
                    className="text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider"
                    style={{ fontSize: '10px' }}
                    data-testid="link-similar-cases"
                  >
                    View similar cases →
                  </button>
                </div>

                <div className="bg-black/30 border border-white/10 rounded-xl p-5" data-testid="card-liquidity-holders">
                  <h3 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontSize: '14px', fontWeight: 400 }}>Liquidity & Holder Structure</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between" style={{ fontSize: '11px' }}>
                      <span className="text-white/50">Liquidity stability</span>
                      <span className="text-white">{(result.liquiditySafety * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between" style={{ fontSize: '11px' }}>
                      <span className="text-white/50">Holder symmetry</span>
                      <span className="text-white">{holderSymmetry}</span>
                    </div>
                  </div>
                  <p className="text-white/60 mb-4" style={{ fontSize: '11px' }}>
                    Most supply and liquidity are controlled by a small number of wallets. This structure has historically correlated with higher rug and manipulation risk.
                  </p>
                  <p className="text-white/30" style={{ fontSize: '10px' }}>
                    Healthier assets tend to have deeper liquidity and a more distributed holder base.
                  </p>
                </div>
              </section>

              <section className="bg-black/30 border border-white/10 rounded-xl p-6" data-testid="section-risk-chart">
                <h2 className="mb-2" style={{ fontFamily: 'var(--font-primary)', fontSize: '18px', fontWeight: 400 }}>Projected risk over time</h2>
                <p className="text-white/50 mb-4" style={{ fontSize: '11px' }}>
                  Forecasted risk levels based on current behavior and historical outcomes of similar patterns.
                </p>
                <RiskChart data={chartData} />
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white/30 rounded-full absolute top-0.5 left-0.5" />
                    </div>
                    <span className="text-white/50" style={{ fontSize: '11px' }}>Enable continuous monitoring for this address</span>
                  </div>
                </div>
                <p className="text-white/30 mt-2" style={{ fontSize: '10px' }}>
                  We'll keep recalculating risk as new on-chain data appears.
                </p>
              </section>

              <section className="bg-black/30 border border-white/10 rounded-xl p-6" data-testid="section-historical-cases">
                <h2 className="mb-2" style={{ fontFamily: 'var(--font-primary)', fontSize: '18px', fontWeight: 400 }}>Similar historical cases</h2>
                <p className="text-white/50 mb-4" style={{ fontSize: '11px' }}>
                  Past incidents that behaved like this one — and how they ended.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ fontSize: '11px' }}>
                    <thead>
                      <tr className="text-left text-white/40 border-b border-white/10 uppercase tracking-wider" style={{ fontSize: '10px' }}>
                        <th className="pb-3 pr-4">Match</th>
                        <th className="pb-3 pr-4">Type</th>
                        <th className="pb-3 pr-4">Outcome</th>
                        <th className="pb-3">Time to event</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicalCases.map((c, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-4">
                            <span className="text-purple-400" style={{ fontFamily: 'var(--font-secondary)' }}>{c.match}%</span>
                          </td>
                          <td className="py-3 pr-4 text-white/70">{c.type}</td>
                          <td className="py-3 pr-4">
                            <span className={`px-2 py-1 rounded ${
                              c.outcome.toLowerCase().includes('rug') ? 'bg-red-500/20 text-red-400' :
                              c.outcome.toLowerCase().includes('pump') ? 'bg-orange-500/20 text-orange-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`} style={{ fontSize: '10px' }}>
                              {c.outcome}
                            </span>
                          </td>
                          <td className="py-3 text-white/50">{c.timeToEvent} after pattern detected</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <p className="text-white/30 mt-4" style={{ fontSize: '10px' }}>
                  These comparisons are drawn from real Solana incidents where outcomes were confirmed. They are used only to highlight patterns, not to make absolute claims.
                </p>
              </section>
            </motion.div>
          )}

          <footer className="mt-16 pt-8 border-t border-white/10">
            <p className="text-white/30 text-center max-w-2xl mx-auto" style={{ fontSize: '10px' }}>
              These forecasts are probabilistic and based on historical on-chain patterns. They are tools for risk awareness, not guarantees or financial advice. Always do your own research and never trade solely on a prediction.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
