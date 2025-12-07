import { Link } from "wouter";

export default function Orbiverse() {
  return (
    <div className="min-h-screen bg-[#050510] text-white p-8 font-mono overflow-hidden relative">
      <Link href="/">
        <a className="text-sm opacity-50 hover:opacity-100 transition-opacity mb-8 block relative z-10">← Back to Nexus</a>
      </Link>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[100px] animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto mt-20 relative z-10">
        <h1 className="text-4xl mb-2 font-light">Orbiverse</h1>
        <p className="opacity-60 mb-12">Galaxy of Active Entities</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all cursor-pointer group relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute bottom-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">
                Entity {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
