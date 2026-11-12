"use client";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "./env";

/** Browser client: only used for signing in and out. Data goes through /api/device-health/*. */
export function browserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
