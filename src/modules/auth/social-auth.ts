/**
 * Description: Passport configuration for Google & GitHub OAuth login
 * Handles verified emails, dummy fallback for GitHub, and user merging logic.
 */

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Profile } from "passport";
import { Express } from "express";

import socialValidation, { ISocialDTO } from "./auth.dto";
import UserRepository from "./auth.repository";
import config_env from "@/helper/config-env";

// Type-safe provider names
type Provider = "google" | "github";
export type PassportDone = (err: any, user?: Express.User | false | null, info?: any) => void;

// Extend Google and GitHub profiles for better typing
interface GoogleProfile extends Profile {
  _json: { email_verified?: boolean; picture?: string };
}
interface GitHubProfile extends Profile {
  _json: { avatar_url?: string };
}

class SocialAuth {
  public initialize() {
    this.googleStrategy();
    this.githubStrategy();
    this.serialize();
  }

  /** Get provider-based avatar URL */
  private getAvatar(profile: Profile, provider: Provider) {
    const urls: Record<Provider, string | undefined> = {
      google: (profile as GoogleProfile)._json?.picture || profile.photos?.[0]?.value,
      github: (profile as GitHubProfile)._json?.avatar_url || profile.photos?.[0]?.value,
    };
    const secure_url = urls[provider];
    return secure_url ? { secure_url, public_id: "" } : undefined;
  }

  /** Check if provider's email is verified */
  private isEmailVerified(profile: Profile, provider: Provider): boolean {
    return provider === "google"
      ? (profile as GoogleProfile)._json?.email_verified === true
      : true; // GitHub always trusted since OAuth verified
  }

  /** Validate and sanitize incoming social data */
  private validatedData(data: unknown): ISocialDTO {
    const parsed = socialValidation.parse(data);
    if (!parsed) throw new Error("Invalid provider data");
    return parsed;
  }

  /** Core function: find or create user by provider */
  private async findOrCreateUser(profile: Profile, provider: Provider) {
    console.log("Social profile received:", profile);
    const email = profile.emails?.[0]?.value || null;
    const isGoogle = provider === "google";

    // 1️⃣ Handle email verification for Google
    if (isGoogle && !email) throw new Error("Email not found from Google");
    if (isGoogle && !this.isEmailVerified(profile, "google")) {
      throw new Error("Google email not verified");
    }

    // 2️⃣ Find existing user by email or social ID
    let user = null;
    if (email) {
      user = await UserRepository.findByEmail(email);
    }
    if (!user) {
      user = await UserRepository.findBySocialId(profile.id, provider);
    }

    // 3️⃣ Prepare social_auth field dynamically
    const socialAuth = {
      ...(user?.social_auth || {}),
      ...(provider === "google" ? { googleId: profile.id } : { githubId: profile.id }),
    };

    // 4️⃣ Prepare avatar
    const avatar = this.getAvatar(profile, provider);

    // 5️⃣ Prepare final user data
    const finalData = {
      fullname: profile.displayName || profile.username || "User",
      username: profile.username || profile.displayName || `user_${Date.now()}`,
      email: email ?? `github_${profile.id}@placeholder.com`, // dummy email if missing
      isVerified: !!email,
      provider,
      social_auth: socialAuth,
      avatar,
    };

    // 6️⃣ Create or update user
    if (!user) {
      const validated = this.validatedData(finalData);
      user = await UserRepository.create(validated);
    } else {
      user.social_auth = socialAuth;
      if (avatar) user.avatar = avatar;
      user.lastLogin = new Date();
      await user.save();
    }

    return user;
  }

  /** Google Strategy */
  private googleStrategy() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config_env.google_client_id,
          clientSecret: config_env.google_secret_id,
          callbackURL: config_env.callback_url || "http://localhost:5000/auth/google/callback",
        },
        async (_access, _refresh, profile, done) => {
          try {
            const user = await this.findOrCreateUser(profile, "google");
            return done(null, user);
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }

  /** GitHub Strategy */
/**
 * GitHub OAuth Strategy - Handles login/signup using GitHub
 */
private githubStrategy() {
  passport.use(
    new GitHubStrategy(
      {
        clientID: config_env.github_clinet_id,
        clientSecret: config_env.github_secret_id,
        callbackURL: "http://localhost:5000/auth/github/callback",
        scope: ["user:email"],
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: GitHubProfile,
        done: (error: any, user?: any) => void
      ) => {
        try {
          const user = await this.findOrCreateUser(profile, "github");
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}


  /** Session serialize/deserialize */
  private serialize() {
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj: Express.User, done) => done(null, obj));
  }
}

const socialAuth = new SocialAuth();
socialAuth.initialize();
export default passport;
