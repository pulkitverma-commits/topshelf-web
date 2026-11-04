"use client";

import { RotateCcw, Video } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { TRACKS } from "@/lib/demo-data";
import { cn, formatTime } from "@/lib/utils";
import { AlbumArt, Scrubber, TrackMeta, TransportControls } from "./bits";
import { ShelfTray } from "./shelf";

/** Music widget as it appears inside the expanded notch. */
export function MusicWidget({ compact }: { compact: boolean }) {
  const { track, trackIndex, nextTrack, selectTrack, playing, togglePlay } = useDemo();
  return (
    <div className="flex flex-1 flex-col gap-2.5">
      <div className={cn("flex items-center", compact ? "flex-wrap gap-2.5" : "gap-4")}>
        <button
          type="button"
          onClick={() => {
            nextTrack();
            if (!playing) togglePlay();
          }}
          aria-label="Change artwork: play the next track"
          className="rounded-[14px] shadow-[0_6px_18px_-8px_rgba(0,0,0,.5)] transition-transform duration-500 ease-spring active:scale-[.93]"
        >
          <AlbumArt art={track.art} className={cn("rounded-[14px]", compact ? "size-[60px]" : "size-[84px]")} />
        </button>
        <div className="min-w-0 flex-1">
          <TrackMeta />
          <Scrubber />
        </div>
        <TransportControls className={cn(compact && "w-full justify-center")} />
      </div>
      {!compact && (
        <div className="mt-auto flex items-center gap-2">
          <small className="mr-1 text-[11px] uppercase tracking-[.06em] text-white/50">Queue</small>
          {TRACKS.map((t, i) => (
            <button
              key={t.title}
              type="button"
              onClick={() => selectTrack(i)}
              aria-label={`Play ${t.title}`}
              aria-current={i === trackIndex}
              className={cn(
                "rounded-[10px] transition-[opacity,box-shadow,transform] duration-300 ease-spring hover:opacity-90",
                i === trackIndex ? "opacity-100 shadow-[0_0_0_2px_#000,0_0_0_4px_var(--color-accent)]" : "opacity-50",
              )}
            >
              <AlbumArt art={t.art} className="size-11 rounded-[10px]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ShelfWidget() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <ShelfTray />
      <p className="m-0 flex-none text-[11.5px] text-white/50">Drag files between the desktop and the Shelf, or tap a file to move it.</p>
    </div>
  );
}

export function JoinButton({ className }: { className?: string }) {
  const { joined, toggleJoined } = useDemo();
  return (
    <button
      type="button"
      onClick={toggleJoined}
      aria-pressed={joined}
      className={cn(
        "relative inline-flex h-11 items-center gap-2 rounded-full px-[18px] text-sm text-white transition-[background-color,transform] duration-300 ease-spring active:scale-95",
        joined ? "bg-[#18815A]" : "loop-ring bg-accent-deep",
        className,
      )}
    >
      <Video className="size-4" strokeWidth={1.8} />
      {joined ? "Joined (demo)" : "Join"}
    </button>
  );
}

export function CalendarWidget({ compact }: { compact: boolean }) {
  const later = [
    { time: "12:00", title: "Lunch with Sam", color: "#4ADE9B" },
    { time: "15:30", title: "Sprint planning", color: "#F5A27A" },
    { time: "17:00", title: "Gym", color: "#C9C3FF" },
  ];
  return (
    <div className={cn("grid min-h-0 flex-1 gap-3", compact ? "grid-cols-1" : "grid-cols-[1.3fr_1fr]")}>
      <div className="flex flex-col gap-0.5 rounded-2xl bg-white/[.08] px-3.5 py-3">
        <span className="text-xs text-accent-soft">In 4 min · 10:30 – 11:00</span>
        <span className="font-display text-lg font-semibold tracking-[-.01em]">Design review</span>
        <span className="text-[12.5px] text-white/60">Video call · 4 guests</span>
        <JoinButton className="mt-auto self-start" />
      </div>
      {!compact && (
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {later.map((e) => (
            <li key={e.time} className="flex items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-xl bg-white/5 px-2.5 py-2 text-[13px]">
              <b className="w-[38px] flex-none font-normal tabular-nums text-white/55">{e.time}</b>
              <span className="size-[7px] flex-none rounded-full" style={{ background: e.color }} />
              {e.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TimerPresets({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { timerTotal, setTimerMinutes } = useDemo();
  return (
    <>
      {[5, 15, 25].map((m) => {
        const selected = timerTotal === m * 60;
        return (
          <button
            key={m}
            type="button"
            onClick={() => setTimerMinutes(m)}
            aria-pressed={selected}
            aria-label={`Set timer to ${m} minutes`}
            className={cn(
              "inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3.5 text-sm transition-[background-color,transform] duration-300 ease-spring active:scale-95",
              tone === "dark"
                ? cn("bg-white/10 hover:bg-white/[.17]", selected && "shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.7)]")
                : cn("bg-white hover:bg-[#fafafa]", selected ? "shadow-[inset_0_0_0_1.5px_var(--color-ink)]" : "shadow-[inset_0_0_0_1px_var(--color-line-strong)]"),
            )}
          >
            {m}m
          </button>
        );
      })}
    </>
  );
}

export function useTimerLabels() {
  const { timerRunning, timerLeft, timerTotal } = useDemo();
  const action = timerRunning ? "Pause" : timerLeft <= 0 ? "Restart" : timerLeft < timerTotal ? "Resume" : "Start";
  const status = timerRunning ? "Focusing" : timerLeft <= 0 ? "Session complete" : timerLeft < timerTotal ? "Paused" : "Ready when you are";
  return { action, status };
}

export function ProgressRing({ size, stroke, track = "rgba(255,255,255,.12)", className }: { size: number; stroke: number; track?: string; className?: string }) {
  const { timerLeft, timerTotal } = useDemo();
  const r = size / 2 - stroke;
  const c = 2 * Math.PI * r;
  const frac = timerTotal ? timerLeft / timerTotal : 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={cn("-rotate-90", className)} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - frac)}
        className="transition-[stroke-dashoffset] duration-1000 ease-linear"
      />
    </svg>
  );
}

export function FocusWidget({ compact }: { compact: boolean }) {
  const { timerLeft, toggleTimer, resetTimer } = useDemo();
  const { action } = useTimerLabels();
  return (
    <div className="flex flex-1 items-center gap-5">
      {!compact && <ProgressRing size={120} stroke={8} className="size-[120px] flex-none" />}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="font-display text-[38px] font-semibold leading-none tracking-[-.03em] tabular-nums sm:text-[46px]" aria-live="polite">
          {formatTime(timerLeft)}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={toggleTimer} className="inline-flex h-11 items-center rounded-full bg-accent-deep px-4 text-sm text-white transition-transform duration-300 ease-spring active:scale-95">
            {action}
          </button>
          <button type="button" onClick={resetTimer} aria-label="Reset timer" className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-3.5 text-sm transition-colors hover:bg-white/[.17]">
            <RotateCcw className="size-4" strokeWidth={1.8} />
            {!compact && "Reset"}
          </button>
          <TimerPresets />
        </div>
      </div>
    </div>
  );
}
