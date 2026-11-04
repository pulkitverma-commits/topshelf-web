"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Battery,
  BatteryCharging,
  Check,
  Coffee,
  EyeOff,
  Headphones,
  Moon,
  PenLine,
  Pipette,
  ScanLine,
  Sparkles,
  SquareTerminal,
  Upload,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AGENT_STEPS } from "@/lib/demo-data";
import { Equalizer } from "@/components/topshelf/bits";
import { Button } from "@/components/ui/primitives";
import { cn, spring } from "@/lib/utils";

const notch = "absolute left-1/2 -translate-x-1/2 bg-black text-white";

type Activity = "battery" | "audio" | "upload";

export function LiveDemo() {
  const [activity, setActivity] = useState<Activity>("battery");
  const [charging, setCharging] = useState(true);
  const [upload, setUpload] = useState(0);

  useEffect(() => {
    if (activity !== "upload" || upload >= 100) return;
    const id = window.setTimeout(() => setUpload((u) => Math.min(100, u + 4)), 1000);
    return () => window.clearTimeout(id);
  }, [activity, upload]);

  const widths: Record<Activity, number> = { battery: 300, audio: 330, upload: 360 };
  const choose = (a: Activity) => {
    if (a === "upload" && (activity !== "upload" || upload >= 100)) setUpload(0);
    setActivity(a);
  };

  return (
    <div className="absolute inset-0">
      <motion.div
        animate={{ width: widths[activity] }}
        transition={spring}
        className={cn(notch, "top-10 flex h-[46px] max-w-[90%] items-center justify-between overflow-hidden rounded-b-3xl px-4 text-[13px] shadow-[0_0_0_1px_rgba(255,255,255,.06),0_30px_60px_-20px_rgba(0,0,0,.8)]")}
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={activity} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="flex w-full items-center justify-between gap-3 whitespace-nowrap">
            {activity === "battery" && (
              <>
                <span className="flex items-center gap-2">
                  {charging ? <Zap className="size-4 text-[#4ADE9B]" /> : <Battery className="size-4 text-white/70" />}
                  {charging ? "Charging" : "On battery"}
                </span>
                <span className="tabular-nums">86%</span>
              </>
            )}
            {activity === "audio" && (
              <>
                <span className="flex items-center gap-2">
                  <Headphones className="size-4 text-accent-soft" />
                  Headphones
                </span>
                <span className="flex items-center gap-2">
                  Connected <Equalizer bars={3} />
                </span>
              </>
            )}
            {activity === "upload" && (
              <>
                <span className="flex items-center gap-2">
                  <Upload className="size-4 text-[#F5A27A]" />
                  {upload >= 100 ? "Uploaded" : "Uploading 3 files"}
                </span>
                <span className="flex items-center gap-2 tabular-nums">
                  {upload}%
                  <span className="h-1 w-[60px] overflow-hidden rounded bg-white/15">
                    <i className="block h-full rounded bg-[#F5A27A] transition-[width] duration-700" style={{ width: `${upload}%` }} />
                  </span>
                </span>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <p className="absolute inset-x-0 top-[120px] m-0 px-5 text-center text-sm text-white/60">The notch shows what&apos;s happening in the background, then gets out of the way.</p>

      <ul className="absolute left-1/2 top-[180px] m-0 flex w-[min(380px,86%)] -translate-x-1/2 list-none flex-col gap-2.5 p-0">
        <li className="flex items-center gap-3 rounded-2xl bg-white/5 px-3.5 py-3 text-sm text-white">
          {charging ? <BatteryCharging className="size-[18px] text-[#4ADE9B]" /> : <Battery className="size-[18px] text-white/70" />}
          <span className="flex-1">Battery</span>
          <em className="text-[13px] not-italic text-white/55">{charging ? "Charging" : "On battery"} · 86%</em>
        </li>
        <li className="flex items-center gap-3 rounded-2xl bg-white/5 px-3.5 py-3 text-sm text-white">
          <Headphones className="size-[18px] text-accent-soft" />
          <span className="flex-1">Headphones</span>
          <em className="text-[13px] not-italic text-white/55">Connected</em>
        </li>
        <li className="flex items-center gap-3 rounded-2xl bg-white/5 px-3.5 py-3 text-sm text-white">
          <Upload className="size-[18px] text-[#F5A27A]" />
          <span className="flex-1">Upload</span>
          <span className="h-1 w-[90px] overflow-hidden rounded bg-white/15">
            <i className="block h-full rounded bg-[#F5A27A] transition-[width] duration-700" style={{ width: `${upload}%` }} />
          </span>
        </li>
      </ul>

      <div className="absolute inset-x-0 bottom-10 flex flex-wrap justify-center gap-2 px-3">
        {(
          [
            ["battery", "Battery"],
            ["audio", "Headphones"],
            ["upload", "Upload"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => choose(id)}
            aria-pressed={activity === id}
            className={cn(
              "inline-flex h-11 items-center rounded-full px-4 text-sm transition-[background-color,transform] duration-300 ease-spring active:scale-95",
              activity === id ? "bg-white text-[#111]" : "bg-white/[.08] text-white/85 hover:bg-white/[.14]",
            )}
          >
            {label}
          </button>
        ))}
        {activity === "battery" && (
          <button type="button" onClick={() => setCharging((c) => !c)} className="inline-flex h-11 items-center rounded-full bg-white/[.08] px-4 text-sm text-white/85 hover:bg-white/[.14]">
            {charging ? "Unplug charger" : "Plug in charger"}
          </button>
        )}
      </div>
    </div>
  );
}

const SHORTCUTS: { id: string; label: string; Icon: LucideIcon; kind: "toggle" | "fire"; message?: string }[] = [
  { id: "dnd", label: "Do Not Disturb", Icon: Moon, kind: "toggle" },
  { id: "hide", label: "Hide desktop", Icon: EyeOff, kind: "toggle" },
  { id: "awake", label: "Keep awake", Icon: Coffee, kind: "toggle" },
  { id: "shot", label: "Screenshot", Icon: ScanLine, kind: "fire", message: "Screenshot taken (demo)" },
  { id: "pick", label: "Colour picker", Icon: Pipette, kind: "fire", message: "Copied #5468FF (demo)" },
  { id: "note", label: "New note", Icon: PenLine, kind: "fire", message: "New note started (demo)" },
];

export function ShortcutsDemo() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState({ id: 0, text: "Pick an action to try it" });

  const run = (s: (typeof SHORTCUTS)[number]) => {
    if (s.kind === "toggle") {
      const next = !on[s.id];
      setOn((o) => ({ ...o, [s.id]: next }));
      setToast((t) => ({ id: t.id + 1, text: `${s.label} ${next ? "on" : "off"} (demo)` }));
    } else {
      setToast((t) => ({ id: t.id + 1, text: s.message ?? s.label }));
    }
  };

  return (
    <div className="absolute inset-0">
      <div className={cn(notch, "top-0 grid w-[min(500px,94%)] grid-cols-2 gap-2 rounded-b-[30px] p-3 sm:grid-cols-3 sm:gap-2.5 sm:p-[18px]")}>
        {SHORTCUTS.map((s) => {
          const active = s.kind === "toggle" && !!on[s.id];
          return (
            <motion.button
              key={s.id}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => run(s)}
              aria-pressed={s.kind === "toggle" ? active : undefined}
              className={cn(
                "flex min-h-20 flex-col items-start gap-3.5 rounded-[18px] p-3 text-left text-[13px] transition-colors duration-200 sm:min-h-24 sm:p-3.5",
                active ? "bg-accent-deep text-white" : "bg-white/[.07] text-white/90 hover:bg-white/[.12]",
              )}
            >
              <s.Icon className="size-[22px]" strokeWidth={1.8} aria-hidden="true" />
              {s.label}
            </motion.button>
          );
        })}
      </div>
      <div className="absolute inset-x-0 bottom-10 flex justify-center px-4" aria-live="polite">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={spring}
            className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-white px-[18px] py-2 text-center text-sm shadow-[0_12px_30px_-16px_rgba(0,0,0,.35),0_0_0_1px_var(--color-line)]"
          >
            <Check className="size-4 flex-none text-accent" strokeWidth={2.2} aria-hidden="true" />
            {toast.text}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

type AgentState = "idle" | "running" | "paused" | "done";

export function AiDemo() {
  const [state, setState] = useState<AgentState>("idle");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (state !== "running") return;
    const id = window.setTimeout(() => {
      if (step + 1 >= AGENT_STEPS.length - 1) {
        setStep(AGENT_STEPS.length - 1);
        setState("done");
      } else setStep(step + 1);
    }, 1800);
    return () => window.clearTimeout(id);
  }, [state, step]);

  const label = { idle: "Idle", running: "Working", paused: "Paused", done: "Needs you" }[state];
  const action = { idle: "Run agent", running: "Pause", paused: "Resume", done: "Run again" }[state];
  const toggle = () => {
    if (state === "running") setState("paused");
    else if (state === "done") {
      setStep(0);
      setState("running");
    } else setState("running");
  };

  return (
    <div className="absolute inset-0">
      <div className={cn(notch, "top-0 grid w-[min(560px,94%)] grid-cols-1 gap-3 rounded-b-[30px] p-[18px] sm:grid-cols-2")}>
        <div className="hidden flex-col gap-2.5 rounded-[18px] bg-white/[.07] p-3.5 text-[13px] sm:flex">
          <h6 className="m-0 flex items-center gap-2 font-display text-[13px] font-semibold text-white/90">
            <Sparkles className="size-[15px] text-accent-soft" strokeWidth={1.8} aria-hidden="true" />
            Assistant
          </h6>
          <div className="rounded-xl bg-white/[.08] px-3 py-2.5 text-white/85">Summarise my notes from the design review</div>
          <div className="flex flex-col gap-1.5" aria-hidden="true">
            {["94%", "82%", "88%", "54%"].map((w) => (
              <i key={w} className="block h-1.5 rounded bg-white/15" style={{ width: w }} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2.5 rounded-[18px] bg-white/[.07] p-3.5 text-[13px]">
          <h6 className="m-0 flex items-center gap-2 font-display text-[13px] font-semibold text-white/90">
            <SquareTerminal className="size-[15px] text-accent-soft" strokeWidth={1.8} aria-hidden="true" />
            Agent · refactor-auth
            <span
              className={cn(
                "ml-auto inline-flex h-[22px] items-center rounded-full px-2.5 text-[11px] font-normal",
                state === "running" ? "bg-accent/30" : state === "done" ? "bg-[#4ADE9B]/25" : "bg-white/10",
              )}
              aria-live="polite"
            >
              {label}
            </span>
          </h6>
          <ol className="m-0 flex list-none flex-col gap-2 p-0">
            {AGENT_STEPS.map((s, i) => {
              const done = state === "done" || i < step;
              const now = !done && i === step && (state === "running" || state === "paused");
              return (
                <li key={s} className={cn("flex items-center gap-2", done ? "text-white/85" : now ? "text-white" : "text-white/50")}>
                  <span
                    className={cn(
                      "grid size-4 flex-none place-items-center rounded-full",
                      done ? "bg-[#4ADE9B] text-[#06301c]" : now ? "animate-pulse shadow-[inset_0_0_0_2px_var(--color-accent)]" : "shadow-[inset_0_0_0_1.5px_currentColor]",
                    )}
                  >
                    {done && <Check className="size-[11px]" strokeWidth={3} />}
                  </span>
                  {s}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[30px] flex justify-center gap-2">
        <Button variant="dark" onClick={toggle}>
          {action}
        </Button>
        <Button
          onClick={() => {
            setState("idle");
            setStep(0);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
