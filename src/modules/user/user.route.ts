
import express from "express";
import {UserController} from "@/modules/user/user.controller";

const userRouter = express.Router();
const controller = new UserController();
userRouter.route("/register").post((req, res) => controller.register(req, res));


// Define your user routes here
export default userRouter;
