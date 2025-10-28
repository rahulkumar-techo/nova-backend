import { email, z } from "zod";

export const socialValidation = z.object({
  fullname: z.string().trim(),
  email: z.string().email(),
  avatar: z.object({
    secure_url: z.string().optional(),
    public_id: z.string().optional(),
  }).optional(),
  username: z.string().trim().optional(),
  social_auth: z.object({
    googleId: z.string().optional(),
    githubId: z.string().optional(),
  }),
  isVerified: z.boolean(),
  provider: z.enum(["google", "github"]),
});

export type ISocialDTO = z.infer<typeof socialValidation>;
export default socialValidation;

// Login validation

export const loginValidation =z.object({
  email:z.string().email(),
  password:z.string()
})
export type ILoginValidation = z.infer<typeof loginValidation>;


export const registerValidation = z
  .object({
    fullname: z
      .string()
      .min(5, "Full name must be at least 3 characters long")
      .max(50, "Full name too long"),

    email: z
      .string()
      .email("Invalid email format"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters long"),

    confirmPassword: z
      .string()
      .min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // highlight confirmPassword field
  });
export type IRegisterValidation = z.infer<typeof registerValidation>;


export const newPasswordValidation = z.object({
  email:z.string().email(),
  password:z.string(),
  confirmPassword:z.string()
}).refine((data)=>data.password===data.confirmPassword,{
  message:"",
  path:['confirmPassword']
})