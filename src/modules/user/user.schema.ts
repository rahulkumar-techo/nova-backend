import mongoose from "mongoose";

type role = "guest" | "instructor" | "student" | "admin";

type avatar = {
  secure_url: string;
  public_id: string;
}

type social_auth = {
  googleId?: string;
  facebookId?: string;
}



export interface IUser {
  
  username: string;
  fullname?: string;
  email: string;
  role: role;
  password?: string;
  avatar?: avatar;
  social_auth?: social_auth;
  notes?: mongoose.Types.ObjectId[];
  isVerified?: boolean;
  lastLogin?: Date;
  status?: "active" | "inactive" | "banned";
}