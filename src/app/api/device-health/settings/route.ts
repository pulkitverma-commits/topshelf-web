import { settingsPush } from "@/lib/device-health/types";
import { authenticateComputer, pushSettingsFromMac } from "@/lib/device-health/service";
import { readJson, respond, store } from "@/lib/device-health/http";

export const dynamic = "force-dynamic";

/** A linked Mac pushes its Device Health settings. 409 if the account has newer ones. */
export async function PUT(req: Request) {
  return respond(async () => {
    const s = store();
    const computer = await authenticateComputer(s, req.headers.get("authorization"));
    const body = await readJson(req, settingsPush);
    return pushSettingsFromMac(s, computer, body.baseVersion, body.preferences, body.deviceOverrides, new Date());
  });
}
