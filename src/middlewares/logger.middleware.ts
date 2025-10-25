/**
 * Request logger middleware using morgan.
 */


import morgan from "morgan";
import { RequestHandler } from "express";

const loggerMiddleware: RequestHandler = morgan("dev");

export default loggerMiddleware;
