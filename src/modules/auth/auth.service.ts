
/**
 * AuthService
 * Description: Single service containing ALL social auth business logic:
 *  - findOrCreateUser
 *  - validatedData (DTO)
 *  - isEmailVerified (provider-specific)
 *  - getAvatar (provider-specific) — (Option A: store provider URL only)
 *  - generateDummyEmailIfMissing
 *  - merge/update social_auth
 *
 * Notes:
 *  - This file intentionally centralizes social logic so passport strategies remain thin.
 *  - isVerified behavior: GitHub (and other non-Google providers) are treated as trusted => isVerified = true (per user's choice B).
 */

import { Profile } from "passport";
import socialValidation, { ISocialDTO } from "./auth.dto";
import UserRepository from "./auth.repository";

type Provider = "google" | "github";

interface GoogleProfile extends Profile {
  _json: { email_verified?: boolean; picture?: string; email?: string };
}
interface GitHubProfile extends Profile {
  _json: { avatar_url?: string; email?: string };
}

class AuthService {
  /** Check if provider's email is verified */
  private isEmailVerified(profile: Profile, provider: Provider): boolean {
    if (provider === "google") {
      return (profile as GoogleProfile)._json?.email_verified === true;
    }
    // For GitHub and other providers, treat OAuth as trusted (user chose Option B).
    return true;
  }

  /** Validate and sanitize incoming social data using DTO parser */
  public validatedData(data: unknown): ISocialDTO {
    try {
      const parsed = socialValidation.parse(data);
      if (!parsed) throw new Error("Invalid provider data after parsing");
      return parsed;
    } catch (err) {
      // rethrow with clearer context
      throw new Error(`Social data validation failed: ${(err as Error).message}`);
    }
  }

  /** Generate a dummy email when provider does not provide one (GitHub fallback) */
  private generateDummyEmailIfMissing(profile: Profile, provider: Provider): string {
    const email = profile.emails?.[0]?.value || (profile as any)._json?.email || null;
    if (email) return email;
    // dummy fallback pattern
    return `${provider}_${profile.id}@placeholder.com`;
  }

  /** Extract provider-based Avatar URL (Option A: keep provider URL only) */
  public getAvatar(profile: Profile, provider: Provider) {
    const urls: Record<Provider, string | undefined> = {
      google: (profile as GoogleProfile)._json?.picture || profile.photos?.[0]?.value,
      github: (profile as GitHubProfile)._json?.avatar_url || profile.photos?.[0]?.value,
    };
    const secure_url = urls[provider];
    return secure_url ? { secure_url, public_id: "" } : undefined;
  }

  /** Merge/extend social_auth object on existing user */
  private mergeSocialAuth(existingSocialAuth: any, provider: Provider, profileId: string) {
    const merged = { ...(existingSocialAuth || {}) };
    if (provider === "google") merged.googleId = profileId;
    if (provider === "github") merged.githubId = profileId;
    return merged;
  }

  /**
   * Core: find or create user using provider profile
   * - For Google: require email present and verified
   * - For GitHub: allow missing email and generate a dummy one; isVerified = true per user choice
   */
  public async findOrCreateUser(profile: Profile, provider: Provider) {
    const emailFromProfile = profile.emails?.[0]?.value || (profile as any)._json?.email || null;
    const email = this.generateDummyEmailIfMissing(profile, provider);

    //  Google-specific checks
    if (provider === "google") {
      if (!emailFromProfile) throw new Error("Email not found from Google");
      if (!this.isEmailVerified(profile, "google")) {
        throw new Error("Google email not verified");
      }
    }

    //  Find existing user either by email or social id
    let user: any = null;
    if (emailFromProfile) {
      user = await UserRepository.findByEmail(emailFromProfile);
    }
    if (!user) {
      user = await UserRepository.findBySocialId(profile.id, provider);
    }

    //  Prepare social_auth merge/update
    const socialAuth = this.mergeSocialAuth(user?.social_auth, provider, profile.id);

    //  Prepare avatar
    const avatar = this.getAvatar(profile, provider);

    //  Decide isVerified flag:
    // Per the user's choice B, treat GitHub as trusted (isVerified = true).
    // Google is already checked above via isEmailVerified.
    const isVerified =
      provider === "google" ? this.isEmailVerified(profile, "google") : true;

    //  Prepare final user data
    const finalData = {
      fullname: profile.displayName || profile.username || "User",
      username: (profile.username as string) || profile.displayName || `user_${Date.now()}`,
      email: email, // uses real or dummy
      isVerified,
      provider,
      social_auth: socialAuth,
      avatar,
    };

    //  Create or update user
    if (!user) {
      // Validate before creating
      const validated = this.validatedData(finalData);
      user = await UserRepository.create(validated);
    } else {
      // Update existing user: attach social auth, avatar if present, and lastLogin
      user.social_auth = socialAuth;
      if (avatar) user.avatar = avatar;
      user.lastLogin = new Date();
     
      if (typeof user.save === "function") {
        await user.save();
      } else {
        
        await UserRepository.update(user._id || user.id, {
          social_auth: user.social_auth,
          avatar: user.avatar,
          lastLogin: user.lastLogin,
        });
      }
    }

    return user;
  }
}

export default new AuthService();
