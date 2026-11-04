"use client";

import type { ChangeEvent } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { ArtId, FileKind } from "@/lib/demo-data";
import { cn, formatTime } from "@/lib/utils";
import { useDemo } from "@/components/demo-provider";

export function AlbumArt({ art, className }: { art: ArtId; className?: string }) {
  return <span aria-hidden="true" className={cn("art", `art-${art}`, className)} />;
}

export function FileIcon({ kind, className }: { kind: FileKind; className?: string }) {
  return <span aria-hidden="true" className={cn("file-icon", `file-${kind}`, className)} />;
}

export function Equalizer({ className, bars = 4 }: { className?: string; bars?: number }) {
  const delays = ["0s", "-.4s", "-.7s", "-.2s"];
  return (
    <span aria-hidden="true" className={cn("inline-flex h-3.5 flex-none items-end gap-0.5", className)}>
      {Array.from({ length: bars }, (_, i) => (
        <i key={i} className="block h-[30%] w-[3px] animate-eq rounded-sm bg-accent" style={{ animationDelay: delays[i % 4] }} />
      ))}
    </span>
  );
}

/** Track progress bar with an invisible range input layered on top for scrubbing. */
export function Scrubber({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { position, track, seek } = useDemo();
  const pct = (position / track.duration) * 100;
  return (
    <div>
      <div className="relative mt-1.5 h-5">
        <div className={cn("absolute inset-x-0 top-2 h-1 overflow-hidden rounded", tone === "dark" ? "bg-white/20" : "bg-ink/10")}>
          <div className={cn("absolute inset-y-0 left-0 rounded transition-[width] duration-700 ease-linear", tone === "dark" ? "bg-white" : "bg-ink")} style={{ width: `${pct}%` }} />
        </div>
        <input
          type="range"
          min={0}
          max={track.duration}
          step={1}
          value={position}
          onChange={(e: ChangeEvent<HTMLInputElement>) => seek(Number(e.target.value))}
          aria-label="Track position"
          aria-valuetext={`${formatTime(position)} of ${formatTime(track.duration)}`}
          className="absolute inset-0 m-0 h-5 w-full cursor-pointer opacity-0"
        />
      </div>
      <div className={cn("flex justify-between text-[11px] tabular-nums", tone === "dark" ? "text-white/55" : "text-muted")}>
        <span>{formatTime(position)}</span>
        <span>-{formatTime(track.duration - position)}</span>
      </div>
    </div>
  );
}

export function TransportControls({ className }: { className?: string }) {
  const { playing, togglePlay, nextTrack, prevTrack } = useDemo();
  const btn = "grid size-11 place-items-center rounded-full transition-[background-color,transform] duration-300 ease-spring hover:bg-white/10 active:scale-90";
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button type="button" className={btn} onClick={prevTrack} aria-label="Previous track">
        <SkipBack className="size-5" fill="currentColor" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        className={cn(btn, "bg-white text-black hover:scale-[1.06] hover:bg-white")}
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause className="size-5" fill="currentColor" strokeWidth={0} /> : <Play className="ml-0.5 size-5" fill="currentColor" strokeWidth={0} />}
      </button>
      <button type="button" className={btn} onClick={nextTrack} aria-label="Next track">
        <SkipForward className="size-5" fill="currentColor" strokeWidth={1.5} />
      </button>
    </div>
  );
}

/** Title + artist + equalizer when playing. */
export function TrackMeta({ large = false }: { large?: boolean }) {
  const { track, playing } = useDemo();
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className={cn("flex items-center gap-2 font-display font-semibold", large ? "text-lg" : "text-[17px]")}>
        <span className="truncate">{track.title}</span>
        {playing && <Equalizer />}
      </div>
      <span className="truncate text-[13px] text-white/60">{track.artist}</span>
    </div>
  );
}
