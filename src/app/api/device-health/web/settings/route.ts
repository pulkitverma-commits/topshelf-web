import { z } from "zod";
import { preferences } from "@/lib/device-health/types";
import { updatePreferencesFromWeb } from "@/lib/device-health/service";
import { readJson, respond, store } from "@/lib/device-health/http";
import { requireUser } from "@/lib/device-health/guards";

export const dynamic = "force-dynamic";
const body = z.object({ baseVersion: z.number().int().min(0), patch: preferences });

export async function PATCH(req: Request) {
  return respond(async () => {
    const user = await requireUser(req, true);
    const { baseVersion, patch } = await readJson(req, body);
    return updatePreferencesFromWeb(store(), user.id, baseVersion, patch, new Date());
  });
}
