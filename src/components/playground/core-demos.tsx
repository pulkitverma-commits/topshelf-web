"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { CalendarDays, PenLine, Timer } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { AlbumArt, Scrubber, TrackMeta, TransportControls } from "@/components/topshelf/bits";
import { DeskFile, ShelfTray, useDesktopDrop } from "@/components/topshelf/shelf";
import { JoinButton, ProgressRing, TimerPresets, useTimerLabels } from "@/components/topshelf/widgets";
import { Button, Scribble } from "@/components/ui/primitives";
import { cn, formatTime } from "@/lib/utils";

const notch = "absolute left-1/2 top-0 -translate-x-1/2 bg-black text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,.55)]";

export function MusicDemo() {
  const { track, playing, nextTrack, togglePlay } = useDemo();
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 200 200" aria-hidden="true" className={cn("absolute -bottom-[90px] -right-[70px] size-[360px] animate-spin-slow", !playing && "[animation-play-state:paused]")}>
        <circle cx="100" cy="100" r="96" fill="#171717" />
        {[80, 66, 52].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#2c2c2e" />
        ))}
        <circle cx="100" cy="100" r="30" fill="#5468FF" />
        <circle cx="100" cy="100" r="4" fill="#ECEBFF" />
        <path d="M60 40a70 70 0 0 1 40-14" stroke="#fff" strokeOpacity=".18" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      <div className={cn(notch, "flex w-[min(460px,92%)] flex-col gap-3 rounded-b-[30px] px-6 pb-5 pt-[22px]")}>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              nextTrack();
              if (!playing) togglePlay();
            }}
            aria-label="Change artwork: play the next track"
            className="rounded-[18px] transition-transform duration-500 ease-spring active:scale-[.93]"
          >
            <AlbumArt art={track.art} className="size-[72px] rounded-[18px] sm:size-[104px]" />
          </button>
          <TrackMeta large />
        </div>
        <Scrubber />
        <TransportControls className="justify-center" />
      </div>
      <Scribble arrow="up-left" className="absolute bottom-11 left-7 -rotate-[4deg] max-sm:hidden">
        scrub it, skip it,
        <br />
        keep working
      </Scribble>
    </div>
  );
}

export function ShelfDemo() {
  const { files } = useDemo();
  const drop = useDesktopDrop();
  const inTray = files.filter((f) => f.inTray).length;
  const onDesk = files.filter((f) => !f.inTray);
  return (
    <div className="absolute inset-0" onDragOver={drop.onDragOver} onDrop={drop.onDrop}>
      <div className={cn(notch, "flex h-[220px] w-[min(470px,92%)] flex-col gap-2.5 rounded-b-[30px] px-[18px] pb-[18px] pt-4")}>
        <h4 className="m-0 flex justify-between font-display text-sm font-semibold text-white/85">
          Shelf <span className="font-normal text-white/50">{inTray} {inTray === 1 ? "file" : "files"}</span>
        </h4>
        <ShelfTray />
      </div>
      <Scribble arrow="up-right" arrowFirst className="absolute right-7 top-[250px] rotate-[5deg] max-sm:hidden">
        drag me up
      </Scribble>
      <div className="absolute inset-x-0 bottom-11 flex flex-wrap justify-center gap-5 px-4">
        <AnimatePresence initial={false}>
          {onDesk.map((f) => (
            <DeskFile key={f.id} file={f} tone="ink" />
          ))}
        </AnimatePresence>
        {onDesk.length === 0 && <p className="m-0 text-[15px] text-[#3f5c4f]">Desktop cleared. Drag a file back down to return it.</p>}
      </div>
    </div>
  );
}

export function CalendarDemo() {
  return (
    <div className="absolute inset-0">
      <div className={cn(notch, "flex w-[min(470px,92%)] items-center gap-3.5 rounded-b-[28px] px-[18px] py-4")}>
        <span className="grid size-11 flex-none place-items-center rounded-[14px] bg-accent-deep">
          <CalendarDays className="size-5" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <b className="block font-display text-base font-semibold">Design review</b>
          <span className="text-[13px] text-white/60">Starts in 4 min · 10:30</span>
        </span>
        <JoinButton />
      </div>
      <div className="absolute bottom-0 left-1/2 h-[268px] w-[min(400px,88%)] -translate-x-1/2 rounded-t-[22px] bg-white px-5 pt-[18px] shadow-[0_-10px_40px_-24px_rgba(0,0,0,.25)]">
        <h5 className="m-0 mb-3 flex justify-between font-display text-[15px] font-semibold">
          Wednesday <span className="font-normal text-muted">4 November</span>
        </h5>
        {["9:00", "10:00", "11:00", "12:00", "13:00"].map((h) => (
          <div key={h} className="relative h-[42px] border-t border-line pt-0.5 text-[11px] text-muted">
            {h}
            {h === "10:00" && (
              <div className="absolute left-11 right-0 top-[22px] h-10 rounded-[10px] bg-accent-deep px-2.5 py-1.5 text-[12.5px] leading-tight text-white">
                <b className="font-semibold">Design review</b> · 10:30
              </div>
            )}
            {h === "12:00" && (
              <div className="absolute left-11 right-0 top-0.5 h-[38px] rounded-[10px] bg-mint px-2.5 py-1.5 text-[12.5px] text-[#14513a]">Lunch with Sam</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotesDemo() {
  const [note, setNote] = useState("Ask Priya about the launch date\nBook the studio for Friday");
  return (
    <div className="absolute inset-0">
      <div className={cn(notch, "flex h-11 w-[min(300px,80%)] items-center justify-center gap-2 rounded-b-[22px] text-[13px] text-white/80")}>
        <PenLine className="size-4" strokeWidth={1.8} aria-hidden="true" />
        Quick note
      </div>
      <div className="absolute left-1/2 top-[78px] flex w-[min(360px,86%)] -translate-x-1/2 -rotate-[1.6deg] flex-col gap-2 bg-sticky px-[22px] pb-3.5 pt-5 shadow-[0_26px_40px_-24px_rgba(120,80,20,.45)]">
        <label htmlFor="quick-note" className="sr-only">
          Quick note
        </label>
        <textarea
          id="quick-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type a thought before it goes…"
          className="h-[230px] w-full resize-none border-0 bg-transparent font-hand text-[28px] leading-[1.15] text-[#2b2414] outline-none placeholder:text-[#2b2414]/55"
        />
        <div className="flex items-center justify-between text-[13px] text-[#6a5a33]">
          <span>{note.length} characters</span>
          <button type="button" onClick={() => setNote("")} className="h-11 rounded-full px-3.5 text-[#4a3e20] hover:bg-black/5">
            Clear
          </button>
        </div>
      </div>
      <Scribble arrow="left" arrowFirst className="absolute bottom-7 right-5 -rotate-[5deg] max-sm:hidden">
        go on,
        <br />
        type in it
      </Scribble>
    </div>
  );
}

export function FocusDemo() {
  const { timerLeft, toggleTimer, resetTimer } = useDemo();
  const { action, status } = useTimerLabels();
  return (
    <div className="absolute inset-0">
      <div className={cn(notch, "flex h-10 w-[220px] items-center justify-center gap-2 rounded-b-[20px] text-[13px] tabular-nums")}>
        <Timer className="size-[15px] text-accent-soft" strokeWidth={1.8} aria-hidden="true" />
        {formatTime(timerLeft)}
      </div>
      <div className="absolute left-1/2 top-[76px] size-[250px] -translate-x-1/2">
        <ProgressRing size={240} stroke={10} track="rgba(23,23,23,.08)" className="size-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <b className="font-display text-[56px] font-semibold leading-none tracking-[-.04em] tabular-nums" aria-live="polite">
            {formatTime(timerLeft)}
          </b>
          <span className="mt-1.5 text-[13px] text-muted">{status}</span>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[30px] flex flex-wrap justify-center gap-2 px-3">
        <Button variant="dark" onClick={toggleTimer}>
          {action}
        </Button>
        <Button onClick={resetTimer}>Reset</Button>
        <TimerPresets tone="light" />
      </div>
    </div>
  );
}
