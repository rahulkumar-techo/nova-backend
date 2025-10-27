// src/modules/user/user.repository.ts

/**
 * UserRepository
 * Description: Database layer for User Model
 * - Handles user creation, search, and update queries
 * - Provider-safe queries for Google/GitHub social login
 */

import { IUserModel, UserModel } from "../models/auth/user.model";

type Provider = "google" | "github";

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
    return UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /** Only update lastLogin timestamp */
  async updateLastLogin(id: string) {
    return UserModel.findByIdAndUpdate(
      id,
      { lastLogin: new Date() },
      { new: true }
    ).exec();
  }

  // Future additions:
  // async delete(id: string) { ... }
  // async search(query: string) { ... }
}

export default new UserRepository();
