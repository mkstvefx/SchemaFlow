import React, { useState, useRef } from "react";
import TableModal from "./TableModal";
import StripeModal from "./StripeModal";
import {
  compileSqlSchema,
  compilePrismaSchema,
  compileMongooseSchema,
  compileDbmlSchema
} from "../utils/exporters";

const TEMPLATE_SCHEMAS = {
  billing: [
    {
      id: "tbl-users",
      name: "users",
      x: 80,
      y: 120,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "email", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "joined_at", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "tbl-subscriptions",
      name: "subscriptions",
      x: 360,
      y: 60,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "user_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "tbl-users.id" },
        { name: "plan_tier", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "status", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "ends_at", type: "timestamp", pk: false, nn: false, uq: false, fkTarget: null }
      ]
    },
    {
      id: "tbl-invoices",
      name: "invoices",
      x: 640,
      y: 160,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "subscription_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "tbl-subscriptions.id" },
        { name: "amount", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "is_paid", type: "boolean", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "billing_date", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    }
  ],
  ecommerce: [
    {
      id: "tbl-customers",
      name: "customers",
      x: 60,
      y: 120,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "full_name", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "email", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null }
      ]
    },
    {
      id: "tbl-products",
      name: "products",
      x: 340,
      y: 300,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "title", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "price", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "stock_count", type: "integer", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "tbl-orders",
      name: "orders",
      x: 340,
      y: 50,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "customer_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "tbl-customers.id" },
        { name: "order_date", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "total_amount", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "tbl-order-items",
      name: "order_items",
      x: 620,
      y: 180,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "order_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "tbl-orders.id" },
        { name: "product_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "tbl-products.id" },
        { name: "quantity", type: "integer", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "price", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    }
  ],
  social: [
    {
      id: "tbl-social-users",
      name: "users",
      x: 80,
      y: 150,
      columns: [
        { name: "id", type: "integer", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "username", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "avatar_url", type: "varchar", pk: false, nn: false, uq: false, fkTarget: null }
      ]
    },
    {
      id: "tbl-posts",
      name: "posts",
      x: 360,
      y: 60,
      columns: [
        { name: "id", type: "integer", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "author_id", type: "integer", pk: false, nn: true, uq: false, fkTarget: "tbl-social-users.id" },
        { name: "body", type: "text", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "posted_at", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "tbl-comments",
      name: "comments",
      x: 640,
      y: 160,
      columns: [
        { name: "id", type: "integer", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "post_id", type: "integer", pk: false, nn: true, uq: false, fkTarget: "tbl-posts.id" },
        { name: "commenter_id", type: "integer", pk: false, nn: true, uq: false, fkTarget: "tbl-social-users.id" },
        { name: "content", type: "text", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    }
  ]
};

export default function DesignerConsole({ tier, onChangeTier, onExit }) {
  const [tables, setTables] = useState(TEMPLATE_SCHEMAS.billing);
  const [selectedTableId, setSelectedTableId] = useState("tbl-users");
  const [activeExporterTab, setActiveExporterTab] = useState("sql");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [editTableId, setEditTableId] = useState(null);
  const [stripeModalTier, setStripeModalTier] = useState("pro");

  const fileInputRef = useRef(null);

  // Load a preset template
  const handleLoadTemplate = (key) => {
    if (TEMPLATE_SCHEMAS[key]) {
      setTables(JSON.parse(JSON.stringify(TEMPLATE_SCHEMAS[key])));
      setSelectedTableId(TEMPLATE_SCHEMAS[key][0].id);
    }
  };

  // Drag and drop card tracking logic
  const handleMouseDown = (tableId, e) => {
    if (e.target.closest("button")) return; // skip when clicking buttons
    setSelectedTableId(tableId);

    const tbl = tables.find(t => t.id === tableId);
    if (!tbl) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const offsetX = tbl.x;
    const offsetY = tbl.y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      setTables(prev => prev.map(t => {
        if (t.id === tableId) {
          return {
            ...t,
            x: Math.max(0, Math.min(2200, offsetX + dx)),
            y: Math.max(0, Math.min(1700, offsetY + dy))
          };
        }
        return t;
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // SVG connector lines path coordinate calculation
  const renderRelationPaths = () => {
    const paths = [];
    tables.forEach(t => {
      t.columns.forEach((col, colIdx) => {
        if (col.fkTarget) {
          const [targetTblId, targetColName] = col.fkTarget.split(".");
          const targetTbl = tables.find(tbl => tbl.id === targetTblId);
          if (targetTbl) {
            const targetColIdx = targetTbl.columns.findIndex(c => c.name === targetColName);
            if (targetColIdx !== -1) {
              const isSourceLeft = t.x < targetTbl.x;

              const x1 = isSourceLeft ? t.x + 210 : t.x;
              const y1 = t.y + 34 + (colIdx * 30) + 15;

              const x2 = isSourceLeft ? targetTbl.x : targetTbl.x + 210;
              const y2 = targetTbl.y + 34 + (targetColIdx * 30) + 15;

              const dx = Math.abs(x2 - x1) * 0.4 + 10;
              const ctrlX1 = isSourceLeft ? x1 + dx : x1 - dx;
              const ctrlX2 = isSourceLeft ? x2 - dx : x2 + dx;

              paths.push(
                <path
                  key={`${t.id}-${col.name}-${targetTbl.id}`}
                  d={`M ${x1} ${y1} C ${ctrlX1} ${y1}, ${ctrlX2} ${y2}, ${x2} ${y2}`}
                  className="relation-line"
                  markerEnd="url(#arrow)"
                />
              );
            }
          }
        }
      });
    });
    return paths;
  };

  // Add or Edit Table Action saves
  const handleSaveTable = (savedTable) => {
    const exists = tables.some(t => t.id === savedTable.id);
    if (exists) {
      setTables(tables.map(t => {
        if (t.id === savedTable.id) {
          return {
            ...t,
            name: savedTable.name,
            columns: savedTable.columns
          };
        }
        return t;
      }));
    } else {
      setTables([
        ...tables,
        {
          ...savedTable,
          x: 150 + (tables.length * 30),
          y: 120 + (tables.length * 30)
        }
      ]);
      setSelectedTableId(savedTable.id);
    }
  };

  const handleDeleteTable = (id) => {
    if (!confirm("Are you sure you want to delete this table? Foreign key links referencing it will be invalidated.")) return;

    setTables(prev => {
      const filtered = prev.filter(t => t.id !== id);
      // clean references
      filtered.forEach(t => {
        t.columns.forEach(c => {
          if (c.fkTarget && c.fkTarget.startsWith(id + ".")) {
            c.fkTarget = null;
          }
        });
      });
      return filtered;
    });

    if (selectedTableId === id) {
      setSelectedTableId(tables.length > 1 ? tables[0].id : null);
    }
  };

  // File Operations: JSON Import/Export
  const handleJsonDownload = () => {
    const filename = `schemaflow-model-${Date.now()}.json`;
    const payload = JSON.stringify({ activeTier: tier, tables }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleJsonImportClick = () => {
    fileInputRef.current.click();
  };

  const handleJsonImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data.tables)) {
          setTables(data.tables);
          if (data.activeTier) onChangeTier(data.activeTier);
          setSelectedTableId(data.tables.length > 0 ? data.tables[0].id : null);
          alert("Database schema layout imported successfully!");
        } else {
          alert("Invalid schema file format.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // SVG Diagram Downloader
  const handleSvgDownload = () => {
    if (tier === "free") {
      alert("SVG Map Exports are only available on Pro or Enterprise plans. Please upgrade.");
      setActiveExporterTab("billing");
      return;
    }

    let width = 0;
    let height = 0;
    tables.forEach(t => {
      if (t.x + 220 > width) width = t.x + 220;
      if (t.y + 200 > height) height = t.y + 200;
    });

    width = Math.max(width + 100, 800);
    height = Math.max(height + 100, 600);

    let tablesSvgHtml = "";
    tables.forEach(t => {
      const cardH = 34 + (t.columns.length * 30);
      tablesSvgHtml += `
        <g transform="translate(${t.x}, ${t.y})">
          <rect width="210" height="${cardH}" rx="8" fill="#121216" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
          <rect width="210" height="34" rx="8" fill="rgba(255,255,255,0.02)" />
          <line x1="0" y1="34" x2="210" y2="34" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
          <text x="14" y="21" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="12">${t.name}</text>
      `;

      t.columns.forEach((col, idx) => {
        const yOffset = 34 + (idx * 30) + 18;
        const icon = col.pk ? "🔑 " : (col.fkTarget ? "🔗 " : "");
        tablesSvgHtml += `
          <text x="14" y="${yOffset}" fill="rgba(255,255,255,0.8)" font-family="sans-serif" font-size="11">${icon}${col.name}</text>
          <text x="196" y="${yOffset}" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="10" text-anchor="end">${col.type}</text>
        `;
      });
      tablesSvgHtml += `</g>`;
    });

    // Capture connection paths rendered as standard XML
    let pathsHtml = "";
    tables.forEach(t => {
      t.columns.forEach((col, colIdx) => {
        if (col.fkTarget) {
          const [targetTblId, targetColName] = col.fkTarget.split(".");
          const targetTbl = tables.find(tbl => tbl.id === targetTblId);
          if (targetTbl) {
            const targetColIdx = targetTbl.columns.findIndex(c => c.name === targetColName);
            if (targetColIdx !== -1) {
              const isSourceLeft = t.x < targetTbl.x;
              const x1 = isSourceLeft ? t.x + 210 : t.x;
              const y1 = t.y + 34 + (colIdx * 30) + 15;
              const x2 = isSourceLeft ? targetTbl.x : targetTbl.x + 210;
              const y2 = targetTbl.y + 34 + (targetColIdx * 30) + 15;
              const dx = Math.abs(x2 - x1) * 0.4 + 10;
              const ctrlX1 = isSourceLeft ? x1 + dx : x1 - dx;
              const ctrlX2 = isSourceLeft ? x2 - dx : x2 + dx;
              pathsHtml += `<path d="M ${x1} ${y1} C ${ctrlX1} ${y1}, ${ctrlX2} ${y2}, ${x2} ${y2}" stroke="#06b6d4" stroke-width="2.2" fill="none" />`;
            }
          }
        }
      });
    });

    const fullSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#09090b" />
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
    </marker>
  </defs>
  <g>${pathsHtml}</g>
  <g>${tablesSvgHtml}</g>
</svg>
    `.trim();

    const blob = new Blob([fullSvg], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `schemaflow-model-${Date.now()}.svg`;
    link.click();
  };

  // Compile active tab codes
  let activeCode = "";
  let codeLangLabel = "SQL Code";
  if (activeExporterTab === "sql") {
    activeCode = compileSqlSchema(tables);
    codeLangLabel = "SQL DDL Script (PostgreSQL/MySQL)";
  } else if (activeExporterTab === "prisma") {
    activeCode = compilePrismaSchema(tables);
    codeLangLabel = "Prisma Schema Model File (schema.prisma)";
  } else if (activeExporterTab === "mongoose") {
    activeCode = compileMongooseSchema(tables);
    codeLangLabel = "Mongoose MongoDB Schema models (ES6 JS)";
  } else if (activeExporterTab === "dbml") {
    activeCode = compileDbmlSchema(tables);
    codeLangLabel = "Database Markup Language Model (dbdiagram.io)";
  }

  // Sidebar Limits calculator
  const maxLimit = tier === "free" ? 3 : 9999;
  const pct = (tables.length / maxLimit) * 100;
  const limitsLabel = tier === "free" ? `${tables.length} / 3 Tables` : `${tables.length} Tables (Unlimited)`;

  const openCreateModal = () => {
    if (tier === "free" && tables.length >= 3) {
      alert("Table limit reached on Free plan (3 tables). Please upgrade to Pro.");
      return;
    }
    setEditTableId(null);
    setIsTableModalOpen(true);
  };

  const openEditModal = (id) => {
    setEditTableId(id);
    setIsTableModalOpen(true);
  };

  const openStripe = (tierKey) => {
    setStripeModalTier(tierKey);
    setIsStripeModalOpen(true);
  };

  return (
    <div id="dashboard-app" className="w-full min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr] bg-[#09090b]">
      
      {/* Sidebar Layout */}
      <aside className="bg-[#0b0b0d] border-r border-white/8 p-5 flex flex-col gap-5 max-h-screen overflow-y-auto">
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

        <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider mt-2.5">
          Database Templates
        </div>
        <div className="flex flex-col gap-1.5">
          <button className="px-3 py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-xs font-semibold text-white cursor-pointer text-left w-full transition-all" onClick={() => handleLoadTemplate("billing")}>
            💳 SaaS Billing Schema
          </button>
          <button className="px-3 py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-xs font-semibold text-white cursor-pointer text-left w-full transition-all" onClick={() => handleLoadTemplate("ecommerce")}>
            🛒 E-Commerce Shop Schema
          </button>
          <button className="px-3 py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-xs font-semibold text-white cursor-pointer text-left w-full transition-all" onClick={() => handleLoadTemplate("social")}>
            💬 Social Network Schema
          </button>
        </div>

        <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider mt-2.5">
          Schema Controls
        </div>
        <div className="flex flex-col gap-1.5">
          <button className="px-3 py-1.5 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white rounded text-xs font-semibold cursor-pointer w-full transition-all" onClick={openCreateModal}>
            + Create Table
          </button>
          <button className="px-3 py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-xs font-semibold text-white cursor-pointer text-left w-full transition-all" onClick={handleJsonDownload}>
            💾 Export JSON Schema
          </button>
          <button className="px-3 py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-xs font-semibold text-white cursor-pointer text-left w-full transition-all" onClick={handleJsonImportClick}>
            📤 Import JSON Schema
          </button>
          <input type="file" ref={fileInputRef} style={{ display: "none" }} accept=".json" onChange={handleJsonImport} />
          <button className="px-3 py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-xs font-semibold text-white cursor-pointer text-left w-full transition-all" onClick={handleSvgDownload}>
            🖼️ Export SVG Diagram
          </button>
        </div>

        <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider mt-2.5">
          Schema Tables
        </div>
        <div className="flex flex-col gap-1 flex-grow overflow-y-auto">
          {tables.length === 0 ? (
            <span className="text-[10px] text-[#71717a]">No active tables.</span>
          ) : (
            tables.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTableId(t.id)}
                className={`flex justify-between items-center px-2.5 py-1.5 rounded border border-transparent cursor-pointer text-xs transition-all ${
                  selectedTableId === t.id ? "bg-[#06b6d4]/8 border-[#06b6d4]/15 text-white" : "bg-white/1 hover:bg-white/3 hover:border-white/8 text-[#a1a1aa]"
                }`}
              >
                <span className="font-medium truncate">{t.name}</span>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 md:opacity-100">
                  <button className="text-[10px] text-[#71717a] hover:text-white transition-all cursor-pointer" onClick={(e) => { e.stopPropagation(); openEditModal(t.id); }}>✏️</button>
                  <button className="text-[10px] text-[#71717a] hover:text-white transition-all cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDeleteTable(t.id); }}>❌</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stripe Upgrade sidebar widget */}
        <div className="bg-white/2 border border-white/8 rounded-lg p-3 mt-auto">
          <div className="flex justify-between text-[10px] font-semibold mb-1.5 text-white">
            <span>Table Usage Allocation</span>
            <span>{limitsLabel}</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-1.5">
            <div className="h-full bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6]" style={{ width: `${Math.min(pct, 100)}%` }}></div>
          </div>
          <p className="text-[9px] text-[#71717a] mb-2">{tier === "free" ? "Upgrade to Pro (Unlimited tables)" : "All limits unlocked!"}</p>
          <button
            onClick={() => setActiveExporterTab("billing")}
            className="w-full py-1.5 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white rounded text-[10px] font-semibold cursor-pointer transition-all"
          >
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* Main Workspace split */}
      <main className="grid grid-cols-1 xl:grid-cols-[1fr_380px] h-screen overflow-hidden">
        
        {/* Canvas Area */}
        <div id="canvas-viewport-container" className="relative h-full overflow-auto canvas-grid-bg">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-5">
            <span className="text-[10px] text-[#71717a] bg-[#09090b]/75 px-2.5 py-1 border border-white/8 rounded-full">
              Drag headers to move tables. Double-click card to edit structure.
            </span>
            <span className={`pointer-events-auto text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-transparent ${
              tier === 'free' ? 'bg-[#8b5cf6]/12 border-[#8b5cf6]/25 text-[#a78bfa]' : 'bg-[#06b6d4]/12 border-[#06b6d4]/25 text-[#22d3ee]'
            }`}>
              {tier === 'free' ? 'Hobby Plan' : tier === 'pro' ? 'Pro Plan' : 'Enterprise'}
            </span>
          </div>

          <div className="w-[2500px] h-[2000px] relative">
            {/* SVG Link lines overlay */}
            <svg id="canvas-svg-overlay" className="absolute inset-0 w-full h-full pointer-events-none z-1">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
                </marker>
              </defs>
              {renderRelationPaths()}
            </svg>

            {/* Draggable table cards */}
            {tables.map(t => {
              const cardH = 34 + (t.columns.length * 30);
              return (
                <div
                  key={t.id}
                  id={t.id}
                  style={{ left: `${t.x}px`, top: `${t.y}px`, height: `${cardH}px` }}
                  className={`absolute w-[210px] bg-[#121216]/85 border rounded-lg overflow-hidden backdrop-blur-md shadow-lg z-2 transition-colors select-none ${
                    selectedTableId === t.id ? "border-[#06b6d4] shadow-[0_0_20px_rgba(6,182,212,0.15)] z-3" : "border-white/8 hover:border-white/15"
                  }`}
                  onMouseDown={(e) => handleMouseDown(t.id, e)}
                  onDoubleClick={() => openEditModal(t.id)}
                >
                  <div className="bg-white/2 border-b border-white/8 px-3.5 py-2 flex justify-between items-center cursor-grab active:cursor-grabbing">
                    <span className="font-bold text-xs text-white">{t.name}</span>
                    <div className="flex gap-1.5">
                      <button className="text-[10px] text-[#71717a] hover:text-white transition-all cursor-pointer" onClick={(e) => { e.stopPropagation(); openEditModal(t.id); }}>✏️</button>
                      <button className="text-[10px] text-[#71717a] hover:text-white transition-all cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDeleteTable(t.id); }}>❌</button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    {t.columns.map(col => {
                      let keyIcon = null;
                      if (col.pk) keyIcon = <span className="text-[10px] opacity-85" title="Primary Key">🔑</span>;
                      else if (col.fkTarget) keyIcon = <span className="text-[10px] opacity-85" title="Foreign Key">🔗</span>;

                      return (
                        <div
                          key={col.name}
                          id={`col-row-${t.id}-${col.name}`}
                          className="px-3.5 py-2 text-xs border-b border-white/1 last:border-none flex justify-between items-center text-[#a1a1aa]"
                        >
                          <div className="flex items-center gap-1.5">
                            {keyIcon}
                            <span className="font-semibold">{col.name}</span>
                          </div>
                          <span className="text-[10px] text-[#71717a] font-mono">{col.type}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Exporter console */}
        <div className="bg-[#0b0b0d] border-l border-white/8 flex flex-col h-full">
          <div className="flex border-b border-white/8 bg-white/1 overflow-x-auto">
            <button className={`flex-1 font-semibold text-[10px] py-3 text-center cursor-pointer transition-all border-b-2 ${
              activeExporterTab === 'sql' ? "color-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/3 text-[#06b6d4]" : "text-[#71717a] hover:text-[#f4f4f5] border-b-transparent"
            }`} onClick={() => setActiveExporterTab("sql")}>SQL DDL</button>
            <button className={`flex-1 font-semibold text-[10px] py-3 text-center cursor-pointer transition-all border-b-2 ${
              activeExporterTab === 'prisma' ? "color-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/3 text-[#06b6d4]" : "text-[#71717a] hover:text-[#f4f4f5] border-b-transparent"
            }`} onClick={() => setActiveExporterTab("prisma")}>Prisma</button>
            <button className={`flex-1 font-semibold text-[10px] py-3 text-center cursor-pointer transition-all border-b-2 ${
              activeExporterTab === 'mongoose' ? "color-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/3 text-[#06b6d4]" : "text-[#71717a] hover:text-[#f4f4f5] border-b-transparent"
            }`} onClick={() => setActiveExporterTab("mongoose")}>Mongoose</button>
            <button className={`flex-1 font-semibold text-[10px] py-3 text-center cursor-pointer transition-all border-b-2 ${
              activeExporterTab === 'dbml' ? "color-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/3 text-[#06b6d4]" : "text-[#71717a] hover:text-[#f4f4f5] border-b-transparent"
            }`} onClick={() => setActiveExporterTab("dbml")}>DBML</button>
            <button className={`flex-1 font-semibold text-[10px] py-3 text-center cursor-pointer transition-all border-b-2 ${
              activeExporterTab === 'billing' ? "color-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/3 text-[#06b6d4]" : "text-[#71717a] hover:text-[#f4f4f5] border-b-transparent"
            }`} onClick={() => setActiveExporterTab("billing")}>💳 Billing</button>
          </div>

          <div className="flex-grow overflow-hidden relative">
            {activeExporterTab !== "billing" ? (
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center px-5 py-3 bg-black/15 border-b border-white/8">
                  <span className="text-[10px] text-[#a1a1aa] font-semibold">{codeLangLabel}</span>
                  <button
                    className="px-2.5 py-1 bg-white/2 border border-white/8 hover:bg-white/5 rounded text-[10px] font-semibold text-white transition-all cursor-pointer"
                    onClick={() => { navigator.clipboard.writeText(activeCode); alert("Code copied to clipboard!"); }}
                  >
                    Copy Code
                  </button>
                </div>
                <pre className="flex-grow p-5 overflow-auto bg-[#070708] margin-0 text-[11px] leading-relaxed text-[#a5f3fc] font-mono select-text">
                  <code>{activeCode}</code>
                </pre>
              </div>
            ) : (
              <div className="h-full overflow-y-auto p-5 space-y-5">
                <div className="bg-gradient-to-r from-white/2 to-white/1 border border-white/8 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-white mb-1">Plan Subscriptions</h3>
                  <p className="text-[10px] text-[#71717a]">Modify allocations to configure workspace restrictions.</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <span className="text-[9px] text-[#71717a] uppercase block">Active Plan</span>
                      <strong className="text-sm text-white font-bold">{tier === "free" ? "Hobby Plan" : tier === "pro" ? "Pro Plan" : "Enterprise"}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#71717a] uppercase block">Model Tables</span>
                      <strong className="text-sm text-white font-bold">{tables.length} tables</strong>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className={`p-4 border rounded-xl flex flex-col gap-2 transition-all ${tier === 'free' ? 'border-[#06b6d4] bg-[#06b6d4]/2' : 'border-white/8'}`}>
                    <div className="flex justify-between items-center">
                      <strong className="text-xs text-white">Hobby Plan</strong>
                      <span className="text-xs font-bold text-[#06b6d4]">€0/mo</span>
                    </div>
                    <p className="text-[10px] text-[#a1a1aa] leading-normal">Design up to 3 relational tables. Standard SQL DDL exports.</p>
                    <button className="w-full py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-[10px] font-semibold text-white cursor-pointer transition-all" onClick={() => openStripe("free")}>Select Hobby</button>
                  </div>

                  <div className={`p-4 border rounded-xl flex flex-col gap-2 transition-all ${tier === 'pro' ? 'border-[#06b6d4] bg-[#06b6d4]/2' : 'border-white/8'}`}>
                    <div className="flex justify-between items-center">
                      <strong className="text-xs text-white">Pro Plan</strong>
                      <span className="text-xs font-bold text-[#06b6d4]">€12/mo</span>
                    </div>
                    <p className="text-[10px] text-[#a1a1aa] leading-normal">Unlimited tables, Prisma/Mongoose generation models, SVG map downloads.</p>
                    <button className="w-full py-1.5 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white rounded text-[10px] font-semibold cursor-pointer transition-all" onClick={() => openStripe("pro")}>Select Pro</button>
                  </div>

                  <div className={`p-4 border rounded-xl flex flex-col gap-2 transition-all ${tier === 'enterprise' ? 'border-[#06b6d4] bg-[#06b6d4]/2' : 'border-white/8'}`}>
                    <div className="flex justify-between items-center">
                      <strong className="text-xs text-white">Enterprise Plan</strong>
                      <span className="text-xs font-bold text-[#06b6d4]">€29/mo</span>
                    </div>
                    <p className="text-[10px] text-[#a1a1aa] leading-normal">Unlimited layouts, DBML exports, team collaboration channels.</p>
                    <button className="w-full py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-[10px] font-semibold text-white cursor-pointer transition-all" onClick={() => openStripe("enterprise")}>Select Enterprise</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Overlays Modals Dialogs */}
      <TableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        tableId={editTableId}
        tables={tables}
        onSave={handleSaveTable}
      />

      <StripeModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        tierKey={stripeModalTier}
        onPaymentSuccess={onChangeTier}
      />
    </div>
  );
}
