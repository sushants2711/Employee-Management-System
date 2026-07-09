import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import chalk from "chalk";
import mongoose from "mongoose";
import { PORT } from "./config/constant.js";
import { validateEnv } from "./config/env.validation.js";
import { ALLOWED_ORIGINS } from "./config/constant.js";
import { connectDb } from "./config/db.connect.js";

// dotenv config
dotenv.config();

// validate env
validateEnv();

// app config
const app = express();

// Logging configuration: Colorful logs in development, standard logs in production
if (process.env.NODE_ENV === "development") {
  app.use(
    morgan((tokens, req, res) => {
      const status = tokens.status(req, res);
      const statusColor =
        status >= 500
          ? chalk.red.bold(status)
          : status >= 400
            ? chalk.yellow.bold(status)
            : status >= 300
              ? chalk.cyan.bold(status)
              : chalk.green.bold(status);

      return [
        chalk.blue.bold(tokens.method(req, res)),
        chalk.magenta(tokens.url(req, res)),
        statusColor,
        chalk.white(tokens["response-time"](req, res) + " ms"),
        chalk.gray("- " + (tokens.res(req, res, "content-length") || "0")),
      ].join(" ");
    })
  );
} else {
  // Standard uncolored logs for production
  app.use(morgan("combined"));
}

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

// server start
app.listen(PORTNUMBER, () => {
  console.log(`Server is running on port ${PORTNUMBER}`);
});
