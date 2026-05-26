import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { asc, desc, eq } from "drizzle-orm";
import { supabaseAdmin } from "../lib/supabase";
import {
  contactSubmissionInputSchema,
  contactSubmissionResponseSchema,
  leadInquiryInputSchema,
  leadInquiryResponseSchema,
  newsletterSubscriptionInputSchema,
  newsletterSubscriptionResponseSchema,
  packageImageSchema,
  packageSchema,
  serviceSchema,
} from "@workspace/api-zod";
import {
  db,
  destinationsTable,
  packageImagesTable,
  packagesTable,
} from "@workspace/db";
import {
  renderContactConfirmationEmail,
  renderContactNotificationEmail,
  renderLeadConfirmationEmail,
  renderLeadNotificationEmail,
  renderNewsletterNotificationEmail,
  sendBusinessEmail,
  sendCustomerEmail,
} from "../lib/emails";

const router: IRouter = Router();

const publicSubmissionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

function sanitizeInput(value: string): string {
  return value.replace(/\u0000/g, "").trim();
}

function sanitizePayload<T extends Record<string, string>>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, sanitizeInput(value)]),
  ) as T;
}

router.get("/services", async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("services")
      .select("id,title,slug,description,is_active,created_at,updated_at")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    const services = (data ?? []).map((service) =>
      serviceSchema.parse({
        id: service.id,
        title: service.title,
        slug: service.slug,
        description: service.description,
        isActive: service.is_active,
        createdAt: service.created_at,
        updatedAt: service.updated_at,
      }),
    );

    return res.json({ services });
  } catch (error) {
    return next(error);
  }
});

router.get("/packages", async (_req, res, next) => {
  try {
    const rows = await db
      .select({
        id: packagesTable.id,
        destinationId: packagesTable.destinationId,
        destinationName: destinationsTable.title,
        title: packagesTable.title,
        slug: packagesTable.slug,
        description: packagesTable.description,
        durationDays: packagesTable.durationDays,
        priceAmount: packagesTable.priceAmount,
        priceCurrency: packagesTable.priceCurrency,
        heroImageUrl: packagesTable.heroImageUrl,
        isActive: packagesTable.isActive,
        createdAt: packagesTable.createdAt,
        updatedAt: packagesTable.updatedAt,
      })
      .from(packagesTable)
      .leftJoin(destinationsTable, eq(packagesTable.destinationId, destinationsTable.id))
      .where(eq(packagesTable.isActive, true))
      .orderBy(desc(packagesTable.createdAt));

    const packages = rows.map((row) =>
      packageSchema.parse({
        ...row,
        destinationName: row.destinationName ?? undefined,
      }),
    );

    return res.json({ packages });
  } catch (error) {
    return next(error);
  }
});

router.get("/packages/:slug", async (req, res, next) => {
  try {
    const slug = req.params.slug;

    const [travelPackage] = await db
      .select({
        id: packagesTable.id,
        destinationId: packagesTable.destinationId,
        destinationName: destinationsTable.title,
        title: packagesTable.title,
        slug: packagesTable.slug,
        description: packagesTable.description,
        durationDays: packagesTable.durationDays,
        priceAmount: packagesTable.priceAmount,
        priceCurrency: packagesTable.priceCurrency,
        heroImageUrl: packagesTable.heroImageUrl,
        isActive: packagesTable.isActive,
        createdAt: packagesTable.createdAt,
        updatedAt: packagesTable.updatedAt,
      })
      .from(packagesTable)
      .leftJoin(destinationsTable, eq(packagesTable.destinationId, destinationsTable.id))
      .where(eq(packagesTable.slug, slug))
      .limit(1);

    if (!travelPackage || !travelPackage.isActive) {
      return res.status(404).json({ message: "Package not found." });
    }

    const images = await db
      .select()
      .from(packageImagesTable)
      .where(eq(packageImagesTable.packageId, travelPackage.id))
      .orderBy(asc(packageImagesTable.sortOrder), asc(packageImagesTable.createdAt));

    return res.json({
      package: packageSchema.parse({
        ...travelPackage,
        destinationName: travelPackage.destinationName ?? undefined,
      }),
      images: images.map((image) => packageImageSchema.parse(image)),
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/inquiries", publicSubmissionRateLimit, async (req, res, next) => {
  try {
    const parsed = leadInquiryInputSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid inquiry payload.",
        issues: parsed.error.flatten(),
      });
    }

    const payload = sanitizePayload(parsed.data);

    const { data: service, error: serviceError } = await supabaseAdmin
      .from("services")
      .select("title,slug,description")
      .eq("slug", payload.selectedServiceSlug)
      .maybeSingle();

    if (serviceError) {
      return res.status(503).json({
        message: "Unable to verify the selected service right now.",
      });
    }

    if (!service) {
      return res.status(400).json({ message: "Selected service is not available." });
    }

    const { data: lead, error: insertError } = await supabaseAdmin
      .from("leads")
      .insert({
        full_name: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        company_name: payload.companyName,
        selected_service: service.title,
        selected_service_slug: service.slug,
        budget_range: payload.budgetRange,
        message: payload.message,
        source: payload.source,
        status: "new",
      })
      .select("id")
      .single();

    if (insertError) {
      return res.status(502).json({
        message: "We could not store the inquiry right now. Please try again.",
      });
    }

    const notification = renderLeadNotificationEmail({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      companyName: payload.companyName,
      selectedService: service.title,
      budgetRange: payload.budgetRange,
      message: payload.message,
      source: payload.source,
    });

    const confirmation = renderLeadConfirmationEmail({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      companyName: payload.companyName,
      selectedService: service.title,
      budgetRange: payload.budgetRange,
      message: payload.message,
      source: payload.source,
    });

    const [businessEmailResult, customerEmailResult] = await Promise.allSettled([
      sendBusinessEmail({
        ...notification,
        replyTo: payload.email,
      }),
      sendCustomerEmail({
        to: payload.email,
        ...confirmation,
      }),
    ]);

    return res.status(201).json(
      leadInquiryResponseSchema.parse({
        ok: true,
        message: "Inquiry received. We’ll reach out shortly.",
        leadId: lead.id,
        notificationSent: businessEmailResult.status === "fulfilled",
        confirmationSent: customerEmailResult.status === "fulfilled",
      }),
    );
  } catch (error) {
    return next(error);
  }
});

router.post("/contact-submissions", publicSubmissionRateLimit, async (req, res, next) => {
  try {
    const parsed = contactSubmissionInputSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid contact payload.",
        issues: parsed.error.flatten(),
      });
    }

    const payload = sanitizePayload(parsed.data);

    const { data: submission, error: insertError } = await supabaseAdmin
      .from("contact_submissions")
      .insert({
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        source: payload.source,
      })
      .select("id")
      .single();

    if (insertError) {
      return res.status(502).json({
        message: "We could not store the message right now. Please try again.",
      });
    }

    const notification = renderContactNotificationEmail(payload);
    const confirmation = renderContactConfirmationEmail(payload);

    const [businessEmailResult, customerEmailResult] = await Promise.allSettled([
      sendBusinessEmail({
        ...notification,
        replyTo: payload.email,
      }),
      sendCustomerEmail({
        to: payload.email,
        ...confirmation,
      }),
    ]);

    return res.status(201).json(
      contactSubmissionResponseSchema.parse({
        ok: true,
        message: "Message received. We’ll respond soon.",
        submissionId: submission.id,
        notificationSent: businessEmailResult.status === "fulfilled",
        confirmationSent: customerEmailResult.status === "fulfilled",
      }),
    );
  } catch (error) {
    return next(error);
  }
});

router.post("/newsletter", publicSubmissionRateLimit, async (req, res, next) => {
  try {
    const parsed = newsletterSubscriptionInputSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid newsletter payload.",
        issues: parsed.error.flatten(),
      });
    }

    const payload = sanitizePayload(parsed.data);

    const { data: subscriber, error: upsertError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .upsert(
        {
          email: payload.email,
          source: payload.source,
        },
        { onConflict: "email" },
      )
      .select("id")
      .single();

    if (upsertError) {
      return res.status(502).json({
        message: "We could not subscribe you right now. Please try again.",
      });
    }

    const notification = renderNewsletterNotificationEmail(payload.email);
    const businessEmailResult = await Promise.allSettled([
      sendBusinessEmail({
        ...notification,
        replyTo: payload.email,
      }),
    ]);

    return res.status(201).json(
      newsletterSubscriptionResponseSchema.parse({
        ok: true,
        message: "You’re on the list.",
        subscriberId: subscriber.id,
        notificationSent: businessEmailResult[0]?.status === "fulfilled",
      }),
    );
  } catch (error) {
    return next(error);
  }
});

export default router;