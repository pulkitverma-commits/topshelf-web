import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey, accountsEnabled } from "./env";

/** Session-aware client for server components and route handlers (reads the auth cookies). */
export async function sessionClient() {
  const store = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Called from a server component: cookies are read-only there; middleware refreshes them.
        }
      },
    },
  });
}

/** The signed-in user, verified with Supabase Auth (not just decoded from the cookie). */
export async function currentUser() {
  if (!accountsEnabled) return null;
  const supabase = await sessionClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
