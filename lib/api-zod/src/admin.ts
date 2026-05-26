import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const imageUrlSchema = z
  .string()
  .trim()
  .url()
  .max(2000)
  .or(z.literal(""));

export const adminUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
});

export const destinationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(160).regex(slugPattern),
  description: z.string().trim().max(2000).default(""),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const destinationInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(160).regex(slugPattern).optional(),
  description: z.string().trim().max(2000).default(""),
});

export const packageSchema = z.object({
  id: z.string().uuid(),
  destinationId: z.string().uuid(),
  destinationName: z.string().trim().min(2).max(160).optional(),
  title: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(180).regex(slugPattern),
  description: z.string().trim().min(10).max(5000),
  durationDays: z.number().int().min(1).max(365),
  priceAmount: z.number().int().min(0).max(100000000),
  priceCurrency: z.string().trim().min(3).max(8),
  heroImageUrl: imageUrlSchema,
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const packageInputSchema = z.object({
  destinationId: z.string().uuid(),
  title: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(180).regex(slugPattern).optional(),
  description: z.string().trim().min(10).max(5000),
  durationDays: z.coerce.number().int().min(1).max(365),
  priceAmount: z.coerce.number().int().min(0).max(100000000),
  priceCurrency: z.string().trim().min(3).max(8).default("INR"),
  heroImageUrl: imageUrlSchema.default(""),
  isActive: z.coerce.boolean().default(true),
});

export const packageUpdateSchema = packageInputSchema.partial();

export const packageImageSchema = z.object({
  id: z.string().uuid(),
  packageId: z.string().uuid(),
  storagePath: z.string().trim().min(1).max(1000),
  publicUrl: z.string().trim().url().max(2000),
  altText: z.string().trim().max(240),
  sortOrder: z.number().int(),
  isHero: z.boolean(),
  createdAt: z.coerce.date(),
});

export const packageImageInputSchema = z.object({
  packageId: z.string().uuid(),
  storagePath: z.string().trim().min(1).max(1000),
  publicUrl: z.string().trim().url().max(2000),
  altText: z.string().trim().max(240).default(""),
  sortOrder: z.coerce.number().int().default(0),
  isHero: z.coerce.boolean().default(false),
});

export const adminLeadSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  selectedService: z.string(),
  selectedServiceSlug: z.string(),
  budgetRange: z.string(),
  status: z.string(),
  source: z.string(),
  createdAt: z.coerce.date(),
});

export const adminUploadTokenSchema = z.object({
  bucket: z.string(),
  path: z.string(),
  publicUrl: z.string().url(),
});

export const adminUploadResponseSchema = z.object({
  upload: adminUploadTokenSchema,
  image: packageImageSchema,
});

export type AdminUser = z.infer<typeof adminUserSchema>;
export type DestinationRecord = z.infer<typeof destinationSchema>;
export type DestinationInput = z.infer<typeof destinationInputSchema>;
export type PackageRecord = z.infer<typeof packageSchema>;
export type PackageInput = z.infer<typeof packageInputSchema>;
export type PackageUpdate = z.infer<typeof packageUpdateSchema>;
export type PackageImageRecord = z.infer<typeof packageImageSchema>;
export type PackageImageInput = z.infer<typeof packageImageInputSchema>;
export type AdminLeadRecord = z.infer<typeof adminLeadSchema>;
export type AdminUploadToken = z.infer<typeof adminUploadTokenSchema>;
export type AdminUploadResponse = z.infer<typeof adminUploadResponseSchema>;
