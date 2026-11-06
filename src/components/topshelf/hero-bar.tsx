"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronUp, Eye, Inbox, Music, Timer } from "lucide-react";
import { WORK, useApp } from "@/components/app-provider";
import { useDemo } from "@/components/demo-provider";
import { useElementWidth } from "@/hooks/use-element-width";
import { clamp, cn, easeOut, formatTime, spring } from "@/lib/utils";
import { AlbumArt, Equalizer } from "./bits";
import { CalendarWidget, FocusWidget, MusicWidget, ShelfWidget } from "./widgets";

export type BarTab = "shelf" | "music" | "calendar" | "focus" | "breaks";

const TABS: { id: BarTab; label: string; heading: string; Icon: typeof Music }[] = [
  { id: "shelf", label: "Shelf", heading: "Shelf", Icon: Inbox },
  { id: "music", label: "Music", heading: "Now playing", Icon: Music },
  { id: "calendar", label: "Calendar", heading: "Up next", Icon: CalendarDays },
  { id: "focus", label: "Focus timer", heading: "Focus", Icon: Timer },
  { id: "breaks", label: "Breaks", heading: "Next break", Icon: Eye },
];

function BreaksWidget() {
  const app = useApp();
  const c = 2 * Math.PI * 34;
  return (
    <div className="flex flex-1 items-center gap-4 rounded-[18px] bg-white/[.07] px-4 py-3">
      <div className="relative size-[84px] flex-none">
        <svg viewBox="0 0 80 80" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="6" />
          <circle cx="40" cy="40" r="34" fill="none" stroke="#2FBF9B" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - app.left / WORK)} />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-lg font-semibold tabular-nums">{app.onCall ? "–" : formatTime(app.left)}</span>
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <span className="text-[13px] text-white/60">{app.onCall ? "Smart Pause · on a call" : "20 min work → 20 s break"}</span>
        <span className="flex flex-wrap gap-2">
          <button type="button" onClick={(e) => app.startBreak("short", e.currentTarget)} className="h-9 rounded-full bg-[#2FBF9B] px-4 text-[13px] font-medium text-[#04241b]">
            Break now
          </button>
          <a href="#breaks" className="inline-flex h-9 items-center rounded-full px-3 text-[13px] text-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,.2)]">
            More
          </a>
        </span>
      </div>
    </div>
  );
}

/** Open/close state for the interactive bar, shared with the surrounding desktop. */
export function useBarController() {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [tab, setTab] = useState<BarTab>("shelf");
  const closeTimer = useRef<number | undefined>(undefined);

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const show = useCallback((nextTab?: BarTab, pin = false) => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
    if (pin) setPinned(true);
    if (nextTab) setTab(nextTab);
  }, []);
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 450);
  }, []);
  const collapse = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setOpen(false);
    setPinned(false);
  }, []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return { open, pinned, tab, setTab, show, scheduleClose, collapse, cancelClose };
}

type Controller = ReturnType<typeof useBarController>;

/**
 * The hero's working TopShelf. Hover (mouse) or tap/click to expand; it collapses on
 * pointer leave unless it was clicked open, or via the collapse button / Escape.
 */
export function HeroBar({ controller, near = false }: { controller: Controller; near?: boolean }) {
  const { open, pinned, tab, setTab, show, scheduleClose, collapse, cancelClose } = controller;
  const demo = useDemo();
  const [zoneRef, width] = useElementWidth<HTMLDivElement>();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const panelId = "topshelf-hero-panel";

  // Interacting with the open panel pins it; a press anywhere else closes it.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) collapse();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, collapse]);

  const small = width < 520;
  const base = clamp(width * 0.145, 88, 158);
  const collapsedH = small ? 24 : 32;
  const wide = demo.playing || demo.timerRunning;
  const size = open
    ? { width: Math.min(620, width * 0.94), height: small ? 276 : 258, radius: small ? 26 : 32 }
    : { width: base + (wide ? (small ? 64 : 104) : 0) + (near ? 22 : 0), height: collapsedH + (near ? 5 : 0), radius: small ? 12 : 16 };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <div ref={zoneRef} className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center">
      {width > 0 && (
        <motion.div
          ref={barRef}
          initial={false}
          animate={{
            width: size.width,
            height: size.height,
            borderBottomLeftRadius: size.radius,
            borderBottomRightRadius: size.radius,
            boxShadow: open ? "0 40px 70px -30px rgba(0,0,0,.6)" : "0 0 0 0 rgba(0,0,0,0)",
          }}
          transition={spring}
          className="pointer-events-auto relative overflow-hidden bg-black text-white"
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") show();
            else cancelClose();
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse" && !pinned) scheduleClose();
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            show("shelf", true);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            // Dropping anywhere on TopShelf puts the file on the Shelf.
            e.preventDefault();
            e.stopPropagation();
            const id = demo.takeDraggedFile(e);
            if (id) demo.moveFile(id, true);
          }}
          onPointerDown={() => {
            if (open && !pinned) show(undefined, true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape" && open) collapse();
          }}
        >
          <AnimatePresence initial={false}>
            {!open ? (
              <motion.button
                key="collapsed"
                type="button"
                onClick={() => show(undefined, true)}
                aria-label="Open TopShelf"
                aria-expanded={false}
                aria-controls={panelId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="absolute inset-0 flex w-full items-center justify-between px-3"
              >
                <span aria-hidden="true" className="absolute left-1/2 top-[8px] size-1.5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#2a2f45_0,#0a0a0c_60%)] sm:top-[11px] sm:size-2" />
                {demo.playing ? (
                  <>
                    <AlbumArt art={demo.track.art} className="size-4 rounded-[5px] sm:size-5 sm:rounded-md" />
                    <Equalizer />
                  </>
                ) : demo.timerRunning ? (
                  <>
                    <Timer className="size-[15px] text-accent-soft" strokeWidth={1.8} />
                    <span className="text-xs tabular-nums">{formatTime(demo.timerLeft)}</span>
                  </>
                ) : null}
              </motion.button>
            ) : (
              <motion.div
                key="panel"
                id={panelId}
                role="region"
                aria-label="TopShelf"
                initial={{ opacity: 0, y: -10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.12, duration: 0.4, ease: easeOut } }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                className="absolute inset-0 flex flex-col gap-2.5 px-3 pb-3 pt-2.5 text-left sm:px-[18px] sm:pb-4 sm:pt-3"
              >
                <div className="flex h-10 flex-none items-center justify-between gap-2.5">
                  <div role="tablist" aria-label="TopShelf widgets" className="flex gap-0.5 rounded-[13px] bg-white/[.08] p-0.5">
                    {TABS.map((t, i) => (
                      <button
                        key={t.id}
                        ref={(el) => {
                          tabRefs.current[i] = el;
                        }}
                        type="button"
                        role="tab"
                        aria-selected={tab === t.id}
                        aria-label={t.label}
                        tabIndex={tab === t.id ? 0 : -1}
                        onKeyDown={(e) => onTabKey(e, i)}
                        onClick={() => setTab(t.id)}
                        className={cn("relative grid h-9 w-11 place-items-center rounded-[11px] transition-colors", tab === t.id ? "text-white" : "text-white/60 hover:text-white")}
                      >
                        {tab === t.id && <motion.span layoutId="hero-tab" className="absolute inset-0 rounded-[11px] bg-white/[.17]" transition={spring} />}
                        <t.Icon className="relative size-[18px]" strokeWidth={1.8} />
                      </button>
                    ))}
                  </div>
                  <span className="hidden flex-1 text-center font-display text-[13px] text-white/60 sm:block">{active.heading}</span>
                  <button type="button" onClick={collapse} aria-label="Collapse TopShelf" className="grid h-10 w-11 place-items-center rounded-[11px] text-white/70 transition-colors hover:bg-white/10 hover:text-white">
                    <ChevronUp className="size-[18px]" strokeWidth={1.8} />
                  </button>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={tab}
                    role="tabpanel"
                    aria-label={active.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: easeOut }}
                    className="flex min-h-0 flex-1 flex-col"
                  >
                    {tab === "music" && <MusicWidget compact={small} />}
                    {tab === "shelf" && <ShelfWidget />}
                    {tab === "calendar" && <CalendarWidget compact={small} />}
                    {tab === "focus" && <FocusWidget compact={small} />}
                    {tab === "breaks" && <BreaksWidget />}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
