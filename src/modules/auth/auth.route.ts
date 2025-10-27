// src/routes/auth.routes.ts
import express from "express";
import passport from "./social-auth"; 

const authRoute = express.Router();

// Google OAuth Routes
// Redirect user to Google for authentication
authRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback URL
authRoute.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful login
    res.redirect("/"); // or generate JWT here
  }
);

// GitHub OAuth Routes
// Redirect user to GitHub for authentication
authRoute.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub callback URL
authRoute.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful login
    res.redirect("/"); // or generate JWT here
  }
);



export default authRoute;
