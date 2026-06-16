const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initDB } = require("./config/db");
const authRoutes  = require("./routes/auth");
const leadsRoutes = require("./routes/leads");

const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://future-fs-02-olive-six.vercel.app"
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
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
