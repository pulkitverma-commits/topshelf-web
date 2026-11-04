"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Music } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { FileIcon } from "@/components/topshelf/bits";
import { Reveal, SectionHeading } from "@/components/ui/motion-primitives";
import { Scribble } from "@/components/ui/primitives";

/**
 * Everyday objects float around a friendly notch, then converge into it as the
 * section scrolls through the viewport.
 */
export function Concept() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const small = useMediaQuery("(max-width: 760px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrolled = useTransform(scrollYProgress, [0.42, 0.72], [0, 1], { clamp: true });
  const still = useMotionValue(0);
  const p = reduce ? still : scrolled;

  const k = small ? 0.36 : 1;
  const notchW = useTransform(p, [0, 1], [156, 356]);
  const notchH = useTransform(p, [0, 1], [36, 84]);
  const notchR = useTransform(p, [0, 1], [18, 30]);

  return (
    <section ref={ref} id="concept" aria-labelledby="concept-title" className="relative overflow-x-clip pb-[120px] pt-24 sm:pt-[150px]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <SectionHeading id="concept-title" kicker="The idea" center>
          That little space up top? <b>It&apos;s yours now.</b>
        </SectionHeading>

        <div aria-hidden="true" className="relative mt-10 h-[450px] sm:h-[580px]">
          <div className="absolute left-1/2 top-10 h-[150px] w-[min(820px,100%)] -translate-x-1/2 rounded-t-[30px] border-[1.5px] border-b-0 border-ink [mask-image:linear-gradient(#000_30%,transparent)]" />
          <motion.div
            style={{ width: notchW, height: notchH, borderBottomLeftRadius: notchR, borderBottomRightRadius: notchR }}
            className="absolute left-1/2 top-10 z-[2] flex -translate-x-1/2 items-center justify-center gap-4 bg-ink"
          >
            <span className="size-1.5 animate-blink rounded-full bg-white" />
            <span className="size-1.5 animate-blink rounded-full bg-white" />
          </motion.div>

          <Item p={p} k={k} x={-430} y={90} r={-8} delay="-1s">
            <div className="grid size-[72px] place-items-center rounded-full bg-lavender text-accent shadow-[inset_0_0_0_1.5px_rgba(84,104,255,.25)]">
              <Music className="size-[30px]" strokeWidth={1.8} />
            </div>
          </Item>
          <Item p={p} k={k} x={-270} y={300} r={5} delay="-3s">
            <div className="w-32 overflow-hidden rounded-2xl bg-white text-center shadow-[0_18px_36px_-20px_rgba(23,23,23,.35),0_0_0_1px_var(--color-line)]">
              <div className="bg-accent py-[5px] text-[11px] tracking-[.12em] text-white">NOV</div>
              <div className="font-display text-[44px] font-semibold leading-[1.1] tracking-[-.04em]">4</div>
              <div className="px-2 pb-2.5 text-[11px] text-muted">Design review · 10:30</div>
            </div>
          </Item>
          <Item p={p} k={k} x={250} y={290} r={7} delay="-2s">
            <div className="flex flex-col items-center gap-2 text-xs text-muted">
              <FileIcon kind="pdf" className="h-[78px] w-[62px]" />
              Brief_v3.pdf
            </div>
          </Item>
          <Item p={p} k={k} x={440} y={150} r={0} delay="-4.5s">
            <div className="relative grid size-24 place-items-center rounded-full bg-white shadow-[0_18px_36px_-20px_rgba(23,23,23,.35),0_0_0_1px_var(--color-line)]">
              <svg viewBox="0 0 80 80" className="absolute inset-2 size-20 -rotate-90">
                <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(23,23,23,.08)" strokeWidth="5" />
                <circle cx="40" cy="40" r="36" fill="none" stroke="#5468FF" strokeWidth="5" strokeLinecap="round" strokeDasharray="226" strokeDashoffset="70" />
              </svg>
              <b className="font-display text-[19px] font-semibold tracking-[-.02em]">25:00</b>
            </div>
          </Item>
          <Item p={p} k={k} x={-30} y={360} r={-4} delay="-5s">
            <div className="h-[116px] w-[132px] -rotate-3 bg-sticky p-3.5 font-hand text-[22px] leading-[1.05] shadow-[0_18px_30px_-18px_rgba(120,80,20,.4)]">call Ana re: the deck</div>
          </Item>
          <Item p={p} k={k} x={330} y={30} r={0} delay="-2.5s">
            <div className="flex h-11 items-center gap-2 rounded-full bg-ink px-3.5 text-[13px] text-white">
              <span className="relative h-3.5 w-[30px] rounded p-0.5 shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.7)] after:absolute after:-right-1 after:top-1 after:h-1.5 after:w-0.5 after:rounded-sm after:bg-white/70">
                <i className="block h-full w-[82%] rounded-sm bg-[#4ADE9B]" />
              </span>
              82%
            </div>
          </Item>
          <Item p={p} k={k} x={120} y={150} r={-12} delay="-1.8s">
            <svg viewBox="0 0 24 24" className="size-[34px] drop-shadow-[0_4px_6px_rgba(0,0,0,.25)]">
              <path d="M5 3l14 7.5-6.2 1.6L9.6 18z" fill="#171717" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </Item>

          <Scribble arrow="down-left" arrowFirst className="absolute right-[2%] top-40 hidden rotate-[4deg] text-[25px] md:flex">
            everything finds
            <br />
            its way up
          </Scribble>
        </div>

        <Reveal as="p" className="mx-auto max-w-[620px] text-balance text-center text-[clamp(20px,2vw,26px)] leading-[1.35]">
          TopShelf turns the most overlooked part of your screen into the most useful.
        </Reveal>
      </div>
    </section>
  );
}

function Item({
  p,
  k,
  x,
  y,
  r,
  delay,
  children,
}: {
  p: MotionValue<number>;
  k: number;
  x: number;
  y: number;
  r: number;
  delay: string;
  children: ReactNode;
}) {
  const tx = useTransform(p, (v) => x * k * (1 - v));
  const ty = useTransform(p, (v) => y * k * (1 - v));
  const rotate = useTransform(p, (v) => r * (1 - v));
  const scale = useTransform(p, [0, 1], [k < 1 ? 0.82 : 1, 0.35]);
  const opacity = useTransform(p, (v) => 1 - v * v * 0.95);
  return (
    <div className="absolute left-1/2 top-[84px] z-[1] -translate-x-1/2 -translate-y-1/2">
      <motion.div style={{ x: tx, y: ty, rotate, scale, opacity }}>
        <div className="animate-float" style={{ animationDelay: delay }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
