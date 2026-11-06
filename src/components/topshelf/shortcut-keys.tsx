"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { useDelight } from "@/components/delight/delight-provider";
import { cn } from "@/lib/utils";

const OTHERS = [
  { keys: "⌃⌥V", label: "Clipboard history" },
  { keys: "⌃⌥T", label: "New quick note" },
  { keys: "⌃⌥D", label: "Dashboard" },
];

/**
 * TopShelf's real default shortcut, as keys you can press on your own keyboard:
 * each key lights up while held, and the full combo gets a little cheer.
 */
export function ShortcutKeys() {
  const { keys, names } = siteConfig.shortcut;
  const [held, setHeld] = useState({ ctrl: false, alt: false, n: false });
  const [hits, setHits] = useState(0);
  const { feedback } = useDelight();

  useEffect(() => {
    const update = (e: KeyboardEvent, down: boolean) => {
      const next = { ctrl: e.ctrlKey, alt: e.altKey, n: e.code === "KeyN" ? down : false };
      setHeld(next);
      if (down && next.ctrl && next.alt && e.code === "KeyN") {
        e.preventDefault();
        setHits((h) => h + 1);
        feedback(document.getElementById("shortcut-keys"));
      }
    };
    const d = (e: KeyboardEvent) => update(e, true);
    const u = (e: KeyboardEvent) => update(e, false);
    const blur = () => setHeld({ ctrl: false, alt: false, n: false });
    window.addEventListener("keydown", d);
    window.addEventListener("keyup", u);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", d);
      window.removeEventListener("keyup", u);
      window.removeEventListener("blur", blur);
    };
  }, [feedback]);

  const on = [held.ctrl, held.alt, held.n];

  return (
    <div className="flex flex-col items-start gap-3.5">
      <button
        id="shortcut-keys"
        type="button"
        onClick={() => {
          setHits((h) => h + 1);
          feedback(document.getElementById("shortcut-keys"));
        }}
        aria-label={`Default shortcut to open TopShelf: ${names.join(" plus ")}. Press it on your keyboard, or click to see it.`}
        className="flex flex-wrap items-center gap-2.5 rounded-2xl p-1 text-left"
      >
        {keys.map((k, i) => (
          <span key={k} className="flex items-center gap-2.5">
            {i > 0 && <em className="text-xl not-italic text-white/50">+</em>}
            <motion.span
              key={`${k}-${hits}`}
              initial={hits ? { y: 0 } : false}
              animate={hits ? { y: [0, 5, 0] } : undefined}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className={cn(
                "grid h-16 min-w-16 place-items-center rounded-[14px] px-[18px] font-display text-[22px] font-medium transition-[background-color,color,box-shadow,transform] duration-150",
                on[i] ? "translate-y-1 bg-accent text-white shadow-[0_0_0_4px_rgba(84,104,255,.35)]" : "bg-white text-ink shadow-[0_5px_0_rgba(255,255,255,.25)]",
                !hits && !on.some(Boolean) && "loop-press",
              )}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {k}
            </motion.span>
          </span>
        ))}
      </button>
      <span className="relative font-hand text-[22px] text-white/85">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={hits ? "yay" : "try"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="block">
            {hits ? "that's it. TopShelf would be open now." : "go on, press it on your keyboard"}
          </motion.span>
        </AnimatePresence>
      </span>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0 text-[13px] text-white/70">
        {OTHERS.map((o) => (
          <li key={o.keys} className="rounded-full bg-white/[.08] px-3 py-1.5">
            <b className="font-display font-medium tabular-nums text-white">{o.keys}</b> {o.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
