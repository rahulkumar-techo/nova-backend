
import jwt, { JwtPayload } from "jsonwebtoken";
import ms from "ms";
import { IRequestUser } from "@/types/express";
import "dotenv/config";

if (!process.env.JWT_ACCESS_TOKEN_KEY || !process.env.JWT_REFRESH_TOKEN_KEY) {
  // Throwing during import helps catch missing env early during dev
  throw new Error("Missing JWT env keys: JWT_ACCESS_TOKEN_KEY or JWT_REFRESH_TOKEN_KEY");
}

export const ACCESS_EXP = "15m";
export const REFRESH_EXP = "7d";

export const ACCESS_TTL_SECONDS = Math.floor(ms(ACCESS_EXP) / 1000);
export const REFRESH_TTL_SECONDS = Math.floor(ms(REFRESH_EXP) / 1000);

export const signAccessToken = (payload: IRequestUser): string => {
  return jwt.sign(payload as object, process.env.JWT_ACCESS_TOKEN_KEY!, {
    expiresIn: ACCESS_EXP,
  });
};

export const signRefreshToken = (payload: IRequestUser): string => {
  return jwt.sign(payload as object, process.env.JWT_REFRESH_TOKEN_KEY!, {
    expiresIn: REFRESH_EXP,
  });
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_KEY!) as JwtPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_KEY!) as JwtPayload;
  } catch {
    return null;
  }
};

export const isJwtExpired = (token: string, secretKey: string): boolean => {
  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    const now = Math.floor(Date.now() / 1000);
    return (decoded.exp ?? 0) < now;
  } catch {
    return true;
  }
};
