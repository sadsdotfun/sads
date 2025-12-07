import { Link } from "wouter";

export default function Docs() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-mono">
      <Link href="/">
        <a className="text-sm opacity-50 hover:opacity-100 transition-opacity mb-8 block">← Back to Nexus</a>
      </Link>
      
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-12">
        <div className="border-r border-white/10 pr-8">
          <div className="text-xs uppercase tracking-widest opacity-40 mb-6">Documentation</div>
          <ul className="space-y-4 text-sm opacity-60">
            <li className="text-purple-400 opacity-100">Introduction</li>
            <li className="hover:text-white cursor-pointer transition-colors">Architecture</li>
            <li className="hover:text-white cursor-pointer transition-colors">API Reference</li>
            <li className="hover:text-white cursor-pointer transition-colors">Integration</li>
            <li className="hover:text-white cursor-pointer transition-colors">Security</li>
          </ul>
        </div>
        
        <div>
          <h1 className="text-4xl mb-6 font-light">SADS Protocol</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg opacity-80 mb-8 leading-relaxed">
              The Solana Autonomous Discovery System (SADS) provides a framework for predictive analysis of on-chain entities using advanced pattern recognition.
            </p>
            
            <div className="bg-[#111] p-6 rounded border border-white/10 mb-8">
              <code className="text-purple-400 block mb-2">// Initialize SADS Client</code>
              <pre className="text-sm text-gray-400 overflow-x-auto">
{`import { SadsClient } from '@sads/sdk';

const client = new SadsClient({
  endpoint: 'https://api.sads.fun/v1',
  apiKey: process.env.SADS_API_KEY
});

const prediction = await client.scan(targetAddress);`}
              </pre>
            </div>
            
            <h2 className="text-2xl mb-4 font-light mt-12">Core Concepts</h2>
            <p className="opacity-60 mb-4">
              Our system relies on three fundamental metrics to evaluate entity behavior:
            </p>
            <ul className="list-disc pl-5 space-y-2 opacity-60">
              <li>Temporal Fragility</li>
              <li>Quantum Similarity</li>
              <li>Risk Event Probability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
