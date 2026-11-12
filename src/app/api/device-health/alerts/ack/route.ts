import { ackBody } from "@/lib/device-health/types";
import { acknowledgeRelays, authenticateComputer } from "@/lib/device-health/service";
import { readJson, respond, store } from "@/lib/device-health/http";

export const dynamic = "force-dynamic";

/** The preferred Mac confirms it showed alerts relayed to it. */
export async function POST(req: Request) {
  return respond(async () => {
    const s = store();
    const computer = await authenticateComputer(s, req.headers.get("authorization"));
    const { dedupeKeys } = await readJson(req, ackBody);
    return acknowledgeRelays(s, computer, dedupeKeys, new Date());
  });
}
