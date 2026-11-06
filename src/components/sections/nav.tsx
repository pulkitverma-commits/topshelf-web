"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Download, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/primitives";
import { DownloadButton } from "@/components/delight/download";
import { cn, easeOut } from "@/lib/utils";

const LINKS = [
  { href: "/#tour", label: "Tour" },
  { href: "/#features", label: "Features" },
  { href: "/#breaks", label: "Breaks" },
  { href: "/#new", label: "New in 1.1" },
  { href: "/#privacy", label: "Privacy" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQs" },
];

export function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  return (
    <header
      className={cn(
        "sticky top-0 z-[60] transition-[background-color,box-shadow] duration-300",
        (scrolled || menuOpen) && "bg-canvas/80 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl backdrop-saturate-150",
      )}
    >
      <motion.span
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className={cn("absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent transition-opacity duration-300", scrolled ? "opacity-100" : "opacity-0")}
      />
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between gap-6 px-4 sm:px-8">
        <a href="/" aria-label="TopShelf home" className="text-ink">
          <Logo />
        </a>
        <nav aria-label="Primary" className="hidden gap-6 text-[15px] text-[#3a3a3a] min-[1000px]:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative py-3 after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-smooth hover:text-ink hover:after:scale-x-100"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <DownloadButton size="sm">
            <Download className="size-4" strokeWidth={1.8} aria-hidden="true" />
            <span className="hidden min-[380px]:inline">Download for Mac</span>
            <span className="min-[380px]:hidden">Download</span>
          </DownloadButton>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full min-[1000px]:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="overflow-hidden min-[1000px]:hidden"
          >
            <ul className="m-0 flex list-none flex-col px-4 pb-4 pt-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setMenuOpen(false)} className="flex h-12 items-center border-b border-line font-display text-lg">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
