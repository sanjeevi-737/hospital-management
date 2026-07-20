require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);

// Connect Database
connectDB();

// Initialize Socket.IO
const io = initSocket(server);
app.set("io", io);

// Middleware
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use("/api/", apiLimiter);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/hospitals", require("./routes/hospitals"));
app.use("/api/departments", require("./routes/departments"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/patients", require("./routes/patients"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/medical-records", require("./routes/medicalRecords"));
app.use("/api/prescriptions", require("./routes/prescriptions"));
app.use("/api/medicines", require("./routes/medicines"));
app.use("/api/lab", require("./routes/lab"));
app.use("/api/billing", require("./routes/billing"));
app.use("/api/notifications", require("./routes/notifications"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "MedCore HMS API is running", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`MedCore HMS Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = { app, server, io };
