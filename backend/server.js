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

/* ---------- DATABASE ---------- */
mongoose
  .connect("mongodb://127.0.0.1:27017/firstaid")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

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
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
