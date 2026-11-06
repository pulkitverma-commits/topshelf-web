"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { CalendarDays, Eye, Inbox, Music, Pause, SkipBack, SkipForward, Timer, Video } from "lucide-react";
import { DesktopWindow, MacBook, MenuBar } from "@/components/mac/macbook";
import { AlbumArt, Equalizer, FileIcon } from "@/components/topshelf/bits";
import { STINGER_ICONS, Stinger } from "@/components/topshelf/stinger";
import { SectionHeading } from "@/components/ui/motion-primitives";
import { useDelight } from "@/components/delight/delight-provider";
import { useElementWidth } from "@/hooks/use-element-width";
import { MAIN_STINGERS, STINGER_RETRACT, shade, tintHex, type StingerSpec } from "@/lib/stinger";
import { TRACKS } from "@/lib/demo-data";
import { cn, easeOut, spring } from "@/lib/utils";

const SCENES = [
  {
    id: "rest",
    short: "Up top",
    kicker: "Always there",
    title: "It waits quietly up top.",
    body: "TopShelf lives in a slim black bar at the top of your screen. Move the pointer up and it opens; move away and it tucks itself back in.",
    note: "just move up",
    app: "Finder",
    clock: "Wed 9:02",
  },
  {
    id: "music",
    short: "Music",
    kicker: "Now playing",
    title: "Your music, at a glance.",
    body: "Apple Music or Spotify: the cover and a little equaliser sit in the bar while a song plays. Open it to skip, pause or scrub without switching apps.",
    note: "no app switching",
    app: "Pages",
    clock: "Wed 9:40",
  },
  {
    id: "shelf",
    short: "Shelf",
    kicker: "File Shelf",
    title: "Park files on the Shelf.",
    body: "Drag a file to the top of the screen and drop it on the Shelf. It waits there until you drag it out where you need it. In 1.1, hold ⌘ while dragging and it flies there on its own.",
    note: "drop it, grab it later",
    app: "Finder",
    clock: "Wed 11:15",
  },
  {
    id: "meeting",
    short: "Up next",
    kicker: "Calendar",
    title: "Know what's next.",
    body: "Your next meeting and how long until it starts, with a Join button for video calls. One glance, and back to work.",
    note: "join in one click",
    app: "Mail",
    clock: "Wed 10:26",
  },
  {
    id: "break",
    short: "Breaks",
    kicker: "Break reminders",
    title: "Rest your eyes on time.",
    body: "After 20 minutes of active work a heads-up drops down, then a 20-second break asks you to look at something far away. Your eyes will thank you.",
    note: "20 min work, 20 s rest",
    app: "Pages",
    clock: "Wed 14:20",
  },
  {
    id: "win",
    short: "Wins",
    kicker: "New in 1.1",
    title: "Little wins get an entrance.",
    body: "When a timer ends, a meeting is about to start or a goal goes in, a 1.9-second celebration plays, then folds back into a small pill with the details.",
    note: "tea's ready!",
    app: "Finder",
    clock: "Wed 16:00",
  },
] as const;

const N = SCENES.length;
const HEADSUP: StingerSpec = { h: "BREAK SOON!", v: "1:00", beats: 2, tint: "teal", icon: "eye", left: "Break in 1:00", right: "20 s break", name: "Break heads-up" };

/** Scene-local progress (0–1) → whole-tour progress. */
const g = (scene: number, local: number) => (scene + local) / N;

/**
 * A scroll-driven product tour: a pinned Mac whose screen plays one moment of the day
 * per scroll step. Scroll position is the only clock, so nothing moves on its own and
 * visitors control the pace (and can jump with the step list).
 */
export function Tour() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { mark } = useDelight();
  const [scene, setScene] = useState(0);
  const [late, setLate] = useState(false);
  const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const seen = useRef(new Set<number>());
  useMotionValueEvent(p, "change", (v) => {
    const f = Math.min(N - 0.0001, Math.max(0, v * N));
    const s = Math.floor(f);
    setScene(s);
    setLate(f - s > 0.42);
    // Counts as watched only if most scenes were actually on screen on the way down.
    if (v > 0 && v < 1) seen.current.add(s);
    if (v > 0.97 && seen.current.size >= N - 1) mark("tour", null);
  });

  const jump = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + total * ((i + 0.55) / N);
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  const s = SCENES[scene];
  const rail = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <section id="tour" aria-labelledby="tour-title" className="relative">
      <div className="mx-auto max-w-[1200px] px-4 pt-20 sm:px-8 sm:pt-[120px]">
        <SectionHeading id="tour-title" kicker="Product tour">
          One day with TopShelf. <b>Just keep scrolling.</b>
        </SectionHeading>
        <a href="#features" className="mt-4 inline-block text-sm text-muted underline decoration-line-strong underline-offset-4 hover:text-ink">
          Skip the tour
        </a>
      </div>

      <div ref={sectionRef} style={{ height: `${N * 85}svh` }} className="relative">
        <div className="sticky top-[68px] flex h-[calc(100svh-68px)] items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-[1200px] items-center gap-5 px-4 sm:px-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
            {/* Words */}
            <div className="order-2 flex flex-col gap-4 lg:order-1">
              <div className="flex items-center gap-3">
                <span className="font-display text-sm tabular-nums text-muted">
                  <b className="text-ink">{String(scene + 1).padStart(2, "0")}</b> / {String(N).padStart(2, "0")}
                </span>
                <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
                  <motion.span style={{ width: rail }} className="absolute inset-y-0 left-0 rounded-full bg-ink" />
                </div>
              </div>
              <div className="relative min-h-[178px] sm:min-h-[200px]" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: easeOut }}>
                    <p className="m-0 text-[13px] uppercase tracking-[.08em] text-muted">{s.kicker}</p>
                    <h3 className="m-0 mt-2 text-balance font-display text-[clamp(26px,3.2vw,42px)] font-semibold leading-[1.05] tracking-[-.035em]">{s.title}</h3>
                    <p className="m-0 mt-3 max-w-[480px] text-pretty text-[16px] text-muted sm:text-[17px]">{s.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label="Tour steps">
                {SCENES.map((sc, i) => (
                  <li key={sc.id}>
                    <button
                      type="button"
                      onClick={() => jump(i)}
                      aria-current={i === scene ? "step" : undefined}
                      className={cn(
                        "h-9 rounded-full px-3.5 text-[13px] transition-[background-color,color,box-shadow] duration-300",
                        i === scene ? "bg-ink text-white" : i < scene ? "bg-white text-ink shadow-[inset_0_0_0_1px_var(--color-line)]" : "text-muted shadow-[inset_0_0_0_1px_var(--color-line)] hover:text-ink",
                      )}
                    >
                      {sc.short}
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            {/* Mac */}
            <div className="relative order-1 lg:order-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={s.note}
                  aria-hidden="true"
                  initial={{ opacity: 0, y: 6, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: 3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: easeOut }}
                  className="absolute -top-10 right-2 z-10 hidden whitespace-nowrap font-hand text-[26px] lg:block"
                >
                  {s.note}
                </motion.span>
              </AnimatePresence>
              <MacBook className="w-full max-w-[820px]" screenClassName="max-sm:aspect-auto max-sm:h-[min(250px,34svh)]">
                <TourScreen p={p} scene={scene} late={late} />
              </MacBook>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TourScreen({ p, scene, late }: { p: MotionValue<number>; scene: number; late: boolean }) {
  const [ref, W] = useElementWidth<HTMLDivElement>();
  const sc = SCENES[scene];
  const small = W < 520;

  // Bar size per moment.
  const open = { w: Math.min(560, W * (small ? 0.9 : 0.62)), h: small ? 150 : Math.min(230, W * 0.3), r: small ? 22 : 30 };
  const pill = { w: Math.min(220, W * 0.32), h: small ? 24 : 30, r: small ? 10 : 14 };
  const wide = { w: Math.min(300, W * 0.46), h: small ? 24 : 30, r: small ? 10 : 14 };
  const banner = { w: Math.min(480, W * 0.8), h: small ? 70 : 80, r: 22 };
  let bar = pill;
  let view: "pill" | "overview" | "music-pill" | "music" | "shelf" | "meeting-pill" | "meeting" | "headsup" | "break" | "win" = "pill";
  if (scene === 0) view = late ? "overview" : "pill";
  if (scene === 1) view = late ? "music" : "music-pill";
  if (scene === 2) view = "shelf";
  if (scene === 3) view = late ? "meeting" : "meeting-pill";
  if (scene === 4) view = late ? "break" : "headsup";
  if (scene === 5) view = "win";
  if (view === "overview" || view === "music" || view === "shelf" || view === "meeting") bar = open;
  if (view === "music-pill" || view === "meeting-pill") bar = wide;
  if (view === "headsup" || view === "win") bar = banner;

  // Celebration replays each time scene 6 is entered.
  const [run, setRun] = useState(0);
  const [winPhase, setWinPhase] = useState<"drop" | "pill">("drop");
  useEffect(() => {
    if (scene !== 5 && scene !== 4) return;
    setRun((r) => r + 1);
    setWinPhase("drop");
    const id = window.setTimeout(() => setWinPhase("pill"), STINGER_RETRACT * 1000);
    return () => window.clearTimeout(id);
  }, [scene]);
  const winBar = winPhase === "pill" ? { ...banner, h: small ? 28 : 34, r: 15 } : banner;
  if (view === "win" || view === "headsup") bar = winBar;

  // Pointer path, in % of the screen, scrubbed by scroll.
  const stops = [0, g(0, 0.1), g(0, 0.4), g(1, 0.25), g(1, 0.48), g(1, 0.75), g(2, 0.1), g(2, 0.22), g(2, 0.6), g(2, 0.85), g(3, 0.4), g(3, 0.7), g(4, 0.1), 1];
  const xs = [64, 64, 50.5, 50.5, 50.5, 49, 88, 88, 52, 60, 52, small ? 74 : 63, 66, 66];
  const ys = [70, 70, 4, 4, 4, small ? 58 : 46, 28, 28, 14, 62, 3, small ? 66 : 50, 60, 60];
  const cx = useTransform(p, stops, xs);
  const cy = useTransform(p, stops, ys);
  const cOpacity = useTransform(p, [0, g(4, 0.05), g(4, 0.12), 1], [1, 1, 0, 0]);
  const left = useMotionTemplate`${cx}%`;
  const top = useMotionTemplate`${cy}%`;

  // The file that rides along with the pointer in scene 3.
  const fOpacity = useTransform(p, [g(2, 0.2), g(2, 0.22), g(2, 0.58), g(2, 0.62)], [0, 1, 1, 0]);
  const dropped = useTransform(p, (v) => v > g(2, 0.6));
  const [hasFile, setHasFile] = useState(false);
  useMotionValueEvent(dropped, "change", (v) => setHasFile(v));

  // Music progress and break countdown follow scroll too.
  const music = useTransform(p, [g(1, 0), g(2, 0)], [22, 58]);
  const musicW = useMotionTemplate`${music}%`;
  const breakLeft = useTransform(p, [g(4, 0.42), g(5, 0)], [20, 0]);
  const breakText = useTransform(breakLeft, (v) => `0:${String(Math.ceil(v)).padStart(2, "0")}`);
  const ringC = 2 * Math.PI * 26;
  const breakDash = useTransform(breakLeft, [20, 0], [0, ringC]);

  const spec = view === "headsup" ? HEADSUP : view === "win" ? MAIN_STINGERS.timer : null;
  const tint = spec ? tintHex(spec.tint) : "#fff";
  const SpecIcon = spec ? STINGER_ICONS[spec.icon] : Timer;
  const track = TRACKS[0];

  return (
    <div ref={ref} className="absolute inset-0">
      <MenuBar size="sm" app={sc.app} clock={sc.clock} />
      <DesktopWindow animated={scene === 1 || scene === 4} className="left-[8%] top-[22%] h-[56%] w-[44%]" />

      {/* Desktop files (scene 3) */}
      <AnimatePresence>
        {scene === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute right-[5%] top-[20%] z-[3] flex flex-col items-center gap-3" aria-hidden="true">
            <motion.span animate={{ opacity: hasFile ? 0.25 : 1 }} className="flex flex-col items-center gap-1 text-[10px] text-ink/80 sm:text-[11px]">
              <FileIcon kind="pdf" className="h-8 w-6 sm:h-10 sm:w-8" />
              <span className="hidden sm:block">Brief_v3.pdf</span>
            </motion.span>
            <span className="flex flex-col items-center gap-1 text-[10px] text-ink/80 sm:text-[11px]">
              <FileIcon kind="zip" className="h-8 w-6 sm:h-10 sm:w-8" />
              <span className="hidden sm:block">Assets.zip</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen break (scene 5, second half) */}
      <AnimatePresence>
        {view === "break" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 z-[20] overflow-hidden text-white" aria-hidden="true">
            <div className="bs-bg !absolute" data-bg="gradient" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center sm:gap-3">
              <span className="relative grid size-14 place-items-center sm:size-20">
                <svg viewBox="0 0 60 60" className="absolute inset-0 size-full -rotate-90">
                  <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="4" />
                  <motion.circle cx="30" cy="30" r="26" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeDasharray={ringC} style={{ strokeDashoffset: breakDash }} />
                </svg>
                <motion.span className="font-display text-[13px] font-semibold tabular-nums sm:text-base">{breakText}</motion.span>
              </span>
              <b className="font-display text-[15px] font-semibold sm:text-2xl">Time for a short break</b>
              <span className="max-w-[34ch] text-[11.5px] text-white/80 sm:text-sm">Rest your eyes on something at least 20 feet away.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center" aria-hidden="true">
        {W > 0 && (
          <motion.div
            initial={false}
            animate={{ width: bar.w, height: bar.h, borderBottomLeftRadius: bar.r, borderBottomRightRadius: bar.r, opacity: view === "break" ? 0 : 1 }}
            transition={spring}
            className="relative overflow-hidden bg-black text-white shadow-[0_30px_60px_-28px_rgba(0,0,0,.65)]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={view === "headsup" || view === "win" ? `${view}-${winPhase}` : view}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.14, duration: 0.3, ease: easeOut } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="absolute inset-0"
              >
                {view === "pill" && <span className="absolute left-1/2 top-[38%] size-1.5 -translate-x-1/2 rounded-full bg-[#1d2235]" />}
                {view === "music-pill" && (
                  <div className="flex h-full items-center justify-between px-2.5">
                    <AlbumArt art={track.art} className="size-4 rounded-[5px] sm:size-5" />
                    <Equalizer />
                  </div>
                )}
                {view === "meeting-pill" && (
                  <div className="flex h-full items-center justify-between gap-2 px-3 text-[10px] sm:text-[11.5px]">
                    <CalendarDays className="size-3.5 text-[#FFB86B]" />
                    <span className="tabular-nums text-white/80">in 4 min</span>
                  </div>
                )}
                {view === "overview" && <Overview small={small} />}
                {view === "music" && (
                  <div className="flex h-full flex-col justify-center gap-2 px-4 sm:gap-3 sm:px-6">
                    <div className="flex items-center gap-3">
                      <AlbumArt art={track.art} className="size-10 flex-none rounded-lg sm:size-16 sm:rounded-xl" />
                      <div className="min-w-0 text-left">
                        <b className="block truncate font-display text-[13px] font-semibold sm:text-lg">{track.title}</b>
                        <span className="block truncate text-[11px] text-white/60 sm:text-[13px]">{track.artist}</span>
                      </div>
                      <Equalizer className="ml-auto" />
                    </div>
                    <div className="h-1 overflow-hidden rounded bg-white/20">
                      <motion.div className="h-full rounded bg-white" style={{ width: musicW }} />
                    </div>
                    <div className="flex items-center justify-center gap-4 sm:gap-6">
                      <SkipBack className="size-4 sm:size-5" />
                      <span className="grid size-8 place-items-center rounded-full bg-white text-black sm:size-11">
                        <Pause className="size-4 sm:size-5" fill="currentColor" />
                      </span>
                      <SkipForward className="size-4 sm:size-5" />
                    </div>
                  </div>
                )}
                {view === "shelf" && (
                  <div className="flex h-full flex-col gap-2 px-3 pb-3 pt-2.5 sm:px-5 sm:pb-4 sm:pt-3.5">
                    <span className="flex items-center gap-1.5 text-left text-[11px] text-white/60 sm:text-[13px]">
                      <Inbox className="size-3.5" /> Shelf
                    </span>
                    <div className={cn("flex flex-1 flex-wrap content-start gap-1.5 rounded-xl border-[1.5px] border-dashed p-2 transition-colors duration-300 sm:gap-2 sm:rounded-2xl", !hasFile && late ? "border-accent bg-accent/20" : "border-white/25")}>
                      <ShelfChip kind="img" name="Moodboard.png" />
                      <AnimatePresence>{hasFile && <ShelfChip key="brief" kind="pdf" name="Brief_v3.pdf" pop />}</AnimatePresence>
                    </div>
                  </div>
                )}
                {view === "meeting" && (
                  <div className="flex h-full flex-col justify-center gap-1 px-4 text-left sm:px-6">
                    <span className="text-[11px] text-[#FFB86B] sm:text-[13px]">In 4 min · 10:30 – 11:00</span>
                    <b className="font-display text-[15px] font-semibold sm:text-2xl">Design review</b>
                    <span className="text-[11px] text-white/60 sm:text-[13px]">Video call · 4 guests</span>
                    <span className="mt-1.5 inline-flex h-7 items-center gap-1.5 self-end rounded-full bg-[#2FBF9B] px-3 text-[11px] font-medium text-[#04241b] sm:mt-2 sm:h-9 sm:px-4 sm:text-[13px]">
                      <Video className="size-3.5" /> Join
                    </span>
                  </div>
                )}
                {(view === "headsup" || view === "win") && spec && (
                  <div className={cn("absolute inset-x-0 top-0 z-[2] flex h-[28px] items-center gap-2 whitespace-nowrap px-4 text-[11px] transition-opacity duration-300 sm:h-[34px] sm:text-[12.5px]", winPhase === "pill" ? "opacity-100" : "opacity-0")}>
                    <SpecIcon className="size-[14px] flex-none" style={{ color: shade(tint, 0.25) }} strokeWidth={2} />
                    <span className="truncate">{spec.left}</span>
                    <span className="ml-auto font-semibold" style={{ color: shade(tint, 0.25) }}>
                      {spec.right}
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            {(view === "headsup" || view === "win") && <Stinger spec={spec} run={run} width={bar.w} rowTop={small ? 12 : 17} />}
          </motion.div>
        )}
      </div>

      {/* Flying file */}
      <motion.div style={{ left, top, opacity: fOpacity }} className="pointer-events-none absolute z-[35] -translate-x-1/2 -translate-y-1/3 rotate-[-6deg]" aria-hidden="true">
        <FileIcon kind="pdf" className="h-8 w-6 drop-shadow-[0_10px_14px_rgba(0,0,0,.3)] sm:h-11 sm:w-9" />
      </motion.div>

      {/* Pointer */}
      <motion.svg style={{ left, top, opacity: cOpacity }} viewBox="0 0 24 24" className="pointer-events-none absolute z-[40] size-4 drop-shadow-[0_2px_3px_rgba(0,0,0,.35)] sm:size-6" aria-hidden="true">
        <path d="M5 3l14 8-6 1.6L10 19z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" />
      </motion.svg>
    </div>
  );
}

function ShelfChip({ kind, name, pop = false }: { kind: "img" | "pdf"; name: string; pop?: boolean }) {
  return (
    <motion.span
      initial={pop ? { opacity: 0, scale: 0.4, y: -14 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ type: "spring", stiffness: 480, damping: 22 }}
      className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-white/10 pl-1.5 pr-2.5 text-[10.5px] sm:h-10 sm:rounded-xl sm:text-[13px]"
    >
      <FileIcon kind={kind} className="h-5 w-4 sm:h-7 sm:w-[22px]" />
      {name}
    </motion.span>
  );
}

function Overview({ small }: { small: boolean }) {
  const items = [
    { Icon: Inbox, label: "Shelf", c: "#A9B3FF" },
    { Icon: Music, label: "Music", c: "#FF7A9A" },
    { Icon: CalendarDays, label: "Calendar", c: "#FFB86B" },
    { Icon: Timer, label: "Timers", c: "#7EE8CC" },
    { Icon: Eye, label: "Breaks", c: "#2FBF9B" },
  ];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-3 sm:gap-4">
      <span className="text-[11px] text-white/55 sm:text-[13px]">Good morning. Everything's up here.</span>
      <div className="flex w-full max-w-[460px] gap-1.5 sm:gap-2.5">
        {items.map(({ Icon, label, c }, i) => (
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 12, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.07, type: "spring", stiffness: 420, damping: 22 }}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl bg-white/[.07] py-2 sm:gap-1.5 sm:rounded-2xl sm:py-3"
          >
            <Icon className="size-4 sm:size-6" style={{ color: c }} strokeWidth={1.8} />
            <span className={cn("max-w-full truncate px-0.5 text-white/80", small ? "text-[9.5px]" : "text-[11.5px]")}>{label}</span>
          </motion.span>
        ))}
      </div>
    </div>
  );
}

