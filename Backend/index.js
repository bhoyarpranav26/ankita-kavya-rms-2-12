const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration: support single origin, comma-separated origins, or wildcard '*'.
const corsOriginEnv = process.env.CORS_ORIGIN || 'http://localhost:5173';
if (corsOriginEnv === '*') {
  // allow all origins (temporary/debugging only)
  app.use(cors());
  console.log('CORS: allowing all origins (CORS_ORIGIN=* )');
} else {
  const allowedOrigins = corsOriginEnv.split(',').map(o => o.trim()).filter(Boolean);
  const corsOptions = {
    origin: function (origin, callback) {
      // allow requests with no origin (e.g., server-to-server, mobile apps, or same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: This origin is not allowed - ' + origin));
    },
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  console.log('CORS allowed origins:', allowedOrigins);
}
app.use(bodyParser.json());

// If a built frontend exists (Frontend/dist), serve it as static files.
// This allows a single service to host both API and frontend (useful for single-container deploys).
const path = require('path')
const fs = require('fs')
const frontendDist = path.join(__dirname, '..', 'Frontend', 'dist')
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist))
  // Serve index.html for all non-API routes
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
  console.log('Serving frontend static files from', frontendDist)
}

// ==========================
// ✅ MongoDB Connection
// ==========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));


// ==========================
// ✅ Routes Import
// ==========================
console.log("📌 Loading auth routes...");
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
console.log("📌 Auth routes mounted at /api/auth");

const menuRoutes = require('./routes/menuRoutes');
app.use('/api/menu', menuRoutes);
console.log('📌 Menu routes mounted at /api/menu');

const ordersRoutes = require('./routes/ordersRoutes');
app.use('/api/orders', ordersRoutes);
console.log('📌 Orders routes mounted at /api/orders');

const paymentsRoutes = require('./routes/paymentsRoutes');
app.use('/api/payments', paymentsRoutes);
console.log('📌 Payments routes mounted at /api/payments');

// Root test
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ==========================
// Start Server
// ==========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
