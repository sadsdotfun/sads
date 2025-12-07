import { Link } from "wouter";

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-mono">
      <Link href="/">
        <a className="text-sm opacity-50 hover:opacity-100 transition-opacity mb-8 block">← Back to Nexus</a>
      </Link>
      
      <div className="max-w-4xl mx-auto mt-20">
        <h1 className="text-4xl mb-2 font-light">Roadmap</h1>
        <p className="opacity-60 mb-16">Cosmic Timeline</p>
        
        <div className="relative border-l border-white/10 ml-4 space-y-20 pb-20">
          <div className="relative pl-12">
            <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
            <div className="text-xs uppercase tracking-widest text-purple-400 mb-2">Phase 1 • Current</div>
            <h3 className="text-2xl mb-4">Initialization</h3>
            <p className="opacity-60 max-w-lg">
              Launch of the predictive console and core scanning algorithms. establishing the baseline for temporal fragility index.
            </p>
          </div>

          <div className="relative pl-12 opacity-60">
            <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-white/20"></div>
            <div className="text-xs uppercase tracking-widest mb-2">Phase 2 • Q3 2025</div>
            <h3 className="text-2xl mb-4">Expansion</h3>
            <p className="opacity-60 max-w-lg">
              Integration of the Orbiverse visualizer and real-time network monitoring tools. API public access beta.
            </p>
          </div>

          <div className="relative pl-12 opacity-40">
            <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-white/10"></div>
            <div className="text-xs uppercase tracking-widest mb-2">Phase 3 • 2026</div>
            <h3 className="text-2xl mb-4">Autonomy</h3>
            <p className="opacity-60 max-w-lg">
              Full autonomous discovery capabilities with decentralized node support. Self-evolving prediction models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
