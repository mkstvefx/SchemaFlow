import React, { useState } from "react";
import {
  compileSqlSchema,
  compilePrismaSchema,
  compileMongooseSchema,
  compileDbmlSchema
} from "../utils/exporters";

const DEMO_TEMPLATES = {
  saas: [
    {
      id: "tbl-users",
      name: "users",
      x: 30,
      y: 40,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "email", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "plan", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "tbl-payments",
      name: "payments",
      x: 250,
      y: 100,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "user_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "tbl-users.id" },
        { name: "amount", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    }
  ],
  ecommerce: [
    {
      id: "tbl-customers",
      name: "customers",
      x: 30,
      y: 40,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "name", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "tbl-orders",
      name: "orders",
      x: 250,
      y: 80,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "customer_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "tbl-customers.id" },
        { name: "status", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    }
  ],
  social: [
    {
      id: "tbl-accounts",
      name: "accounts",
      x: 30,
      y: 45,
      columns: [
        { name: "id", type: "integer", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "username", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null }
      ]
    },
    {
      id: "tbl-posts",
      name: "posts",
      x: 250,
      y: 75,
      columns: [
        { name: "id", type: "integer", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "author_id", type: "integer", pk: false, nn: true, uq: false, fkTarget: "tbl-accounts.id" },
        { name: "likes", type: "integer", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    }
  ]
};

export default function LandingPage({ onLaunchConsole }) {
  // Sandbox State
  const [activeTemplate, setActiveTemplate] = useState("saas");
  const [activeCodeTab, setActiveCodeTab] = useState("sql");
  
  // Pricing State
  const [billingPeriod, setBillingPeriod] = useState("monthly"); // monthly, yearly
  
  // Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Compile sandbox active code
  const currentSchema = DEMO_TEMPLATES[activeTemplate];
  let compiledDemoCode = "";
  if (activeCodeTab === "sql") compiledDemoCode = compileSqlSchema(currentSchema);
  else if (activeCodeTab === "prisma") compiledDemoCode = compilePrismaSchema(currentSchema);
  else if (activeCodeTab === "mongoose") compiledDemoCode = compileMongooseSchema(currentSchema);
  else if (activeCodeTab === "dbml") compiledDemoCode = compileDbmlSchema(currentSchema);

  const faqs = [
    {
      question: "Do I need a server or database to host SchemaFlow?",
      answer: "No. SchemaFlow operates 100% client-side in the browser. It runs completely serverless and can be deployed entirely for free on platforms like Vercel, Netlify, or GitHub Pages. Your maintenance costs will be $0.00/month."
    },
    {
      question: "Which database frameworks and ORMs are supported?",
      answer: "We support standard SQL DDL (PostgreSQL, MySQL), Prisma ORM Schema files (schema.prisma), Mongoose schemas (MongoDB Models in ES6 JavaScript), and DBML (Database Markup Language) markup."
    },
    {
      question: "How does the local backup and importing work?",
      answer: "You can save the complete visual board arrangement and table definitions by exporting a standard JSON file. Clicking 'Import JSON' restores your layout coordinates, types, and connection mappings instantly."
    },
    {
      question: "Can I export high-quality diagram maps?",
      answer: "Yes. With Pro and Enterprise subscriptions, users can download the full diagram layout as a vectorized SVG image file, ready for project documentation, manuals, or pitch slides."
    }
  ];

  return (
    <div id="landing-page" className="w-full min-h-screen flex flex-col relative bg-[#09090b] overflow-x-hidden select-none">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[10%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-[#06b6d4]/8 floating-glow pointer-events-none z-0"></div>
      <div className="absolute top-[40%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-[#8b5cf6]/8 floating-glow pointer-events-none z-0"></div>
      
      {/* Header Navbar */}
      <header className="flex justify-between items-center px-[6%] py-5 border-b border-white/8 backdrop-blur-md sticky top-0 z-50 bg-[#09090b]/75">
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
        <nav className="flex items-center gap-6">
          <a href="#playground" className="text-xs text-[#a1a1aa] hover:text-[#f4f4f5] transition-all font-medium hidden sm:inline-block">Playground</a>
          <a href="#features" className="text-xs text-[#a1a1aa] hover:text-[#f4f4f5] transition-all font-medium">Features</a>
          <a href="#about" className="text-xs text-[#a1a1aa] hover:text-[#f4f4f5] transition-all font-medium">About</a>
          <a href="#docs" className="text-xs text-[#a1a1aa] hover:text-[#f4f4f5] transition-all font-medium">Docs</a>
          <button
            onClick={() => onLaunchConsole("pro")}
            className="px-4 py-2 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded-md text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Launch Designer
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-5 py-24 text-center max-w-[880px] mx-auto flex flex-col items-center z-10 relative">
        <div className="bg-white/3 border border-white/8 px-4 py-1.5 rounded-full text-[10px] font-bold mb-6 text-[#06b6d4] tracking-wider uppercase">
          ⚡ Next-Gen Relational Database Modeler
        </div>
        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight mb-6 text-[#f4f4f5]">
          Visual Database Designing &{" "}
          <span className="bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#06b6d4] bg-gradient-animate bg-clip-text text-transparent">
            Automated ORM Compilers
          </span>
        </h1>
        <p className="text-[#a1a1aa] text-sm sm:text-base leading-relaxed mb-10 max-w-[700px]">
          Accelerate your database architecture. Drag-and-drop table layouts, connect visual relationship paths, and immediately compile clean SQL DDL scripts, Prisma structures, Mongoose configurations, and DBML schemas.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onLaunchConsole("pro")}
            className="px-7 py-3.5 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] hover:shadow-[0_4px_20px_rgba(6,182,212,0.35)] text-white rounded-lg text-sm font-semibold transition-all cursor-pointer"
          >
            Enter Visual Workspace
          </button>
          <a
            href="#playground"
            className="px-7 py-3.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded-lg text-sm font-semibold text-[#f4f4f5] transition-all"
          >
            Try Free Sandbox
          </a>
        </div>
      </section>

      {/* INTERACTIVE PLAYGROUND (Sandbox) */}
      <section id="playground" className="px-[6%] py-12 max-w-[1100px] mx-auto w-full z-10 relative mb-24">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Interactive Exporter Playground</h2>
          <p className="text-xs text-[#a1a1aa] max-w-[500px] mx-auto">Select a sample schema template and toggle code export tabs to see live compilations.</p>
        </div>

        <div className="bg-[#121214]/60 border border-white/8 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md grid grid-cols-1 lg:grid-cols-[450px_1fr]">
          
          {/* Visual Canvas Sandbox */}
          <div className="border-b lg:border-b-0 lg:border-r border-white/8 p-6 flex flex-col justify-between">
            <div>
              <div className="flex gap-2 mb-4 bg-white/2 p-1 rounded-lg border border-white/5">
                <button
                  onClick={() => setActiveTemplate("saas")}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-semibold cursor-pointer transition-all ${
                    activeTemplate === "saas" ? "bg-white/5 text-white" : "text-[#71717a] hover:text-[#a1a1aa]"
                  }`}
                >
                  💳 SaaS Billing
                </button>
                <button
                  onClick={() => setActiveTemplate("ecommerce")}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-semibold cursor-pointer transition-all ${
                    activeTemplate === "ecommerce" ? "bg-white/5 text-white" : "text-[#71717a] hover:text-[#a1a1aa]"
                  }`}
                >
                  🛒 E-Commerce
                </button>
                <button
                  onClick={() => setActiveTemplate("social")}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-semibold cursor-pointer transition-all ${
                    activeTemplate === "social" ? "bg-white/5 text-white" : "text-[#71717a] hover:text-[#a1a1aa]"
                  }`}
                >
                  💬 Social App
                </button>
              </div>

              <span className="text-[10px] text-[#71717a] font-semibold block mb-4">Visual Model Preview</span>
            </div>

            <div className="h-[260px] relative landing-grid-bg border border-white/5 rounded-xl overflow-hidden">
              {currentSchema.map(tbl => {
                const height = 34 + tbl.columns.length * 30;
                return (
                  <div
                    key={tbl.id}
                    style={{ left: `${tbl.x}px`, top: `${tbl.y}px`, height: `${height}px` }}
                    className="absolute w-[150px] bg-[#121216]/95 border border-white/8 rounded-lg overflow-hidden shadow-lg animate-float"
                  >
                    <div className="bg-white/3 border-b border-white/8 px-2.5 py-1.5 text-[9px] font-bold text-white">{tbl.name}</div>
                    <div className="flex flex-col">
                      {tbl.columns.map(col => (
                        <div key={col.name} className="px-2.5 py-1.5 text-[8px] flex justify-between border-b border-white/1 last:border-none text-[#a1a1aa]">
                          <span>{col.pk ? "🔑 " : col.fkTarget ? "🔗 " : ""}{col.name}</span>
                          <span className="text-[#71717a] font-mono text-[7px]">{col.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 180 85 C 210 85, 210 135, 250 135"
                  stroke="#06b6d4"
                  strokeWidth="1.8"
                  fill="none"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
            
            <p className="text-[9px] text-[#71717a] mt-4 leading-normal">
              💡 Drag nodes, configure settings, and link foreign keys directly inside the full visual workspace.
            </p>
          </div>

          {/* Code Viewer Sandbox */}
          <div className="flex flex-col h-[420px] lg:h-auto">
            <div className="flex border-b border-white/8 bg-white/1 overflow-x-auto">
              <button
                onClick={() => setActiveCodeTab("sql")}
                className={`flex-1 py-3 text-center text-[10px] font-bold cursor-pointer transition-all border-b-2 ${
                  activeCodeTab === "sql" ? "text-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/5" : "text-[#71717a] hover:text-[#a1a1aa] border-b-transparent"
                }`}
              >
                SQL DDL
              </button>
              <button
                onClick={() => setActiveCodeTab("prisma")}
                className={`flex-1 py-3 text-center text-[10px] font-bold cursor-pointer transition-all border-b-2 ${
                  activeCodeTab === "prisma" ? "text-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/5" : "text-[#71717a] hover:text-[#a1a1aa] border-b-transparent"
                }`}
              >
                Prisma ORM
              </button>
              <button
                onClick={() => setActiveCodeTab("mongoose")}
                className={`flex-1 py-3 text-center text-[10px] font-bold cursor-pointer transition-all border-b-2 ${
                  activeCodeTab === "mongoose" ? "text-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/5" : "text-[#71717a] hover:text-[#a1a1aa] border-b-transparent"
                }`}
              >
                Mongoose
              </button>
              <button
                onClick={() => setActiveCodeTab("dbml")}
                className={`flex-1 py-3 text-center text-[10px] font-bold cursor-pointer transition-all border-b-2 ${
                  activeCodeTab === "dbml" ? "text-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/5" : "text-[#71717a] hover:text-[#a1a1aa] border-b-transparent"
                }`}
              >
                DBML
              </button>
            </div>

            <div className="flex-grow overflow-hidden relative bg-[#070708]">
              <pre className="absolute inset-0 p-5 overflow-auto text-[10px] sm:text-[11px] leading-relaxed text-[#22d3ee] font-mono select-all">
                <code>{compiledDemoCode}</code>
              </pre>
            </div>
            
            <div className="px-5 py-3 border-t border-white/8 bg-white/1 flex justify-between items-center">
              <span className="text-[9px] text-[#71717a]">Live Output Compiler</span>
              <button
                onClick={() => { navigator.clipboard.writeText(compiledDemoCode); alert("Copied Code!"); }}
                className="px-3 py-1 bg-white/3 border border-white/8 hover:bg-white/5 rounded text-[10px] font-semibold text-white transition-all cursor-pointer"
              >
                Copy Code
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-[6%] py-16 border-t border-white/8 bg-white/1 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] text-[#8b5cf6] font-bold tracking-widest uppercase">Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">How SchemaFlow Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[960px] mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center text-white text-lg font-bold mb-4 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              1
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Visually Map Out Models</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-[280px]">
              Add tables, customize database fields, and connect relations using drag-and-drop UI canvas nodes.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-white text-lg font-bold mb-4 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              2
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Real-time Code Compile</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-[280px]">
              Our static builder instantly compiles your visual nodes into SQL DDL, Prisma, Mongoose, or DBML formats.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-white text-lg font-bold mb-4 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
              3
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Export & Boost</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-[280px]">
              Copy the models or download full schemas as JSON and vector SVG image files for documentation.
            </p>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="px-[6%] py-20 border-t border-white/8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] text-[#06b6d4] font-bold tracking-widest uppercase">Features</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">Engineered For Developers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
          <div className="bg-[#121214]/60 border border-white/8 rounded-xl p-6 text-left hover:border-white/16 transition-all hover:-translate-y-1">
            <div className="text-2xl mb-3">📐</div>
            <h3 className="text-sm font-bold text-white mb-2">Dotted Grid Canvas</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Clean layout viewport featuring Snapping coordinate nodes, customizable table drawers, and draggable controls.
            </p>
          </div>
          <div className="bg-[#121214]/60 border border-white/8 rounded-xl p-6 text-left hover:border-white/16 transition-all hover:-translate-y-1">
            <div className="text-2xl mb-3">🩺</div>
            <h3 className="text-sm font-bold text-white mb-2">Interactive Diagnostics</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Live checks flag broken links, orphaned references, and missing primary keys, ensuring database schemas compile cleanly.
            </p>
          </div>
          <div className="bg-[#121214]/60 border border-white/8 rounded-xl p-6 text-left hover:border-white/16 transition-all hover:-translate-y-1">
            <div className="text-2xl mb-3">💾</div>
            <h3 className="text-sm font-bold text-white mb-2">JSON Saves & Import</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Export and restore database layouts in seconds with structured state JSON file imports. 100% offline-ready.
            </p>
          </div>
          <div className="bg-[#121214]/60 border border-white/8 rounded-xl p-6 text-left hover:border-white/16 transition-all hover:-translate-y-1">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="text-sm font-bold text-white mb-2">Grid Auto-Arranger</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Clean up chaotic canvas diagrams instantly with a grid auto-layout arrange algorithm.
            </p>
          </div>
          <div className="bg-[#121214]/60 border border-white/8 rounded-xl p-6 text-left hover:border-white/16 transition-all hover:-translate-y-1">
            <div className="text-2xl mb-3">🖼️</div>
            <h3 className="text-sm font-bold text-white mb-2">Vector SVG Exporter</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Download complete schema maps as vectorized SVGs for crystal-clear README markdown file layouts.
            </p>
          </div>
          <div className="bg-[#121214]/60 border border-white/8 rounded-xl p-6 text-left hover:border-white/16 transition-all hover:-translate-y-1">
            <div className="text-2xl mb-3">💰</div>
            <h3 className="text-sm font-bold text-white mb-2">Zero Hosting Cost</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Runs client-side in the browser. Scale it to millions of pageviews with zero database or server hosting fees.
            </p>
          </div>
        </div>
      </section>

      {/* DEVELOPER TESTIMONIAL BOARD */}
      <section id="testimonials" className="px-[6%] py-16 border-t border-white/8 bg-white/1 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] text-[#8b5cf6] font-bold tracking-widest uppercase">Wall of Love</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">What Developers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
          {/* Card 1 */}
          <div className="bg-[#111113]/80 border border-white/8 rounded-xl p-5 flex flex-col justify-between">
            <p className="text-xs text-[#a1a1aa] leading-relaxed italic">
              "SchemaFlow makes sketching database models incredibly fast. I designed my Next.js App Router billing schemas and had production-ready Prisma code in 5 minutes."
            </p>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center text-[10px] font-bold text-white">
                JD
              </div>
              <div>
                <strong className="text-xs text-white block">Jonas D.</strong>
                <span className="text-[10px] text-[#71717a]">Indie Hacker / SaaS Founder</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#111113]/80 border border-white/8 rounded-xl p-5 flex flex-col justify-between">
            <p className="text-xs text-[#a1a1aa] leading-relaxed italic">
              "The real-time Diagnostics tool is a lifesaver. It immediately caught two orphan foreign key mappings before I even ran the SQL migration script."
            </p>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#a855f7] to-[#ec4899] flex items-center justify-center text-[10px] font-bold text-white">
                SL
              </div>
              <div>
                <strong className="text-xs text-white block">Sarah L.</strong>
                <span className="text-[10px] text-[#71717a]">Senior Backend Architect</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#111113]/80 border border-white/8 rounded-xl p-5 flex flex-col justify-between">
            <p className="text-xs text-[#a1a1aa] leading-relaxed italic">
              "Our engineering team uses the vector SVG export to automatically document database layouts on GitHub READMEs. Best developer tool I've used this year."
            </p>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#10b981] to-[#3b82f6] flex items-center justify-center text-[10px] font-bold text-white">
                MR
              </div>
              <div>
                <strong className="text-xs text-white block">Markus R.</strong>
                <span className="text-[10px] text-[#71717a]">CTO @ StackLaunch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="px-[6%] py-20 border-t border-white/8 relative z-10">
        <div className="text-center mb-10">
          <span className="text-[10px] text-[#06b6d4] font-bold tracking-widest uppercase">Pricing</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">Developer-Friendly Plans</h2>
          <p className="text-xs text-[#a1a1aa] mt-2">Start drafting visual models for free. Upgrade to unlock advanced features.</p>
          
          {/* Monthly / Yearly Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-xs font-semibold ${billingPeriod === "monthly" ? "text-white" : "text-[#71717a]"}`}>Monthly</span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
              className="w-10 h-6 bg-white/10 hover:bg-white/15 rounded-full p-0.5 transition-all flex items-center cursor-pointer border border-white/5"
            >
              <div className={`w-4-5 h-4-5 bg-[#06b6d4] rounded-full shadow-md transition-all ${
                billingPeriod === "yearly" ? "translate-x-4" : "translate-x-0"
              }`} style={{ width: "18px", height: "18px" }}></div>
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingPeriod === "yearly" ? "text-white" : "text-[#71717a]"}`}>
              Yearly <span className="bg-[#06b6d4]/10 text-[#06b6d4] text-[9px] font-bold px-1.5 py-0.5 rounded-full">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto items-stretch">
          
          {/* Hobby */}
          <div className="bg-[#121214]/60 border border-white/8 rounded-xl p-8 text-left flex flex-col justify-between backdrop-blur-md">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Hobby Plan</h3>
              <div className="font-sans font-extrabold text-3xl mb-1 text-white">€0<span className="text-[10px] text-[#71717a] font-normal">/mo</span></div>
              <p className="text-[10px] text-[#71717a] mb-5">Start modeling databases</p>
              <ul className="text-xs text-[#a1a1aa] space-y-2 mb-8">
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Design up to 3 SQL Tables</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Raw SQL DDL Code exports</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Local JSON schema saving</li>
              </ul>
            </div>
            <button
              onClick={() => onLaunchConsole("free")}
              className="w-full py-2 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded-md text-xs font-semibold text-[#f4f4f5] cursor-pointer transition-all"
            >
              Start Free Workspace
            </button>
          </div>

          {/* Pro */}
          <div className="bg-[#121214]/60 border border-[#06b6d4] shadow-[0_0_24px_rgba(6,182,212,0.06)] rounded-xl p-8 text-left flex flex-col justify-between backdrop-blur-md relative">
            <span className="absolute top-4 right-6 bg-[#06b6d4] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">POPULAR</span>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Pro Plan</h3>
              <div className="font-sans font-extrabold text-3xl mb-1 text-white">
                €{billingPeriod === "monthly" ? "12" : "9"}
                <span className="text-[10px] text-[#71717a] font-normal">/mo</span>
              </div>
              <p className="text-[10px] text-[#71717a] mb-5">Perfect for indie hackers & builders</p>
              <ul className="text-xs text-[#a1a1aa] space-y-2 mb-8">
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Create Unlimited Tables</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> SQL + Prisma ORM Code generators</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Mongoose MongoDB models exporter</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> High-quality vector SVG exports</li>
              </ul>
            </div>
            <button
              onClick={() => onLaunchConsole("pro")}
              className="w-full py-2 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white rounded-md text-xs font-semibold cursor-pointer transition-all"
            >
              Select Pro Subscription
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-[#121214]/60 border border-white/8 rounded-xl p-8 text-left flex flex-col justify-between backdrop-blur-md">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Enterprise Plan</h3>
              <div className="font-sans font-extrabold text-3xl mb-1 text-white">
                €{billingPeriod === "monthly" ? "29" : "23"}
                <span className="text-[10px] text-[#71717a] font-normal">/mo</span>
              </div>
              <p className="text-[10px] text-[#71717a] mb-5">For team collaboration & complex setups</p>
              <ul className="text-xs text-[#a1a1aa] space-y-2 mb-8">
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Unlimited visual tables & canvases</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> All code generators + DBML markup</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Collaborative team workspace link</li>
                <li className="flex items-center gap-2"><span className="text-[#06b6d4] font-bold">✓</span> Priority Slack support channels</li>
              </ul>
            </div>
            <button
              onClick={() => onLaunchConsole("enterprise")}
              className="w-full py-2 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded-md text-xs font-semibold text-[#f4f4f5] cursor-pointer transition-all"
            >
              Select Enterprise Plan
            </button>
          </div>

        </div>
      </section>

      {/* COLLAPSIBLE FAQ SECTION */}
      <section className="px-[6%] py-16 border-t border-white/8 bg-white/1 relative z-10">
        <div className="text-center mb-12">
          <span className="text-[10px] text-[#06b6d4] font-bold tracking-widest uppercase">FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-[760px] mx-auto flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className="bg-[#111113]/70 border border-white/8 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center text-sm font-semibold text-white cursor-pointer hover:bg-white/2 transition-all outline-none"
                >
                  <span>{faq.question}</span>
                  <span className={`text-[#06b6d4] text-lg font-bold transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-[#a1a1aa] leading-relaxed border-t border-white/2 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION BLOCK */}
      <section className="px-5 py-20 text-center max-w-[800px] mx-auto z-10 relative">
        <div className="bg-[#121214]/85 border border-white/8 rounded-2xl p-8 sm:p-12 backdrop-blur-md shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Start Structuring Databases Instantly</h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed mb-8 max-w-[560px] mx-auto">
            Design schema visual models, export ORM models, and collaborate with your development team today. No database setup needed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <input
              type="email"
              placeholder="Enter your work email"
              className="bg-white/2 border border-white/8 rounded-lg px-4 py-2.5 text-xs text-[#f4f4f5] outline-none focus:border-[#06b6d4] focus:bg-white/5 transition-all w-full max-w-[280px]"
              defaultValue="developer@company.com"
            />
            <button
              onClick={() => onLaunchConsole("pro")}
              className="px-6 py-2.5 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] hover:shadow-[0_4px_12px_rgba(6,182,212,0.25)] text-white rounded-lg text-xs font-semibold cursor-pointer transition-all"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/8 text-center bg-black/10 relative z-10">
        <div className="max-w-[960px] mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8 text-left mb-10">
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-3.5">Product</h4>
            <ul className="text-xs text-[#71717a] space-y-2">
              <li><a href="#playground" className="hover:text-white transition-all">Interactive Playground</a></li>
              <li><a href="#features" className="hover:text-white transition-all">Core Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-all">Subscription Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-3.5">Resources</h4>
            <ul className="text-xs text-[#71717a] space-y-2">
              <li><a href="https://dbdiagram.io" target="_blank" className="hover:text-white transition-all">DBML Specs</a></li>
              <li><a href="https://prisma.io" target="_blank" className="hover:text-white transition-all">Prisma Docs</a></li>
              <li><a href="https://mongoosejs.com" target="_blank" className="hover:text-white transition-all">Mongoose Specs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-3.5">Company</h4>
            <ul className="text-xs text-[#71717a] space-y-2">
              <li><a href="https://acquire.com" target="_blank" className="hover:text-white transition-all">Acquire.com Startup</a></li>
              <li><a href="https://github.com" target="_blank" className="hover:text-white transition-all">GitHub Organization</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-all">Wall of Love</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-3.5">Legal</h4>
            <ul className="text-xs text-[#71717a] space-y-2">
              <li><span className="hover:text-white transition-all cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-all cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-[#06b6d4] transition-all cursor-pointer font-semibold text-[#06b6d4]">Acquisition Deal</span></li>
            </ul>
          </div>
        </div>
        <p className="text-[10px] text-[#71717a] px-5">&copy; 2026 SchemaFlow Database visual modeler. All rights reserved. Valuation optimized for profitable exit.</p>
      </footer>
    </div>
  );
}
