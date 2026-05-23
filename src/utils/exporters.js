/* --- SchemaFlow Advanced Exporters & Compilers Utilities --- */

function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 1. Multi-Dialect SQL DDL Compiler
export function compileSqlSchema(tables, dialect = "postgres") {
  if (!tables || tables.length === 0) return "-- No active tables configured.";
  
  let sql = `-- Database schema generated in SchemaFlow Designer\n-- Dialect: ${dialect.toUpperCase()}\n-- Created: ${new Date().toLocaleDateString()}\n\n`;
  
  tables.forEach(t => {
    sql += `CREATE TABLE ${t.name} (\n`;
    const colDefinitions = [];
    const constraintDefinitions = [];

    t.columns.forEach(col => {
      let typeStr = col.type.toUpperCase();
      
      // Dialect-specific type overrides
      if (dialect === "mysql") {
        if (col.type === "uuid") typeStr = "VARCHAR(36)";
        else if (col.type === "serial") typeStr = "INT AUTO_INCREMENT";
        else if (col.type === "timestamp") typeStr = "DATETIME";
        else if (col.type === "json") typeStr = "JSON";
      } else if (dialect === "sqlite") {
        if (col.type === "uuid") typeStr = "TEXT";
        else if (col.type === "serial") typeStr = "INTEGER AUTOINCREMENT";
        else if (col.type === "timestamp") typeStr = "TEXT";
        else if (col.type === "decimal") typeStr = "REAL";
        else if (col.type === "json") typeStr = "TEXT";
      } else if (dialect === "mssql") {
        if (col.type === "uuid") typeStr = "UNIQUEIDENTIFIER";
        else if (col.type === "serial") typeStr = "INT IDENTITY(1,1)";
        else if (col.type === "timestamp") typeStr = "DATETIME2";
        else if (col.type === "json") typeStr = "NVARCHAR(MAX)";
      }

      let line = `  ${col.name} ${typeStr}`;
      
      if (col.pk) {
        if (dialect === "sqlite" && col.type === "serial") {
          // In SQLite, INTEGER PRIMARY KEY AUTOINCREMENT must be defined exactly
          line = `  ${col.name} INTEGER PRIMARY KEY AUTOINCREMENT`;
        } else {
          line += " PRIMARY KEY";
        }
      }
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

// 2. Database Mock Seed Data Compiler
export function compileSeedSql(tables) {
  if (!tables || tables.length === 0) return "-- No active tables. Seed data cannot be generated.";

  let seed = `-- Database mock seed script generated in SchemaFlow Designer\n-- Populated with 5 sample rows per table\n\n`;

  // Track primary key list for foreign key matching
  const tablePks = {};
  tables.forEach(t => {
    const pkCol = t.columns.find(c => c.pk);
    tablePks[t.name] = pkCol ? pkCol.name : null;
  });

  tables.forEach(t => {
    seed += `-- Seeding data for table: ${t.name}\n`;
    
    // Generate 5 mock records
    for (let i = 1; i <= 5; i++) {
      const cols = [];
      const vals = [];

      t.columns.forEach(col => {
        cols.push(col.name);

        // Generate matching seed values
        if (col.pk) {
          if (col.type === "uuid") vals.push(`'${col.name}-uuid-000${i}'`);
          else if (col.type === "integer" || col.type === "serial") vals.push(i);
          else vals.push(`'id-${i}'`);
        } else if (col.fkTarget) {
          // Reference key
          const [targetTblId] = col.fkTarget.split(".");
          const targetTbl = tables.find(item => item.id === targetTblId);
          if (targetTbl) {
            const targetPkCol = targetTbl.columns.find(c => c.pk);
            if (targetPkCol && (targetPkCol.type === "integer" || targetPkCol.type === "serial")) {
              vals.push(Math.max(1, i));
            } else {
              vals.push(`'${targetPkCol ? targetPkCol.name : "id"}-uuid-000${i}'`);
            }
          } else {
            vals.push("NULL");
          }
        } else {
          // Ordinary fields
          if (col.type === "varchar" || col.type === "text") {
            if (col.name.includes("email")) vals.push(`'user${i}@schemaflow.io'`);
            else if (col.name.includes("username")) vals.push(`'user_profile_${i}'`);
            else if (col.name.includes("name")) vals.push(`'Sample Record Name ${i}'`);
            else vals.push(`'mock_text_value_${i}'`);
          } else if (col.type === "integer" || col.type === "serial") {
            vals.push(i * 10 + 5);
          } else if (col.type === "decimal") {
            vals.push(`${(i * 19.99).toFixed(2)}`);
          } else if (col.type === "boolean") {
            vals.push(i % 2 === 0 ? "TRUE" : "FALSE");
          } else if (col.type === "timestamp") {
            vals.push(`'2026-05-23 12:00:0${i}'`);
          } else if (col.type === "json") {
            vals.push(`'{"meta_key": "val_${i}"}'`);
          } else {
            vals.push("NULL");
          }
        }
      });

      seed += `INSERT INTO ${t.name} (${cols.join(", ")}) VALUES (${vals.join(", ")});\n`;
    }
    seed += `\n`;
  });

  return seed;
}

// 3. Database Migration Diff Script Generator (Alter Table Scripts)
export function compileMigrationSql(oldTables, newTables) {
  if (!oldTables || oldTables.length === 0) {
    return "-- Initial migration: No previous schema found.\n" + compileSqlSchema(newTables);
  }
  
  let migration = `-- SchemaFlow Migration Script\n-- Comparing old schema state to current schema state\n\n`;
  let changesCount = 0;

  // 1. Identify deleted tables
  oldTables.forEach(oldT => {
    const exists = newTables.some(newT => newT.id === oldT.id);
    if (!exists) {
      migration += `DROP TABLE ${oldT.name} CASCADE;\n`;
      changesCount++;
    }
  });

  // 2. Identify new or altered tables
  newTables.forEach(newT => {
    const oldT = oldTables.find(t => t.id === newT.id);

    if (!oldT) {
      // Entirely new table
      migration += `-- Create new relation table: ${newT.name}\n`;
      migration += `CREATE TABLE ${newT.name} (\n`;
      const colDefs = [];
      newT.columns.forEach(col => {
        let line = `  ${col.name} ${col.type.toUpperCase()}`;
        if (col.pk) line += " PRIMARY KEY";
        if (col.nn && !col.pk) line += " NOT NULL";
        if (col.uq && !col.pk) line += " UNIQUE";
        colDefs.push(line);
      });
      migration += colDefs.join(",\n") + "\n);\n\n";
      changesCount++;
    } else {
      // Alter table structure checks
      let tableAlterPrefix = `ALTER TABLE ${newT.name}`;
      let alters = [];

      // Check if table was renamed
      if (oldT.name !== newT.name) {
        migration += `ALTER TABLE ${oldT.name} RENAME TO ${newT.name};\n`;
        tableAlterPrefix = `ALTER TABLE ${newT.name}`;
        changesCount++;
      }

      // Check deleted columns
      oldT.columns.forEach(oldCol => {
        const stillExists = newT.columns.some(c => c.name === oldCol.name);
        if (!stillExists) {
          alters.push(`DROP COLUMN ${oldCol.name}`);
        }
      });

      // Check new or altered columns
      newT.columns.forEach(newCol => {
        const oldCol = oldT.columns.find(c => c.name === newCol.name);
        if (!oldCol) {
          // New column
          let line = `ADD ${newCol.name} ${newCol.type.toUpperCase()}`;
          if (newCol.nn) line += " NOT NULL DEFAULT NULL";
          alters.push(line);
        } else {
          // Type or constraints changed
          if (oldCol.type !== newCol.type) {
            alters.push(`ALTER COLUMN ${newCol.name} TYPE ${newCol.type.toUpperCase()}`);
          }
        }
      });

      if (alters.length > 0) {
        migration += `-- Altering fields in table: ${newT.name}\n`;
        migration += `${tableAlterPrefix} ${alters.join(",\n  ")};\n\n`;
        changesCount++;
      }
    }
  });

  if (changesCount === 0) {
    return `-- SchemaFlow Migration Tool\n-- Compare completed. No structural changes detected between schema states.\n`;
  }

  return migration;
}

// 4. Prisma Schema Exporter
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

// 5. Mongoose Models Compiler
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
        const [targetTblId] = col.fkTarget.split(".");
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

// 6. DBML Specifications Compiler
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
