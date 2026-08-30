// server.js
// Entry point: wires up middleware, routes, DB connection, and starts the server.

const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Connect to MongoDB
connectDB();

const app = express();

// ---------- Security & core middleware ----------
app.use(helmet());
// `credentials: true` + a specific origin (not "*") is required for the
// browser to send/receive the httpOnly auth cookie cross-origin.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Serve uploaded files statically (e.g. profile pictures)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Health check ----------
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ---------- Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);

// ---------- Error handling (must be last) ----------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});

module.exports = app;
