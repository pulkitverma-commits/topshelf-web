"use client";

import { MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";
import { cn, easeOut } from "@/lib/utils";

/** Respects the visitor's reduced-motion setting for every Motion animation. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "p";
}) {
  const Comp = as === "li" ? motion.li : as === "p" ? motion.p : motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease: easeOut, delay }}
    >
      {children}
    </Comp>
  );
}

export function SectionHeading({
  kicker,
  children,
  center = false,
  className,
  id,
}: {
  id?: string;
  kicker: string;
  children: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("flex flex-col gap-[18px]", center && "items-center text-center", className)}>
      <p className="m-0 text-[13px] uppercase tracking-[.08em] text-muted">{kicker}</p>
      <h2 id={id} className="m-0 max-w-[900px] text-balance font-display text-[clamp(34px,4.8vw,64px)] font-medium leading-[1.03] tracking-[-.04em] [&_b]:font-bold">
        {children}
      </h2>
    </Reveal>
  );
}

/** Pill-style segmented control with a sliding selection indicator. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  id,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  id: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex gap-0.5 rounded-full bg-white p-1 shadow-[inset_0_0_0_1px_var(--color-line-strong)]">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative h-10 min-w-11 rounded-full px-[18px] text-sm transition-colors duration-200",
              selected ? "text-white" : "text-[#444] hover:text-ink",
            )}
          >
            {selected && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
