import { dashboard } from "@/lib/device-health/service";
import { respond, store } from "@/lib/device-health/http";
import { requireUser } from "@/lib/device-health/guards";

export const dynamic = "force-dynamic";

/** The signed-in user's devices, computers, alerts and settings. */
export async function GET(req: Request) {
  return respond(async () => {
    const user = await requireUser(req, false);
    const hours = Number(new URL(req.url).searchParams.get("history") ?? 0);
    return dashboard(store(), user.id, new Date(), { historyHours: Math.min(Math.max(hours, 0), 168) || undefined });
  });
}
