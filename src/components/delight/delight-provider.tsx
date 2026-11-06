"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { FEATURES } from "@/lib/demo-data";
import { pop, sparkle } from "@/lib/audio";
import { cn, easeOut, spring } from "@/lib/utils";
import { InstallSheet } from "./download";

/**
 * Website-only "delight" layer: remembers which things a visitor has tried on the page,
 * answers each new one with a small pop (sound optional) and a little confetti, and shows
 * a progress chip. Nothing here describes the app; it is feedback for exploring the site.
 */

export const QUESTS = [
  { id: "q-open", label: "Open TopShelf", hint: "Hover or tap the black bar" },
  { id: "q-file", label: "Put a file on the Shelf", hint: "Drag a file up to the bar" },
  { id: "q-music", label: "Play a song", hint: "Music tab, then play" },
  { id: "q-timer", label: "Start a focus timer", hint: "Timer tab, then start" },
  { id: "q-break", label: "Take a 20-second break", hint: "Breaks tab, then Break now" },
] as const;

export const GROUPS: { id: string; label: string; items: { id: string; label: string }[] }[] = [
  { id: "desk", label: "Hands-on desktop", items: QUESTS.map((q) => ({ id: q.id, label: q.label })) },
  { id: "tour", label: "Product tour", items: [{ id: "tour", label: "Scrolled the whole tour" }] },
  { id: "modules", label: "Playground modules", items: FEATURES.map((f) => ({ id: `m-${f.id}`, label: f.label })) },
  {
    id: "extras",
    label: "Extras",
    items: [
      { id: "x-celebration", label: "Played a celebration alert" },
      { id: "x-theme", label: "Tried another theme" },
    ],
  },
];

const ALL_IDS = GROUPS.flatMap((g) => g.items.map((i) => i.id));
const LABEL = new Map(GROUPS.flatMap((g) => g.items.map((i) => [i.id, i.label] as const)));

type At = HTMLElement | { x: number; y: number } | null | undefined;

interface DelightValue {
  tried: ReadonlySet<string>;
  mark: (id: string, at?: At) => void;
  burst: (at?: At, size?: "small" | "big") => void;
  sound: boolean;
  setSound: (on: boolean) => void;
  feedback: (at?: At) => void;
}

const Ctx = createContext<DelightValue | null>(null);

const COLORS = ["#5468FF", "#A9B3FF", "#2FBF9B", "#FFB86B", "#FF7A9A", "#FFD36E", "#171717"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  w: number;
  h: number;
  spin: number;
  c: string;
  life: number;
  max: number;
  round: boolean;
}

function point(at: At): { x: number; y: number } {
  if (!at) return { x: window.innerWidth / 2, y: window.innerHeight * 0.3 };
  if (at instanceof HTMLElement) {
    const r = at.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  return at;
}

export function DelightProvider({ children }: { children: ReactNode }) {
  const [tried, setTried] = useState<Set<string>>(() => new Set());
  const [sound, setSound] = useState(true);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const reduce = useReducedMotion();
  const canvas = useRef<HTMLCanvasElement>(null);
  const parts = useRef<Particle[]>([]);
  const raf = useRef(0);
  const triedRef = useRef(tried);
  triedRef.current = tried;
  const soundRef = useRef(sound);
  soundRef.current = sound;

  const loop = useCallback(() => {
    const cv = canvas.current;
    const g = cv?.getContext("2d");
    if (!cv || !g) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(innerWidth * dpr) || cv.height !== Math.round(innerHeight * dpr)) {
      cv.width = Math.round(innerWidth * dpr);
      cv.height = Math.round(innerHeight * dpr);
    }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, innerWidth, innerHeight);
    parts.current = parts.current.filter((p) => p.life < p.max);
    for (const p of parts.current) {
      p.life++;
      p.vy += 0.16;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.spin;
      const a = Math.min(1, (p.max - p.life) / 22);
      g.save();
      g.globalAlpha = a;
      g.translate(p.x, p.y);
      g.rotate(p.r);
      g.fillStyle = p.c;
      if (p.round) {
        g.beginPath();
        g.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        g.fill();
      } else {
        // Flat ribbons that flip as they spin.
        g.scale(1, Math.cos(p.life * 0.18 + p.spin * 40));
        g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      g.restore();
    }
    if (parts.current.length) raf.current = requestAnimationFrame(loop);
    else g.clearRect(0, 0, innerWidth, innerHeight);
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const burst = useCallback(
    (at?: At, size: "small" | "big" = "small") => {
      if (reduce || typeof window === "undefined") return;
      const { x, y } = point(at);
      const n = size === "big" ? 110 : 16;
      const speed = size === "big" ? 9 : 4.2;
      for (let i = 0; i < n; i++) {
        const ang = size === "big" ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
        const s = speed * (0.45 + Math.random() * 0.75);
        parts.current.push({
          x,
          y,
          vx: Math.cos(ang) * s,
          vy: Math.sin(ang) * s - (size === "big" ? 3 : 1.5),
          r: Math.random() * Math.PI,
          w: 5 + Math.random() * 5,
          h: 3 + Math.random() * 4,
          spin: (Math.random() - 0.5) * 0.3,
          c: COLORS[i % COLORS.length],
          life: 0,
          max: (size === "big" ? 110 : 52) + Math.random() * 30,
          round: Math.random() < 0.25,
        });
      }
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(loop);
    },
    [loop, reduce],
  );

  const feedback = useCallback(
    (at?: At) => {
      if (soundRef.current) pop();
      burst(at, "small");
    },
    [burst],
  );

  const mark = useCallback(
    (id: string, at?: At) => {
      if (!LABEL.has(id) || triedRef.current.has(id)) return;
      const next = new Set(triedRef.current);
      next.add(id);
      triedRef.current = next;
      setTried(next);
      const group = GROUPS.find((g) => g.items.some((i) => i.id === id));
      const groupDone = group ? group.items.every((i) => next.has(i.id)) : false;
      const allDone = next.size === ALL_IDS.length;
      if (allDone || groupDone) {
        if (soundRef.current) sparkle();
        burst(allDone ? null : at, "big");
      } else {
        if (soundRef.current) pop();
        burst(at, "small");
      }
      const text = allDone
        ? "You've tried everything. Impressive."
        : groupDone && group
          ? `${group.label}: all done`
          : `${LABEL.get(id)} · ${next.size} of ${ALL_IDS.length}`;
      setToast((t) => ({ id: (t?.id ?? 0) + 1, text }));
    },
    [burst],
  );

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const onDownload = useCallback(
    (el: HTMLElement | null) => {
      if (soundRef.current) sparkle();
      burst(el, "big");
    },
    [burst],
  );

  const value = useMemo<DelightValue>(() => ({ tried, mark, burst, sound, setSound, feedback }), [tried, mark, burst, sound, feedback]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] size-full" />
      <DiscoveryChip toast={toast} />
      <InstallSheet onStart={onDownload} />
    </Ctx.Provider>
  );
}

export function useDelight() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDelight must be used inside <DelightProvider>");
  return v;
}

/** Floating progress chip: appears after the first thing a visitor tries. */
function DiscoveryChip({ toast }: { toast: { id: number; text: string } | null }) {
  const { tried, sound, setSound } = useContext(Ctx)!;
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const total = ALL_IDS.length;
  const n = tried.size;
  const c = 2 * Math.PI * 11;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (panel.current && !panel.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={panel} className="fixed bottom-4 left-4 z-[70] flex flex-col items-start gap-2 sm:bottom-6 sm:left-6">
      <p className="sr-only" aria-live="polite">
        {toast?.text}
      </p>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: easeOut }}
            role="dialog"
            aria-label="What you've tried"
            className="max-h-[min(70vh,520px)] w-[min(330px,calc(100vw-32px))] overflow-auto rounded-3xl bg-white p-4 text-left shadow-[0_30px_60px_-24px_rgba(23,23,23,.35),inset_0_0_0_1px_var(--color-line)]"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="m-0 font-display text-[17px] font-semibold tracking-[-.02em]">
                {n} of {total} tried
              </p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid size-9 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink">
                <X className="size-4" />
              </button>
            </div>
            <p className="m-0 mt-0.5 font-hand text-xl leading-tight text-muted">everything here works. go poke at it.</p>
            {GROUPS.map((g) => {
              const done = g.items.filter((i) => tried.has(i.id)).length;
              return (
                <div key={g.id} className="mt-3.5">
                  <p className="m-0 flex justify-between text-[12px] uppercase tracking-[.08em] text-muted">
                    <span>{g.label}</span>
                    <span className="tabular-nums">
                      {done}/{g.items.length}
                    </span>
                  </p>
                  <ul className="m-0 mt-1.5 flex list-none flex-wrap gap-1.5 p-0">
                    {g.items.map((i) => {
                      const on = tried.has(i.id);
                      return (
                        <li key={i.id} className={cn("inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[12.5px]", on ? "bg-ink text-white" : "bg-canvas text-muted shadow-[inset_0_0_0_1px_var(--color-line)]")}>
                          {on && <Check className="size-3" strokeWidth={2.6} aria-hidden="true" />}
                          {i.label}
                          <span className="sr-only">{on ? " (tried)" : " (not yet)"}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            <button
              type="button"
              aria-pressed={sound}
              onClick={() => setSound(!sound)}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-full px-3 text-[13px] text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:bg-ink/5"
            >
              {sound ? <Volume2 className="size-4" aria-hidden="true" /> : <VolumeX className="size-4" aria-hidden="true" />}
              Little sounds {sound ? "on" : "off"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {n > 0 && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={spring} className="relative">
            <AnimatePresence>
              {toast && !open && (
                <motion.span
                  key={toast.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  aria-hidden="true"
                  className="absolute bottom-0 left-[calc(100%+10px)] top-0 my-auto flex h-9 items-center whitespace-nowrap rounded-full bg-ink px-3.5 text-[13px] text-white shadow-[0_14px_30px_-14px_rgba(0,0,0,.5)] max-sm:hidden"
                >
                  {toast.text}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              key={n}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={`${n} of ${total} things tried. Show list`}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 0.4, ease: easeOut }}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white pl-1.5 pr-4 text-[13.5px] text-ink shadow-[0_18px_40px_-18px_rgba(23,23,23,.4),inset_0_0_0_1px_var(--color-line)]"
            >
              <span className="relative grid size-8 place-items-center">
                <svg viewBox="0 0 28 28" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
                  <circle cx="14" cy="14" r="11" fill="none" stroke="var(--color-line)" strokeWidth="3" />
                  <circle cx="14" cy="14" r="11" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - n / total)} style={{ transition: "stroke-dashoffset .6s cubic-bezier(.22,1,.36,1)" }} />
                </svg>
                <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
              </span>
              <span className="tabular-nums">
                {n}/{total} tried
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
