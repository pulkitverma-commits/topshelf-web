import { Bluetooth, CircleExclamationPoint, Headphones, Keyboard, Laptop, Mouse, RefreshCw, Zap } from "lucide-react";

/**
 * An illustration of the Device Health view in the notch, drawn to match the app's layout
 * (DeviceHealthModuleView.swift). Values are examples, not a live reading, and the caption says so.
 */
const ROWS = [
  { Icon: Keyboard, name: "MX Keys", detail: "Battery 9% — charge soon", level: 9, tone: "red" as const },
  { Icon: Laptop, name: "MacBook Air", detail: "On battery · 3h 10m left (macOS estimate) · 118 GB free", level: 64, tone: "white" as const },
  { Icon: Mouse, name: "MX Master 3S", detail: "about 2 days left (estimate)", level: 72, tone: "white" as const, charging: false },
  { Icon: Headphones, name: "AirPods Pro", detail: "Connected · battery not available to apps", level: null, tone: "white" as const },
];

export function DeviceHealthPreview() {
  return (
    <figure className="m-0">
      <div className="mx-auto max-w-[560px] rounded-b-[34px] rounded-t-[14px] bg-black px-5 pb-5 pt-4 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,.45)]">
        <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold">
          <CircleExclamationPoint className="size-4 text-[#fb923c]" aria-hidden="true" />
          <span>MX Keys: Battery 9% — charge soon</span>
          <RefreshCw className="ml-auto size-3.5 text-white/55" aria-hidden="true" />
        </div>
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {ROWS.map((r) => (
            <li key={r.name} className="flex items-center gap-3 rounded-xl bg-white/[.08] px-3 py-2">
              <r.Icon className={`size-4 flex-none ${r.tone === "red" ? "text-[#f87171]" : "text-white"}`} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium">{r.name}</span>
                <span className="block truncate text-[11px] text-white/60">{r.detail}</span>
              </span>
              {r.level === null ? (
                <span className="text-[14px] font-semibold text-white/35">—</span>
              ) : (
                <span className="flex flex-col items-end gap-1">
                  <span className="flex items-center gap-1 text-[14px] font-semibold tabular-nums">{r.charging && <Zap className="size-3 text-[#4ade80]" aria-hidden="true" />}{r.level}%</span>
                  <span className="h-1 w-10 overflow-hidden rounded-full bg-white/15">
                    <span className="block h-full rounded-full" style={{ width: `${r.level}%`, background: r.level <= 10 ? "#ef4444" : r.level <= 20 ? "#f59e0b" : "#fff" }} />
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className="mb-0 mt-2.5 flex items-center gap-1.5 text-[10.5px] text-white/40">
          <Bluetooth className="size-3" aria-hidden="true" />
          Battery shows for accessories that report it to apps.
        </p>
      </div>
      <figcaption className="mt-3 text-center text-[13.5px] text-muted">Illustration of Device Health in the notch, with example values.</figcaption>
    </figure>
  );
}
