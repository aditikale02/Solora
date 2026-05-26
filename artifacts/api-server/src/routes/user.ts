import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import {
  recentlyViewedDestinationSchema,
  savedDestinationSchema,
  destinationSchema,
} from "@workspace/api-zod";
import {
  db,
  destinationsTable,
  recentlyViewedDestinationsTable,
  userSavedDestinationsTable,
} from "@workspace/db";
import { requireUser, type UserRequest } from "../middleware/user-auth";

const router: IRouter = Router();

function mapDestination(row: typeof destinationsTable.$inferSelect & { categoryTitle?: string | null }) {
  return destinationSchema.parse({
    id: row.id,
    categoryId: row.categoryId ?? undefined,
    title: row.title,
    slug: row.slug,
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

router.use(requireUser);

router.get("/user/saved-destinations", async (req: UserRequest, res, next) => {
  try {
    const rows = await db
      .select({
        id: userSavedDestinationsTable.id,
        userId: userSavedDestinationsTable.userId,
        destinationId: userSavedDestinationsTable.destinationId,
        createdAt: userSavedDestinationsTable.createdAt,
        destination: destinationsTable,
      })
      .from(userSavedDestinationsTable)
      .leftJoin(destinationsTable, eq(userSavedDestinationsTable.destinationId, destinationsTable.id))
      .where(eq(userSavedDestinationsTable.userId, req.sessionUser!.id))
      .orderBy(desc(userSavedDestinationsTable.createdAt));

    return res.json({
      savedDestinations: rows
        .filter((row) => row.destination)
        .map((row) => ({
          save: savedDestinationSchema.parse({
            id: row.id,
            userId: row.userId,
            destinationId: row.destinationId,
            createdAt: row.createdAt,
          }),
          destination: mapDestination(row.destination!),
        })),
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/user/saved-destinations", async (req: UserRequest, res, next) => {
  try {
    const destinationId = String(req.body?.destinationId ?? "").trim();
    if (!destinationId) {
      return res.status(400).json({ message: "destinationId is required." });
    }

    const [destination] = await db
      .select()
      .from(destinationsTable)
      .where(eq(destinationsTable.id, destinationId))
      .limit(1);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found." });
    }

    const [row] = await db
      .insert(userSavedDestinationsTable)
      .values({ userId: req.sessionUser!.id, destinationId })
      .onConflictDoUpdate({
        target: [userSavedDestinationsTable.userId, userSavedDestinationsTable.destinationId],
        set: { createdAt: new Date() },
      })
      .returning();

    return res.status(201).json({
      savedDestination: savedDestinationSchema.parse(row),
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/user/saved-destinations/:destinationId", async (req: UserRequest, res, next) => {
  try {
    const destinationId = String(req.params.destinationId ?? "").trim();

    const [deleted] = await db
      .delete(userSavedDestinationsTable)
      .where(and(eq(userSavedDestinationsTable.userId, req.sessionUser!.id), eq(userSavedDestinationsTable.destinationId, destinationId)))
      .returning({ id: userSavedDestinationsTable.id });

    if (!deleted) {
      return res.status(404).json({ message: "Saved destination not found." });
    }

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

router.get("/user/recently-viewed", async (req: UserRequest, res, next) => {
  try {
    const rows = await db
      .select({
        id: recentlyViewedDestinationsTable.id,
        userId: recentlyViewedDestinationsTable.userId,
        destinationId: recentlyViewedDestinationsTable.destinationId,
        viewedAt: recentlyViewedDestinationsTable.viewedAt,
        destination: destinationsTable,
      })
      .from(recentlyViewedDestinationsTable)
      .leftJoin(destinationsTable, eq(recentlyViewedDestinationsTable.destinationId, destinationsTable.id))
      .where(eq(recentlyViewedDestinationsTable.userId, req.sessionUser!.id))
      .orderBy(desc(recentlyViewedDestinationsTable.viewedAt))
      .limit(12);

    return res.json({
      recentlyViewed: rows
        .filter((row) => row.destination)
        .map((row) => ({
          view: recentlyViewedDestinationSchema.parse({
            id: row.id,
            userId: row.userId,
            destinationId: row.destinationId,
            viewedAt: row.viewedAt,
          }),
          destination: mapDestination(row.destination!),
        })),
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/user/recently-viewed", async (req: UserRequest, res, next) => {
  try {
    const destinationId = String(req.body?.destinationId ?? "").trim();
    if (!destinationId) {
      return res.status(400).json({ message: "destinationId is required." });
    }

    const [row] = await db
      .insert(recentlyViewedDestinationsTable)
      .values({ userId: req.sessionUser!.id, destinationId, viewedAt: new Date() })
      .onConflictDoUpdate({
        target: [recentlyViewedDestinationsTable.userId, recentlyViewedDestinationsTable.destinationId],
        set: { viewedAt: new Date() },
      })
      .returning();

    return res.status(201).json({
      recentlyViewed: recentlyViewedDestinationSchema.parse(row),
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
