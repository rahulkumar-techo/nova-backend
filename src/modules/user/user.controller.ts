// src/modules/user/user.controller.ts
// Description: Handles request/response for user profile routes

import { Request, Response } from "express";
import ResponseHandler from "@/shared/utils/api-response.utils";
import userService from "./user.service";

export class UserController {
  /**
   * Edit user profile
   */
  async editProfile(req: Request, res: Response) {
    try {
      const { fullname, public_id } = req.body;
      const file = req.file as Express.Multer.File | undefined;

      const userId = req?.user?._id as string;

      const updatedUser = await userService.updateUserProfile(
        userId,
        fullname,
        file,
        public_id
      );

      return ResponseHandler.success(
        res,
        updatedUser,
        "Profile updated successfully ✅",
        200
      );
    } catch (error: any) {
      return ResponseHandler.error(res, error.message);
    }
  }
}
