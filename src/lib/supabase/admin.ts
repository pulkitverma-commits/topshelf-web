import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

let admin: SupabaseClient | null = null;

/** Service-role client for server routes. Bypasses RLS: every query must filter by the owning user. */
export function adminClient(): SupabaseClient {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) throw new Error("Device Health backend is not configured (SUPABASE_SERVICE_ROLE_KEY).");
  admin ??= createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return admin;
}
