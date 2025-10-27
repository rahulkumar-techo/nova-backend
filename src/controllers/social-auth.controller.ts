/**
 * social-auth.ts
 * Description: Passport strategies only — delegates ALL business logic to AuthService.
 * - GoogleStrategy and GitHubStrategy are thin: they pass profile -> AuthService.findOrCreateUser
 * - Serialization / deserialization are minimal
 */

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Express } from "express";


import config_env from "@/helper/config-env";
import authService from "@/services/auth.service";

//  Keep provider names in sync with AuthService
type Provider = "google" | "github";

class SocialAuth {
  public initialize() {
    this.googleStrategy();
    this.githubStrategy();
    this.serialize();
  }

  /** Google Strategy (thin) */
  private googleStrategy() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config_env.google_client_id,
          clientSecret: config_env.google_secret_id,
          callbackURL: config_env.callback_url || "http://localhost:5000/auth/google/callback",
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const user = await authService.findOrCreateUser(profile, "google");
            return done(null, user);
          } catch (err) {
            return done(err as Error);
          }
        }
      )
    );
  }

  /** GitHub Strategy (thin) */
  private githubStrategy() {
    passport.use(
      new GitHubStrategy(
        {
          clientID: config_env.github_clinet_id,
          clientSecret: config_env.github_secret_id,
          callbackURL: config_env.github_callback_url || "http://localhost:5000/auth/github/callback",
          scope: ["user:email"],
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
          try {
            const user = await authService.findOrCreateUser(profile, "github");
            return done(null, user);
          } catch (err) {
            return done(err);
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
