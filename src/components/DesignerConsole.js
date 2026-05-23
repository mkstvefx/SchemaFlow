import React, { useState, useRef, useEffect } from "react";
import TableModal from "./TableModal";
import StripeModal from "./StripeModal";
import {
  compileSqlSchema,
  compilePrismaSchema,
  compileMongooseSchema,
  compileDbmlSchema
} from "../utils/exporters";
import { TEMPLATES_CATALOG } from "../utils/templatesCatalog";

export default function DesignerConsole({ tier, onChangeTier, onExit }) {
  const [tables, setTables] = useState(TEMPLATES_CATALOG.saas);
  const [selectedTableId, setSelectedTableId] = useState("tbl-users");
  const [activeExporterTab, setActiveExporterTab] = useState("sql");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [editTableId, setEditTableId] = useState(null);
  const [stripeModalTier, setStripeModalTier] = useState("pro");
  const [zoom, setZoom] = useState(1);

  // Terminal Emulator State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState([
    "SchemaFlow SQL Terminal Shell v1.0.2 - Interactive Database Simulator",
    "Type 'HELP' for a list of available mock SQL statements.",
    "Type 'TABLES' to see active schema targets.",
    ""
  ]);
  const [virtualDb, setVirtualDb] = useState({
    users: [
      { id: "usr_1001", email: "developer@schemaflow.io", plan: "pro" },
      { id: "usr_1002", email: "buyer@acquire.com", plan: "free" }
    ],
    payments: [
      { id: "pay_2001", user_id: "usr_1001", amount: "12.00" }
    ],
    listings: [
      { id: "list_3001", host_id: "usr_1001", title: "Sleek Glassmorphic Loft" }
    ]
  });

  const fileInputRef = useRef(null);

  // Sync virtual DB table properties when schema layout changes
  useEffect(() => {
    setVirtualDb(prev => {
      const nextDb = { ...prev };
      tables.forEach(t => {
        if (!nextDb[t.name]) {
          nextDb[t.name] = [];
        }
      });
      return nextDb;
    });
  }, [tables]);

  // Load a preset template
  const handleLoadTemplate = (key) => {
    if (TEMPLATES_CATALOG[key]) {
      setTables(JSON.parse(JSON.stringify(TEMPLATES_CATALOG[key])));
      setSelectedTableId(TEMPLATES_CATALOG[key][0].id);
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
            x: Math.max(0, Math.min(2200, offsetX + Math.round(dx / zoom))),
            y: Math.max(0, Math.min(1700, offsetY + Math.round(dy / zoom)))
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

  // Grid Auto-Layout function
  const handleAutoLayout = () => {
    const cols = 3;
    const colWidth = 280;
    const rowHeight = 220;

    setTables(prev => prev.map((t, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      return {
        ...t,
        x: 80 + col * colWidth,
        y: 80 + row * rowHeight
      };
    }));
  };

  // Compute Schema Diagnostics
  const totalColumns = tables.reduce((acc, t) => acc + t.columns.length, 0);
  const totalRelations = tables.reduce((acc, t) => {
    return acc + t.columns.filter(c => c.fkTarget).length;
  }, 0);

  const getInspectorIssues = () => {
    const issues = [];
    tables.forEach(t => {
      // Check if table has a primary key
      const hasPk = t.columns.some(c => c.pk);
      if (!hasPk) {
        issues.push({
          type: "warning",
          message: `Table "${t.name}" has no primary key.`
        });
      }

      // Check for broken foreign key references
      t.columns.forEach(col => {
        if (col.fkTarget) {
          const [targetTblId, targetColName] = col.fkTarget.split(".");
          const targetTbl = tables.find(tbl => tbl.id === targetTblId);
          if (!targetTbl) {
            issues.push({
              type: "error",
              message: `Column "${t.name}.${col.name}" has broken target table reference.`
            });
          } else {
            const targetCol = targetTbl.columns.find(c => c.name === targetColName);
            if (!targetCol) {
              issues.push({
                type: "error",
                message: `Column "${t.name}.${col.name}" has broken target column reference.`
              });
            }
          }
        }
      });
    });
    return issues;
  };

  const issues = getInspectorIssues();
  const healthScore = Math.max(0, 100 - (issues.filter(i => i.type === "error").length * 20) - (issues.filter(i => i.type === "warning").length * 10));

  // Schema Optimization Recommendations
  const getOptimizerRecommendations = () => {
    const list = [];
    tables.forEach(t => {
      // Audit columns
      const hasTimestamps = t.columns.some(c => c.name === "created_at" || c.name === "updated_at");
      if (!hasTimestamps) {
        list.push({
          type: "suggestion",
          title: `Add audit fields to "${t.name}"`,
          desc: "Audit tracking: Add 'created_at' and 'updated_at' timestamp fields to track records history."
        });
      }

      // PK check
      const hasPk = t.columns.some(c => c.pk);
      if (!hasPk) {
        list.push({
          type: "critical",
          title: `Add primary key to "${t.name}"`,
          desc: "Entity Integrity: Relational tables must have a primary key (e.g. 'id' serial or uuid) for indexing."
        });
      }

      // Indexes on FKs
      t.columns.forEach(col => {
        if (col.fkTarget) {
          list.push({
            type: "performance",
            title: `Create lookup index on "${t.name}.${col.name}"`,
            desc: `Query Speed: Add a B-Tree index on foreign key column "${col.name}" to speed up relational JOIN scans.`
          });
        }
      });

      // Text type heap size
      t.columns.forEach(col => {
        if (col.type === "text") {
          list.push({
            type: "performance",
            title: `Separate heavy text columns in "${t.name}"`,
            desc: `Heap Storage: Column "${col.name}" is type TEXT. If storing large payloads, consider separating it into an audit/details subtable.`
          });
        }
      });
    });

    if (list.length === 0) {
      list.push({
        type: "success",
        title: "All optimizations passed!",
        desc: "Your visual schema design follows industry standard normalizations and performance indexing rules."
      });
    }

    return list;
  };

  const recommendations = getOptimizerRecommendations();

  // Executing Virtual SQL Commands
  const handleExecuteTerminalCommand = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    const nextHistory = [...terminalHistory, `> ${cmd}`];
    const upperCmd = cmd.toUpperCase();

    if (upperCmd === "HELP") {
      nextHistory.push(
        "Supported Mock Queries:",
        "  - HELP : Display instructions.",
        "  - TABLES : List names of active tables in diagram schema.",
        "  - CLEAR : Wipe terminal console log history.",
        "  - SELECT * FROM [table] : Display active rows in a formatted table.",
        "  - INSERT INTO [table] (col1, col2) VALUES ('val1', 'val2') : Insert new row.",
        ""
      );
    } else if (upperCmd === "CLEAR") {
      setTerminalHistory([]);
      setTerminalInput("");
      return;
    } else if (upperCmd === "TABLES") {
      const names = tables.map(t => t.name);
      if (names.length === 0) {
        nextHistory.push("No active tables found. Create a table to target.", "");
      } else {
        nextHistory.push("Active Database Schema Targets:", ...names.map(n => `  - ${n}`), "");
      }
    } else if (upperCmd.startsWith("SELECT * FROM")) {
      const matches = cmd.match(/select\s+\*\s+from\s+([a-z0-9_]+)/i);
      if (matches && matches[1]) {
        const tblName = matches[1].toLowerCase();
        const records = virtualDb[tblName] || [];
        const tableSchema = tables.find(t => t.name === tblName);

        if (!tableSchema) {
          nextHistory.push(`Error: relation "${tblName}" does not exist in active schema.`, "");
        } else if (records.length === 0) {
          nextHistory.push(`(0 rows returned for table "${tblName}")`, "");
        } else {
          const cols = tableSchema.columns.map(c => c.name);
          const colWidths = {};
          cols.forEach(col => {
            colWidths[col] = col.length;
            records.forEach(row => {
              const valStr = String(row[col] !== undefined ? row[col] : "NULL");
              if (valStr.length > colWidths[col]) colWidths[col] = valStr.length;
            });
          });

          let separator = "+";
          let headerLine = "|";
          cols.forEach(col => {
            separator += "-".repeat(colWidths[col] + 2) + "+";
            headerLine += ` ${col.padEnd(colWidths[col])} |`;
          });

          const dataLines = [];
          records.forEach(row => {
            let dataLine = "|";
            cols.forEach(col => {
              const valStr = String(row[col] !== undefined ? row[col] : "NULL");
              dataLine += ` ${valStr.padEnd(colWidths[col])} |`;
            });
            dataLines.push(dataLine);
          });

          nextHistory.push(
            separator,
            headerLine,
            separator,
            ...dataLines,
            separator,
            `(${records.length} rows in set)`,
            ""
          );
        }
      } else {
        nextHistory.push("Error: Syntax error in SELECT query.", "");
      }
    } else if (upperCmd.startsWith("INSERT INTO")) {
      const matches = cmd.match(/insert\s+into\s+([a-z0-9_]+)\s*\(([^)]+)\)\s*values\s*\(([^)]+)\)/i);
      if (matches && matches[1] && matches[2] && matches[3]) {
        const tblName = matches[1].toLowerCase();
        const colString = matches[2];
        const valString = matches[3];

        const tableSchema = tables.find(t => t.name === tblName);
        if (!tableSchema) {
          nextHistory.push(`Error: relation "${tblName}" does not exist.`, "");
        } else {
          const cols = colString.split(",").map(s => s.trim().toLowerCase());
          const vals = valString.split(",").map(s => s.trim().replace(/^'|'$/g, "").replace(/^"|"$/g, ""));

          if (cols.length !== vals.length) {
            nextHistory.push("Error: Column count does not match values count.", "");
          } else {
            const newRow = {};
            tableSchema.columns.forEach(c => {
              newRow[c.name] = "NULL";
            });
            cols.forEach((col, idx) => {
              newRow[col] = vals[idx];
            });

            setVirtualDb(prev => ({
              ...prev,
              [tblName]: [...(prev[tblName] || []), newRow]
            }));

            nextHistory.push("INSERT 0 1. Row inserted successfully into memory database state.", "");
          }
        }
      } else {
        nextHistory.push("Error: Syntax error in INSERT statement. Use: INSERT INTO [table] (col1, col2) VALUES ('val1', 'val2')", "");
      }
    } else {
      nextHistory.push(`Error: Unknown SQL command: "${cmd}". Type HELP for details.`, "");
    }

    setTerminalHistory(nextHistory);
    setTerminalInput("");
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
    <div id="dashboard-app" className="w-full min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr] bg-[#09090b] select-none">
      
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
          <button className="px-3 py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-xs font-semibold text-white cursor-pointer text-left w-full transition-all" onClick={() => handleLoadTemplate("saas")}>
            💳 SaaS Core Billing
          </button>
          <button className="px-3 py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-xs font-semibold text-white cursor-pointer text-left w-full transition-all" onClick={() => handleLoadTemplate("airbnb")}>
            🏠 Airbnb Clone Schema
          </button>
          <button className="px-3 py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-xs font-semibold text-white cursor-pointer text-left w-full transition-all" onClick={() => handleLoadTemplate("uber")}>
            🚗 Uber Ride Schema
          </button>
          <button className="px-3 py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-xs font-semibold text-white cursor-pointer text-left w-full transition-all" onClick={() => handleLoadTemplate("jira")}>
            🎫 Jira Task Schema
          </button>
          <button className="px-3 py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-xs font-semibold text-white cursor-pointer text-left w-full transition-all" onClick={() => handleLoadTemplate("discord")}>
            💬 Discord Chat Schema
          </button>
        </div>

        <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider mt-2.5">
          Schema Controls
        </div>
        <div className="flex flex-col gap-1.5">
          <button className="px-3 py-1.5 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white rounded text-xs font-semibold cursor-pointer w-full transition-all" onClick={openCreateModal}>
            + Create Table
          </button>
          <button className="px-3 py-1.5 border border-[#06b6d4]/30 hover:border-[#06b6d4]/60 hover:bg-[#06b6d4]/5 rounded text-xs font-semibold text-[#22d3ee] cursor-pointer text-left w-full transition-all" onClick={handleAutoLayout}>
            ⚡ Auto-Arrange Layout
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

        {/* Diagnostics Widget */}
        <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider mt-2.5">
          Schema Diagnostics
        </div>
        <div className="bg-white/2 border border-white/8 rounded-lg p-3 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-semibold text-white">
            <span>Schema Health</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              healthScore >= 90 ? "bg-green-500/10 text-green-400" : healthScore >= 70 ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
            }`}>
              {healthScore}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center mt-1">
            <div className="bg-white/1 border border-white/3 rounded p-1">
              <span className="text-[8px] text-[#71717a] block">Tables</span>
              <strong className="text-xs text-white font-semibold">{tables.length}</strong>
            </div>
            <div className="bg-white/1 border border-white/3 rounded p-1">
              <span className="text-[8px] text-[#71717a] block">Fields</span>
              <strong className="text-xs text-white font-semibold">{totalColumns}</strong>
            </div>
            <div className="bg-white/1 border border-white/3 rounded p-1">
              <span className="text-[8px] text-[#71717a] block">Links</span>
              <strong className="text-xs text-white font-semibold">{totalRelations}</strong>
            </div>
          </div>

          {issues.length > 0 ? (
            <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto mt-1 border-t border-white/5 pt-1.5">
              {issues.map((iss, index) => (
                <div key={index} className="text-[9px] leading-normal flex gap-1 items-start text-[#a1a1aa]">
                  <span>{iss.type === "error" ? "❌" : "⚠️"}</span>
                  <span className="truncate" title={iss.message}>{iss.message}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[9px] text-green-400/80 flex gap-1 items-center justify-center mt-1 border-t border-white/5 pt-1.5">
              <span>✅</span> Clean schema configuration!
            </div>
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
      <main className="grid grid-cols-1 xl:grid-cols-[1fr_400px] h-screen overflow-hidden">
        
        {/* Canvas Area */}
        <div id="canvas-viewport-container" className="relative h-full overflow-auto canvas-grid-bg">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-5">
            <div className="flex gap-2 pointer-events-auto">
              <span className="text-[10px] text-[#a1a1aa] bg-[#09090b]/85 px-2.5 py-1 border border-white/8 rounded-full">
                Drag headers to move. Double-click to edit structure.
              </span>
              <a href="#docs" className="text-[10px] text-[#06b6d4] hover:text-white bg-[#06b6d4]/10 border border-[#06b6d4]/30 px-2.5 py-1 rounded-full transition-all">
                📖 Open Docs Center
              </a>
              <a href="#about" className="text-[10px] text-[#a855f7] hover:text-white bg-[#a855f7]/10 border border-[#a855f7]/30 px-2.5 py-1 rounded-full transition-all">
                ℹ️ About Us
              </a>
            </div>
            <span className={`pointer-events-auto text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-transparent ${
              tier === 'free' ? 'bg-[#8b5cf6]/12 border-[#8b5cf6]/25 text-[#a78bfa]' : 'bg-[#06b6d4]/12 border-[#06b6d4]/25 text-[#22d3ee]'
            }`}>
              {tier === 'free' ? 'Hobby Plan' : tier === 'pro' ? 'Pro Plan' : 'Enterprise'}
            </span>
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-6 left-6 flex items-center gap-1.5 bg-[#09090b]/80 border border-white/8 backdrop-blur-md px-2 py-1.5 rounded-lg z-10 pointer-events-auto">
            <button
              onClick={() => setZoom(prev => Math.max(0.4, +(prev - 0.1).toFixed(1)))}
              className="w-7 h-7 flex items-center justify-center border border-white/5 hover:border-white/16 hover:bg-white/5 text-white rounded text-sm cursor-pointer transition-all font-bold"
              title="Zoom Out"
            >
              -
            </button>
            <span className="text-[10px] font-bold text-white min-w-[40px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(2.0, +(prev + 0.1).toFixed(1)))}
              className="w-7 h-7 flex items-center justify-center border border-white/5 hover:border-white/16 hover:bg-white/5 text-white rounded text-sm cursor-pointer transition-all font-bold"
              title="Zoom In"
            >
              +
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
            <button
              onClick={() => setZoom(1)}
              className="px-2.5 py-1 bg-white/2 border border-white/8 hover:bg-white/5 rounded text-[10px] font-bold text-white transition-all cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div 
            className="w-[2500px] h-[2000px] relative"
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: "top left",
              transition: "transform 0.1s ease-out"
            }}
          >
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
            <button className={`flex-grow font-semibold text-[10px] py-3 text-center cursor-pointer transition-all border-b-2 px-2.5 ${
              activeExporterTab === 'sql' ? "color-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/3 text-[#06b6d4]" : "text-[#71717a] hover:text-[#f4f4f5] border-b-transparent"
            }`} onClick={() => setActiveExporterTab("sql")}>SQL DDL</button>
            <button className={`flex-grow font-semibold text-[10px] py-3 text-center cursor-pointer transition-all border-b-2 px-2.5 ${
              activeExporterTab === 'prisma' ? "color-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/3 text-[#06b6d4]" : "text-[#71717a] hover:text-[#f4f4f5] border-b-transparent"
            }`} onClick={() => setActiveExporterTab("prisma")}>Prisma</button>
            <button className={`flex-grow font-semibold text-[10px] py-3 text-center cursor-pointer transition-all border-b-2 px-2.5 ${
              activeExporterTab === 'mongoose' ? "color-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/3 text-[#06b6d4]" : "text-[#71717a] hover:text-[#f4f4f5] border-b-transparent"
            }`} onClick={() => setActiveExporterTab("mongoose")}>Mongoose</button>
            <button className={`flex-grow font-semibold text-[10px] py-3 text-center cursor-pointer transition-all border-b-2 px-2.5 ${
              activeExporterTab === 'dbml' ? "color-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/3 text-[#06b6d4]" : "text-[#71717a] hover:text-[#f4f4f5] border-b-transparent"
            }`} onClick={() => setActiveExporterTab("dbml")}>DBML</button>
            <button className={`flex-grow font-semibold text-[10px] py-3 text-center cursor-pointer transition-all border-b-2 px-2.5 ${
              activeExporterTab === 'optimizer' ? "color-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/3 text-[#06b6d4]" : "text-[#71717a] hover:text-[#f4f4f5] border-b-transparent"
            }`} onClick={() => setActiveExporterTab("optimizer")}>🩺 Optimize</button>
            <button className={`flex-grow font-semibold text-[10px] py-3 text-center cursor-pointer transition-all border-b-2 px-2.5 ${
              activeExporterTab === 'terminal' ? "color-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/3 text-[#06b6d4]" : "text-[#71717a] hover:text-[#f4f4f5] border-b-transparent"
            }`} onClick={() => setActiveExporterTab("terminal")}>💻 SQL Shell</button>
            <button className={`flex-grow font-semibold text-[10px] py-3 text-center cursor-pointer transition-all border-b-2 px-2.5 ${
              activeExporterTab === 'billing' ? "color-[#06b6d4] border-b-[#06b6d4] bg-[#06b6d4]/3 text-[#06b6d4]" : "text-[#71717a] hover:text-[#f4f4f5] border-b-transparent"
            }`} onClick={() => setActiveExporterTab("billing")}>💳 Billing</button>
          </div>

          <div className="flex-grow overflow-hidden relative">
            {activeExporterTab !== "billing" && activeExporterTab !== "optimizer" && activeExporterTab !== "terminal" ? (
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
            ) : activeExporterTab === "optimizer" ? (
              <div className="h-full overflow-y-auto p-5 space-y-4">
                <div className="bg-[#121214] border border-white/8 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-white mb-1">Database Optimization Inspector</h3>
                  <p className="text-[10px] text-[#71717a]">SchemaFlow checks your visual layout for structural efficiency, keys, and indexes.</p>
                </div>
                <div className="flex flex-col gap-3">
                  {recommendations.map((rec, rIdx) => (
                    <div key={rIdx} className="bg-white/2 border border-white/8 rounded-xl p-4 space-y-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-xs text-white font-bold">{rec.title}</strong>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                          rec.type === "critical" ? "bg-red-500/10 text-red-400" : rec.type === "performance" ? "bg-yellow-500/10 text-yellow-400" : rec.type === "success" ? "bg-green-500/10 text-green-400" : "bg-[#06b6d4]/10 text-[#06b6d4]"
                        }`}>{rec.type}</span>
                      </div>
                      <p className="text-[10px] text-[#a1a1aa] leading-normal">{rec.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeExporterTab === "terminal" ? (
              <div className="h-full flex flex-col bg-[#070708]">
                <div className="flex-grow p-5 overflow-auto font-mono text-[10px] sm:text-[11px] leading-relaxed text-[#00ffcc] space-y-2 select-text">
                  {terminalHistory.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap">{line}</div>
                  ))}
                </div>
                <form onSubmit={handleExecuteTerminalCommand} className="flex border-t border-white/8 bg-[#0a0a0c]">
                  <span className="p-3 font-mono text-[11px] text-[#00ffcc] select-none">&gt;</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Enter virtual query (e.g. SELECT * FROM users)..."
                    className="flex-grow p-3 bg-transparent border-none outline-none font-mono text-[11px] text-white"
                  />
                </form>
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
