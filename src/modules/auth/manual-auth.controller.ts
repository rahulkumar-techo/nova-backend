import { Request, Response } from "express";
import { IRegisterValidation, loginValidation, newPasswordValidation, registerValidation } from "./auth.validation";

import ResponseHandler from "@/utils/api-response.utils";
import manualAuthService from "./manual-auth.service";

class ManualAuthController {

  async register(req: Request, res: Response) {
    const { fullname, email, password, confirmPassword } = req.body as IRegisterValidation;
    const isValidData = registerValidation.parse({ fullname, email, password, confirmPassword });
    if (!isValidData) {
      return ResponseHandler.badRequest(res, "Not a valid data");
    }
    manualAuthService.registerUser(isValidData);
    return ResponseHandler.success(res, null, "Registerd success", 201)
  };
  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      const message = await manualAuthService.accountVerification(email, otp);
      return ResponseHandler.success(res, message);
    } catch (error: any) {
      return ResponseHandler.badRequest(res, error.message);
    }
  }
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      const message = await manualAuthService.forgotUserPassword(email);
      return ResponseHandler.success(res, message);
    } catch (error: any) {
      return ResponseHandler.badRequest(res, error.message);
    }
  }
  async newPassword(req: Request, res: Response) {
    try {
      const { email, password, confirmPassword } = req.body;
     const isValidField= newPasswordValidation.parse({email, password, confirmPassword});
     if(! isValidField){
      return ResponseHandler.badRequest(res,"Invalid field");
     }
      const message = await manualAuthService.setUserNewPassword(email, { password, confirmPassword });
      return ResponseHandler.success(res, message);
    } catch (error: any) {
      return ResponseHandler.badRequest(res, error.message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const validated = loginValidation.parse({ email, password });
      await manualAuthService.loginUser(validated, res);
      return ResponseHandler.success(res, "Login successful");
    } catch (err: any) {
      return ResponseHandler.error(res, err.message || "Login failed");
    }
  }
}

export default new ManualAuthController();
