// src/modules/user/user.routes.ts
import express from "express";
import multer from "multer";
import { UserController } from "./user.controller";

const userEditRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const userController = new UserController();

userEditRoute.put("/edit-profile", upload.single("avatar"), (req, res) =>
  userController.editProfile(req, res)
);

export default userEditRoute;
