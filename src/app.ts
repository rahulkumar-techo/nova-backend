import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import loggerMiddleware from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/error.middlware';


const app = express();



app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Define routes here

// Global error handler




app.use(errorHandler);
export default app;