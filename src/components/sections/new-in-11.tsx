"use client";

import { useDelight } from "@/components/delight/delight-provider";
import { GuideNote, Tilt } from "@/components/delight/interactive";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Bell, Clock, Command, Download, MousePointer2, Timer } from "lucide-react";
import { NEXT_UPDATE } from "@/lib/pages";
import { EXTRA_PAGES, FEATURE_META } from "@/lib/feature-meta";
import { useApp, type AlertStyle } from "@/components/app-provider";
import { MenuBar, Wallpaper } from "@/components/mac/macbook";
import { STINGER_ICONS, Stinger } from "@/components/topshelf/stinger";
import { FileIcon } from "@/components/topshelf/bits";
import { Reveal, SectionHeading, Segmented } from "@/components/ui/motion-primitives";
import { Button } from "@/components/ui/primitives";
import { useElementWidth } from "@/hooks/use-element-width";
import { ALL_STINGERS, MAIN_STINGERS, STINGER_DURATION, STINGER_RETRACT, shade, tintHex, type StingerSpec } from "@/lib/stinger";
import type { SoundMode } from "@/lib/audio";
import { cn, spring } from "@/lib/utils";

export function SoonTag({ className, children = "New in 1.1" }: { className?: string; children?: string }) {
  return <span className={cn("inline-flex h-6 items-center whitespace-nowrap rounded-full bg-lavender px-2.5 text-xs normal-case tracking-normal text-accent-deep", className)}>{children}</span>;
}

/** The Celebration alert showcase, at real speed. */
function Celebration() {
  const app = useApp();
  const [stageRef, stageW] = useElementWidth<HTMLDivElement>();
  const [spec, setSpec] = useState<StingerSpec | null>(null);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<"idle" | "drop" | "pill">("idle");
  const [flash, setFlash] = useState(0);
  const [live, setLive] = useState("");
  const [playing, setPlaying] = useState<string | null>(null);
  const playTimer = useRef<number | undefined>(undefined);
  const timers = useRef<number[]>([]);
  const barW = Math.min(480, (stageW || 480) - 20);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const { mark } = useDelight();
  const play = (s: StingerSpec) => {
    mark("x-celebration", stageRef.current);
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setSpec(s);
    const sting = app.alertStyle === "stinger";
    setPhase(sting ? "drop" : "pill");
    if (sting) {
      setRun((r) => r + 1);
      timers.current.push(window.setTimeout(() => setPhase("pill"), STINGER_RETRACT * 1000));
    } else if (app.alertStyle === "flash") setFlash((f) => f + 1);
    app.playSound();
    timers.current.push(window.setTimeout(() => setPhase("idle"), (sting ? STINGER_DURATION * 1000 : 0) + 2600));
    setLive(`${sting ? `${s.h} ` : ""}${s.left}, ${s.right}`);
  };

  const size = phase === "idle" ? { w: 170, h: 28, r: 10 } : phase === "drop" ? { w: barW, h: 80, r: 22 } : { w: barW, h: 34, r: 15 };
  const tint = spec ? tintHex(spec.tint) : "#fff";
  const Icon = spec ? STINGER_ICONS[spec.icon] : Bell;

  return (
    <Reveal className="grid gap-[clamp(24px,4vw,56px)] rounded-[32px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-[clamp(20px,3vw,40px)] min-[901px]:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
      <div className="flex flex-col gap-4 p-1">
        <p className="m-0 flex flex-wrap items-center gap-2 text-[13px] uppercase tracking-[.08em] text-muted">
          Celebration alerts <SoonTag>New in 1.1</SoonTag>
        </p>
        <h3 className="m-0 text-balance font-display text-[clamp(28px,2.8vw,38px)] font-semibold leading-[1.08] tracking-[-.03em]">Time&apos;s up? Make it an entrance.</h3>
        <p className="m-0 text-pretty text-[17px] text-muted">
          When an alarm, timer, meeting, reminder, goal or new message arrives, TopShelf plays a short broadcast-style stinger. The pill drops below the camera into a wide banner, a colour panel wipes across, the icon drives in, a bold headline slams down with a few sparkles and a scoreboard chip rolls in its value. Then it folds back into the pill with the details. All in 1.9 seconds.
        </p>
        <p className="m-0 text-pretty text-[15px] text-muted">
          Alarms punch the headline twice. Routine events like a file added, something copied, a new track or a device connecting stay quiet. Choose Celebration, Colour flash or None in Settings › Appearance › Alert animation. Reduce Motion turns it into a short fade.
        </p>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        <div ref={stageRef} className="relative h-[220px] overflow-hidden rounded-3xl">
          <Wallpaper />
          <MenuBar size="sm" clock="Wed 9:41" />
          <motion.div
            initial={false}
            animate={{ width: size.w, height: size.h, borderBottomLeftRadius: size.r, borderBottomRightRadius: size.r }}
            transition={spring}
            className={cn("absolute left-1/2 top-0 z-[6] -translate-x-1/2 overflow-hidden bg-black text-white shadow-[0_24px_50px_-24px_rgba(0,0,0,.7)]", flash > 0 && (spec?.beats === 2 ? "flood2" : "flood1"))}
            key={`bar-${flash}`}
            style={{ "--fx-c": tint } as React.CSSProperties}
            aria-hidden="true"
          >
            <span className="fx-layer" />
            <div className={cn("absolute inset-x-0 top-0 z-[2] flex h-[34px] items-center gap-2 whitespace-nowrap px-4 text-[12.5px] transition-opacity duration-300", phase === "idle" ? "opacity-0" : "opacity-100 delay-150")}>
              <Icon className="size-[15px] flex-none" style={{ color: shade(tint, 0.25) }} strokeWidth={2} />
              <span className="truncate">{spec?.left}</span>
              <span className="ml-auto font-semibold" style={{ color: shade(tint, 0.25) }}>
                {spec?.right}
              </span>
            </div>
            <Stinger spec={spec} run={app.alertStyle === "stinger" ? run : 0} width={barW} />
          </motion.div>
          <p className="sr-only" aria-live="polite">
            {live}
          </p>
        </div>
        <div className="relative h-0">
          <GuideNote arrow="down-left" rotate={4} className="absolute -top-2 right-0 hidden lg:flex">
            tap one!
          </GuideNote>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Play a celebration alert">
          {(Object.keys(MAIN_STINGERS) as (keyof typeof MAIN_STINGERS)[]).map((k) => {
            const s = MAIN_STINGERS[k];
            const I = STINGER_ICONS[s.icon];
            return (
              <Button key={k} onClick={() => play(s)}>
                <I className="size-4" strokeWidth={1.8} style={{ color: tintHex(s.tint) }} aria-hidden="true" />
                {{ timer: "Timer", goal: "Goal", mail: "Mail", meeting: "Meeting", water: "Water" }[k]}
              </Button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="flex flex-wrap items-center gap-2.5 text-sm text-muted">
            Alert animation
            <Segmented<AlertStyle>
              id="alert-style"
              label="Alert animation"
              value={app.alertStyle}
              onChange={app.setAlertStyle}
              options={[
                { value: "stinger", label: "Celebration" },
                { value: "flash", label: "Colour flash" },
                { value: "off", label: "None" },
              ]}
            />
          </span>
          <span className="flex flex-wrap items-center gap-2.5 text-sm text-muted">
            Sound
            <Segmented<SoundMode>
              id="alert-sound"
              label="Alert sound"
              value={app.sound}
              onChange={(v) => {
                app.setSound(v);
                if (v !== "off") window.setTimeout(() => app.playSound(), 0);
              }}
              options={[
                { value: "off", label: "Silent" },
                { value: "tick", label: "Tick-tick" },
                { value: "both", label: "+ chime" },
              ]}
            />
          </span>
        </div>
      </div>
      <div className="min-[901px]:col-span-2">
        <p className="m-0 text-[13px] uppercase tracking-[.08em] text-muted">
          Every headline <span className="normal-case tracking-normal">· tap one to play it</span>
        </p>
        <ul className="m-0 mt-3 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-[repeat(auto-fill,minmax(170px,1fr))]">
          {ALL_STINGERS.map((s, idx) => {
            const c = tintHex(s.tint);
            const deep = shade(c, s.tint === "yellow" ? -0.62 : -0.5);
            const TileIcon = STINGER_ICONS[s.icon];
            const on = playing === s.name;
            return (
              <motion.li
                key={s.name}
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ delay: (idx % 5) * 0.05 + Math.floor(idx / 5) * 0.06, type: "spring", stiffness: 380, damping: 26 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    const r = document.getElementById("celebration-stage")?.getBoundingClientRect();
                    if (r && (r.top < 70 || r.bottom > window.innerHeight)) document.getElementById("celebration-stage")?.scrollIntoView({ block: "center" });
                    play(s);
                    setPlaying(s.name);
                    window.clearTimeout(playTimer.current);
                    playTimer.current = window.setTimeout(() => setPlaying(null), 1900);
                  }}
                  aria-label={`Play ${s.name}: ${s.h}${s.v ? `, ${s.v}` : ""}`}
                  className="group relative flex min-h-[58px] w-full items-center gap-2.5 overflow-hidden rounded-2xl px-2.5 py-2 text-left transition-[transform,box-shadow] duration-300 ease-spring hover:-translate-y-0.5 hover:rotate-[-.6deg] active:scale-[.97]"
                  style={{ background: shade(c, 0.86), boxShadow: on ? `inset 0 0 0 2px ${deep}, 0 12px 24px -14px ${shade(c, 0, 0.8)}` : `inset 0 0 0 1px ${shade(c, 0.55)}` }}
                >
                  <span
                    aria-hidden="true"
                    className={cn("pointer-events-none absolute inset-0 origin-left", on ? "tile-wipe" : "scale-x-0")}
                    style={{ background: `linear-gradient(90deg, ${shade(c, 0.35, 0.9)}, ${shade(c, 0.7, 0.5)})` }}
                  />
                  <span className="relative grid size-9 flex-none place-items-center rounded-xl bg-white shadow-[0_2px_6px_-2px_rgba(0,0,0,.12)] transition-transform duration-300 ease-spring group-hover:scale-110 group-hover:rotate-[-8deg]" style={{ color: deep }}>
                    <TileIcon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="condensed block truncate text-[16px] font-extrabold italic leading-none tracking-[.4px] sm:text-[17px]" style={{ color: deep }}>
                      {s.h}
                    </span>
                    <small className="mt-1 block truncate text-[11.5px] leading-tight text-ink/60">{s.name}</small>
                  </span>
                  {s.v && (
                    <span className="condensed relative flex-none rounded-md px-1.5 py-[3px] text-[13px] font-extrabold leading-none text-white" style={{ background: deep }}>
                      {s.v}
                    </span>
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
        <p className="m-0 mt-3 text-[13px] text-muted">The chip only ever shows a value the alert itself contains. No value, no chip. Colour flash, the 1.0 style, floods the bar with the alert&apos;s colour and fades back to black instead.</p>
      </div>
    </Reveal>
  );
}

function FlyCard() {
  const [phase, setPhase] = useState<"idle" | "fly" | "landed">("idle");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);
  const go = () => {
    timers.current.forEach(window.clearTimeout);
    setPhase("fly");
    timers.current = [window.setTimeout(() => setPhase("landed"), 850), window.setTimeout(() => setPhase("idle"), 3400)];
  };
  return (
    <Tilt reveal max={4} className="flex flex-col gap-3 rounded-[26px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)]">
      <div className="relative h-[140px] overflow-hidden rounded-2xl bg-mint" aria-hidden="true">
        <motion.div
          initial={false}
          animate={{ width: phase === "landed" ? 200 : 116, height: phase === "landed" ? 70 : 24 }}
          transition={spring}
          className="absolute left-1/2 top-0 grid -translate-x-1/2 place-items-end overflow-hidden rounded-b-[18px] bg-black pb-2.5"
        >
          <motion.span initial={false} animate={{ opacity: phase === "landed" ? 1 : 0, scale: phase === "landed" ? 1 : 0.8 }} transition={{ ...spring, delay: 0.1 }} className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] text-white">
            <FileIcon kind="key" className="h-[15px] w-3" />
            Q4 Plan.key
          </motion.span>
        </motion.div>
        <motion.span
          initial={false}
          animate={phase === "idle" ? { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 } : phase === "fly" ? { x: [0, 40, 130], y: [0, -30, -92], scale: [1, 1.05, 0.25], rotate: [0, -8, 0], opacity: [1, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-5 left-[calc(50%-140px)]"
        >
          <FileIcon kind="key" className="h-[46px] w-[38px]" />
        </motion.span>
        <span className={cn("absolute bottom-[68px] left-[calc(50%-100px)] inline-flex items-center gap-0.5 rounded-md bg-black/50 px-1.5 py-1 text-xs text-white transition-opacity", phase !== "idle" && "opacity-0")}>
          <Command className="size-3" />
          drag
        </span>
      </div>
      <h3 className="m-0 flex flex-wrap items-center gap-2 font-display text-[22px] font-semibold tracking-[-.025em]">Opens on your Shelf</h3>
      <p className="m-0 text-[15px] text-muted">TopShelf now opens on the File Shelf (pick another view in Settings › General). Only blinking new mail or messages open their own view first. Hold ⌘ while you drag a file anywhere and it flies onto the shelf, no aiming needed. Folders and apps drag back out too.</p>
      <div>
        <Button onClick={go}>
          <Command className="size-4" strokeWidth={1.8} aria-hidden="true" />
          Drag a file with ⌘
        </Button>
      </div>
    </Tilt>
  );
}

function GraceCard() {
  return (
    <Tilt reveal max={4} delay={0.05} className="flex flex-col gap-3 rounded-[26px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)]">
      <div className="relative h-[140px] overflow-hidden rounded-2xl bg-lavender" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[84px] w-[200px] -translate-x-1/2 overflow-hidden rounded-b-[22px] bg-black px-4 pt-7">
          <i className="block h-2 rounded bg-white/15" />
          <i className="mt-2 block h-2 w-[70%] rounded bg-white/15" />
          <span className="grace-demo-line absolute inset-x-0 bottom-0 h-[3px] bg-accent-soft" />
        </div>
        <MousePointer2 className="grace-demo-ptr absolute left-[calc(50%+40px)] top-[60px] size-5 fill-white text-ink" />
      </div>
      <h3 className="m-0 font-display text-[22px] font-semibold tracking-[-.025em]">Stays open while you use it</h3>
      <p className="m-0 text-[15px] text-muted">If you&apos;ve clicked, scrolled or dragged in TopShelf and the pointer slips out, it waits a moment (3 seconds by default, adjustable from 0 to 10) with a thin line draining along the bottom. Come back and it stays.</p>
    </Tilt>
  );
}

function InstallCard() {
  return (
    <Tilt reveal max={4} delay={0.1} className="flex flex-col gap-3 rounded-[26px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)]">
      <div className="relative grid h-[140px] place-items-center overflow-hidden rounded-2xl bg-peach" aria-hidden="true">
        <div className="flex w-[min(250px,88%)] flex-col gap-2">
          <div className="grid grid-cols-[30px_1fr] items-center gap-x-2.5 gap-y-1.5 rounded-[14px] bg-white p-3 shadow-[0_16px_30px_-16px_rgba(0,0,0,.35)]">
            <Download className="row-span-2 size-[26px] rounded-lg bg-lavender p-1 text-accent" />
            <b className="font-display text-[12.5px] font-semibold leading-tight">Move TopShelf to Applications?</b>
            <span className="flex justify-end gap-1.5 text-[11px]">
              <i className="rounded-md bg-ink/[.06] px-2 py-0.5 not-italic">Not now</i>
              <i className="rounded-md bg-accent px-2 py-0.5 not-italic text-white">Move</i>
            </span>
          </div>
          <div className="flex items-center justify-between rounded-[12px] bg-white/70 px-3 py-2 text-xs">
            Launch TopShelf at login
            <i className="relative h-[18px] w-[30px] rounded-full bg-[#34C759] after:absolute after:right-0.5 after:top-0.5 after:size-[14px] after:rounded-full after:bg-white" />
          </div>
        </div>
      </div>
      <h3 className="m-0 font-display text-[22px] font-semibold tracking-[-.025em]">Install & start at login</h3>
      <p className="m-0 text-[15px] text-muted">Opened from a download or the disk image, TopShelf offers to move itself into Applications. It starts at login by default; turn that off in Settings › General or System Settings › Login Items, and it stays off.</p>
    </Tilt>
  );
}

function ClipboardCard() {
  return (
    <Tilt reveal max={4} delay={0.15} className="flex flex-col gap-3 rounded-[26px] bg-[#1C1C1E] p-5 text-white">
      <div className="flex h-[140px] flex-col justify-center gap-1.5 rounded-2xl bg-white/[.06] p-3 text-[12.5px]" aria-hidden="true">
        <span className="flex items-center gap-2 rounded-lg bg-white/[.07] px-2.5 py-1.5"><span className="text-accent-soft">★</span>Shipping address · Studio, 2nd floor</span>
        <span className="flex items-center gap-2 rounded-lg bg-white/[.07] px-2.5 py-1.5"><Timer className="size-3.5 text-[#ffb4a3]" />Code 482 913<small className="ml-auto text-[#ffb4a3]">deletes in 2 min</small></span>
        <span className="flex items-center gap-2 rounded-lg bg-accent/25 px-2.5 py-1.5">✦ Rewrite professionally</span>
      </div>
      <h3 className="m-0 font-display text-[22px] font-semibold tracking-[-.025em]">Clipboard, upgraded</h3>
      <p className="m-0 text-[15px] text-white/65">Favourites, rich text, verification codes that delete themselves after two minutes, keyboard and drag-out, and AI actions on text. Still opt-in and local-only.</p>
      <div>
        <a
          href="#features"
          onClick={() => window.dispatchEvent(new CustomEvent("topshelf:feature", { detail: "clipboard" }))}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-[18px] text-sm text-ink transition-transform duration-300 ease-spring hover:-translate-y-px"
        >
          Try it in the playground
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </Tilt>
  );
}

export function NewIn11() {
  return (
    <section id="new" aria-labelledby="new-title" className="py-24 sm:pb-[140px] sm:pt-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <SectionHeading id="new-title" kicker="New in 1.1 · Preview available">
          Alerts worth <b>celebrating.</b>
        </SectionHeading>
        <Reveal>
          <p className="m-0 mt-5 max-w-[640px] text-pretty text-[17px] text-muted">All of this is in the TopShelf 1.1 preview, ready to download at the bottom of the page.</p>
        </Reveal>
        <div id="celebration-stage" className="mt-12">
          <Celebration />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FlyCard />
          <GraceCard />
          <InstallCard />
          <ClipboardCard />
        </div>
        <AlsoInPreview />
        <NextUpdate />
      </div>
    </section>
  );
}


const ALSO = [
  { label: "Breaks", href: "/features/break-reminders", meta: EXTRA_PAGES.breaks, p: "Heads-up, floating countdown, full-screen pause on every display, Smart Pause, office hours, Casual/Balanced/Hardcore, daily stats and a Screen Score." },
  { label: "Seven finishes", href: "/features/themes", meta: EXTRA_PAGES.themes, p: "Classic Black, Glass, Chrome, Aurora, Midnight, Neon and Luxe Gold." },
  { label: "Pin what you use", href: "/features/quick-actions", meta: FEATURE_META.all, p: "Pinned module tabs in the header; everything else in the All grid." },
  { label: "Wellness reminders", href: "/features/wellness", meta: FEATURE_META.wellness, p: "Nine reminders with intervals, active hours and a water log." },
  { label: "Calculator with a tape", href: "/features/calculator", meta: FEATURE_META.calc, p: "Rolling digits, a live result and a history tape." },
  { label: "Inbox and Live Scores (opt-in)", href: "/features/inbox", meta: FEATURE_META.inbox, p: "Mail unread counts per account and the WhatsApp badge; scores for the competitions you follow." },
];

/** The rest of what the 1.1 preview contains, each linking to its page. */
function AlsoInPreview() {
  return (
    <div className="mt-10">
      <p className="m-0 text-[13px] uppercase tracking-[.08em] text-muted">Also in the 1.1 preview</p>
      <ul className="m-0 mt-3 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {ALSO.map((a) => (
          <li key={a.href}>
            <a href={a.href} className="group flex h-full gap-3.5 rounded-[22px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] transition-[transform,box-shadow] duration-300 ease-spring hover:-translate-y-0.5 hover:shadow-[inset_0_0_0_1px_var(--color-line),0_24px_40px_-28px_rgba(23,23,23,.3)]">
              <span className="grid size-10 flex-none place-items-center rounded-xl transition-transform duration-300 ease-spring group-hover:rotate-[-8deg] group-hover:scale-110" style={{ background: a.meta.bg, color: a.meta.fg }}>
                <a.meta.Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <b className="block font-display text-[16px] font-semibold tracking-[-.015em]">{a.label}</b>
                <span className="text-[14px] text-muted">{a.p}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Built after the preview was cut: honest about what the download does not contain yet. */
function NextUpdate() {
  return (
    <Reveal className="mt-8 rounded-[26px] bg-peach p-5 text-[#5a2a0c] sm:p-6">
      <p className="m-0 flex items-center gap-2 font-display text-[17px] font-semibold">
        <Clock className="size-4" strokeWidth={1.8} aria-hidden="true" />
        Coming in the next update
      </p>
      <p className="m-0 mt-1 text-[14px] text-[#8A3D12]">Built since the preview was made, so not in today&apos;s download.</p>
      <ul className="m-0 mt-4 grid list-none gap-2.5 p-0 sm:grid-cols-2">
        {NEXT_UPDATE.map((n) => (
          <li key={n.h}>
            <a href={n.href} className="flex h-full flex-col gap-1 rounded-[18px] bg-white/70 p-4 transition-colors hover:bg-white">
              <b className="font-display text-[15px] font-semibold">{n.h}</b>
              <span className="text-[13.5px] text-[#6b4a32]">{n.p}</span>
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
