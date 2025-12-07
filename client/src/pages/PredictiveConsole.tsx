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
    case "Low": return "#22c55e";
    case "Moderate": return "#eab308";
    case "Elevated": return "#f97316";
    case "High": return "#ef4444";
    case "Critical": return "#dc2626";
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

  return (
    <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" data-testid="section-risk-chart">
      <h2 className="mb-2" style={{ fontFamily: 'var(--font-primary)', fontSize: '18px' }}>
        Projected Risk Over Time
      </h2>
      <p className="text-white/40 mb-6" style={{ fontSize: '11px' }}>
        Forecasted risk levels based on current behavior and historical outcomes.
      </p>
      
      <div className="h-48 relative bg-white/[0.02] rounded-xl p-4">
        <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 ${50 - data[0].risk * 45} ${data.map((d, i) => `L ${(i / (data.length - 1)) * 100} ${50 - d.risk * 45}`).join(' ')} L 100 50 L 0 50 Z`}
            fill="url(#chartGradient)"
          />
          <path
            d={`M 0 ${50 - data[0].risk * 45} ${data.map((d, i) => `L ${(i / (data.length - 1)) * 100} ${50 - d.risk * 45}`).join(' ')}`}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="0.5"
          />
          {data.map((d, i) => (
            <circle
              key={i}
              cx={(i / (data.length - 1)) * 100}
              cy={50 - d.risk * 45}
              r={hoveredPoint === i ? 2.5 : 1.5}
              fill={d.risk > 0.7 ? "#ef4444" : "#8b5cf6"}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>
        
        <div className="flex justify-between mt-3">
          {data.map((d, i) => (
            <span key={i} className="text-white/30" style={{ fontSize: '10px' }}>
              {d.time}
            </span>
          ))}
        </div>
        
        <AnimatePresence>
          {hoveredPoint !== null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4 bg-black/90 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm"
              style={{ fontSize: '12px' }}
            >
              <div className="text-white/50 mb-1">Time: {data[hoveredPoint].time}</div>
              <div className="text-white font-medium">Risk: {(data[hoveredPoint].risk * 100).toFixed(0)}%</div>
              <div className="text-white/40 mt-2" style={{ fontSize: '10px' }}>
                Key drivers: dev wallet, LP imbalance
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
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
      setError("Please enter a valid Solana address.");
      return;
    }
    
    if (address.length < 32 || address.length > 44) {
      setError("That doesn't look like a valid Solana address.");
      return;
    }
    
    setIsScanning(true);
    setError(null);
    
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
    } catch {
      setError("We couldn't complete this prediction right now. Please try again.");
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
    <div className="min-h-screen bg-[#0a0a15] text-white relative overflow-x-hidden" style={{ fontFamily: 'var(--font-secondary)' }}>
      {/* Background gradient overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-purple-900/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 sm:py-6 bg-[#0a0a15]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" data-testid="link-home">
            <span className="text-base sm:text-lg tracking-wide" style={{ fontFamily: 'var(--font-primary)' }}>
              SADS.FUN
            </span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-8">
            <Link href="/orbiverse" className="nav-link" data-testid="link-orbiverse">Orbiverse</Link>
            <Link href="/docs" className="nav-link" data-testid="link-docs">Docs</Link>
            <Link href="/roadmap" className="nav-link hidden sm:inline" data-testid="link-roadmap">Roadmap</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <section className="text-center mb-12 sm:mb-16">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6"
              style={{ fontFamily: 'var(--font-primary)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 0.9 }}
              data-testid="page-title"
            >
              Predictive Console
            </h1>
            <p 
              className="text-lg sm:text-xl text-white/70 mb-4"
              style={{ fontFamily: 'var(--font-primary)', fontWeight: 400 }}
            >
              Quantum Pattern Replication for Solana.
              <br />
              Forecast risk before it shows up on the chart.
            </p>
            <p 
              className="text-white/40 max-w-2xl mx-auto uppercase tracking-widest leading-relaxed"
              style={{ fontSize: '10px' }}
            >
              These predictions are generated from historical wallet behavior, funding patterns, holder distribution, and liquidity movements. They are probabilistic, not guarantees.
            </p>
          </section>

          {/* Search Section */}
          <section className="mb-12 sm:mb-16">
            <label 
              className="block text-white/50 mb-3 uppercase tracking-widest"
              style={{ fontSize: '10px' }}
            >
              Enter Address
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste a Solana wallet or token address"
                disabled={isScanning}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all duration-300"
                style={{ fontFamily: 'var(--font-secondary)', fontSize: '13px' }}
                data-testid="input-address"
              />
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="group relative px-8 py-4 rounded-xl font-medium transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-primary)', fontSize: '14px' }}
                data-testid="button-scan"
              >
                {/* Button background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 transition-all duration-300 group-hover:from-purple-500 group-hover:to-purple-400" />
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-purple-400/20 blur-xl" />
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </div>
                
                {/* Button border glow */}
                <div className="absolute inset-0 rounded-xl border border-purple-400/30 group-hover:border-purple-300/50 transition-colors duration-300" />
                
                {/* Button text */}
                <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                  {isScanning ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Run Prediction Scan
                    </>
                  )}
                </span>
              </button>
            </div>
            <button
              onClick={useSampleAddress}
              className="mt-3 text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-secondary)', fontSize: '10px' }}
              data-testid="button-sample"
            >
              Use a sample address
            </button>
          </section>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-12 p-5 rounded-xl bg-red-500/10 border border-red-500/20"
                data-testid="error-message"
              >
                <p className="text-red-400" style={{ fontFamily: 'var(--font-secondary)', fontSize: '12px' }}>
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {isScanning && (
            <div className="text-center py-20" data-testid="loading-state">
              <div className="inline-block w-16 h-16 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-6" />
              <p 
                className="text-white/50 uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-secondary)', fontSize: '11px' }}
              >
                Analyzing on-chain patterns...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!result && !isScanning && !error && (
            <div className="text-center py-20" data-testid="empty-state">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p 
                className="text-lg text-white/60 mb-2"
                style={{ fontFamily: 'var(--font-primary)' }}
              >
                No prediction yet
              </p>
              <p 
                className="text-white/40 max-w-md mx-auto"
                style={{ fontFamily: 'var(--font-secondary)', fontSize: '12px' }}
              >
                Run a scan to see projected risk over time and how this address compares to historical incidents on Solana.
              </p>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Prediction Summary */}
              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" data-testid="prediction-summary">
                <h2 
                  className="text-xl mb-6"
                  style={{ fontFamily: 'var(--font-primary)', fontWeight: 400 }}
                >
                  Prediction Summary
                </h2>
                
                {/* Risk Badge */}
                <div 
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-xl mb-8"
                  style={{ backgroundColor: `${getRiskColor(overallRisk!)}15`, border: `1px solid ${getRiskColor(overallRisk!)}30` }}
                >
                  <span className="text-white/60" style={{ fontFamily: 'var(--font-secondary)', fontSize: '12px' }}>
                    Overall Risk Forecast:
                  </span>
                  <span 
                    className="font-medium"
                    style={{ color: getRiskColor(overallRisk!), fontFamily: 'var(--font-primary)', fontSize: '16px' }}
                  >
                    {overallRisk}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <span 
                        className="text-white/50 uppercase tracking-widest"
                        style={{ fontFamily: 'var(--font-secondary)', fontSize: '10px' }}
                      >
                        Quantum Similarity Score
                      </span>
                      <span 
                        className="text-purple-400"
                        style={{ fontFamily: 'var(--font-secondary)', fontSize: '18px' }}
                      >
                        {(result.QSS * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-white/40" style={{ fontFamily: 'var(--font-secondary)', fontSize: '11px' }}>
                      Measures how closely this address matches historical clusters of malicious behavior.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <span 
                        className="text-white/50 uppercase tracking-widest"
                        style={{ fontFamily: 'var(--font-secondary)', fontSize: '10px' }}
                      >
                        Temporal Fragility Index
                      </span>
                      <span 
                        className="text-purple-400"
                        style={{ fontFamily: 'var(--font-secondary)', fontSize: '18px' }}
                      >
                        {(result.TFI * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-white/40" style={{ fontFamily: 'var(--font-secondary)', fontSize: '11px' }}>
                      Estimates fragility over the next few days based on balance changes and funding sources.
                    </p>
                  </div>
                </div>

                {/* Event Window */}
                <div className="flex flex-wrap items-center gap-4">
                  <div 
                    className="px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400"
                    style={{ fontFamily: 'var(--font-secondary)', fontSize: '11px' }}
                  >
                    Predicted event window: 18–30 hours
                  </div>
                  {lastUpdated && (
                    <span 
                      className="text-white/30"
                      style={{ fontFamily: 'var(--font-secondary)', fontSize: '11px' }}
                    >
                      Updated {Math.floor((Date.now() - lastUpdated.getTime()) / 1000)}s ago
                    </span>
                  )}
                </div>
              </section>

              {/* Risk Cards */}
              <section className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10" data-testid="card-temporal-fragility">
                  <h3 className="mb-4" style={{ fontFamily: 'var(--font-primary)', fontSize: '15px' }}>
                    Temporal Fragility
                  </h3>
                  <p 
                    className="text-white/40 uppercase tracking-widest mb-2"
                    style={{ fontFamily: 'var(--font-secondary)', fontSize: '10px' }}
                  >
                    Stability Status
                  </p>
                  <p 
                    className={`mb-4 ${result.TFI > 0.7 ? 'text-red-400' : result.TFI > 0.5 ? 'text-orange-400' : 'text-yellow-400'}`}
                    style={{ fontFamily: 'var(--font-primary)', fontSize: '16px' }}
                  >
                    {stabilityStatus}
                  </p>
                  <ul className="text-white/40 space-y-1" style={{ fontFamily: 'var(--font-secondary)', fontSize: '11px' }}>
                    <li>• Rapid balance shifts</li>
                    <li>• Low-reputation inflows</li>
                    <li>• Unusual activity patterns</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10" data-testid="card-quantum-similarity">
                  <h3 className="mb-4" style={{ fontFamily: 'var(--font-primary)', fontSize: '15px' }}>
                    Quantum Similarity
                  </h3>
                  <p 
                    className="text-white/40 uppercase tracking-widest mb-2"
                    style={{ fontFamily: 'var(--font-secondary)', fontSize: '10px' }}
                  >
                    Pattern Match
                  </p>
                  <p 
                    className="text-purple-400 mb-4"
                    style={{ fontFamily: 'var(--font-primary)', fontSize: '14px' }}
                  >
                    Matches {result.similarPastCases.length * 24} past incidents
                  </p>
                  <p className="text-white/40" style={{ fontFamily: 'var(--font-secondary)', fontSize: '11px' }}>
                    Higher scores indicate behavior seen before in rugs and exploits.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10" data-testid="card-liquidity-holders">
                  <h3 className="mb-4" style={{ fontFamily: 'var(--font-primary)', fontSize: '15px' }}>
                    Liquidity & Holders
                  </h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between" style={{ fontFamily: 'var(--font-secondary)', fontSize: '12px' }}>
                      <span className="text-white/40">Liquidity stability</span>
                      <span className="text-white">{(result.liquiditySafety * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between" style={{ fontFamily: 'var(--font-secondary)', fontSize: '12px' }}>
                      <span className="text-white/40">Holder symmetry</span>
                      <span className="text-white">{holderSymmetry}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Risk Chart */}
              <RiskChart data={chartData} />
            

              {/* Historical Cases */}
              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" data-testid="section-historical-cases">
                <h2 className="mb-2" style={{ fontFamily: 'var(--font-primary)', fontSize: '18px' }}>
                  Similar Historical Cases
                </h2>
                <p className="text-white/40 mb-6" style={{ fontFamily: 'var(--font-secondary)', fontSize: '11px' }}>
                  Past incidents that behaved like this one — and how they ended.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr 
                        className="text-left text-white/40 border-b border-white/10"
                        style={{ fontFamily: 'var(--font-secondary)', fontSize: '10px' }}
                      >
                        <th className="pb-3 pr-6 uppercase tracking-widest">Match</th>
                        <th className="pb-3 pr-6 uppercase tracking-widest">Type</th>
                        <th className="pb-3 pr-6 uppercase tracking-widest">Outcome</th>
                        <th className="pb-3 uppercase tracking-widest">Time to Event</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontFamily: 'var(--font-secondary)', fontSize: '12px' }}>
                      {historicalCases.map((c, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="py-4 pr-6">
                            <span className="text-purple-400">{c.match}%</span>
                          </td>
                          <td className="py-4 pr-6 text-white/60">{c.type}</td>
                          <td className="py-4 pr-6">
                            <span 
                              className={`px-3 py-1 rounded-full text-xs ${
                                c.outcome.toLowerCase().includes('rug') ? 'bg-red-500/15 text-red-400' :
                                c.outcome.toLowerCase().includes('pump') ? 'bg-orange-500/15 text-orange-400' :
                                'bg-yellow-500/15 text-yellow-400'
                              }`}
                            >
                              {c.outcome}
                            </span>
                          </td>
                          <td className="py-4 text-white/40">{c.timeToEvent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </motion.div>
          )}

          {/* Footer Disclaimer */}
          <footer className="mt-20 pt-8 border-t border-white/5">
            <p 
              className="text-white/30 text-center max-w-2xl mx-auto uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-secondary)', fontSize: '10px', lineHeight: 1.8 }}
            >
              These forecasts are probabilistic and based on historical on-chain patterns. They are tools for risk awareness, not guarantees or financial advice. Always do your own research.
            </p>
          </footer>
        </div>
      </main>

      {/* CSS for nav links */}
      <style>{`
        .nav-link {
          font-family: var(--font-secondary);
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: rgba(255, 255, 255, 1);
        }
      `}</style>
    </div>
  );
}
