import type { NextFunction, Request, Response } from "express";
import { getServerEnv } from "../lib/env";
import { supabaseAdmin } from "../lib/supabase";

const env = getServerEnv();
const adminEmails = new Set(
  env.ADMIN_EMAILS.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

export type AdminRequest = Request & {
  adminUser?: {
    id: string;
    email: string;
  };
};

function getBearerToken(req: Request): string | null {
  const header = req.header("authorization");

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length).trim();
}

export async function requireAdmin(
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user?.email) {
      return res.status(401).json({ message: "Invalid admin session." });
    }

    const email = data.user.email.toLowerCase();

    if (!adminEmails.has(email)) {
      return res.status(403).json({ message: "Admin access is not allowed." });
    }

    req.adminUser = {
      id: data.user.id,
      email,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}
