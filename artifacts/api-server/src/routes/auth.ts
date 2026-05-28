import { Router, type IRouter } from "express";
import { sessionRoleSchema } from "@workspace/api-zod";
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
    const role = (await isAdminEmail(email)) ? "admin" : "user";

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

router.post("/auth/register", async (req, res, next) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "").trim();
    const fullName = String(req.body?.fullName ?? "").trim();

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "email, password, and fullName are required." });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (error) {
      const status = error.message.toLowerCase().includes("already exists") ? 409 : 400;
      return res.status(status).json({ message: error.message });
    }

    return res.status(201).json({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
