"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { CUSTOMISER } from "@/lib/demo-data";
import { MenuBar, Wallpaper } from "@/components/mac/macbook";
import { AlbumArt, FileIcon } from "@/components/topshelf/bits";
import { Reveal, SectionHeading } from "@/components/ui/motion-primitives";
import { Button } from "@/components/ui/primitives";
import { cn, spring } from "@/lib/utils";

type Prefs = {
  appearance: "dark" | "light";
  size: "compact" | "expanded";
  material: "solid" | "graphite" | "frosted";
  layout: "a" | "b" | "c";
  accent: string;
};
type Widget = "music" | "calendar" | "focus" | "shelf";

function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
      <legend className="mb-2.5 p-0 text-[13px] uppercase tracking-[.08em] text-muted">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-11 rounded-full px-4 text-sm transition-[background-color,color,transform] duration-300 ease-spring active:scale-95",
              value === o.value ? "bg-ink text-white" : "bg-white shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:bg-[#fafafa]",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const PANEL_BG: Record<Prefs["appearance"], Record<Prefs["material"], string>> = {
  dark: { solid: "#000000", graphite: "#2C2C2E", frosted: "rgba(20,20,26,0.48)" },
  light: { solid: "#FFFFFF", graphite: "#E6E6EA", frosted: "rgba(255,255,255,0.5)" },
};

export function Customiser() {
  const [prefs, setPrefs] = useState<Prefs>({ ...CUSTOMISER.defaults });
  const set = <K extends keyof Prefs>(key: K) => (value: Prefs[K]) => setPrefs((p) => ({ ...p, [key]: value }));
  const dark = prefs.appearance === "dark";
  const compact = prefs.size === "compact";
  const layout = CUSTOMISER.layouts.find((l) => l.id === prefs.layout) ?? CUSTOMISER.layouts[0];
  const widgets = (compact ? layout.widgets.slice(0, 1) : layout.widgets) as readonly Widget[];

  return (
    <section id="customise" aria-labelledby="customise-title" className="py-24 sm:pb-[140px] sm:pt-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <SectionHeading id="customise-title" kicker="Make it yours">
          Make the top of your Mac <b>your own.</b>
        </SectionHeading>
        <div className="mt-14 grid items-start gap-[clamp(28px,4vw,56px)] min-[901px]:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <Reveal className="flex flex-col gap-[22px]">
            <OptionGroup label="Appearance" value={prefs.appearance} onChange={set("appearance")} options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }]} />
            <OptionGroup label="Size" value={prefs.size} onChange={set("size")} options={[{ value: "compact", label: "Compact" }, { value: "expanded", label: "Expanded" }]} />
            <OptionGroup
              label="Material"
              value={prefs.material}
              onChange={set("material")}
              options={[
                { value: "solid", label: dark ? "Black" : "White" },
                { value: "graphite", label: dark ? "Graphite" : "Silver" },
                { value: "frosted", label: "Frosted" },
              ]}
            />
            <OptionGroup label="Widgets" value={prefs.layout} onChange={set("layout")} options={CUSTOMISER.layouts.map((l) => ({ value: l.id, label: l.label }))} />
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-2.5 p-0 text-[13px] uppercase tracking-[.08em] text-muted">Accent</legend>
              <div className="flex flex-wrap gap-1.5">
                {CUSTOMISER.accents.map((a) => (
                  <button
                    key={a.hex}
                    type="button"
                    aria-pressed={prefs.accent === a.hex}
                    aria-label={a.name}
                    onClick={() => set("accent")(a.hex)}
                    className={cn("grid size-11 place-items-center rounded-full transition-transform duration-300 ease-spring hover:scale-[1.08]", prefs.accent === a.hex && "shadow-[inset_0_0_0_2px_var(--color-ink)]")}
                  >
                    <i className="block size-7 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)]" style={{ background: a.hex }} />
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap items-center gap-3.5">
              <Button onClick={() => setPrefs({ ...CUSTOMISER.defaults })}>
                <RotateCcw className="size-4" strokeWidth={1.8} aria-hidden="true" />
                Reset preview
              </Button>
              <p className="m-0 max-w-[260px] text-[13px] text-muted">A preview on this page only. Your choices aren&apos;t saved to the app.</p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative h-[330px] overflow-hidden rounded-[22px] border-[10px] border-[#1b1b1d] shadow-[0_40px_70px_-40px_rgba(30,30,60,.5)] sm:aspect-[16/10] sm:h-auto" aria-label="TopShelf preview" role="img">
              <Wallpaper />
              <MenuBar size="sm" clock="Wed 10:26" />
              <motion.div
                initial={false}
                animate={{
                  width: compact ? 330 : 560,
                  height: compact ? 82 : 200,
                  backgroundColor: PANEL_BG[prefs.appearance][prefs.material],
                  color: dark ? "#FFFFFF" : "#171717",
                }}
                transition={spring}
                className={cn(
                  "absolute left-1/2 top-0 z-[6] flex max-w-[94%] -translate-x-1/2 gap-2.5 overflow-hidden rounded-b-[28px]",
                  compact ? "px-3 pb-2.5 pt-7" : "px-3.5 pb-3.5 pt-10",
                  prefs.material === "frosted" && "backdrop-blur-[24px] backdrop-saturate-150",
                  prefs.material === "frosted" && (dark ? "shadow-[inset_0_0_0_1px_rgba(255,255,255,.12)]" : "shadow-[inset_0_0_0_1px_rgba(255,255,255,.7),0_20px_40px_-20px_rgba(0,0,0,.2)]"),
                  !dark && prefs.material !== "frosted" && "shadow-[0_20px_40px_-20px_rgba(0,0,0,.35),0_0_0_1px_rgba(0,0,0,.06)]",
                )}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {widgets.map((w) => (
                    <motion.div
                      key={`${w}-${compact}`}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={spring}
                      className={cn(
                        "flex min-w-0 flex-1 rounded-[18px]",
                        compact ? "flex-row items-center gap-2.5 px-2" : "flex-col gap-2 p-3",
                        !compact && (dark ? "bg-white/[.08]" : "bg-ink/5"),
                      )}
                    >
                      <PreviewWidget kind={w} compact={compact} accent={prefs.accent} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              <span className="absolute bottom-3.5 right-4 z-[6] inline-flex h-[30px] items-center rounded-full bg-white/70 px-3 text-xs text-[#333] backdrop-blur-md">Preview</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PreviewWidget({ kind, compact, accent }: { kind: Widget; compact: boolean; accent: string }) {
  const sub = "text-xs opacity-60";
  const bar = (pct: string) =>
    !compact && (
      <div className="relative h-1 overflow-hidden rounded bg-current/15">
        <motion.i className="absolute inset-y-0 left-0 rounded" animate={{ backgroundColor: accent }} style={{ width: pct }} />
      </div>
    );
  if (kind === "music")
    return (
      <>
        <div className="flex min-w-0 items-center gap-2.5">
          <AlbumArt art="a1" className={cn(compact ? "size-[30px] rounded-lg" : "size-11 rounded-[10px]")} />
          <div className="min-w-0">
            <div className="truncate font-display text-sm font-semibold">Paper Lanterns</div>
            <div className={sub}>Mira Okafor</div>
          </div>
        </div>
        {bar("38%")}
      </>
    );
  if (kind === "calendar")
    return (
      <>
        <div className="min-w-0">
          <div className={sub}>In 4 min · 10:30</div>
          <div className="truncate font-display text-sm font-semibold">Design review</div>
        </div>
        {!compact && (
          <motion.span animate={{ backgroundColor: accent }} className="inline-flex h-6 items-center self-start rounded-full px-2.5 text-[11px] text-white">
            Join
          </motion.span>
        )}
      </>
    );
  if (kind === "focus")
    return (
      <>
        <div className={cn("font-display font-semibold leading-none tracking-[-.03em] tabular-nums", compact ? "text-lg" : "text-[30px]")}>25:00</div>
        {!compact && <div className={sub}>Focus session</div>}
        {bar("64%")}
      </>
    );
  return (
    <>
      <div className="flex gap-1.5">
        <FileIcon kind="pdf" className="h-[30px] w-6" />
        <FileIcon kind="img" className="h-[30px] w-6" />
        <FileIcon kind="key" className="h-[30px] w-6" />
      </div>
      <div className={sub}>3 files on the Shelf</div>
    </>
  );
}
