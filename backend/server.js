require("dotenv").config(); // MUST be at the top

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const contactRoutes = require("./routes/contact.routes");

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

/* ---------- DATABASE CONNECTION ---------- */
console.log("DBURI VALUE:", process.env.DBURI);
mongoose
  .connect(process.env.DBURI)
  .then(() => console.log("MongoDB connected successfully 🚀"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend connected successfully 🚀" });
});

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});