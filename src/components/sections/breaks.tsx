"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarClock, Coffee, Eye, Keyboard, Phone, PhoneOff, ShieldCheck, Timer } from "lucide-react";
import { DIFF_NOTE, WEEK, WORK, useApp, type BreakBg, type Difficulty } from "@/components/app-provider";
import { Stinger } from "@/components/topshelf/stinger";
import { useElementWidth } from "@/hooks/use-element-width";
import { Reveal, SectionHeading, Segmented } from "@/components/ui/motion-primitives";
import { Button } from "@/components/ui/primitives";
import { STINGER_RETRACT, type StingerSpec } from "@/lib/stinger";
import { cn, formatTime, spring } from "@/lib/utils";

const HEADSUP: StingerSpec = { h: "BREAK SOON!", v: "1:00", beats: 2, tint: "teal", icon: "eye", left: "Break in 1:00", right: "20 s break", name: "Break heads-up" };

/** Headline feature: break reminders, with a working heads-up, countdown and full-screen break. */
export function Breaks() {
  const app = useApp();
  const [headsup, setHeadsup] = useState(false);
  const [run, setRun] = useState(0);
  const [note, setNote] = useState<{ id: number; text: string } | null>(null);
  const firstHu = useRef<HTMLButtonElement>(null);
  const [stageRef, stageWidth] = useElementWidth<HTMLDivElement>();

  useEffect(() => {
    if (app.lastOutcome) setNote({ id: app.lastOutcome.id, text: app.lastOutcome.text });
  }, [app.lastOutcome]);

  const showHeadsup = (kb: boolean) => {
    if (app.onCall) {
      setNote((n) => ({ id: (n?.id ?? 0) + 1, text: "Smart Pause: the break waits for your call." }));
      return;
    }
    app.setLeft(60);
    setHeadsup(true);
    if (app.alertStyle === "stinger") setRun((r) => r + 1);
    app.playSound();
    if (kb) window.setTimeout(() => firstHu.current?.focus(), 80);
  };
  const answer = (v: "now" | "1" | "5" | "15" | "skip", el: HTMLElement) => {
    setHeadsup(false);
    if (v === "now") app.startBreak(undefined, el.closest("section")?.querySelector<HTMLElement>("[data-headsup-btn]") ?? null);
    else if (v === "skip") {
      app.skipNext();
      setNote((n) => ({ id: (n?.id ?? 0) + 1, text: "Break skipped. Next in 20 minutes." }));
    } else {
      app.setLeft(Number(v) * 60);
      setNote((n) => ({ id: (n?.id ?? 0) + 1, text: `Break delayed ${v} min.` }));
    }
  };

  const ringC = 2 * Math.PI * 22;
  const nextLabel = app.onCall ? "Smart Pause · on a call" : `Next: ${app.nextKind} break · active time only`;
  const barW = Math.min(520, (stageWidth || 520) - 24);

  return (
    <section id="breaks" aria-labelledby="breaks-title" className="py-24 sm:pb-[140px] sm:pt-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <SectionHeading id="breaks-title" kicker="Break reminders">
          Work in a healthy rhythm. <b>Rest on time.</b>
        </SectionHeading>
        <Reveal>
          <p className="m-0 mt-5 max-w-[640px] text-pretty text-[17px] text-muted">
            By default, 20 minutes of work, then a 20-second break, and a 5-minute long break every third time. All adjustable, and only active time counts.
          </p>
        </Reveal>

        <div className="mt-12 grid items-start gap-6 min-[901px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <Reveal className="rounded-[32px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-6">
            <div ref={stageRef} className="relative h-[260px] overflow-hidden rounded-3xl bg-mint">
              <motion.div
                initial={false}
                animate={{ width: headsup ? barW : 300, height: headsup ? 132 : 52, borderBottomLeftRadius: headsup ? 28 : 22, borderBottomRightRadius: headsup ? 28 : 22 }}
                transition={spring}
                className="absolute left-1/2 top-0 max-w-[calc(100%-24px)] -translate-x-1/2 overflow-hidden bg-black text-white shadow-[0_30px_60px_-24px_rgba(0,0,0,.6)]"
              >
                <div className="absolute inset-x-0 top-0 flex h-[52px] items-center gap-3 px-4">
                  <svg viewBox="0 0 52 52" className="size-8 flex-none -rotate-90" aria-hidden="true">
                    <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="4" />
                    <circle cx="26" cy="26" r="22" fill="none" stroke="#2FBF9B" strokeWidth="4" strokeLinecap="round" strokeDasharray={ringC} strokeDashoffset={ringC * (1 - app.left / WORK)} />
                  </svg>
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="font-display text-[15px] font-semibold tabular-nums">{app.onCall ? "Paused" : formatTime(app.left)}</span>
                    <span className="truncate text-[11.5px] text-white/55">{nextLabel}</span>
                  </span>
                  <Eye className="size-4 text-[#7EE8CC]" aria-hidden="true" />
                </div>
                <AnimatePresence>
                  {headsup && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: app.alertStyle === "stinger" ? STINGER_RETRACT : 0.15 } }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      className="absolute inset-x-0 top-[52px] flex flex-wrap items-center gap-x-3 gap-y-2 px-4 pb-3"
                    >
                      <span className="flex flex-col leading-tight">
                        <b className="font-display text-[15px] font-semibold">Break in 1 min</b>
                        <small className="text-xs text-white/60">{app.nextKind === "long" ? "5 min long break" : "20 s to rest your eyes"}</small>
                      </span>
                      <span className="ml-auto flex flex-wrap gap-1.5">
                        {(
                          [
                            ["now", "Start now"],
                            ["1", "1 min"],
                            ["5", "5 min"],
                            ["15", "15 min"],
                            ["skip", "Skip"],
                          ] as const
                        ).map(([v, label], i) => (
                          <button
                            key={v}
                            ref={i === 0 ? firstHu : undefined}
                            type="button"
                            onClick={(e) => answer(v, e.currentTarget)}
                            className={cn("h-8 rounded-full px-3 text-[12.5px] transition-colors", i === 0 ? "bg-[#2FBF9B] font-medium text-[#04241b] hover:bg-[#5fd3b7]" : "bg-white/10 text-white/85 hover:bg-white/[.18]")}
                          >
                            {label}
                          </button>
                        ))}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Stinger spec={headsup ? HEADSUP : null} run={headsup ? run : 0} width={barW} rowTop={70} />
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-4 pb-5 text-center">
                <AnimatePresence mode="wait">
                  {note && (
                    <motion.p key={note.id} role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="m-0 rounded-full bg-white px-4 py-2 text-sm shadow-[0_10px_26px_-16px_rgba(0,0,0,.35)]">
                      {note.text}
                    </motion.p>
                  )}
                </AnimatePresence>
                <span className="font-hand text-xl text-ink/70">try the three steps</span>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
                <legend className="mb-2.5 p-0 text-[13px] uppercase tracking-[.08em] text-muted">Skipping</legend>
                <Segmented<Difficulty>
                  id="difficulty"
                  label="Skip difficulty"
                  value={app.difficulty}
                  onChange={app.setDifficulty}
                  options={[
                    { value: "casual", label: "Casual" },
                    { value: "balanced", label: "Balanced" },
                    { value: "hardcore", label: "Hardcore" },
                  ]}
                />
                <p className="m-0 min-h-[2.8em] text-[14px] text-muted" aria-live="polite">
                  {DIFF_NOTE[app.difficulty]}
                </p>
              </fieldset>
              <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
                <legend className="mb-2.5 p-0 text-[13px] uppercase tracking-[.08em] text-muted">Background</legend>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      ["gradient", "Drifting gradient"],
                      ["desktop", "Blurred desktop"],
                    ] as [BreakBg, string][]
                  ).map(([v, label]) => (
                    <button key={v} type="button" aria-pressed={app.bg === v} onClick={() => app.setBg(v)} className={cn("h-10 rounded-full px-4 text-sm transition-colors", app.bg === v ? "bg-ink text-white" : "bg-white shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:bg-[#fafafa]")}>
                      {label}
                    </button>
                  ))}
                  <label className={cn("relative inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-sm transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent", app.bg === "image" ? "bg-ink text-white" : "bg-white shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:bg-[#fafafa]")}>
                    Your image
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute size-px opacity-0"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        app.setImage(URL.createObjectURL(f));
                        app.setBg("image");
                      }}
                    />
                  </label>
                </div>
                <p className="m-0 text-[14px] text-muted">Your image stays in your browser.</p>
              </fieldset>
            </div>
          </Reveal>

          <ol className="m-0 flex list-none flex-col gap-3 p-0">
            {[
              {
                n: "1",
                title: "A gentle heads-up",
                body: "A minute before a break, TopShelf asks: start now, delay 1, 5 or 15 minutes, or skip.",
                action: (
                  <Button data-headsup-btn onClick={(e) => showHeadsup(e.detail === 0)}>
                    Show the heads-up
                  </Button>
                ),
              },
              {
                n: "2",
                title: "“Break in 7…”",
                body: "For the last 10 seconds, a small countdown follows your pointer, with optional soft ticks.",
                action: <Button onClick={(e) => app.startPill(e.currentTarget)}>Start the countdown</Button>,
              },
              {
                n: "3",
                title: "A beautiful pause",
                body: "A full-screen break on every display: drifting gradients with film grain, your blurred desktop or your own image, an eye exercise or stretch and water illustrations, a big countdown and today's stats. Then focus goes back to your app.",
                action: (
                  <span className="flex flex-wrap gap-2">
                    <Button variant="dark" onClick={(e) => app.startBreak("short", e.currentTarget)}>
                      <Eye className="size-4" strokeWidth={1.8} aria-hidden="true" />
                      Take a 20-second break
                    </Button>
                    <Button onClick={(e) => app.startBreak("long", e.currentTarget)}>
                      <Coffee className="size-4" strokeWidth={1.8} aria-hidden="true" />
                      See a long break
                    </Button>
                  </span>
                ),
              },
            ].map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.06} className="flex flex-col gap-3 rounded-[26px] bg-white p-6 shadow-[inset_0_0_0_1px_var(--color-line)]">
                <span className="grid size-8 place-items-center rounded-full bg-mint font-display text-sm font-semibold text-[#0f5a44]">{s.n}</span>
                <h3 className="m-0 font-display text-2xl font-semibold tracking-[-.025em]">{s.title}</h3>
                <p className="m-0 text-[15.5px] text-muted">{s.body}</p>
                <div>{s.action}</div>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal className="flex flex-col gap-3 rounded-[26px] bg-white p-6 shadow-[inset_0_0_0_1px_var(--color-line)]">
            <Phone className="size-6 text-accent" strokeWidth={1.6} aria-hidden="true" />
            <h3 className="m-0 font-display text-[22px] font-semibold tracking-[-.025em]">Smart Pause</h3>
            <p className="m-0 text-[15px] text-muted">Waits while you type or drag, and holds during calls, video, full-screen apps and focus apps you choose. Stepping away counts as a break.</p>
            <div>
              <Button aria-pressed={app.onCall} onClick={() => app.setOnCall(!app.onCall)}>
                {app.onCall ? <PhoneOff className="size-4" aria-hidden="true" /> : <Phone className="size-4" aria-hidden="true" />}
                {app.onCall ? "End the call" : "Join a call"}
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.05} className="flex flex-col gap-3 rounded-[26px] bg-white p-6 shadow-[inset_0_0_0_1px_var(--color-line)]">
            <CalendarClock className="size-6 text-accent" strokeWidth={1.6} aria-hidden="true" />
            <h3 className="m-0 font-display text-[22px] font-semibold tracking-[-.025em]">Your schedule</h3>
            <p className="m-0 text-[15px] text-muted">Office hours, planned breaks like lunch or a walk, Shortcut and AppleScript automations, and an optional display sleep on long breaks.</p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-3 rounded-[26px] bg-white p-6 shadow-[inset_0_0_0_1px_var(--color-line)]">
            <ShieldCheck className="size-6 text-accent" strokeWidth={1.6} aria-hidden="true" />
            <h3 className="m-0 font-display text-[22px] font-semibold tracking-[-.025em]">Casual, Balanced or Hardcore</h3>
            <p className="m-0 text-[15px] text-muted">Choose how easy skipping is. Postpone, “I'm rested”, and an emergency press-and-hold exit for when you really need it.</p>
          </Reveal>
          <Reveal delay={0.15} className="flex flex-col gap-3 rounded-[26px] bg-white p-6 shadow-[inset_0_0_0_1px_var(--color-line)]">
            <Keyboard className="size-6 text-accent" strokeWidth={1.6} aria-hidden="true" />
            <h3 className="m-0 font-display text-[22px] font-semibold tracking-[-.025em]">Menu bar & shortcuts</h3>
            <p className="m-0 text-[15px] text-muted">Status and controls in the menu bar, with an optional minutes-left label, plus global shortcuts.</p>
          </Reveal>
          <Reveal className="grid gap-6 rounded-[26px] bg-[#1C1C1E] p-6 text-white sm:col-span-2 lg:col-span-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
            <div className="flex flex-col gap-3">
              <Timer className="size-6 text-accent-soft" strokeWidth={1.6} aria-hidden="true" />
              <h3 className="m-0 font-display text-[26px] font-semibold tracking-[-.025em]">Daily stats and a Screen Score</h3>
              <p className="m-0 text-[15px] text-white/65">Screen time, breaks taken and skipped, your longest and typical session, top apps, and a 0–100 Screen Score with a 7-day view. Stats stay on your Mac.</p>
            </div>
            <div className="grid gap-4 rounded-[20px] bg-white/[.06] p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end" aria-label="Example statistics">
              <div>
                <b className="block font-display text-[60px] font-semibold leading-none tracking-[-.04em] tabular-nums">{app.score}</b>
                <span className="text-xs uppercase tracking-[.08em] text-white/55">Screen Score</span>
              </div>
              <div className="flex h-16 items-end gap-1.5" role="img" aria-label={`Screen Score, last 7 days: ${[...WEEK, app.score].join(", ")}`}>
                {[...WEEK, app.score].map((v, i) => (
                  <i key={i} className={cn("block flex-1 rounded-t-[4px]", i === 6 ? "bg-[#2FBF9B]" : "bg-[#2FBF9B]/40")} style={{ height: `${v}%` }} />
                ))}
              </div>
              <dl className="m-0 grid gap-x-6 gap-y-2 text-sm sm:col-span-2 sm:grid-cols-2">
                {[
                  ["Screen time", "3 h 41 min"],
                  ["Breaks", `${app.taken} taken · ${app.skipped} skipped`],
                  ["Longest session", "52 min"],
                  ["Typical session", "21 min"],
                  ["Top apps", "Xcode · Safari · Mail"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-t border-white/10 pt-2">
                    <dt className="text-white/55">{k}</dt>
                    <dd className="m-0 text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="m-0 text-xs text-white/40 sm:col-span-2">Example day.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
