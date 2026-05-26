import { z } from "zod";

export const sessionRoleSchema = z.object({
  role: z.enum(["anonymous", "user", "admin"]),
  email: z.string().email().optional(),
  userId: z.string().uuid().optional(),
  fullName: z.string().trim().max(160).optional(),
});

export type SessionRole = z.infer<typeof sessionRoleSchema>;
