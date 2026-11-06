/**
 * Celebration alert ("stinger") timeline: every animated value as a pure function of
 * elapsed time. A direct port of AlertStingerTimeline.swift in the app, so the site
 * plays exactly the same 1.9 s motion.
 *
 *   0.00–0.30  pill drops into a banner; panel wipes in 0.04–0.32
 *   0.12–0.42  icon drives in with a short trail, overshoot, recoil at 0.40
 *   0.24–0.50  headline slams in (scale 1.5→1, blur 5→0), sparkles
 *   0.32–0.80  light streak along the bottom edge
 *   0.55–0.85  value chip slides in from the right; value rolls up
 *   1.00       alarms (2 beats) punch the headline and icon again
 *   1.45–1.80  panel wipes off to the right; the banner folds back at 1.72
 */
export interface StingerFrame {
  enter: number;
  exit: number;
  iconTravel: number;
  iconScale: number;
  word: number;
  wordScale: number;
  wordBlur: number;
  wordOpacity: number;
  chip: number;
  roll: number;
  sparkle: number;
  streak: number;
  opacity: number;
}

export const STINGER_DURATION = 1.9;
export const STINGER_RETRACT = 1.72;
export const STINGER_DROP = 46;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const progress = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));
const easeInOutCubic = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const easeOutBack = (p: number, s: number) => (p <= 0 ? 0 : 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2));
const bump = (t: number, at: number, length: number) => {
  const p = (t - at) / length;
  return p >= 0 && p <= 1 ? Math.sin(p * Math.PI) : 0;
};

export function stingerFrame(t: number, beats: number, reduceMotion = false): StingerFrame {
  if (reduceMotion) {
    const opacity = Math.min(clamp01(t / 0.2), 1 - clamp01((t - 1.45) / 0.35));
    return { enter: 1, exit: 0, iconTravel: 1, iconScale: 1, word: 1, wordScale: 1, wordBlur: 0, wordOpacity: 1, chip: 1, roll: 1, sparkle: 0, streak: -0.2, opacity };
  }
  const second = beats > 1;
  let iconScale = 1 + 0.18 * bump(t, 0.4, 0.24);
  if (second) iconScale += 0.18 * bump(t, 1.0, 0.24);
  const wordP = progress(t, 0.24, 0.5);
  const word = easeOutBack(wordP, 0.9);
  const punch = second ? 1 + 0.1 * bump(t, 1.0, 0.26) : 1;
  let sparkle = 1.15 * progress(t, 0.28, 1.05);
  if (second && t >= 1.0) sparkle = 1.15 * progress(t, 1.0, 1.6);
  return {
    enter: easeInOutCubic(progress(t, 0.04, 0.32)),
    exit: easeInOutCubic(progress(t, 1.45, 1.8)),
    iconTravel: easeOutBack(progress(t, 0.12, 0.42), 0.8),
    iconScale,
    word,
    wordScale: (1.5 - 0.5 * word) * punch,
    wordBlur: Math.max(0, 1 - wordP * 1.8) * 5,
    wordOpacity: clamp01(wordP * 3),
    chip: easeOutCubic(progress(t, 0.55, 0.75)),
    roll: easeOutBack(progress(t, 0.65, 0.85), 0.6),
    sparkle,
    streak: -0.2 + 1.4 * easeInOutCubic(progress(t, 0.32, 0.8)),
    opacity: 1,
  };
}

/** macOS dark-appearance system colours, which the app's alert tints map to. */
export const TINT: Record<string, string> = {
  purple: "#BF5AF2",
  green: "#30D158",
  blue: "#0A84FF",
  orange: "#FF9F0A",
  red: "#FF453A",
  teal: "#40C8E0",
  pink: "#FF375F",
  yellow: "#FFD60A",
};
export const tintHex = (t: string) => TINT[t] ?? t;

/** Same as Color.shade in the app: blend towards white (+) or black (−). */
export function shade(hex: string, amount: number, alpha = 1) {
  const n = parseInt(hex.slice(1), 16);
  const to = amount >= 0 ? 255 : 0;
  const f = Math.min(1, Math.abs(amount));
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (to - v) * f));
  return alpha < 1 ? `rgba(${r},${g},${b},${alpha})` : `rgb(${r},${g},${b})`;
}

export type StingerIcon = "timer" | "ball" | "mail" | "calendar" | "drop" | "chat" | "eye" | "person" | "wind" | "pill" | "battery" | "focus";

export interface StingerSpec {
  /** Short, upper-case headline, e.g. "TIME'S UP!". */
  h: string;
  /** Scoreboard value from the alert itself; none = no chip. */
  v?: string;
  /** Alarms (timers, meetings, reminders) punch twice. */
  beats: 1 | 2;
  tint: string;
  icon: StingerIcon;
  /** The pill's details once the banner folds back. */
  left: string;
  right: string;
  /** What kind of alert this is. */
  name: string;
}

export const MAIN_STINGERS: Record<"timer" | "goal" | "mail" | "meeting" | "water", StingerSpec> = {
  timer: { h: "TIME’S UP!", v: "0:00", beats: 2, tint: "purple", icon: "timer", left: "Tea timer", right: "Done", name: "Timer finished" },
  goal: { h: "GOAL!", v: "1–0", beats: 1, tint: "green", icon: "ball", left: "Goal! BRA 1–0 ARG", right: "23′", name: "Goal" },
  mail: { h: "NEW MAIL!", v: "+3", beats: 1, tint: "blue", icon: "mail", left: "3 new emails", right: "Gmail", name: "New mail" },
  meeting: { h: "UP NEXT!", v: "IN 5 MIN", beats: 2, tint: "orange", icon: "calendar", left: "Design review", right: "in 5 min", name: "Meeting soon" },
  water: { h: "HYDRATE!", beats: 2, tint: "blue", icon: "drop", left: "Drink water", right: "Glass 4 of 8", name: "Water" },
};

export const ALL_STINGERS: StingerSpec[] = [
  MAIN_STINGERS.timer,
  { h: "MEETING!", v: "NOW", beats: 2, tint: "orange", icon: "calendar", left: "Design review", right: "Now · Zoom", name: "Meeting starting" },
  MAIN_STINGERS.meeting,
  MAIN_STINGERS.goal,
  { h: "WICKET!", v: "120/3", beats: 1, tint: "green", icon: "ball", left: "Wicket! IND 120/3", right: "18.4 ov", name: "Wicket" },
  MAIN_STINGERS.mail,
  { h: "NEW MESSAGE!", v: "2", beats: 1, tint: "green", icon: "chat", left: "WhatsApp", right: "2 unread", name: "WhatsApp" },
  { h: "BREAK TIME!", beats: 2, tint: "green", icon: "focus", left: "Pomodoro", right: "Break · 5 min", name: "Pomodoro break" },
  { h: "FOCUS!", beats: 2, tint: "orange", icon: "focus", left: "Pomodoro", right: "Focus · 25 min", name: "Pomodoro focus" },
  { h: "BREAK SOON!", v: "1:00", beats: 2, tint: "teal", icon: "eye", left: "Break in 1:00", right: "20 s break", name: "Break heads-up" },
  MAIN_STINGERS.water,
  { h: "SIT TALL!", beats: 2, tint: "#FF8A5C", icon: "person", left: "Posture check", right: "Shoulders down", name: "Posture" },
  { h: "LOOK AWAY!", beats: 2, tint: "#7F6BFF", icon: "eye", left: "Eye rest", right: "20 ft · 20 s", name: "Eye rest" },
  { h: "STRETCH!", beats: 2, tint: "#36C46B", icon: "person", left: "Stretch", right: "1 min", name: "Stretch" },
  { h: "STAND UP!", beats: 2, tint: "#F0A046", icon: "person", left: "Stand up", right: "Move a little", name: "Stand up" },
  { h: "BREATHE", beats: 2, tint: "#2FBF9B", icon: "wind", left: "Breathe", right: "In… and out", name: "Breathe" },
  { h: "MEDS TIME!", beats: 2, tint: "#FF6B8B", icon: "pill", left: "Medicine", right: "9:00", name: "Medicine" },
  { h: "BLINK!", beats: 2, tint: "#C36BFF", icon: "eye", left: "Blink", right: "A few slow blinks", name: "Blink" },
  { h: "LOW BATTERY!", v: "10%", beats: 2, tint: "red", icon: "battery", left: "Battery low", right: "10% left", name: "Low battery" },
];
