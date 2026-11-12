import { z } from "zod";
import { unlinkComputer } from "@/lib/device-health/service";
import { readJson, respond, store } from "@/lib/device-health/http";
import { requireUser } from "@/lib/device-health/guards";

export const dynamic = "force-dynamic";
const body = z.object({ computerId: z.string().uuid() });

/** Unlink a Mac from the website: revokes its token and deletes what it reported. */
export async function DELETE(req: Request) {
  return respond(async () => {
    const user = await requireUser(req, true);
    const { computerId } = await readJson(req, body);
    return unlinkComputer(store(), user.id, computerId, new Date());
  });
}
