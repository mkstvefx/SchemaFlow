// --- SchemaFlow Static Asset Web Server ---
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load Environment Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Serve Static Assets from Workspace
app.use(express.static(path.join(__dirname)));

// Fallback Route: Redirect all other requests to root index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start listening
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 SchemaFlow Visual Designer Server Active!`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`==================================================`);
});
