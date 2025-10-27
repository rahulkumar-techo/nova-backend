import { Types } from "mongoose";

export interface IRequestUser {
  _id: string | Types.ObjectId;
  email?: string;
  provider?: "google" | "github" ;
  role:"guest" | "instructor" | "student" | "admin"
}

declare global {
  namespace Express {
    // 👇 extend passport's User type
    interface User extends IRequestUser {}
  }
}
