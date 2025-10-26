import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import loggerMiddleware from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/error.middlware';
import userRoutes from './modules/user/user.route';

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




app.use(errorHandler);
export default app;