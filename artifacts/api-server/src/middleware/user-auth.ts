import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { getBearerToken } from "./admin-auth";

export type UserRequest = Request & {
  sessionUser?: {
    id: string;
    email: string;
    fullName?: string;
  };
};

export async function requireUser(req: UserRequest, res: Response, next: NextFunction) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user?.email) {
      return res.status(401).json({ message: "Invalid session." });
    }

    req.sessionUser = {
      id: data.user.id,
      email: data.user.email.toLowerCase(),
      fullName: (data.user.user_metadata?.full_name as string | undefined) ?? undefined,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}
