
import { generateTokens, ITokenResult } from "@/utils/token.util";
import { NextFunction, Request, Response } from "express";
import refreshTokenModel from "../../modules/token/refresh-token.model";
import tokenRepository from "../../repositories/token.repository";
import jwt from "jsonwebtoken"
import { IRequestUser } from "@/types/express";
import config_env from "@/configs/config-env";
import authRepository from "@/repositories/auth.repository";

interface IRefreshAccessToken {
  req: Request,
  oldRefreshToken: string
}
const RefreshAccessToken = async (
  { req, oldRefreshToken }: IRefreshAccessToken
): Promise<ITokenResult | null> => {
  try {
    if (!oldRefreshToken) return null;

    if (!config_env.jwt_refresh_secret) throw new Error("JWT secret missing");

    const storedToken = tokenRepository.findOne(oldRefreshToken);
    // if (!storedToken || storedToken.blacklist) return null;

    const decoded = jwt.verify(oldRefreshToken, config_env.jwt_refresh_secret) as IRequestUser;
    if (!decoded) return null;

    const user = await authRepository.findById(String(decoded?._id));
    if (!user) return null;

    const destructuredUser:IRequestUser ={
      _id:user?._id,
      role:user?.role
    } 
    return await generateTokens({ user:destructuredUser, oldRefreshToken });
  } catch (error) {
    console.error("❌ Refresh Token Error:", error);
    return null;
  }
};


export default RefreshAccessToken;