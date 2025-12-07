import { useState, useEffect, useRef } from "react";

type RiskLevel = "Low" | "Moderate" | "Elevated" | "High" | "Critical";
type ScanState = "idle" | "scanning" | "has_data" | "no_data" | "invalid";

interface WatchlistItem {
  id: string;
  label: string;
  address: string;
  lastScan: string;
  riskLevel: RiskLevel;
  space: string;
}

interface RiskEvent {
  id: string;
  severity: "High" | "Moderate" | "Info";
  message: string;
  timeframe?: string;
  timestamp: string;
}

interface HistoricalMatch {
  match: number;
  category: string;
  outcome: string;
  timeToFailure: string;
}

const mockWatchlist: WatchlistItem[] = [
  { id: "1", label: "BONK", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", lastScan: "2m ago", riskLevel: "High", space: "Meme Tokens" },
  { id: "2", label: "JUP", address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", lastScan: "5m ago", riskLevel: "Low", space: "DeFi" },
  { id: "3", label: "WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", lastScan: "12m ago", riskLevel: "Elevated", space: "Meme Tokens" },
];

const mockRiskEvents: RiskEvent[] = [
  { id: "1", severity: "High", message: "Unusual increase in dev wallet outbound transactions", timeframe: "18–30h forecast", timestamp: "2m ago" },
  { id: "2", severity: "Moderate", message: "Rapid LP reduction detected (−12% in 10 mins)", timestamp: "5m ago" },
  { id: "3", severity: "Info", message: "Large new holder added — source low-reputation wallet", timestamp: "8m ago" },
  { id: "4", severity: "High", message: "Mint authority still active on token contract", timestamp: "15m ago" },
];

const mockHistoricalMatches: HistoricalMatch[] = [
  { match: 92, category: "Meme token", outcome: "Rug pull", timeToFailure: "26h" },
  { match: 84, category: "NFT project", outcome: "Abandoned", timeToFailure: "72h" },
  { match: 78, category: "DeFi pool", outcome: "Exploit", timeToFailure: "19h" },
];

const mockProjectionData = [
  { time: "Now", risk: 0.73 },
  { time: "6h", risk: 0.78 },
  { time: "24h", risk: 0.85 },
  { time: "48h", risk: 0.91 },
  { time: "72h", risk: 0.82 },
];

function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "Low": return "#22c55e";
    case "Moderate": return "#eab308";
    case "Elevated": return "#f97316";
    case "High": return "#ef4444";
    case "Critical": return "#dc2626";
  }
}

function getSeverityColor(severity: "High" | "Moderate" | "Info"): string {
  switch (severity) {
    case "High": return "#ef4444";
    case "Moderate": return "#eab308";
    case "Info": return "#3b82f6";
  }
}

function getSeverityIcon(severity: "High" | "Moderate" | "Info"): string {
  switch (severity) {
    case "High": return "🔴";
    case "Moderate": return "🟡";
    case "Info": return "🔵";
  }
}

type TabId = "root-cause" | "dev-behavior" | "liquidity" | "network";

function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

function isKnownAddress(address: string): boolean {
  return mockWatchlist.some(item => item.address.toLowerCase() === address.toLowerCase());
}

export default function PredictionTerminal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<WatchlistItem | null>(mockWatchlist[0]);
  const [activeTab, setActiveTab] = useState<TabId>("root-cause");
  const [continuousMonitoring, setContinuousMonitoring] = useState(false);
  const [scanState, setScanState] = useState<ScanState>("has_data");
  const [scanAddress, setScanAddress] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentScanIdRef = useRef<number>(0);

  const filteredWatchlist = mockWatchlist.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleScan = (address: string) => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }

    if (!address.trim()) {
      setScanState("idle");
      return;
    }

    if (!isValidSolanaAddress(address)) {
      setScanState("invalid");
      return;
    }

    const scanId = ++currentScanIdRef.current;
    setScanAddress(address);
    setScanState("scanning");
    setScanProgress(0);

    scanIntervalRef.current = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    scanTimeoutRef.current = setTimeout(() => {
      if (currentScanIdRef.current !== scanId) return;
      
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      setScanProgress(100);
      
      if (isKnownAddress(address)) {
        const found = mockWatchlist.find(item => item.address.toLowerCase() === address.toLowerCase());
        if (found) {
          setSelectedAsset(found);
          setScanState("has_data");
        }
      } else {
        setScanState("no_data");
      }
    }, 2000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(searchQuery);
  };

  useEffect(() => {
    if (selectedAsset) {
      setScanState("has_data");
    }
  }, [selectedAsset]);

  return (
    <div className="min-h-screen bg-black text-white font-mono" data-testid="prediction-terminal">
      <div className="flex h-screen">
        
        {/* Left Sidebar - Watchlist */}
        <aside className="w-72 border-r border-white/10 flex flex-col bg-black/50" data-testid="sidebar-watchlist">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-widest mb-4">Watchlist</h2>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search or scan any address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 pr-16 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                  data-testid="input-watchlist-search"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded transition-colors"
                  data-testid="button-scan"
                >
                  SCAN
                </button>
              </div>
            </form>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {filteredWatchlist.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedAsset(item)}
                className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                  selectedAsset?.id === item.id 
                    ? 'bg-white/10 border border-white/20' 
                    : 'bg-white/[0.02] border border-transparent hover:bg-white/5'
                }`}
                data-testid={`watchlist-item-${item.id}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{item.label}</span>
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded-full uppercase font-medium"
                    style={{ 
                      backgroundColor: `${getRiskColor(item.riskLevel)}20`,
                      color: getRiskColor(item.riskLevel)
                    }}
                  >
                    {item.riskLevel}
                  </span>
                </div>
                <div className="text-[10px] text-white/40 truncate">{item.address.slice(0, 20)}...</div>
                <div className="text-[10px] text-white/30 mt-1">Last scan: {item.lastScan}</div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-white/10">
            <button 
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded py-2 text-xs text-white/70 transition-all"
              data-testid="button-add-address"
            >
              + Add Address to Watchlist
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header */}
          <header className="px-6 py-4 border-b border-white/10 bg-black/30">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold tracking-wide">Current Status</h1>
                <p className="text-xs text-white/40">Live risk analytics updated every 10 seconds.</p>
              </div>
              <div className="text-[10px] text-white/30">
                Data updated: <span className="text-white/50">6 seconds ago</span>
              </div>
            </div>
          </header>

          {/* Main Stage */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Center Panel */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Idle State */}
              {scanState === "idle" && (
                <div className="flex-1 flex items-center justify-center min-h-[400px]" data-testid="state-idle">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="text-3xl opacity-50">🔍</span>
                    </div>
                    <h3 className="text-lg font-medium text-white/70 mb-2">Ready to Scan</h3>
                    <p className="text-sm text-white/40 mb-6">
                      Enter a Solana wallet address or token contract to analyze risk patterns and predict potential issues.
                    </p>
                    <div className="flex flex-col gap-2 text-[10px] text-white/30">
                      <span>Paste any address in the search bar</span>
                      <span>or select from your watchlist</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Scanning State */}
              {scanState === "scanning" && (
                <div className="flex-1 flex items-center justify-center min-h-[400px]" data-testid="state-scanning">
                  <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                      <div className="absolute inset-0 rounded-full border-2 border-purple-500/20"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 animate-spin"
                        style={{ animationDuration: '1s' }}
                      ></div>
                      <div 
                        className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-400/70 animate-spin"
                        style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-400">{Math.min(100, Math.round(scanProgress))}%</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-white/70 mb-2">Scanning Entity</h3>
                    <p className="text-xs text-white/40 font-mono mb-4 truncate max-w-xs mx-auto">
                      {scanAddress.slice(0, 20)}...{scanAddress.slice(-8)}
                    </p>
                    <div className="w-64 h-1 mx-auto bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-200"
                        style={{ width: `${Math.min(100, scanProgress)}%` }}
                      ></div>
                    </div>
                    <div className="mt-4 space-y-1 text-[10px] text-white/30">
                      <p className={scanProgress > 20 ? 'text-purple-400' : ''}>Analyzing on-chain transactions...</p>
                      <p className={scanProgress > 40 ? 'text-purple-400' : ''}>Mapping wallet relationships...</p>
                      <p className={scanProgress > 60 ? 'text-purple-400' : ''}>Calculating risk patterns...</p>
                      <p className={scanProgress > 80 ? 'text-purple-400' : ''}>Generating predictions...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* No Data State */}
              {scanState === "no_data" && (
                <div className="flex-1 flex items-center justify-center min-h-[400px]" data-testid="state-no-data">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                      <span className="text-3xl">📭</span>
                    </div>
                    <h3 className="text-lg font-medium text-yellow-400 mb-2">No Data Available</h3>
                    <p className="text-sm text-white/40 mb-4">
                      This address has insufficient on-chain history or activity for meaningful risk analysis.
                    </p>
                    <p className="text-xs text-white/30 font-mono mb-6 truncate max-w-xs mx-auto">
                      {scanAddress}
                    </p>
                    <div className="space-y-2 text-[10px] text-white/30 mb-6">
                      <p>Possible reasons:</p>
                      <ul className="space-y-1 text-left inline-block">
                        <li>• Newly created address with no transactions</li>
                        <li>• Token not yet deployed or traded</li>
                        <li>• Address has no associated token activity</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setScanState("idle")}
                      className="px-4 py-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors"
                      data-testid="button-try-another"
                    >
                      Try Another Address
                    </button>
                  </div>
                </div>
              )}

              {/* Invalid Address State */}
              {scanState === "invalid" && (
                <div className="flex-1 flex items-center justify-center min-h-[400px]" data-testid="state-invalid">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <span className="text-3xl">⚠️</span>
                    </div>
                    <h3 className="text-lg font-medium text-red-400 mb-2">Invalid Address</h3>
                    <p className="text-sm text-white/40 mb-4">
                      The address you entered doesn't appear to be a valid Solana address format.
                    </p>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                      <p className="text-xs text-red-400 mb-2">Address format requirements:</p>
                      <ul className="text-[10px] text-white/40 space-y-1 text-left">
                        <li>• Must be 32-44 characters long</li>
                        <li>• Uses base58 encoding (no 0, O, I, l)</li>
                        <li>• Contains only alphanumeric characters</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setScanState("idle")}
                      className="px-4 py-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors"
                      data-testid="button-try-again"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Has Data State - Show full dashboard */}
              {scanState === "has_data" && (
                <>
                  {/* Real-Time Forecast Card */}
                  <section className="bg-white/[0.02] border border-white/10 rounded-xl p-6" data-testid="forecast-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">Overall Risk Forecast</h2>
                  <span 
                    className="text-lg font-bold px-4 py-1 rounded-lg"
                    style={{ 
                      backgroundColor: `${getRiskColor("High")}20`,
                      color: getRiskColor("High")
                    }}
                    data-testid="risk-badge"
                  >
                    High
                  </span>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/[0.03] rounded-lg p-4">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Quantum Similarity Score</div>
                    <div className="text-2xl font-bold text-purple-400">0.81</div>
                    <div className="text-[10px] text-white/30 mt-1">Behavior matches prior rugs</div>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-4">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Temporal Fragility Index</div>
                    <div className="text-2xl font-bold text-orange-400">0.73</div>
                    <div className="text-[10px] text-white/30 mt-1">Instability within 24–48h</div>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-4">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Liquidity Stability</div>
                    <div className="text-2xl font-bold text-red-400">23%</div>
                    <div className="text-[10px] text-white/30 mt-1">Insufficient depth</div>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-4">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Holder Symmetry</div>
                    <div className="text-lg font-bold text-yellow-400">Whale-dominant</div>
                    <div className="text-[10px] text-white/30 mt-1">Top 10 control 87%</div>
                  </div>
                </div>
              </section>

              {/* Risk Event Feed */}
              <section className="bg-white/[0.02] border border-white/10 rounded-xl p-6" data-testid="risk-feed">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-4">Risk Event Feed</h2>
                <div className="space-y-3">
                  {mockRiskEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                      data-testid={`risk-event-${event.id}`}
                    >
                      <span className="text-sm">{getSeverityIcon(event.severity)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="text-[10px] font-medium uppercase"
                            style={{ color: getSeverityColor(event.severity) }}
                          >
                            {event.severity}
                          </span>
                          {event.timeframe && (
                            <span className="text-[10px] text-white/30">⏱ {event.timeframe}</span>
                          )}
                        </div>
                        <p className="text-xs text-white/80">{event.message}</p>
                      </div>
                      <span className="text-[10px] text-white/30">{event.timestamp}</span>
                    </div>
                  ))}
                </div>
                <button 
                  className="mt-4 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  data-testid="button-enable-alerts"
                >
                  Enable alerts for this address →
                </button>
              </section>

              {/* Bottom Tabs */}
              <section className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden" data-testid="analysis-tabs">
                <div className="flex border-b border-white/10">
                  {[
                    { id: "root-cause" as TabId, label: "Root Cause Analysis", icon: "🟣" },
                    { id: "dev-behavior" as TabId, label: "Developer Behavior", icon: "⚙️" },
                    { id: "liquidity" as TabId, label: "Liquidity Structure", icon: "📈" },
                    { id: "network" as TabId, label: "Network Relationships", icon: "🛰️" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-4 py-3 text-xs font-medium transition-all ${
                        activeTab === tab.id 
                          ? 'bg-white/5 text-white border-b-2 border-purple-500' 
                          : 'text-white/50 hover:text-white/70 hover:bg-white/[0.02]'
                      }`}
                      data-testid={`tab-${tab.id}`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="p-6">
                  {activeTab === "root-cause" && (
                    <div className="space-y-4">
                      <div className="bg-white/[0.03] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-white/50">Top Trigger</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400">High Severity</span>
                        </div>
                        <p className="text-sm font-medium">Dev wallet outbound transactions</p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-xs text-white/40">Contribution: <span className="text-white">41%</span></span>
                        </div>
                      </div>
                      <div className="text-xs text-white/50">
                        <p className="mb-2">Secondary factors:</p>
                        <ul className="space-y-1 text-white/40">
                          <li>• Suspicious funding inflows</li>
                          <li>• Unburnt mint authority</li>
                          <li>• Missing token metadata commitments</li>
                        </ul>
                      </div>
                      <button className="text-xs text-purple-400 hover:text-purple-300">Show chain of events →</button>
                    </div>
                  )}
                  
                  {activeTab === "dev-behavior" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <span>⚠️</span>
                        <span className="text-xs text-yellow-400">Mint authority still active</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-white/[0.03] rounded-lg">
                        <span>📝</span>
                        <span className="text-xs text-white/60">Recently edited metadata (3h ago)</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <span>🔗</span>
                        <span className="text-xs text-red-400">Owner wallet linked to 2 prior incidents</span>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "liquidity" && (
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-white/40 text-left">
                              <th className="pb-2">Pool</th>
                              <th className="pb-2">Depth</th>
                              <th className="pb-2">Primary LP</th>
                              <th className="pb-2">Lock Status</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            <tr className="border-t border-white/5">
                              <td className="py-2">Raydium</td>
                              <td>$42k</td>
                              <td>81% dev-owned</td>
                              <td><span className="text-red-400">Unlocked</span></td>
                            </tr>
                            <tr className="border-t border-white/5">
                              <td className="py-2">Orca</td>
                              <td>$9k</td>
                              <td>Thin depth</td>
                              <td><span className="text-white/40">Unknown</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4">
                        <div className="text-[10px] text-white/40 mb-1">Liquidity Safety Index</div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: '23%' }} />
                        </div>
                      </div>
                      <p className="text-[10px] text-white/30 italic">Healthy liquidity doesn't hide. It's distributed.</p>
                    </div>
                  )}
                  
                  {activeTab === "network" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <p className="text-xs text-red-400">This address is 2 degrees separated from a known rug cluster.</p>
                      </div>
                      <div className="text-xs text-white/50">
                        <p className="mb-2">Connected entities:</p>
                        <ul className="space-y-1 text-white/40">
                          <li>• 3 shared wallet ancestors</li>
                          <li>• 2 linked behavioral patterns</li>
                          <li>• 1 common funding source</li>
                        </ul>
                      </div>
                      <span className="inline-block text-[10px] px-2 py-1 bg-orange-500/20 text-orange-400 rounded">Investigate further</span>
                    </div>
                  )}
                </div>
              </section>
              </>
              )}
            </div>

            {/* Right Side Panels */}
            <aside className="w-80 border-l border-white/10 overflow-y-auto bg-black/30" data-testid="right-panels">
              
              {/* Risk Projection Chart */}
              <section className="p-4 border-b border-white/10">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Risk Projection Curve</h3>
                <p className="text-[10px] text-white/30 mb-4">Scroll or click markers to explore future states.</p>
                
                <div className="h-40 bg-white/[0.02] rounded-lg p-3 relative">
                  <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="projectionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(239, 68, 68, 0.3)" />
                        <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 ${50 - mockProjectionData[0].risk * 45} ${mockProjectionData.map((d, i) => `L ${(i / (mockProjectionData.length - 1)) * 100} ${50 - d.risk * 45}`).join(' ')} L 100 50 L 0 50 Z`}
                      fill="url(#projectionGradient)"
                    />
                    <path
                      d={`M 0 ${50 - mockProjectionData[0].risk * 45} ${mockProjectionData.map((d, i) => `L ${(i / (mockProjectionData.length - 1)) * 100} ${50 - d.risk * 45}`).join(' ')}`}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1"
                    />
                    {mockProjectionData.map((d, i) => (
                      <circle
                        key={i}
                        cx={(i / (mockProjectionData.length - 1)) * 100}
                        cy={50 - d.risk * 45}
                        r={d.risk > 0.85 ? 3 : 2}
                        fill={d.risk > 0.85 ? "#ef4444" : "#f97316"}
                        className="cursor-pointer"
                      />
                    ))}
                  </svg>
                  <div className="flex justify-between mt-2">
                    {mockProjectionData.map((d, i) => (
                      <span key={i} className="text-[9px] text-white/30">{d.time}</span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="text-xs text-red-400 font-medium">Predicted peak: 0.91 risk</div>
                  <div className="text-[10px] text-white/40 mt-1">Highly unstable behavior window projected</div>
                  <div className="text-[10px] text-white/30 mt-1">Confidence: 94%</div>
                </div>
                
                <label className="flex items-center gap-2 mt-3 text-[10px] text-white/40 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={continuousMonitoring}
                    onChange={(e) => setContinuousMonitoring(e.target.checked)}
                    className="rounded border-white/20 bg-white/5"
                  />
                  Continuous Monitoring (auto-rescan)
                </label>
              </section>

              {/* Historical Pattern Matches */}
              <section className="p-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Historical Pattern Matches</h3>
                <p className="text-[10px] text-white/30 mb-4">This asset's behavior mirrors these past incidents.</p>
                
                <div className="space-y-2">
                  {mockHistoricalMatches.map((match, i) => (
                    <div key={i} className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-purple-400">{match.match}%</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          match.outcome === "Rug pull" ? 'bg-red-500/20 text-red-400' :
                          match.outcome === "Exploit" ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {match.outcome}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/40">
                        <span>{match.category}</span>
                        <span>Time to event: {match.timeToFailure}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="mt-4 text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  Explore cluster lineage →
                </button>
              </section>
            </aside>
          </div>

          {/* Footer Disclaimer */}
          <footer className="px-6 py-3 border-t border-white/10 bg-black/50">
            <p className="text-[10px] text-white/30 text-center">
              Predictions are generated from historical on-chain behavior and statistical modeling. 
              They suggest probabilities, not certainties. Always verify information and conduct independent research.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
