import config_env from "@/configs/config-env";
import { role } from "@/modules/user/user.schema";
import { IRequestUser } from "@/types/express";
import ResponseHandler from "@/utils/api-response.utils";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


/**
 * Authentication middleware
 * Verifies JWT access token and attaches user info to req.user
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1️⃣ Get token from Authorization header or cookies
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const token = tokenFromHeader || req.cookies?.accessToken;

    if (!token) {
      return ResponseHandler.unauthorized(res, "Access token missing");
    }

    if (!config_env.jwt_access_secret) {
      return ResponseHandler.error(res, null, "JWT secret missing");
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, config_env.jwt_access_secret) as JwtPayload & {
      _id: string;
      roles: role;
    };

    // 3️⃣ Attach safe user object to request
    const safeUser: IRequestUser = {
      _id: decoded._id,
      role: decoded.role ||"guest",
    };

    req.user = safeUser;

    next();
  } catch (error: any) {
    console.error("❌ Authentication Error:", error);
    return ResponseHandler.unauthorized(res, "Invalid or expired token");
  }
};