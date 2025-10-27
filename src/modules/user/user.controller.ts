// src/modules/user/user.controller.ts
import { Request, Response } from "express";

import ResponseHandler from "@/utils/api-response.utils";
import { UserRepository } from "@/repositories/user.repository";
import { UserService } from "@/modules/user/user.service";
import { LoginDTO, RegisterDTO } from "@/modules/user/user.validation";


// Manual DI; in larger app use container
const repo = new UserRepository();
const service = new UserService(repo);

export class UserController {
  // POST /api/users/register
async register(req: Request, res: Response) {
  try {
    const request_data = {
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
    };
    const validated = RegisterDTO.parse(request_data);
    if(!validated){
      return ResponseHandler.badRequest(res, "Invalid input");
    }
    const user = await service.register(validated);
    const publicUser = service.toPublic(user);

    return ResponseHandler.created(res, publicUser, "User created");
  } catch (err: any) {
    console.error("Register error:", err);
    return ResponseHandler.error(res, err.message ?? "Registration failed", "Registration failed", 400);
  }
}


  // POST /api/users/login
  async login(req: Request, res: Response) {
    try {
      const validated = LoginDTO.parse(req.body);
      const user = await service.login(validated);
      const token = service.generateJwt(user, "1h"); // access token
      const publicUser = service.toPublic(user);

      return ResponseHandler.success(res, { user: publicUser, token }, "Login successful");
    } catch (err: any) {
      return ResponseHandler.error(res, err.message ?? "Login failed", "Login failed", 401);
    }
  }

  // GET /api/users/me  (protected)
  async me(req: Request, res: Response) {
    const userId = (req as any).userId as string;
    if (!userId) return ResponseHandler.unauthorized(res);

    const user = await repo.findById(userId);
    if (!user) return ResponseHandler.notFound(res, "User not found");

    return ResponseHandler.success(res, service.toPublic(user), "OK");
  }
}
