"use client";

// Interactive Sense demo. Everything here is simulated in the browser: no camera, no data.
// The behaviour mirrors the app (Sources/NotchCore/Sense): "Facing screen" is |yaw| ≤ 28° and
// |pitch| ≤ 24°, reminders use the app's names and order, a stepped-away break is recorded when the
// face returns, blink rate is blinks in the last 60 s, and pulse is labelled experimental.
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Activity, Coffee, Eye, EyeOff, FastForward, HeartPulse, Move, Pause, Play, ScanFace, Smile, Timer, UserRound, Zap } from "lucide-react";

type Reminder = { kind: string; title: string; message: string; Icon: typeof Eye };

const REMINDERS: Reminder[] = [
  { kind: "screenBreak", title: "Screen break", message: "You’ve been at the screen for an hour. Stand up and look away for a few minutes.", Icon: Coffee },
  { kind: "twentyTwentyTwenty", title: "20-20-20", message: "Look at something 20 feet away for 20 seconds.", Icon: Eye },
  { kind: "blinkAwareness", title: "Blink awareness", message: "You’re blinking less than usual. A few slow blinks help.", Icon: EyeOff },
  { kind: "postureReset", title: "Posture reset", message: "You’ve been very still for a while. Roll your shoulders and reset.", Icon: Move },
];

const fmt = (s: number) => {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m` : `${m}:${String(sec).padStart(2, "0")}`;
};

export function SenseDemo() {
  const reduce = useReducedMotion();
  const [running, setRunning] = useState(true);
  const [away, setAway] = useState(false);
  const [natural, setNatural] = useState(true);
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [blinks, setBlinks] = useState<number[]>([]);       // timestamps (ms)
  const [blinking, setBlinking] = useState(false);
  const [session, setSession] = useState(0);
  const [elapsed, setElapsed] = useState(0);   // real seconds watched; never fast-forwarded
  const [sinceBreak, setSinceBreak] = useState(0);
  const [still, setStill] = useState(0);
  const [awayFor, setAwayFor] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const reminderIndex = useRef(0);
  const last = useRef({ yaw: 0, pitch: 0 });

  const facing = Math.abs(yaw) <= 28 && Math.abs(pitch) <= 24;
  const tracking = running && !away;

  // 1 s clock: session, since-break, stillness, away timer.
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSession((s) => s + 1);
      setElapsed((e) => e + 1);
      if (away) { setAwayFor((a) => a + 1); return; }
      setSinceBreak((s) => s + 1);
      const moved = Math.hypot(yaw - last.current.yaw, pitch - last.current.pitch) > 4;
      last.current = { yaw, pitch };
      setStill((s) => (moved ? 0 : s + 1));
    }, 1000);
    return () => clearInterval(t);
  }, [running, away, yaw, pitch]);

  // Natural blinking: about 15 a minute with some randomness, only while a face is tracked.
  useEffect(() => {
    if (!tracking || !natural) return;
    let id: ReturnType<typeof setTimeout>;
    const schedule = () => { id = setTimeout(() => { blink(); schedule(); }, 2200 + Math.random() * 3200); };
    schedule();
    return () => clearTimeout(id);
  }, [tracking, natural]);

  function blink() {
    if (!tracking) return;
    setBlinks((b) => [...b.filter((x) => Date.now() - x < 60_000), Date.now()]);
    setBlinking(true);
    setTimeout(() => setBlinking(false), 150);
  }

  function stepAway(next: boolean) {
    if (!next && away) {
      // Back: a break counts once the face was away long enough (the app's default is 3 min; the demo uses 5 s).
      if (awayFor >= 5) { setSinceBreak(0); flash(`Break recorded · away ${fmt(awayFor)}`); }
      else flash("Welcome back");
      setAwayFor(0);
    }
    setAway(next);
  }

  function flash(text: string) {
    setToast(text);
    setTimeout(() => setToast((t) => (t === text ? null : t)), 2600);
  }

  function fastForward() {
    setSinceBreak((s) => s + 30 * 60);
    setSession((s) => s + 30 * 60);
    setStill((s) => s + 30 * 60);
    const r = REMINDERS[reminderIndex.current % REMINDERS.length];
    reminderIndex.current += 1;
    setReminder(r);
  }

  function act() {
    if (!reminder) return;
    if (reminder.kind === "postureReset") setStill(0); else setSinceBreak(0);
    flash(reminder.kind === "postureReset" ? "Posture reset — nice" : "Break taken");
    setReminder(null);
  }

  const rate = useMemo(() => {
    const recent = blinks.filter((x) => Date.now() - x < 60_000).length;
    return elapsed < 20 ? null : Math.round((recent * 60) / Math.min(60, elapsed));
  }, [blinks, elapsed]);

  const orientation = !tracking ? "—" : facing ? "Facing screen" : "Looking away";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      {/* Live monitoring */}
      <div className="relative flex flex-col overflow-hidden rounded-[30px] bg-[#111214] p-5 text-white sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[.08em] text-white/60">
            <span className="relative grid size-2.5 place-items-center">
              {tracking && !reduce && <span className="absolute inset-0 animate-ping rounded-full bg-[#3dd1ff]/70" />}
              <span className={`size-2.5 rounded-full ${tracking ? "bg-[#3dd1ff]" : away ? "bg-orange-400" : "bg-white/30"}`} />
            </span>
            {running ? (away ? "Paused · no face" : "Monitoring") : "Off"}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/60">Simulated<span className="hidden sm:inline"> — no camera is used on this page</span><span className="sm:hidden"> · no camera</span></span>
        </div>

        <div className="mt-5 grid items-center gap-5 sm:grid-cols-[180px_minmax(0,1fr)]">
          {/* Face */}
          <div className="relative mx-auto grid size-[170px] place-items-center rounded-[34px] bg-[radial-gradient(circle_at_50%_40%,#1d2433,#111214_70%)] [perspective:600px]">
            <AnimatePresence>
              {!away && running ? (
                <motion.svg
                  key="face"
                  viewBox="0 0 120 140"
                  className="h-[130px]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1, rotateY: reduce ? 0 : yaw * 0.9, rotateX: reduce ? 0 : -pitch * 0.9 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 140, damping: 16 }}
                  aria-label={`Simulated face, ${orientation.toLowerCase()}`}
                  role="img"
                >
                  <defs>
                    <linearGradient id="sense-face" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0" stopColor="#3dd1ff" /><stop offset=".45" stopColor="#5478ff" /><stop offset=".75" stopColor="#9e5cff" /><stop offset="1" stopColor="#ff54cc" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="60" cy="68" rx="44" ry="54" fill="none" stroke="url(#sense-face)" strokeWidth="3" />
                  {[42, 78].map((cx) => (
                    <motion.ellipse key={cx} cx={cx + yaw * 0.25} cy={60 + pitch * 0.25} rx="7" fill="#fff"
                      animate={{ ry: blinking ? 0.8 : 7 }} transition={{ duration: 0.07 }} />
                  ))}
                  <path d={`M${46 + yaw * 0.2} ${92 + pitch * 0.2} Q60 ${100 + pitch * 0.2} ${74 + yaw * 0.2} ${92 + pitch * 0.2}`} stroke="#fff" strokeOpacity=".7" strokeWidth="3" fill="none" strokeLinecap="round" />
                  {/* landmark dots */}
                  {[[30, 40], [90, 40], [60, 112], [24, 80], [96, 80]].map(([x, y]) => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#3dd1ff" opacity=".8" />
                  ))}
                </motion.svg>
              ) : (
                <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2 text-white/50">
                  <ScanFace className="size-10" strokeWidth={1.4} aria-hidden="true" />
                  <span className="text-[13px]">{running ? `No face · away ${fmt(awayFor)}` : "Camera off"}</span>
                </motion.div>
              )}
            </AnimatePresence>
            {tracking && !reduce && (
              <motion.span aria-hidden="true" className="pointer-events-none absolute inset-x-4 h-px bg-gradient-to-r from-transparent via-[#3dd1ff] to-transparent"
                animate={{ top: ["12%", "88%", "12%"] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />
            )}
          </div>

          {/* Readouts */}
          <dl className="m-0 grid grid-cols-2 gap-2">
            <Stat Icon={Eye} label="Blink rate" value={tracking && rate !== null ? `${rate}` : "—"} unit="/min" note={rate === null ? "measuring…" : "estimate"} />
            <Stat Icon={Activity} label="Blinks" value={`${blinks.filter((x) => Date.now() - x < 60_000).length}`} unit="last min" />
            <Stat Icon={UserRound} label="Head" value={orientation} small tone={tracking && !facing ? "warn" : undefined} />
            <Stat Icon={Move} label="Still for" value={tracking ? fmt(still) : "—"} />
            <Stat Icon={Timer} label="Session" value={fmt(session)} />
            <Stat Icon={Coffee} label="Since break" value={fmt(sinceBreak)} tone={sinceBreak >= 3600 ? "warn" : undefined} />
          </dl>
        </div>

        {/* Reminder in a notch-style card */}
        <AnimatePresence>
          {reminder && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="mt-5 flex flex-wrap items-center gap-3 rounded-[22px] bg-white/[.07] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]"
              role="status"
            >
              <span className="badge-icon grid size-10 place-items-center rounded-2xl"><reminder.Icon className="size-5" strokeWidth={1.9} aria-hidden="true" /></span>
              <span className="min-w-0 flex-1">
                <b className="block text-[15px]">{reminder.title}</b>
                <span className="text-[13px] text-white/65">{reminder.message}</span>
              </span>
              <span className="flex gap-2">
                <button type="button" onClick={act} className="btn-logo h-9 rounded-full px-4 text-[13px]">Act</button>
                <button type="button" onClick={() => { setReminder(null); flash("Snoozed for 15 min"); }} className="h-9 rounded-full bg-white/10 px-3.5 text-[13px] hover:bg-white/15">Snooze</button>
                <button type="button" onClick={() => setReminder(null)} className="h-9 rounded-full px-3 text-[13px] text-white/60 hover:text-white">Dismiss</button>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {toast && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="m-0 mt-4 text-center text-[13px] text-[#8fe3ff]" role="status">
              {toast}
            </motion.p>
          )}
        </AnimatePresence>
        <WeekChart />
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        <Panel title="Try it">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setRunning((r) => !r)} className="btn-logo inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm">
              {running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}{running ? "Pause" : "Start"}
            </button>
            <button type="button" onClick={blink} disabled={!tracking} className="btn-logo-outline inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm disabled:opacity-40">
              <Eye className="size-4" aria-hidden="true" />Blink
            </button>
            <button type="button" onClick={() => stepAway(!away)} disabled={!running} aria-pressed={away} className="btn-logo-outline inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm disabled:opacity-40">
              <UserRound className="size-4" aria-hidden="true" />{away ? "Come back" : "Step away"}
            </button>
            <button type="button" onClick={fastForward} disabled={!tracking} className="btn-logo-outline inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm disabled:opacity-40">
              <FastForward className="size-4" aria-hidden="true" />+30 min
            </button>
          </div>
          <label className="mt-3 flex items-center gap-2 text-[14px] text-muted">
            <input type="checkbox" checked={natural} onChange={(e) => setNatural(e.target.checked)} className="accent-[#9e5cff]" />
            Natural blinking
          </label>
        </Panel>

        <Panel title="Turn your head">
          <Slider label="Left / right" value={yaw} onChange={setYaw} min={-60} max={60} suffix="°" disabled={!tracking} />
          <Slider label="Up / down" value={pitch} onChange={setPitch} min={-45} max={45} suffix="°" disabled={!tracking} />
          <p className="m-0 mt-1 text-[13px] text-muted">Within 28° left/right and 24° up/down counts as facing the screen — the same thresholds the app uses.</p>
        </Panel>

        <CheckIn />
        <PulseExperiment disabled={!tracking} />
      </div>
    </div>
  );
}

function Stat({ Icon, label, value, unit, note, small, tone }: { Icon: typeof Eye; label: string; value: string; unit?: string; note?: string; small?: boolean; tone?: "warn" }) {
  return (
    <div className="rounded-[18px] bg-white/[.06] p-3">
      <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-[.08em] text-white/50"><Icon className="size-3.5" aria-hidden="true" />{label}</dt>
      <dd className="m-0 mt-1 flex items-baseline gap-1">
        <motion.span key={value} initial={{ opacity: 0.4, y: 3 }} animate={{ opacity: 1, y: 0 }}
          className={`font-display font-semibold tabular-nums ${small ? "text-[15px]" : "text-[22px]"} ${tone === "warn" ? "text-[#ffb37a]" : ""}`}>
          {value}
        </motion.span>
        {unit && value !== "—" && <span className="text-[11px] text-white/45">{unit}</span>}
      </dd>
      {note && <span className="text-[10.5px] text-white/40">{note}</span>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)]">
      <h3 className="m-0 mb-3 font-display text-[17px] font-semibold tracking-[-.01em]">{title}</h3>
      {children}
    </section>
  );
}

function Slider({ label, value, onChange, min, max, suffix, disabled }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; suffix: string; disabled?: boolean }) {
  return (
    <label className="mb-2 block">
      <span className="flex justify-between text-[14px]"><span>{label}</span><span className="tabular-nums text-muted">{suffix === "°" && value > 0 ? "+" : ""}{value}{suffix}</span></span>
      <input type="range" min={min} max={max} value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-[#9e5cff] disabled:opacity-40" aria-label={label} />
    </label>
  );
}

function CheckIn() {
  const [stress, setStress] = useState(4);
  const [energy, setEnergy] = useState(6);
  const [saved, setSaved] = useState(false);
  return (
    <Panel title="Wellness check-in">
      <Slider label="Stress" value={stress} onChange={(n) => { setStress(n); setSaved(false); }} min={0} max={10} suffix="/10" />
      <Slider label="Energy" value={energy} onChange={(n) => { setEnergy(n); setSaved(false); }} min={0} max={10} suffix="/10" />
      <div className="mt-1 flex items-center gap-3">
        <button type="button" onClick={() => setSaved(true)} className="btn-logo-outline inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm">
          <Smile className="size-4" aria-hidden="true" />Save check-in
        </button>
        <AnimatePresence>
          {saved && (
            <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="rounded-full bg-lavender px-2.5 py-1 text-[12px] text-accent-deep">
              Self-reported · kept on your Mac
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Panel>
  );
}

function PulseExperiment({ disabled }: { disabled: boolean }) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (progress === null || progress >= 1) return;
    const t = setTimeout(() => setProgress((p) => Math.min(1, (p ?? 0) + 0.05)), reduce ? 50 : 1000 / 3);
    return () => clearTimeout(t);
  }, [progress, reduce]);
  useEffect(() => { if (progress !== null && progress >= 1) setDone(true); }, [progress]);
  const C = 2 * Math.PI * 22;
  return (
    <Panel title="Pulse experiment">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 56 56" className="size-14 -rotate-90" aria-hidden="true">
          <circle cx="28" cy="28" r="22" fill="none" stroke="var(--color-line)" strokeWidth="5" />
          <circle cx="28" cy="28" r="22" fill="none" stroke="url(#pulse-g)" strokeWidth="5" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - (progress ?? 0))} style={{ transition: "stroke-dashoffset .3s" }} />
          <defs><linearGradient id="pulse-g"><stop offset="0" stopColor="#3dd1ff" /><stop offset=".5" stopColor="#9e5cff" /><stop offset="1" stopColor="#ff54cc" /></linearGradient></defs>
        </svg>
        <div className="min-w-0 flex-1 text-[14px]">
          {progress === null ? (
            <span className="text-muted">Hold still for 20 seconds while Sense reads tiny colour changes in your skin.</span>
          ) : !done ? (
            <span className="inline-flex items-center gap-2"><HeartPulse className="size-4 text-[#ff54cc]" aria-hidden="true" />Collecting… {Math.round((progress ?? 0) * 100)}%</span>
          ) : (
            <span><b className="font-display text-lg">≈ 72 BPM</b> <span className="text-muted">· simulated example</span></span>
          )}
        </div>
        <button type="button" disabled={disabled || (progress !== null && !done)} onClick={() => { setDone(false); setProgress(0); }}
          className="btn-logo-outline inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm disabled:opacity-40">
          <Zap className="size-4" aria-hidden="true" />{done ? "Again" : "Start"}
        </button>
      </div>
      <p className="m-0 mt-3 text-[12.5px] text-muted">Experimental and not a medical device. On your Mac the estimate can be wrong or rejected when light or movement isn’t right.</p>
    </Panel>
  );
}

const WEEK = [
  { d: "Mon", focus: 5.2, breaks: 6 }, { d: "Tue", focus: 6.1, breaks: 4 }, { d: "Wed", focus: 4.4, breaks: 7 },
  { d: "Thu", focus: 6.8, breaks: 3 }, { d: "Fri", focus: 3.9, breaks: 6 }, { d: "Sat", focus: 1.2, breaks: 2 }, { d: "Sun", focus: 0.8, breaks: 1 },
];

function WeekChart() {
  const reduce = useReducedMotion();
  const [metric, setMetric] = useState<"focus" | "breaks">("focus");
  const max = Math.max(...WEEK.map((w) => w[metric]));
  return (
    <div className="mt-auto pt-6">
      <div className="flex items-center justify-between">
        <span className="text-[12px] uppercase tracking-[.08em] text-white/50">This week · sample data</span>
        <div className="flex rounded-full bg-white/[.06] p-0.5 text-[12px]" role="tablist" aria-label="Chart metric">
          {(["focus", "breaks"] as const).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={metric === m} onClick={() => setMetric(m)}
              className={`rounded-full px-3 py-1 transition ${metric === m ? "bg-white/15 text-white" : "text-white/55 hover:text-white"}`}>
              {m === "focus" ? "Screen time" : "Breaks"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex h-[120px] items-end gap-2" aria-label={`${metric === "focus" ? "Screen time" : "Breaks"} per day, sample data`} role="img">
        {WEEK.map((w, i) => (
          <div key={w.d} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[10.5px] tabular-nums text-white/45">{metric === "focus" ? `${w.focus}h` : w.breaks}</span>
            <motion.div
              className="w-full rounded-t-[8px] rounded-b-[3px] bg-gradient-to-t from-[#5478ff] via-[#9e5cff] to-[#ff54cc]"
              initial={{ height: 0 }}
              whileInView={{ height: `${(w[metric] / max) * 78}%` }}
              animate={{ height: `${(w[metric] / max) * 78}%` }}
              viewport={{ once: true }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18, delay: i * 0.04 }}
            />
            <span className="text-[11px] text-white/50">{w.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
