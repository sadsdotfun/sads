import { Link } from "wouter";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#0a0a15] text-white p-8 font-mono flex flex-col">
      <Link href="/">
        <a className="text-sm opacity-50 hover:opacity-100 transition-opacity mb-8 block">← Back to Nexus</a>
      </Link>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl mb-8 font-light">Get in Touch</h1>
        <a 
          href="mailto:support@sads.fun" 
          className="text-2xl md:text-4xl hover:text-purple-400 transition-colors border-b border-white/20 pb-2 hover:border-purple-400"
        >
          support@sads.fun
        </a>
        <p className="mt-8 opacity-50 max-w-md">
          For inquiries regarding the protocol, partnerships, or technical support.
        </p>
      </div>
    </div>
  );
}
