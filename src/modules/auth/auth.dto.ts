import { z } from "zod";

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
