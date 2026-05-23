import React, { useState, useEffect } from "react";

const DATA_TYPES = ["uuid", "serial", "integer", "varchar", "text", "decimal", "boolean", "timestamp", "json"];

export default function TableModal({ isOpen, onClose, tableId, tables, onSave }) {
  const [name, setName] = useState("");
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (tableId) {
        // Edit Mode
        const t = tables.find(item => item.id === tableId);
        if (t) {
          setName(t.name);
          setColumns(JSON.parse(JSON.stringify(t.columns)));
        }
      } else {
        // Create Mode
        setName("");
        setColumns([
          { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null }
        ]);
      }
    }
  }, [isOpen, tableId, tables]);

  if (!isOpen) return null;

  const handleAddColumn = () => {
    setColumns([
      ...columns,
      { name: "", type: "varchar", pk: false, nn: false, uq: false, fkTarget: null }
    ]);
  };

  const handleRemoveColumn = (index) => {
    setColumns(columns.filter((_, idx) => idx !== index));
  };

  const handleColumnChange = (index, field, value) => {
    const nextCols = [...columns];
    nextCols[index][field] = value;

    // Auto toggles if PK is checked
    if (field === "pk" && value === true) {
      nextCols[index].nn = true;
      nextCols[index].uq = true;
    }

    setColumns(nextCols);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!cleanName) {
      alert("Please enter a valid table name.");
      return;
    }

    // Filter out rows without name
    const validCols = columns.filter(c => c.name.trim().length > 0);
    if (validCols.length === 0) {
      alert("Please define at least one valid column.");
      return;
    }

    onSave({
      id: tableId || "tbl-" + Date.now(),
      name: cleanName,
      columns: validCols.map(c => ({
        ...c,
        name: c.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "")
      }))
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/82 backdrop-blur-[4px] z-[100] flex items-center justify-center p-4">
      <div className="bg-[#111113] border border-white/8 rounded-xl w-full max-w-[780px] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/8 flex justify-between items-center">
          <h3 className="text-base font-bold text-white">
            {tableId ? `Edit Table: ${name}` : "Create New Database Table"}
          </h3>
          <button className="text-white/50 hover:text-white text-xl cursor-pointer" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#a1a1aa]">Table Name</label>
              <input
                type="text"
                required
                placeholder="e.g. users"
                className="bg-white/2 border border-white/8 rounded-md px-3 py-2 text-sm text-[#f4f4f5] outline-none focus:border-[#06b6d4] focus:bg-white/5 focus:ring-3 focus:ring-[#06b6d4]/12 transition-all w-full"
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              />
            </div>

            <div className="mt-6 pt-4 border-t border-white/8">
              <div className="grid grid-cols-[140px_100px_35px_35px_35px_1fr_30px] gap-3 text-[10px] font-bold text-[#71717a] uppercase mb-2 px-1">
                <span>Field Name</span>
                <span>Data Type</span>
                <span className="text-center">PK</span>
                <span className="text-center">NN</span>
                <span className="text-center">UQ</span>
                <span>Relation Target</span>
                <span></span>
              </div>

              <div className="space-y-2">
                {columns.map((col, idx) => {
                  // Compile foreign key options
                  const fkOptions = [
                    <option key="none" value="">None</option>
                  ];
                  tables.forEach(tbl => {
                    // Exclude self reference
                    if (tbl.id !== tableId) {
                      tbl.columns.forEach(c => {
                        if (c.pk) {
                          const val = `${tbl.id}.${c.name}`;
                          const label = `${tbl.name}.${c.name}`;
                          fkOptions.push(
                            <option key={val} value={val}>{label}</option>
                          );
                        }
                      });
                    }
                  });

                  return (
                    <div key={idx} className="grid grid-cols-[140px_100px_35px_35px_35px_1fr_30px] gap-3 items-center bg-white/1 p-1.5 border border-white/3 rounded-md">
                      <input
                        type="text"
                        required
                        placeholder="column_name"
                        className="bg-white/2 border border-white/8 rounded-md px-2 py-1 text-xs text-[#f4f4f5] outline-none focus:border-[#06b6d4] transition-all"
                        value={col.name}
                        onChange={(e) => handleColumnChange(idx, "name", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      />

                      <select
                        className="bg-white/2 border border-white/8 rounded-md px-2 py-1 text-xs text-[#f4f4f5] outline-none focus:border-[#06b6d4] transition-all"
                        value={col.type}
                        onChange={(e) => handleColumnChange(idx, "type", e.target.value)}
                      >
                        {DATA_TYPES.map(t => (
                          <option key={t} value={t} className="bg-[#111113]">{t}</option>
                        ))}
                      </select>

                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 cursor-pointer justify-self-center accent-[#06b6d4]"
                        checked={col.pk}
                        onChange={(e) => handleColumnChange(idx, "pk", e.target.checked)}
                      />

                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 cursor-pointer justify-self-center accent-[#06b6d4]"
                        checked={col.nn}
                        onChange={(e) => handleColumnChange(idx, "nn", e.target.checked)}
                      />

                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 cursor-pointer justify-self-center accent-[#06b6d4]"
                        checked={col.uq}
                        onChange={(e) => handleColumnChange(idx, "uq", e.target.checked)}
                      />

                      <select
                        className="bg-white/2 border border-white/8 rounded-md px-2 py-1 text-xs text-[#f4f4f5] outline-none focus:border-[#06b6d4] transition-all"
                        value={col.fkTarget || ""}
                        onChange={(e) => handleColumnChange(idx, "fkTarget", e.target.value || null)}
                      >
                        {fkOptions}
                      </select>

                      <button
                        type="button"
                        className="text-red-500 hover:text-red-400 font-bold text-base cursor-pointer"
                        onClick={() => handleRemoveColumn(idx)}
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="mt-3 px-3 py-1.5 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded text-xs font-semibold text-white cursor-pointer transition-all"
                onClick={handleAddColumn}
              >
                + Add Column
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-white/8">
              <button
                type="button"
                className="px-4 py-2 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded-md text-xs font-semibold text-[#f4f4f5] cursor-pointer transition-all"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] hover:shadow-[0_4px_12px_rgba(6,182,212,0.25)] text-white rounded-md text-xs font-semibold cursor-pointer transition-all"
              >
                Save Table Schema
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
