// src/routes/auth.routes.ts
import express, { Request, Response, NextFunction } from "express";
import passport from "@/modules/auth/social-auth.controller";
import { generateTokens } from "@/shared/utils/token.util";
import setTokenCookies from "@/shared/utils/set-cookies.util";
import redis from "@/configs/redis-client";
import { IRequestUser } from "@/types/express/index";
import autoRefreshAccessToken from "@/middlewares/auto-refreshAccess-token";
import { authenticate } from "@/middlewares/auth.middleware";

const authRoute = express.Router();

/**
 * Reusable OAuth callback handler
 * - provider: "google" | "github"
 * - options: passport options for initial redirect (scopes)
 */
const oauthInit = (provider: string, options?: any) => {
  return passport.authenticate(provider, options);
};

const oauthCallback =
  (provider: "google" | "github") =>
  (req: Request, res: Response, next: NextFunction) => {
    // passport callback style: (err, user, info) => {}
    passport.authenticate(provider, async (err: any, user: IRequestUser | false) => {
      try {
        if (err || !user) {
          // handle error / failed auth
          return res.redirect("http://localhost:5000?error=oauth_failed");
        }

        // Build the minimal user object expected by generateTokens (Option A: single role)
        const refactorUser = {
          _id: String(user._id),
          role: (user as any).role, // keep as-is (single role)
        };

        // Generate tokens (this handles storing refresh token too)
        const { accessToken, refreshToken, accessTTL, refreshTTL } = await generateTokens({
          user: refactorUser,
        });

        // Set cookies and store session in Redis
        setTokenCookies({ res, accessToken, refreshToken, accessTTL, refreshTTL });
        await redis.set(`session:${user._id}`, JSON.stringify(user), "EX", accessTTL);

        // Successful login -> Redirect to frontend home (R1)
        return res.redirect("/");
      } catch (error) {
        // Log error and redirect
        // You may want to use a logger instead of console
        console.error("OAuth callback error:", error);
        return res.redirect("/error");
      }
    })(req, res, next);
  };

/* -------------------------- GOOGLE -------------------------- */
// Redirect user to Google for authentication
authRoute.get("/google", oauthInit("google", { scope: ["profile", "email"] }));

// Google callback
authRoute.get("/google/callback", oauthCallback("google"));

/* -------------------------- GITHUB -------------------------- */
// Redirect user to GitHub for authentication
authRoute.get("/github", oauthInit("github", { scope: ["user:email"] }));

// GitHub callback
authRoute.get("/github/callback", oauthCallback("github"));
authRoute.get("/me",autoRefreshAccessToken,authenticate,(req,res)=>{
  res.status(201).json({success:true,message:"me"})
})

export default authRoute;
