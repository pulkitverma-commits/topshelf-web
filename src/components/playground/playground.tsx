"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useDelight } from "@/components/delight/delight-provider";
import { GuideNote } from "@/components/delight/interactive";
import { MODULE_COUNT, siteConfig } from "@/config/site";
import { FEATURES, type FeatureId } from "@/lib/demo-data";
import { EXTRA_PAGES } from "@/lib/feature-meta";
import { SENSE_PAGE } from "@/lib/pages";
import { SectionHeading } from "@/components/ui/motion-primitives";
import { cn, easeOut, spring } from "@/lib/utils";
import { MusicDemo } from "./core-demos";

function StageSkeleton() {
  return <div className="absolute left-1/2 top-0 h-40 w-[min(460px,92%)] -translate-x-1/2 rounded-b-[30px] bg-black/80" />;
}

// The first demo ships with the page; the rest load when a visitor opens their tab.
const lazy = <T extends keyof typeof import("./core-demos")>(name: T) =>
  dynamic(() => import("./core-demos").then((m) => m[name]), { ssr: false, loading: StageSkeleton });
const lazyExtra = <T extends keyof typeof import("./extra-demos")>(name: T) =>
  dynamic(() => import("./extra-demos").then((m) => m[name]), { ssr: false, loading: StageSkeleton });
const lazyModule = <T extends keyof typeof import("./module-demos")>(name: T) =>
  dynamic(() => import("./module-demos").then((m) => m[name]), { ssr: false, loading: StageSkeleton });

export const DEMOS: Record<FeatureId, React.ComponentType> = {
  music: MusicDemo,
  shelf: lazy("ShelfDemo"),
  calendar: lazy("CalendarDemo"),
  notes: lazy("NotesDemo"),
  focus: lazy("FocusDemo"),
  live: lazyExtra("LiveDemo"),
  wellness: lazyModule("WellnessDemo"),
  calc: lazyModule("CalcDemo"),
  inbox: lazyModule("InboxDemo"),
  scores: lazyModule("ScoresDemo"),
  clipboard: lazyModule("ClipboardDemo"),
  system: lazyModule("SystemDemo"),
  all: lazyModule("AllDemo"),
  assistant: lazyModule("AssistantDemo"),
};

export function Playground() {
  const features = FEATURES.filter((f) => siteConfig.flags.aiWorkspace || !f.experimental);
  const [active, setActive] = useState<FeatureId>(features[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const feature = features.find((f) => f.id === active) ?? features[0];
  const Demo = DEMOS[feature.id];
  const { mark } = useDelight();
  const mounted = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // A module counts as tried once it is picked or touched.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    mark(`m-${active}`, tabRefs.current[features.findIndex((f) => f.id === active)]);
  }, [active]);

  // Other sections can open a tab here ("Try it in the playground").
  useEffect(() => {
    const onPick = (e: Event) => {
      const id = (e as CustomEvent<FeatureId>).detail;
      if (features.some((f) => f.id === id)) setActive(id);
    };
    window.addEventListener("topshelf:feature", onPick);
    return () => window.removeEventListener("topshelf:feature", onPick);
  }, [features]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const idx = e.key === "Home" ? 0 : features.length - 1;
      setActive(features[idx].id);
      tabRefs.current[idx]?.focus();
      return;
    }
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (i + keys[e.key] + features.length) % features.length;
    setActive(features[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="features" aria-labelledby="features-title" className="py-24 sm:pb-[140px] sm:pt-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <SectionHeading id="features-title" kicker={`Feature playground · ${MODULE_COUNT} modules`}>
          Everything you need. <b>Right where you need it.</b>
        </SectionHeading>

        <div className="relative">
          <GuideNote arrow="down-left" rotate={-4} className="absolute -top-[58px] right-2 hidden lg:flex">
            pick any. they all work.
          </GuideNote>
        </div>
        <div role="tablist" aria-label="TopShelf features" className="no-scrollbar mt-11 flex gap-1.5 overflow-x-auto px-0.5 py-1">
          {features.map((f, i) => {
            const selected = f.id === feature.id;
            return (
              <button
                key={f.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`tab-${f.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="feature-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(f.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "relative inline-flex h-11 flex-none items-center gap-2 rounded-full px-[18px] text-[15px] transition-colors duration-200",
                  selected ? "text-white" : "text-[#3f3f3f] shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:bg-ink/[.04]",
                )}
              >
                {selected && <motion.span layoutId="feature-tab" className="absolute inset-0 rounded-full bg-ink" transition={spring} />}
                <span className="relative text-[11px] tabular-nums opacity-60">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative">{f.label}</span>
              </button>
            );
          })}
        </div>

        <div
          id="feature-panel"
          ref={panelRef}
          onPointerDown={() => mark(`m-${feature.id}`, tabRefs.current[features.findIndex((f) => f.id === feature.id)])}
          role="tabpanel"
          aria-labelledby={`tab-${feature.id}`}
          className="mt-[18px] grid items-center gap-6 rounded-[32px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-[clamp(16px,2.6vw,36px)] md:gap-[clamp(24px,4vw,56px)] min-[901px]:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: easeOut }}
              className="flex flex-col gap-4 p-3"
            >
              <p className="m-0 text-[13px] uppercase tracking-[.08em] text-muted">{feature.kicker}</p>
              <h3 className="m-0 text-balance font-display text-[clamp(26px,2.5vw,34px)] font-semibold leading-[1.1] tracking-[-.03em]">{feature.title}</h3>
              <p className="m-0 text-pretty text-[17px] text-muted">{feature.body}</p>
              {feature.next && (
                <p className="m-0 rounded-2xl bg-lavender px-4 py-3 text-[15px] text-[#2b2f6b]">
                  <b className="mr-1.5 font-display font-semibold">New in 1.1.</b>
                  {feature.next}
                </p>
              )}
              {feature.experimental && (
                <span className="inline-flex min-h-7 items-center gap-1.5 self-start rounded-2xl bg-peach px-3 py-1 text-[13px] text-[#8A3D12]">
                  <Sparkles className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                  Experimental concept, not a confirmed feature
                </span>
              )}
            </motion.div>
          </AnimatePresence>
          <div className={cn("relative h-[500px] overflow-hidden rounded-3xl transition-colors duration-500 sm:h-[460px]", feature.stage)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={feature.id}
                className="absolute inset-0"
                initial={{ opacity: 0, y: -12, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99 }}
                transition={{ duration: 0.4, ease: easeOut }}
              >
                <Demo />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <SenseTeaser />
      </div>
    </section>
  );
}

/**
 * TopShelf Sense is announced for the next update and has no demo yet (it is not in the downloadable
 * build), so it sits under the playground as a plain teaser rather than a tab.
 */
function SenseTeaser() {
  const m = EXTRA_PAGES.sense;
  return (
    <a
      href={`/features/${m.slug}`}
      className="group mt-4 flex flex-col gap-4 rounded-[26px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)] transition-[transform,box-shadow] duration-300 ease-spring hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_var(--color-line),0_30px_50px_-30px_rgba(23,23,23,.3)] sm:flex-row sm:items-center sm:gap-6 sm:p-6"
    >
      <span className="grid size-12 flex-none place-items-center rounded-2xl transition-transform duration-300 ease-spring group-hover:rotate-[-8deg] group-hover:scale-110" style={{ background: m.bg, color: m.fg }}>
        <m.Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="inline-flex min-h-7 items-center gap-1.5 self-start rounded-2xl bg-peach px-3 py-1 text-[13px] text-[#8A3D12]">
          <Sparkles className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
          {SENSE_PAGE.kicker}
        </span>
        <span className="font-display text-[22px] font-semibold leading-tight tracking-[-.025em]">
          {SENSE_PAGE.label}: {SENSE_PAGE.title}
        </span>
        <span className="text-[15px] text-muted">{SENSE_PAGE.blurb}. Off by default, processed on your Mac, no video recorded.</span>
      </span>
      <span className="inline-flex items-center gap-1.5 text-[15px] underline underline-offset-4">
        Read about Sense
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </a>
  );
}
