import "server-only";
import { HttpError } from "./service";
import { currentUser } from "../supabase/server";
import { accountsEnabled } from "../supabase/env";

/** Website routes: a signed-in user, and (for changes) a same-origin request. */
export async function requireUser(req: Request, mutating: boolean) {
  if (!accountsEnabled) throw new HttpError(503, "accounts_disabled", "Accounts aren't set up on this site yet.");
  if (mutating) {
    const origin = req.headers.get("origin");
    if (!origin || origin !== new URL(req.url).origin) throw new HttpError(403, "bad_origin");
  }
  const user = await currentUser();
  if (!user) throw new HttpError(401, "signed_out", "Please sign in.");
  return user;
}

// Small per-instance limiter for unauthenticated endpoints (link start/poll). Serverless
// instances don't share it, so it only blunts bursts; codes are random and short-lived anyway.
const hits = new Map<string, number[]>();
export function rateLimit(req: Request, bucket: string, max: number, windowMs: number) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) throw new HttpError(429, "slow_down");
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
}
