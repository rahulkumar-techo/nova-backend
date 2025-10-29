
import z from "zod";

export const userProfileValidation =z.object({
    fullname:z.string(),
    avatar:z.object({
        secure_url:z.string(),
        public_id:z.string()
    })
})
export type IuserProfileValidation = z.infer<typeof userProfileValidation>;