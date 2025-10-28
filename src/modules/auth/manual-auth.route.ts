import express from "express";
import manualAuthController from "./manual-auth.controller";
import autoRefreshAccessToken from "@/middlewares/auto-refreshAccess-token";
import { authenticate } from "@/middlewares/auth.middleware";
const manualRoute = express();

manualRoute.route("/register").post(manualAuthController.register);
manualRoute.route("/account-verification").post(manualAuthController.verifyOtp);
manualRoute.route("/forgot-password").post(manualAuthController.forgotPassword);
manualRoute.route("/password-verificatio").post(manualAuthController.verifyOtp);
manualRoute.route("/new-password").post(manualAuthController.newPassword);
manualRoute.route("/login").post(manualAuthController.login);
manualRoute.route("/me").get(autoRefreshAccessToken, authenticate, async (req, res) => {
    try {
        return res.json({
            success: true,
            body: req?.user
        })
    } catch (error) {
        console.log(error)
    }
});


export default manualRoute;