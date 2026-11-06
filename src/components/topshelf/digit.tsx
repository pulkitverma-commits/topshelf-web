import { cn } from "@/lib/utils";

export type DigitMood = "" | "blink" | "doze" | "dizzy" | "cheer";

/** Digit, the calculator's little friend. Eyes follow --px/--py set by the parent. */
export function Digit({ mood, look, className }: { mood: DigitMood; look: { x: number; y: number }; className?: string }) {
  const eye = (x: number) => (
    <g className="d-eye" transform={`translate(${x} 46)`}>
      <ellipse className="d-white" rx="8" ry="9" />
      <g className="d-pupil-wrap">
        <circle className="d-pupil" r="3.6" />
        <circle className="d-glint" cx="1.4" cy="-1.6" r="1.1" />
      </g>
      <path className="d-spiral" d="M0 0m-1 0a1 1 0 1 1 2 0a2.5 2.5 0 1 1-5 0a4 4 0 1 1 8 0" />
      <path className="d-lid" d="M-8.5 0h17" />
    </g>
  );
  return (
    <div
      className={cn("digit flex flex-col items-center gap-0.5", mood, className)}
      style={{ "--px": `${look.x}px`, "--py": `${look.y}px` } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 90 112" className="h-[104px] w-[84px] overflow-visible">
        <g className="d-body">
          <path className="d-arm l" d="M14 62q-10 4-12 14" />
          <path className="d-arm r" d="M76 62q10 4 12 14" />
          <rect className="d-shell" x="12" y="20" width="66" height="78" rx="20" />
          <rect className="d-face" x="20" y="28" width="50" height="40" rx="12" />
          <g className="d-eyes">
            {eye(35)}
            {eye(55)}
          </g>
          <path className="d-mouth" d="M39 60q6 4 12 0" />
          <path className="d-smile" d="M37 57q8 11 16 0z" />
          <circle className="d-btn" cx="30" cy="82" r="4" />
          <circle className="d-btn" cx="45" cy="82" r="4" />
          <circle className="d-btn alt" cx="60" cy="82" r="4" />
          <path className="d-antenna" d="M45 20V9" />
          <circle className="d-bulb" cx="45" cy="7" r="4" />
        </g>
        <g className="d-zz">
          <text x="70" y="22">z</text>
          <text x="78" y="12">z</text>
        </g>
      </svg>
      <span className="font-hand text-lg leading-none text-white/80">Digit</span>
    </div>
  );
}
