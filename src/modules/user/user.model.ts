// src/models/user.model.ts
import mongoose, { Document, Schema, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./user.schema";

export interface IUserModel extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUserModel> = new Schema(
  {
    username: { type: String, required: true, minlength: 5, unique: true },
    fullname: { type: String, required: false },
    email: { type: String, required: [true, "email is required"], unique: true },
    password: { type: String, required: false, minlength: 6 },
    role: { type: String, enum: ["admin","instructor","student","guest"], default: "guest" },
    avatar: {
      secure_url: { type: String },
      public_id: { type: String },

    },
    social_auth: {
      googleId: { type: String },
      githubId: { type: String },
      microsoftId: { type: String },
    },
    provider:{type:String,enum:["local","github","microsoft","google"],default:'local'},
    lastLogin: { type: Date },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive", "banned"], default: "active" },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  },
  { timestamps: true }
);

// Pre-save hook
UserSchema.pre<IUserModel>("save", async function (next) {
  try {
    //  Generate username if missing
    if (!this.username) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const namePart = this.email!.split("@")[0]; // part of email
      this.username = `${namePart}_${randomNum}`;
    }

    //  Hash password if exists and modified
    if (this.password && this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (err) {
    next(err as any);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false; // No password set
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel: Model<IUserModel> = mongoose.model<IUserModel>("User", UserSchema);
