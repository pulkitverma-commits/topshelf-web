"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { siteConfig } from "@/config/site";
import { AlbumArt, Equalizer, FileIcon } from "@/components/topshelf/bits";
import { Reveal, SectionHeading } from "@/components/ui/motion-primitives";
import { Button } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { Tilt } from "@/components/delight/interactive";

function Card({ n, title, body, className, children }: { n: string; title: string; body: ReactNode; className?: string; children: ReactNode }) {
  return (
    <Tilt reveal max={4} className={cn("relative flex min-h-[340px] flex-col gap-2.5 overflow-hidden rounded-[28px] p-[26px]", className)}>
      <span className="text-xs tabular-nums tracking-[.06em] text-muted">{n}</span>
      <h3 className="m-0 font-display text-2xl font-semibold leading-[1.15] tracking-[-.025em]">{title}</h3>
      <p className="m-0 max-w-[360px] text-[15.5px] text-muted">{body}</p>
      <div className="relative min-h-40 flex-1">{children}</div>
    </Tilt>
  );
}

export function Details() {
  const [dark, setDark] = useState(true);
  return (
    <section id="details" aria-labelledby="details-title" className="py-24 sm:pb-[140px] sm:pt-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <SectionHeading id="details-title" kicker="Details">
          The little things <b>make it lovely.</b>
        </SectionHeading>
        <div className="mt-14 grid grid-cols-12 gap-5">
          <Card n="01" title="Drag, drop, done." body="Fling a file at the top of the screen and it lands in the Shelf, ready for wherever you need it next." className="col-span-12 bg-white shadow-[inset_0_0_0_1px_var(--color-line)] min-[901px]:col-span-7">
            <div aria-hidden="true">
              <span className="absolute left-1/2 top-0 h-[30px] w-[150px] -translate-x-1/2 rounded-b-[15px] bg-[#111]" />
              <svg viewBox="0 0 220 150" className="absolute left-[calc(50%-200px)] top-4 h-[150px] w-[220px]">
                <path d="M10 140C40 80 120 40 200 18" fill="none" stroke="#171717" strokeWidth="1.6" strokeDasharray="4 7" strokeLinecap="round" />
              </svg>
              <span className="loop-drag absolute left-1/2 top-5">
                <FileIcon kind="img" className="h-12 w-[38px]" />
              </span>
              <span className="absolute bottom-2.5 right-[6%] -rotate-[4deg] font-hand text-[22px]">whoosh</span>
            </div>
          </Card>

          <Card n="02" title="Music in a glance." body="The track and a tiny visualiser sit at the top of your screen while you work." className="col-span-12 bg-lavender min-[901px]:col-span-5">
            <div aria-hidden="true">
              <span className="absolute left-1/2 top-0 flex h-10 w-[250px] max-w-full -translate-x-1/2 items-center justify-between rounded-b-[20px] bg-[#111] px-3.5">
                <AlbumArt art="a1" className="size-6 rounded-md" />
                <Equalizer className="h-4" />
              </span>
              <span className="absolute bottom-3.5 left-[8%] -rotate-[4deg] font-hand text-[22px]">still playing</span>
            </div>
          </Card>

          <Card n="03" title="A nudge before meetings." body="A quiet heads-up, minutes before you're due." className="col-span-12 bg-peach min-[901px]:col-span-4">
            <span aria-hidden="true" className="loop-nudge absolute left-1/2 top-0 flex -translate-x-1/2 items-center justify-center overflow-hidden whitespace-nowrap rounded-b-[18px] bg-[#111] text-[13px] text-white">
              <span className="loop-nudge-text">Design review · 5 min</span>
            </span>
          </Card>

          <Card n="04" title="Transitions that make sense." body="Every module grows out of the top of your screen and returns to it, on springs that respect Reduce Motion." className="col-span-12 bg-mint min-[901px]:col-span-4">
            <span aria-hidden="true" className="loop-morph absolute left-1/2 top-2.5 -translate-x-1/2 bg-[#111]" />
          </Card>

          <Card n="05" title="Light or dark, your call." body="Switch appearances and TopShelf follows along." className="col-span-12 bg-white shadow-[inset_0_0_0_1px_var(--color-line)] min-[901px]:col-span-4">
            <motion.div
              aria-hidden="true"
              animate={{ backgroundColor: dark ? "#111111" : "#FFFFFF", color: dark ? "#FFFFFF" : "#171717" }}
              transition={{ duration: 0.45 }}
              className={cn("absolute left-1/2 top-0 flex h-[120px] w-[250px] max-w-full -translate-x-1/2 gap-2.5 rounded-b-[26px] p-[18px]", !dark && "shadow-[0_0_0_1px_var(--color-line),0_20px_30px_-20px_rgba(0,0,0,.3)]")}
            >
              <AlbumArt art="a3" className="size-[50px] rounded-[10px]" />
              <div className="flex flex-1 flex-col justify-center gap-[7px]">
                {["80%", "56%", "70%"].map((w) => (
                  <i key={w} className="block h-1.5 rounded-[3px] bg-current opacity-25" style={{ width: w }} />
                ))}
              </div>
            </motion.div>
            <Button className="absolute bottom-1.5 left-1/2 -translate-x-1/2" onClick={() => setDark((d) => !d)} aria-pressed={!dark}>
              {dark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
              {dark ? "Switch to light" : "Switch to dark"}
            </Button>
          </Card>

          <Reveal className="col-span-12 flex min-h-60 flex-wrap items-center justify-between gap-10 rounded-[28px] bg-ink p-[26px] text-white">
            <div className="flex max-w-[420px] flex-col gap-2.5">
              <span className="text-xs tabular-nums tracking-[.06em] text-white/60">06</span>
              <h3 className="m-0 font-display text-2xl font-semibold tracking-[-.025em]">Keys for everything.</h3>
              <p className="m-0 text-[15.5px] text-white/70">Open TopShelf and jump between widgets without touching the trackpad.</p>
            </div>
            <div className="flex flex-col items-start gap-3.5">
              <div className="flex flex-wrap items-center gap-2.5" role="img" aria-label={`Example shortcut: ${siteConfig.exampleShortcut.join(" plus ")}`}>
                {siteConfig.exampleShortcut.map((k, i) => (
                  <span key={k} className="flex items-center gap-2.5">
                    {i > 0 && <em className="text-xl not-italic text-white/50">+</em>}
                    <span className="loop-press grid h-16 min-w-16 place-items-center rounded-[14px] bg-white px-[18px] font-display text-[22px] font-medium text-ink" style={{ animationDelay: `${i * 0.15}s` }}>
                      {k}
                    </span>
                  </span>
                ))}
              </div>
              <span className="font-hand text-[22px] text-white/80">
                example shortcut{!siteConfig.exampleShortcutConfirmed && <> · <span className="ph">[confirm default]</span></>}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
