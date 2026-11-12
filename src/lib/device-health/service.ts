/**
 * Device Health server logic, independent of HTTP and of the database (see store.ts).
 * Route handlers in src/app/api/device-health/* are thin wrappers around these functions.
 *
 * Ownership: every function either receives an authenticated user id (website session) or a
 * Computer resolved from a device token, and only touches rows belonging to that user.
 */
import type { HealthStore, Computer, DeviceRecord, AlertRecord, SettingsRecord } from "./store";
import type { HealthReport, ComputerInfo, Preferences, DeviceOverride } from "./types";
import { bearer, hashSecret, newSecret, newUserCode, normaliseUserCode } from "./tokens";

export const LINK_TTL_SECONDS = 600;
export const LINK_POLL_INTERVAL = 5;
export const SAMPLE_RETENTION_DAYS = 30;
export const RELAY_WINDOW_MINUTES = 60;
/** A computer that hasn't reported for this long is shown as offline. */
export const COMPUTER_OFFLINE_MINUTES = 35;
/** Battery/connection readings older than this are shown as out of date. */
export const READING_STALE_MINUTES = 45;

const iso = (d: Date) => d.toISOString();
const minutesAgo = (now: Date, m: number) => new Date(now.getTime() - m * 60_000);

export class HttpError extends Error {
  constructor(public status: number, public code: string, message?: string) {
    super(message ?? code);
  }
}

// MARK: - Linking (device-code flow)

export async function startLink(store: HealthStore, info: ComputerInfo, now: Date, siteUrl: string) {
  const deviceCode = newSecret();
  let userCode = newUserCode();
  // Collisions are astronomically unlikely, but codes must be unique.
  for (let i = 0; i < 3 && (await store.findLinkByUserCode(userCode)); i++) userCode = newUserCode();
  await store.createLinkRequest({
    deviceCodeHash: hashSecret(deviceCode),
    userCode,
    computerName: info.name,
    osVersion: info.osVersion,
    appVersion: info.appVersion,
    createdAt: iso(now),
    expiresAt: iso(new Date(now.getTime() + LINK_TTL_SECONDS * 1000)),
  });
  return {
    deviceCode,
    userCode,
    verificationURL: `${siteUrl}/link?code=${encodeURIComponent(userCode)}`,
    expiresIn: LINK_TTL_SECONDS,
    interval: LINK_POLL_INTERVAL,
  };
}

export type PollResult = { status: "pending" | "approved" | "expired" | "denied"; token?: string; computerID?: string };

/** Called by the Mac every few seconds. Returns the device token exactly once, after approval. */
export async function pollLink(store: HealthStore, deviceCode: string, now: Date): Promise<PollResult> {
  const link = await store.findLinkByDeviceCodeHash(hashSecret(deviceCode));
  if (!link || link.consumedAt) return { status: "expired" };
  if (link.denied) return { status: "denied" };
  if (!link.approvedBy) return Date.parse(link.expiresAt) <= now.getTime() ? { status: "expired" } : { status: "pending" };
  if (!(await store.consumeLink(link.id, iso(now)))) return { status: "expired" };
  const token = newSecret();
  const computer = await store.createComputer({
    userId: link.approvedBy,
    name: link.computerName,
    platform: "macOS",
    osVersion: link.osVersion,
    appVersion: link.appVersion,
    tokenHash: hashSecret(token),
    createdAt: iso(now),
  });
  return { status: "approved", token, computerID: computer.id };
}

export async function describeLink(store: HealthStore, rawCode: string, now: Date) {
  const code = normaliseUserCode(rawCode);
  if (!code) return null;
  const link = await store.findLinkByUserCode(code);
  if (!link) return null;
  const expired = Date.parse(link.expiresAt) <= now.getTime() || !!link.consumedAt;
  return { userCode: link.userCode, computerName: link.computerName, osVersion: link.osVersion, appVersion: link.appVersion,
           expired, decided: !!link.approvedBy || link.denied };
}

/** The signed-in user approves (or declines) a code shown by their Mac. */
export async function decideLink(store: HealthStore, userId: string, rawCode: string, approve: boolean, now: Date) {
  const code = normaliseUserCode(rawCode);
  if (!code) throw new HttpError(400, "bad_code", "That code doesn't look right.");
  const link = await store.findLinkByUserCode(code);
  if (!link || link.consumedAt || Date.parse(link.expiresAt) <= now.getTime()) throw new HttpError(410, "expired", "This code has expired. Start linking again on your Mac.");
  if (link.approvedBy || link.denied) throw new HttpError(409, "already_decided", "This code was already used.");
  await store.updateLink(link.id, approve ? { approvedBy: userId } : { denied: true });
  return { ok: true as const, computerName: link.computerName };
}

// MARK: - Computer authentication

export async function authenticateComputer(store: HealthStore, authorization: string | null): Promise<Computer> {
  const token = bearer(authorization);
  if (!token) throw new HttpError(401, "missing_token");
  const computer = await store.findComputerByTokenHash(hashSecret(token));
  if (!computer) throw new HttpError(401, "revoked", "This Mac is no longer linked.");
  return computer;
}

// MARK: - Reports

export async function handleReport(store: HealthStore, computer: Computer, report: HealthReport, now: Date) {
  const userId = computer.userId;
  const duplicate = await store.hasReport(report.reportID);
  const settings = await store.getSettings(userId);

  if (!duplicate) {
    // Devices: only a newer report replaces the current state (late, out-of-order reports don't).
    const newer = report.sequence > computer.lastSequence;
    if (newer) {
      const records: DeviceRecord[] = report.devices.map((d) => ({ ...d, computerId: computer.id, userId, reportedAt: iso(now) }));
      await store.replaceDevices(userId, computer.id, records);
    }
    await store.touchComputer(computer.id, {
      lastSeenAt: iso(now),
      ...(newer ? { lastSequence: report.sequence } : {}),
      name: report.computer.name,
      osVersion: report.computer.osVersion,
      appVersion: report.computer.appVersion,
    });

    // Alerts: deduplicated by (user, dedupe key). Routed to the preferred Mac when the user chose one.
    const routing = settings?.preferences.routing;
    let routeTo: string | null = null;
    if (routing?.kind === "preferredMac" && routing.computerID !== computer.id) {
      const mine = await store.listComputers(userId);
      if (mine.some((c) => c.id === routing.computerID)) routeTo = routing.computerID;
    }
    const alerts: AlertRecord[] = report.alerts.map((a) => ({
      userId, computerId: computer.id, dedupeKey: a.dedupeKey, kind: a.kind, deviceKey: a.deviceKey, level: a.level ?? null,
      title: a.title, body: a.body, createdAt: a.createdAt, receivedAt: iso(now), deliveredNatively: a.deliveredNatively,
      routeTo: a.deliveredNatively ? null : routeTo, relayedAt: null,
    }));
    if (alerts.length) await store.insertAlerts(alerts);

    if (report.samples.length) {
      await store.insertSamples(report.samples.map((s) => ({ userId, computerId: computer.id, deviceKey: s.deviceKey, at: s.at, percent: s.percent, chargeState: s.chargeState })));
    }
    await store.pruneSamples(computer.id, iso(new Date(now.getTime() - SAMPLE_RETENTION_DAYS * 86400_000)));
    await store.recordReport(report.reportID, computer.id, iso(now));
  }

  const relays = await store.pendingRelays(userId, computer.id, iso(minutesAgo(now, RELAY_WINDOW_MINUTES)));
  return {
    computerID: computer.id,
    receivedAt: iso(now),
    settings: settings && settings.version > report.settingsVersionApplied ? remoteSettings(settings) : null,
    relayedAlerts: relays.map((r) => ({ dedupeKey: r.dedupeKey, title: r.title, body: r.body, createdAt: r.createdAt })),
  };
}

function remoteSettings(s: SettingsRecord) {
  return { version: s.version, updatedAt: s.updatedAt, preferences: s.preferences, deviceOverrides: s.deviceOverrides };
}

export async function acknowledgeRelays(store: HealthStore, computer: Computer, keys: string[], now: Date) {
  await store.markRelayed(computer.userId, computer.id, keys, iso(now));
  return { ok: true };
}

// MARK: - Settings

/** A Mac pushes its settings. Fails with 409 if the account changed since `baseVersion`. */
export async function pushSettingsFromMac(store: HealthStore, computer: Computer, baseVersion: number, prefs: Preferences,
                                          overrides: Record<string, DeviceOverride>, now: Date) {
  const saved = await store.writeSettings(computer.userId, baseVersion, {
    preferences: prefs, deviceOverrides: overrides, updatedAt: iso(now), updatedBy: computer.id,
  });
  if (!saved) throw new HttpError(409, "conflict", "Settings changed elsewhere.");
  return { version: saved.version };
}

/** The website changes some preferences. Merges into what's stored. */
export async function updatePreferencesFromWeb(store: HealthStore, userId: string, baseVersion: number, patch: Preferences, now: Date) {
  const current = await store.getSettings(userId);
  if ((current?.version ?? 0) !== baseVersion) throw new HttpError(409, "conflict", "Settings changed on one of your Macs. Reload to see the latest.");
  if (patch.routing?.kind === "preferredMac") {
    const mine = await store.listComputers(userId);
    if (!mine.some((c) => c.id === (patch.routing as { computerID: string }).computerID)) throw new HttpError(400, "unknown_computer");
  }
  const merged: Preferences = { ...(current?.preferences ?? {}), ...patch };
  const t = merged.thresholds;
  if (t && !(t.critical < t.low && (!t.urgentEnabled || t.urgent < t.critical))) throw new HttpError(400, "bad_thresholds");
  if (merged.storageWarningGB !== undefined && merged.storageCriticalGB !== undefined && merged.storageCriticalGB >= merged.storageWarningGB)
    throw new HttpError(400, "bad_storage_thresholds");
  const saved = await store.writeSettings(userId, baseVersion, {
    preferences: merged, deviceOverrides: current?.deviceOverrides ?? {}, updatedAt: iso(now), updatedBy: "web",
  });
  if (!saved) throw new HttpError(409, "conflict");
  return { version: saved.version };
}

/** Rename / hide / favourite / alert settings for one device, from the website. */
export async function updateDeviceFromWeb(store: HealthStore, userId: string, baseVersion: number, deviceKey: string,
                                          patch: DeviceOverride, now: Date) {
  const devices = await store.listDevices(userId);
  if (!devices.some((d) => d.key === deviceKey)) throw new HttpError(404, "unknown_device");
  const current = await store.getSettings(userId);
  if ((current?.version ?? 0) !== baseVersion) throw new HttpError(409, "conflict");
  const overrides = { ...(current?.deviceOverrides ?? {}) };
  const device = devices.find((d) => d.key === deviceKey)!;
  const base: DeviceOverride = overrides[deviceKey] ?? { customName: device.customName ?? null, hidden: device.hidden, favourite: device.favourite };
  overrides[deviceKey] = { ...base, ...patch };
  const saved = await store.writeSettings(userId, baseVersion, {
    preferences: current?.preferences ?? {}, deviceOverrides: overrides, updatedAt: iso(now), updatedBy: "web",
  });
  if (!saved) throw new HttpError(409, "conflict");
  return { version: saved.version };
}

// MARK: - Unlinking

export async function unlinkComputer(store: HealthStore, userId: string, computerId: string, now: Date) {
  if (!(await store.deleteComputer(userId, computerId))) throw new HttpError(404, "unknown_computer");
  // Clear a routing preference that pointed at it.
  const s = await store.getSettings(userId);
  if (s?.preferences.routing?.kind === "preferredMac" && s.preferences.routing.computerID === computerId) {
    await store.writeSettings(userId, s.version, {
      preferences: { ...s.preferences, routing: { kind: "reportingMac" } }, deviceOverrides: s.deviceOverrides,
      updatedAt: iso(now), updatedBy: "web",
    });
  }
  return { ok: true };
}

// MARK: - Dashboard

export type PresentedReading = { status: string; value: unknown; measuredAt: string | null; stale: boolean };

/** Re-labels readings for display: anything older than the stale window is out of date, whatever the Mac said then. */
export function presentReading(r: { status: string; value?: unknown; measuredAt?: string | null }, now: Date): PresentedReading {
  const measuredAt = r.measuredAt ?? null;
  const old = measuredAt ? now.getTime() - Date.parse(measuredAt) > READING_STALE_MINUTES * 60_000 : false;
  const status = r.status === "available" && old ? "stale" : r.status;
  return { status, value: r.value ?? null, measuredAt, stale: status === "stale" };
}

export async function dashboard(store: HealthStore, userId: string, now: Date, opts: { historyHours?: number } = {}) {
  const [computers, devices, settings, alerts] = await Promise.all([
    store.listComputers(userId),
    store.listDevices(userId),
    store.getSettings(userId),
    store.listAlerts(userId, iso(new Date(now.getTime() - 7 * 86400_000)), 50),
  ]);
  const byId = new Map(computers.map((c) => [c.id, c]));
  const overrides = settings?.deviceOverrides ?? {};
  const samples = opts.historyHours ? await store.listSamples(userId, iso(new Date(now.getTime() - opts.historyHours * 3600_000))) : [];

  return {
    now: iso(now),
    settings: { version: settings?.version ?? 0, preferences: settings?.preferences ?? {}, updatedAt: settings?.updatedAt ?? null },
    computers: computers.map((c) => ({
      id: c.id, name: c.name, platform: c.platform, osVersion: c.osVersion, appVersion: c.appVersion,
      createdAt: c.createdAt, lastSeenAt: c.lastSeenAt,
      online: !!c.lastSeenAt && now.getTime() - Date.parse(c.lastSeenAt) < COMPUTER_OFFLINE_MINUTES * 60_000,
    })),
    devices: devices.map((d) => {
      const o = overrides[d.key] ?? {};
      const computer = byId.get(d.computerId);
      const customName = o.customName !== undefined ? o.customName : d.customName ?? null;
      return {
        displayName: customName?.trim() || d.name,
        key: d.key, computerId: d.computerId, computerName: computer?.name ?? "Unknown Mac",
        category: d.category, source: d.source, name: d.name,
        customName,
        hidden: o.hidden ?? d.hidden, favourite: o.favourite ?? d.favourite,
        notify: o.notify ?? null, thresholds: o.thresholds ?? null, important: o.important ?? false, meetingCheck: o.meetingCheck ?? false,
        pendingSync: !!settings && !!overrides[d.key] && settings.updatedBy === "web",
        connection: d.connection, lastSeen: d.lastSeen ?? null, reportedAt: d.reportedAt,
        battery: presentReading(d.battery, now), batteryHealth: presentReading(d.batteryHealth, now),
        storage: presentReading(d.storage, now), thermal: presentReading(d.thermal, now),
        attention: d.attention,
      };
    }),
    alerts: alerts.map((a) => ({
      dedupeKey: a.dedupeKey, kind: a.kind, deviceKey: a.deviceKey, level: a.level, title: a.title, body: a.body,
      createdAt: a.createdAt, receivedAt: a.receivedAt, computerName: byId.get(a.computerId)?.name ?? "Unknown Mac",
      deliveredNatively: a.deliveredNatively,
    })),
    samples: samples.map((s) => ({ deviceKey: s.deviceKey, computerId: s.computerId, at: s.at, percent: s.percent, chargeState: s.chargeState })),
  };
}

export type Dashboard = Awaited<ReturnType<typeof dashboard>>;
