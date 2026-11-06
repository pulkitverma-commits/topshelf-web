"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { siteConfig } from "@/config/site";
import { DownloadButton } from "./download";

/** A small download pill that follows you down the page, between the hero and the final call to action. */
export function StickyDownload() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const end = document.getElementById("download")?.offsetTop ?? Infinity;
    setShow(y > window.innerHeight * 1.1 && y + window.innerHeight < end + 120);
  });

  return (
    <AnimatePresence>
      {show && !closed && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 40, x: "-50%" }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-5 left-1/2 z-[65] hidden items-center gap-3 rounded-full bg-white/85 py-1.5 pl-5 pr-1.5 shadow-[0_24px_50px_-20px_rgba(23,23,23,.35),inset_0_0_0_1px_var(--color-line)] backdrop-blur-xl sm:flex"
        >
          <span className="whitespace-nowrap text-[14px]">
            <b className="font-display font-semibold">TopShelf {siteConfig.release.version}</b>
            <span className="text-muted"> · free for {siteConfig.offers.trial.length}</span>
          </span>
          <DownloadButton size="sm" />
          <button type="button" onClick={() => setClosed(true)} aria-label="Hide download bar" className="grid size-9 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink">
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
