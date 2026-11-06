"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export type WellnessKind = "posture" | "water" | "eyes" | "blink" | "breathe" | "medicine";

/** Glossy 3D illustrated icons for the wellness reminders; `live` animates them. */
export function WellnessArt({ kind, live = true, className }: { kind: WellnessKind; live?: boolean; className?: string }) {
  const u = useId().replace(/:/g, "");
  const g = (n: string) => `${n}-${u}`;
  const base = (
    <>
      <rect className="t-base" x="4" y="4" width="76" height="76" rx="22" />
      <rect x="4" y="4" width="76" height="76" rx="22" fill={`url(#${g("shade")})`} />
    </>
  );
  const eyeball = (
    <>
      <circle cx="42" cy="44" r="24" fill={`url(#${g("ball")})`} />
    </>
  );
  return (
    <svg viewBox="0 0 84 84" className={cn("ani", `ani-${kind}`, live && "live", className)} aria-hidden="true">
      <defs>
        <linearGradient id={g("shade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".18" />
          <stop offset=".55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".32" />
        </linearGradient>
        <radialGradient id={g("ball")} cx=".38" cy=".32" r=".75">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".7" stopColor="#e6ecf5" />
          <stop offset="1" stopColor="#b9c4d6" />
        </radialGradient>
        <radialGradient id={g("iris")} cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#9fe0ff" />
          <stop offset="1" stopColor="#1f63c9" />
        </radialGradient>
        <radialGradient id={g("orb")} cx=".38" cy=".32" r=".8">
          <stop offset="0" stopColor="#d9fff2" />
          <stop offset=".55" stopColor="#55d6ad" />
          <stop offset="1" stopColor="#14876a" />
        </radialGradient>
        <linearGradient id={g("pa")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a8f" />
          <stop offset="1" stopColor="#d93c3c" />
        </linearGradient>
        <linearGradient id={g("pb")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#cfd6e2" />
        </linearGradient>
        <linearGradient id={g("water")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fdcff" />
          <stop offset="1" stopColor="#2f84e0" />
        </linearGradient>
        <clipPath id={g("glass")}>
          <path d="M28 18h28l-4 50H32z" />
        </clipPath>
      </defs>
      {base}
      {kind === "posture" && (
        <>
          <path className="chair" d="M24 66V46h22M24 46V28" />
          <g className="torso">
            <path className="spine" d="M37 48 35 30" />
            <circle cx="35" cy="21" r="6.5" fill="#f4f6fb" />
            <path className="spine" d="M36 34l13 8" />
          </g>
          <path className="spine" d="M37 48h13v18" />
          <ellipse cx="42" cy="15" rx="26" ry="7" fill="#fff" opacity=".22" />
        </>
      )}
      {kind === "water" && (
        <>
          <path d="M28 18h28l-4 50H32z" fill="rgba(255,255,255,.22)" />
          <g clipPath={`url(#${g("glass")})`}>
            <g className="water">
              <path d="M0 0q10-5 20 0t20 0 20 0 20 0 20 0 20 0 20 0V80H0z" fill={`url(#${g("water")})`} />
            </g>
            <circle className="bub b1" cx="38" cy="62" r="2" />
            <circle className="bub b2" cx="46" cy="64" r="1.5" />
            <circle className="bub b3" cx="42" cy="60" r="2.4" />
          </g>
          <path className="glass" d="M28 18h28l-4 50H32z" />
          <path d="M31 22l2.5 40" stroke="#fff" strokeOpacity=".6" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
      {(kind === "eyes" || kind === "blink") && (
        <>
          {eyeball}
          <g className="iris">
            <circle cx="42" cy="44" r="10" fill={`url(#${g("iris")})`} />
            <circle className="pupil" cx="42" cy="44" r="4.6" fill="#0b1426" />
            <circle cx="38.5" cy="40.5" r="2.2" fill="#fff" />
          </g>
          {kind === "blink" && <path className="lid" d="M17 44a25 25 0 0 1 50 0z" />}
        </>
      )}
      {kind === "breathe" && <circle className="b-core" cx="42" cy="44" r="18" fill={`url(#${g("orb")})`} />}
      {kind === "medicine" && (
        <g className="capsule">
          <path d="M42 31h-9a13 13 0 0 0 0 26h9z" fill={`url(#${g("pa")})`} />
          <path d="M42 31h9a13 13 0 0 1 0 26h-9z" fill={`url(#${g("pb")})`} />
          <path d="M28 37q4-4 12-4" stroke="#fff" strokeOpacity=".75" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
