import { computerInfo } from "@/lib/device-health/types";
import { startLink } from "@/lib/device-health/service";
import { readJson, respond, siteOrigin, store } from "@/lib/device-health/http";
import { rateLimit } from "@/lib/device-health/guards";

export const dynamic = "force-dynamic";

/** A Mac asks for a link code (device-code flow). */
export async function POST(req: Request) {
  return respond(async () => {
    rateLimit(req, "link-start", 10, 10 * 60_000);
    const info = await readJson(req, computerInfo);
    return startLink(store(), info, new Date(), siteOrigin(req));
  });
}
