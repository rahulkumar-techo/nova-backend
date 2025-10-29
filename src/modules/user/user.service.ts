// src/modules/user/user.service.ts
// Description: Handles business logic for user operations (upload, update profile, etc.)

import userRepository, { IUserProfile } from "./user.repository";
import { FileManger } from "@/shared/utils/file-upload/fileManager";

const fileService = new FileManger();

class UserService {
  async updateUserProfile(
    userId: string,
    fullname: string,
    file?: Express.Multer.File,
    public_id?: string
  ) {
    // Fetch user
    const getUser = await userRepository.findOneUser({ userId });
    if (!getUser) throw new Error("User not found");

    // Determine Cloudinary ID
    const hasPublicId = getUser?.avatar?.public_id || "";

    // Upload new image or keep old one
    const uploadedImage = file
      ? (
          await fileService.updateFile(
            public_id || hasPublicId,
            file,
            `NovaNoteX/Profile/${userId}`
          )
        ).data
      : getUser.avatar;

    // Prepare update object
    const refactorUser: IUserProfile = {
      fullname,
      avatar: {
        secure_url: uploadedImage?.secure_url || getUser.avatar.secure_url,
        public_id: uploadedImage?.public_id || getUser.avatar.public_id,
      },
      userId,
    };

    // Update in database
    const updatedUser = await userRepository.findByIdAndUpdateUserProfile(
      refactorUser
    );

    return updatedUser;
  }
}

export default new UserService();
