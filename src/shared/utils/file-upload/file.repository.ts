// src/repositories/file.repository.ts
// Description: Repository layer that talks directly with Cloudinary API
import { uploadToCloudinary, deleteFromCloudinary } from "@/shared/utils/file-upload/uploadToCloudinary";

export class FileRepository {
  async uploadFile(buffer: Buffer, folder: string) {
    return await uploadToCloudinary(buffer, folder);
  }

  async deleteFile(public_id: string) {
    return await deleteFromCloudinary(public_id);
  }
}
