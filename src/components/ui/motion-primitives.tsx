"use client";

import { MotionConfig, motion } from "motion/react";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
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

/** Splits heading text into words that rise in one after another (keeps <b> etc. intact). */
function splitWords(node: ReactNode, counter: { i: number }): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === "string") {
      return child.split(/(\s+)/).map((part, k) => {
        if (!part) return null;
        if (/^\s+$/.test(part)) return part;
        const i = counter.i++;
        return (
          <span key={`${i}-${k}`} className="inline-block overflow-hidden pb-[.08em] align-bottom">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: "105%", opacity: 0 }, shown: { y: "0%", opacity: 1, transition: { duration: 0.7, ease: easeOut, delay: i * 0.045 } } }}
            >
              {part}
            </motion.span>
          </span>
        );
      });
    }
    if (isValidElement(child)) {
      const el = child as ReactElement<{ children?: ReactNode }>;
      return cloneElement(el, undefined, splitWords(el.props.children, counter));
    }
    return child;
  });
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
      <motion.h2
        id={id}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        className="m-0 max-w-[900px] text-balance font-display text-[clamp(34px,4.8vw,64px)] font-medium leading-[1.03] tracking-[-.04em] [&_b]:font-bold"
      >
        <span className="sr-only">{children}</span>
        <span aria-hidden="true">{splitWords(children, { i: 0 })}</span>
      </motion.h2>
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
