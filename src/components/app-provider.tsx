"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { alertSound, softTick, type SoundMode } from "@/lib/audio";
import { BreakPill, BreakScreen } from "@/components/breaks/break-screen";

/**
 * Page-wide state for the parts of TopShelf that reach beyond one demo:
 * break reminders (with the full-screen break and the countdown pill) and the
 * alert preferences (animation style and sound). Everything is local to the page.
 */
export type AlertStyle = "stinger" | "flash" | "off";
export type Difficulty = "casual" | "balanced" | "hardcore";
export type BreakBg = "gradient" | "desktop" | "image";
export type BreakKind = "short" | "long";
export type BreakOutcome = "done" | "rested" | "postpone" | "skip" | "emergency";

export const WORK = 20 * 60;
export const SHORT = 20;
export const LONG = 5 * 60;
export const LONG_EVERY = 3;
export const WEEK = [78, 84, 81, 90, 87, 74];
export const DIFF_NOTE: Record<Difficulty, string> = {
  casual: "Skip and postpone are always available.",
  balanced: "Skip unlocks after 5 seconds of the break; postponing is always possible.",
  hardcore: "No skip or postpone, only a press-and-hold emergency exit.",
};

export interface BreakRun {
  id: number;
  kind: BreakKind;
  from: HTMLElement | null;
}

interface AppValue {
  alertStyle: AlertStyle;
  setAlertStyle: (s: AlertStyle) => void;
  sound: SoundMode;
  setSound: (s: SoundMode) => void;
  playSound: () => void;

  left: number;
  setLeft: (s: number) => void;
  onCall: boolean;
  setOnCall: (v: boolean) => void;
  since: number;
  nextKind: BreakKind;
  taken: number;
  skipped: number;
  score: number;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  bg: BreakBg;
  setBg: (b: BreakBg) => void;
  image: string | null;
  setImage: (url: string | null) => void;
  run: BreakRun | null;
  startBreak: (kind?: BreakKind, from?: HTMLElement | null) => void;
  finishBreak: (how: BreakOutcome) => void;
  pill: number | null;
  startPill: (from?: HTMLElement | null) => void;
  skipNext: () => void;
  lastOutcome: { id: number; text: string } | null;
}

const AppContext = createContext<AppValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [alertStyle, setAlertStyle] = useState<AlertStyle>("stinger");
  const [sound, setSound] = useState<SoundMode>("off");
  const [left, setLeft] = useState(WORK);
  const [onCall, setOnCall] = useState(false);
  const [stats, setStats] = useState({ since: 0, taken: 6, skipped: 1, score: 92 });
  const [difficulty, setDifficulty] = useState<Difficulty>("balanced");
  const [bg, setBg] = useState<BreakBg>("gradient");
  const [image, setImageState] = useState<string | null>(null);
  const [run, setRun] = useState<BreakRun | null>(null);
  const [pill, setPill] = useState<number | null>(null);
  const [lastOutcome, setLastOutcome] = useState<{ id: number; text: string } | null>(null);
  const pillFrom = useRef<HTMLElement | null>(null);
  const runId = useRef(0);

  const nextKind: BreakKind = stats.since >= LONG_EVERY - 1 ? "long" : "short";
  const playSound = useCallback(() => alertSound(sound), [sound]);

  // Only active time counts: the countdown waits on a call, during a break, or while you're away.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (onCall || document.hidden || run || pill !== null) return;
      setLeft((l) => (l > 1 ? l - 1 : WORK));
    }, 1000);
    return () => window.clearInterval(id);
  }, [onCall, run, pill]);

  const startBreak = useCallback(
    (kind?: BreakKind, from?: HTMLElement | null) => {
      if (run) return;
      setPill(null);
      runId.current += 1;
      setRun({ id: runId.current, kind: kind ?? nextKind, from: from ?? (document.activeElement as HTMLElement | null) });
    },
    [run, nextKind],
  );

  const finishBreak = useCallback(
    (how: BreakOutcome) => {
      if (!run) return;
      const kind = run.kind;
      setRun(null);
      if (how === "done" || how === "rested") {
        setStats((s) => ({ ...s, taken: s.taken + 1, score: Math.min(100, s.score + 2), since: kind === "long" ? 0 : s.since + 1 }));
        setLeft(WORK);
      } else if (how === "postpone") {
        setLeft(5 * 60);
      } else {
        setStats((s) => ({ ...s, skipped: s.skipped + 1, score: Math.max(0, s.score - 4) }));
        setLeft(WORK);
      }
      const text = { done: "Break done. Back to it.", rested: "Break done. Back to it.", postpone: "Break postponed 5 minutes.", skip: "Break skipped. Next in 20 minutes.", emergency: "You left the break. Next in 20 minutes." }[how];
      setLastOutcome((o) => ({ id: (o?.id ?? 0) + 1, text }));
    },
    [run],
  );

  const startPill = useCallback(
    (from?: HTMLElement | null) => {
      if (run || pill !== null) return;
      pillFrom.current = from ?? null;
      setPill(10);
      setLeft(10);
    },
    [run, pill],
  );

  // The last 10 seconds: count down, with soft ticks in the final five if sound is on.
  useEffect(() => {
    if (pill === null) return;
    if (pill <= 0) {
      setPill(null);
      startBreak(undefined, pillFrom.current);
      return;
    }
    const id = window.setTimeout(() => {
      setPill((p) => (p === null ? p : p - 1));
      setLeft((l) => Math.max(0, l - 1));
      if (pill - 1 <= 5 && pill - 1 > 0 && sound !== "off") softTick();
    }, 1000);
    return () => window.clearTimeout(id);
  }, [pill, sound, startBreak]);

  const skipNext = useCallback(() => {
    setStats((s) => ({ ...s, skipped: s.skipped + 1, score: Math.max(0, s.score - 4) }));
    setLeft(WORK);
  }, []);

  const setImage = useCallback((url: string | null) => {
    setImageState((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  }, []);

  const value = useMemo<AppValue>(
    () => ({
      alertStyle, setAlertStyle, sound, setSound, playSound,
      left, setLeft, onCall, setOnCall, since: stats.since, nextKind, taken: stats.taken, skipped: stats.skipped, score: stats.score,
      difficulty, setDifficulty, bg, setBg, image, setImage, run, startBreak, finishBreak, pill, startPill, skipNext, lastOutcome,
    }),
    [alertStyle, sound, playSound, left, onCall, stats, nextKind, difficulty, bg, image, setImage, run, startBreak, finishBreak, pill, startPill, skipNext, lastOutcome],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <BreakPill />
      <BreakScreen />
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
