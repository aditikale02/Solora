import { Router, type IRouter } from "express";
import { and, desc, eq, ne } from "drizzle-orm";
import { z } from "zod";
import {
  adminLeadSchema,
  adminUploadTokenSchema,
  destinationInputSchema,
  destinationSchema,
  packageImageSchema,
  packageInputSchema,
  packageSchema,
  packageUpdateSchema,
} from "@workspace/api-zod";
import {
  db,
  destinationsTable,
  leadsTable,
  packageImagesTable,
  packagesTable,
} from "@workspace/db";
import { requireAdmin, type AdminRequest } from "../middleware/admin-auth";
import { supabaseAdmin } from "../lib/supabase";

const router: IRouter = Router();
const imageBucket = "trip-package-images";
const maxImageBytes = 5 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const adminUploadInputSchema = z.object({
  packageId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(240),
  contentType: z.string().trim().min(3).max(80),
  base64: z.string().trim().min(1),
  altText: z.string().trim().max(240).default(""),
  sortOrder: z.coerce.number().int().default(0),
  isHero: z.coerce.boolean().default(false),
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function mapDestination(row: typeof destinationsTable.$inferSelect) {
  return destinationSchema.parse({
    id: row.id,
    name: row.title,
    title: row.title,
    slug: row.slug,
    description: row.shortDescription,
    categoryId: row.categoryId ?? undefined,
    state: row.state,
    city: row.city,
    shortDescription: row.shortDescription,
    longDescription: row.longDescription,
    heroImageUrl: row.heroImageUrl,
    bestSeason: row.bestSeason,
    estimatedBudget: row.estimatedBudget,
    idealDurationDays: row.idealDurationDays,
    travelTips: row.travelTips,
    featured: row.featured,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

function mapPackage(row: typeof packagesTable.$inferSelect & { destinationName?: string | null }) {
  return packageSchema.parse({
    id: row.id,
    destinationId: row.destinationId,
    destinationName: row.destinationName ?? undefined,
    title: row.title,
    slug: row.slug,
    description: row.description,
    durationDays: row.durationDays,
    priceAmount: row.priceAmount,
    priceCurrency: row.priceCurrency,
    heroImageUrl: row.heroImageUrl,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

function mapPackageImage(row: typeof packageImagesTable.$inferSelect) {
  return packageImageSchema.parse({
    id: row.id,
    packageId: row.packageId,
    storagePath: row.storagePath,
    publicUrl: row.publicUrl,
    altText: row.altText,
    sortOrder: row.sortOrder,
    isHero: row.isHero,
    createdAt: row.createdAt,
  });
}

async function ensureImageBucket() {
  const { data } = await supabaseAdmin.storage.getBucket(imageBucket);

  if (data) {
    return;
  }

  const { error } = await supabaseAdmin.storage.createBucket(imageBucket, {
    public: true,
    fileSizeLimit: maxImageBytes,
    allowedMimeTypes: Array.from(allowedImageTypes),
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw error;
  }
}

async function uploadToStorageWithRetry(params: {
  storagePath: string;
  buffer: Buffer;
  contentType: string;
  maxAttempts?: number;
}) {
  const maxAttempts = params.maxAttempts ?? 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const { error } = await supabaseAdmin.storage
      .from(imageBucket)
      .upload(params.storagePath, params.buffer, {
        contentType: params.contentType,
        cacheControl: "31536000",
        upsert: false,
      });

    if (!error) {
      return;
    }

    const isLastAttempt = attempt === maxAttempts;
    if (isLastAttempt) {
      throw error;
    }

    // brief linear backoff for transient storage/upload failures
    await new Promise((resolve) => setTimeout(resolve, attempt * 150));
  }
}

router.use(requireAdmin);

router.get("/admin/me", (req: AdminRequest, res) => {
  return res.json({ user: req.adminUser });
});

router.get("/admin/destinations", async (_req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(destinationsTable)
      .orderBy(desc(destinationsTable.createdAt));

    return res.json({ destinations: rows.map(mapDestination) });
  } catch (error) {
    return next(error);
  }
});

router.post("/admin/destinations", async (req, res, next) => {
  try {
    const parsed = destinationInputSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid destination.", issues: parsed.error.flatten() });
    }

    const values = parsed.data;
    const title = values.title ?? values.name ?? "";
    const slug = values.slug ?? slugify(title);
    const [existing] = await db
      .select({ id: destinationsTable.id })
      .from(destinationsTable)
      .where(eq(destinationsTable.slug, slug))
      .limit(1);

    if (existing) {
      return res.status(409).json({ message: "A destination with this slug already exists." });
    }

    const [row] = await db
      .insert(destinationsTable)
      .values({
        title,
        categoryId: values.categoryId ?? null,
        slug,
        state: values.state,
        city: values.city,
        shortDescription: values.shortDescription ?? values.description ?? "",
        longDescription: values.longDescription,
        heroImageUrl: values.heroImageUrl,
        bestSeason: values.bestSeason,
        estimatedBudget: values.estimatedBudget,
        idealDurationDays: values.idealDurationDays,
        travelTips: values.travelTips,
        featured: values.featured,
        isActive: values.isActive,
      })
      .returning();

    return res.status(201).json({ destination: mapDestination(row) });
  } catch (error) {
    return next(error);
  }
});

router.put("/admin/destinations/:id", async (req, res, next) => {
  try {
    const idParsed = z.string().uuid().safeParse(req.params.id);
    if (!idParsed.success) {
      return res.status(400).json({ message: "Invalid destination id." });
    }

    const id = idParsed.data;
    const parsed = destinationInputSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid destination.", issues: parsed.error.flatten() });
    }

    const values = parsed.data;
    const title = values.title ?? values.name ?? "";
    const slug = values.slug ?? slugify(title);

    const [existing] = await db
      .select({ id: destinationsTable.id })
      .from(destinationsTable)
      .where(and(eq(destinationsTable.slug, slug), ne(destinationsTable.id, id)))
      .limit(1);

    if (existing) {
      return res.status(409).json({ message: "A destination with this slug already exists." });
    }

    const [row] = await db
      .update(destinationsTable)
      .set({
        title,
        categoryId: values.categoryId ?? null,
        slug,
        state: values.state,
        city: values.city,
        shortDescription: values.shortDescription ?? values.description ?? "",
        longDescription: values.longDescription,
        heroImageUrl: values.heroImageUrl,
        bestSeason: values.bestSeason,
        estimatedBudget: values.estimatedBudget,
        idealDurationDays: values.idealDurationDays,
        travelTips: values.travelTips,
        featured: values.featured,
        isActive: values.isActive,
        updatedAt: new Date(),
      })
      .where(eq(destinationsTable.id, id))
      .returning();

    if (!row) {
      return res.status(404).json({ message: "Destination not found." });
    }

    return res.json({ destination: mapDestination(row) });
  } catch (error) {
    return next(error);
  }
});

router.delete("/admin/destinations/:id", async (req, res, next) => {
  try {
    const idParsed = z.string().uuid().safeParse(req.params.id);
    if (!idParsed.success) {
      return res.status(400).json({ message: "Invalid destination id." });
    }

    const id = idParsed.data;

    // Prevent deleting a destination that still has packages
    const linked = await db
      .select()
      .from(packagesTable)
      .where(eq(packagesTable.destinationId, id))
      .limit(1);

    if (linked.length > 0) {
      return res.status(400).json({ message: "Cannot delete destination with packages." });
    }

    const [deleted] = await db
      .delete(destinationsTable)
      .where(eq(destinationsTable.id, id))
      .returning({ id: destinationsTable.id });

    if (!deleted) {
      return res.status(404).json({ message: "Destination not found." });
    }

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

router.get("/admin/packages", async (_req, res, next) => {
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
      .orderBy(desc(packagesTable.createdAt));

    return res.json({ packages: rows.map(mapPackage) });
  } catch (error) {
    return next(error);
  }
});

router.post("/admin/packages", async (req, res, next) => {
  try {
    const parsed = packageInputSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid package.", issues: parsed.error.flatten() });
    }

    const values = parsed.data;
    const [row] = await db
      .insert(packagesTable)
      .values({
        destinationId: values.destinationId,
        title: values.title,
        slug: values.slug ?? slugify(values.title),
        description: values.description,
        durationDays: values.durationDays,
        priceAmount: values.priceAmount,
        priceCurrency: values.priceCurrency,
        heroImageUrl: values.heroImageUrl,
        isActive: values.isActive,
      })
      .returning();

    return res.status(201).json({ package: mapPackage(row) });
  } catch (error) {
    return next(error);
  }
});

router.patch("/admin/packages/:id", async (req, res, next) => {
  try {
    const parsed = packageUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid package update.", issues: parsed.error.flatten() });
    }

    const values = parsed.data;
    const [row] = await db
      .update(packagesTable)
      .set({
        ...values,
        slug: values.slug ?? (values.title ? slugify(values.title) : undefined),
        updatedAt: new Date(),
      })
      .where(eq(packagesTable.id, req.params.id))
      .returning();

    if (!row) {
      return res.status(404).json({ message: "Package not found." });
    }

    return res.json({ package: mapPackage(row) });
  } catch (error) {
    return next(error);
  }
});

router.delete("/admin/packages/:id", async (req, res, next) => {
  try {
    const [row] = await db
      .delete(packagesTable)
      .where(eq(packagesTable.id, req.params.id))
      .returning({ id: packagesTable.id });

    if (!row) {
      return res.status(404).json({ message: "Package not found." });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.get("/admin/inquiries", async (_req, res, next) => {
  try {
    const rows = await db
      .select({
        id: leadsTable.id,
        fullName: leadsTable.fullName,
        email: leadsTable.email,
        phone: leadsTable.phone,
        selectedService: leadsTable.selectedService,
        selectedServiceSlug: leadsTable.selectedServiceSlug,
        budgetRange: leadsTable.budgetRange,
        status: leadsTable.status,
        source: leadsTable.source,
        createdAt: leadsTable.createdAt,
      })
      .from(leadsTable)
      .orderBy(desc(leadsTable.createdAt))
      .limit(50);

    return res.json({ inquiries: rows.map((row) => adminLeadSchema.parse(row)) });
  } catch (error) {
    return next(error);
  }
});

router.post("/admin/uploads", async (req, res, next) => {
  try {
    const parsed = adminUploadInputSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid upload payload.", issues: parsed.error.flatten() });
    }

    const { packageId, fileName, contentType, base64, altText, sortOrder, isHero } = parsed.data;

    if (!allowedImageTypes.has(contentType)) {
      return res.status(400).json({ message: "Only JPG, PNG, and WebP images are allowed." });
    }

    const buffer = Buffer.from(base64, "base64");

    if (buffer.byteLength > maxImageBytes) {
      return res.status(400).json({ message: "Image must be 5MB or smaller." });
    }

    await ensureImageBucket();

    const safeName = fileName.toLowerCase().replace(/[^a-z0-9_.-]+/g, "-");
    const storagePath = `${packageId}/${Date.now()}-${safeName}`;
    await uploadToStorageWithRetry({
      storagePath,
      buffer,
      contentType,
    });

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(imageBucket)
      .getPublicUrl(storagePath);

    const [image] = await db
      .insert(packageImagesTable)
      .values({
        packageId,
        storagePath,
        publicUrl: publicUrlData.publicUrl,
        altText,
        sortOrder,
        isHero,
      })
      .returning();

    if (isHero) {
      await db
        .update(packagesTable)
        .set({ heroImageUrl: publicUrlData.publicUrl, updatedAt: new Date() })
        .where(eq(packagesTable.id, packageId));
    }

    return res.status(201).json({
      upload: adminUploadTokenSchema.parse({
        bucket: imageBucket,
        path: storagePath,
        publicUrl: publicUrlData.publicUrl,
      }),
      image: mapPackageImage(image),
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
