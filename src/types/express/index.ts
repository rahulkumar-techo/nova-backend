import { Types } from "mongoose";

export interface IRequestUser {
  _id: string | Types.ObjectId;
  email: string;
  username?: string;
  provider: "google" | "github" | "microsoft" | "local";
}

declare global {
  namespace Express {
    interface User extends IRequestUser {}
  }
}
