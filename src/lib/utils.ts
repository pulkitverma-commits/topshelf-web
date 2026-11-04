export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatTime(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? "0" : ""}${r}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** True for unconfirmed config values such as "[TRIAL LENGTH]". */
export function isPlaceholder(value: string) {
  return /^\[.*\]$/.test(value.trim());
}

export const spring = { type: "spring", stiffness: 340, damping: 28, mass: 0.9 } as const;
export const softSpring = { type: "spring", stiffness: 220, damping: 26 } as const;
export const easeOut = [0.22, 1, 0.36, 1] as const;
