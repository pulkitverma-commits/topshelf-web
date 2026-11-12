"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { Check, Download } from "lucide-react";
import { MODULE_COUNT, siteConfig } from "@/config/site";
import { SectionHeading } from "@/components/ui/motion-primitives";
import { DownloadButton } from "@/components/delight/download";
import { Magnetic, Tilt } from "@/components/delight/interactive";
import { cn, easeOut } from "@/lib/utils";

/** Counts up to a price the first time it scrolls into view. */
function CountUp({ to, prefix = "" }: { to: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.1, ease: easeOut, onUpdate: setV });
    return () => c.stop();
  }, [inView, reduce, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {v.toFixed(2)}
    </span>
  );
}

/** Pricing: a free trial and one lifetime licence. */
export function Pricing() {
  const { offers } = siteConfig;
  const days = offers.trial.days;
  const [day, setDay] = useState(1);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative overflow-hidden py-24 sm:pb-[140px] sm:pt-10">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-40 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(169,179,255,.45),transparent)] blur-2xl" />
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <SectionHeading id="pricing-title" kicker="Pricing" center>
          Try it free. <b>Keep it for {offers.lifetime.price}.</b>
        </SectionHeading>
        <p className="mx-auto mt-5 max-w-[560px] text-center text-[17px] text-muted">
          One price, paid once. No subscription, no account and nothing to cancel.
        </p>

        {/* Trial timeline: drag through the days */}
        <div className="mx-auto mt-10 max-w-[860px] rounded-[26px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="m-0 font-display text-[17px] font-semibold tracking-[-.02em]">
              {day < days ? (
                <>
                  Day {day} of your free trial
                </>
              ) : (
                <>Day {days}: keep it for {offers.lifetime.price}, once</>
              )}
            </p>
            <span className="font-hand text-xl text-muted">drag me →</span>
          </div>
          <div className="relative mt-4">
            <div className="flex gap-1" aria-hidden="true">
              {Array.from({ length: days }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scaleY: 0.4, opacity: 0 }}
                  whileInView={{ scaleY: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.035, type: "spring", stiffness: 400, damping: 22 }}
                  className={cn(
                    "h-9 flex-1 origin-bottom rounded-lg transition-colors duration-200",
                    i < day ? (i === days - 1 ? "bg-ink" : ["bg-accent", "bg-[#7E8BFF]", "bg-accent-soft"][i % 3]) : "bg-canvas shadow-[inset_0_0_0_1px_var(--color-line)]",
                  )}
                />
              ))}
            </div>
            <input
              type="range"
              min={1}
              max={days}
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              aria-label="Day of the free trial"
              aria-valuetext={`Day ${day} of ${days}`}
              className="absolute inset-0 h-9 w-full cursor-ew-resize opacity-0"
            />
          </div>
          <div className="mt-2 flex justify-between text-[12.5px] text-muted">
            <span>Day 1 · every feature unlocked</span>
            <span>Day {days}</span>
          </div>
        </div>

        <div className="mx-auto mt-5 grid max-w-[860px] gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
          <Tilt reveal max={4} className="flex flex-col gap-[18px] rounded-[30px] bg-white p-[34px] shadow-[inset_0_0_0_1px_var(--color-line)]">
            <span className="text-[13px] uppercase tracking-[.08em] opacity-70">Free trial</span>
            <div className="flex flex-wrap items-baseline gap-2.5 font-display text-[44px] font-semibold leading-none tracking-[-.04em]">
              Free
              <small className="font-sans text-base font-normal tracking-normal opacity-70">for {offers.trial.length}</small>
            </div>
            <p className="m-0 opacity-75">Every feature on your own Mac, from the first minute. No card, no sign-up.</p>
            <Features items={["Music, Shelf, Calendar, Timers and Breaks", `All ${MODULE_COUNT} modules and Celebration alerts`, "Every theme, accent and size setting"]} />
            <Magnetic className="mt-auto" strength={0.18}>
              <DownloadButton variant="ghost" className="w-full">
                <Download className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
                Download free trial
              </DownloadButton>
            </Magnetic>
          </Tilt>

          <Tilt reveal delay={0.06} max={4} className="pricing-glow relative flex flex-col gap-[18px] rounded-[30px] bg-[#111] p-[34px] text-white shadow-[0_40px_60px_-40px_rgba(0,0,0,.5)]">
            <span className="flex items-center justify-between gap-2 text-[13px] uppercase tracking-[.08em]">
              <span className="opacity-70">Lifetime licence</span>
              <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] normal-case tracking-normal">No subscription</span>
            </span>
            <div className="flex flex-wrap items-baseline gap-2.5 font-display text-[clamp(40px,9vw,52px)] font-semibold leading-none tracking-[-.04em]">
              <CountUp to={offers.lifetime.amount} prefix="$" />
              <small className="font-sans text-base font-normal tracking-normal opacity-70">one-time, after your trial</small>
            </div>
            <p className="m-0 opacity-75">Pay once and keep TopShelf on your Macs.</p>
            <Features
              dark
              items={["Everything in the trial, to keep", `Use on ${offers.licenceDevices}`, `Updates: ${offers.updateTerms}`]}
            />
            <Magnetic className="mt-auto" strength={0.18}>
              <DownloadButton variant="light" className="w-full">
                <Download className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
                Start free, keep it for {offers.lifetime.price}
              </DownloadButton>
            </Magnetic>
          </Tilt>
        </div>
        <p className="mx-auto mt-5 max-w-[640px] text-center text-[13.5px] text-muted">
          Prices in US dollars. One licence covers {offers.licenceDevices}.
        </p>
      </div>
    </section>
  );
}

function Features({ items, dark = false }: { items: React.ReactNode[]; dark?: boolean }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[15px]">
      {items.map((it, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease: easeOut }}
          className="flex items-center gap-2.5"
        >
          <Check className={dark ? "size-4 flex-none text-accent-soft" : "size-4 flex-none text-accent"} strokeWidth={2.2} aria-hidden="true" />
          <span>{it}</span>
        </motion.li>
      ))}
    </ul>
  );
}
