/**
 * Global error handling middleware.
 */

import { log } from "@/shared/utils/logger";
import { NextFunction, Request, Response } from "express";


export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  log.error(err?.message || "Unknown error");
  const status = err?.status || 500;
  res.status(status).json({
    status: "error",
    message: err?.message || "Internal Server Error"
  });
}
