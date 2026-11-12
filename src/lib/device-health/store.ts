/**
 * Storage interface for Device Health. Production: Supabase (supabase-store.ts).
 * Tests: an in-memory implementation (memory-store.ts) with identical semantics.
 * Every method that reads or writes user data takes the owning user id explicitly.
 */
import type { DeviceSnapshot, Preferences, DeviceOverride } from "./types";

export type Computer = {
  id: string;
  userId: string;
  name: string;
  platform: string;
  osVersion: string | null;
  appVersion: string | null;
  tokenHash: string;
  lastSequence: number;
  createdAt: string;
  lastSeenAt: string | null;
};

export type LinkRequest = {
  id: string;
  deviceCodeHash: string;
  userCode: string;
  computerName: string;
  osVersion: string | null;
  appVersion: string | null;
  createdAt: string;
  expiresAt: string;
  approvedBy: string | null;
  denied: boolean;
  consumedAt: string | null;
};

export type DeviceRecord = DeviceSnapshot & { computerId: string; userId: string; reportedAt: string };

export type AlertRecord = {
  userId: string;
  computerId: string;
  dedupeKey: string;
  kind: string;
  deviceKey: string;
  level: string | null;
  title: string;
  body: string;
  createdAt: string;
  receivedAt: string;
  deliveredNatively: boolean;
  routeTo: string | null;
  relayedAt: string | null;
};

export type SampleRecord = { userId: string; computerId: string; deviceKey: string; at: string; percent: number; chargeState: string };

export type SettingsRecord = {
  userId: string;
  version: number;
  preferences: Preferences;
  deviceOverrides: Record<string, DeviceOverride>;
  updatedAt: string;
  updatedBy: string | null;
};

export interface HealthStore {
  // Linking
  createLinkRequest(r: Omit<LinkRequest, "id" | "approvedBy" | "denied" | "consumedAt">): Promise<LinkRequest>;
  findLinkByDeviceCodeHash(hash: string): Promise<LinkRequest | null>;
  findLinkByUserCode(code: string): Promise<LinkRequest | null>;
  updateLink(id: string, patch: Partial<Pick<LinkRequest, "approvedBy" | "denied" | "consumedAt">>): Promise<void>;
  /** Marks a link consumed only if it wasn't already; returns false if another poll won the race. */
  consumeLink(id: string, at: string): Promise<boolean>;

  // Computers
  createComputer(c: Omit<Computer, "id" | "lastSequence" | "lastSeenAt">): Promise<Computer>;
  findComputerByTokenHash(hash: string): Promise<Computer | null>;
  listComputers(userId: string): Promise<Computer[]>;
  touchComputer(id: string, patch: { lastSeenAt: string; lastSequence?: number; name?: string; osVersion?: string; appVersion?: string }): Promise<void>;
  /** Deletes the computer and (by cascade) everything it reported. Scoped to the owner. */
  deleteComputer(userId: string, computerId: string): Promise<boolean>;

  // Idempotency
  hasReport(reportId: string): Promise<boolean>;
  recordReport(reportId: string, computerId: string, at: string): Promise<void>;

  // Readings
  replaceDevices(userId: string, computerId: string, devices: DeviceRecord[]): Promise<void>;
  listDevices(userId: string): Promise<DeviceRecord[]>;
  insertAlerts(alerts: AlertRecord[]): Promise<number>;
  listAlerts(userId: string, since: string, limit: number): Promise<AlertRecord[]>;
  pendingRelays(userId: string, computerId: string, since: string): Promise<AlertRecord[]>;
  markRelayed(userId: string, computerId: string, dedupeKeys: string[], at: string): Promise<void>;
  insertSamples(samples: SampleRecord[]): Promise<void>;
  listSamples(userId: string, since: string): Promise<SampleRecord[]>;
  pruneSamples(computerId: string, before: string): Promise<void>;

  // Settings
  getSettings(userId: string): Promise<SettingsRecord | null>;
  /** Writes when the stored version equals baseVersion (or no row exists and baseVersion is 0). Returns the new record or null on conflict. */
  writeSettings(userId: string, baseVersion: number, next: Omit<SettingsRecord, "userId" | "version">): Promise<SettingsRecord | null>;
}
