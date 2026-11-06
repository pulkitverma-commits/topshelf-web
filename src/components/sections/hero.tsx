"use client";

import { AnimatePresence, motion } from "motion/react";
import { Download, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useDemo } from "@/components/demo-provider";
import { DesktopWindow, Dock, MacBook, MenuBar } from "@/components/mac/macbook";
import { HeroBar, useBarController } from "@/components/topshelf/hero-bar";
import { DeskFile, useDesktopDrop } from "@/components/topshelf/shelf";
import { ButtonLink, Value } from "@/components/ui/primitives";
import { easeOut } from "@/lib/utils";

export function Hero() {
  const controller = useBarController();
  const { files } = useDemo();
  const desktopDrop = useDesktopDrop();
  const deskFiles = files.filter((f) => !f.inTray);
  const uptop = siteConfig.flags.heroVariant === "uptop";

  return (
    <section id="top" aria-labelledby="hero-title" className="pb-20 pt-10 text-center sm:pb-[120px] sm:pt-16">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-4 sm:px-8">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="inline-flex h-[34px] items-center gap-2 rounded-full bg-white pl-1.5 pr-3.5 text-sm text-[#3a3a3a] shadow-[inset_0_0_0_1px_var(--color-line)]"
        >
          <span className="grid size-6 place-items-center rounded-full bg-lavender text-accent">
            <Sparkles className="size-3.5" strokeWidth={2} aria-hidden="true" />
          </span>
          Made for the top of your Mac
        </motion.span>
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.05 }}
          className="m-0 text-balance font-display text-[clamp(44px,7vw,96px)] font-medium leading-[.98] tracking-[-.045em] [&_b]:font-bold"
        >
          {uptop ? (
            <>
              Meet TopShelf. <b>Big things happen up top.</b>
            </>
          ) : (
            <>
              Your Mac has a new <b>favourite spot.</b>
            </>
          )}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.12 }}
          className="m-0 max-w-[560px] text-pretty text-[clamp(18px,1.5vw,21px)] text-muted"
        >
          Music, files, meetings, timers and healthy breaks, beautifully tucked into the top of your Mac. There the moment you reach for it, invisible when you don't.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.18 }}
          className="mt-1.5 flex flex-wrap justify-center gap-3"
        >
          <ButtonLink href={siteConfig.links.download}>
            <Download className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
            Download for macOS
          </ButtonLink>
          <ButtonLink href="#features" variant="ghost">
            See how it works
          </ButtonLink>
        </motion.div>
        <p className="m-0 text-sm text-muted">
          Requires macOS <Value>{siteConfig.requirements.minMacOS}</Value> or later
          {siteConfig.offers.trial.enabled && (
            <>
              {" · "}
              <Value>{siteConfig.offers.trial.length}</Value> free trial
            </>
          )}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: easeOut, delay: 0.25 }}
        className="relative mx-auto mt-24 max-w-[1200px] px-4 sm:mt-[120px] sm:px-8"
      >
        <AnimatePresence>
          {!controller.open && (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="pointer-events-none absolute -top-[70px] left-[calc(50%+16px)] z-[2] flex items-start gap-0.5 sm:-top-[78px] sm:left-[calc(50%+64px)]"
            >
              <svg viewBox="0 0 80 80" className="size-[60px] flex-none animate-bob sm:size-[76px]">
                <motion.path
                  d="M74 12C52 6 26 16 16 58"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 1, ease: easeOut }}
                />
                <motion.path
                  d="M7 47l9 13 11-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, delay: 1.8 }}
                />
              </svg>
              <span className="-mt-2 -rotate-[4deg] font-hand text-[22px] leading-none sm:whitespace-nowrap sm:text-[27px]">
                Go ahead. <br className="sm:hidden" />
                Try TopShelf.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <MacBook className="w-[94%] sm:w-[min(1040px,88%)]" screenClassName="max-sm:aspect-auto max-sm:h-[310px]" onScreenDragOver={desktopDrop.onDragOver} onScreenDrop={desktopDrop.onDrop}>
          <MenuBar />
          <DesktopWindow className="left-[7%] top-[18%] h-[46%] w-[52%] sm:top-[15%] sm:h-[56%] sm:w-[40%]" />
          <div className="absolute right-[3%] top-[17%] z-[3] flex flex-col items-center gap-1 sm:top-[13%] sm:gap-3">
            <AnimatePresence initial={false}>
              {deskFiles.map((f) => (
                <DeskFile key={f.id} file={f} onActivate={() => controller.show("shelf", true)} />
              ))}
            </AnimatePresence>
          </div>
          <Dock />
          <HeroBar controller={controller} />
        </MacBook>
      </motion.div>
    </section>
  );
}
