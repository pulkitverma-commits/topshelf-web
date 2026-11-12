"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Battery,
  Bluetooth,
  Calculator,
  CalendarDays,
  Camera,
  Check,
  ClipboardList,
  Cpu,
  Droplet,
  Eye,
  Gauge,
  Grid2x2,
  Inbox,
  KeyRound,
  Link2,
  Mail,
  MemoryStick,
  MessageCircle,
  Mic,
  Music,
  NotebookPen,
  Pin,
  Settings,
  Sparkles,
  Timer,
  Trophy,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/components/app-provider";
import { Stinger } from "@/components/topshelf/stinger";
import { Digit, type DigitMood } from "@/components/topshelf/digit";
import { WellnessArt, type WellnessKind } from "@/components/topshelf/wellness-art";
import { useElementWidth } from "@/hooks/use-element-width";
import { ERR_TEXT, emptyCalc, exprText, fmtNum, mainText, press, preview, fromHistory, type CalcState } from "@/lib/calc";
import { STINGER_DURATION, STINGER_RETRACT, tintHex, type StingerSpec } from "@/lib/stinger";
import { cn, formatTime, spring } from "@/lib/utils";

const bar = "absolute left-1/2 -translate-x-1/2 overflow-hidden bg-black text-white";
const chip = (on = false) =>
  cn(
    "inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm transition-[background-color,transform] duration-300 ease-spring active:scale-95",
    on ? "bg-ink text-white" : "bg-white text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:bg-[#fafafa]",
  );

/** Plays an alert the way the visitor chose: Celebration, Colour flash or None. */
function useAlert() {
  const app = useApp();
  const [spec, setSpec] = useState<StingerSpec | null>(null);
  const [run, setRun] = useState(0);
  const [dropped, setDropped] = useState(false);
  const [flash, setFlash] = useState<{ id: number; c: string; beats: number } | null>(null);
  const t = useRef<number[]>([]);
  useEffect(() => () => t.current.forEach(window.clearTimeout), []);
  const fire = useCallback(
    (s: StingerSpec) => {
      t.current.forEach(window.clearTimeout);
      t.current = [];
      setSpec(s);
      if (app.alertStyle === "stinger") {
        setRun((r) => r + 1);
        setDropped(true);
        t.current.push(window.setTimeout(() => setDropped(false), STINGER_RETRACT * 1000));
      } else if (app.alertStyle === "flash") setFlash((f) => ({ id: (f?.id ?? 0) + 1, c: tintHex(s.tint), beats: s.beats }));
      app.playSound();
    },
    [app],
  );
  return { spec, run: app.alertStyle === "stinger" ? run : 0, dropped, flash, fire, sting: app.alertStyle === "stinger" };
}

/* ───────────── Wellness ───────────── */

const WELL: { k: WellnessKind; label: string; title: string; sub: string; h: string; c: string; icon: StingerSpec["icon"] }[] = [
  { k: "posture", label: "Posture", title: "Posture check", sub: "Sit back, shoulders down, screen at eye level.", h: "SIT TALL!", c: "#FF8A5C", icon: "person" },
  { k: "water", label: "Water", title: "Drink water", sub: "Glass 4 of 8 today.", h: "HYDRATE!", c: "#0A84FF", icon: "drop" },
  { k: "eyes", label: "Eye rest", title: "Rest your eyes", sub: "Look at something 20 feet away for 20 seconds.", h: "LOOK AWAY!", c: "#7F6BFF", icon: "eye" },
  { k: "blink", label: "Blink", title: "Blink", sub: "Blink slowly a few times.", h: "BLINK!", c: "#C36BFF", icon: "eye" },
  { k: "breathe", label: "Breathe", title: "Breathe", sub: "Breathe in slowly… and out.", h: "BREATHE", c: "#2FBF9B", icon: "wind" },
  { k: "medicine", label: "Medicine", title: "Medicine", sub: "Time for your 9:00 medicine.", h: "MEDS TIME!", c: "#FF6B8B", icon: "pill" },
];

export function WellnessDemo() {
  const [zone, w] = useElementWidth<HTMLDivElement>();
  const alert = useAlert();
  const [cur, setCur] = useState<(typeof WELL)[number] | null>(null);
  const [glasses, setGlasses] = useState(3);
  const [note, setNote] = useState("");
  const doneBtn = useRef<HTMLButtonElement>(null);
  const width = Math.min(520, (w || 520) - 24);

  const trigger = (x: (typeof WELL)[number], kb: boolean) => {
    setCur(x);
    setNote("");
    alert.fire({ h: x.h, beats: 2, tint: x.c, icon: x.icon, left: x.title, right: "", name: x.label });
    if (kb) window.setTimeout(() => doneBtn.current?.focus(), 60);
  };
  const end = (snooze: boolean) => {
    if (!cur) return;
    if (!snooze && cur.k === "water") setGlasses((g) => Math.min(8, g + 1));
    setNote(`${cur.title} · ${snooze ? "Snoozed 10 min" : "Done ✓"}`);
    setCur(null);
  };

  return (
    <div ref={zone} className="absolute inset-0">
      <motion.div
        initial={false}
        animate={{ width: cur ? width : 220, height: cur ? 138 : 34, borderBottomLeftRadius: cur ? 28 : 16, borderBottomRightRadius: cur ? 28 : 16 }}
        transition={spring}
        key={alert.flash?.id ?? "bar"}
        className={cn(bar, "top-0 shadow-[0_30px_60px_-24px_rgba(0,0,0,.6)]", cur && "animate-[alarm-pulse_1.3s_ease-in-out_infinite]", alert.flash && (alert.flash.beats > 1 ? "flood2" : "flood1"))}
        style={{ "--fx-c": alert.flash?.c } as React.CSSProperties}
      >
        <span className="fx-layer" />
        <AnimatePresence>
          {cur && (
            <motion.div
              key={cur.k}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="absolute inset-0 z-[2] flex items-center gap-3 px-4 pt-6 sm:gap-4 sm:px-5"
              role="alertdialog"
              aria-label={`${cur.title}. ${cur.sub}`}
            >
              <WellnessArt kind={cur.k} className="size-[72px] flex-none sm:size-[84px]" />
              <div className="min-w-0 flex-1">
                <p className="m-0 text-[10.5px] uppercase tracking-[.14em] text-white/45">Wellness reminder</p>
                <p className="m-0 font-display text-lg font-semibold">{cur.title}</p>
                <p className="m-0 text-[13px] text-white/65">{cur.k === "water" ? `Glass ${Math.min(8, glasses + 1)} of 8 today.` : cur.sub}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <button ref={doneBtn} type="button" onClick={() => end(false)} className="h-9 rounded-full bg-accent px-4 text-[13px] font-medium text-white">
                  Done
                </button>
                <button type="button" onClick={() => end(true)} className="h-9 whitespace-nowrap rounded-full px-3 text-[12.5px] text-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,.2)]">
                  Snooze 10 min
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Stinger spec={cur ? alert.spec : null} run={cur ? alert.run : 0} width={width} rowTop={56} />
      </motion.div>
      <p className="absolute inset-x-0 top-[160px] m-0 min-h-5 px-5 text-center text-sm text-muted" aria-live="polite">
        {note || (cur ? "TopShelf blinks until you choose Done or Snooze." : "Pick a reminder to see it arrive.")}
      </p>
      <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-4 px-3">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" role="group" aria-label="Preview a wellness reminder">
          {WELL.map((x) => (
            <button key={x.k} type="button" onClick={(e) => trigger(x, e.detail === 0)} className="flex flex-col items-center gap-1 rounded-2xl px-1.5 py-2 text-xs text-ink transition-transform duration-300 ease-spring hover:-translate-y-0.5">
              <WellnessArt kind={x.k} live={false} className="size-12 drop-shadow-[0_8px_10px_rgba(0,0,0,.18)]" />
              {x.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          Water today
          <div className="flex gap-1" role="group" aria-label="Glasses of water today">
            {Array.from({ length: 8 }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Glass ${i + 1}`}
                aria-pressed={i < glasses}
                onClick={() => setGlasses(glasses === i + 1 ? i : i + 1)}
                className={cn("h-6 w-[18px] rounded-[3px_3px_6px_6px] shadow-[inset_0_0_0_1.5px_#0A84FF]", i < glasses && "bg-[linear-gradient(transparent_35%,#5AB0FF_35%)]")}
              />
            ))}
          </div>
          <b className="font-display text-ink tabular-nums">{glasses}/8</b>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Calculator with Digit ───────────── */

const KEYS: { k: string; cls?: string; label?: string; span?: number }[] = [
  { k: "C", cls: "fn", label: "Clear" }, { k: "(", cls: "fn" }, { k: ")", cls: "fn" }, { k: "%", cls: "fn", label: "Percent" }, { k: "÷", cls: "op", label: "Divide" },
  { k: "7" }, { k: "8" }, { k: "9" }, { k: "⌫", cls: "fn", label: "Delete" }, { k: "×", cls: "op", label: "Multiply" },
  { k: "4" }, { k: "5" }, { k: "6" }, { k: "±", cls: "fn", label: "Plus or minus" }, { k: "−", cls: "op", label: "Minus" },
  { k: "1" }, { k: "2" }, { k: "3" }, { k: ".", label: "Decimal point" }, { k: "+", cls: "op", label: "Plus" },
  { k: "0", span: 3 }, { k: "=", cls: "eq", label: "Equals", span: 2 },
];
const KEYMAP: Record<string, string> = { "+": "+", "-": "−", "*": "×", x: "×", X: "×", "/": "÷", "%": "%", "(": "(", ")": ")", ".": ".", ",": ".", Enter: "=", "=": "=", Backspace: "⌫", Delete: "C", c: "C", C: "C" };

function Rolling({ text }: { text: string }) {
  const chars = [...text];
  return (
    <span className="whitespace-nowrap">
      {chars.map((c, i) => {
        const key = chars.length - i; // slots are aligned from the right, so digits roll in place
        return /\d/.test(c) ? (
          <span key={`d${key}`} className="roll">
            <span style={{ transform: `translateY(${-Number(c) * 1.15}em)` }}>
              {"0123456789".split("").map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={`s${key}${c}`}>{c}</span>
        );
      })}
    </span>
  );
}

export function CalcDemo() {
  const [calc, setCalc] = useState<CalcState>(emptyCalc);
  const [mood, setMood] = useState<DigitMood>("");
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [live, setLive] = useState("");
  const [pressed, setPressed] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const digitRef = useRef<HTMLDivElement>(null);
  const keyRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastKey = useRef(Date.now());
  const moodT = useRef<number | undefined>(undefined);

  const setMoodFor = (m: DigitMood, ms: number) => {
    window.clearTimeout(moodT.current);
    setMood(m);
    moodT.current = window.setTimeout(() => setMood(""), ms);
  };
  const lookAt = (el: HTMLElement | null) => {
    const d = digitRef.current?.querySelector(".d-eyes")?.getBoundingClientRect();
    if (!el || !d) return;
    const r = el.getBoundingClientRect();
    const dx = r.left + r.width / 2 - (d.left + d.width / 2);
    const dy = r.top + r.height / 2 - (d.top + d.height / 2);
    const len = Math.hypot(dx, dy) || 1;
    setLook({ x: (dx / len) * 3.4, y: (dy / len) * 2.8 });
  };
  const hit = useCallback((k: string) => {
    lastKey.current = Date.now();
    lookAt(keyRefs.current[k] ?? null);
    setCalc((prev) => {
      const { state, result } = press(prev, k);
      if (result === "equals") {
        setMoodFor("cheer", 1300);
        setLive(`Result ${fmtNum(state.history[0].v)}`);
      } else if (result === "div0") {
        setMoodFor("dizzy", 2200);
        setLive(ERR_TEXT.div0);
      } else if (result !== "ok") setLive(ERR_TEXT[result]);
      else if (mood === "doze") setMood("");
      return state;
    });
    setPressed(k);
    window.setTimeout(() => setPressed((p) => (p === k ? null : p)), 120);
  }, [mood]);

  // Typing works while focus is in the calculator or nowhere in particular.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const a = document.activeElement as HTMLElement | null;
      const inside = !!a && !!root.current?.contains(a);
      if (!inside && a && a !== document.body) return;
      if (a?.closest("textarea, input")) return;
      if ((e.key === "Enter" || e.key === " ") && a?.closest("button") && inside) return;
      const k = /^\d$/.test(e.key) ? e.key : KEYMAP[e.key];
      if (!k) return;
      e.preventDefault();
      hit(k);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hit]);

  // Blinks now and then; dozes off after 15 s alone.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (Date.now() - lastKey.current > 15000) {
        setMood((m) => (m === "" ? "doze" : m));
        setLook({ x: 0, y: 0 });
      } else if (Math.random() < 0.3) {
        setMood((m) => (m === "" ? "blink" : m));
        window.setTimeout(() => setMood((m) => (m === "blink" ? "" : m)), 150);
      }
    }, 1500);
    return () => window.clearInterval(id);
  }, []);

  const pv = preview(calc);
  let expr = calc.justEvaluated && calc.history[0] ? `${calc.history[0].expr} =` : exprText(calc.tokens);
  if (expr.length > 30) expr = `…${expr.slice(-29)}`;
  const main = calc.error ? ERR_TEXT[calc.error] : mainText(calc);

  return (
    <div ref={root} className="absolute inset-0">
      <div className={cn(bar, "top-0 grid w-[min(640px,96%)] grid-cols-1 gap-3 rounded-b-[30px] p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_auto] sm:p-4")}>
        <div className="flex min-h-0 min-w-0 flex-col rounded-2xl bg-white/[.06] px-3 py-2.5">
          <p className="m-0 truncate text-right text-xs tabular-nums text-white/50" aria-hidden="true">{expr || " "}</p>
          <p className={cn("m-0 h-10 overflow-hidden text-right font-display tabular-nums tracking-[-.02em]", calc.error ? "text-[15px] leading-10 text-[#ffb4a3]" : main.length > 12 ? "text-[22px] leading-10" : "text-[32px] leading-[1.15]")} aria-hidden="true">
            {calc.error ? main : <Rolling text={main} />}
          </p>
          <p className="m-0 min-h-[18px] text-right text-[12.5px] tabular-nums text-accent-soft" aria-hidden="true">
            {!calc.justEvaluated && calc.tokens.length > 1 && pv !== null && !calc.error ? `= ${fmtNum(pv)}` : " "}
          </p>
          <ol className="m-0 mt-1.5 hidden max-h-[88px] list-none flex-col gap-0.5 overflow-auto border-t border-white/10 p-0 pt-1.5 sm:flex" aria-label="History">
            {calc.history.length === 0 && <li className="text-[11.5px] text-white/30">History appears here</li>}
            {calc.history.map((h, i) => (
              <li key={`${h.expr}${i}`}>
                <button type="button" onClick={() => setCalc((c) => fromHistory(c, h.v))} aria-label={`Use ${fmtNum(h.v)} from ${h.expr}`} className="flex w-full justify-between gap-2 rounded-md px-1 py-0.5 text-[11.5px] tabular-nums text-white/55 hover:bg-white/[.07]">
                  <span className="truncate">{h.expr}</span>
                  <span className="text-white">{fmtNum(h.v)}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid grid-cols-5 content-center gap-1.5" role="group" aria-label="Calculator keys">
          {KEYS.map((key) => (
            <button
              key={key.k}
              ref={(el) => {
                keyRefs.current[key.k] = el;
              }}
              type="button"
              aria-label={key.label}
              onClick={() => hit(key.k)}
              className={cn("ck", key.cls, pressed === key.k && "pressed")}
              style={key.span ? { gridColumn: `span ${key.span}` } : undefined}
            >
              {key.k}
            </button>
          ))}
        </div>
        <div ref={digitRef} className="hidden items-center justify-center sm:flex">
          <Digit mood={mood} look={look} />
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{live}</p>
      <p className="absolute inset-x-0 bottom-8 m-0 px-6 text-center text-sm text-muted">
        Not the macOS one. Candy-glass keys, rolling digits, a live result and a history tape. Type with your keyboard too. Try <b className="font-normal text-ink">50 + 10 %</b>, or divide by zero and watch Digit.
      </p>
    </div>
  );
}

/* ───────────── Inbox: unread counts only ───────────── */

export function InboxDemo() {
  const [zone, w] = useElementWidth<HTMLDivElement>();
  const alert = useAlert();
  const [accts, setAccts] = useState([
    { n: "iCloud", k: "Personal", c: 2 },
    { n: "Gmail", k: "Google", c: 3 },
    { n: "Work", k: "Exchange", c: 1 },
  ]);
  const [wa, setWa] = useState(3);
  const [bumped, setBumped] = useState(-1);
  const next = useRef(0);
  const total = accts.reduce((n, a) => n + a.c, 0);
  const width = Math.min(520, (w || 520) - 24);

  const newMail = () => {
    const i = next.current++ % accts.length;
    setAccts((a) => a.map((x, j) => (j === i ? { ...x, c: x.c + 1 } : x)));
    setBumped(i);
    alert.fire({ h: "NEW MAIL!", v: "+1", beats: 1, tint: "blue", icon: "mail", left: `New mail · ${accts[i].n}`, right: `${total + 1} unread`, name: "New mail" });
  };
  const newWa = () => {
    setWa((n) => n + 1);
    alert.fire({ h: "NEW MESSAGE!", v: String(wa + 1), beats: 1, tint: "green", icon: "chat", left: "WhatsApp", right: `${wa + 1} unread`, name: "WhatsApp" });
  };

  return (
    <div ref={zone} className="absolute inset-0">
      <AlertPill alert={alert} width={width} />
      <div className={cn(bar, "top-[104px] grid w-[min(520px,92%)] grid-cols-1 gap-3 rounded-[26px] p-4 sm:grid-cols-[1.6fr_1fr]")}>
        <div>
          <p className="m-0 text-[10.5px] uppercase tracking-[.14em] text-white/45">Unread · Mail</p>
          <ul className="m-0 mt-2 flex list-none flex-col gap-1.5 p-0 text-[13px]" aria-live="polite">
            <li className="flex items-center rounded-xl bg-accent/25 px-3 py-1.5">All inboxes<b className="ml-auto font-display text-lg tabular-nums">{total}</b></li>
            {accts.map((a, i) => (
              <li key={a.n} className="flex items-center rounded-xl bg-white/[.06] px-3 py-1.5">
                {a.n} <small className="ml-1.5 text-white/45">· {a.k}</small>
                <motion.b key={a.c} initial={i === bumped ? { scale: 1.4, color: "#A9B3FF" } : false} animate={{ scale: 1, color: "#FFFFFF" }} transition={spring} className="ml-auto font-display text-lg tabular-nums">
                  {a.c}
                </motion.b>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white/[.06] p-3">
          <p className="m-0 text-[10.5px] uppercase tracking-[.14em] text-white/45">WhatsApp</p>
          <p className="m-0 mt-1 text-[13px] text-white/70"><b className="mr-1 font-display text-3xl tabular-nums text-white">{wa}</b>unread</p>
          <p className="m-0 mt-1 text-[11.5px] text-white/45">Unread count only.</p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 px-4">
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className={chip()} onClick={newMail}><Mail className="size-4" aria-hidden="true" />New mail</button>
          <button type="button" className={chip()} onClick={newWa}><MessageCircle className="size-4" aria-hidden="true" />New WhatsApp message</button>
        </div>
        <p className="m-0 max-w-[440px] text-center text-[13px] text-muted">Off until you turn it on. TopShelf reads only Mail&apos;s unread counts, about once a minute while Mail is running, so Mail stays fast.</p>
      </div>
    </div>
  );
}

/** A live-activity pill that plays the chosen alert style, then shows the details. */
function AlertPill({ alert, width, top = 0 }: { alert: ReturnType<typeof useAlert>; width: number; top?: number }) {
  const [show, setShow] = useState(false);
  const t = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!alert.spec) return;
    setShow(true);
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setShow(false), (alert.sting ? STINGER_DURATION * 1000 : 0) + 2600);
    return () => window.clearTimeout(t.current);
  }, [alert.spec, alert.run, alert.flash, alert.sting]);
  const s = alert.spec;
  const c = s ? tintHex(s.tint) : "#fff";
  return (
    <motion.div
      initial={false}
      animate={{ width: show ? width : 200, height: show ? (alert.dropped ? 80 : 34) : 28, borderBottomLeftRadius: alert.dropped ? 22 : 15, borderBottomRightRadius: alert.dropped ? 22 : 15 }}
      transition={spring}
      key={alert.flash?.id ?? "pill"}
      className={cn(bar, "z-[3] shadow-[0_24px_50px_-24px_rgba(0,0,0,.6)]", alert.flash && (alert.flash.beats > 1 ? "flood2" : "flood1"))}
      style={{ top, "--fx-c": alert.flash?.c } as React.CSSProperties}
      aria-live="polite"
    >
      <span className="fx-layer" />
      <div className={cn("absolute inset-x-0 top-0 z-[2] flex h-[34px] items-center gap-2 whitespace-nowrap px-4 text-[12.5px] transition-opacity duration-300", show && s ? "opacity-100 delay-150" : "opacity-0")}>
        {s && (
          <>
            <span className="size-2 flex-none rounded-full" style={{ background: c }} />
            <span className="truncate">{s.left}</span>
            <span className="ml-auto font-semibold" style={{ color: c }}>{s.right}</span>
          </>
        )}
      </div>
      <Stinger spec={s} run={alert.run} width={width} />
    </motion.div>
  );
}

/* ───────────── Live Scores ───────────── */

export function ScoresDemo() {
  const [zone, w] = useElementWidth<HTMLDivElement>();
  const alert = useAlert();
  const [scores, setScores] = useState([
    { lg: "Cricket · ODI", st: "45.4 ov", live: true, a: ["IND", "281/4"], b: ["AUS", "Yet to bat"], fav: true },
    { lg: "Football · World Cup qualifier", st: "66′", live: true, a: ["ARG", "1"], b: ["BRA", "1"] },
    { lg: "NBA", st: "Q4 3:12", live: true, a: ["LAL", "98"], b: ["BOS", "94"] },
    { lg: "NFL", st: "Final", live: false, a: ["KC", "21"], b: ["BUF", "17"] },
  ]);
  const width = Math.min(520, (w || 520) - 24);
  const goal = () => {
    setScores((s) => s.map((x, i) => (i === 1 ? { ...x, a: ["ARG", "2"], st: "67′" } : x)));
    alert.fire({ h: "GOAL!", v: "2–1", beats: 1, tint: "green", icon: "ball", left: "Goal! ARG 2–1 BRA", right: "67′", name: "Goal" });
  };
  const wicket = () => {
    setScores((s) => s.map((x, i) => (i === 0 ? { ...x, a: ["IND", "291/5"], st: "47.1 ov" } : x)));
    alert.fire({ h: "WICKET!", v: "291/5", beats: 1, tint: "green", icon: "ball", left: "Wicket! IND 291/5", right: "47.1 ov", name: "Wicket" });
  };
  return (
    <div ref={zone} className="absolute inset-0">
      <AlertPill alert={alert} width={width} />
      <ul className={cn(bar, "top-[104px] m-0 grid w-[min(520px,92%)] list-none grid-cols-1 gap-2 rounded-[26px] p-3.5 sm:grid-cols-2")}>
        {scores.map((s) => (
          <li key={s.lg} className="rounded-xl bg-white/[.06] px-3 py-2 text-[13px]">
            <div className="flex justify-between text-[10.5px] uppercase tracking-[.08em] text-white/50">
              <span className="truncate">{s.lg}</span>
              <span className={cn("whitespace-nowrap", s.live && "text-[#ff8f7a]")}>{s.st}</span>
            </div>
            {[s.a, s.b].map(([team, score]) => (
              <div key={team} className="mt-1 flex justify-between tabular-nums">
                <b className={cn("font-semibold", s.fav && "text-accent-soft")}>{team}</b>
                <span>{score}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 px-4">
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className={chip()} onClick={goal}><Trophy className="size-4" aria-hidden="true" />Goal!</button>
          <button type="button" className={chip()} onClick={wicket}><Trophy className="size-4" aria-hidden="true" />Wicket</button>
        </div>
        <p className="m-0 max-w-[460px] text-center text-[13px] text-muted">Example scores. Live Scores is off until you turn it on, and only fetches the competitions you follow: cricket, football, NBA and NFL.</p>
      </div>
    </div>
  );
}

/* ───────────── Clipboard (1.1 upgrades) ───────────── */

const ROUGH = "hey can u move the review to thu 3pm, sorry for late notice";
const AI_OUT: Record<string, string> = {
  "Rewrite professionally": "Hi, could we move the review to Thursday at 3 pm? Apologies for the short notice.",
  "Rewrite casually": "Hey! Any chance we can shift the review to Thursday at 3? Sorry it’s last minute.",
  Shorten: "Can we move the review to Thu, 3 pm? Sorry for the late notice.",
  "Correct grammar": "Hey, can you move the review to Thursday at 3 pm? Sorry for the late notice.",
  "Bullet points": "• Move the review to Thursday, 3 pm\n• Apologies for the late notice",
  "Draft a reply": "Thursday at 3 pm works for me. No problem at all, see you then.",
};
type Entry = { id: number; t: string; Icon: LucideIcon; time?: string; pinned?: boolean; fav?: boolean; code?: boolean; ai?: "source" | "result" };

export function ClipboardDemo() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: 1, t: "Q4 launch: “A quiet shelf at the top of your Mac.”", Icon: Pin, time: "Pinned", pinned: true },
    { id: 2, t: ROUGH, Icon: NotebookPen, time: "1 min", ai: "source" },
    { id: 3, t: "Your verification code is 482 913", Icon: KeyRound, code: true },
    { id: 4, t: "Shipping address · Studio, 2nd floor", Icon: NotebookPen, time: "Yesterday", fav: true },
    { id: 5, t: "https://example.com/press-kit", Icon: Link2, time: "12 min" },
  ]);
  const [sel, setSel] = useState(2);
  const [filter, setFilter] = useState<"all" | "pinned" | "fav">("all");
  const [code, setCode] = useState(120);
  const [out, setOut] = useState("");
  const [action, setAction] = useState<string | null>(null);
  const [live, setLive] = useState("");
  const listRef = useRef<HTMLUListElement>(null);
  const nextId = useRef(10);

  useEffect(() => {
    const id = window.setInterval(() => setCode((c) => (c <= -6 ? 120 : c - 1)), 1000);
    return () => window.clearInterval(id);
  }, []);

  const visible = entries.filter((e) => !(filter === "pinned" && !e.pinned) && !(filter === "fav" && !e.fav) && !(e.code && code <= 0));
  const selected = entries.find((e) => e.id === sel);
  const canAI = selected?.ai === "source";

  const runAI = (k: string) => {
    setAction(k);
    const text = AI_OUT[k];
    let n = 0;
    setOut("");
    const id = window.setInterval(() => {
      n += 2;
      setOut(text.slice(0, n));
      if (n >= text.length) {
        window.clearInterval(id);
        setEntries((es) => {
          const i = es.findIndex((e) => e.ai === "source");
          const copy = [...es];
          copy.splice(i, 0, { id: nextId.current++, t: text.replace("\n", " "), Icon: Sparkles, time: "now", ai: "result" });
          return copy;
        });
        setLive(`${k}: the result is ready to edit and was copied as a new entry. The original is unchanged.`);
      }
    }, 18);
  };
  const focusRow = (id: number) => window.setTimeout(() => listRef.current?.querySelector<HTMLButtonElement>(`[data-row="${id}"]`)?.focus(), 0);

  return (
    <div className="absolute inset-0 overflow-auto">
      <div className={cn(bar, "top-0 flex w-[min(600px,96%)] flex-col gap-2.5 rounded-b-[30px] p-3.5 sm:p-4")}>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full bg-white/[.08] p-0.5" role="group" aria-label="Filter clipboard history">
            {(["all", "pinned", "fav"] as const).map((f) => (
              <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={cn("h-8 rounded-full px-3 text-xs", filter === f ? "bg-white/[.16] text-white" : "text-white/60")}>
                {{ all: "All", pinned: "Pinned", fav: "Favourites" }[f]}
              </button>
            ))}
          </div>
          <span className="ml-auto hidden text-[11px] text-white/40 sm:inline">↑↓ choose · ↩ copy · drag into any app</span>
        </div>
        <ul ref={listRef} className="m-0 flex list-none flex-col gap-1 p-0" aria-label="Clipboard history">
          {visible.map((e) => (
            <li key={e.id} className={cn("grid grid-cols-[18px_minmax(0,1fr)_auto_28px] items-center gap-2 rounded-xl py-1 pl-2.5 pr-1 text-[13px] transition-colors", e.id === sel ? "bg-white/[.12] shadow-[inset_0_0_0_1px_rgba(169,179,255,.5)]" : "bg-white/[.05]")}>
              <e.Icon className={cn("size-3.5", e.pinned ? "text-accent-soft" : e.ai === "result" ? "text-[#c4b5ff]" : e.code ? "text-[#ffb4a3]" : "text-white/55")} aria-hidden="true" />
              <button
                type="button"
                data-row={e.id}
                aria-current={e.id === sel}
                onClick={() => {
                  setSel(e.id);
                  setLive("Copied.");
                }}
                onKeyDown={(ev) => {
                  if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp") return;
                  ev.preventDefault();
                  const i = visible.findIndex((x) => x.id === e.id) + (ev.key === "ArrowDown" ? 1 : -1);
                  if (i < 0 || i >= visible.length) return;
                  setSel(visible[i].id);
                  focusRow(visible[i].id);
                }}
                className="truncate py-1 text-left"
              >
                {e.t}
              </button>
              <small className={cn("whitespace-nowrap text-[11px] tabular-nums", e.code ? "text-[#ffb4a3]" : "text-white/40")}>{e.code ? (code > 0 ? `Deletes in ${formatTime(code)}` : "Deleted") : e.time}</small>
              {e.code ? (
                <span />
              ) : (
                <button
                  type="button"
                  aria-pressed={!!e.fav}
                  aria-label={`${e.fav ? "Remove from" : "Add to"} favourites`}
                  onClick={() => setEntries((es) => es.map((x) => (x.id === e.id ? { ...x, fav: !x.fav } : x)))}
                  className={cn("grid size-7 place-items-center rounded-lg text-[15px] transition-[color,transform] duration-300 ease-spring hover:scale-110", e.fav ? "text-accent-soft" : "text-white/30 hover:text-white")}
                >
                  ★
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 border-t border-white/10 pt-2.5">
          <p className="m-0 text-[10.5px] uppercase tracking-[.14em] text-white/45">AI actions <span className="normal-case tracking-normal">· on the selected entry</span></p>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="AI actions">
            {Object.keys(AI_OUT).map((k) => (
              <button key={k} type="button" disabled={!canAI} aria-pressed={action === k} onClick={() => runAI(k)} className={cn("h-8 rounded-full px-3 text-xs shadow-[inset_0_0_0_1px_rgba(255,255,255,.14)] transition-colors disabled:opacity-40", action === k ? "bg-accent/30" : "hover:bg-white/10")}>
                {k}
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="clip-ai-out">Result, editable</label>
          <textarea id="clip-ai-out" value={out} onChange={(e) => setOut(e.target.value)} placeholder="Pick an action. The result opens here for editing." className="h-[66px] resize-none rounded-xl bg-accent/10 px-3 py-2 text-[13px] text-white outline-none placeholder:text-white/35 focus-visible:shadow-[0_0_0_2px_var(--color-accent-soft)]" />
          <p className="m-0 text-[11.5px] text-white/45">{canAI ? "Demo result. In TopShelf, only the entry you pick goes to your Assistant provider, only when you pick an action." : "In this demo, select the rough sentence to try the AI actions."}</p>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{live}</p>
    </div>
  );
}

/* ───────────── System ───────────── */

export function SystemDemo() {
  const [v, setV] = useState({ cpu: 12, mem: 54, net: 1.2 });
  useEffect(() => {
    const walk = (x: number, lo: number, hi: number, s: number) => Math.min(hi, Math.max(lo, x + (Math.random() - 0.5) * s));
    const id = window.setInterval(() => setV((p) => ({ cpu: walk(p.cpu, 4, 38, 9), mem: walk(p.mem, 50, 62, 1.6), net: walk(p.net, 0.1, 4.8, 1.4) })), 1200);
    return () => window.clearInterval(id);
  }, []);
  const tiles: [string, string, number, LucideIcon, string][] = [
    ["Battery", "87%", 87, Battery, "Charging"],
    ["CPU", `${Math.round(v.cpu)}%`, v.cpu, Cpu, "8 cores"],
    ["Memory", `${Math.round(v.mem)}%`, v.mem, MemoryStick, "of 16 GB"],
    ["Network", `${v.net.toFixed(1)} MB/s`, (v.net / 4.8) * 100, Wifi, "Wi-Fi"],
  ];
  return (
    <div className="absolute inset-0">
      <div className={cn(bar, "top-0 flex w-[min(560px,94%)] flex-col gap-3 rounded-b-[30px] p-4")}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tiles.map(([k, val, pct, I, sub]) => (
            <div key={k} className="rounded-2xl bg-white/[.06] p-3">
              <p className="m-0 flex items-center gap-1.5 text-[10.5px] uppercase tracking-[.1em] text-white/50"><I className="size-3.5" aria-hidden="true" />{k}</p>
              <b className="my-1 block font-display text-xl font-semibold tabular-nums">{val}</b>
              <span className="block h-1 overflow-hidden rounded bg-white/[.12]"><i className="block h-full rounded bg-[#4ADE9B] transition-[width] duration-700" style={{ width: `${pct}%` }} /></span>
              <small className="mt-1.5 block text-[11px] text-white/45">{sub}</small>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl bg-white/[.06] px-3 py-2.5 text-[13px]">
          <span className="flex items-center gap-2"><Bluetooth className="size-4 text-accent-soft" aria-hidden="true" />AirPods Pro <span className="text-white/45">· 92%</span></span>
          <span className="ml-auto flex items-center gap-3 text-white/55"><Mic className="size-4" aria-hidden="true" /><Camera className="size-4" aria-hidden="true" />Not in use</span>
        </div>
      </div>
      <p className="absolute inset-x-0 bottom-10 m-0 px-6 text-center text-sm text-muted">Battery, CPU, memory, network, Bluetooth, and when your mic or camera is in use. It only updates while you&apos;re looking.</p>
    </div>
  );
}

/* ───────────── All modules, pins and quick actions ───────────── */

const MODS: { id: string; label: string; Icon: LucideIcon; c: string }[] = [
  { id: "breaks", label: "Breaks", Icon: Eye, c: "#2FBF9B" },
  { id: "music", label: "Now Playing", Icon: Music, c: "#FF6B8B" },
  { id: "shelf", label: "File Shelf", Icon: Inbox, c: "#3FA9FF" },
  { id: "calendar", label: "Calendar", Icon: CalendarDays, c: "#FF7A59" },
  { id: "timers", label: "Timers", Icon: Timer, c: "#F0A046" },
  { id: "calc", label: "Calculator", Icon: Calculator, c: "#8B6BFF" },
  { id: "wellness", label: "Wellness", Icon: Droplet, c: "#FF5FA8" },
  { id: "inbox", label: "Inbox", Icon: Mail, c: "#4F8CFF" },
  { id: "scores", label: "Live Scores", Icon: Trophy, c: "#36C46B" },
  { id: "system", label: "System", Icon: Gauge, c: "#7D8A99" },
  { id: "notes", label: "Notes", Icon: NotebookPen, c: "#E9B949" },
  { id: "clipboard", label: "Clipboard", Icon: ClipboardList, c: "#22B8C9" },
];
const QUICK: [string, LucideIcon, string][] = [
  ["Take a break", Eye, "#2FBF9B"],
  ["Focus 25", Timer, "#F0A046"],
  ["Log water", Droplet, "#3FA9FF"],
  ["Screenshot", Camera, "#8B6BFF"],
  ["New note", NotebookPen, "#E9B949"],
  ["Settings", Settings, "#7D8A99"],
];

export function AllDemo() {
  const app = useApp();
  const [pins, setPins] = useState(["breaks", "music", "shelf", "calendar", "timers", "calc", "wellness", "inbox"]);
  const [toast, setToast] = useState({ id: 0, text: "Pin the modules you use to the tab bar" });
  const say = (text: string) => setToast((t) => ({ id: t.id + 1, text }));
  const toggle = (id: string, label: string) => {
    if (pins.includes(id)) {
      setPins((p) => p.filter((x) => x !== id));
      say(`${label} unpinned`);
    } else {
      setPins((p) => [...p, id]);
      say(`${label} pinned`);
    }
  };
  return (
    <div className="absolute inset-0">
      <div className={cn(bar, "top-0 flex w-[min(600px,96%)] flex-col gap-3 rounded-b-[30px] p-3.5 sm:p-4")}>
        <div className="flex items-center gap-1 overflow-hidden" aria-label="Pinned tabs">
          <span className="grid h-7 w-8 flex-none place-items-center rounded-lg bg-white/[.16]"><Grid2x2 className="size-4" aria-hidden="true" /></span>
          {pins.map((id) => {
            const m = MODS.find((x) => x.id === id)!;
            return (
              <motion.span layout key={id} className="grid h-7 w-8 flex-none place-items-center rounded-lg text-white/60" title={m.label}>
                <m.Icon className="size-4" aria-hidden="true" />
              </motion.span>
            );
          })}
          <span className="ml-auto text-[11px] text-white/40 tabular-nums">{pins.length}/8 pinned</span>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Quick actions">
          {QUICK.map(([label, I, c]) => (
            <button
              key={label}
              type="button"
              onClick={(e) => (label === "Take a break" ? app.startBreak("short", e.currentTarget) : say(`${label} (demo)`))}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/[.08] py-0 pl-1 pr-3 text-xs hover:bg-white/[.14]"
            >
              <i className="grid size-6 place-items-center rounded-full" style={{ background: c }}><I className="size-3.5" aria-hidden="true" /></i>
              {label}
            </button>
          ))}
        </div>
        <ul className="m-0 grid list-none grid-cols-4 gap-x-1 gap-y-2.5 p-0 sm:grid-cols-6">
          {MODS.map((m) => {
            const on = pins.includes(m.id);
            return (
              <li key={m.id} className="relative flex flex-col items-center gap-1 text-[10.5px] text-white/80">
                <span
                  className="grid size-10 place-items-center rounded-[13px] shadow-[inset_0_1.5px_0_rgba(255,255,255,.55),inset_0_-3px_5px_rgba(0,0,0,.22)]"
                  style={{ background: `linear-gradient(165deg, color-mix(in oklab, ${m.c} 55%, #fff), ${m.c} 50%, color-mix(in oklab, ${m.c} 70%, #000))` }}
                >
                  <m.Icon className="size-5 drop-shadow" aria-hidden="true" />
                </span>
                {m.label}
                <button
                  type="button"
                  aria-pressed={on}
                  aria-label={`${on ? "Unpin" : "Pin"} ${m.label}`}
                  onClick={() => toggle(m.id, m.label)}
                  className={cn("absolute -top-1 right-[calc(50%-30px)] grid size-[18px] place-items-center rounded-full bg-black/70", on ? "text-accent-soft" : "text-white/40")}
                >
                  <Pin className="size-2.5" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="absolute inset-x-0 bottom-8 flex justify-center px-4" aria-live="polite">
        <AnimatePresence mode="popLayout">
          <motion.div key={toast.id} initial={{ opacity: 0, scale: 0.8, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={spring} className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-white px-[18px] py-2 text-center text-sm shadow-[0_12px_30px_-16px_rgba(0,0,0,.35),0_0_0_1px_var(--color-line)]">
            <Check className="size-4 flex-none text-accent" strokeWidth={2.2} aria-hidden="true" />
            {toast.text}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ───────────── Assistant ───────────── */

export function AssistantDemo() {
  const [text, setText] = useState("Rewrite this so it sounds calmer: “Please send the deck ASAP!!”");
  const [provider, setProvider] = useState("Claude");
  const [out, setOut] = useState("");
  const go = () => {
    const reply = /asap/i.test(text) ? "“Could you send the deck when you have a moment? Thanks so much.”" : "This demo has no real assistant, so it can only rewrite the sample text.";
    let n = 0;
    setOut("");
    const id = window.setInterval(() => {
      n += 2;
      setOut(reply.slice(0, n));
      if (n >= reply.length) window.clearInterval(id);
    }, 22);
  };
  return (
    <div className="absolute inset-0">
      <div className={cn(bar, "top-0 grid w-[min(580px,96%)] grid-cols-1 gap-3 rounded-b-[30px] p-4 sm:grid-cols-2")}>
        <label className="sr-only" htmlFor="asst-text">Ask the assistant</label>
        <textarea id="asst-text" value={text} onChange={(e) => setText(e.target.value)} className="h-[120px] resize-none rounded-2xl bg-accent/10 px-3 py-2.5 text-[13.5px] text-white outline-none focus-visible:shadow-[0_0_0_2px_var(--color-accent-soft)]" />
        <div className="flex flex-col items-start gap-2.5">
          <div className="inline-flex flex-wrap rounded-full bg-white/[.08] p-0.5" role="group" aria-label="Provider">
            {["Claude", "OpenAI-compatible", "Ollama"].map((p) => (
              <button key={p} type="button" aria-pressed={provider === p} onClick={() => setProvider(p)} className={cn("h-8 whitespace-nowrap rounded-full px-3 text-xs", provider === p ? "bg-white/[.16]" : "text-white/60")}>
                {p}
              </button>
            ))}
          </div>
          <button type="button" onClick={go} className="h-9 rounded-full bg-accent px-4 text-[13px] font-medium">Rewrite</button>
          <p className="m-0 min-h-[3em] text-[13px] leading-snug text-white/85" aria-live="polite">{out}</p>
          {out && <p className="m-0 text-[11px] text-white/40">Demo reply. In TopShelf, a request goes to {provider} only when you start one.</p>}
        </div>
      </div>
      <p className="absolute inset-x-0 bottom-10 m-0 px-6 text-center text-sm text-muted">Optional. Ask, summarise or rewrite with Claude, any OpenAI-compatible endpoint, or a local Ollama model. Keys are stored in the macOS Keychain.</p>
    </div>
  );
}
