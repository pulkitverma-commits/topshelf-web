/** In-memory HealthStore for tests. Mirrors the SQL constraints (uniques, cascades, ownership). */
import { randomUUID } from "node:crypto";
import type { HealthStore, Computer, LinkRequest, DeviceRecord, AlertRecord, SampleRecord, SettingsRecord } from "./store";

export class MemoryStore implements HealthStore {
  links = new Map<string, LinkRequest>();
  computers = new Map<string, Computer>();
  devices: DeviceRecord[] = [];
  alerts: AlertRecord[] = [];
  samples: SampleRecord[] = [];
  settings = new Map<string, SettingsRecord>();
  reports = new Map<string, string>();

  async createLinkRequest(r: Omit<LinkRequest, "id" | "approvedBy" | "denied" | "consumedAt">) {
    const link: LinkRequest = { ...r, id: randomUUID(), approvedBy: null, denied: false, consumedAt: null };
    this.links.set(link.id, link);
    return link;
  }
  async findLinkByDeviceCodeHash(hash: string) { return [...this.links.values()].find((l) => l.deviceCodeHash === hash) ?? null; }
  async findLinkByUserCode(code: string) { return [...this.links.values()].find((l) => l.userCode === code) ?? null; }
  async updateLink(id: string, patch: Partial<LinkRequest>) { const l = this.links.get(id); if (l) Object.assign(l, patch); }
  async consumeLink(id: string, at: string) {
    const l = this.links.get(id);
    if (!l || l.consumedAt) return false;
    l.consumedAt = at;
    return true;
  }

  async createComputer(c: Omit<Computer, "id" | "lastSequence" | "lastSeenAt">) {
    const computer: Computer = { ...c, id: randomUUID(), lastSequence: 0, lastSeenAt: null };
    this.computers.set(computer.id, computer);
    return computer;
  }
  async findComputerByTokenHash(hash: string) { return [...this.computers.values()].find((c) => c.tokenHash === hash) ?? null; }
  async listComputers(userId: string) { return [...this.computers.values()].filter((c) => c.userId === userId); }
  async touchComputer(id: string, patch: Partial<Computer>) {
    const c = this.computers.get(id);
    if (c) Object.assign(c, Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)));
  }
  async deleteComputer(userId: string, computerId: string) {
    const c = this.computers.get(computerId);
    if (!c || c.userId !== userId) return false;
    this.computers.delete(computerId);
    this.devices = this.devices.filter((d) => d.computerId !== computerId);
    this.alerts = this.alerts.filter((a) => a.computerId !== computerId);
    this.samples = this.samples.filter((s) => s.computerId !== computerId);
    for (const [k, v] of this.reports) if (v === computerId) this.reports.delete(k);
    for (const a of this.alerts) if (a.routeTo === computerId) a.routeTo = null;
    return true;
  }

  async hasReport(reportId: string) { return this.reports.has(reportId); }
  async recordReport(reportId: string, computerId: string) { this.reports.set(reportId, computerId); }

  async replaceDevices(userId: string, computerId: string, devices: DeviceRecord[]) {
    this.devices = this.devices.filter((d) => d.computerId !== computerId).concat(devices.map((d) => ({ ...d, userId, computerId })));
  }
  async listDevices(userId: string) { return this.devices.filter((d) => d.userId === userId); }

  async insertAlerts(alerts: AlertRecord[]) {
    let n = 0;
    for (const a of alerts) {
      if (this.alerts.some((x) => x.userId === a.userId && x.dedupeKey === a.dedupeKey)) continue;
      this.alerts.push({ ...a }); n++;
    }
    return n;
  }
  async listAlerts(userId: string, since: string, limit: number) {
    return this.alerts.filter((a) => a.userId === userId && a.receivedAt >= since)
      .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt)).slice(0, limit);
  }
  async pendingRelays(userId: string, computerId: string, since: string) {
    return this.alerts.filter((a) => a.userId === userId && a.routeTo === computerId && !a.relayedAt && a.receivedAt >= since);
  }
  async markRelayed(userId: string, computerId: string, keys: string[], at: string) {
    for (const a of this.alerts) if (a.userId === userId && a.routeTo === computerId && keys.includes(a.dedupeKey)) a.relayedAt = at;
  }

  async insertSamples(samples: SampleRecord[]) {
    for (const s of samples) {
      if (this.samples.some((x) => x.computerId === s.computerId && x.deviceKey === s.deviceKey && x.at === s.at)) continue;
      this.samples.push(s);
    }
  }
  async listSamples(userId: string, since: string) { return this.samples.filter((s) => s.userId === userId && s.at >= since); }
  async pruneSamples(computerId: string, before: string) { this.samples = this.samples.filter((s) => s.computerId !== computerId || s.at >= before); }

  async getSettings(userId: string) { return this.settings.get(userId) ?? null; }
  async writeSettings(userId: string, baseVersion: number, next: Omit<SettingsRecord, "userId" | "version">) {
    const cur = this.settings.get(userId);
    if ((cur?.version ?? 0) !== baseVersion) return null;
    const rec: SettingsRecord = { ...next, userId, version: baseVersion + 1 };
    this.settings.set(userId, rec);
    return rec;
  }
}
