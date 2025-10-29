// src/shared/utils/file-upload/file.service.ts
// Description: Service layer for file operations

import { FileRepository } from "./file.repository";

export class FileManger {
  private repo = new FileRepository();

  async uploadFiles(files: Express.Multer.File[], folder: string) {
    const start = performance.now();

    const results = await Promise.all(
      files.map((file) => this.repo.uploadFile(file.buffer, folder))
    );

    return {
      responseTimeMs: Math.round(performance.now() - start),
      data: results.map((r: any) => ({
        secure_url: r.secure_url,
        public_id: r.public_id,
        bytes: r.bytes,
      })),
    };
  }

  async updateFile(public_id: string, file: Express.Multer.File, folder: string) {
    const start = performance.now();

    // Delete old image from Cloudinary (if exists)
    if (public_id) await this.repo.deleteFile(public_id);

    // Upload new image
    const result: any = await this.repo.uploadFile(file.buffer, folder);

    return {
      responseTimeMs: Math.round(performance.now() - start),
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        bytes: result.bytes,
      },
    };
  }

  async deleteFiles(public_ids: string[]) {
    const start = performance.now();
    const results = await Promise.all(public_ids.map((id) => this.repo.deleteFile(id)));

    return {
      responseTimeMs: Math.round(performance.now() - start),
      data: results,
    };
  }
}
