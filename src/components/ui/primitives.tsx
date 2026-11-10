import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn, isPlaceholder } from "@/lib/utils";

type Variant = "dark" | "ghost" | "light" | "outline";

// Every button uses the TopShelf logo gradient (globals.css): filled for primary actions
// (dark, light), a gradient ring for secondary ones (ghost, outline).
const variants: Record<Variant, string> = {
  dark: "btn-logo",
  ghost: "btn-logo-outline",
  light: "btn-logo",
  outline: "btn-logo-outline",
};

const base =
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full active:scale-[.96] disabled:opacity-50";

const sizes = {
  sm: "h-11 px-[18px] text-sm",
  md: "h-[52px] px-6 text-base",
  lg: "h-[58px] px-[30px] text-[17px]",
};

interface CommonProps {
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  variant = "dark",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(base, sizes[size], variants[variant], className)} {...props}>
      {children}
    </a>
  );
}

export function Button({
  variant = "outline",
  size = "sm",
  className,
  children,
  type = "button",
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cn(base, sizes[size], variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

/** Renders a config value, marking unconfirmed "[PLACEHOLDER]" values visibly. */
export function Value({ children, wrap = false }: { children: string; wrap?: boolean }) {
  return isPlaceholder(children) ? <span className={cn("ph", wrap && "!whitespace-normal [overflow-wrap:anywhere]")}>{children}</span> : <>{children}</>;
}

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("m-0 text-[13px] uppercase tracking-[.08em] text-muted", className)}>{children}</p>;
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-display text-[19px] font-bold tracking-[-.02em]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny static brand mark */}
      <img src="/brand/logo-mark.png" width={28} height={28} alt="" aria-hidden="true" className="size-7 object-contain" />
      TopShelf
    </span>
  );
}

/** Hand-drawn annotation: Caveat text with a sketched arrow. */
export function Scribble({
  children,
  className,
  arrow = "down-left",
  arrowFirst = false,
}: {
  children: ReactNode;
  className?: string;
  arrow?: "down-left" | "up-right" | "up-left" | "left";
  arrowFirst?: boolean;
}) {
  const paths: Record<string, [string, string]> = {
    "down-left": ["M50 52C44 34 32 22 12 16", "M20 8l-9 8 11 5"],
    "up-right": ["M10 52C14 34 26 22 46 14", "M36 10l11 3-5 10"],
    "up-left": ["M6 40C22 44 40 34 50 14", "M40 16l10-4 2 11"],
    left: ["M50 50C40 40 30 36 12 34", "M20 26l-9 8 10 6"],
  };
  const [line, head] = paths[arrow];
  const svg = (
    <svg viewBox="0 0 60 60" className="size-14 flex-none" aria-hidden="true">
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d={head} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <span aria-hidden="true" className={cn("pointer-events-none flex items-center gap-1.5 font-hand text-2xl leading-none text-ink", className)}>
      {arrowFirst && svg}
      <span>{children}</span>
      {!arrowFirst && svg}
    </span>
  );
}
