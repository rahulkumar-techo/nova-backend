/**
 * Global error handling middleware.
 */

import { NextFunction, Request, Response } from "express";
import { log } from "@utils/logger";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  log.error(err?.message || "Unknown error");
  const status = err?.status || 500;
  res.status(status).json({
    status: "error",
    message: err?.message || "Internal Server Error"
  });
}
