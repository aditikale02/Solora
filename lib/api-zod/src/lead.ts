import { z } from "zod";

const serviceSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const leadSourceSchema = z.enum([
  "website",
  "hero_cta",
  "navbar_cta",
  "final_cta_primary",
  "final_cta_secondary",
  "footer_contact",
  "newsletter",
  "trip_selector",
  "contact_link",
]);

export const leadStatusSchema = z.enum([
  "new",
  "contacted",
  "in_progress",
  "closed",
]);

export const serviceSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(2).max(160),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .regex(serviceSlugPattern),
  description: z.string().trim().min(5).max(2000),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const leadInquiryInputSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(7).max(32),
  companyName: z.string().trim().max(160).optional().default(""),
  website: z.string().trim().max(0).default(""),
  selectedServiceSlug: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .regex(serviceSlugPattern),
  budgetRange: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(5000),
  source: leadSourceSchema.default("website"),
});

export const leadInquiryResponseSchema = z.object({
  ok: z.literal(true),
  message: z.string(),
  leadId: z.string().uuid(),
  notificationSent: z.boolean(),
  confirmationSent: z.boolean(),
});

export const newsletterSubscriptionInputSchema = z.object({
  email: z.string().trim().email().max(320),
  website: z.string().trim().max(0).default(""),
  source: leadSourceSchema.default("newsletter"),
});

export const newsletterSubscriptionResponseSchema = z.object({
  ok: z.literal(true),
  message: z.string(),
  subscriberId: z.string().uuid(),
  notificationSent: z.boolean(),
});

export const contactSubmissionInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(320),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  website: z.string().trim().max(0).default(""),
  source: leadSourceSchema.default("footer_contact"),
});

export const contactSubmissionResponseSchema = z.object({
  ok: z.literal(true),
  message: z.string(),
  submissionId: z.string().uuid(),
  notificationSent: z.boolean(),
  confirmationSent: z.boolean(),
});

export type LeadSource = z.infer<typeof leadSourceSchema>;
export type LeadStatus = z.infer<typeof leadStatusSchema>;
export type ServiceRecord = z.infer<typeof serviceSchema>;
export type LeadInquiryInput = z.infer<typeof leadInquiryInputSchema>;
export type LeadInquiryResponse = z.infer<typeof leadInquiryResponseSchema>;
export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionInputSchema>;
export type NewsletterSubscriptionResponse = z.infer<typeof newsletterSubscriptionResponseSchema>;
export type ContactSubmissionInput = z.infer<typeof contactSubmissionInputSchema>;
export type ContactSubmissionResponse = z.infer<typeof contactSubmissionResponseSchema>;