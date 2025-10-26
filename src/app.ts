import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import loggerMiddleware from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/error.middlware';
import userRoutes from './modules/user/user.route';
import global_error from './utils/global-error';

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

app.use(cors());
app.use(express.json());


// Define routes here

app.use("/api/users", userRoutes);

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