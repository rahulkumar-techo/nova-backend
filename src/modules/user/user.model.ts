// src/models/user.model.ts
import mongoose, { Document, Schema, Model } from "mongoose";
import { UserType } from "schemas/user.schema";


// Extend Document with UserType
export interface IUserModel extends UserType, Document {
  comparePassword: (password: string) => Promise<boolean>;
}

//  Mongoose schema definition
const UserSchema: Schema<IUserModel> = new Schema(
  {
    username: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 }, // include password
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

//  Export model
export const UserModel: Model<IUserModel> = mongoose.model<IUserModel>("User", UserSchema);
