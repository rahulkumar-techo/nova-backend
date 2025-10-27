import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import loggerMiddleware from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/error.middlware';
import userRoutes from './modules/user/user.route';
import global_error from './utils/global-error';
import authRoute from './modules/auth/auth.route';
import session from "express-session";
import passport from "./modules/auth/social-auth"

const app = express();

// Security
app.use(helmet());

//  Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);


//  CORS
app.use(cors({
  origin: ["*"],
  credentials: true,
  optionsSuccessStatus: 200
}));

// ----- Session middleware -----
app.use(session({
  secret: process.env.SESSION_SECRET || "some_secret_key",
  resave: false,    
  saveUninitialized: false,
  cookie: { secure: false }
}));

// ----- Initialize Passport -----
app.use(passport.initialize());
app.use(passport.session());


// Root/Home Route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the NovaNoteX API 🚀",
    version: "1.0.0",
    docs: "/api/docs",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/users", userRoutes);
app.use("/auth", authRoute);

// Global error handler

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Global Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message || err });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(global_error)



app.use(errorHandler);
export default app;