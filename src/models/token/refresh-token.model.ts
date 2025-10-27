import mongoose, { Schema } from "mongoose";

interface IRefreshToken {
  userId: mongoose.Types.ObjectId;
  token: string;
  deviceId?: string;
  ip?: string;
  userAgent?: string;
  blacklist: boolean;
  createdAt: Date;
  expiresAt: Date;
  revokedAt?: Date | null;
  replacedByToken?: string;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: { type: String, required: true },
  deviceId: { type: String },
  ip: { type: String },
  userAgent: { type: String },
  blacklist: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },  
  revokedAt: { type: Date },
  replacedByToken: { type: String },
});

// TTL INDEX (auto delete expired tokens)
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IRefreshToken>(
  "UserRefreshToken",
  RefreshTokenSchema
);

