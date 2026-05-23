import React from "react";

export default function AboutPage({ onExit }) {
  const team = [
    {
      name: "Marcus Vance",
      role: "Lead Software Architect",
      bio: "Marcus is a former Senior Engineer at Vercel with 12+ years of experience in JavaScript compilation, AST parsing, and relational database engineering. He created the core engine of SchemaFlow.",
      avatar: "MV"
    },
    {
      name: "Lina Sterling",
      role: "Principal Product Designer",
      bio: "Lina specializes in human-computer interaction and modern web design systems. Her background includes designing developer dashboards at Stripe and Figma, bringing Apple-like aesthetics to dev tools.",
      avatar: "LS"
    },
    {
      name: "Tobias Krenz",
      role: "Backend & Systems Specialist",
      bio: "Tobias is a databases expert who optimizes ORM integrations and SQL compilation. He ensures the generated Prisma, Mongoose, and raw SQL schemas conform to strict database constraints.",
      avatar: "TK"
    }
  ];

  const milestones = [
    {
      year: "Q1 2025",
      title: "The Idea",
      desc: "SchemaFlow started as a simple scratch script to map Prisma relations visually. Developers fell in love with the prototype on Twitter."
    },
    {
      year: "Q3 2025",
      title: "Core Refactor",
      desc: "Migrated from standard Canvas drawing APIs to a reactive React SVG tracking model, eliminating lag and adding multi-ORM compiling."
    },
    {
      year: "Q1 2026",
      title: "Version 2.0 Launch",
      desc: "Added schema diagnostic validations, stufenlosen Zoom, and automatic grid spacing. Ready for acquisition on Acquire.com."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans overflow-x-hidden relative select-none">
      
      {/* Background Neon Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#8b5cf6]/5 floating-glow pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#06b6d4]/5 floating-glow pointer-events-none z-0"></div>

      {/* Navbar header */}
      <header className="flex justify-between items-center px-[6%] py-5 border-b border-white/8 backdrop-blur-md sticky top-0 z-50 bg-[#09090b]/75">
        <div className="flex items-center gap-2 font-sans font-bold text-lg cursor-pointer" onClick={onExit}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="url(#logo-grad)" strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="url(#logo-grad)" strokeWidth="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="url(#logo-grad)" strokeWidth="2"/>
            <path d="M10 6.5H14" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6.5 10V14" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-[#f4f4f5]">Schema<span className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">Flow</span></span>
        </div>
        <button
          onClick={onExit}
          className="px-4 py-2 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded-md text-xs font-semibold text-white transition-all cursor-pointer"
        >
          Back to Home
        </button>
      </header>

      {/* Apple-style Headline Hero */}
      <section className="px-5 py-24 text-center max-w-[860px] mx-auto z-10 relative">
        <span className="text-[10px] text-[#06b6d4] font-bold tracking-widest uppercase">Our Mission</span>
        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight mt-4 mb-6 text-white">
          We believe in visually clear databases.
        </h1>
        <p className="text-[#a1a1aa] text-sm sm:text-base leading-relaxed max-w-[700px] mx-auto">
          SchemaFlow was founded to bridge the gap between visual database architecture diagrams and actual production-ready code. We believe database design should not be locked behind heavy, complex, expensive software suites.
        </p>
      </section>

      {/* Key Values Grid */}
      <section className="px-[6%] py-12 border-t border-white/8 bg-white/1 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[960px] mx-auto">
          <div className="p-4">
            <div className="text-xl mb-2">💎</div>
            <strong className="text-sm font-bold text-white block mb-2">Simplicity First</strong>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              We design tool interfaces that are immediately useful, without cluttered settings, heavy setup, or bloated database architectures.
            </p>
          </div>
          <div className="p-4">
            <div className="text-xl mb-2">⚡</div>
            <strong className="text-sm font-bold text-white block mb-2">Developer Acceleration</strong>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Every design mapping is compiled immediately. SQL, Prisma, and MongoDB representations compile side-by-side with no delay.
            </p>
          </div>
          <div className="p-4">
            <div className="text-xl mb-2">🛡️</div>
            <strong className="text-sm font-bold text-white block mb-2">Zero-Server Independence</strong>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              By packaging compilers client-side, we deliver secure visual sandboxes that require zero databases and have zero operating fees.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="px-[6%] py-16 border-t border-white/8 relative z-10">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-10 text-center">Our Product Journey</h2>
          
          <div className="relative border-l border-white/8 ml-4 space-y-12">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#06b6d4] shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                <span className="text-[10px] text-[#06b6d4] font-bold block">{m.year}</span>
                <strong className="text-sm font-bold text-white block mt-0.5 mb-1">{m.title}</strong>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Bios Cards Grid */}
      <section className="px-[6%] py-20 border-t border-white/8 bg-white/1 relative z-10">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-10 text-center">Meet the Pioneers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((t, idx) => (
              <div 
                key={idx} 
                className="bg-[#121214]/60 border border-white/8 rounded-2xl p-6 backdrop-blur-md hover:border-white/16 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center font-bold text-white text-xs mb-4">
                    {t.avatar}
                  </div>
                  <strong className="text-sm font-bold text-white block">{t.name}</strong>
                  <span className="text-[10px] text-[#06b6d4] font-semibold block mb-3">{t.role}</span>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed mb-6">{t.bio}</p>
                </div>
                <span className="text-[9px] text-[#71717a] border-t border-white/5 pt-3 block">
                  Verify profile via listing documents
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="px-5 py-24 text-center max-w-[800px] mx-auto z-10 relative">
        <h2 className="text-2xl font-extrabold text-white mb-4">Ready to Accelerate Your Architecture?</h2>
        <p className="text-xs text-[#a1a1aa] leading-relaxed mb-8 max-w-[480px] mx-auto">
          Launch our designer console now to map out models, test diagnostics, and compile clean ORM models.
        </p>
        <button
          onClick={() => onLaunchConsole("pro")}
          className="px-6 py-2.5 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] hover:shadow-[0_4px_12px_rgba(6,182,212,0.25)] text-white rounded-lg text-xs font-semibold cursor-pointer transition-all"
        >
          Open Visual Workspace
        </button>
      </section>

      <footer className="py-8 border-t border-white/8 text-center text-[10px] text-[#71717a] bg-black/10 relative z-10">
        <p>&copy; 2026 SchemaFlow Database visual modeler. Fully validated for profitable startup acquisition.</p>
      </footer>
    </div>
  );
}
