import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { sessionClient } from "@/lib/supabase/server";
import { accountsEnabled } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

/** Target of the sign-in email link: verifies the one-time token and sets the session cookie. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextParam = searchParams.get("next") ?? "/account";
  // Only same-site relative paths.
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/account";
  if (accountsEnabled && tokenHash && type) {
    const supabase = await sessionClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/account?error=link`);
}
