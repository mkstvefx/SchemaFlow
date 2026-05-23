import React from "react";

export default function LandingPage({ onLaunchConsole }) {
  return (
    <div id="landing-page" className="w-full min-h-hidden flex flex-col relative select-none">
      
      {/* Header Navbar */}
      <header className="flex justify-between items-center px-[6%] py-5 border-b border-white/8 backdrop-blur-md sticky top-0 z-10 bg-[#09090b]/75">
        <div className="flex items-center gap-2 font-sans font-bold text-lg cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="url(#logo-grad)" strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="url(#logo-grad)" strokeWidth="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="url(#logo-grad)" strokeWidth="2"/>
            <path d="M10 6.5H14" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6.5 10V14" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round"/>
            <defs>
              <linearGradient id="logo-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-[#f4f4f5]">Schema<span className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">Flow</span></span>
        </div>
        <nav className="flex items-center gap-7">
          <a href="#features" className="text-xs text-[#a1a1aa] hover:text-[#f4f4f5] transition-all font-medium">Features</a>
          <a href="#pricing" className="text-xs text-[#a1a1aa] hover:text-[#f4f4f5] transition-all font-medium">Pricing</a>
          <button
            onClick={() => onLaunchConsole("pro")}
            className="px-4 py-2 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded-md text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Launch Designer
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-5 py-20 text-center max-w-[840px] mx-auto flex flex-col items-center z-2">
        <div className="bg-white/3 border border-white/8 px-3 py-1 rounded-full text-[10px] font-semibold mb-6 text-[#06b6d4]">
          💎 Relational Database Modeler
        </div>
        <h1 className="font-sans font-extrabold text-4xl md:text-5xl leading-tight tracking-tight mb-5 text-[#f4f4f5]">
          Visual Database Designing &{" "}
          <span className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">
            Boilerplate Generators
          </span>
        </h1>
        <p className="text-[#a1a1aa] text-sm md:text-base leading-relaxed mb-8 max-w-[660px]">
          Stop writing database migrations and schemas manually. Drag-and-drop tables, map foreign keys visually, and export clean SQL DDL scripts, Prisma structures, Mongoose schemas, and DBML configurations instantly.
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={() => onLaunchConsole("pro")}
            className="px-6 py-3 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] hover:shadow-[0_4px_16px_rgba(6,182,212,0.3)] text-white rounded-lg text-sm font-semibold transition-all cursor-pointer"
          >
            Enter Visual Workspace
          </button>
          <a
            href="#pricing"
            className="px-6 py-3 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded-lg text-sm font-semibold text-[#f4f4f5] transition-all"
          >
            View Pricing Tiers
          </a>
        </div>
      </section>

      {/* Canvas Mock Illustration */}
      <section className="px-[6%] py-3 max-w-[900px] mx-auto w-full z-2 mb-16">
        <div className="bg-[#121214]/60 border border-white/8 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="bg-white/2 px-4 py-2.5 border-b border-white/8 flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white/20"></span>
              <span className="w-2 h-2 rounded-full bg-white/20"></span>
              <span className="w-2 h-2 rounded-full bg-white/20"></span>
            </div>
            <div className="bg-black/20 border border-white/8 px-3 py-0.5 rounded text-[10px] text-[#71717a] max-w-[320px] w-full">
              http://localhost:8080/designer
            </div>
          </div>
          
          <div className="height-[250px] landing-grid-bg relative overflow-hidden h-[250px]">
            {/* mock table 1 */}
            <div className="absolute w-[170px] bg-[#121216]/90 border border-white/8 rounded-lg overflow-hidden shadow-md top-[30px] left-[50px]">
              <div className="bg-white/3 border-b border-white/8 px-3 py-1.5 text-[10px] font-bold text-[#f4f4f5]">users</div>
              <div className="px-3 py-1.5 text-[9px] text-[#a1a1aa] flex justify-between">
                <span>🔑 id</span>
                <span className="text-[#71717a]">uuid</span>
              </div>
              <div className="px-3 py-1.5 text-[9px] text-[#a1a1aa] flex justify-between border-t border-white/1">
                <span>email</span>
                <span className="text-[#71717a]">varchar</span>
              </div>
            </div>

            {/* mock table 2 */}
            <div className="absolute w-[170px] bg-[#121216]/90 border border-white/8 rounded-lg overflow-hidden shadow-md top-[80px] left-[340px]">
              <div className="bg-white/3 border-b border-white/8 px-3 py-1.5 text-[10px] font-bold text-[#f4f4f5]">orders</div>
              <div className="px-3 py-1.5 text-[9px] text-[#a1a1aa] flex justify-between">
                <span>🔑 id</span>
                <span className="text-[#71717a]">uuid</span>
              </div>
              <div className="px-3 py-1.5 text-[9px] text-[#a1a1aa] flex justify-between border-t border-white/1">
                <span>🔗 user_id</span>
                <span className="text-[#71717a]">uuid</span>
              </div>
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 220 65 L 280 65 L 280 115 L 340 115" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4,4" fill="none" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-[6%] py-12 text-center border-t border-white/8 bg-white/1">
        <h2 className="font-sans font-bold text-xl md:text-2xl mb-10 text-white">Zero Config, Zero Hosting Costs, Max Output</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
          <div className="bg-[#121214]/60 border border-white/8 rounded-xl p-6 text-left hover:border-white/16 transition-all hover:-translate-y-0.5">
            <div className="text-2xl mb-3">📐</div>
            <h3 className="text-sm font-bold text-white mb-2">Drag & Drop Schema Builder</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Create visual tables, add attributes, and link primary keys to foreign keys using auto-snapping connector lines.
            </p>
          </div>
          <div className="bg-[#121214]/60 border border-white/8 rounded-xl p-6 text-left hover:border-white/16 transition-all hover:-translate-y-0.5">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="text-sm font-bold text-white mb-2">Live Code Generators</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Generates production-ready schema models for Prisma, MongoDB Mongoose, and standard SQL queries in real-time.
            </p>
          </div>
          <div className="bg-[#121214]/60 border border-white/8 rounded-xl p-6 text-left hover:border-white/16 transition-all hover:-translate-y-0.5">
            <div className="text-2xl mb-3">💾</div>
            <h3 className="text-sm font-bold text-white mb-2">Local Save & SVG Exports</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Download the fully functional schema state as a JSON file, or export a vector SVG image for documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section id="pricing" className="px-[6%] py-16 text-center border-t border-white/8">
        <h2 className="font-sans font-bold text-xl md:text-2xl text-white mb-2">Pricing Built for Developers</h2>
        <p className="text-xs text-[#a1a1aa] mb-10">Start styling visual tables for free, upgrade to unlock advanced ORM generators and SVG model exports.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
          <div className="bg-[#121214]/60 border border-white/8 rounded-xl p-8 text-left flex flex-col justify-between backdrop-blur-md">
            <div>
              <h3 className="text-sm font-bold text-white mb-3">Hobby Plan</h3>
              <div className="font-sans font-extrabold text-3xl mb-1 text-white">€0<span className="text-[10px] text-[#71717a] font-normal">/mo</span></div>
              <p className="text-[10px] text-[#71717a] mb-5">Basic visual database designer</p>
              <ul className="text-xs text-[#a1a1aa] space-y-2 mb-6">
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Design up to 3 SQL Tables</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> SQL DDL Code generation</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Local JSON saving</li>
              </ul>
            </div>
            <button
              onClick={() => onLaunchConsole("free")}
              className="w-full py-2 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded-md text-xs font-semibold text-[#f4f4f5] cursor-pointer transition-all"
            >
              Start Free Designer
            </button>
          </div>

          <div className="bg-[#121214]/60 border border-[#06b6d4] shadow-[0_0_24px_rgba(6,182,212,0.05)] rounded-xl p-8 text-left flex flex-col justify-between backdrop-blur-md relative">
            <span className="absolute top-4 right-6 bg-[#06b6d4] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">RECOMMENDED</span>
            <div>
              <h3 className="text-sm font-bold text-white mb-3">Pro Plan</h3>
              <div className="font-sans font-extrabold text-3xl mb-1 text-white">€12<span className="text-[10px] text-[#71717a] font-normal">/mo</span></div>
              <p className="text-[10px] text-[#71717a] mb-5">Perfect for indie hackers & developers</p>
              <ul className="text-xs text-[#a1a1aa] space-y-2 mb-6">
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Create Unlimited Tables</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> SQL + Prisma generators</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Mongoose MongoDB exporter</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> High-quality SVG exports</li>
              </ul>
            </div>
            <button
              onClick={() => onLaunchConsole("pro")}
              className="w-full py-2 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white rounded-md text-xs font-semibold cursor-pointer transition-all"
            >
              Upgrade Demo Console
            </button>
          </div>

          <div className="bg-[#121214]/60 border border-white/8 rounded-xl p-8 text-left flex flex-col justify-between backdrop-blur-md">
            <div>
              <h3 className="text-sm font-bold text-white mb-3">Enterprise</h3>
              <div className="font-sans font-extrabold text-3xl mb-1 text-white">€29<span className="text-[10px] text-[#71717a] font-normal">/mo</span></div>
              <p className="text-[10px] text-[#71717a] mb-5">For infrastructure-heavy developers</p>
              <ul className="text-xs text-[#a1a1aa] space-y-2 mb-6">
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Unlimited models & canvases</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> All code generators + DBML</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Collaborative team sharing</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Priority support channels</li>
              </ul>
            </div>
            <button
              onClick={() => onLaunchConsole("enterprise")}
              className="w-full py-2 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded-md text-xs font-semibold text-[#f4f4f5] cursor-pointer transition-all"
            >
              Launch Enterprise Demo
            </button>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-white/8 text-center text-[10px] text-[#71717a]">
        <p>&copy; 2026 SchemaFlow Designer. Created for Acquire.com startup valuations.</p>
      </footer>
    </div>
  );
}
