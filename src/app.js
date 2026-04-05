require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { validateEnv } = require("./config/env");
const { connectDatabase } = require("./config/database");
const {
  notFound,
  globalErrorHandler,
} = require("./middlewares/error.middleware");

const authRoutes = require("./modules/auth/auth.routes");
const usersRoutes = require("./modules/users/users.routes");
const transactionsRoutes = require("./modules/transactions/transactions.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");

validateEnv();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});
app.use("/api", limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Finance Dashboard API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();

module.exports = app;
