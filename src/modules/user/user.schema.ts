// src/models/user.model.ts
import { z } from 'zod';

// 1️⃣ Define the user schema
export const UserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['admin', 'user']).default('user'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// 2️⃣ Define a TypeScript type from the schema
export type UserType = z.infer<typeof UserSchema>;
