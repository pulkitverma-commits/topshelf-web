"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Eye } from "lucide-react";
import { LONG, SHORT, useApp, type BreakOutcome } from "@/components/app-provider";
import { cn, formatTime } from "@/lib/utils";

/** The app's default rotating break messages. */
const MESSAGES = [
  "Look at something far away and let your eyes relax.",
  "Roll your shoulders back. Unclench your jaw.",
  "Blink slowly a few times.",
  "Stand up, stretch, maybe grab some water.",
  "Take a slow breath in… and out.",
];
const RING = 2 * Math.PI * 54;

/** "Break in 7…": follows the pointer for the last 10 seconds (docked at the top on touch). */
export function BreakPill() {
  const { pill } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef<{ x: number; y: number } | null>(null);

  const place = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const touch = window.matchMedia("(hover: none)").matches;
    if (!pos.current || touch) {
      el.style.transform = `translate(calc(50vw - 50%), 16px)`;
      return;
    }
    const x = Math.max(8, Math.min(window.innerWidth - el.offsetWidth - 8, pos.current.x + 18));
    const y = Math.max(8, Math.min(window.innerHeight - el.offsetHeight - 8, pos.current.y + 22));
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pos.current = { x: e.clientX, y: e.clientY };
      if (ref.current) place();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [place]);

  useEffect(() => {
    if (pill !== null) place();
  }, [pill, place]);

  if (pill === null) return null;
  return (
    <>
      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] flex items-center gap-2 whitespace-nowrap rounded-full bg-[#0e1012]/90 py-1.5 pl-1.5 pr-4 text-sm text-white shadow-[0_0_0_1px_rgba(255,255,255,.12),0_14px_34px_-10px_rgba(0,0,0,.7)] backdrop-blur-xl"
      >
        <svg viewBox="0 0 36 36" className="size-[30px] -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="3.4" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="#2FBF9B" strokeWidth="3.4" strokeLinecap="round" strokeDasharray="94.25" strokeDashoffset={94.25 * (1 - pill / 10)} className="transition-[stroke-dashoffset] duration-1000 ease-linear" />
        </svg>
        Break in
        <b key={pill} className="tick-pop inline-block min-w-[1.1em] font-display text-[22px] font-semibold leading-none tabular-nums">
          {pill}
        </b>
      </div>
      <p className="sr-only" aria-live="polite">
        {pill === 10 ? "Break in 10 seconds." : ""}
      </p>
    </>
  );
}

/** A full-screen break with a frosted card, a countdown and a short exercise. */
export function BreakScreen() {
  const app = useApp();
  const { run, difficulty, bg, image, finishBreak, taken, score } = app;
  const reduce = useReducedMotion();
  const [left, setLeft] = useState(SHORT);
  const [elapsed, setElapsed] = useState(0);
  const [msg, setMsg] = useState(0);
  const [swap, setSwap] = useState(false);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);
  const [hold, setHold] = useState(0);
  const card = useRef<HTMLDivElement>(null);
  const actions = useRef<HTMLDivElement>(null);
  const holdRaf = useRef(0);
  const fromRef = useRef<HTMLElement | null>(null);

  const kind = run?.kind ?? "short";
  const total = kind === "long" ? LONG : SHORT;
  const speed = kind === "long" ? 10 : 1;
  const skipIn = Math.ceil(5 - elapsed);
  const skipLocked = difficulty === "balanced" && skipIn > 0;

  const close = useCallback(
    (how: BreakOutcome) => {
      cancelAnimationFrame(holdRaf.current);
      const back = fromRef.current;
      const finish = () => {
        finishBreak(how);
        setShown(false);
        setDone(false);
        document.querySelectorAll<HTMLElement>("body > header, body > main, body > footer, main, footer").forEach((el) => (el.inert = false));
        document.body.style.overflow = "";
        (back && back.isConnected ? back : document.querySelector<HTMLElement>("#top a, #top button"))?.focus({ preventScroll: true });
      };
      if (how === "done") {
        setDone(true);
        window.setTimeout(finish, 1400);
      } else finish();
    },
    [finishBreak],
  );

  // Start of a break: reset, lock the page behind it, move focus in.
  useEffect(() => {
    if (!run) return;
    fromRef.current = run.from;
    setLeft(run.kind === "long" ? LONG : SHORT);
    setElapsed(0);
    setMsg(Math.floor(Math.random() * MESSAGES.length));
    setDone(false);
    setHold(0);
    document.querySelectorAll<HTMLElement>("main, footer, body > header").forEach((el) => (el.inert = true));
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    const focus = window.setTimeout(() => (actions.current?.querySelector<HTMLButtonElement>("button:not(:disabled)") ?? card.current)?.focus({ preventScroll: true }), 30);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(focus);
    };
  }, [run]);

  // Countdown (the long break runs 10× faster in this demo).
  useEffect(() => {
    if (!run || done) return;
    let raf = 0;
    let last = performance.now();
    let remaining = run.kind === "long" ? LONG : SHORT;
    let real = 0;
    const step = (now: number) => {
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      remaining = Math.max(0, remaining - dt * speed);
      real += dt;
      setLeft(remaining);
      setElapsed(real);
      if (remaining <= 0) {
        close("done");
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, done, speed, close]);

  // Rotating messages.
  useEffect(() => {
    if (!run) return;
    const id = window.setInterval(() => {
      setSwap(true);
      window.setTimeout(() => {
        setMsg((m) => (m + 1) % MESSAGES.length);
        setSwap(false);
      }, reduce ? 0 : 400);
    }, 6000);
    return () => window.clearInterval(id);
  }, [run, reduce]);

  // Press and hold (pointer, Enter/Space or Esc) for 3 seconds to leave a Hardcore break.
  const beginHold = useCallback(() => {
    if (holdRaf.current) return;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 3000);
      setHold(p);
      if (p >= 1) {
        holdRaf.current = 0;
        close("emergency");
        return;
      }
      holdRaf.current = requestAnimationFrame(step);
    };
    holdRaf.current = requestAnimationFrame(step);
  }, [close]);
  const endHold = useCallback(() => {
    cancelAnimationFrame(holdRaf.current);
    holdRaf.current = 0;
    setHold(0);
  }, []);

  // Keyboard: Esc per difficulty, and keep Tab inside the break.
  useEffect(() => {
    if (!run) return;
    const onDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        if (difficulty === "hardcore") {
          if (!e.repeat) beginHold();
        } else if (difficulty === "casual" || !skipLocked) close("skip");
      } else if (e.key === "Tab") {
        const f = Array.from(actions.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []);
        if (!f.length) {
          e.preventDefault();
          card.current?.focus();
          return;
        }
        const i = f.indexOf(document.activeElement as HTMLButtonElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && (i === -1 || i === f.length - 1)) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === "Escape") endHold();
    };
    window.addEventListener("keydown", onDown, true);
    window.addEventListener("keyup", onUp, true);
    return () => {
      window.removeEventListener("keydown", onDown, true);
      window.removeEventListener("keyup", onUp, true);
    };
  }, [run, difficulty, skipLocked, beginHold, endHold, close]);

  if (!run) return null;
  const long = kind === "long";
  const bgMode = bg === "image" && !image ? "gradient" : bg;
  const btn = "relative overflow-hidden rounded-full px-[18px] py-2.5 text-[15px] transition-[background-color,opacity] duration-200 disabled:cursor-default disabled:opacity-45";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bs-title"
      className={cn("fixed inset-0 z-[100] grid place-items-center overflow-auto p-5 text-white transition-opacity duration-500", shown ? "opacity-100" : "opacity-0")}
    >
      <div className="bs-bg" data-bg={bgMode}>
        {bgMode === "image" && image && <img src={image} alt="" />}
      </div>
      <div className="bs-grain" />
      <div
        ref={card}
        tabIndex={-1}
        className={cn(
          "relative w-full max-w-[580px] rounded-[32px] border border-white/15 bg-[#101416]/40 px-[clamp(18px,4vw,34px)] pb-6 pt-7 text-center outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_40px_100px_-30px_rgba(0,0,0,.7)] backdrop-blur-[30px] backdrop-saturate-150 transition-[transform,opacity] duration-700 ease-spring",
          shown && !done ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[.97]",
          done && "opacity-0",
        )}
      >
        <p className="m-0 inline-flex items-center gap-2 text-[13px] text-white/65">
          <Eye className="size-4 text-[#7EE8CC]" strokeWidth={1.8} aria-hidden="true" />
          TopShelf · Break
        </p>
        <p className="m-0 mt-2.5 text-xs uppercase tracking-[.18em] text-[#7EE8CC]">{long ? "Long break · 5 min" : "Short break · 20 s"}</p>
        <h2 id="bs-title" className="mx-auto mb-0 mt-2 max-w-[460px] text-balance font-display text-[clamp(24px,3.6vw,34px)] font-semibold leading-[1.12] tracking-[-.03em]">
          {long ? "Stand up, stretch, walk around, refill your water." : "Rest your eyes on something at least 20 feet away."}
        </h2>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-[clamp(16px,4vw,28px)]">
          <div className="relative size-[clamp(120px,22vw,150px)] flex-none">
            <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="5" />
              <circle cx="60" cy="60" r="54" fill="none" stroke="#7EE8CC" strokeWidth="5" strokeLinecap="round" strokeDasharray={RING} strokeDashoffset={RING * (1 - left / total)} />
            </svg>
            <span className="absolute inset-0 grid place-items-center font-display text-[clamp(38px,7vw,48px)] font-semibold tabular-nums tracking-[-.03em]">{formatTime(Math.ceil(left))}</span>
          </div>
          {long ? (
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-end gap-3.5" aria-hidden="true">
                <svg className="size-[104px] overflow-visible" viewBox="0 0 120 120">
                  <circle cx="60" cy="62" r="50" fill="rgba(126,232,204,.14)" />
                  <ellipse cx="60" cy="113" rx="26" ry="4.5" fill="rgba(0,0,0,.28)" />
                  <g className="stretch-arms" stroke="#eef1f7" strokeWidth="8.5" strokeLinecap="round" fill="none">
                    <path d="M52 50 40 21" />
                    <path d="M68 50 80 21" />
                  </g>
                  <g stroke="#dfe4ee" strokeWidth="9" strokeLinecap="round" fill="none">
                    <path d="M55 80 50 108" />
                    <path d="M65 80 70 108" />
                  </g>
                  <rect x="47" y="44" width="26" height="40" rx="12" fill="#eef1f7" />
                  <circle cx="60" cy="31" r="10.5" fill="#f4f6fb" />
                  <ellipse cx="56.5" cy="27" rx="3.6" ry="2.2" fill="#fff" />
                </svg>
                <svg className="water3d live h-[100px] w-[66px] overflow-visible" viewBox="0 0 80 120">
                  <defs>
                    <clipPath id="bs-glass">
                      <path d="M14 20h52l-7 88H21z" />
                    </clipPath>
                    <linearGradient id="bs-water" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#9fdcff" />
                      <stop offset="1" stopColor="#2f84e0" />
                    </linearGradient>
                  </defs>
                  <path d="M14 20h52l-7 88H21z" fill="rgba(255,255,255,.18)" />
                  <g clipPath="url(#bs-glass)">
                    <g className="water">
                      <path d="M0 0q10-6 20 0t20 0 20 0 20 0 20 0 20 0 20 0V130H0z" fill="url(#bs-water)" />
                    </g>
                    <circle className="bub b1" cx="34" cy="96" r="3" />
                    <circle className="bub b2" cx="46" cy="100" r="2.2" />
                    <circle className="bub b3" cx="40" cy="92" r="3.4" />
                  </g>
                  <path d="M14 20h52l-7 88H21z" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="3" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="m-0 text-[13px] text-white/60">Stand up, stretch, refill your water.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="relative h-24 w-[170px] rounded-[48px] bg-white/[.06] shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]" aria-hidden="true">
                <span className="eye-dot" />
              </div>
              <p className="m-0 text-[13px] text-white/60">Follow the dot with your eyes</p>
            </div>
          )}
        </div>
        <p className={cn("mx-auto mb-0 mt-4 min-h-[2.7em] max-w-[440px] font-hand text-[26px] leading-[1.2] text-white/90 transition-opacity duration-400", swap && "opacity-0")} aria-live="polite">
          {MESSAGES[msg]}
        </p>
        <p className="m-0 mt-1.5 text-[13px] tabular-nums text-white/55">
          {taken} breaks today · 3 h 41 min screen time · Score {score}
        </p>
        <div ref={actions} className="mt-[18px] flex flex-wrap justify-center gap-2">
          {difficulty === "hardcore" ? (
            <button
              type="button"
              aria-label="Emergency exit. Press and hold for 3 seconds."
              className={cn(btn, "hold-btn touch-none select-none border border-white/20 bg-white/[.08]")}
              style={{ "--p": `${hold * 100}%` } as React.CSSProperties}
              onPointerDown={(e) => {
                e.preventDefault();
                e.currentTarget.setPointerCapture?.(e.pointerId);
                beginHold();
              }}
              onPointerUp={endHold}
              onPointerCancel={endHold}
              onLostPointerCapture={endHold}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (!e.repeat) beginHold();
                }
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.key === " ") endHold();
              }}
            >
              <span className="relative">Hold to leave</span>
            </button>
          ) : (
            <>
              <button type="button" className={cn(btn, "border border-white/20 bg-white/[.08] hover:bg-white/[.16]")} onClick={() => close("postpone")}>
                Postpone 5 min
              </button>
              <button type="button" disabled={skipLocked} className={cn(btn, "border border-white/20 bg-white/[.08] enabled:hover:bg-white/[.16]")} onClick={() => close("skip")}>
                {skipLocked ? `Skip in ${skipIn}` : "Skip break"}
              </button>
              <button type="button" className={cn(btn, "bg-[#7EE8CC] font-medium text-[#05261d] hover:bg-[#a3f0da]")} onClick={() => close("rested")}>
                I&apos;m rested
              </button>
            </>
          )}
        </div>
        <p className="m-0 mt-3 text-[13px] text-white/50">
          {difficulty === "hardcore" ? "Emergency? Press and hold for 3 seconds (or hold Esc)." : difficulty === "casual" ? "Esc skips this break" : "Esc skips once Skip unlocks"}
        </p>
        {long && <p className="m-0 mt-1.5 text-xs text-white/40">Demo: this long break runs 10× faster.</p>}
      </div>
      {done && (
        <p className="pointer-events-none fixed inset-0 m-0 grid place-items-center font-display text-[clamp(36px,6vw,64px)] font-semibold tracking-[-.04em]" role="status">
          Nice break. Back to it.
        </p>
      )}
    </div>
  );
}
