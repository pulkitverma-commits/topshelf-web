import { z } from "zod";
import { decideLink } from "@/lib/device-health/service";
import { readJson, respond, store } from "@/lib/device-health/http";
import { requireUser } from "@/lib/device-health/guards";

export const dynamic = "force-dynamic";
const body = z.object({ code: z.string().min(8).max(12), approve: z.boolean() });

/** The signed-in user approves or declines a link code shown by their Mac. */
export async function POST(req: Request) {
  return respond(async () => {
    const user = await requireUser(req, true);
    const { code, approve } = await readJson(req, body);
    return decideLink(store(), user.id, code, approve, new Date());
  });
}
