import jwt, { JwtPayload } from "jsonwebtoken";
import ms from "ms";
import tokenRepository from "@/repositories/token.repository";
import { role } from "@/modules/user/user.schema";
import { IRequestUser } from "@/types/express";
import config_env from "@/configs/config-env";

export interface IPayload {
  _id: string;
  role: role;
}

export interface ITokenResult {
  accessToken: string;
  refreshToken: string;
  accessTTL: number;
  refreshTTL: number;
}

type TGenerateTokens = {
  user:IRequestUser;
  oldRefreshToken?: string;
  deviceId?: string;
  ip?: string;
};

export const generateTokens = async ({
  user,
  oldRefreshToken
}: TGenerateTokens): Promise<ITokenResult> => {

  if (!config_env.jwt_access_secret || !config_env.jwt_refresh_secret) {
    throw new Error("JWT secret keys are missing in environment variables");
  }

  const payload: IRequestUser = {
    _id: String(user._id),
    role:user?.role
  };

  // Expiry times
  const accessTokenExp = "15m";
  const refreshTokenExp = "7d";

  const accessTTL = Math.floor(ms(accessTokenExp) / 1000);
  const refreshTTL = Math.floor(ms(refreshTokenExp) / 1000);

  // Generate Tokens
  const accessToken = jwt.sign(payload, config_env.jwt_access_secret, { expiresIn: accessTTL });
  const refreshToken = jwt.sign(payload, config_env.jwt_refresh_secret, { expiresIn: refreshTTL });

  // Save refresh token in Redis + DB
await tokenRepository.handleRefreshToken({
  oldRefreshToken,
  userId: String(user._id),
  refreshTTL,
  refreshToken
});

  return { accessToken, refreshToken, accessTTL, refreshTTL };
};

/* --------------------- Token Expiry Check --------------------- */
export const isTokenExp = (token: string): boolean => {
  if (!token) return true;
  try {
    const decoded = jwt.verify(token, config_env.jwt_access_secret!) as JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    return (decoded.exp ?? 0) < currentTime;
  } catch {
    return true;
  }
};
