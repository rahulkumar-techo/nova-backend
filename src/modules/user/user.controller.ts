import { Request,Response } from "express";
class UserController {

    async editProfile(req:Request,res:Response){
        const {fullname,avatar} = req.body;
        
    }
}