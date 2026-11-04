"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { FAQS } from "@/lib/demo-data";
import { SectionHeading } from "@/components/ui/motion-primitives";
import { cn, easeOut, spring } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-24 sm:pb-[140px] sm:pt-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <SectionHeading id="faq-title" kicker="FAQs" center>
          Questions, <b>answered.</b>
        </SectionHeading>
        <div className="mx-auto mt-12 max-w-[820px] border-t border-line">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            const id = `faq-${i}`;
            return (
              <div key={f.q} className="border-b border-line">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`${id}-q`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-11 w-full items-center justify-between gap-5 px-1 py-6 text-left font-display text-[clamp(18px,1.6vw,21px)] font-medium tracking-[-.015em]"
                  >
                    {f.q}
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? "#171717" : "rgba(0,0,0,0)", color: isOpen ? "#FFFFFF" : "#171717" }}
                      transition={spring}
                      className={cn("grid size-8 flex-none place-items-center rounded-full", !isOpen && "shadow-[inset_0_0_0_1px_var(--color-line-strong)]")}
                      aria-hidden="true"
                    >
                      <Plus className="size-[15px]" strokeWidth={1.8} />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${id}-a`}
                      role="region"
                      aria-labelledby={`${id}-q`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: easeOut }}
                      className="overflow-hidden"
                    >
                      <p className="m-0 max-w-[700px] pb-[26px] pl-1 pr-14 text-[16.5px] text-muted">{f.a}</p>
                      {f.toConfirm && (
                        <span className="mb-6 ml-1 inline-flex h-6 items-center rounded-full bg-peach px-2.5 text-xs text-[#8A3D12]">To confirm before launch</span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
