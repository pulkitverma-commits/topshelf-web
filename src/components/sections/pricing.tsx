"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal, SectionHeading, Segmented } from "@/components/ui/motion-primitives";
import { ButtonLink, Value } from "@/components/ui/primitives";
import { easeOut } from "@/lib/utils";

type Billing = "monthly" | "lifetime";

export function Pricing() {
  const { offers } = siteConfig;
  const bothPaid = offers.monthly.enabled && offers.lifetime.enabled;
  const [choice, setChoice] = useState<Billing>("lifetime");
  const billing: Billing = bothPaid ? choice : offers.monthly.enabled ? "monthly" : "lifetime";
  const hasPaid = offers.monthly.enabled || offers.lifetime.enabled;

  const plan =
    billing === "monthly"
      ? { name: "Monthly", price: offers.monthly.price, period: "per month", note: "Keep TopShelf for as long as you subscribe. Cancel any time." }
      : { name: "Lifetime", price: offers.lifetime.price, period: "one-time", note: "Pay once and keep TopShelf on your Mac." };

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="py-24 sm:pb-[140px] sm:pt-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <SectionHeading id="pricing-title" kicker="Pricing" center>
          Small upgrade. <b>Everyday delight.</b>
        </SectionHeading>
        {bothPaid && (
          <div className="mt-9 flex justify-center">
            <Segmented
              id="billing"
              label="Billing period"
              value={billing}
              onChange={setChoice}
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "lifetime", label: "Lifetime" },
              ]}
            />
          </div>
        )}
        <div className="mx-auto mt-7 grid max-w-[860px] gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
          {offers.trial.enabled && (
            <Reveal className="flex flex-col gap-[18px] rounded-[30px] bg-white p-[34px] shadow-[inset_0_0_0_1px_var(--color-line)]">
              <span className="text-[13px] uppercase tracking-[.08em] opacity-70">Free trial</span>
              <div className="flex flex-wrap items-baseline gap-2.5 font-display text-[44px] font-semibold leading-none tracking-[-.04em]">
                Free
                <small className="font-sans text-base font-normal tracking-normal opacity-70">
                  for <Value>{offers.trial.length}</Value>
                </small>
              </div>
              <p className="m-0 opacity-75">Try every widget on your own Mac before you decide.</p>
              <Features items={["Music, Shelf, Calendar and Focus", "Shortcuts and live activities", "Full customisation"]} />
              <ButtonLink href={siteConfig.links.download} variant="ghost" className="mt-auto">
                Try TopShelf
              </ButtonLink>
            </Reveal>
          )}
          {hasPaid && (
            <Reveal delay={0.06} className="flex flex-col gap-[18px] rounded-[30px] bg-[#111] p-[34px] text-white shadow-[0_40px_60px_-40px_rgba(0,0,0,.5)]">
              <span className="text-[13px] uppercase tracking-[.08em] opacity-70">{plan.name} licence</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={billing}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: easeOut }}
                  className="flex flex-col gap-[18px]"
                >
                  <div className="flex flex-wrap items-baseline gap-2.5 font-display text-[clamp(32px,9vw,44px)] font-semibold leading-none tracking-[-.04em]">
                    <Value wrap>{plan.price}</Value>
                    <small className="font-sans text-base font-normal tracking-normal opacity-70">{plan.period}</small>
                  </div>
                  <p className="m-0 opacity-75">{plan.note}</p>
                </motion.div>
              </AnimatePresence>
              <Features
                dark
                items={[
                  "Everything in the trial, to keep",
                  <>
                    Use on <Value>{offers.licenceDevices}</Value>
                  </>,
                  <>
                    Updates: <Value>{offers.updateTerms}</Value>
                  </>,
                ]}
              />
              <ButtonLink href={siteConfig.links.buy} variant="light" className="mt-auto">
                Get TopShelf
              </ButtonLink>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

function Features({ items, dark = false }: { items: React.ReactNode[]; dark?: boolean }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[15px]">
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-2.5">
          <Check className={dark ? "size-4 flex-none text-accent-soft" : "size-4 flex-none text-accent"} strokeWidth={2.2} aria-hidden="true" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
