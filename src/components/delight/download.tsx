"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Download, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/primitives";
import { easeOut } from "@/lib/utils";

const EVENT = "topshelf:download";

/** Every "download" button on the site: a real DMG download plus a short install guide. */
export function DownloadButton({
  children,
  variant = "dark",
  size = "md",
  className,
}: {
  children?: ReactNode;
  variant?: "dark" | "light" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <ButtonLink
      href={siteConfig.links.dmg}
      download
      variant={variant}
      size={size}
      className={className}
      onClick={(e) => window.dispatchEvent(new CustomEvent(EVENT, { detail: e.currentTarget }))}
    >
      {children ?? (
        <>
          <Download className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
          Download free
        </>
      )}
    </ButtonLink>
  );
}

/** The sheet that appears once a download starts: three steps to a working TopShelf. */
export function InstallSheet({ onStart }: { onStart?: (el: HTMLElement | null) => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = (e: Event) => {
      setOpen(true);
      onStart?.((e as CustomEvent<HTMLElement>).detail ?? null);
    };
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, [onStart]);

  // Tucks itself away after a while, like TopShelf does.
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => setOpen(false), 16000);
    return () => window.clearTimeout(id);
  }, [open]);

  const steps = [
    `Open ${siteConfig.links.dmg.split("/").pop()} from Downloads`,
    "Drag TopShelf into Applications",
    "Open TopShelf and move your pointer to the top of the screen",
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.45, ease: easeOut }}
          className="fixed bottom-4 right-4 z-[80] w-[min(360px,calc(100vw-32px))] rounded-[26px] bg-ink p-5 text-left text-white shadow-[0_40px_80px_-30px_rgba(0,0,0,.6)] sm:bottom-6 sm:right-6"
        >
          <button type="button" onClick={() => setOpen(false)} aria-label="Close install steps" className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white">
            <X className="size-4" />
          </button>
          <p className="m-0 flex items-center gap-2 font-display text-[17px] font-semibold">
            <span className="grid size-7 place-items-center rounded-full bg-[#2FBF9B] text-[#04241b]">
              <Check className="size-4" strokeWidth={2.6} aria-hidden="true" />
            </span>
            Your download has started
          </p>
          <ol className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
            {steps.map((s, i) => (
              <motion.li key={s} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.12 }} className="flex gap-3 text-[14px] text-white/85">
                <span className="grid size-6 flex-none place-items-center rounded-full bg-white/10 text-[12px] tabular-nums">{i + 1}</span>
                {s}
              </motion.li>
            ))}
          </ol>
          <p className="m-0 mt-4 text-[12.5px] text-white/55">
            Free for {siteConfig.offers.trial.length}, then {siteConfig.offers.lifetime.price} once.{" "}
            <a href="/download#install" className="text-white underline underline-offset-4">
              Install help
            </a>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
