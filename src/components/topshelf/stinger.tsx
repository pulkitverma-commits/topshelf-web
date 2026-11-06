"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { BatteryLow, CalendarDays, Droplet, Eye, MessageCircle, Mail, PersonStanding, Pill, Timer, Trophy, Wind, Hourglass, type LucideIcon } from "lucide-react";
import { STINGER_DURATION, shade, stingerFrame, tintHex, type StingerIcon, type StingerSpec } from "@/lib/stinger";

export const STINGER_ICONS: Record<StingerIcon, LucideIcon> = {
  timer: Timer,
  ball: Trophy,
  mail: Mail,
  calendar: CalendarDays,
  drop: Droplet,
  chat: MessageCircle,
  eye: Eye,
  person: PersonStanding,
  wind: Wind,
  pill: Pill,
  battery: BatteryLow,
  focus: Hourglass,
};

const SPARKS: [number, number, number, number][] = [
  [0, 0.14, 10, 0.0],
  [18, 0.74, 7, 0.08],
  [34, 0.3, 9, 0.14],
  [6, 0.92, 6, 0.04],
];
const ROW = 46;
const MARGIN = 18;
const HEADLINE_X = MARGIN + 34 + 12;

/**
 * Broadcast-style alert stinger, drawn one frame at a time from the same timeline the
 * app uses. Purely visual and hidden from assistive tech: the pill underneath (or a
 * live region next to it) carries the words. Changing `run` replays it.
 */
export function Stinger({
  spec,
  run,
  width,
  rowTop,
}: {
  spec: StingerSpec | null;
  /** Increment to play again. 0 = idle. */
  run: number;
  /** Final width of the host, used to fit the headline between icon and chip. */
  width: number;
  /** Row position from the top; default sits on the bottom edge of the banner. */
  rowTop?: number;
}) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const edge = useRef<HTMLDivElement>(null);
  const badges = useRef<Array<HTMLSpanElement | null>>([]);
  const word = useRef<HTMLSpanElement>(null);
  const sparks = useRef<Array<HTMLSpanElement | null>>([]);
  const chip = useRef<HTMLSpanElement>(null);
  const val = useRef<HTMLElement>(null);
  const streak = useRef<HTMLDivElement>(null);
  const fit = useRef({ fs: 26, headW: 120 });

  const chipW = spec?.v ? spec.v.length * 11 + 22 : 0;

  // Fit the headline between the icon and the chip (like minimumScaleFactor in the app).
  useLayoutEffect(() => {
    const w = word.current;
    if (!w || !spec || !run) return;
    w.style.cssText = "font-size:26px;transform:none;filter:none";
    const natural = w.scrollWidth || spec.h.length * 12.5;
    const avail = Math.max(40, width - HEADLINE_X - chipW - MARGIN - 10);
    const fs = natural > avail ? Math.max(13, (26 * avail) / natural) : 26;
    w.style.fontSize = `${fs}px`;
    fit.current = { fs, headW: Math.min(natural, avail) };
  }, [run, spec, width, chipW]);

  useEffect(() => {
    const el = root.current;
    if (!el || !spec || !run) return;
    let raf = 0;
    const t0 = performance.now();
    el.classList.add("on");
    const step = (now: number) => {
      const t = (now - t0) / 1000;
      const f = stingerFrame(t, spec.beats, !!reduce);
      el.style.opacity = String(f.opacity);
      if (clip.current) clip.current.style.clipPath = `inset(0 ${((1 - f.enter) * 100).toFixed(2)}% 0 ${(f.exit * 100).toFixed(2)}%)`;
      if (edge.current) {
        edge.current.style.left = `calc(${(f.enter * 100).toFixed(2)}% - 54px)`;
        edge.current.style.opacity = f.enter < 1 ? "1" : "0";
      }
      const lag = Math.max(0, 1 - f.iconTravel);
      const x = MARGIN - lag * 90;
      badges.current.forEach((b, i) => {
        if (!b) return;
        const k = 2 - i; // two fading trail copies, then the badge
        if (k === 0) {
          b.style.transform = `translateX(${x}px) scale(${f.iconScale})`;
          b.style.opacity = "1";
        } else {
          b.style.transform = `translateX(${x - k * 12 * lag}px)`;
          b.style.opacity = String(Math.max(0, lag * (0.4 - k * 0.15)));
        }
      });
      if (word.current) {
        word.current.style.transform = `translateX(${HEADLINE_X + Math.max(0, 1 - f.word) * 18}px) scale(${f.wordScale})`;
        word.current.style.filter = f.wordBlur > 0.05 ? `blur(${f.wordBlur.toFixed(2)}px)` : "none";
        word.current.style.opacity = String(f.wordOpacity);
      }
      const base = HEADLINE_X + fit.current.headW;
      sparks.current.forEach((s, i) => {
        if (!s) return;
        const [px, py, size, delay] = SPARKS[i];
        const local = Math.min(1, Math.max(0, (f.sparkle - delay) / 0.7));
        const tw = Math.sin(local * Math.PI);
        s.style.transform = `translate(${base + px}px, ${ROW * py - size / 2}px) scale(${tw}) rotate(${local * 90}deg)`;
        s.style.opacity = String(tw);
      });
      if (chip.current) {
        chip.current.style.transform = `translateX(${(1 - f.chip) * 70}px)`;
        chip.current.style.opacity = String(f.chip);
      }
      if (val.current) {
        val.current.style.transform = `translateY(${(1 - f.roll) * 30}px)`;
        val.current.style.opacity = f.roll > 0 ? "1" : "0";
      }
      if (streak.current) {
        streak.current.style.left = `calc(${(f.streak * 100).toFixed(2)}% - 45px)`;
        streak.current.style.opacity = f.streak > -0.1 && f.streak < 1.1 ? "1" : "0";
      }
      if (t < STINGER_DURATION) raf = requestAnimationFrame(step);
      else el.classList.remove("on");
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      el.classList.remove("on");
    };
  }, [run, spec, reduce]);

  if (!spec) return null;
  const c = tintHex(spec.tint);
  const Icon = STINGER_ICONS[spec.icon];
  const vars = {
    "--sg-d": shade(c, -0.5),
    "--sg-m": shade(c, -0.05),
    "--sg-l": shade(c, 0.3),
    "--sg-e": shade(c, 0.6, 0.9),
    "--sg-ic": shade(c, -0.55),
    "--sg-gl": shade(c, 0.4, 0.8),
    "--sg-wg": shade(c, 0.5, 0.9),
    "--sg-sp": shade(c, 0.7),
    "--sg-cv": shade(c, -0.6),
  } as React.CSSProperties;

  return (
    <div ref={root} className="sg" style={vars} aria-hidden="true">
      <div ref={clip} className="sg-clip">
        <div className="sg-panel" />
        <div ref={edge} className="sg-edge" />
        <div className="sg-row" style={rowTop == null ? undefined : { top: rowTop, bottom: "auto" }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              ref={(el) => {
                badges.current[i] = el;
              }}
              className="sg-badge"
            >
              <Icon strokeWidth={2.6} />
            </span>
          ))}
          <span ref={word} className="sg-word">
            {spec.h}
          </span>
          {SPARKS.map(([, , size], i) => (
            <span
              key={i}
              ref={(el) => {
                sparks.current[i] = el;
              }}
              className={i % 2 ? "sg-spark alt" : "sg-spark"}
              style={{ width: size, height: size }}
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
              </svg>
            </span>
          ))}
          {spec.v && (
            <span ref={chip} className="sg-chip" style={{ width: chipW }}>
              <b ref={val}>{spec.v}</b>
            </span>
          )}
        </div>
        <div ref={streak} className="sg-streak" />
      </div>
    </div>
  );
}
