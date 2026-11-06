"use client";

import { useRef, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { cn, easeOut } from "@/lib/utils";

const finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Gently pulls its child toward the pointer while the pointer is near it. */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.6 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.6 });
  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.span style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className={cn("inline-flex", className)}>
      {children}
    </motion.span>
  );
}

/** A card that tilts toward the pointer with a soft moving highlight. */
export function Tilt({ children, className, max = 5, style, reveal = false, delay = 0 }: { children: ReactNode; className?: string; max?: number; style?: CSSProperties; reveal?: boolean; delay?: number }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 180, damping: 20 });
  const sy = useSpring(py, { stiffness: 180, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glare = useTransform([sx, sy], ([a, b]: number[]) => `radial-gradient(420px circle at ${a * 100}% ${b * 100}%, rgba(255,255,255,.55), transparent 55%)`);
  const active = useRef(false);

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    active.current = true;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    active.current = false;
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={reset}
      {...(reveal
        ? {
            initial: { opacity: 0, y: 28 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "0px 0px -12% 0px" },
            transition: { duration: 0.7, ease: easeOut, delay },
          }
        : {})}
      style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, transformPerspective: 900, ...style }}
      className={cn("group/tilt relative [transform-style:preserve-3d]", className)}
    >
      {children}
      <motion.span aria-hidden="true" style={{ backgroundImage: glare }} className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-300 motion-reduce:hidden [@media(hover:hover)]:group-hover/tilt:opacity-100" />
    </motion.div>
  );
}

const ARROWS: Record<string, [string, string]> = {
  "down-left": ["M50 8C44 28 32 40 12 46", "M22 52l-10-6 8-9"],
  "down-right": ["M10 8C16 28 28 40 48 46", "M38 52l10-6-8-9"],
  "up-left": ["M50 52C44 32 32 20 12 14", "M20 6l-9 8 11 5"],
  "up-right": ["M10 52C14 34 26 22 46 14", "M36 10l11 3-5 10"],
  down: ["M30 4C22 20 36 34 30 52", "M21 44l9 9 8-10"],
  left: ["M52 34C40 26 28 26 10 32", "M18 24l-9 8 10 6"],
  right: ["M8 34C20 26 32 26 50 32", "M42 24l9 8-10 6"],
};

/**
 * A handwritten note with an arrow that draws itself when it scrolls into view.
 * Decorative: anything it says is also said in real text nearby.
 */
export function GuideNote({
  children,
  arrow = "down-left",
  arrowFirst = false,
  className,
  delay = 0.2,
  rotate = -3,
  show = true,
}: {
  children: ReactNode;
  arrow?: keyof typeof ARROWS;
  arrowFirst?: boolean;
  className?: string;
  delay?: number;
  rotate?: number;
  show?: boolean;
}) {
  const [line, head] = ARROWS[arrow];
  const svg = (
    <svg viewBox="0 0 60 60" className="size-12 flex-none sm:size-14" aria-hidden="true">
      <motion.path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.8, delay: delay + 0.25, ease: easeOut }}
      />
      <motion.path
        d={head}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.3, delay: delay + 1, ease: easeOut }}
      />
    </svg>
  );
  return (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0, y: 8, rotate: rotate - 4 }}
      whileInView={{ opacity: show ? 1 : 0, y: 0, rotate }}
      animate={show ? undefined : { opacity: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: easeOut }}
      className={cn("pointer-events-none z-10 flex items-center gap-1 font-hand text-[22px] leading-[1.02] text-ink sm:text-2xl", className)}
    >
      {arrowFirst && svg}
      <span className="max-w-[16ch]">{children}</span>
      {!arrowFirst && svg}
    </motion.span>
  );
}
