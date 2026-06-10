const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initDB } = require("./config/db");
const authRoutes  = require("./routes/auth");
const leadsRoutes = require("./routes/leads");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://future-fs-02-olive-six.vercel.app/"
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth",  authRoutes);
app.use("/api/leads", leadsRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "CRM API running ✅" }));

// Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  initDB();
});
