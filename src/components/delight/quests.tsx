"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Download } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { useDemo } from "@/components/demo-provider";
import type { BarTab } from "@/components/topshelf/hero-bar";
import { siteConfig } from "@/config/site";
import { cn, easeOut, spring } from "@/lib/utils";
import { Magnetic } from "./interactive";
import { QUESTS, useDelight } from "./delight-provider";

const TAB_FOR: Record<(typeof QUESTS)[number]["id"], BarTab> = {
  "q-open": "shelf",
  "q-file": "shelf",
  "q-music": "music",
  "q-timer": "focus",
  "q-break": "breaks",
};

/**
 * Five small things to try on the hero desktop. Each ticks itself off when the visitor
 * actually does it on the working TopShelf above; "Show me" opens the right view.
 */
export function HeroQuests({ open, show, stage }: { open: boolean; show: (tab?: BarTab, pin?: boolean) => void; stage?: React.RefObject<HTMLElement | null> }) {
  const demo = useDemo();
  const app = useApp();
  const { tried, mark } = useDelight();
  const rows = useRef<Record<string, HTMLElement | null>>({});

  const fileOnShelf = demo.files.some((f) => f.inTray && f.id !== "f2");
  useEffect(() => {
    if (open) mark("q-open", rows.current["q-open"]);
  }, [open, mark]);
  useEffect(() => {
    if (fileOnShelf) mark("q-file", rows.current["q-file"]);
  }, [fileOnShelf, mark]);
  useEffect(() => {
    if (demo.playing) mark("q-music", rows.current["q-music"]);
  }, [demo.playing, mark]);
  useEffect(() => {
    if (demo.timerRunning) mark("q-timer", rows.current["q-timer"]);
  }, [demo.timerRunning, mark]);
  useEffect(() => {
    if (app.run) mark("q-break", rows.current["q-break"]);
  }, [app.run, mark]);

  const done = QUESTS.filter((q) => tried.has(q.id)).length;
  const next = QUESTS.find((q) => !tried.has(q.id));
  const all = done === QUESTS.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easeOut, delay: 0.6 }}
      className="relative mx-auto mt-10 w-full max-w-[980px] rounded-[28px] bg-white p-4 text-left shadow-[inset_0_0_0_1px_var(--color-line),0_30px_60px_-40px_rgba(23,23,23,.3)] sm:mt-14 sm:p-5"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1">
        <p className="m-0 font-display text-[17px] font-semibold tracking-[-.02em]">
          {all ? "You know your way around TopShelf." : "Try it right here, in five moves"}
        </p>
        <div className="relative h-1.5 min-w-[120px] flex-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <motion.span className="absolute inset-y-0 left-0 rounded-full bg-accent" animate={{ width: `${(done / QUESTS.length) * 100}%` }} transition={spring} />
        </div>
        <span className="text-sm tabular-nums text-muted" aria-live="polite">
          {done} of {QUESTS.length}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {all ? (
          <motion.div key="all" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex flex-wrap items-center gap-4 px-1 pb-1">
            <span className="-rotate-2 font-hand text-[26px] leading-none">that&apos;s the whole idea. calm, and right there.</span>
            <Magnetic className="ml-auto">
              <a href={siteConfig.links.download} className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[15px] text-white transition-transform active:scale-95">
                <Download className="size-4" aria-hidden="true" /> Get TopShelf
              </a>
            </Magnetic>
          </motion.div>
        ) : (
          <motion.ol key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="m-0 mt-3.5 grid list-none grid-cols-1 gap-2 p-0 min-[560px]:grid-cols-2 lg:grid-cols-5">
            {QUESTS.map((q, i) => {
              const on = tried.has(q.id);
              const isNext = next?.id === q.id;
              return (
                <li
                  key={q.id}
                  ref={(el) => {
                    rows.current[q.id] = el;
                  }}
                  className={cn(
                    "relative flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-[background-color,box-shadow] duration-300 lg:flex-col lg:items-start lg:gap-2 lg:py-3",
                    on ? "bg-mint" : isNext ? "bg-lavender shadow-[inset_0_0_0_1.5px_var(--color-accent)]" : "bg-canvas",
                  )}
                >
                  <span className={cn("grid size-7 flex-none place-items-center rounded-full text-[13px] tabular-nums transition-colors duration-300", on ? "bg-[#2FBF9B] text-white" : "bg-white text-muted shadow-[inset_0_0_0_1px_var(--color-line-strong)]")}>
                    <AnimatePresence mode="wait" initial={false}>
                      {on ? (
                        <motion.span key="c" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 520, damping: 18 }}>
                          <Check className="size-4" strokeWidth={2.8} aria-hidden="true" />
                        </motion.span>
                      ) : (
                        <motion.span key="n">{i + 1}</motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className={cn("text-[14.5px]", on ? "text-ink/70 line-through decoration-[#2FBF9B] decoration-2" : "text-ink")}>
                      {q.label}
                      <span className="sr-only">{on ? " (done)" : ""}</span>
                    </span>
                    <span className="mt-0.5 text-[12.5px] text-muted">{q.hint}</span>
                  </span>
                  {!on && (
                    <button
                      type="button"
                      onClick={() => {
                        show(TAB_FOR[q.id], true);
                        const r = stage?.current?.getBoundingClientRect();
                        if (r && (r.top < 60 || r.bottom > window.innerHeight)) stage?.current?.scrollIntoView({ block: "center", behavior: "smooth" });
                      }}
                      className="h-8 flex-none rounded-full bg-white px-3 text-[12.5px] text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] transition-colors hover:bg-ink hover:text-white lg:mt-auto"
                    >
                      Show me<span className="sr-only">: {q.label}</span>
                    </button>
                  )}
                  {isNext && i > 0 && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pointer-events-none absolute -top-7 right-3 hidden rotate-[4deg] font-hand text-[22px] leading-none text-accent lg:block"
                    >
                      next up ↓
                    </motion.span>
                  )}
                </li>
              );
            })}
          </motion.ol>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
