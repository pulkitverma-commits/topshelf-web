"use client";

import { useState } from "react";
import { Button } from "@/components/ui/primitives";

type Info = { userCode: string; computerName: string; osVersion: string | null; appVersion: string | null; expired: boolean; decided: boolean };

/** Confirms (or declines) the code a Mac is showing, so it can report Device Health to this account. */
export function LinkApprove({ info }: { info: Info }) {
  const [state, setState] = useState<"ask" | "busy" | "approved" | "declined" | "error">("ask");
  const [message, setMessage] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setState("busy");
    const res = await fetch("/api/device-health/web/link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: info.userCode, approve }) });
    if (res.ok) setState(approve ? "approved" : "declined");
    else { setState("error"); setMessage((await res.json().catch(() => null))?.error?.message ?? "Something went wrong."); }
  }

  if (info.expired || info.decided) {
    return <p className="text-[17px] text-muted">This code has {info.decided ? "already been used" : "expired"}. On your Mac, open TopShelf Settings › Device Health and start linking again.</p>;
  }
  if (state === "approved") return <p className="text-[17px]">Linked. <b>{info.computerName}</b> will appear in <a className="underline underline-offset-4" href="/account">your Device Health</a> within a minute.</p>;
  if (state === "declined") return <p className="text-[17px] text-muted">Declined. Nothing was linked.</p>;

  return (
    <div className="max-w-[560px] rounded-[28px] border border-line bg-white p-6 sm:p-8">
      <p className="m-0 text-[13px] uppercase tracking-[.08em] text-muted">Code</p>
      <p className="m-0 mt-1 font-mono text-[34px] font-semibold tracking-[.12em]">{info.userCode}</p>
      <p className="mb-0 mt-4 text-[16.5px]">Link <b>{info.computerName}</b>{info.osVersion ? ` (macOS ${info.osVersion})` : ""} to this account?</p>
      <p className="mb-0 mt-2 text-[14.5px] text-muted">Only continue if this code is showing in TopShelf on your own Mac right now. The Mac will report device names, battery and storage readings and alerts — no Bluetooth addresses or serial numbers. You can unlink it any time, which deletes what it reported.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="dark" size="md" disabled={state === "busy"} onClick={() => decide(true)}>Link this Mac</Button>
        <Button variant="outline" size="md" disabled={state === "busy"} onClick={() => decide(false)}>Not my Mac</Button>
      </div>
      {message && <p role="alert" className="mb-0 mt-4 text-[14.5px] text-[#b42318]">{message}</p>}
    </div>
  );
}
