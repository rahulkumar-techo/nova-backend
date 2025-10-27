// src/modules/user/user.repository.ts

import { IUserModel, UserModel } from "../user/user.model";


class UserRepository {
  async create(data: Partial<IUserModel>) {
    return UserModel.create(data);
  }
  async findBySocialId(socialId: string, provider: string) {
    if (provider === "google") {
      return UserModel.findOne({ "social_auth.googleId": socialId }).exec();
    }
    if (provider === "github") {
      return UserModel.findOne({ "social_auth.githubId": socialId }).exec();
    }
    return null;
  }


  async findByEmail(email: string, includePassword = false): Promise<IUserModel | null> {
    if (includePassword) return UserModel.findOne({ email }).select("+password").exec();
    return UserModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<IUserModel | null> {
    return UserModel.findById(id).exec();
  }

  async updateLastLogin(id: string) {
    return UserModel.findByIdAndUpdate(id, { lastLogin: new Date() }).exec();
  }

  // additional helpers (update, delete) can be added here
}

export default new UserRepository;