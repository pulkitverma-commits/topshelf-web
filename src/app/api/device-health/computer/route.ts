import { authenticateComputer, unlinkComputer } from "@/lib/device-health/service";
import { respond, store } from "@/lib/device-health/http";

export const dynamic = "force-dynamic";

/** A Mac unlinks itself: its token is revoked and everything it reported is deleted. */
export async function DELETE(req: Request) {
  return respond(async () => {
    const s = store();
    const computer = await authenticateComputer(s, req.headers.get("authorization"));
    return unlinkComputer(s, computer.userId, computer.id, new Date());
  });
}
