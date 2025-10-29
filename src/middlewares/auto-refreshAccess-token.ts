import ResponseHandler from "@/shared/utils/api-response.utils";
import setTokenCookies from "@/shared/utils/set-cookies.util";
import { isTokenExp } from "@/shared/utils/token.util";
import RefreshAccessToken from "@/shared/utils/token/refresh-access-token";
import { NextFunction, Request, Response } from "express";



/**
 * Middleware to auto-refresh access token if it's expired or missing.
 * - Checks if accessToken exists and is valid
 * - If expired or missing, uses refreshToken to get new accessToken
 * - Attaches updated accessToken to Authorization header
 */
const autoRefreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let accessToken = req.cookies?.accessToken;
    // if accessToken  exists and not expired then just pass
    if (accessToken && !isTokenExp(accessToken)) {
      req.headers["authorization"] = `Bearer ${accessToken}`;
      return next();
    }

    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return ResponseHandler.unauthorized(res, "Refresh token missing");
    }

    // Refresh tokens
    const tokens = await RefreshAccessToken({req,oldRefreshToken:refreshToken});
    if (!tokens) {
      return ResponseHandler.unauthorized(res, "Invalid or expired refresh token");
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken, accessTTL, refreshTTL } = tokens;

    // Set cookies
    setTokenCookies({ res, accessToken: newAccessToken, refreshToken: newRefreshToken, accessTTL, refreshTTL });

    req.headers["authorization"] = `Bearer ${newAccessToken}`;

    next();
  } catch (error: any) {
    console.error("Auto-refresh error:", error);
    if (!res.headersSent) {
      return ResponseHandler.error(res, error.message || "Something went wrong");
    }
  }
};


export default autoRefreshAccessToken;