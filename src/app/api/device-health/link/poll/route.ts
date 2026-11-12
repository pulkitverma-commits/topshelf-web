import { NextResponse } from "next/server";
import { linkPoll } from "@/lib/device-health/types";
import { pollLink } from "@/lib/device-health/service";
import { readJson, respond, store } from "@/lib/device-health/http";
import { rateLimit } from "@/lib/device-health/guards";

export const dynamic = "force-dynamic";

/** The Mac polls until the user approves the code on the website. 202 pending, 200 approved, 410 expired/denied. */
export async function POST(req: Request) {
  let status = 200;
  const res = await respond(async () => {
    rateLimit(req, "link-poll", 200, 10 * 60_000);
    const { deviceCode } = await readJson(req, linkPoll);
    const r = await pollLink(store(), deviceCode, new Date());
    status = r.status === "pending" ? 202 : r.status === "approved" ? 200 : 410;
    return r;
  });
  if (res.status !== 200) return res;
  return NextResponse.json(await res.json(), { status, headers: { "Cache-Control": "no-store" } });
}
