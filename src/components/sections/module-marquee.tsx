"use client";

import { FEATURES } from "@/lib/demo-data";
import { FEATURE_META } from "@/lib/feature-meta";
import { siteConfig } from "@/config/site";

/** A slow, colourful ribbon of every module. Tap one to open it in the playground. */
export function ModuleMarquee() {
  const list = FEATURES.filter((f) => siteConfig.flags.aiWorkspace || !f.experimental);
  const open = (id: string) => {
    window.dispatchEvent(new CustomEvent("topshelf:feature", { detail: id }));
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const row = (hidden: boolean) =>
    list.map((f) => {
      const m = FEATURE_META[f.id];
      return (
        <li key={`${f.id}-${hidden}`} aria-hidden={hidden || undefined}>
          <button
            type="button"
            tabIndex={hidden ? -1 : 0}
            onClick={() => open(f.id)}
            className="group inline-flex h-12 items-center gap-2.5 whitespace-nowrap rounded-full pl-1.5 pr-5 text-[15px] text-ink transition-transform duration-300 ease-spring hover:-translate-y-0.5 hover:rotate-[-1.5deg]"
            style={{ background: m.bg }}
          >
            <span className="grid size-9 place-items-center rounded-full bg-white/80 transition-transform duration-300 ease-spring group-hover:scale-110" style={{ color: m.fg }}>
              <m.Icon className="size-[18px]" strokeWidth={1.9} aria-hidden="true" />
            </span>
            {f.label}
            <span className="sr-only">: open in the playground</span>
          </button>
        </li>
      );
    });

  return (
    <section aria-label="Modules" className="marquee relative overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <ul className="marquee-track m-0 flex w-max list-none gap-3 p-0">
        {row(false)}
        {row(true)}
      </ul>
    </section>
  );
}
