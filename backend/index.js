import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { setupLogger } from "./utils/logger.js";
import mongoose from "mongoose";
import { PORT } from "./config/constant.js";
import { validateEnv } from "./config/env.validation.js";
import { ALLOWED_ORIGINS } from "./config/constant.js";
import { connectDb } from "./config/db.connect.js";
import userRouter from "./routers/user.router.js";
import departmentRouter from "./routers/department.router.js";

// dotenv config
dotenv.config();

// validate env
validateEnv();

// app config
const app = express();

// Setup logging
setupLogger(app);

// port number
const PORTNUMBER = PORT;

// db connect
connectDb();

// helmet config
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// cookie parser config
app.use(cookieParser());

// body parser config
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// cors config
const origins = ALLOWED_ORIGINS
  ? ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

app.use(
  cors({
    origin: origins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// health check route
app.get("/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// server working route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is working",
    timestamp: new Date().toISOString(),
  });
});

// api end points
app.use("/api/v1/user", userRouter);
app.use("/api/v1/department", departmentRouter);

// server start
app.listen(PORTNUMBER, () => {
  console.log(`Server is running on port ${PORTNUMBER}`);
});
