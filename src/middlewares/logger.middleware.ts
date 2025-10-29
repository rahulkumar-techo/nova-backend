/**
 * Request logger middleware using morgan.
 */


import morgan from "morgan";
import { RequestHandler } from "express";
import { log } from "@/shared/utils/logger";


const loggerMiddleware: RequestHandler = morgan("dev",{stream: {
  write: (message) => {
    log.info(message.trim())
  },
}});

export default loggerMiddleware;
