"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { MAC_HIGHLIGHTS } from "@/lib/demo-data";
import { Reveal, SectionHeading, Segmented } from "@/components/ui/motion-primitives";
import { Scribble, Value } from "@/components/ui/primitives";
import { spring } from "@/lib/utils";

type Display = "notch" | "flat";

export function BuiltForMac() {
  const [display, setDisplay] = useState<Display>("notch");
  const notch = display === "notch";

  return (
    <section id="built-for-mac" aria-labelledby="mac-title" className="py-24 sm:py-[140px]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <SectionHeading id="mac-title" kicker="Built for Mac">
          Feels like it was <b>always part of your Mac.</b>
        </SectionHeading>
        <div className="mt-14 grid items-start gap-[clamp(32px,5vw,72px)] min-[901px]:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          <Reveal className="flex flex-col items-start gap-5">
            <Segmented
              id="display"
              label="Display type"
              value={display}
              onChange={setDisplay}
              options={[
                { value: "notch", label: "With notch" },
                { value: "flat", label: "Without notch" },
              ]}
            />
            <div aria-hidden="true" className="relative aspect-video w-full overflow-hidden rounded-t-[22px] border-[1.5px] border-b-0 border-ink bg-white [mask-image:linear-gradient(#000_70%,transparent)]">
              <div className="absolute inset-x-0 top-0 flex h-7 items-center justify-between border-b border-line px-4">
                <span className="flex gap-2">
                  <i className="block h-[5px] w-[26px] rounded bg-[#E2E2E5]" />
                  <i className="block h-[5px] w-4 rounded bg-[#E2E2E5]" />
                  <i className="block h-[5px] w-5 rounded bg-[#E2E2E5]" />
                </span>
                <span className="flex gap-2">
                  <i className="block h-[5px] w-3.5 rounded bg-[#E2E2E5]" />
                  <i className="block h-[5px] w-[34px] rounded bg-[#E2E2E5]" />
                </span>
              </div>
              <motion.div
                className="absolute left-[42%] top-0 z-[2] h-7 w-[16%] rounded-b-xl bg-ink"
                animate={{ y: notch ? 0 : "-100%", opacity: notch ? 1 : 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.div
                className="absolute left-1/2 z-[1] flex -translate-x-1/2 gap-2.5 bg-ink px-4 pb-4"
                animate={
                  notch
                    ? { top: 0, width: "52%", height: "46%", paddingTop: 44, borderRadius: "0px 0px 26px 26px" }
                    : { top: 40, width: "46%", height: "40%", paddingTop: 16, borderRadius: "22px 22px 22px 22px" }
                }
                transition={spring}
              >
                <i className="block w-[28%] rounded-[10px] bg-accent" />
                <i className="block flex-1 rounded-[10px] bg-white/[.12]" />
                <i className="block aspect-square w-[22%] self-center rounded-full shadow-[inset_0_0_0_5px_rgba(255,255,255,.18)]" />
              </motion.div>
              <AnimatePresence mode="wait">
                {notch ? (
                  <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute left-[4%] top-[30%] max-md:hidden">
                    <Scribble arrow="up-right" className="text-[22px]">
                      grows out of
                      <br />
                      the notch
                    </Scribble>
                  </motion.div>
                ) : (
                  <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute right-[3%] top-[52%] max-md:hidden">
                    <Scribble arrow="up-left" arrowFirst className="text-[22px]">
                      drops from
                      <br />
                      the top edge
                    </Scribble>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="m-0 min-h-[50px] max-w-[520px] text-muted" aria-live="polite">
              {notch ? (
                "On MacBooks with a notch, TopShelf grows out of the notch itself and folds back into it."
              ) : (
                <>
                  On displays without a notch, TopShelf sits as a slim tab at the top centre of the screen and opens the same way.{" "}
                  <span className="ph">[Confirm behaviour before launch]</span>
                </>
              )}
            </p>
          </Reveal>

          <ul className="m-0 grid list-none border-t border-line p-0">
            {MAC_HIGHLIGHTS.map((h, i) => (
              <Reveal as="li" key={h.title} delay={i * 0.04} className="flex items-baseline gap-4 border-b border-line py-4">
                <span className="w-[22px] flex-none text-xs tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <b className="block font-display text-lg font-semibold tracking-[-.01em]">{h.title}</b>
                  <span className="text-[15px] text-muted">
                    {i === MAC_HIGHLIGHTS.length - 1 ? (
                      <>
                        See <Value>{siteConfig.requirements.systemRequirementsLabel}</Value> for the full list.
                      </>
                    ) : (
                      h.body
                    )}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
