/**
 * Device Health wire format. Mirrors yuzu-store/Notch/Sources/NotchCore/DeviceHealth/DeviceHealthSync.swift
 * (schema 1). The native app is the only source of readings; the website only displays them.
 */
import { z } from "zod";

export const CATEGORIES = ["computer", "headphones", "keyboard", "mouse", "trackpad", "gameController", "phone", "tablet", "storage", "other"] as const;
export const SOURCES = ["hostBattery", "hostStorage", "bluetoothLE", "bluetoothClassic"] as const;
export const CHARGE_STATES = ["charging", "discharging", "charged", "pluggedNotCharging", "unknown"] as const;
export const READING_STATUSES = ["available", "unsupported", "permissionRequired", "temporarilyUnavailable", "stale", "disconnected"] as const;
export const CONNECTIONS = ["connected", "disconnected", "notApplicable", "unknown"] as const;
export const ALERT_KINDS = ["batteryLow", "chargeComplete", "disconnected", "storageLow", "osBatteryService", "meetingBattery"] as const;
export const LEVELS = ["low", "critical", "urgent"] as const;

const isoDate = z.string().max(40).refine((s) => !Number.isNaN(Date.parse(s)), "invalid date");
const short = (n: number) => z.string().max(n);

export const batteryValue = z.object({ percent: z.number().int().min(0).max(100), chargeState: z.enum(CHARGE_STATES) });
export const batteryHealthValue = z.object({
  osCondition: short(60).nullish(),
  osRecommendsService: z.boolean(),
  maximumCapacityPercent: z.number().int().min(0).max(200).nullish(),
  cycleCount: z.number().int().min(0).max(100000).nullish(),
});
export const storageValue = z.object({ availableBytes: z.number().int().min(0), totalBytes: z.number().int().min(0) });
export const thermalValue = z.enum(["nominal", "fair", "serious", "critical"]);

const reading = <T extends z.ZodTypeAny>(value: T) =>
  z.object({ status: z.enum(READING_STATUSES), value: value.nullish(), measuredAt: isoDate.nullish() });

export const deviceSnapshot = z.object({
  key: z.string().min(1).max(80).regex(/^[a-z-]+(:[a-f0-9]{8,64})?$/, "device keys are scoped, never raw identifiers"),
  category: z.enum(CATEGORIES),
  source: z.enum(SOURCES),
  name: short(120),
  customName: short(60).nullish(),
  hidden: z.boolean(),
  favourite: z.boolean(),
  connection: z.enum(CONNECTIONS),
  lastSeen: isoDate.nullish(),
  battery: reading(batteryValue),
  batteryHealth: reading(batteryHealthValue),
  storage: reading(storageValue),
  thermal: reading(thermalValue),
  attention: z.array(short(120)).max(10),
});

export const alertUpload = z.object({
  dedupeKey: z.string().min(1).max(200),
  kind: z.enum(ALERT_KINDS),
  deviceKey: z.string().min(1).max(80),
  level: z.enum(LEVELS).nullish(),
  title: short(200),
  body: short(500),
  createdAt: isoDate,
  deliveredNatively: z.boolean(),
});

export const sampleUpload = z.object({
  deviceKey: z.string().min(1).max(80),
  at: isoDate,
  percent: z.number().int().min(0).max(100),
  chargeState: z.enum(CHARGE_STATES),
});

export const computerInfo = z.object({
  name: z.string().min(1).max(80),
  platform: short(20).default("macOS"),
  osVersion: short(40),
  appVersion: short(40),
});

export const healthReport = z.object({
  schema: z.literal(1),
  reportID: z.string().min(8).max(64),
  computer: computerInfo,
  sentAt: isoDate,
  sequence: z.number().int().min(0),
  devices: z.array(deviceSnapshot).max(100),
  alerts: z.array(alertUpload).max(200),
  samples: z.array(sampleUpload).max(2000),
  settingsVersionApplied: z.number().int().min(0),
});

const thresholds = z.object({
  low: z.number().int().min(1).max(95),
  critical: z.number().int().min(1).max(95),
  urgent: z.number().int().min(1).max(95),
  urgentEnabled: z.boolean(),
}).refine((t) => t.critical < t.low && (!t.urgentEnabled || t.urgent < t.critical), "thresholds must be ordered: urgent < critical < low");

const routing = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("reportingMac") }),
  z.object({ kind: z.literal("preferredMac"), computerID: z.string().uuid() }),
  z.object({ kind: z.literal("browser") }),
]);

/** Account-level preferences. Unknown keys are dropped; missing keys keep the app's defaults. */
export const preferences = z.object({
  thresholds: thresholds.optional(),
  rearmMargin: z.number().int().min(2).max(15).optional(),
  nativeNotifications: z.boolean().optional(),
  inAppAlerts: z.boolean().optional(),
  sound: z.boolean().optional(),
  quietHours: z.object({ enabled: z.boolean(), startMinute: z.number().int().min(0).max(1439), endMinute: z.number().int().min(0).max(1439) }).optional(),
  notifyCategories: z.array(z.enum(CATEGORIES)).max(CATEGORIES.length).optional(),
  routing: routing.optional(),
  chargeCompleteEnabled: z.boolean().optional(),
  chargeCompleteTarget: z.union([z.literal(80), z.literal(85), z.literal(90), z.literal(95), z.literal(100)]).optional(),
  disconnectAlertsEnabled: z.boolean().optional(),
  disconnectGraceSeconds: z.number().int().min(15).max(1800).optional(),
  storageAlertsEnabled: z.boolean().optional(),
  storageWarningGB: z.number().int().min(2).max(1000).optional(),
  storageCriticalGB: z.number().int().min(1).max(500).optional(),
  meetingCheckEnabled: z.boolean().optional(),
  meetingLeadMinutes: z.number().int().min(2).max(60).optional(),
  meetingMinimumPercent: z.number().int().min(5).max(90).optional(),
  monitorBluetoothAccessories: z.boolean().optional(),
  keepLocalHistory: z.boolean().optional(),
  uploadHistory: z.boolean().optional(),
});

export const deviceOverride = z.object({
  customName: short(60).nullish(),
  hidden: z.boolean().optional(),
  favourite: z.boolean().optional(),
  notify: z.boolean().nullish(),
  thresholds: thresholds.nullish(),
  important: z.boolean().optional(),
  meetingCheck: z.boolean().optional(),
});

export const settingsPush = z.object({
  baseVersion: z.number().int().min(0),
  preferences,
  deviceOverrides: z.record(z.string().max(80), deviceOverride).refine((r) => Object.keys(r).length <= 200, "too many devices"),
});

export const linkPoll = z.object({ deviceCode: z.string().min(20).max(100) });
export const ackBody = z.object({ dedupeKeys: z.array(z.string().max(200)).max(200) });

export type HealthReport = z.infer<typeof healthReport>;
export type DeviceSnapshot = z.infer<typeof deviceSnapshot>;
export type AlertUpload = z.infer<typeof alertUpload>;
export type Preferences = z.infer<typeof preferences>;
export type DeviceOverride = z.infer<typeof deviceOverride>;
export type ComputerInfo = z.infer<typeof computerInfo>;
