
import { generateTokens, ITokenResult } from "@/utils/token.util";
import { NextFunction, Request, Response } from "express";
import refreshTokenModel from "../../models/token/refresh-token.model";
import tokenRepository from "../../repositories/token.repository";
import jwt from "jsonwebtoken"
import { UserRepository } from "@/repositories/user.repository";
import { IRequestUser } from "@/types/express";


const user_repository_instance = new UserRepository()
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

    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_TOKEN_KEY) as IRequestUser;
    if (!decoded) return null;

    const user = await user_repository_instance.findById(String(decoded?._id));
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