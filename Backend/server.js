const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const { generateToken, getQueue, clearQueue } = require("./routes/queueRoutes");

// API routes
app.post("/get-token", generateToken);
app.get("/queue", getQueue);
app.post("/clear", clearQueue);

// Default route
app.get("/", (req, res) => {
  res.send("Smart Hospital Backend Running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});