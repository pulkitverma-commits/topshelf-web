"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/motion-primitives";
import { Logo } from "@/components/ui/primitives";
import { DownloadButton } from "@/components/delight/download";
import { GuideNote, Magnetic } from "@/components/delight/interactive";
import { FEATURES } from "@/lib/demo-data";
import { ALL_STINGERS } from "@/lib/stinger";
import { cn, easeOut } from "@/lib/utils";

/** The app icon used in the install demo: the TopShelf mark on a soft gradient tile. */
export function AppIcon({ className }: { className?: string }) {
  return (
    <span className={cn("relative grid place-items-center", className)}>
      {/* The real app icon (macOS grid: the tile fills ~80 % of the square, so scale it up to match the old flush tile). */}
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset */}
      <img src="/brand/app-icon.png" alt="" aria-hidden="true" className="size-[124%] max-w-none object-contain" />
    </span>
  );
}

function Count({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.2, ease: easeOut, onUpdate: setV });
    return () => c.stop();
  }, [inView, reduce, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/**
 * A disk-image window you can actually use: drag TopShelf onto Applications (or press the
 * icon) and the real download starts. The same move you'll make after it lands.
 */
function InstallWindow() {
  const folder = useRef<HTMLDivElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const [over, setOver] = useState(false);
  const [done, setDone] = useState(false);
  const install = () => {
    setDone(true);
    link.current?.click();
  };

  const hits = (x: number, y: number) => {
    const r = folder.current?.getBoundingClientRect();
    return !!r && x > r.left - 20 && x < r.right + 20 && y > r.top - 20 && y < r.bottom + 20;
  };

  return (
    <div className="relative mx-auto mt-12 w-[min(560px,100%)]">
      <GuideNote arrow="down-right" rotate={-4} className="absolute -left-2 -top-12 hidden sm:flex">
        drag it in. that&apos;s the whole install.
      </GuideNote>
      <div className="overflow-hidden rounded-[22px] bg-white/90 text-left shadow-[0_50px_80px_-40px_rgba(40,40,110,.45),0_0_0_1px_var(--color-line)] backdrop-blur">
        <div className="flex h-9 items-center gap-1.5 border-b border-line px-3.5">
          <i className="size-3 rounded-full bg-[#FF5F57]" />
          <i className="size-3 rounded-full bg-[#FEBC2E]" />
          <i className="size-3 rounded-full bg-[#28C840]" />
          <span className="flex-1 text-center text-[12.5px] text-muted">TopShelf {siteConfig.release.version}</span>
          <span className="w-12" />
        </div>
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-6 py-8 sm:px-10">
          <div className="flex flex-col items-center gap-2">
            {!done ? (
              <motion.button
                type="button"
                drag
                dragSnapToOrigin
                dragElastic={0.6}
                whileDrag={{ scale: 1.08, rotate: -4, zIndex: 20 }}
                whileHover={{ scale: 1.04 }}
                onDrag={(_, i) => setOver(hits(i.point.x - window.scrollX, i.point.y - window.scrollY))}
                onDragEnd={(_, i) => {
                  const ok = hits(i.point.x - window.scrollX, i.point.y - window.scrollY);
                  setOver(false);
                  if (ok) install();
                }}
                onClick={install}
                aria-label={`Install TopShelf: downloads the ${siteConfig.release.size} disk image`}
                className="relative cursor-grab touch-none rounded-[24%] active:cursor-grabbing"
              >
                <AppIcon className="size-20 sm:size-24" />
              </motion.button>
            ) : (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} className="grid size-20 place-items-center rounded-[24%] border-2 border-dashed border-line-strong sm:size-24" aria-hidden="true" />
            )}
            <span className="text-[13px]">TopShelf</span>
          </div>
          <motion.span animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} className="text-accent" aria-hidden="true">
            <ArrowRight className="size-8" strokeWidth={1.6} />
          </motion.span>
          <div ref={folder} className="flex flex-col items-center gap-2">
            <motion.span
              animate={over ? { scale: 1.12, y: -4 } : done ? { scale: [1, 1.15, 1] } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 16 }}
              className={cn("relative grid size-20 place-items-center rounded-2xl transition-colors sm:size-24", over ? "bg-accent/15" : "")}
              aria-hidden="true"
            >
              <svg viewBox="0 0 64 52" className="w-[86%]">
                <path d="M4 10a6 6 0 0 1 6-6h14l6 6h24a6 6 0 0 1 6 6v26a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6z" fill="#6FB6FF" />
                <path d="M4 18a6 6 0 0 1 6-6h44a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6z" fill="#9FD0FF" />
                <path d="M26 26l6-6 6 6M32 20v14M24 38h16" stroke="#3B8AE6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              {done && (
                <motion.span initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }} className="absolute -right-1 -top-1">
                  <AppIcon className="size-9" />
                </motion.span>
              )}
            </motion.span>
            <span className="text-[13px]">Applications</span>
          </div>
        </div>
        <p className="m-0 border-t border-line px-5 py-3 text-center text-[13px] text-muted" aria-live="polite">
          {done ? "Downloading now. Open the disk image and do that once more for real." : "Drag TopShelf onto Applications, or tap it, to download."}
        </p>
      </div>
      <a ref={link} href={siteConfig.links.dmg} download className="hidden" tabIndex={-1} aria-hidden="true" onClick={() => window.dispatchEvent(new CustomEvent("topshelf:download", { detail: folder.current }))}>
        download
      </a>
    </div>
  );
}

export function FinalCta() {
  const facts = [
    { n: <Count to={FEATURES.length} />, label: "modules in one quiet bar" },
    { n: <Count to={ALL_STINGERS.length} />, label: "celebration headlines" },
    { n: <Count to={3.8} decimals={1} suffix=" MB" />, label: "universal download" },
    { n: <Count to={0} />, label: "accounts to create" },
  ];
  return (
    <section id="download" aria-labelledby="download-title" className="relative overflow-hidden bg-[#EEEDFB] pb-[120px] pt-24 text-center sm:pt-[140px]">
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0 -z-0">
        <i className="left-[-10%] top-[-10%] size-[460px] bg-[#C9C3FF]" />
        <i className="right-[-8%] top-[20%] size-[420px] bg-[#BFEBD9]" />
        <i className="bottom-[-20%] left-[30%] size-[480px] bg-[#FFD9C2]" />
      </div>
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-8">
        <Reveal>
          <p className="m-0 text-[13px] uppercase tracking-[.08em] text-muted">
            Free for {siteConfig.offers.trial.length} · then {siteConfig.offers.lifetime.price}, once
          </p>
          <h2 id="download-title" className="m-0 mx-auto mt-4 max-w-[900px] text-balance font-display text-[clamp(34px,4.8vw,64px)] font-medium leading-[1.03] tracking-[-.04em]">
            Give the top of your screen <b className="font-bold">something to do.</b>
          </h2>
        </Reveal>

        <InstallWindow />

        <div className="mt-10 flex flex-col items-center">
          <Magnetic strength={0.22}>
            <DownloadButton size="lg">
              <Download className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
              Download TopShelf {siteConfig.release.version}
            </DownloadButton>
          </Magnetic>
          <p className="mb-0 mt-4 text-sm text-muted">
            {siteConfig.requirements.systemRequirementsLabel} · {siteConfig.release.size} disk image
          </p>
          <p className="mb-0 mt-1 text-sm text-muted">
            Includes Celebration alerts and everything new in 1.1. Prefer the earlier release?{" "}
            <a href={siteConfig.links.dmgStable} download className="underline underline-offset-4 hover:text-ink">
              Download {siteConfig.release.stableVersion} ({siteConfig.release.stableSize})
            </a>
          </p>
        </div>

        <ul className="mx-auto mt-14 grid max-w-[900px] list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
          {facts.map((f, i) => (
            <motion.li
              key={f.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: easeOut }}
              className="flex flex-col items-center gap-1 rounded-3xl bg-white/70 px-3 py-5 shadow-[inset_0_0_0_1px_var(--color-line)] backdrop-blur"
            >
              <b className="font-display text-[34px] font-semibold leading-none tracking-[-.03em]">{f.n}</b>
              <span className="text-[13px] text-muted">{f.label}</span>
            </motion.li>
          ))}
        </ul>
        <p className="mb-0 mt-[22px] font-hand text-[22px]">Made for the little space that does a lot.</p>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    {
      title: "Product",
      links: [
        { href: "/features", label: "Features" },
        { href: "/#tour", label: "Product tour" },
        { href: "/features/break-reminders", label: "Break reminders" },
        { href: "/features/send-securely", label: "Send Securely" },
        { href: "/features/sense", label: "Sense" },
        { href: "/features/device-health", label: "Device Health" },
        { href: "/changelog", label: "What's new" },
        { href: "/#pricing", label: "Pricing" },
        { href: siteConfig.links.downloadPage, label: "Download" },
      ],
    },
    {
      title: "Help",
      links: [
        { href: "/support", label: "Support" },
        { href: "/faq", label: "FAQs" },
        { href: "/download#install", label: "Install guide" },
        { href: `mailto:${siteConfig.email}`, label: "Email us" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About" },
        { href: siteConfig.links.privacy, label: "Privacy policy" },
        { href: siteConfig.links.terms, label: "Terms & licence" },
      ],
    },
  ];
  return (
    <footer className="pb-12 pt-[72px]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex max-w-[300px] flex-col gap-3">
            <a href="/" aria-label="TopShelf home">
              <Logo />
            </a>
            <p className="m-0 text-[14px] text-muted">A calm shelf at the top of your Mac. Free for {siteConfig.offers.trial.length}, then {siteConfig.offers.lifetime.price} once.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-14">
            {cols.map((c) => (
              <div key={c.title} className="flex min-w-[120px] flex-col gap-1">
                <b className="mb-1.5 text-[13px] font-normal uppercase tracking-[.08em] text-muted">{c.title}</b>
                {c.links.map((l) => (
                  <a key={l.label} href={l.href} className="py-2 text-[15px] text-[#2d2d2d] hover:text-black">
                    {l.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-[13px] text-muted">
          <span>
            © {new Date().getFullYear()} {siteConfig.company}. All rights reserved.
          </span>
          <span>Made for Mac.</span>
        </div>
      </div>
    </footer>
  );
}

