import { z } from "zod";
import { deviceOverride } from "@/lib/device-health/types";
import { updateDeviceFromWeb } from "@/lib/device-health/service";
import { readJson, respond, store } from "@/lib/device-health/http";
import { requireUser } from "@/lib/device-health/guards";

export const dynamic = "force-dynamic";
const body = z.object({ baseVersion: z.number().int().min(0), deviceKey: z.string().min(1).max(80), patch: deviceOverride });

export async function PATCH(req: Request) {
  return respond(async () => {
    const user = await requireUser(req, true);
    const { baseVersion, deviceKey, patch } = await readJson(req, body);
    return updateDeviceFromWeb(store(), user.id, baseVersion, deviceKey, patch, new Date());
  });
}
