import { email, z } from "zod";

/**
 ** DTOs (Data Transfer Objects) for User module using Zod
 */


 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register (incoming data for signup)
export const RegisterDTO = z.object({
  username: z.string().min(3).optional(), 
  fullname: z.string().min(1).optional(),
  email: z.string().regex(emailRegex,"Invalid email format"),
  password: z.string().min(6)
});
export type RegisterInput = z.infer<typeof RegisterDTO>;

// Login DTO
export const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
export type LoginInput = z.infer<typeof LoginDTO>;

// Public user view (what we send to clients)
export const PublicUserDTO = z.object({
  id: z.string(),
  username: z.string(),
  fullname: z.string().nullable().optional(),
  email: z.string(),
  role: z.string(),
  avatar: z
    .object({
      secure_url: z.string(),
      public_id: z.string()
    })
    .optional()
});
export type PublicUser = z.infer<typeof PublicUserDTO>;
