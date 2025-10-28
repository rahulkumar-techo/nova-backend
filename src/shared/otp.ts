import jwt from "jsonwebtoken";
import { generateOTP } from "./otp-gen";
import config_env from "@/configs/config-env";


const OTP_SECRET = config_env.otp_secret || "supersecretkey";

// Generates a 6-digit OTP and signs it with JWT (expires in 5 mins)
export const generateSignedOtp = (): { otp: string; token: string } => {
  const otp = generateOTP();
  const payload = { otp };
  
  // Sign OTP with 5-minute expiry
  const token = jwt.sign(payload, OTP_SECRET, { expiresIn: "5m" });
  return { otp, token };
};

// Verifies JWT OTP token and returns the decoded OTP if valid.
export const verifySignedOtp = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, OTP_SECRET) as { otp: string };
    return decoded.otp;
  } catch {
    return null; // invalid or expired
  }
};
