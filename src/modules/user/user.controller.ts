// src/modules/user/user.controller.ts
// Description: Handles user profile editing and image upload to Cloudinary

import { FileManger } from "@/shared/utils/file-upload/fileManager";
import { Request, Response } from "express";


const fileService = new FileManger();

export class UserController {
  /**
   * Edit user profile and upload profile image (if provided)
   */
  async editProfile(req: Request, res: Response) {
    try {
      const { fullname, public_id } = req.body; // existing Cloudinary ID (if replacing)
      const file = req.file as Express.Multer.File | undefined;

      let uploadedImage = null;

      if (file) {
        const uploadResult = await fileService.updateFile(
          public_id || "",   
          file,               
          "NovaNoteX/Profiles" 
        );

        uploadedImage = uploadResult.data;
      }

      // 🧠 Example: update user details in DB
      // await UserModel.findByIdAndUpdate(req.user._id, {
      //   fullname,
      //   avatar: uploadedImage?.url,
      //   avatarPublicId: uploadedImage?.public_id,
      // });

      return res.status(200).json({
        message: "Profile updated successfully ✅",
        fullname,
        image: uploadedImage,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Profile update failed ❌",
        error: error.message,
      });
    }
  }
}
