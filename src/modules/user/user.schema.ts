import mongoose from "mongoose";

type role = "guest" | "instructor" | "student" | "admin";

type IAvatar  = {
  secure_url?: string;
  public_id?: string;
}

export interface ISocialAuth {
  googleId?: string;
  githubId?: string;
  microsoftId?: string;
}



export interface IUser {
  
  username: string;
  fullname?: string;
  email: string;
  role: role;
  password?: string;
  avatar?: IAvatar ;
  social_auth?: ISocialAuth;
  notes?: mongoose.Types.ObjectId[];
  isVerified?: boolean;
  lastLogin?: Date;
  provider: "google" | "github" | "microsoft" | "local";
  status?: "active" | "inactive" | "banned";
}