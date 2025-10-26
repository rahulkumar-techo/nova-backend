// src/modules/user/user.service.ts
import { UserRepository } from "./user.repository";
import { RegisterInput, LoginInput, PublicUser, PublicUserDTO } from "./user.dto";
import jwt from "jsonwebtoken";
import { IUserModel } from "./user.model";

export class UserService {
  constructor(private repo: UserRepository) {}
  // Register user (returns saved user)
  async register(input: RegisterInput): Promise<IUserModel> {
    // you may want to check for existing user first
    const exists = await this.repo.findByEmail(input.email);
    if (exists) throw new Error("Email already registered");

    const created = await this.repo.create({
      username: input.username,
      fullname: input.fullname,
      email: input.email,
      password: input.password
    });
    return created;
  }

  // Login: verifies credentials and returns user
  async login(input: LoginInput): Promise<IUserModel> {
    const user = await this.repo.findByEmail(input.email, true);
    if (!user) throw new Error("Invalid credentials");
    const ok = await user.comparePassword(input.password);
    if (!ok) throw new Error("Invalid credentials");

    // Optionally update lastLogin
    await this.repo.updateLastLogin(user._id.toString());

    return user;
  }

  // Map to public view (safe to send to client)
  toPublic(user: IUserModel): PublicUser {
    const dto = {
      id: user._id.toString(),
      username: user.username,
      fullname: user.fullname ?? null,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };
    return PublicUserDTO.parse(dto);
  }

generateJwt(user: IUserModel, expiresIn = "1h") {
  const payload = { id: user._id.toString(), role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || "replace-me", {expiresIn:'1h'});
}
}
