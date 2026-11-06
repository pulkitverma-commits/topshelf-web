"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Battery,
  BatteryCharging,
  Headphones,
  Upload,
  Zap,
} from "lucide-react";
import { Equalizer } from "@/components/topshelf/bits";
import { cn, spring } from "@/lib/utils";

const bar = "absolute left-1/2 -translate-x-1/2 bg-black text-white";

type Activity = "battery" | "audio" | "upload";

export function LiveDemo() {
  const [activity, setActivity] = useState<Activity>("battery");
  const [charging, setCharging] = useState(true);
  const [upload, setUpload] = useState(0);

  useEffect(() => {
    if (activity !== "upload" || upload >= 100) return;
    const id = window.setTimeout(() => setUpload((u) => Math.min(100, u + 4)), 1000);
    return () => window.clearTimeout(id);
  }, [activity, upload]);

  const widths: Record<Activity, number> = { battery: 300, audio: 330, upload: 360 };
  const choose = (a: Activity) => {
    if (a === "upload" && (activity !== "upload" || upload >= 100)) setUpload(0);
    setActivity(a);
  };

  return (
    <div className="absolute inset-0">
      <motion.div
        animate={{ width: widths[activity] }}
        transition={spring}
        className={cn(bar, "top-10 flex h-[46px] max-w-[90%] items-center justify-between overflow-hidden rounded-b-3xl px-4 text-[13px] shadow-[0_0_0_1px_rgba(255,255,255,.06),0_30px_60px_-20px_rgba(0,0,0,.8)]")}
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={activity} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="flex w-full items-center justify-between gap-3 whitespace-nowrap">
            {activity === "battery" && (
              <>
                <span className="flex items-center gap-2">
                  {charging ? <Zap className="size-4 text-[#4ADE9B]" /> : <Battery className="size-4 text-white/70" />}
                  {charging ? "Charging" : "On battery"}
                </span>
                <span className="tabular-nums">86%</span>
              </>
            )}
            {activity === "audio" && (
              <>
                <span className="flex items-center gap-2">
                  <Headphones className="size-4 text-accent-soft" />
                  Headphones
                </span>
                <span className="flex items-center gap-2">
                  Connected <Equalizer bars={3} />
                </span>
              </>
            )}
            {activity === "upload" && (
              <>
                <span className="flex items-center gap-2">
                  <Upload className="size-4 text-[#F5A27A]" />
                  {upload >= 100 ? "Uploaded" : "Uploading 3 files"}
                </span>
                <span className="flex items-center gap-2 tabular-nums">
                  {upload}%
                  <span className="h-1 w-[60px] overflow-hidden rounded bg-white/15">
                    <i className="block h-full rounded bg-[#F5A27A] transition-[width] duration-700" style={{ width: `${upload}%` }} />
                  </span>
                </span>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <p className="absolute inset-x-0 top-[120px] m-0 px-5 text-center text-sm text-white/60">TopShelf shows what&apos;s happening in the background, then gets out of the way. Routine events stay quiet; alarms, meetings, goals and new messages get a Celebration alert from 1.1.</p>

      <ul className="absolute left-1/2 top-[180px] m-0 flex w-[min(380px,86%)] -translate-x-1/2 list-none flex-col gap-2.5 p-0">
        <li className="flex items-center gap-3 rounded-2xl bg-white/5 px-3.5 py-3 text-sm text-white">
          {charging ? <BatteryCharging className="size-[18px] text-[#4ADE9B]" /> : <Battery className="size-[18px] text-white/70" />}
          <span className="flex-1">Battery</span>
          <em className="text-[13px] not-italic text-white/55">{charging ? "Charging" : "On battery"} · 86%</em>
        </li>
        <li className="flex items-center gap-3 rounded-2xl bg-white/5 px-3.5 py-3 text-sm text-white">
          <Headphones className="size-[18px] text-accent-soft" />
          <span className="flex-1">Headphones</span>
          <em className="text-[13px] not-italic text-white/55">Connected</em>
        </li>
        <li className="flex items-center gap-3 rounded-2xl bg-white/5 px-3.5 py-3 text-sm text-white">
          <Upload className="size-[18px] text-[#F5A27A]" />
          <span className="flex-1">Upload</span>
          <span className="h-1 w-[90px] overflow-hidden rounded bg-white/15">
            <i className="block h-full rounded bg-[#F5A27A] transition-[width] duration-700" style={{ width: `${upload}%` }} />
          </span>
        </li>
      </ul>

      <div className="absolute inset-x-0 bottom-10 flex flex-wrap justify-center gap-2 px-3">
        {(
          [
            ["battery", "Battery"],
            ["audio", "Headphones"],
            ["upload", "Upload"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => choose(id)}
            aria-pressed={activity === id}
            className={cn(
              "inline-flex h-11 items-center rounded-full px-4 text-sm transition-[background-color,transform] duration-300 ease-spring active:scale-95",
              activity === id ? "bg-white text-[#111]" : "bg-white/[.08] text-white/85 hover:bg-white/[.14]",
            )}
          >
            {label}
          </button>
        ))}
        {activity === "battery" && (
          <button type="button" onClick={() => setCharging((c) => !c)} className="inline-flex h-11 items-center rounded-full bg-white/[.08] px-4 text-sm text-white/85 hover:bg-white/[.14]">
            {charging ? "Unplug charger" : "Plug in charger"}
          </button>
        )}
      </div>
    </div>
  );
}
