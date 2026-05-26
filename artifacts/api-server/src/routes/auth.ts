import { Router, type IRouter } from "express";
import { sessionRoleSchema } from "@workspace/api-zod";
import { adminUsersTable, db } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getBearerToken, isAdminEmail } from "../middleware/admin-auth";
import { supabaseAdmin } from "../lib/supabase";

const router: IRouter = Router();

router.get("/auth/role", async (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.json(sessionRoleSchema.parse({ role: "anonymous" }));
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user?.email) {
      return res.json(sessionRoleSchema.parse({ role: "anonymous" }));
    }

    const email = data.user.email.toLowerCase();
    const metadataName = (data.user.user_metadata?.full_name as string | undefined) ?? undefined;
    const [adminRow] = await db
      .select({ id: adminUsersTable.id })
      .from(adminUsersTable)
      .where(eq(adminUsersTable.email, email))
      .limit(1);

    const role = (await isAdminEmail(email)) || Boolean(adminRow) ? "admin" : "user";

    return res.json(
      sessionRoleSchema.parse({
        role,
        email,
        userId: data.user.id,
        fullName: metadataName,
      }),
    );
  } catch (error) {
    return next(error);
  }
});

export default router;
