// src/modules/user/user.repository.ts

/**
 * UserRepository
 * Description: Database layer for User Model
 * - Handles user creation, search, and update queries
 * - Provider-safe queries for Google/GitHub social login
 */

import redis from "@/configs/redis-client";
import { IUserModel, UserModel } from "@/modules/user/user.model";
import { role } from "@/modules/user/user.schema";
import setTokenCookies from "@/utils/set-cookies.util";
import { generateTokens } from "@/utils/token.util";
import { Response } from "express";

type Provider = "google" | "github";

type ITokenUser ={
  _id:string;
  role:role
}

class UserRepository {
  /** Create a new user */
  async create(data: Partial<IUserModel>) {
    return UserModel.create(data);
  }

  /** Find user by social auth provider ID */
  async findBySocialId(socialId: string, provider: Provider) {
    const providerKey =
      provider === "google" ? "social_auth.googleId" : "social_auth.githubId";

    return UserModel.findOne({ [providerKey]: socialId }).exec();
  }

  /** Find user by email, optionally including password */
  async findByEmail(email: string, includePassword = false): Promise<IUserModel | null> {
    const query = UserModel.findOne({ email });
    if (includePassword) query.select("+password");
    return query.exec();
  }

  /** Find user by DB ID */
  async findById(id: string): Promise<IUserModel | null> {
    return UserModel.findById(id).exec();
  }

  /** Update user by ID with partial data */
  async update(id: string, data: Partial<IUserModel>) {
    return UserModel.findByIdAndUpdate(id, {$set:data}, { new: true }).exec();
  }
async findByEmailAndUpdate(email: string, data: Partial<IUserModel>) {
  return UserModel.findOneAndUpdate({ email }, { $set: data }, { new: true }).exec();
}



  /** Only update lastLogin timestamp */
  async updateLastLogin(id: string) {
    return UserModel.findByIdAndUpdate(
      id,
      { lastLogin: new Date() },
      { new: true }
    ).exec();
  }

  async SetTokens(res:Response,user:ITokenUser){
        const refactorUser = {
          _id: String(user._id),
          role: (user as any).role,
        };

        // Generate tokens (this handles storing refresh token too)
        const { accessToken, refreshToken, accessTTL, refreshTTL } = await generateTokens({
          user: refactorUser,
        });

        // Set cookies and store session in Redis
        setTokenCookies({ res, accessToken, refreshToken, accessTTL, refreshTTL });
        await redis.set(`session:${user._id}`, JSON.stringify(user), "EX", accessTTL);
  }

  // Future additions:
  // async delete(id: string) { ... }
  // async search(query: string) { ... }
}

export default new UserRepository();
