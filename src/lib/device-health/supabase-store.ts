/**
 * HealthStore backed by Supabase Postgres (tables from supabase/migrations/*_device_health.sql).
 * Server-only: uses the service-role key, so every query below filters by the owning user
 * explicitly — ownership is enforced here and in service.ts, not by RLS.
 */
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { HealthStore, Computer, LinkRequest, DeviceRecord, AlertRecord, SampleRecord, SettingsRecord } from "./store";

type Row = Record<string, unknown>;

function check<T>(r: { data: T; error: { message: string } | null }): T {
  if (r.error) throw new Error(`database: ${r.error.message}`);
  return r.data;
}

const toLink = (r: Row): LinkRequest => ({
  id: r.id as string, deviceCodeHash: r.device_code_hash as string, userCode: r.user_code as string,
  computerName: r.computer_name as string, osVersion: (r.os_version as string) ?? null, appVersion: (r.app_version as string) ?? null,
  createdAt: r.created_at as string, expiresAt: r.expires_at as string, approvedBy: (r.approved_by as string) ?? null,
  denied: !!r.denied, consumedAt: (r.consumed_at as string) ?? null,
});

const toComputer = (r: Row): Computer => ({
  id: r.id as string, userId: r.user_id as string, name: r.name as string, platform: r.platform as string,
  osVersion: (r.os_version as string) ?? null, appVersion: (r.app_version as string) ?? null, tokenHash: r.token_hash as string,
  lastSequence: Number(r.last_sequence ?? 0), createdAt: r.created_at as string, lastSeenAt: (r.last_seen_at as string) ?? null,
});

const toDevice = (r: Row): DeviceRecord => ({
  key: r.device_key as string, computerId: r.computer_id as string, userId: r.user_id as string,
  category: r.category as DeviceRecord["category"], source: r.source as DeviceRecord["source"], name: r.name as string,
  customName: (r.custom_name as string) ?? null, hidden: !!r.hidden, favourite: !!r.favourite,
  connection: r.connection as DeviceRecord["connection"], lastSeen: (r.last_seen as string) ?? null,
  battery: r.battery as DeviceRecord["battery"], batteryHealth: r.battery_health as DeviceRecord["batteryHealth"],
  storage: r.storage as DeviceRecord["storage"], thermal: r.thermal as DeviceRecord["thermal"],
  attention: (r.attention as string[]) ?? [], reportedAt: r.reported_at as string,
});

const toAlert = (r: Row): AlertRecord => ({
  userId: r.user_id as string, computerId: r.computer_id as string, dedupeKey: r.dedupe_key as string, kind: r.kind as string,
  deviceKey: r.device_key as string, level: (r.level as string) ?? null, title: r.title as string, body: r.body as string,
  createdAt: r.created_at as string, receivedAt: r.received_at as string, deliveredNatively: !!r.delivered_natively,
  routeTo: (r.route_to as string) ?? null, relayedAt: (r.relayed_at as string) ?? null,
});

const toSettings = (r: Row): SettingsRecord => ({
  userId: r.user_id as string, version: Number(r.version), preferences: (r.preferences as SettingsRecord["preferences"]) ?? {},
  deviceOverrides: (r.device_overrides as SettingsRecord["deviceOverrides"]) ?? {}, updatedAt: r.updated_at as string,
  updatedBy: (r.updated_by as string) ?? null,
});

export class SupabaseHealthStore implements HealthStore {
  constructor(private db: SupabaseClient) {}

  async createLinkRequest(r: Omit<LinkRequest, "id" | "approvedBy" | "denied" | "consumedAt">) {
    const row = check(await this.db.from("dh_link_requests").insert({
      device_code_hash: r.deviceCodeHash, user_code: r.userCode, computer_name: r.computerName, os_version: r.osVersion,
      app_version: r.appVersion, created_at: r.createdAt, expires_at: r.expiresAt,
    }).select().single());
    // Opportunistic cleanup of long-expired requests.
    await this.db.from("dh_link_requests").delete().lt("expires_at", new Date(Date.now() - 86400_000).toISOString());
    return toLink(row as Row);
  }
  async findLinkByDeviceCodeHash(hash: string) {
    const r = check(await this.db.from("dh_link_requests").select().eq("device_code_hash", hash).maybeSingle());
    return r ? toLink(r as Row) : null;
  }
  async findLinkByUserCode(code: string) {
    const r = check(await this.db.from("dh_link_requests").select().eq("user_code", code).maybeSingle());
    return r ? toLink(r as Row) : null;
  }
  async updateLink(id: string, patch: Partial<Pick<LinkRequest, "approvedBy" | "denied" | "consumedAt">>) {
    const row: Row = {};
    if (patch.approvedBy !== undefined) row.approved_by = patch.approvedBy;
    if (patch.denied !== undefined) row.denied = patch.denied;
    if (patch.consumedAt !== undefined) row.consumed_at = patch.consumedAt;
    check(await this.db.from("dh_link_requests").update(row).eq("id", id));
  }
  async consumeLink(id: string, at: string) {
    const rows = check(await this.db.from("dh_link_requests").update({ consumed_at: at }).eq("id", id).is("consumed_at", null).select("id"));
    return (rows as Row[]).length === 1;
  }

  async createComputer(c: Omit<Computer, "id" | "lastSequence" | "lastSeenAt">) {
    const row = check(await this.db.from("dh_computers").insert({
      user_id: c.userId, name: c.name, platform: c.platform, os_version: c.osVersion, app_version: c.appVersion,
      token_hash: c.tokenHash, created_at: c.createdAt,
    }).select().single());
    return toComputer(row as Row);
  }
  async findComputerByTokenHash(hash: string) {
    const r = check(await this.db.from("dh_computers").select().eq("token_hash", hash).maybeSingle());
    return r ? toComputer(r as Row) : null;
  }
  async listComputers(userId: string) {
    return (check(await this.db.from("dh_computers").select().eq("user_id", userId).order("created_at")) as Row[]).map(toComputer);
  }
  async touchComputer(id: string, p: { lastSeenAt: string; lastSequence?: number; name?: string; osVersion?: string; appVersion?: string }) {
    const row: Row = { last_seen_at: p.lastSeenAt };
    if (p.lastSequence !== undefined) row.last_sequence = p.lastSequence;
    if (p.name) row.name = p.name.slice(0, 80);
    if (p.osVersion) row.os_version = p.osVersion;
    if (p.appVersion) row.app_version = p.appVersion;
    check(await this.db.from("dh_computers").update(row).eq("id", id));
  }
  async deleteComputer(userId: string, computerId: string) {
    const rows = check(await this.db.from("dh_computers").delete().eq("id", computerId).eq("user_id", userId).select("id"));
    return (rows as Row[]).length === 1;
  }

  async hasReport(reportId: string) {
    const r = check(await this.db.from("dh_reports").select("report_id").eq("report_id", reportId).maybeSingle());
    return !!r;
  }
  async recordReport(reportId: string, computerId: string, at: string) {
    check(await this.db.from("dh_reports").upsert({ report_id: reportId, computer_id: computerId, received_at: at }, { onConflict: "report_id", ignoreDuplicates: true }));
    await this.db.from("dh_reports").delete().eq("computer_id", computerId).lt("received_at", new Date(Date.parse(at) - 7 * 86400_000).toISOString());
  }

  async replaceDevices(userId: string, computerId: string, devices: DeviceRecord[]) {
    const keys = devices.map((d) => d.key);
    if (devices.length) {
      check(await this.db.from("dh_devices").upsert(devices.map((d) => ({
        user_id: userId, computer_id: computerId, device_key: d.key, category: d.category, source: d.source, name: d.name,
        custom_name: d.customName ?? null, hidden: d.hidden, favourite: d.favourite, connection: d.connection,
        last_seen: d.lastSeen ?? null, battery: d.battery, battery_health: d.batteryHealth, storage: d.storage,
        thermal: d.thermal, attention: d.attention, reported_at: d.reportedAt,
      })), { onConflict: "computer_id,device_key" }));
    }
    // Devices this Mac no longer reports (forgotten on the Mac) are removed.
    let del = this.db.from("dh_devices").delete().eq("user_id", userId).eq("computer_id", computerId);
    if (keys.length) del = del.not("device_key", "in", `(${keys.map((k) => `"${k}"`).join(",")})`);
    check(await del);
  }
  async listDevices(userId: string) {
    return (check(await this.db.from("dh_devices").select().eq("user_id", userId)) as Row[]).map(toDevice);
  }

  async insertAlerts(alerts: AlertRecord[]) {
    const rows = check(await this.db.from("dh_alerts").upsert(alerts.map((a) => ({
      user_id: a.userId, computer_id: a.computerId, dedupe_key: a.dedupeKey, kind: a.kind, device_key: a.deviceKey, level: a.level,
      title: a.title, body: a.body, created_at: a.createdAt, received_at: a.receivedAt, delivered_natively: a.deliveredNatively,
      route_to: a.routeTo,
    })), { onConflict: "user_id,dedupe_key", ignoreDuplicates: true }).select("id"));
    return (rows as Row[] | null)?.length ?? 0;
  }
  async listAlerts(userId: string, since: string, limit: number) {
    return (check(await this.db.from("dh_alerts").select().eq("user_id", userId).gte("received_at", since)
      .order("received_at", { ascending: false }).limit(limit)) as Row[]).map(toAlert);
  }
  async pendingRelays(userId: string, computerId: string, since: string) {
    return (check(await this.db.from("dh_alerts").select().eq("user_id", userId).eq("route_to", computerId)
      .is("relayed_at", null).gte("received_at", since)) as Row[]).map(toAlert);
  }
  async markRelayed(userId: string, computerId: string, keys: string[], at: string) {
    if (!keys.length) return;
    check(await this.db.from("dh_alerts").update({ relayed_at: at }).eq("user_id", userId).eq("route_to", computerId).in("dedupe_key", keys));
  }

  async insertSamples(samples: SampleRecord[]) {
    check(await this.db.from("dh_samples").upsert(samples.map((s) => ({
      user_id: s.userId, computer_id: s.computerId, device_key: s.deviceKey, at: s.at, percent: s.percent, charge_state: s.chargeState,
    })), { onConflict: "computer_id,device_key,at", ignoreDuplicates: true }));
  }
  async listSamples(userId: string, since: string) {
    return (check(await this.db.from("dh_samples").select().eq("user_id", userId).gte("at", since).order("at").limit(5000)) as Row[])
      .map((r) => ({ userId: r.user_id as string, computerId: r.computer_id as string, deviceKey: r.device_key as string,
                     at: r.at as string, percent: Number(r.percent), chargeState: r.charge_state as string }));
  }
  async pruneSamples(computerId: string, before: string) {
    check(await this.db.from("dh_samples").delete().eq("computer_id", computerId).lt("at", before));
  }

  async getSettings(userId: string) {
    const r = check(await this.db.from("dh_settings").select().eq("user_id", userId).maybeSingle());
    return r ? toSettings(r as Row) : null;
  }
  async writeSettings(userId: string, baseVersion: number, next: Omit<SettingsRecord, "userId" | "version">) {
    const row = { preferences: next.preferences, device_overrides: next.deviceOverrides, updated_at: next.updatedAt, updated_by: next.updatedBy, version: baseVersion + 1 };
    if (baseVersion === 0) {
      // First write: insert; a concurrent first write loses on the primary key → conflict.
      const r = await this.db.from("dh_settings").insert({ user_id: userId, ...row }).select().maybeSingle();
      if (r.error) {
        if (r.error.code === "23505") return null;
        throw new Error(`database: ${r.error.message}`);
      }
      return r.data ? toSettings(r.data as Row) : null;
    }
    // Compare-and-set on version.
    const rows = check(await this.db.from("dh_settings").update(row).eq("user_id", userId).eq("version", baseVersion).select());
    return (rows as Row[]).length === 1 ? toSettings((rows as Row[])[0]) : null;
  }
}
