/**
 * @description Express application setup for NovaNoteX backend.
 * Includes security, sessions, Passport social auth, and global error handling.
 */

import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./modules/auth/social-auth.controller";
import loggerMiddleware from "./middlewares/logger.middleware";
import { errorHandler } from "./middlewares/error.middlware";
import global_error from "./utils/global-error";
import authRoute from "./modules/auth/auth.route";
import manualRoute from "./modules/auth/manual-auth.route";
import path from "path";

const app = express();

// ---------------- Security Middlewares ----------------
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(loggerMiddleware);

// ---------------- CORS Setup ----------------
// ⚠️ "*" + credentials = ❌ invalid in browsers
// So use specific origins during development
app.use(
  cors({
    origin: ["http://localhost:3000", "https://novanotex.com"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ---------------- Session & Passport Setup ----------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "some_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---------------- Root Routes ----------------
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to NovaNoteX API 🚀",
    version: "1.0.0",
    docs: "/api/docs",
    timestamp: new Date().toISOString(),
  });
});
app.get("/status", (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "templates", "homePage.html"));
});

app.get("/error", (req: Request, res: Response) => {
  res.status(409).json({
    success: false,
    message: "Error while logging in via Google or GitHub",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ---------------- Routes ----------------
app.use("/auth", authRoute);
app.use("/user", manualRoute);

// ---------------- 404 Handler ----------------
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// ---------------- Global Error Handling ----------------
// Only ONE centralized error handler chain
app.use(global_error);
// app.use(errorHandler);

// ---------------- Fallback Error Catcher ----------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Unhandled Error:", err);
  if (res.headersSent) return next(err);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message || err });
});

export default app;
