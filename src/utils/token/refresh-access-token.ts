
import { ITokenResult } from "@/utils/token.util";
import { NextFunction, Request, Response } from "express";
import refreshTokenModel from "../../models/token/refresh-token.model";
import tokenRepository from "./token.repository";
import jwt from "jsonwebtoken"

interface IPayload {
  _id: string;
  roles: ("user" | "admin" | "provider" | "guest")[];
}

interface IRefreshAccessToken {
  req: Request,
  oldRefreshToken: string
}
const RefreshAccessToken = async (
  { req, oldRefreshToken }: IRefreshAccessToken
): Promise<ITokenResult | null> => {
  try {
    if (!oldRefreshToken) return null;

    if (!process.env.JWT_REFRESH_TOKEN_KEY) throw new Error("JWT secret missing");

    const storedToken = tokenRepository.findOne(oldRefreshToken);
    // if (!storedToken || storedToken.blacklist) return null;

    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_TOKEN_KEY) as IPayload;
    if (!decoded) return null;

    const user = await UserModel.findById(decoded._id);
    if (!user) return null;

    return await generateTokens({ user, oldRefreshToken });
  } catch (error) {
    console.error("❌ Refresh Token Error:", error);
    return null;
  }
};


export default RefreshAccessToken;