import { z } from "zod";
import { packageSchema } from "./admin";

export const savedPackageSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  packageId: z.string().uuid(),
  createdAt: z.coerce.date(),
});

export const savedPackageEntrySchema = z.object({
  save: savedPackageSchema,
  package: packageSchema,
});

export type SavedPackageRecord = z.infer<typeof savedPackageSchema>;
export type SavedPackageEntryRecord = z.infer<typeof savedPackageEntrySchema>;
