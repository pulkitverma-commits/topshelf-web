"use client";

import { useState } from "react";
import { browserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/primitives";

/** Email sign-in with a one-time code (or the link in the same email). No passwords. */
export function SignIn({ next = "/account" }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMessage(null);
    const { error } = await browserClient().auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`, shouldCreateUser: true },
    });
    setBusy(false);
    if (error) setMessage(error.message.includes("rate") ? "Too many attempts. Wait a minute and try again." : "We couldn't send the email. Check the address and try again.");
    else { setStage("code"); setMessage(`We sent a sign-in email to ${email.trim()}. Enter the code from it, or click its link.`); }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMessage(null);
    const { error } = await browserClient().auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "email" });
    setBusy(false);
    if (error) setMessage("That code didn't work. It may have expired; send a new one.");
    else window.location.assign(next);
  }

  const field = "h-12 w-full rounded-2xl border border-line-strong bg-white px-4 text-[16px] outline-none focus-visible:ring-2 focus-visible:ring-accent";
  return (
    <div className="max-w-[440px] rounded-[28px] border border-line bg-white p-6 sm:p-8">
      {stage === "email" ? (
        <form onSubmit={sendCode} className="flex flex-col gap-3">
          <label htmlFor="email" className="text-[15px] font-medium">Email</label>
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="you@example.com" />
          <Button type="submit" variant="dark" size="md" disabled={busy || !email}>{busy ? "Sending…" : "Email me a sign-in code"}</Button>
        </form>
      ) : (
        <form onSubmit={verify} className="flex flex-col gap-3">
          <label htmlFor="code" className="text-[15px] font-medium">Code from the email</label>
          <input id="code" inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={(e) => setCode(e.target.value)} className={`${field} tracking-[.3em]`} />
          <Button type="submit" variant="dark" size="md" disabled={busy || code.length < 6}>{busy ? "Checking…" : "Sign in"}</Button>
          <button type="button" className="text-[14px] text-muted underline underline-offset-4" onClick={() => { setStage("email"); setCode(""); setMessage(null); }}>Use a different email</button>
        </form>
      )}
      {message && <p role="status" className="mb-0 mt-4 text-[14.5px] text-muted">{message}</p>}
      <p className="mb-0 mt-5 text-[13px] text-muted">An account is only needed to see Device Health from a browser. TopShelf itself works without one.</p>
    </div>
  );
}

export function SignOut() {
  return (
    <button type="button" className="text-[14px] text-muted underline underline-offset-4 hover:text-ink"
      onClick={async () => { await browserClient().auth.signOut(); window.location.assign("/account"); }}>
      Sign out
    </button>
  );
}
