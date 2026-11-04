"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { Timer } from "lucide-react";
import { STORY_STEPS } from "@/lib/demo-data";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useElementWidth } from "@/hooks/use-element-width";
import { DesktopWindow, MacBook, MenuBar } from "@/components/mac/macbook";
import { AlbumArt, Equalizer, FileIcon } from "@/components/topshelf/bits";
import { SectionHeading } from "@/components/ui/motion-primitives";
import { cn, easeOut, spring } from "@/lib/utils";

/**
 * Three moments in a workday. On desktop the scenes follow scroll position inside
 * a pinned stage; on smaller screens they cycle on their own and can be tapped.
 */
export function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  const [scene, setScene] = useState(0);
  const manualUntil = useRef(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!isDesktop || Date.now() < manualUntil.current) return;
    setScene(v < 0.34 ? 0 : v < 0.68 ? 1 : 2);
  });

  useEffect(() => {
    if (isDesktop || reduce) return;
    const id = window.setInterval(() => {
      if (Date.now() < manualUntil.current) return;
      setScene((s) => (s + 1) % 3);
    }, 5000);
    return () => window.clearInterval(id);
  }, [isDesktop, reduce]);

  const pick = (i: number) => {
    setScene(i);
    const el = sectionRef.current;
    if (isDesktop && el) {
      manualUntil.current = Date.now() + 1100;
      const total = el.offsetHeight - window.innerHeight;
      const top = el.getBoundingClientRect().top + window.scrollY + total * (i / 3 + 0.12);
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    } else {
      manualUntil.current = Date.now() + 12000;
    }
  };

  const step = STORY_STEPS[scene];

  return (
    <section ref={sectionRef} id="how-it-works" aria-labelledby="story-title" className="relative py-20 lg:h-[260vh] lg:py-0">
      <div className="lg:sticky lg:top-[68px] lg:flex lg:min-h-[calc(100vh-68px)] lg:items-center lg:py-10">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8">
          <SectionHeading id="story-title" kicker="How it works">
            Fits right into <b>your flow.</b>
          </SectionHeading>
          <div className="mt-7 grid items-center gap-7 lg:mt-[52px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <div className="relative flex flex-col gap-1.5 pl-[22px]">
              <span aria-hidden="true" className="absolute bottom-3.5 left-0 top-3.5 w-0.5 rounded bg-line" />
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-3.5 w-0.5 rounded bg-ink"
                animate={{ height: ["18%", "52%", "calc(100% - 28px)"][scene] }}
                transition={{ duration: 0.7, ease: easeOut }}
              />
              {STORY_STEPS.map((s, i) => {
                const on = i === scene;
                return (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => pick(i)}
                    aria-pressed={on}
                    className={cn(
                      "flex w-full flex-col gap-1 rounded-[22px] px-[22px] py-[18px] text-left transition-[background-color,color,box-shadow] duration-300",
                      on ? "bg-white text-ink shadow-[inset_0_0_0_1px_var(--color-line),0_20px_40px_-30px_rgba(0,0,0,.25)]" : "text-muted hover:text-ink",
                    )}
                  >
                    <span className="text-[12.5px] uppercase tracking-[.08em]">{s.kicker}</span>
                    <span className="font-display text-[26px] font-semibold leading-[1.15] tracking-[-.025em]">{s.title}</span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: easeOut }}
                          className="block overflow-hidden text-base text-muted"
                        >
                          {s.body}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>

            <div className="relative order-first lg:order-none">
              <AnimatePresence mode="wait">
                <motion.span
                  key={step.caption}
                  aria-hidden="true"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-11 right-0 hidden rotate-[3deg] whitespace-nowrap font-hand text-2xl lg:block"
                >
                  {step.caption}
                </motion.span>
              </AnimatePresence>
              <MacBook className="w-full max-w-[680px]" screenClassName="max-sm:aspect-auto max-sm:h-[250px]">
                <MenuBar size="sm" app={step.app} clock={step.clock} />
                {scene === 1 && <DesktopWindow animated className="left-[10%] top-[22%] h-[56%] w-[46%]" />}
                <StoryNotch scene={scene} />
              </MacBook>
              <AnimatePresence>
                {scene === 0 && (
                  <motion.div
                    key="fly"
                    aria-hidden="true"
                    className="absolute -left-[4%] top-[42%] z-50 hidden w-[120px] motion-reduce:!hidden overflow-hidden rounded-2xl bg-white text-center shadow-[0_18px_36px_-20px_rgba(23,23,23,.35),0_0_0_1px_var(--color-line)] lg:block"
                    initial={{ opacity: 0, x: -30, y: 30, rotate: -8 }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: [-30, 0, 230],
                      y: [30, 0, -190],
                      rotate: [-8, -6, 0],
                      scale: [1, 1, 0.25],
                      transition: { duration: 1.3, times: [0, 0.25, 1], ease: [0.6, 0, 0.3, 1] },
                    }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-accent py-[5px] text-[11px] tracking-[.12em] text-white">NOV</div>
                    <div className="font-display text-[44px] font-semibold leading-[1.1]">4</div>
                    <div className="px-2 pb-2.5 text-[11px] text-muted">Stand-up · 9:30</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryNotch({ scene }: { scene: number }) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const base = width * 0.16;
  const size =
    scene === 1
      ? { width: base + 150, height: 24, radius: 12 }
      : { width: Math.min(440, width * 0.88), height: width < 500 ? 200 : 212, radius: 26 };

  return (
    <div ref={ref} className="absolute inset-x-0 top-0 z-30 flex justify-center">
      {width > 0 && (
        <motion.div
          initial={false}
          animate={{ width: size.width, height: size.height, borderBottomLeftRadius: size.radius, borderBottomRightRadius: size.radius }}
          transition={spring}
          className="relative overflow-hidden bg-black text-white"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={scene}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.35, ease: easeOut } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              className="absolute inset-0"
            >
              {scene === 0 && <Agenda />}
              {scene === 1 && (
                <div className="flex h-full items-center justify-between px-3">
                  <span className="flex items-center gap-1.5">
                    <AlbumArt art="a2" className="size-4 rounded" />
                    <Equalizer className="h-[11px]" />
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] tabular-nums">
                    <Timer className="size-3 text-accent-soft" strokeWidth={2} aria-hidden="true" />
                    18:42
                  </span>
                </div>
              )}
              {scene === 2 && <WrapUp />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function Agenda() {
  const items = [
    { t: "9:30", label: "Team stand-up", hint: "in 10 min", hi: true },
    { t: "11:00", label: "Design review" },
    { t: "15:30", label: "Sprint planning" },
  ];
  return (
    <div className="flex h-full flex-col gap-2 p-3.5 pb-3">
      <div className="flex justify-between text-xs text-white/60">
        <span>Today</span>
        <span>3 events</span>
      </div>
      {items.map((it, i) => (
        <motion.div
          key={it.t}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.08, ease: easeOut }}
          className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px]", it.hi ? "bg-accent/30" : "bg-white/[.06]")}
        >
          <b className="w-10 font-normal tabular-nums text-white/55">{it.t}</b>
          {it.label}
          {it.hint && <em className="ml-auto text-xs not-italic text-[#B8C0FF]">{it.hint}</em>}
        </motion.div>
      ))}
    </div>
  );
}

function WrapUp() {
  return (
    <div className="flex h-full flex-col gap-2 p-3.5 pb-3">
      <div className="flex justify-between text-xs text-white/60">
        <span>Wrap up</span>
        <span>18:30</span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2.5">
        <div className="flex min-w-0 flex-col gap-1.5 rounded-[14px] bg-white/[.07] p-2.5 text-xs">
          <h6 className="m-0 mb-0.5 text-[11px] font-normal uppercase tracking-[.08em] text-white/50">Shelf</h6>
          {(
            [
              ["pdf", "Brief_v3.pdf"],
              ["img", "Moodboard.png"],
              ["key", "Q4 Plan.key"],
            ] as const
          ).map(([k, n], i) => (
            <motion.span key={n} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.12 }} className="flex items-center gap-1.5 truncate">
              <FileIcon kind={k} className="h-[18px] w-3.5" />
              {n}
            </motion.span>
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-1.5 rounded-[14px] bg-white/[.07] p-2.5 text-xs">
          <h6 className="m-0 mb-0.5 text-[11px] font-normal uppercase tracking-[.08em] text-white/50">Tasks</h6>
          <Todo done>Send recap</Todo>
          <Todo done>Review PR</Todo>
          <Todo animateDone>Export assets</Todo>
        </div>
      </div>
    </div>
  );
}

function Todo({ children, done = false, animateDone = false }: { children: string; done?: boolean; animateDone?: boolean }) {
  const [checked, setChecked] = useState(done);
  useEffect(() => {
    if (!animateDone) return;
    const id = window.setTimeout(() => setChecked(true), 1200);
    return () => window.clearTimeout(id);
  }, [animateDone]);
  return (
    <span className={cn("flex items-center gap-2 transition-colors duration-300", checked && "text-white/55 line-through")}>
      <motion.i
        animate={{ backgroundColor: checked ? "#4ADE9B" : "rgba(0,0,0,0)", scale: checked && animateDone ? [1, 1.25, 1] : 1 }}
        transition={{ duration: 0.4 }}
        className={cn("block size-[15px] flex-none rounded-[5px]", !checked && "shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.5)]")}
      />
      {children}
    </span>
  );
}
