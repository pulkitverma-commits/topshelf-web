import { healthReport } from "@/lib/device-health/types";
import { authenticateComputer, handleReport } from "@/lib/device-health/service";
import { readJson, respond, store } from "@/lib/device-health/http";

export const dynamic = "force-dynamic";

/** A linked Mac sends its current devices, new alerts and (if enabled) battery samples. */
export async function POST(req: Request) {
  return respond(async () => {
    const s = store();
    const computer = await authenticateComputer(s, req.headers.get("authorization"));
    const report = await readJson(req, healthReport);
    return handleReport(s, computer, report, new Date());
  });
}
