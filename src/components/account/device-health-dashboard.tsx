"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Battery, BatteryCharging, BatteryLow, Bell, BellOff, Bluetooth, CircleCheck, CircleExclamationPoint, Eye, EyeOff, Gamepad2,
  HardDrive, Headphones, Keyboard, Laptop, Mouse, Pencil, RefreshCw, Smartphone, Star, Tablet, Touchpad, Trash, Unplug,
} from "lucide-react";
import type { Dashboard } from "@/lib/device-health/service";
import { Button } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

type Device = Dashboard["devices"][number];
type Prefs = Dashboard["settings"]["preferences"];

const ICONS: Record<string, typeof Laptop> = {
  computer: Laptop, headphones: Headphones, keyboard: Keyboard, mouse: Mouse, trackpad: Touchpad, gameController: Gamepad2,
  phone: Smartphone, tablet: Tablet, storage: HardDrive, other: Bluetooth,
};

const CHARGE: Record<string, string> = {
  charging: "Charging", discharging: "On battery", charged: "Charged", pluggedNotCharging: "Plugged in, not charging", unknown: "",
};

const STATUS: Record<string, string> = {
  available: "Live", unsupported: "Not reported", permissionRequired: "Permission needed on the Mac",
  temporarilyUnavailable: "Temporarily unavailable", stale: "Out of date", disconnected: "Disconnected",
};

function ago(iso: string | null, now: number) {
  if (!iso) return "never";
  const s = Math.max(0, (now - Date.parse(iso)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  const d = Math.floor(s / 86400);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}

function gb(bytes: number) {
  const g = bytes / 1e9;
  return g >= 100 ? `${g.toFixed(0)} GB` : `${g.toFixed(1)} GB`;
}

async function call(path: string, method: string, body: unknown) {
  const res = await fetch(path, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error?.message ?? "Couldn't save. Try again.");
  return res.json();
}

/**
 * The signed-in Device Health dashboard. Everything here was reported by the user's linked
 * Macs; the browser never inspects devices. Stale and offline data is labelled as such.
 */
export function DeviceHealthDashboard({ email }: { email: string }) {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/device-health/dashboard?history=24", { cache: "no-store" });
      if (res.status === 401) { window.location.assign("/account"); return; }
      if (!res.ok) throw new Error();
      setData(await res.json());
      setError(null);
    } catch {
      setError("Couldn't load your devices. Retrying…");
    }
    setNow(Date.now());
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [load]);

  useBrowserAlerts(data);

  const save = async (fn: () => Promise<unknown>, ok: string) => {
    try { await fn(); setNotice(ok); await load(); } catch (e) { setNotice((e as Error).message); }
  };

  if (!data) return <p className="pb-24 text-muted">{error ?? "Loading your devices…"}</p>;

  const visible = data.devices.filter((d) => !d.hidden);
  const hidden = data.devices.filter((d) => d.hidden);
  const flagged = visible.filter((d) => d.attention.length > 0);
  const sorted = [...visible].sort((a, b) =>
    (b.attention.length > 0 ? 1 : 0) - (a.attention.length > 0 ? 1 : 0) || Number(b.favourite) - Number(a.favourite) ||
    a.displayName.localeCompare(b.displayName));

  return (
    <div className="flex flex-col gap-10 pb-24">
      {notice && <p role="status" className="m-0 rounded-2xl bg-lavender px-4 py-3 text-[15px]">{notice}</p>}

      <section aria-labelledby="attention" className="rounded-[28px] border border-line bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="attention" className="m-0 flex items-center gap-2 font-display text-[24px] font-semibold tracking-[-.02em]">
            {flagged.length ? <CircleExclamationPoint className="text-[#c2410c]" aria-hidden /> : <CircleCheck className="text-[#15803d]" aria-hidden />}
            {data.computers.length === 0 ? "No Macs linked yet" : flagged.length === 0 ? "Everything looks fine" : `${flagged.length} ${flagged.length === 1 ? "device needs" : "devices need"} attention`}
          </h2>
          <button type="button" onClick={load} className="flex items-center gap-1.5 text-[14px] text-muted hover:text-ink"><RefreshCw size={15} aria-hidden /> Refresh</button>
        </div>
        {flagged.length > 0 && (
          <ul className="mb-0 mt-4 flex list-none flex-col gap-2 p-0">
            {flagged.map((d) => (
              <li key={`${d.computerId}:${d.key}`} className="text-[15.5px]"><b>{d.displayName}</b> on {d.computerName}: {d.attention.join(" · ")}</li>
            ))}
          </ul>
        )}
        {data.computers.length === 0 && (
          <p className="mb-0 mt-3 text-[15.5px] text-muted">
            In TopShelf on your Mac, open Settings › Device Health › TopShelf account and choose “Link this Mac”. Readings appear here once it reports.
          </p>
        )}
        {error && <p className="mb-0 mt-3 text-[14px] text-muted">{error}</p>}
      </section>

      {data.computers.length > 0 && (
        <section aria-labelledby="devices">
          <h2 id="devices" className="mb-4 mt-0 font-display text-[28px] font-semibold tracking-[-.03em]">Devices</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sorted.map((d) => (
              <DeviceCard key={`${d.computerId}:${d.key}`} d={d} now={now} data={data} save={save} />
            ))}
          </div>
          {hidden.length > 0 && (
            <details className="mt-4 text-[15px]">
              <summary className="cursor-pointer text-muted">Hidden devices ({hidden.length})</summary>
              <ul className="mt-2 list-none p-0">
                {hidden.map((d) => (
                  <li key={`${d.computerId}:${d.key}`} className="flex items-center justify-between gap-3 py-1.5">
                    <span>{d.displayName} <span className="text-muted">· {d.computerName}</span></span>
                    <button type="button" className="text-[14px] underline underline-offset-4"
                      onClick={() => save(() => call("/api/device-health/web/device", "PATCH", { baseVersion: data.settings.version, deviceKey: d.key, patch: { hidden: false } }), "Shown again.")}>Show</button>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>
      )}

      {data.alerts.length > 0 && (
        <section aria-labelledby="alerts">
          <h2 id="alerts" className="mb-4 mt-0 font-display text-[28px] font-semibold tracking-[-.03em]">Recent alerts</h2>
          <ul className="m-0 flex list-none flex-col divide-y divide-line rounded-[24px] border border-line bg-white p-0">
            {data.alerts.slice(0, 15).map((a) => (
              <li key={a.dedupeKey} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3">
                <span><b className="font-semibold">{a.title}</b> <span className="text-muted">— {a.body}</span></span>
                <span className="text-[13.5px] text-muted">{a.computerName} · {ago(a.createdAt, now)}{a.deliveredNatively ? " · shown on the Mac" : ""}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <PreferencesForm data={data} save={save} />
      <Computers data={data} now={now} save={save} />
      <p className="m-0 text-[13.5px] text-muted">Signed in as {email}. Readings come only from Macs you've linked; this website can't see your devices by itself.</p>
    </div>
  );
}

// MARK: - Device card

function DeviceCard({ d, now, data, save }: { d: Device; now: number; data: Dashboard; save: (fn: () => Promise<unknown>, ok: string) => void }) {
  const Icon = ICONS[d.category] ?? Bluetooth;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(d.customName ?? "");
  const b = d.battery;
  const bv = b.value as { percent: number; chargeState: string } | null;
  const showBattery = bv && b.status !== "unsupported";
  const computer = data.computers.find((c) => c.id === d.computerId);
  const patch = (p: object, ok: string) =>
    save(() => call("/api/device-health/web/device", "PATCH", { baseVersion: data.settings.version, deviceKey: d.key, patch: p }), ok);
  const pendingNote = d.pendingSync && computer && !computer.online
    ? `Saved. ${computer.name} applies it when it next connects (last seen ${ago(computer.lastSeenAt, now)}).` : null;
  const samples = data.samples.filter((s) => s.deviceKey === d.key && s.computerId === d.computerId);

  return (
    <article className={cn("flex flex-col gap-3 rounded-[24px] border bg-white p-5", d.attention.length ? "border-[#f59e0b]" : "border-line")}>
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sand"><Icon size={21} aria-hidden /></span>
        <div className="min-w-0 flex-1">
          {editing ? (
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setEditing(false); patch({ customName: name.trim() || null }, "Renamed."); }}>
              <input aria-label="Device name" autoFocus maxLength={60} value={name} placeholder={d.name} onChange={(e) => setName(e.target.value)}
                className="h-9 min-w-0 flex-1 rounded-xl border border-line-strong px-3 text-[15px]" />
              <button type="submit" className="text-[14px] underline underline-offset-4">Save</button>
            </form>
          ) : (
            <h3 className="m-0 flex items-center gap-1.5 truncate text-[17px] font-semibold">
              {d.displayName}
              {d.favourite && <Star size={14} className="fill-[#f5b301] text-[#f5b301]" aria-label="Favourite" />}
            </h3>
          )}
          <p className="m-0 text-[13.5px] text-muted">
            {d.computerName}{d.key === "host" ? " (the Mac itself)" : ""} · {d.connection === "disconnected" ? `disconnected, last seen ${ago(d.lastSeen, now)}` : `reported ${ago(d.reportedAt, now)}`}
            {computer && !computer.online ? " · Mac offline" : ""}
          </p>
        </div>
        {showBattery ? (
          <div className="text-right">
            <p className={cn("m-0 flex items-center justify-end gap-1 text-[22px] font-semibold tabular-nums", b.status !== "available" && "text-muted")}>
              {bv.chargeState === "charging" ? <BatteryCharging size={18} aria-hidden /> : bv.percent <= 20 ? <BatteryLow size={18} aria-hidden /> : <Battery size={18} aria-hidden />}
              {bv.percent}%
            </p>
            <p className="m-0 text-[12.5px] text-muted">{b.status === "available" ? (CHARGE[bv.chargeState] || "Live") : `${STATUS[b.status]} · ${ago(b.measuredAt, now)}`}</p>
          </div>
        ) : (
          <div className="text-right">
            <p className="m-0 text-[22px] font-semibold text-muted">—</p>
            <p className="m-0 max-w-[150px] text-[12.5px] text-muted">{batteryNote(d)}</p>
          </div>
        )}
      </div>

      {d.attention.length > 0 && (
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {d.attention.map((a) => <li key={a} className="rounded-full bg-peach px-2.5 py-1 text-[13px]">{a}</li>)}
        </ul>
      )}

      {d.key === "host" && <HostDetails d={d} now={now} />}
      {samples.length >= 3 && <Sparkline samples={samples} />}

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-[14px]">
        <button type="button" className="flex items-center gap-1 hover:underline" onClick={() => setEditing(!editing)}><Pencil size={14} aria-hidden /> Rename</button>
        <button type="button" className="flex items-center gap-1 hover:underline" onClick={() => patch({ favourite: !d.favourite }, d.favourite ? "Removed from favourites." : "Added to favourites.")}>
          <Star size={14} aria-hidden /> {d.favourite ? "Unfavourite" : "Favourite"}
        </button>
        <button type="button" className="flex items-center gap-1 hover:underline" onClick={() => patch({ notify: d.notify === false }, d.notify === false ? "Alerts on." : "Alerts off for this device.")}>
          {d.notify === false ? <BellOff size={14} aria-hidden /> : <Bell size={14} aria-hidden />} {d.notify === false ? "Alerts off" : "Alerts on"}
        </button>
        {d.key !== "host" && (
          <button type="button" className="flex items-center gap-1 hover:underline" onClick={() => patch({ important: !d.important }, d.important ? "Disconnect alerts off." : "You'll be told if it disconnects.")}>
            <Unplug size={14} aria-hidden /> {d.important ? "Disconnect alert on" : "Alert if it disconnects"}
          </button>
        )}
        <button type="button" className="flex items-center gap-1 hover:underline" onClick={() => patch({ hidden: true }, "Hidden. Show it again under Hidden devices.")}><EyeOff size={14} aria-hidden /> Hide</button>
      </div>
      {pendingNote && <p className="m-0 text-[13px] text-muted">{pendingNote}</p>}
    </article>
  );
}

function batteryNote(d: Device) {
  if (d.battery.status === "unsupported") {
    if (d.key === "host") return "No battery";
    return d.source === "bluetoothClassic" ? "This accessory's battery isn't available to apps on macOS" : "Battery not reported";
  }
  return STATUS[d.battery.status] ?? "Unknown";
}

function HostDetails({ d, now }: { d: Device; now: number }) {
  const s = d.storage.value as { availableBytes: number; totalBytes: number } | null;
  const h = d.batteryHealth.value as { osCondition?: string; osRecommendsService: boolean } | null;
  const t = d.thermal.value as string | null;
  return (
    <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[14px]">
      <dt className="text-muted">Storage</dt>
      <dd className="m-0">{s ? `${gb(s.availableBytes)} free of ${gb(s.totalBytes)}` : STATUS[d.storage.status]}{d.storage.stale ? ` (${ago(d.storage.measuredAt, now)})` : ""}</dd>
      <dt className="text-muted">Battery condition</dt>
      <dd className="m-0">{h?.osCondition ? `${h.osCondition} (reported by macOS)` : STATUS[d.batteryHealth.status]}</dd>
      <dt className="text-muted">Temperature</dt>
      <dd className="m-0">{t ? ({ nominal: "Normal", fair: "Slightly elevated", serious: "High (macOS limiting performance)", critical: "Critical" } as Record<string, string>)[t] : STATUS[d.thermal.status]}</dd>
    </dl>
  );
}

/** Battery level over the last 24 hours (uploaded history only). */
function Sparkline({ samples }: { samples: Dashboard["samples"] }) {
  const pts = samples.map((s) => ({ t: Date.parse(s.at), p: s.percent }));
  const t0 = pts[0].t, t1 = pts[pts.length - 1].t || t0 + 1;
  const w = 280, h = 40;
  const d = pts.map((p, i) => `${i ? "L" : "M"}${(((p.t - t0) / Math.max(1, t1 - t0)) * w).toFixed(1)},${(h - (p.p / 100) * h).toFixed(1)}`).join(" ");
  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-10 w-full" role="img" aria-label={`Battery from ${pts[0].p}% to ${pts[pts.length - 1].p}% over the last day`}>
        <path d={d} fill="none" stroke="var(--color-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption className="text-[12px] text-muted">Last 24 hours (uploaded history)</figcaption>
    </figure>
  );
}

// MARK: - Preferences

function PreferencesForm({ data, save }: { data: Dashboard; save: (fn: () => Promise<unknown>, ok: string) => void }) {
  const p = data.settings.preferences as Prefs;
  const t = p.thresholds ?? { low: 20, critical: 10, urgent: 5, urgentEnabled: false };
  const [draft, setDraft] = useState(t);
  useEffect(() => setDraft(p.thresholds ?? { low: 20, critical: 10, urgent: 5, urgentEnabled: false }), [p.thresholds]);
  const valid = draft.critical < draft.low && (!draft.urgentEnabled || draft.urgent < draft.critical);
  const patch = (x: Prefs, ok: string) => save(() => call("/api/device-health/web/settings", "PATCH", { baseVersion: data.settings.version, patch: x }), ok);
  const routing = p.routing?.kind === "preferredMac" ? `mac:${p.routing.computerID}` : (p.routing?.kind ?? "reportingMac");
  const anyOffline = data.computers.some((c) => !c.online);
  const num = "h-10 w-20 rounded-xl border border-line-strong px-3 text-[15px] tabular-nums";

  return (
    <section aria-labelledby="prefs" className="rounded-[28px] border border-line bg-white p-6">
      <h2 id="prefs" className="m-0 font-display text-[24px] font-semibold tracking-[-.02em]">Alert settings</h2>
      <p className="mb-0 mt-2 text-[14.5px] text-muted">
        These apply to every linked Mac. {anyOffline ? "Macs that are offline pick up changes the next time they connect." : "Linked Macs pick up changes within a few minutes."}
      </p>

      <fieldset className="mt-6 border-0 p-0">
        <legend className="text-[16px] font-semibold">Battery levels</legend>
        <div className="mt-3 flex flex-wrap items-end gap-4 text-[15px]">
          <label className="flex flex-col gap-1">Low<input type="number" min={2} max={95} className={num} value={draft.low} onChange={(e) => setDraft({ ...draft, low: Number(e.target.value) })} /></label>
          <label className="flex flex-col gap-1">Critical<input type="number" min={1} max={94} className={num} value={draft.critical} onChange={(e) => setDraft({ ...draft, critical: Number(e.target.value) })} /></label>
          <label className="flex items-center gap-2 pb-2"><input type="checkbox" checked={draft.urgentEnabled} onChange={(e) => setDraft({ ...draft, urgentEnabled: e.target.checked })} /> Urgent</label>
          {draft.urgentEnabled && <label className="flex flex-col gap-1">Urgent<input type="number" min={1} max={93} className={num} value={draft.urgent} onChange={(e) => setDraft({ ...draft, urgent: Number(e.target.value) })} /></label>}
          <Button size="sm" variant="dark" disabled={!valid} onClick={() => patch({ thresholds: draft }, "Battery levels saved.")}>Save levels</Button>
        </div>
        {!valid && <p className="mb-0 mt-2 text-[14px] text-[#b42318]">Levels must go down in order: low, then critical, then urgent.</p>}
      </fieldset>

      <fieldset className="mt-6 border-0 p-0">
        <legend className="text-[16px] font-semibold">How you're told</legend>
        <div className="mt-3 flex flex-col gap-2 text-[15px]">
          <Toggle label="macOS notifications" on={p.nativeNotifications ?? true} onChange={(v) => patch({ nativeNotifications: v }, "Saved.")} />
          <Toggle label="Alerts in the notch" on={p.inAppAlerts ?? true} onChange={(v) => patch({ inAppAlerts: v }, "Saved.")} />
          <Toggle label="Sound" on={p.sound ?? false} onChange={(v) => patch({ sound: v }, "Saved.")} />
          <Toggle label="Remind me when a device is charged" on={p.chargeCompleteEnabled ?? false} onChange={(v) => patch({ chargeCompleteEnabled: v }, "Saved.")} />
          <Toggle label="Low storage warnings" on={p.storageAlertsEnabled ?? true} onChange={(v) => patch({ storageAlertsEnabled: v }, "Saved.")} />
          <Toggle label="Upload battery history (for the charts here; kept 30 days)" on={p.uploadHistory ?? false} onChange={(v) => patch({ uploadHistory: v }, v ? "History uploads start with the next report." : "History uploads stopped.")} />
          <label className="mt-2 flex flex-wrap items-center gap-2">
            Who shows each alert
            <select className="h-10 rounded-xl border border-line-strong bg-white px-3" value={routing}
              onChange={(e) => {
                const v = e.target.value;
                patch({ routing: v.startsWith("mac:") ? { kind: "preferredMac", computerID: v.slice(4) } : { kind: v as "reportingMac" | "browser" } }, "Saved.");
              }}>
              <option value="reportingMac">The Mac that notices (recommended)</option>
              {data.computers.map((c) => <option key={c.id} value={`mac:${c.id}`}>Only {c.name}</option>)}
              <option value="browser">This website, while it's open</option>
            </select>
          </label>
          <p className="m-0 text-[13.5px] text-muted">Each alert is shown in one place, so you don't get the same one on every Mac and browser. Macs follow your Focus and Do Not Disturb settings.</p>
        </div>
      </fieldset>
    </section>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

// MARK: - Computers

function Computers({ data, now, save }: { data: Dashboard; now: number; save: (fn: () => Promise<unknown>, ok: string) => void }) {
  if (!data.computers.length) return null;
  return (
    <section aria-labelledby="macs">
      <h2 id="macs" className="mb-4 mt-0 font-display text-[28px] font-semibold tracking-[-.03em]">Linked Macs</h2>
      <ul className="m-0 flex list-none flex-col divide-y divide-line rounded-[24px] border border-line bg-white p-0">
        {data.computers.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <span className="flex items-center gap-3">
              <Laptop size={20} aria-hidden />
              <span>
                <b className="font-semibold">{c.name}</b>
                <span className="block text-[13.5px] text-muted">
                  {c.online ? "Online" : "Offline"} · last report {ago(c.lastSeenAt, now)}{c.osVersion ? ` · macOS ${c.osVersion}` : ""}{c.appVersion ? ` · TopShelf ${c.appVersion}` : ""}
                </span>
              </span>
            </span>
            <Button size="sm" variant="outline" onClick={() => {
              if (window.confirm(`Unlink ${c.name}? Its access is revoked and the devices, readings and alerts it reported are deleted from your account.`))
                save(() => call("/api/device-health/web/computer", "DELETE", { computerId: c.id }), `${c.name} was unlinked and its data deleted.`);
            }}><Trash size={15} aria-hidden /> Unlink</Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// MARK: - Browser notifications (opt-in, only while the page is open)

/**
 * When the user picked "This website, while it's open" and allowed notifications in this
 * browser, new alerts that no Mac showed are announced here. There is no web push: nothing
 * arrives while the site is closed, and the UI says so.
 */
function useBrowserAlerts(data: Dashboard | null) {
  const seen = useRef<Set<string> | null>(null);
  const enabled = useMemo(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return false;
    try { return localStorage.getItem("dh.browserAlerts") === "on" && Notification.permission === "granted"; } catch { return false; }
  }, [data]);
  useEffect(() => {
    if (!data) return;
    const keys = new Set(data.alerts.map((a) => a.dedupeKey));
    if (seen.current === null) { seen.current = keys; return; }       // first load: don't replay history
    const routing = (data.settings.preferences as Prefs).routing?.kind;
    for (const a of data.alerts) {
      if (seen.current.has(a.dedupeKey)) continue;
      seen.current.add(a.dedupeKey);
      if (enabled && routing === "browser" && !a.deliveredNatively) new Notification(a.title, { body: a.body, tag: a.dedupeKey });
    }
  }, [data, enabled]);
}

export function BrowserAlertsToggle() {
  const [state, setState] = useState<"unsupported" | "off" | "on" | "denied">("off");
  useEffect(() => {
    if (!("Notification" in window)) { setState("unsupported"); return; }
    let on = false;
    try { on = localStorage.getItem("dh.browserAlerts") === "on"; } catch { /* storage blocked */ }
    setState(Notification.permission === "denied" ? "denied" : on && Notification.permission === "granted" ? "on" : "off");
  }, []);
  if (state === "unsupported") return null;
  return (
    <div className="rounded-[24px] border border-line bg-white p-5 text-[15px]">
      <p className="m-0 font-semibold">Browser notifications</p>
      <p className="mb-3 mt-1 text-[14px] text-muted">Only while this page is open in this browser, and only when “Who shows each alert” is set to this website. Nothing is sent while the site is closed.</p>
      {state === "denied" ? (
        <p className="m-0 text-[14px] text-muted">Notifications are blocked for this site in your browser settings.</p>
      ) : (
        <Button size="sm" variant="outline" onClick={async () => {
          if (state === "on") { try { localStorage.setItem("dh.browserAlerts", "off"); } catch { /* ignore */ } setState("off"); return; }
          const p = await Notification.requestPermission();
          if (p === "granted") { try { localStorage.setItem("dh.browserAlerts", "on"); } catch { /* ignore */ } setState("on"); } else setState(p === "denied" ? "denied" : "off");
        }}>{state === "on" ? <><EyeOff size={15} aria-hidden /> Turn off in this browser</> : <><Eye size={15} aria-hidden /> Turn on in this browser</>}</Button>
      )}
    </div>
  );
}
