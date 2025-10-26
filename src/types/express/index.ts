// types/user.d.ts
import { Types } from "mongoose";

export interface IRequestUser {
  _id: string | Types.ObjectId;
  email: string;
  username?: string;
  // ✅ Google or Local or Passwordless
  provider: "google" | "local" | "facebook" | "otp";
}


declare global {
  namespace Express {
    interface User extends IRequestUser {}
  }
}