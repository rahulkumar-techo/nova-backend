// src/modules/user/user.repository.ts

import { IUserModel, UserModel } from "@/models/auth/user.model";


export class UserRepository {
  async create(data: Partial<IUserModel>) {
    return UserModel.create(data);
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
