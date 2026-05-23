import React, { useState } from "react";

const DOCS_DATABASE = [
  {
    id: "db-normalization",
    category: "Database Design",
    title: "Database Normalization Forms (1NF, 2NF, 3NF)",
    summary: "A detailed guide on how to structure relational tables to minimize data redundancy and maintain integrity.",
    content: `Database normalization is a systematic technique of organizing data in a database. The goal is to eliminate data redundancy and ensure data dependency makes sense. This prevents anomalies during inserts, updates, and deletes.

### First Normal Form (1NF)
For a table to be in the First Normal Form, it must meet the following rules:
1. Each table cell must contain a single (atomic) value.
2. Each record needs to be unique (defined by a Primary Key).
3. The order of columns does not matter.

#### Violation Example:
| id | name | phone_numbers |
|----|------|---------------|
| 1  | Alex | 12345, 67890  | (Violates atomic values rule)

#### 1NF Compliance:
| id | name | phone_number |
|----|------|--------------|
| 1  | Alex | 12345        |
| 2  | Alex | 67890        |

---

### Second Normal Form (2NF)
A table is in 2NF if:
1. It is already in 1NF.
2. All non-key columns must depend entirely on the primary key (no partial dependencies on a composite primary key).

#### Violation Example (Composite Primary Key: user_id + course_id):
| user_id | course_id | course_title | completion_date |
|---------|-----------|--------------|-----------------|
| 1       | 101       | Prisma Basics| 2026-05-01      |
*Here, 'course_title' depends only on 'course_id', not on the user. This violates 2NF.*

#### 2NF Compliance:
**Table: user_courses**
| user_id | course_id | completion_date |
|---------|-----------|-----------------|
| 1       | 101       | 2026-05-01      |

**Table: courses**
| course_id | course_title  |
|-----------|---------------|
| 101       | Prisma Basics |

---

### Third Normal Form (3NF)
A table is in 3NF if:
1. It is already in 2NF.
2. There are no transitive functional dependencies. This means non-key columns should not depend on other non-key columns.

#### Violation Example:
| student_id | name | zip_code | city |
|------------|------|----------|------|
| 1          | John | 10115    | Berlin |
*Here, 'city' depends on 'zip_code', which is a non-key column. This violates 3NF.*

#### 3NF Compliance:
**Table: students**
| student_id | name | zip_code |
|------------|------|----------|
| 1          | John | 10115    |

**Table: locations**
| zip_code | city   |
|----------|--------|
| 10115    | Berlin |`
  },
  {
    id: "database-indexes",
    category: "Performance",
    title: "Understanding Database Indexes & Query Performance",
    summary: "Learn how indexing speeds up database queries, when to use B-Trees, and how to avoid index overhead.",
    content: `An index is a data structure (typically a B-Tree or Hash table) that improves the speed of data retrieval operations on a database table. However, it slows down writes (INSERT, UPDATE, DELETE) because the index must be updated as well.

### How B-Tree Indexes Work
When you query a table without an index:
\`\`\`sql
SELECT * FROM users WHERE email = 'alex@example.com';
\`\`\`
The database must perform a **Sequential Scan (Table Scan)**, reading every single row to check the email value. This is O(N) complexity.

With an index on the 'email' column:
1. The database maintains a sorted B-Tree of emails pointing to physical rows.
2. The database performs an **Index Scan (Index Lookup)**. This is O(log N) complexity, loading queries instantly even on millions of rows.

### Designing Indexes in SQL:
\`\`\`sql
-- Single Column Index
CREATE INDEX idx_users_email ON users(email);

-- Composite Index (for multiple columns in WHERE)
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);
\`\`\`

### When to Create Indexes:
- Columns frequently used in \`WHERE\` clauses.
- Columns used in \`JOIN\` conditions (foreign keys).
- Columns used in \`ORDER BY\` or \`GROUP BY\` operations.

### When to Avoid Indexes:
- Tables with small datasets (sequentials scans are faster).
- Columns with low cardinality (e.g. boolean fields like 'is_active').
- Columns in tables subjected to heavy write operations.`
  },
  {
    id: "prisma-relations",
    category: "Prisma ORM",
    title: "Structuring One-to-Many & Many-to-Many Relations in Prisma",
    summary: "A practical walkthrough of configuring model links and foreign keys in SchemaFlow's Prisma exports.",
    content: `Prisma ORM maps database tables to custom schemas using models. Relations are defined using field annotations.

### One-to-Many Relationships
A user can have multiple posts. Here, \`Post\` is the relation owner containing the foreign key \`authorId\`.

\`\`\`prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
\`\`\`

### Referential Integrity & Delete Cascades
- \`onDelete: Cascade\`: If a \`User\` is deleted, all their associated \`Post\` entries are automatically deleted as well.
- \`onDelete: SetNull\`: Sets the foreign key to null if the parent record is deleted.

### Many-to-Many Relationships
In Prisma, many-to-many relationships can be implicit (handled automatically by creating a join table under the hood) or explicit.

#### Implicit Many-to-Many:
\`\`\`prisma
model Post {
  id   Int    @id @default(autoincrement())
  tags Tag[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}
\`\`\`
Prisma automatically creates a join table named \`_PostToTag\` to handle mappings.`
  },
  {
    id: "mongoose-refs",
    category: "Mongoose ODM",
    title: "Embedded Documents vs. Referenced Relationships in MongoDB Mongoose",
    summary: "Understand when to embed JSON payloads versus referencing ObjectIds in Mongoose schemas.",
    content: `MongoDB is a document database, giving you two primary patterns to model relationships: **Embedded Documents** and **References (Refs)**.

### 1. Referenced Documents (Normalized Model)
Similar to relational design, you store the document ID of the parent in the child. Mongoose uses \`Schema.Types.ObjectId\` and \`ref\` for lookup.

#### Mongoose Reference Schema:
\`\`\`javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const AuthorSchema = new Schema({
  name: { type: String, required: true }
});

const BookSchema = new Schema({
  title: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'Author' }
});
\`\`\`

#### Querying with References:
\`\`\`javascript
// Fetch book and populate author details
Book.find({}).populate('authorId').exec((err, books) => {
  console.log(books);
});
\`\`\`

### 2. Embedded Documents (Subdocuments)
You nest schemas directly inside other documents. This is extremely efficient for 1-to-1 or bounded 1-to-many relationships since it avoids JOIN operations.

#### Mongoose Embedded Schema:
\`\`\`javascript
const InvoiceItemSchema = new Schema({
  item_name: { type: String, required: true },
  price: { type: Number, required: true }
});

const InvoiceSchema = new Schema({
  customer: { type: String, required: true },
  items: [InvoiceItemSchema] // Array of embedded subdocuments
});
\`\`\`

### Decision Matrix:
| Requirement | References (Normalized) | Embedded (Subdocuments) |
|-------------|-------------------------|--------------------------|
| Relationship | One-to-Many (Large)     | One-to-Many (Small/Bounded) |
| Performance  | Slower (Joins needed)   | Instant (Single read)    |
| Data Growth  | Infinite bounds         | Max 16MB document limit   |`
  },
  {
    id: "dbml-spec",
    category: "DBML Syntax",
    title: "Database Markup Language (DBML) Formatting Guide",
    summary: "Quick cheat sheet for parsing and creating DBML structures for documentation.",
    content: `DBML is an open-source DSL (Domain Specific Language) designed to define database schemas visually. It is parsed by platforms like dbdiagram.io.

### Table Declarations
\`\`\`dbml
Table users {
  id uuid [pk, not null, unique]
  email varchar [not null, unique]
  role varchar
}
\`\`\`

### Relationship Mapping (References)
Relations can be defined inline or as separate \`Ref\` statements:

#### Inline References:
\`\`\`dbml
Table posts {
  id integer [pk]
  user_id uuid [ref: > users.id]
}
\`\`\`

#### Separate Reference Statements:
\`\`\`dbml
Ref: posts.user_id > users.id
\`\`\`

#### Relationship Symbols:
- \`>\`: Many-to-One (Many posts reference one user)
- \`<\`: One-to-Many (One user owns many posts)
- \`-\`: One-to-One (One profile links to one user)`
  }
];

export default function DocumentationHub({ onExit }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState(DOCS_DATABASE[0].id);

  // Filter articles based on search query
  const filteredArticles = DOCS_DATABASE.filter(art => {
    return art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
           art.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const activeArticle = DOCS_DATABASE.find(art => art.id === selectedArticleId) || DOCS_DATABASE[0];

  return (
    <div className="w-full min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans flex flex-col relative select-none">
      
      {/* Navbar */}
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
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-[#71717a] uppercase font-bold tracking-wider hidden sm:inline-block">Documentation Center</span>
          <button
            onClick={onExit}
            className="px-4 py-2 border border-white/8 hover:border-white/16 hover:bg-white/5 rounded-md text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Grid Workspace */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-[280px_1fr] max-h-[calc(100vh-69px)] overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="bg-[#0b0b0d] border-r border-white/8 p-5 flex flex-col gap-4 overflow-y-auto">
          
          {/* Search inputs */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/2 border border-white/8 rounded-md px-3 py-2 text-xs text-[#f4f4f5] outline-none focus:border-[#06b6d4] focus:bg-white/5 transition-all"
            />
          </div>

          <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider mt-2.5">
            Articles Index
          </div>

          <div className="flex flex-col gap-1.5">
            {filteredArticles.length === 0 ? (
              <span className="text-xs text-[#71717a]">No matching guides.</span>
            ) : (
              filteredArticles.map(art => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className={`px-3 py-2.5 border rounded-lg cursor-pointer text-left transition-all flex flex-col gap-0.5 ${
                    selectedArticleId === art.id
                      ? "bg-[#06b6d4]/8 border-[#06b6d4]/20 text-white"
                      : "bg-white/1 border-white/3 hover:bg-white/3 hover:border-white/8 text-[#a1a1aa]"
                  }`}
                >
                  <span className="text-[9px] text-[#06b6d4] font-bold uppercase tracking-wider">{art.category}</span>
                  <strong className="text-xs font-bold leading-snug">{art.title}</strong>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Content Viewer Body */}
        <main className="bg-[#08080a] p-8 overflow-y-auto flex justify-center">
          <article className="max-w-[720px] w-full space-y-6 select-text">
            
            {/* Header metadata */}
            <div className="border-b border-white/8 pb-6">
              <span className="text-[10px] text-[#06b6d4] font-extrabold uppercase tracking-widest block mb-2">
                {activeArticle.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
                {activeArticle.title}
              </h1>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                {activeArticle.summary}
              </p>
            </div>

            {/* Structured Content Parser (simulated Markdown rendering) */}
            <div className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed space-y-6">
              {activeArticle.content.split("\n\n").map((para, pIdx) => {
                // Render headers
                if (para.startsWith("### ")) {
                  return (
                    <h3 key={pIdx} className="text-base font-bold text-white mt-8 mb-2">
                      {para.replace("### ", "")}
                    </h3>
                  );
                }
                if (para.startsWith("#### ")) {
                  return (
                    <h4 key={pIdx} className="text-sm font-bold text-white mt-6 mb-2">
                      {para.replace("#### ", "")}
                    </h4>
                  );
                }
                // Render dividers
                if (para.trim() === "---") {
                  return <hr key={pIdx} className="border-white/8 my-8" />;
                }
                // Render lists
                if (para.startsWith("- ") || para.match(/^\d+\./)) {
                  return (
                    <ul key={pIdx} className="list-disc pl-5 space-y-2 mt-2">
                      {para.split("\n").map((li, lIdx) => (
                        <li key={lIdx}>
                          {li.replace(/^[-\d.]\s+/, "")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                // Render raw preformatted code blocks
                if (para.startsWith("```")) {
                  const cleaned = para.replace(/```[a-z]*\n/, "").replace(/```$/, "");
                  return (
                    <pre key={pIdx} className="bg-[#111113] border border-white/8 rounded-lg p-4 font-mono text-xs text-[#22d3ee] overflow-x-auto my-4 select-all">
                      <code>{cleaned}</code>
                    </pre>
                  );
                }
                // Render standard paragraphs
                return <p key={pIdx}>{para}</p>;
              })}
            </div>

          </article>
        </main>

      </div>
    </div>
  );
}
