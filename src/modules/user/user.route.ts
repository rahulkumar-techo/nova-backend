// src/modules/user/user.routes.ts
import express from "express";
import multer from "multer";
import { UserController } from "./user.controller";
import autoRefreshAccessToken from "@/middlewares/auto-refreshAccess-token";
import { authenticate } from "@/middlewares/auth.middleware";

const userEditRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const userController = new UserController();

userEditRoute.put("/edit-profile", upload.single("avatar"),
  autoRefreshAccessToken,
  authenticate,
  userController.editProfile);

export default userEditRoute;
