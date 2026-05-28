import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import {
  recentlyViewedDestinationSchema,
  savedPackageSchema,
  savedDestinationSchema,
  destinationSchema,
  packageSchema,
} from "@workspace/api-zod";
import {
  db,
  destinationsTable,
  packagesTable,
  recentlyViewedDestinationsTable,
  userSavedDestinationsTable,
  userSavedPackagesTable,
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
    features: row.features,
    heroImageUrl: row.heroImageUrl,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

router.use(requireUser);

router.get("/user/saved-packages", async (req: UserRequest, res, next) => {
  try {
    const rows = await db
      .select({
        id: userSavedPackagesTable.id,
        userId: userSavedPackagesTable.userId,
        packageId: userSavedPackagesTable.packageId,
        createdAt: userSavedPackagesTable.createdAt,
        package: packagesTable,
        destinationName: destinationsTable.title,
      })
      .from(userSavedPackagesTable)
      .leftJoin(packagesTable, eq(userSavedPackagesTable.packageId, packagesTable.id))
      .leftJoin(destinationsTable, eq(packagesTable.destinationId, destinationsTable.id))
      .where(eq(userSavedPackagesTable.userId, req.sessionUser!.id))
      .orderBy(desc(userSavedPackagesTable.createdAt));

    return res.json({
      savedPackages: rows
        .filter((row) => row.package)
        .map((row) => ({
          save: savedPackageSchema.parse({
            id: row.id,
            userId: row.userId,
            packageId: row.packageId,
            createdAt: row.createdAt,
          }),
          package: mapPackage({ ...row.package!, destinationName: row.destinationName ?? undefined }),
        })),
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/user/saved-packages", async (req: UserRequest, res, next) => {
  try {
    const packageId = String(req.body?.packageId ?? "").trim();

    if (!packageId) {
      return res.status(400).json({ message: "packageId is required." });
    }

    const [travelPackage] = await db
      .select()
      .from(packagesTable)
      .where(eq(packagesTable.id, packageId))
      .limit(1);

    if (!travelPackage || !travelPackage.isActive) {
      return res.status(404).json({ message: "Package not found." });
    }

    const [row] = await db
      .insert(userSavedPackagesTable)
      .values({ userId: req.sessionUser!.id, packageId })
      .onConflictDoUpdate({
        target: [userSavedPackagesTable.userId, userSavedPackagesTable.packageId],
        set: { createdAt: new Date() },
      })
      .returning();

    return res.status(201).json({
      savedPackage: savedPackageSchema.parse(row),
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/user/saved-packages/:packageId", async (req: UserRequest, res, next) => {
  try {
    const packageId = String(req.params.packageId ?? "").trim();

    const [deleted] = await db
      .delete(userSavedPackagesTable)
      .where(
        and(
          eq(userSavedPackagesTable.userId, req.sessionUser!.id),
          eq(userSavedPackagesTable.packageId, packageId),
        ),
      )
      .returning({ id: userSavedPackagesTable.id });

    if (!deleted) {
      return res.status(404).json({ message: "Saved package not found." });
    }

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

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
