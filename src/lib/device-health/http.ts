import "server-only";
import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { HttpError } from "./service";
import { SupabaseHealthStore } from "./supabase-store";
import { adminClient } from "../supabase/admin";
import { accountsEnabled } from "../supabase/env";
import { siteConfig } from "@/config/site";

export const MAX_BODY_BYTES = 512 * 1024;

export function store() {
  if (!accountsEnabled || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new HttpError(503, "accounts_disabled", "TopShelf accounts aren't set up on this site yet.");
  }
  return new SupabaseHealthStore(adminClient());
}

/** The canonical site origin for links shown to the Mac (production or this preview). */
export function siteOrigin(req: Request): string {
  const vercel = process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  return vercel ?? (process.env.NODE_ENV === "production" ? siteConfig.url : new URL(req.url).origin);
}

export async function readJson<T>(req: Request, schema: ZodType<T>): Promise<T> {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_BODY_BYTES) throw new HttpError(413, "too_large");
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) throw new HttpError(413, "too_large");
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { throw new HttpError(400, "bad_json"); }
  return schema.parse(raw);
}

/** Runs a handler and maps errors to JSON responses without leaking internals. */
export async function respond(fn: () => Promise<unknown>, okStatus = 200) {
  try {
    const body = await fn();
    return NextResponse.json(body, { status: okStatus, headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    if (e instanceof HttpError) return NextResponse.json({ error: { code: e.code, message: e.message } }, { status: e.status });
    if (e instanceof ZodError) return NextResponse.json({ error: { code: "invalid", message: e.issues[0]?.message ?? "Invalid request" } }, { status: 400 });
    console.error("device-health:", e instanceof Error ? e.message : "unknown error");
    return NextResponse.json({ error: { code: "server", message: "Something went wrong." } }, { status: 500 });
  }
}
