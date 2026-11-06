"use client";

import { useState } from "react";
import { useDelight } from "@/components/delight/delight-provider";
import { GuideNote } from "@/components/delight/interactive";
import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { MenuBar, Wallpaper } from "@/components/mac/macbook";
import { AlbumArt, FileIcon } from "@/components/topshelf/bits";
import { SoonTag } from "@/components/sections/new-in-11";
import { Reveal, SectionHeading } from "@/components/ui/motion-primitives";
import { Button } from "@/components/ui/primitives";
import { TINT } from "@/lib/stinger";
import { cn, spring } from "@/lib/utils";

const THEMES = [
  { id: "classic", label: "Classic Black", swatch: "#000" },
  { id: "glass", label: "Glass", swatch: "linear-gradient(135deg, rgba(255,255,255,.75), rgba(160,160,190,.35))" },
  { id: "chrome", label: "Chrome", swatch: "linear-gradient(135deg, #8a8f98, #2d3036 60%, #6b7079)" },
  { id: "aurora", label: "Aurora", swatch: "linear-gradient(135deg, #35e0a1, #2ab3ff 50%, #9b5cff)" },
  { id: "midnight", label: "Midnight", swatch: "radial-gradient(1px 1px at 30% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 60%, #fff, transparent), #141b40" },
  { id: "neon", label: "Neon", swatch: "#000" },
  { id: "luxe", label: "Luxe Gold", swatch: "#24221f" },
] as const;
type ThemeId = (typeof THEMES)[number]["id"];
const NEONS = ["#FF3FD8", "#3FF0FF", "#7CFF6B", "#FFB23F"];
const ACCENTS = ["teal", "blue", "purple", "pink", "orange", "green", "red", "yellow"] as const;
const DEFAULTS = { theme: "classic" as ThemeId, neon: NEONS[0], accent: "teal" as (typeof ACCENTS)[number], expanded: true, radius: 12, width: 0, hover: 0.18, stay: 3 };

function Slider({ label, value, min, max, step, format, onChange, tag }: { label: string; value: number; min: number; max: number; step: number; format: (v: number) => string; onChange: (v: number) => void; tag?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="flex items-center gap-2 text-muted">
        {label}
        {tag && <SoonTag className="h-5 px-2 text-[11px]">{tag}</SoonTag>}
        <output className="ml-auto tabular-nums text-ink">{format(value)}</output>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-11 w-full cursor-pointer accent-[var(--color-ink)]" />
    </label>
  );
}

/** The real appearance and size controls from TopShelf's settings, previewed live. */
export function Customiser() {
  const [p, setP] = useState(DEFAULTS);
  const { mark } = useDelight();
  const set = <K extends keyof typeof DEFAULTS>(k: K) => (v: (typeof DEFAULTS)[K]) => setP((x) => ({ ...x, [k]: v }));
  const accent = TINT[p.accent];
  const theme = THEMES.find((t) => t.id === p.theme)!;

  return (
    <section id="customise" aria-labelledby="customise-title" className="py-24 sm:pb-[140px] sm:pt-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <SectionHeading id="customise-title" kicker="Make it yours">
          Seven finishes. <b>Tuned to the pixel.</b>
        </SectionHeading>
        <div className="mt-14 grid items-start gap-[clamp(28px,4vw,56px)] min-[901px]:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <Reveal className="flex flex-col gap-[22px]">
            <fieldset className="m-0 border-0 p-0">
              <legend className="relative mb-2.5 w-full p-0 text-[13px] uppercase tracking-[.08em] text-muted">
                Theme
                <GuideNote arrow="down-right" arrowFirst={false} rotate={3} className="absolute -top-9 right-0 hidden normal-case tracking-normal lg:flex">
                  try Neon
                </GuideNote>
              </legend>
              <div className="flex flex-wrap gap-1.5">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={p.theme === t.id}
                    onClick={(e) => {
                      set("theme")(t.id);
                      if (t.id !== DEFAULTS.theme) mark("x-theme", e.currentTarget);
                    }}
                    className={cn("inline-flex h-11 items-center gap-2 rounded-full pl-2 pr-4 text-sm transition-[background-color,color] duration-300", p.theme === t.id ? "bg-ink text-white" : "bg-white shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:bg-[#fafafa]")}
                  >
                    <i
                      className="block size-6 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.12)]"
                      style={{
                        background: t.swatch,
                        boxShadow: t.id === "neon" ? `inset 0 0 0 2px ${p.neon}, 0 0 8px ${p.neon}` : t.id === "luxe" ? "inset 0 0 0 2px #E2C38C" : undefined,
                      }}
                    />
                    {t.label}
                  </button>
                ))}
              </div>
              <p className="m-0 mt-2.5 text-[13px] text-muted">On macOS 26 and later, Glass uses Apple&apos;s Liquid Glass, refracting and blurring what&apos;s behind it. Animated themes only move while TopShelf is open.</p>
            </fieldset>
            {p.theme === "neon" && (
              <fieldset className="m-0 border-0 p-0">
                <legend className="mb-2.5 p-0 text-[13px] uppercase tracking-[.08em] text-muted">Neon glow</legend>
                <div className="flex flex-wrap items-center gap-1.5">
                  {NEONS.map((c) => (
                    <button key={c} type="button" aria-label={`Glow ${c}`} aria-pressed={p.neon === c} onClick={() => set("neon")(c)} className={cn("grid size-11 place-items-center rounded-full", p.neon === c && "shadow-[inset_0_0_0_2px_var(--color-ink)]")}>
                      <i className="block size-7 rounded-full" style={{ background: c, boxShadow: `0 0 10px ${c}` }} />
                    </button>
                  ))}
                  <label className="grid size-11 cursor-pointer place-items-center rounded-full" aria-label="Pick any colour">
                    <i className="relative block size-7 overflow-hidden rounded-full bg-[conic-gradient(#ff3fd8,#ffb23f,#7cff6b,#3ff0ff,#ff3fd8)]">
                      <input type="color" value={p.neon} onChange={(e) => set("neon")(e.target.value.toUpperCase())} className="absolute -inset-2 size-12 cursor-pointer opacity-0" />
                    </i>
                  </label>
                </div>
              </fieldset>
            )}
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-2.5 p-0 text-[13px] uppercase tracking-[.08em] text-muted">Accent</legend>
              <div className="flex flex-wrap gap-1">
                {ACCENTS.map((a) => (
                  <button key={a} type="button" aria-label={a[0].toUpperCase() + a.slice(1)} aria-pressed={p.accent === a} onClick={() => set("accent")(a)} className={cn("grid size-11 place-items-center rounded-full transition-transform duration-300 ease-spring hover:scale-[1.08]", p.accent === a && "shadow-[inset_0_0_0_2px_var(--color-ink)]")}>
                    <i className="block size-7 rounded-full" style={{ background: TINT[a] }} />
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-2">
              <Slider label="Corner radius" value={p.radius} min={4} max={32} step={1} format={(v) => `${v} pt`} onChange={set("radius")} />
              <Slider label="Width adjustment" value={p.width} min={-40} max={120} step={1} format={(v) => `${v} pt`} onChange={set("width")} />
              <Slider label="Hover delay" value={p.hover} min={0} max={1} step={0.02} format={(v) => `${v.toFixed(2)} s`} onChange={set("hover")} />
              <Slider label="Stay open after use" tag="1.1" value={p.stay} min={0} max={10} step={0.5} format={(v) => (v === 0 ? "Off" : `${v.toFixed(1)} s`)} onChange={set("stay")} />
            </div>
            <div className="flex flex-wrap items-center gap-3.5">
              <Button onClick={() => setP(DEFAULTS)}>
                <RotateCcw className="size-4" strokeWidth={1.8} aria-hidden="true" />
                Reset to defaults
              </Button>
              <p className="m-0 max-w-[260px] text-[13px] text-muted">The same ranges and defaults as TopShelf&apos;s settings. A preview on this page only.</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative h-[340px] overflow-hidden rounded-[22px] border-[10px] border-[#1b1b1d] shadow-[0_40px_70px_-40px_rgba(30,30,60,.5)] sm:aspect-[16/10] sm:h-auto" role="img" aria-label={`TopShelf preview, ${theme.label} theme`}>
              <Wallpaper />
              <MenuBar size="sm" clock="Wed 10:26" />
              <div className="absolute inset-x-0 top-[44px] z-[6] flex justify-center">
                <div className="inline-flex rounded-full bg-white/70 p-1 backdrop-blur-md" role="group" aria-label="Preview size">
                  {[
                    [false, "Compact"],
                    [true, "Expanded"],
                  ].map(([v, label]) => (
                    <button key={String(label)} type="button" aria-pressed={p.expanded === v} onClick={() => set("expanded")(v as boolean)} className={cn("h-8 rounded-full px-3.5 text-xs", p.expanded === v ? "bg-ink text-white" : "text-[#333]")}>
                      {label as string}
                    </button>
                  ))}
                </div>
              </div>
              <motion.div
                initial={false}
                animate={{
                  width: p.expanded ? 560 : 200 + p.width,
                  height: p.expanded ? 210 : 30,
                  borderBottomLeftRadius: p.expanded ? Math.max(p.radius + 12, 22) : p.radius,
                  borderBottomRightRadius: p.expanded ? Math.max(p.radius + 12, 22) : p.radius,
                }}
                transition={spring}
                className={cn("theme absolute left-1/2 top-0 z-[7] max-w-[94%] -translate-x-1/2 overflow-hidden text-white", `theme-${p.theme}`, p.expanded && "live")}
                style={{ "--neon": p.neon } as React.CSSProperties}
              >
                <motion.div initial={false} animate={{ opacity: p.expanded ? 1 : 0 }} className="flex h-full gap-2.5 px-3.5 pb-3.5 pt-9">
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 rounded-[18px] bg-white/[.08] p-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <AlbumArt art="a1" className="size-11 rounded-[10px]" />
                      <div className="min-w-0">
                        <div className="truncate font-display text-sm font-semibold">Paper Lanterns</div>
                        <div className="text-xs opacity-60">Mira Okafor</div>
                      </div>
                    </div>
                    <div className="relative h-1 overflow-hidden rounded bg-white/15">
                      <i className="absolute inset-y-0 left-0 w-[38%] rounded" style={{ background: accent }} />
                    </div>
                  </div>
                  <div className="hidden min-w-0 flex-1 flex-col justify-between gap-2 rounded-[18px] bg-white/[.08] p-3 sm:flex">
                    <div>
                      <div className="text-xs opacity-60">In 4 min · 10:30</div>
                      <div className="truncate font-display text-sm font-semibold">Design review</div>
                    </div>
                    <span className="inline-flex h-6 items-center self-start rounded-full px-2.5 text-[11px] text-black" style={{ background: accent }}>
                      Join
                    </span>
                  </div>
                  <div className="hidden min-w-0 flex-1 flex-col justify-between gap-2 rounded-[18px] bg-white/[.08] p-3 min-[1100px]:flex">
                    <div className="flex gap-1.5">
                      <FileIcon kind="pdf" className="h-[30px] w-6" />
                      <FileIcon kind="img" className="h-[30px] w-6" />
                      <FileIcon kind="key" className="h-[30px] w-6" />
                    </div>
                    <div className="text-xs opacity-60">3 files on the Shelf</div>
                  </div>
                </motion.div>
              </motion.div>
              <span className="absolute bottom-3.5 right-4 z-[6] inline-flex h-[30px] items-center rounded-full bg-white/70 px-3 text-xs text-[#333] backdrop-blur-md">{theme.label}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
