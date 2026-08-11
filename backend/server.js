// server.js - the entry point of our backend. Run with: npm run dev
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const bookRoutes = require("./routes/bookRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

// --- Middleware ---
app.use(cors()); // allow the React frontend (different port) to call this API
app.use(express.json()); // parse JSON request bodies into req.body

// --- Connect to MongoDB ---
connectDB();

// --- Routes ---
// Every URL starting with /api/auth goes to authRoutes, and so on.
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.send("BookNest API is running");
});

// --- Basic error handler (catches anything thrown/rejected in routes) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`BookNest server running on http://localhost:${PORT}`));
