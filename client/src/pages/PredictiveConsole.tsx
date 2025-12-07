import { Link } from "wouter";

export default function PredictiveConsole() {
  return (
    <div className="min-h-screen bg-[#0a0a15] text-white p-8 font-mono">
      <Link href="/">
        <a className="text-sm opacity-50 hover:opacity-100 transition-opacity mb-8 block">← Back to Nexus</a>
      </Link>
      
      <div className="max-w-4xl mx-auto mt-20">
        <h1 className="text-4xl mb-2 font-light">Predictive Console</h1>
        <p className="opacity-60 mb-12">Temporal Fragility Index Analysis</p>
        
        <div className="bg-[#151520] border border-white/10 rounded-lg p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest opacity-50">Target Address</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Enter Solana Address..." 
                  className="flex-1 bg-black/30 border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                />
                <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded transition-colors uppercase text-sm tracking-wider">
                  Scan
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-black/20 p-4 rounded border border-white/5">
                <div className="text-xs uppercase tracking-widest opacity-40 mb-2">Fragility Index</div>
                <div className="text-2xl text-purple-400">--</div>
              </div>
              <div className="bg-black/20 p-4 rounded border border-white/5">
                <div className="text-xs uppercase tracking-widest opacity-40 mb-2">Similarity Score</div>
                <div className="text-2xl text-blue-400">--</div>
              </div>
              <div className="bg-black/20 p-4 rounded border border-white/5">
                <div className="text-xs uppercase tracking-widest opacity-40 mb-2">Risk Window</div>
                <div className="text-2xl text-red-400">--</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
