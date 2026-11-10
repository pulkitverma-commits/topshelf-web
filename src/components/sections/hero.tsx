"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, useSpring } from "motion/react";
import { Download, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useDemo } from "@/components/demo-provider";
import { DesktopWindow, Dock, MacBook, MenuBar } from "@/components/mac/macbook";
import { HeroBar, useBarController } from "@/components/topshelf/hero-bar";
import { DeskFile, useDesktopDrop } from "@/components/topshelf/shelf";
import { ButtonLink } from "@/components/ui/primitives";
import { DownloadButton } from "@/components/delight/download";
import { Magnetic } from "@/components/delight/interactive";
import { HeroQuests } from "@/components/delight/quests";
import { easeOut } from "@/lib/utils";

export function Hero() {
  const controller = useBarController();
  const { files } = useDemo();
  const desktopDrop = useDesktopDrop();
  const deskFiles = files.filter((f) => !f.inTray);
  const uptop = siteConfig.flags.heroVariant === "uptop";
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const rx = useSpring(0, { stiffness: 120, damping: 20 });
  const ry = useSpring(0, { stiffness: 120, damping: 20 });

  // The Mac leans a touch toward the pointer, and the bar perks up when the pointer nears it.
  const onStageMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width - 0.5;
    const fy = (e.clientY - r.top) / r.height - 0.5;
    if (!reduce) {
      ry.set(fx * 4);
      rx.set(-fy * 3);
    }
    setNear(Math.abs(fx) < 0.22 && (e.clientY - r.top) / r.height < 0.2);
  };
  const onStageLeave = () => {
    rx.set(0);
    ry.set(0);
    setNear(false);
  };

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-x-clip pb-20 pt-10 text-center sm:pb-[120px] sm:pt-16">
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-x-0 top-0 -z-10 h-[760px] opacity-80">
        <i className="left-[6%] top-[-6%] size-[380px] bg-[#D9D5FF]" />
        <i className="right-[4%] top-[4%] size-[340px] bg-[#CDEFE0]" />
        <i className="left-[38%] top-[26%] size-[300px] bg-[#FFE0CC]" />
      </div>
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-4 sm:px-8">
        <motion.span
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={reduce ? undefined : { y: -2 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="badge-wrap relative inline-flex"
        >
          {/* Soft halo in the logo colours, slowly turning */}
          <span aria-hidden="true" className="badge-halo pointer-events-none absolute -inset-1 rounded-full" />
          <span className="relative inline-flex h-[38px] items-center gap-2.5 overflow-hidden rounded-full bg-white/90 pl-1.5 pr-4 text-[15px] text-[#3a3a3a] shadow-[0_8px_24px_-14px_rgba(84,104,255,.55)] backdrop-blur">
            {/* Rotating gradient ring and a light sweep */}
            <span aria-hidden="true" className="badge-ring pointer-events-none absolute inset-0 rounded-full" />
            <span aria-hidden="true" className="badge-sweep pointer-events-none absolute inset-0 rounded-full" />
            <motion.span
              className="badge-icon relative grid size-[26px] place-items-center rounded-full text-white shadow-[inset_0_1px_0_rgba(255,255,255,.35)]"
              animate={reduce ? undefined : { rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
              transition={reduce ? undefined : { duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.2 }}
            >
              <Sparkles className="size-[15px]" strokeWidth={2.2} aria-hidden="true" />
            </motion.span>
            <span className="relative">
              Made for the <span className="text-logo font-semibold">top of your Mac</span>
            </span>
          </span>
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
          <Magnetic>
            <DownloadButton>
              <Download className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
              Download free for Mac
            </DownloadButton>
          </Magnetic>
          <ButtonLink href="#features" variant="ghost">
            See how it works
          </ButtonLink>
        </motion.div>
        <p className="m-0 text-sm text-muted">
          Free for {siteConfig.offers.trial.length}, then {siteConfig.offers.lifetime.price} once · macOS {siteConfig.requirements.minMacOS} or later · {siteConfig.release.size}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: easeOut, delay: 0.25 }}
        className="relative mx-auto mt-24 max-w-[1200px] px-4 sm:mt-[120px] sm:px-8"
      >
        <div ref={stageRef} onPointerMove={onStageMove} onPointerLeave={onStageLeave} className="relative">
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
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={near ? "near" : "far"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="-mt-2 -rotate-[4deg] font-hand text-[22px] leading-none sm:whitespace-nowrap sm:text-[27px]"
                >
                  {near ? (
                    <>
                      Yes, right there! <br className="sm:hidden" />
                      Now hover it.
                    </>
                  ) : (
                    <>
                      Go ahead. <br className="sm:hidden" />
                      Try TopShelf.
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 1600 }}>
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
          <HeroBar controller={controller} near={near} />
        </MacBook>
        </motion.div>
        </div>
        <HeroQuests open={controller.open} show={controller.show} stage={stageRef} />
      </motion.div>
    </section>
  );
}
