/* --- SchemaFlow Exporters Utilities --- */

function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function compileSqlSchema(tables) {
    if (!tables || tables.length === 0) return "-- No active tables configured.";
    
    let sql = `-- Database schema generated in SchemaFlow Designer\n-- Created: ${new Date().toLocaleDateString()}\n\n`;
    
    tables.forEach(t => {
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
                const [targetTblId, targetColName] = col.fkTarget.split(".");
                const targetTable = tables.find(item => item.id === targetTblId);
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

export function compilePrismaSchema(tables) {
    if (!tables || tables.length === 0) return "// No active tables configured.";

    let prisma = `// Prisma Schema generated in SchemaFlow Designer\n// Learn more: https://pris.ly/d/prisma-schema\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\ngenerator client {\n  provider = "prisma-client-js"\n}\n\n`;

    tables.forEach(t => {
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
                const targetTable = tables.find(item => item.id === targetTblId);
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

export function compileMongooseSchema(tables) {
    if (!tables || tables.length === 0) return "// No active tables configured.";

    let mongoose = `// Mongoose MongoDB Schema models\n// Generated in SchemaFlow Designer\n\nconst mongoose = require('mongoose');\nconst { Schema } = mongoose;\n\n`;

    tables.forEach(t => {
        const modelName = capitalizeFirst(t.name);
        mongoose += `const ${modelName}Schema = new Schema({\n`;
        
        const fields = [];
        t.columns.forEach(col => {
            if (col.pk && col.name === "id") return; // skipped default mongodb _id mapping

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
                const targetTable = tables.find(item => item.id === targetTblId);
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

export function compileDbmlSchema(tables) {
    if (!tables || tables.length === 0) return "// No active tables configured.";

    let dbml = `// DBML Database Markup Language\n// View in https://dbdiagram.io\n\n`;

    tables.forEach(t => {
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

    tables.forEach(t => {
        t.columns.forEach(col => {
            if (col.fkTarget) {
                const [targetTblId, targetColName] = col.fkTarget.split(".");
                const targetTable = tables.find(item => item.id === targetTblId);
                if (targetTable) {
                    dbml += `Ref: ${t.name}.${col.name} > ${targetTable.name}.${targetColName}\n`;
                }
            }
        });
    });

    return dbml;
}
