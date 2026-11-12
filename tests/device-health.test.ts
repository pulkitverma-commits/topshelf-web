/**
 * Device Health backend behaviour with simulated telemetry and an in-memory store.
 * Run: npm run test:device-health
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { MemoryStore } from "../src/lib/device-health/memory-store";
import * as svc from "../src/lib/device-health/service";
import { healthReport, preferences, type HealthReport } from "../src/lib/device-health/types";
import { hashSecret, normaliseUserCode } from "../src/lib/device-health/tokens";

const T0 = new Date("2026-11-12T10:00:00Z");
const at = (min: number) => new Date(T0.getTime() + min * 60_000);
const ALICE = "11111111-1111-4111-8111-111111111111";
const BOB = "22222222-2222-4222-8222-222222222222";

async function linkMac(store: MemoryStore, userId: string, name = "Alice's MacBook Air") {
  const start = await svc.startLink(store, { name, platform: "macOS", osVersion: "15.1.0", appVersion: "1.1" }, T0, "https://example.test");
  assert.equal((await svc.pollLink(store, start.deviceCode, at(0.1))).status, "pending");
  await svc.decideLink(store, userId, start.userCode, true, at(0.2));
  const r = await svc.pollLink(store, start.deviceCode, at(0.3));
  assert.equal(r.status, "approved");
  const computer = await svc.authenticateComputer(store, `Bearer ${r.token}`);
  return { token: r.token!, computer };
}

function report(seq: number, over: Partial<HealthReport> = {}): HealthReport {
  return healthReport.parse({
    schema: 1, reportID: `report-${seq}-${Math.random().toString(36).slice(2)}`,
    computer: { name: "Alice's MacBook Air", platform: "macOS", osVersion: "15.1.0", appVersion: "1.1" },
    sentAt: T0.toISOString(), sequence: seq,
    devices: [{
      key: "host", category: "computer", source: "hostBattery", name: "Alice's MacBook Air", hidden: false, favourite: false,
      connection: "notApplicable", lastSeen: T0.toISOString(),
      battery: { status: "available", value: { percent: 64, chargeState: "discharging" }, measuredAt: T0.toISOString() },
      batteryHealth: { status: "available", value: { osCondition: "Good", osRecommendsService: false }, measuredAt: T0.toISOString() },
      storage: { status: "available", value: { availableBytes: 120e9, totalBytes: 500e9 }, measuredAt: T0.toISOString() },
      thermal: { status: "available", value: "nominal", measuredAt: T0.toISOString() }, attention: [],
    }, {
      key: "ble:0123456789abcdef0123456789abcdef", category: "keyboard", source: "bluetoothLE", name: "MX Keys", hidden: false,
      favourite: true, connection: "connected", lastSeen: T0.toISOString(),
      battery: { status: "available", value: { percent: 9, chargeState: "unknown" }, measuredAt: T0.toISOString() },
      batteryHealth: { status: "unsupported" }, storage: { status: "unsupported" }, thermal: { status: "unsupported" },
      attention: ["Battery 9% — charge soon"],
    }],
    alerts: [], samples: [], settingsVersionApplied: 0, ...over,
  });
}

test("linking: code approved once, token works, token is never stored in clear", async () => {
  const store = new MemoryStore();
  const { token, computer } = await linkMac(store, ALICE);
  assert.equal(computer.userId, ALICE);
  assert.equal(computer.tokenHash, hashSecret(token));
  assert.ok(![...store.computers.values()].some((c) => JSON.stringify(c).includes(token)));
  // The device code can't be used twice.
  const link = [...store.links.values()][0];
  assert.ok(link.consumedAt);
});

test("linking: expired and declined codes", async () => {
  const store = new MemoryStore();
  const s1 = await svc.startLink(store, { name: "Mac", platform: "macOS", osVersion: "15", appVersion: "1.1" }, T0, "https://x");
  assert.equal((await svc.pollLink(store, s1.deviceCode, at(11))).status, "expired");
  await assert.rejects(svc.decideLink(store, ALICE, s1.userCode, true, at(11)), (e: svc.HttpError) => e.status === 410);
  const s2 = await svc.startLink(store, { name: "Mac", platform: "macOS", osVersion: "15", appVersion: "1.1" }, T0, "https://x");
  await svc.decideLink(store, ALICE, s2.userCode.toLowerCase().replace("-", " "), false, at(1));
  assert.equal((await svc.pollLink(store, s2.deviceCode, at(1))).status, "denied");
  assert.equal(normaliseUserCode("abcd efgh"), "ABCD-EFGH");
  assert.equal(normaliseUserCode("0000-0000"), null, "ambiguous characters are rejected");
});

test("reports: devices stored per Mac with server timestamps; late reports don't overwrite newer state", async () => {
  const store = new MemoryStore();
  const { computer } = await linkMac(store, ALICE);
  await svc.handleReport(store, computer, report(2), at(1));
  const late = report(1);
  late.devices[0].battery.value = { percent: 99, chargeState: "discharging" };
  await svc.handleReport(store, computer, late, at(2));
  const dash = await svc.dashboard(store, ALICE, at(3));
  assert.equal(dash.devices.length, 2);
  const host = dash.devices.find((d) => d.key === "host")!;
  assert.equal((host.battery.value as { percent: number }).percent, 64, "older sequence ignored");
  assert.equal(host.reportedAt, at(1).toISOString(), "server time, not client time");
});

test("reports are idempotent: a retried report doesn't duplicate alerts", async () => {
  const store = new MemoryStore();
  const { computer } = await linkMac(store, ALICE);
  const alert = { dedupeKey: "ble:0123456789abcdef0123456789abcdef|battery.critical|0", kind: "batteryLow", deviceKey: "ble:0123456789abcdef0123456789abcdef",
                  level: "critical", title: "MX Keys is almost out of battery", body: "Your keyboard is at 9%.", createdAt: T0.toISOString(), deliveredNatively: true };
  const r = report(1, { alerts: [alert as never] });
  await svc.handleReport(store, computer, r, at(1));
  await svc.handleReport(store, computer, r, at(2));                       // same report id again
  await svc.handleReport(store, computer, report(2, { alerts: [alert as never] }), at(3)); // re-sent in a new report (offline queue)
  assert.equal(store.alerts.length, 1);
});

test("one account can never see another account's telemetry", async () => {
  const store = new MemoryStore();
  const a = await linkMac(store, ALICE);
  const b = await linkMac(store, BOB, "Bob's iMac");
  await svc.handleReport(store, a.computer, report(1), at(1));
  const bobDash = await svc.dashboard(store, BOB, at(2));
  assert.equal(bobDash.devices.length, 0);
  assert.equal(bobDash.computers.length, 1);
  await assert.rejects(svc.unlinkComputer(store, BOB, a.computer.id, at(3)), (e: svc.HttpError) => e.status === 404);
  await assert.rejects(svc.updateDeviceFromWeb(store, BOB, 0, "host", { hidden: true }, at(3)), (e: svc.HttpError) => e.status === 404);
  assert.equal((await svc.dashboard(store, ALICE, at(4))).devices.length, 2, "Alice's data untouched");
  void b;
});

test("unlinking revokes the token and deletes what the Mac reported", async () => {
  const store = new MemoryStore();
  const { token, computer } = await linkMac(store, ALICE);
  await svc.handleReport(store, computer, report(1, { samples: [{ deviceKey: "host", at: T0.toISOString(), percent: 64, chargeState: "discharging" }] }), at(1));
  await svc.unlinkComputer(store, ALICE, computer.id, at(2));
  await assert.rejects(svc.authenticateComputer(store, `Bearer ${token}`), (e: svc.HttpError) => e.status === 401);
  assert.equal(store.devices.length, 0);
  assert.equal(store.samples.length, 0);
  assert.equal(store.alerts.length, 0);
});

test("two Macs reporting the same accessory are not merged by name", async () => {
  const store = new MemoryStore();
  const a = await linkMac(store, ALICE, "MacBook Air");
  const b = await linkMac(store, ALICE, "Studio");
  const first = report(1);
  first.computer.name = "MacBook Air";
  await svc.handleReport(store, a.computer, first, at(1));
  const other = report(1);
  other.computer.name = "Studio";
  other.devices[1].key = "ble:fedcba9876543210fedcba9876543210";   // same "MX Keys", different per-Mac key
  await svc.handleReport(store, b.computer, other, at(1));
  const dash = await svc.dashboard(store, ALICE, at(2));
  const keyboards = dash.devices.filter((d) => d.name === "MX Keys");
  assert.equal(keyboards.length, 2);
  assert.deepEqual(new Set(keyboards.map((k) => k.computerName)), new Set(["MacBook Air", "Studio"]));
});

test("settings: website edits reach the Mac; stale Mac pushes get 409; versions only increase", async () => {
  const store = new MemoryStore();
  const { computer } = await linkMac(store, ALICE);
  const prefs = preferences.parse({ thresholds: { low: 20, critical: 10, urgent: 5, urgentEnabled: false }, sound: false });
  assert.deepEqual(await svc.pushSettingsFromMac(store, computer, 0, prefs, {}, at(1)), { version: 1 });
  await svc.handleReport(store, computer, report(1), at(1));
  await svc.updatePreferencesFromWeb(store, ALICE, 1, { thresholds: { low: 30, critical: 15, urgent: 5, urgentEnabled: true } }, at(2));
  await svc.updateDeviceFromWeb(store, ALICE, 2, "ble:0123456789abcdef0123456789abcdef", { customName: "Desk keyboard" }, at(3));
  // The Mac (offline meanwhile) tries to push with its old base version.
  await assert.rejects(svc.pushSettingsFromMac(store, computer, 1, prefs, {}, at(4)), (e: svc.HttpError) => e.status === 409);
  // Its next report brings the account's settings.
  const r = await svc.handleReport(store, computer, report(2, { settingsVersionApplied: 1 }), at(5));
  assert.equal(r.settings?.version, 3);
  assert.equal(r.settings?.preferences.thresholds?.low, 30);
  assert.equal(r.settings?.deviceOverrides["ble:0123456789abcdef0123456789abcdef"]?.customName, "Desk keyboard");
  assert.equal((await svc.handleReport(store, computer, report(3, { settingsVersionApplied: 3 }), at(6))).settings, null);
  // Invalid thresholds are refused.
  await assert.rejects(svc.updatePreferencesFromWeb(store, ALICE, 3, { thresholds: { low: 10, critical: 20, urgent: 5, urgentEnabled: false } } as never, at(7)));
  assert.throws(() => preferences.parse({ thresholds: { low: 10, critical: 20, urgent: 5, urgentEnabled: false } }));
});

test("preferred-Mac routing relays alerts once and only to that Mac", async () => {
  const store = new MemoryStore();
  const laptop = await linkMac(store, ALICE, "Laptop");
  const desk = await linkMac(store, ALICE, "Desk");
  await svc.updatePreferencesFromWeb(store, ALICE, 0, { routing: { kind: "preferredMac", computerID: desk.computer.id } }, at(1));
  const alert = { dedupeKey: "bt:aa|disconnected|1", kind: "disconnected", deviceKey: "host", title: "Buds disconnected", body: "…",
                  createdAt: T0.toISOString(), deliveredNatively: false };
  await svc.handleReport(store, laptop.computer, report(1, { alerts: [alert as never] }), at(2));
  const toLaptop = await svc.handleReport(store, laptop.computer, report(2), at(3));
  assert.equal(toLaptop.relayedAlerts.length, 0);
  const toDesk = await svc.handleReport(store, desk.computer, report(1), at(3));
  assert.equal(toDesk.relayedAlerts.length, 1);
  await svc.acknowledgeRelays(store, desk.computer, [alert.dedupeKey], at(4));
  assert.equal((await svc.handleReport(store, desk.computer, report(2), at(5))).relayedAlerts.length, 0);
  // Unlinking the preferred Mac resets routing.
  await svc.unlinkComputer(store, ALICE, desk.computer.id, at(6));
  assert.equal((await store.getSettings(ALICE))?.preferences.routing?.kind, "reportingMac");
});

test("stale readings and offline Macs are labelled, never shown as live", async () => {
  const store = new MemoryStore();
  const { computer } = await linkMac(store, ALICE);
  await svc.handleReport(store, computer, report(1), at(0));
  const fresh = await svc.dashboard(store, ALICE, at(10));
  assert.equal(fresh.devices[0].battery.status, "available");
  assert.equal(fresh.computers[0].online, true);
  const later = await svc.dashboard(store, ALICE, at(90));
  assert.ok(later.devices.every((d) => d.battery.status !== "available"));
  assert.equal(later.devices.find((d) => d.key === "host")!.battery.status, "stale");
  assert.equal(later.computers[0].online, false);
});

test("validation: raw identifiers and out-of-range values are rejected", async () => {
  const base = report(1);
  const bad = structuredClone(base) as Record<string, unknown> & { devices: Array<Record<string, unknown>> };
  bad.devices[1].key = "AA:BB:CC:DD:EE:FF";
  assert.throws(() => healthReport.parse(bad));
  const bad2 = structuredClone(base) as typeof bad;
  (bad2.devices[0] as { battery: { value: { percent: number } } }).battery.value.percent = 140;
  assert.throws(() => healthReport.parse(bad2));
});

test("samples are deduplicated and pruned after 30 days", async () => {
  const store = new MemoryStore();
  const { computer } = await linkMac(store, ALICE);
  const s = (d: Date, p: number) => ({ deviceKey: "host", at: d.toISOString(), percent: p, chargeState: "discharging" as const });
  await svc.handleReport(store, computer, report(1, { samples: [s(at(-40 * 24 * 60), 90), s(at(0), 64), s(at(0), 64)] }), at(1));
  assert.equal(store.samples.length, 1);
});
