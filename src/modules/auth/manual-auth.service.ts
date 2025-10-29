/**
 * ManualAuthService
 * ----------------------------------------------------
 * Handles manual authentication (register, login, OTP verification, password reset)
 * Includes:
 * - JWT-based OTP verification (5-min expiry)
 * - Secure password hashing (bcrypt)
 * - Dual flow for account + password verification
 */

import UserRepository from "@/repositories/auth.repository";
import { ILoginValidation, IRegisterValidation } from "./auth.validation";
import { Response } from "express";
import bcrypt from "bcryptjs";
import { generateSignedOtp, verifySignedOtp } from "@/shared/otp";
import { resendMailProvider } from "@/shared/resend-mail";
import { otpTemplate } from "@/templates/otp.template";
import { forgotPasswordTemplate } from "@/templates/forgotPassword.template";

class ManualAuthService {

  randomString(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

  /** -------------------- REGISTER -------------------- */
  async registerUser(data: IRegisterValidation): Promise<void> {
    
    try {
      const unique = Date.now() +this.randomString(5);
      const username = data.fullname?.replace(/\s+/g, "").toLowerCase().concat(String(unique));
      const { otp, token } = generateSignedOtp();

      const newData = { ...data, username, otpToken: token };
      const user = await UserRepository.create(newData);

      if (!user) throw new Error("User not created");

      await resendMailProvider({
        to: data.email,
        subject: "Verify your NovaNoteX account",
        html: otpTemplate({ name: data.fullname, otp }),
      });

      console.log(`✅ OTP sent to ${data.email}: ${otp}`);
    } catch (error: any) {
      console.error("❌ Register Error:", error.message);
      throw new Error(error.message || "Failed to register user");
    }
  }

  /** -------------------- ACCOUNT / PASSWORD VERIFICATION -------------------- */
  async accountVerification(email: string, otp: string): Promise<string> {
    try {
      const user = await UserRepository.findByEmail(email, true);
      if (!user || !user.otpToken) throw new Error("User not found or token missing");

      const decodedOtp = verifySignedOtp(user.otpToken);
      if (!decodedOtp) throw new Error("OTP expired or invalid");
      if (decodedOtp !== otp) throw new Error("Incorrect OTP");

      if (!user.isVerified) {
        await UserRepository.findByEmailAndUpdate(email, {
          isVerified: true,
          otpToken: "",
        });
        return "Account verified successfully ✅";
      }

      await UserRepository.findByEmailAndUpdate(email, {
        isResetVerified: true,
        otpToken: "",
      });

      return "Password reset verified successfully ✅";
    } catch (error: any) {
      console.error("❌ Verification Error:", error.message);
      throw new Error(error.message || "Failed to verify OTP");
    }
  }

  /** -------------------- FORGOT PASSWORD -------------------- */
  async forgotUserPassword(email: string): Promise<string> {
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) throw new Error("User not found");

      const { otp, token } = generateSignedOtp();
      await UserRepository.findByEmailAndUpdate(email, {
        otpToken: token,
        isResetVerified: false,
      });

      await resendMailProvider({
        to: email,
        subject: "Reset Your NovaNoteX Password",
        html: forgotPasswordTemplate({
          name: user.fullname || "User",
          otp,
        }),
      });

      console.log(`🔐 Forgot password OTP sent to: ${email}`);
      return `OTP sent to 📧 ${email}`;
    } catch (error: any) {
      console.error("❌ Forgot Password Error:", error.message);
      throw new Error(error.message || "Failed to send forgot password OTP");
    }
  }

  /** -------------------- SET NEW PASSWORD -------------------- */
  async setUserNewPassword(
    email: string,
    data: { password: string; confirmPassword: string }
  ): Promise<string> {
    try {
      if (!data || data.password !== data.confirmPassword)
        throw new Error("Passwords do not match");

      const user = await UserRepository.findByEmail(email, true);
      if (!user) throw new Error("User not found");
      if (!user.isResetVerified)
        throw new Error("OTP verification required before resetting password");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      await UserRepository.findByEmailAndUpdate(email, {
        password: hashedPassword,
        isResetVerified: false,
      });

      console.log(`🔑 Password updated for user: ${email}`);
      return "Password updated successfully ✅";
    } catch (error: any) {
      console.error("❌ Set Password Error:", error.message);
      throw new Error(error.message || "Failed to set new password");
    }
  }

  /** -------------------- LOGIN -------------------- */
  async loginUser(data: ILoginValidation, res: Response): Promise<void> {
    try {
      const { email, password } = data;
      const user = await UserRepository.findByEmail(email, true);
      if (!user) throw new Error("Unauthorized access");

      const isPasswordMatched = await bcrypt.compare(password, user.password as string);
      if (!isPasswordMatched) throw new Error("Unauthorized access");

      await UserRepository.SetTokens(res, {
        _id: String(user._id),
        role: user.role,
      });
    } catch (error: any) {
      console.error("❌ Login Error:", error.message);
      throw new Error(error.message || "Login failed");
    }
  }
}

export default new ManualAuthService();
