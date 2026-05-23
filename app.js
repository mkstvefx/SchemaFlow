/* --- SchemaFlow Core Visual Designer Engine --- */

// --- 1. APPLICATION CONSTANTS & SEEDS ---
const DATA_TYPES = ["uuid", "serial", "integer", "varchar", "text", "decimal", "boolean", "timestamp", "json"];

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
                { name: "id", type: "serial", pk: true, nn: true, uq: true, fkTarget: null },
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
                { name: "id", type: "serial", pk: true, nn: true, uq: true, fkTarget: null },
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
                { name: "id", type: "serial", pk: true, nn: true, uq: true, fkTarget: null },
                { name: "post_id", type: "integer", pk: false, nn: true, uq: false, fkTarget: "tbl-posts.id" },
                { name: "commenter_id", type: "integer", pk: false, nn: true, uq: false, fkTarget: "tbl-social-users.id" },
                { name: "content", type: "text", pk: false, nn: true, uq: false, fkTarget: null }
            ]
        }
    ]
};

// --- 2. APPLICATION GLOBAL STATE ---
let state = {
    activeView: "landing",   // landing, app
    activeTier: "pro",       // free, pro, enterprise
    activeExporterTab: "sql",// sql, prisma, mongoose, dbml, billing
    tables: [],
    selectedTableId: null,
    
    // Drag-and-drop tracker state
    drag: {
        isDragging: false,
        tableId: null,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0
    },

    // Modal Builder dynamic row counter
    modalRows: []
};

// --- 3. INITIALIZATION & BOOTSTRAP ---
document.addEventListener("DOMContentLoaded", () => {
    // Check if location hash directs straight to the app
    if (window.location.hash === "#designer") {
        enterAppDashboard();
    } else {
        exitAppDashboard();
    }

    // Bind viewport scroll actions to redraw links
    const viewport = document.getElementById("canvas-viewport-container");
    if (viewport) {
        viewport.addEventListener("scroll", drawRelations);
    }
    window.addEventListener("resize", drawRelations);
});

// Switch view screen layouts
function enterAppDashboard(tier = "pro") {
    state.activeTier = tier;
    state.activeView = "app";
    window.location.hash = "designer";

    document.getElementById("landing-page").classList.remove("active");
    document.getElementById("dashboard-app").classList.add("active");

    // Load billing seed templates by default
    if (state.tables.length === 0) {
        loadSchemaTemplate("billing");
    }

    updateAppUI();
}

function exitAppDashboard() {
    state.activeView = "landing";
    window.location.hash = "";

    document.getElementById("dashboard-app").classList.remove("active");
    document.getElementById("landing-page").classList.add("active");
}

// Refresh overall application DOM values
function updateAppUI() {
    renderTablesOnCanvas();
    renderSidebarTablesList();
    updateTierLimitsUI();
    generateBoilerplateOutputs();
    
    // Small delay to ensure cards paint to calculate coordinates
    setTimeout(drawRelations, 80);
}

// --- 4. RENDERERS: CANVAS TABLES ---
function renderTablesOnCanvas() {
    const canvas = document.getElementById("canvas-workspace-area");
    if (!canvas) return;

    // Remove existing cards (leaving the svg overlay path)
    const cards = canvas.querySelectorAll(".table-card");
    cards.forEach(c => c.remove());

    state.tables.forEach(t => {
        const card = document.createElement("div");
        card.className = `table-card ${state.selectedTableId === t.id ? 'selected' : ''}`;
        card.id = t.id;
        card.style.left = `${t.x}px`;
        card.style.top = `${t.y}px`;
        
        // Handle selecting table card on click
        card.addEventListener("mousedown", (e) => {
            selectTableCard(t.id);
            initiateCardDrag(t.id, e);
        });

        // Handle opening modal on double click
        card.addEventListener("dblclick", () => {
            openEditTableModal(t.id);
        });

        // Build columns rows
        let colsHtml = "";
        t.columns.forEach(col => {
            let icon = "";
            if (col.pk) icon = `<span class="col-key-icon" title="Primary Key">🔑</span>`;
            else if (col.fkTarget) icon = `<span class="col-key-icon" title="Foreign Key">🔗</span>`;

            colsHtml += `
                <div class="table-column-row" id="col-row-${t.id}-${col.name}">
                    <div class="col-identity">
                        ${icon}
                        <span class="col-name">${col.name}</span>
                    </div>
                    <span class="col-type">${col.type}</span>
                </div>
            `;
        });

        card.innerHTML = `
            <div class="table-card-header">
                <span class="table-title">${t.name}</span>
                <div class="table-card-actions">
                    <button class="table-act-btn" title="Edit Table Schema" onclick="openEditTableModal('${t.id}')">✏️</button>
                    <button class="table-act-btn" title="Delete Table" onclick="deleteTable('${t.id}')">❌</button>
                </div>
            </div>
            <div class="table-columns-list">
                ${colsHtml}
            </div>
        `;
        
        canvas.appendChild(card);
    });
}

// Select a table, highlighting it visually
function selectTableCard(id) {
    state.selectedTableId = id;
    document.querySelectorAll(".table-card").forEach(c => {
        if (c.id === id) c.classList.add("selected");
        else c.classList.remove("selected");
    });
}

// --- 5. DRAG AND DROP ENGINE ---
function initiateCardDrag(tableId, event) {
    // Avoid triggering drag when clicking action buttons
    if (event.target.closest(".table-card-actions") || event.target.closest("button")) {
        return;
    }

    const t = state.tables.find(item => item.id === tableId);
    if (!t) return;

    state.drag.isDragging = true;
    state.drag.tableId = tableId;
    state.drag.startX = event.clientX;
    state.drag.startY = event.clientY;
    state.drag.offsetX = t.x;
    state.drag.offsetY = t.y;

    // Bind dragging event listeners to screen viewport container
    const viewport = document.getElementById("canvas-viewport-container");
    viewport.addEventListener("mousemove", handleCardDrag);
    viewport.addEventListener("mouseup", terminateCardDrag);
}

function handleCardDrag(event) {
    if (!state.drag.isDragging) return;

    const t = state.tables.find(item => item.id === state.drag.tableId);
    if (!t) return;

    // Calculate position deltas
    const dx = event.clientX - state.drag.startX;
    const dy = event.clientY - state.drag.startY;

    // Boundary constraints within canvas limits
    t.x = Math.max(0, Math.min(2200, state.drag.offsetX + dx));
    t.y = Math.max(0, Math.min(1700, state.drag.offsetY + dy));

    // Update DOM coordinates directly for smooth performance
    const cardEl = document.getElementById(t.id);
    if (cardEl) {
        cardEl.style.left = `${t.x}px`;
        cardEl.style.top = `${t.y}px`;
    }

    // Redraw linking lines in real-time
    drawRelations();
}

function terminateCardDrag() {
    state.drag.isDragging = false;
    state.drag.tableId = null;

    const viewport = document.getElementById("canvas-viewport-container");
    viewport.removeEventListener("mousemove", handleCardDrag);
    viewport.removeEventListener("mouseup", terminateCardDrag);

    // Save final table coordinates to live outputs generators
    generateBoilerplateOutputs();
}

// --- 6. SVG RELATION CONNECTION LINES DRAWER ---
function drawRelations() {
    const svgOverlay = document.getElementById("canvas-svg-overlay");
    if (!svgOverlay) return;

    // Clear old connector lines (keeping `<defs>`)
    const lines = svgOverlay.querySelectorAll(".relation-line");
    lines.forEach(l => l.remove());

    // Loop through tables to find foreign key targets
    state.tables.forEach(sourceTable => {
        sourceTable.columns.forEach(col => {
            if (col.fkTarget) {
                // Parse target (format: "targetTableId.targetColumnName")
                const [targetTblId, targetColName] = col.fkTarget.split(".");
                const targetTable = state.tables.find(tbl => tbl.id === targetTblId);
                
                if (targetTable) {
                    const sourceRow = document.getElementById(`col-row-${sourceTable.id}-${col.name}`);
                    const targetRow = document.getElementById(`col-row-${targetTable.id}-${targetColName}`);

                    if (sourceRow && targetRow) {
                        // Compute coordinates relative to the canvas workspace
                        const sourceCoords = getElementAnchorCoords(sourceRow, sourceTable);
                        const targetCoords = getElementAnchorCoords(targetRow, targetTable);

                        drawBezierLink(svgOverlay, sourceCoords, targetCoords);
                    }
                }
            }
        });
    });
}

// Get the left or right anchor coordinate of a column row depending on relative positions
function getElementAnchorCoords(rowEl, tableState) {
    const cardEl = document.getElementById(tableState.id);
    if (!cardEl) return { x: 0, y: 0, side: "right" };

    // Coordinates of card relative to canvas
    const cardX = tableState.x;
    const cardY = tableState.y;

    // Get offset height of column row inside table card
    const rowOffsetTop = rowEl.offsetTop;
    const rowHeight = rowEl.offsetHeight;

    // Compute center-Y anchor
    const anchorY = cardY + rowOffsetTop + (rowHeight / 2);

    return { cardX, cardWidth: cardEl.offsetWidth, anchorY };
}

// Draw a smooth cubic bezier line path connecting anchor points
function drawBezierLink(svgContainer, source, target) {
    // Determine whether source card is to the left or right of target card
    const isSourceLeft = source.cardX < target.cardX;
    
    // Anchor X coordinates
    const x1 = isSourceLeft ? source.cardX + source.cardWidth : source.cardX;
    const y1 = source.anchorY;

    const x2 = isSourceLeft ? target.cardX : target.cardX + target.cardWidth;
    const y2 = target.anchorY;

    // Control point offset mapping to draw visual bends
    const dx = Math.abs(x2 - x1) * 0.4 + 10;
    const ctrlX1 = isSourceLeft ? x1 + dx : x1 - dx;
    const ctrlX2 = isSourceLeft ? x2 - dx : x2 + dx;

    const pathData = `M ${x1} ${y1} C ${ctrlX1} ${y1}, ${ctrlX2} ${y2}, ${x2} ${y2}`;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("class", "relation-line");
    svgContainer.appendChild(path);
}

// --- 7. SIDEBAR TABLES LIST PAINTING ---
function renderSidebarTablesList() {
    const list = document.getElementById("sidebar-tables-list");
    if (!list) return;

    list.innerHTML = "";

    if (state.tables.length === 0) {
        list.innerHTML = `<span style="color: var(--text-muted); font-size:0.75rem;">No active database tables.</span>`;
        return;
    }

    state.tables.forEach(t => {
        const item = document.createElement("div");
        item.className = "inventory-table-item";
        item.onclick = () => selectTableCard(t.id);
        item.innerHTML = `
            <span>${t.name}</span>
            <div class="inv-actions">
                <button class="inv-btn" onclick="event.stopPropagation(); openEditTableModal('${t.id}')" title="Edit Table">✏️</button>
                <button class="inv-btn" onclick="event.stopPropagation(); deleteTable('${t.id}')" title="Delete Table">❌</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// --- 8. TEMPLATE SCHEMAS LOADERS ---
function loadSchemaTemplate(key) {
    if (!TEMPLATE_SCHEMAS[key]) return;

    // Deep copy seed array to clear object references
    state.tables = JSON.parse(JSON.stringify(TEMPLATE_SCHEMAS[key]));
    state.selectedTableId = state.tables[0].id;

    updateAppUI();
}

// --- 9. TABLE MODAL DESIGN BUILDER ---

function openCreateTableModal() {
    // check billing tier limits
    const maxLimit = state.activeTier === "free" ? 3 : 9999;
    if (state.tables.length >= maxLimit) {
        alert(`Table limit reached on current tier! Free tier is restricted to 3 active tables. Please upgrade.`);
        return;
    }

    state.editTableId = null;
    state.modalRows = [];

    document.getElementById("table-modal-title").innerText = "Create New Database Table";
    document.getElementById("modal-table-name").value = "";
    
    // Clear rows container and add an initial primary key column
    const container = document.getElementById("columns-rows-container");
    container.innerHTML = "";
    
    addNewColumnBuilderRow("id", "uuid", true, true, true);
    
    document.getElementById("table-modal").classList.remove("hidden");
}

function openEditTableModal(tableId) {
    const t = state.tables.find(item => item.id === tableId);
    if (!t) return;

    state.editTableId = tableId;
    state.modalRows = [];

    document.getElementById("table-modal-title").innerText = `Edit Table: ${t.name}`;
    document.getElementById("modal-table-name").value = t.name;

    const container = document.getElementById("columns-rows-container");
    container.innerHTML = "";

    // Fill builder with columns data
    t.columns.forEach(col => {
        addNewColumnBuilderRow(col.name, col.type, col.pk, col.nn, col.uq, col.fkTarget);
    });

    document.getElementById("table-modal").classList.remove("hidden");
}

function closeTableModal() {
    document.getElementById("table-modal").classList.add("hidden");
}

// Table Name input validation: enforce database-safe lowercase formats
function validateTableName(input) {
    input.value = input.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

// Append a dynamic builder row to the modal columns container
function addNewColumnBuilderRow(name = "", type = "varchar", pk = false, nn = false, uq = false, fkTarget = null) {
    const container = document.getElementById("columns-rows-container");
    const rowId = "row-" + Date.now() + "-" + Math.round(Math.random() * 1000);
    
    // Gather all eligible tables and fields to populate foreign key target dropdown
    let targetOptionsHtml = `<option value="">None</option>`;
    state.tables.forEach(t => {
        // Exclude the current editing table to prevent self-reference loops easily
        if (t.id !== state.editTableId) {
            t.columns.forEach(c => {
                if (c.pk) { // Link foreign keys specifically to primary keys
                    const value = `${t.id}.${c.name}`;
                    const label = `${t.name}.${c.name}`;
                    const isSelected = fkTarget === value ? "selected" : "";
                    targetOptionsHtml += `<option value="${value}" ${isSelected}>${label}</option>`;
                }
            });
        }
    });

    // Populate data types options list
    let typeOptionsHtml = "";
    DATA_TYPES.forEach(dt => {
        const isSelected = type === dt ? "selected" : "";
        typeOptionsHtml += `<option value="${dt}" ${isSelected}>${dt}</option>`;
    });

    const row = document.createElement("div");
    row.className = "col-builder-row";
    row.id = rowId;
    row.innerHTML = `
        <input type="text" class="styled-input col-row-name" required value="${name}" placeholder="column_name" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9_]/g, '')">
        <select class="styled-select col-row-type">${typeOptionsHtml}</select>
        <input type="checkbox" class="col-row-pk" ${pk ? 'checked' : ''} onchange="handlePkCheckboxToggle(this)">
        <input type="checkbox" class="col-row-nn" ${nn ? 'checked' : ''}>
        <input type="checkbox" class="col-row-uq" ${uq ? 'checked' : ''}>
        <select class="styled-select col-row-fk">${targetOptionsHtml}</select>
        <button type="button" class="inv-btn" style="color:var(--color-ruby); font-size:1.1rem;" onclick="removeColumnBuilderRow('${rowId}')">&times;</button>
    `;

    container.appendChild(row);
    state.modalRows.push(rowId);
}

// When PK is checked, enforce NN (Not Null) and UQ (Unique) automatically
function handlePkCheckboxToggle(checkbox) {
    if (checkbox.checked) {
        const row = checkbox.closest(".col-builder-row");
        row.querySelector(".col-row-nn").checked = true;
        row.querySelector(".col-row-uq").checked = true;
    }
}

function removeColumnBuilderRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) row.remove();
    state.modalRows = state.modalRows.filter(id => id !== rowId);
}

// Submit builder forms details and saves to active state
function handleTableBuilderSubmit(event) {
    event.preventDefault();

    const tableName = document.getElementById("modal-table-name").value.trim().toLowerCase();
    
    // Gather values from rows
    const columns = [];
    let hasPk = false;

    const rowElements = document.querySelectorAll("#columns-rows-container .col-builder-row");
    rowElements.forEach(row => {
        const colName = row.querySelector(".col-row-name").value.trim().toLowerCase();
        const colType = row.querySelector(".col-row-type").value;
        const colPk = row.querySelector(".col-row-pk").checked;
        const colNn = row.querySelector(".col-row-nn").checked;
        const colUq = row.querySelector(".col-row-uq").checked;
        const colFk = row.querySelector(".col-row-fk").value || null;

        if (colPk) hasPk = true;

        if (colName) {
            columns.push({
                name: colName,
                type: colType,
                pk: colPk,
                nn: colNn,
                uq: colUq,
                fkTarget: colFk
            });
        }
    });

    if (columns.length === 0) {
        alert("Please define at least one column for the table schema.");
        return;
    }

    if (state.editTableId) {
        // Edit existing table
        const index = state.tables.findIndex(tbl => tbl.id === state.editTableId);
        if (index !== -1) {
            state.tables[index].name = tableName;
            state.tables[index].columns = columns;
        }
    } else {
        // Create new table
        const newTable = {
            id: "tbl-" + Date.now(),
            name: tableName,
            x: 150 + (state.tables.length * 30), // staggered coordinates default placement
            y: 120 + (state.tables.length * 30),
            columns: columns
        };
        state.tables.push(newTable);
        state.selectedTableId = newTable.id;
    }

    closeTableModal();
    updateAppUI();
}

function deleteTable(tableId) {
    if (!confirm("Are you sure you want to delete this table? Foreign key links referencing it will be invalidated.")) return;

    // Filter tables
    state.tables = state.tables.filter(t => t.id !== tableId);
    
    // Clean up foreign key references in other tables
    state.tables.forEach(t => {
        t.columns.forEach(c => {
            if (c.fkTarget && c.fkTarget.startsWith(tableId + ".")) {
                c.fkTarget = null;
            }
        });
    });

    if (state.selectedTableId === tableId) {
        state.selectedTableId = state.tables.length > 0 ? state.tables[0].id : null;
    }

    updateAppUI();
}

// --- 10. BOILERPLATE SCHEMAS CODE COMPILER ENGINE ---
function generateBoilerplateOutputs() {
    const outputBlock = document.getElementById("code-output-block");
    if (!outputBlock) return;

    let generatedCode = "";
    
    if (state.activeExporterTab === "sql") {
        generatedCode = compileSqlSchema();
        document.getElementById("code-lang-label").innerText = "Standard SQL DDL Script (PostgreSQL/MySQL)";
    } else if (state.activeExporterTab === "prisma") {
        generatedCode = compilePrismaSchema();
        document.getElementById("code-lang-label").innerText = "Prisma Schema Model File (schema.prisma)";
    } else if (state.activeExporterTab === "mongoose") {
        generatedCode = compileMongooseSchema();
        document.getElementById("code-lang-label").innerText = "Mongoose MongoDB Schema models (ES6 JS)";
    } else if (state.activeExporterTab === "dbml") {
        generatedCode = compileDbmlSchema();
        document.getElementById("code-lang-label").innerText = "Database Markup Language Model (dbdiagram.io)";
    }

    outputBlock.innerText = generatedCode || "-- Configure tables to output code schemas.";
}

// Exporter: SQL script
function compileSqlSchema() {
    let sql = `-- Database schema generated in SchemaFlow Designer\n-- Created: ${new Date().toLocaleDateString()}\n\n`;
    
    state.tables.forEach(t => {
        sql += `CREATE TABLE ${t.name} (\n`;
        const colDefinitions = [];
        const constraintDefinitions = [];

        t.columns.forEach(col => {
            let line = `  ${col.name} ${col.type.toUpperCase()}`;
            
            if (col.pk) line += " PRIMARY KEY";
            if (col.nn && !col.pk) line += " NOT NULL";
            if (col.uq && !col.pk) line += " UNIQUE";
            
            colDefinitions.push(line);

            if (col.fkTarget) {
                // Map relation constraints
                const [targetTblId, targetColName] = col.fkTarget.split(".");
                const targetTable = state.tables.find(item => item.id === targetTblId);
                if (targetTable) {
                    constraintDefinitions.push(`  CONSTRAINT fk_${t.name}_${col.name} FOREIGN KEY (${col.name}) REFERENCES ${targetTable.name}(${targetColName}) ON DELETE CASCADE`);
                }
            }
        });

        const merged = [...colDefinitions, ...constraintDefinitions];
        sql += merged.join(",\n");
        sql += `\n);\n\n`;
    });

    return sql;
}

// Exporter: Prisma Schema models
function compilePrismaSchema() {
    let prisma = `// Prisma Schema generated in SchemaFlow Designer\n// Learn more: https://pris.ly/d/prisma-schema\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\ngenerator client {\n  provider = "prisma-client-js"\n}\n\n`;

    state.tables.forEach(t => {
        prisma += `model ${capitalizeFirst(t.name)} {\n`;
        t.columns.forEach(col => {
            let typeStr = "String";
            if (col.type === "integer" || col.type === "serial") typeStr = "Int";
            else if (col.type === "boolean") typeStr = "Boolean";
            else if (col.type === "timestamp") typeStr = "DateTime";
            else if (col.type === "decimal") typeStr = "Float";
            else if (col.type === "json") typeStr = "Json";

            let decorators = "";
            if (col.pk) decorators += " @id";
            if (col.type === "uuid" && col.pk) decorators += " @default(uuid())";
            if (col.type === "serial" && col.pk) decorators += " @default(autoincrement())";
            if (col.uq && !col.pk) decorators += " @unique";
            
            if (!col.nn && !col.pk) typeStr += "?";

            if (col.fkTarget) {
                const [targetTblId, targetColName] = col.fkTarget.split(".");
                const targetTable = state.tables.find(item => item.id === targetTblId);
                if (targetTable) {
                    const relationModel = capitalizeFirst(targetTable.name);
                    prisma += `  ${col.name} ${typeStr}${decorators}\n`;
                    prisma += `  ${targetTable.name} ${relationModel} @relation(fields: [${col.name}], references: [${targetColName}])\n`;
                    return;
                }
            }

            prisma += `  ${col.name} ${typeStr}${decorators}\n`;
        });
        prisma += `}\n\n`;
    });

    return prisma;
}

// Exporter: Mongoose schemas
function compileMongooseSchema() {
    let mongoose = `// Mongoose MongoDB Schema models\n// Generated in SchemaFlow Designer\n\nconst mongoose = require('mongoose');\nconst { Schema } = mongoose;\n\n`;

    state.tables.forEach(t => {
        const modelName = capitalizeFirst(t.name);
        mongoose += `const ${modelName}Schema = new Schema({\n`;
        
        const fields = [];
        t.columns.forEach(col => {
            // MongoDB defaults id internally, skip pk ID unless it's UUID
            if (col.pk && col.name === "id") return;

            let typeStr = "String";
            if (col.type === "integer" || col.type === "serial") typeStr = "Number";
            else if (col.type === "boolean") typeStr = "Boolean";
            else if (col.type === "timestamp") typeStr = "Date";
            else if (col.type === "decimal") typeStr = "Number";
            else if (col.type === "json") typeStr = "Object";

            let details = `type: ${typeStr}`;
            if (col.nn) details += ", required: true";
            if (col.uq) details += ", unique: true";

            if (col.fkTarget) {
                const [targetTblId, targetColName] = col.fkTarget.split(".");
                const targetTable = state.tables.find(item => item.id === targetTblId);
                if (targetTable) {
                    details = `type: Schema.Types.ObjectId, ref: '${capitalizeFirst(targetTable.name)}'`;
                }
            }

            fields.push(`  ${col.name}: { ${details} }`);
        });

        mongoose += fields.join(",\n");
        mongoose += `\n});\n\nmodule.exports = mongoose.model('${modelName}', ${modelName}Schema);\n\n`;
    });

    return mongoose;
}

// Exporter: DBML
function compileDbmlSchema() {
    let dbml = `// DBML Database Markup Language\n// View in https://dbdiagram.io\n\n`;

    state.tables.forEach(t => {
        dbml += `Table ${t.name} {\n`;
        t.columns.forEach(col => {
            let tags = [];
            if (col.pk) tags.push("pk");
            if (col.nn) tags.push("not null");
            if (col.uq) tags.push("unique");

            const tagStr = tags.length > 0 ? ` [${tags.join(", ")}]` : "";
            dbml += `  ${col.name} ${col.type}${tagStr}\n`;
        });
        dbml += `}\n\n`;
    });

    // Write relations connections in DBML formats
    state.tables.forEach(t => {
        t.columns.forEach(col => {
            if (col.fkTarget) {
                const [targetTblId, targetColName] = col.fkTarget.split(".");
                const targetTable = state.tables.find(item => item.id === targetTblId);
                if (targetTable) {
                    dbml += `Ref: ${t.name}.${col.name} > ${targetTable.name}.${targetColName}\n`;
                }
            }
        });
    });

    return dbml;
}

function copyGeneratedCode() {
    const code = document.getElementById("code-output-block").innerText;
    navigator.clipboard.writeText(code);
    alert("Boilerplate code copied to clipboard!");
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- 11. EXPORTER TABS SWITCHER CONTROLS ---
function switchExporterTab(tabId) {
    state.activeExporterTab = tabId;

    // Toggle active classes on tab headers
    document.querySelectorAll(".exp-tab-btn").forEach(btn => {
        if (btn.getAttribute("data-tab") === tabId) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Toggle panel displays
    if (tabId === "billing") {
        document.getElementById("exp-pane-code").classList.remove("active");
        document.getElementById("exp-pane-billing").classList.add("active");
    } else {
        document.getElementById("exp-pane-billing").classList.remove("active");
        document.getElementById("exp-pane-code").classList.add("active");
        generateBoilerplateOutputs();
    }
}

// --- 12. BILLING TIER DISPLAY SYNC ---
function updateTierLimitsUI() {
    const limitsBadge = document.getElementById("app-tier-badge");
    const sidebarBadge = document.getElementById("billing-tier-badge");
    const sidebarRatio = document.getElementById("credits-ratio");
    const sidebarFill = document.getElementById("credits-bar-fill");
    const sidebarPromo = document.getElementById("upgrade-promo-text");
    const billingName = document.getElementById("billing-tier-name");
    const billingCount = document.getElementById("billing-table-count");

    let tierText = "Pro Plan";
    let limitsText = `${state.tables.length} Tables`;
    let pct = 100;

    if (state.activeTier === "free") {
        tierText = "Hobby Plan";
        limitsText = `${state.tables.length} / 3 Tables`;
        pct = (state.tables.length / 3) * 100;
        if (sidebarPromo) sidebarPromo.innerText = "Upgrade to Pro (Unlimited tables)";
    } else if (state.activeTier === "enterprise") {
        tierText = "Enterprise Plan";
        limitsText = `${state.tables.length} Tables (Unlimited)`;
        if (sidebarPromo) sidebarPromo.innerText = "All limits unlocked!";
    } else {
        if (sidebarPromo) sidebarPromo.innerText = "Upgrade to Enterprise (Team sharing)";
    }

    if (limitsBadge) {
        limitsBadge.innerText = tierText;
        limitsBadge.className = `canvas-badge ${state.activeTier === 'free' ? 'tier-free' : 'tier-pro'}`;
    }
    if (sidebarBadge) {
        sidebarBadge.innerText = tierText;
        sidebarBadge.className = `badge-tier ${state.activeTier === 'free' ? 'tier-starter' : 'tier-pro'}`;
    }
    if (sidebarRatio) sidebarRatio.innerText = limitsText;
    if (sidebarFill) sidebarFill.style.width = `${Math.min(pct, 100)}%`;
    if (billingName) billingName.innerText = tierText;
    if (billingCount) billingCount.innerText = `${state.tables.length} active tables`;
}

// --- 13. FILE UTILITIES: JSON IMPORTS/EXPORTS ---

function triggerJsonDownload() {
    const filename = `schemaflow-model-${Date.now()}.json`;
    const payload = JSON.stringify({
        activeTier: state.activeTier,
        tables: state.tables
    }, null, 2);

    const blob = new Blob([payload], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function triggerJsonImportClick() {
    document.getElementById("import-json-file-input").click();
}

function handleJsonImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data.tables)) {
                state.tables = data.tables;
                state.activeTier = data.activeTier || state.activeTier;
                state.selectedTableId = state.tables.length > 0 ? state.tables[0].id : null;
                
                updateAppUI();
                alert("Database schema layout imported successfully!");
            } else {
                alert("Invalid schema file format: 'tables' array missing.");
            }
        } catch (err) {
            alert("Failed to parse JSON schema file: " + err.message);
        }
    };
    reader.readAsText(file);
    
    // Clear input
    event.target.value = "";
}

// Standalone SVG Diagram Downloader for documentation
function downloadCanvasSvg() {
    // Check pricing tier constraints
    if (state.activeTier === "free") {
        alert("SVG Map Exports are only available on Pro or Enterprise plans. Please upgrade.");
        switchExporterTab("billing");
        return;
    }

    const svgOverlay = document.getElementById("canvas-svg-overlay");
    if (!svgOverlay) return;

    // Create a standalone SVG representation containing connection lines and table rects
    let width = 0;
    let height = 0;
    state.tables.forEach(t => {
        if (t.x + 220 > width) width = t.x + 220;
        if (t.y + 200 > height) height = t.y + 200;
    });

    // Make canvas bounds minimum size
    width = Math.max(width + 100, 800);
    height = Math.max(height + 100, 600);

    let tablesSvgHtml = "";
    state.tables.forEach(t => {
        // Render rect card representation
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

    // Copy connection path markup
    let pathsHtml = "";
    const lines = svgOverlay.querySelectorAll(".relation-line");
    lines.forEach(l => {
        pathsHtml += `<path d="${l.getAttribute("d")}" stroke="#06b6d4" stroke-width="2.2" fill="none" />`;
    });

    const fullSvgPayload = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#09090b" />
    <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
        </marker>
    </defs>
    <g>
        ${pathsHtml}
    </g>
    <g>
        ${tablesSvgHtml}
    </g>
</svg>
    `.trim();

    const blob = new Blob([fullSvgPayload], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `schemaflow-model-${Date.now()}.svg`;
    link.click();
}

// --- 14. STRIPE BILLING FLOW OVERLAYS ---

function openStripeCheckout(tierKey) {
    state.stripeModalTier = tierKey;
    
    const modal = document.getElementById("stripe-modal");
    modal.classList.remove("hidden");

    let name = "Pro Plan";
    let price = "€12.00";
    let desc = "Standard database model visualizer & generator";

    if (tierKey === "free") {
        name = "Hobby Plan";
        price = "€0.00";
        desc = "Basic table model designer";
    } else if (tierKey === "enterprise") {
        name = "Enterprise Plan";
        price = "€29.00";
        desc = "Full code exporters, SVG downloads, team boards";
    }

    document.getElementById("stripe-product-name").innerText = name;
    document.getElementById("stripe-product-price").innerText = price;
    document.getElementById("stripe-product-total").innerText = price;
    document.getElementById("stripe-product-desc").innerText = desc;
    document.getElementById("stripe-btn-price").innerText = price;
}

function closeStripeCheckout() {
    document.getElementById("stripe-modal").classList.add("hidden");
}

function handleStripePaymentSubmit(event) {
    event.preventDefault();
    
    const payBtn = document.getElementById("stripe-submit-btn");
    payBtn.disabled = true;
    payBtn.innerText = "Securing Checkout Verification...";

    setTimeout(() => {
        closeStripeCheckout();
        payBtn.disabled = false;

        // Upgrade state tier & sync views
        state.activeTier = state.stripeModalTier;
        updateAppUI();
        
        alert("Payment Completed! Your SchemaFlow subscription plan has been successfully updated.");
    }, 1200);
}
