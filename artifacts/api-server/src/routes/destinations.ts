import { Router, type IRouter } from "express";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import {
  destinationCategorySchema,
  destinationImageSchema,
  destinationSchema,
} from "@workspace/api-zod";
import {
  db,
  destinationCategoriesTable,
  destinationImagesTable,
  destinationsTable,
} from "@workspace/db";

const router: IRouter = Router();

function mapDestination(row: typeof destinationsTable.$inferSelect) {
  return destinationSchema.parse({
    id: row.id,
    categoryId: row.categoryId ?? undefined,
    title: row.title,
    slug: row.slug,
    state: row.state,
    city: row.city,
    shortDescription: row.shortDescription,
    longDescription: row.longDescription,
    tags: row.tags,
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

router.get("/categories", async (_req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(destinationCategoriesTable)
      .orderBy(asc(destinationCategoriesTable.sortOrder), asc(destinationCategoriesTable.title));

    return res.json({
      categories: rows.map((row) => destinationCategorySchema.parse(row)),
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/categories/:slug", async (req, res, next) => {
  try {
    const slug = String(req.params.slug ?? "").trim();
    const [category] = await db
      .select()
      .from(destinationCategoriesTable)
      .where(eq(destinationCategoriesTable.slug, slug))
      .limit(1);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const destinations = await db
      .select()
      .from(destinationsTable)
      .where(and(eq(destinationsTable.categoryId, category.id), eq(destinationsTable.isActive, true)))
      .orderBy(desc(destinationsTable.featured), desc(destinationsTable.createdAt));

    return res.json({
      category: destinationCategorySchema.parse(category),
      destinations: destinations.map(mapDestination),
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/destinations", async (req, res, next) => {
  try {
    const search = String(req.query.search ?? "").trim();
    const state = String(req.query.state ?? "").trim();
    const category = String(req.query.category ?? "").trim();
    const season = String(req.query.season ?? "").trim();
    const budget = String(req.query.budget ?? "").trim();
    const duration = String(req.query.duration ?? "").trim();

    const clauses = [eq(destinationsTable.isActive, true)];

    if (search) {
      clauses.push(
        or(
          ilike(destinationsTable.title, `%${search}%`),
          ilike(destinationsTable.state, `%${search}%`),
          ilike(destinationsTable.city, `%${search}%`),
          ilike(destinationsTable.shortDescription, `%${search}%`),
        )!,
      );
    }

    if (state) {
      clauses.push(eq(destinationsTable.state, state));
    }

    if (category) {
      const [categoryRow] = await db
        .select({ id: destinationCategoriesTable.id })
        .from(destinationCategoriesTable)
        .where(eq(destinationCategoriesTable.slug, category))
        .limit(1);

      if (categoryRow) {
        clauses.push(eq(destinationsTable.categoryId, categoryRow.id));
      }
    }

    if (season) {
      clauses.push(ilike(destinationsTable.bestSeason, `%${season}%`));
    }

    if (budget) {
      clauses.push(ilike(destinationsTable.estimatedBudget, `%${budget}%`));
    }

    if (duration) {
      const parsedDuration = Number(duration);
      if (!Number.isNaN(parsedDuration)) {
        clauses.push(eq(destinationsTable.idealDurationDays, parsedDuration));
      }
    }

    const rows = await db
      .select()
      .from(destinationsTable)
      .where(and(...clauses))
      .orderBy(desc(destinationsTable.featured), desc(destinationsTable.createdAt));

    return res.json({ destinations: rows.map(mapDestination) });
  } catch (error) {
    return next(error);
  }
});

router.get("/destinations/:slug", async (req, res, next) => {
  try {
    const slug = String(req.params.slug ?? "").trim();
    const [destination] = await db
      .select()
      .from(destinationsTable)
      .where(eq(destinationsTable.slug, slug))
      .limit(1);

    if (!destination || !destination.isActive) {
      return res.status(404).json({ message: "Destination not found." });
    }

    const images = await db
      .select()
      .from(destinationImagesTable)
      .where(eq(destinationImagesTable.destinationId, destination.id))
      .orderBy(asc(destinationImagesTable.sortOrder), asc(destinationImagesTable.createdAt));

    return res.json({
      destination: mapDestination(destination),
      images: images.map((row) => destinationImageSchema.parse(row)),
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
