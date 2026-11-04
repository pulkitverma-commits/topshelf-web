import type { ReactNode, DragEventHandler } from "react";
import { Search, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * An illustrated MacBook Pro. Children render inside the display, above the
 * wallpaper. Proportions follow a 16:10 panel with thin bezels and a hinge lip.
 */
export function MacBook({
  children,
  className,
  screenClassName,
  onScreenDragOver,
  onScreenDrop,
}: {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
  onScreenDragOver?: DragEventHandler<HTMLDivElement>;
  onScreenDrop?: DragEventHandler<HTMLDivElement>;
}) {
  return (
    <div className={cn("relative mx-auto", className)}>
      <div className="relative rounded-t-[clamp(12px,2vw,24px)] rounded-b-md bg-[#1b1b1d] p-[1.3%] pb-[1.6%] shadow-[inset_0_0_0_1px_#3d3d40,inset_0_0_0_3px_#0d0d0e,0_60px_90px_-50px_rgba(30,30,60,.5)]">
        <div
          onDragOver={onScreenDragOver}
          onDrop={onScreenDrop}
          className={cn(
            "relative isolate aspect-[16/10] overflow-hidden rounded-t-[clamp(6px,1vw,12px)] rounded-b-[3px] bg-black",
            screenClassName,
          )}
        >
          <Wallpaper />
          {children}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(118deg,rgba(255,255,255,.12)_0,rgba(255,255,255,0)_32%)]" />
        </div>
      </div>
      <div className="relative -mx-[3%] h-[clamp(10px,1.6vw,18px)] rounded-b-[50%_100%] bg-[linear-gradient(180deg,#e6e6e9_0,#c6c6ca_45%,#98989d_100%)] shadow-[0_26px_30px_-22px_rgba(0,0,0,.45)] sm:-mx-[6.5%]">
        <span className="absolute left-1/2 top-0 h-[45%] w-[15%] -translate-x-1/2 rounded-b-[10px] bg-[linear-gradient(#aeaeb3,#c8c8cc)]" />
      </div>
    </div>
  );
}

export function Wallpaper({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("wallpaper absolute inset-0", className)}>
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <path d="M0 720C300 610 620 840 920 700S1400 560 1600 650" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2" />
        <path d="M0 790C320 690 640 900 960 770S1420 640 1600 720" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
        <path d="M0 860C340 780 660 960 990 840S1430 720 1600 800" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="2" />
      </svg>
    </div>
  );
}

/** macOS-style menu bar. Uses a neutral glyph rather than any trademarked logo. */
export function MenuBar({
  app = "Finder",
  clock = "Wed 4 Nov  10:26",
  size = "md",
}: {
  app?: string;
  clock?: string;
  size?: "sm" | "md";
}) {
  const sm = size === "sm";
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-x-0 top-0 z-[5] flex items-center justify-between bg-white/40 font-display font-medium text-black/80 backdrop-blur-xl",
        sm ? "h-6 px-3 text-[10.5px]" : "h-6 px-2.5 text-[10.5px] sm:h-8 sm:px-4 sm:text-[12.5px]",
      )}
    >
      <div className={cn("flex items-center whitespace-nowrap", sm ? "gap-2.5" : "gap-2.5 sm:gap-4")}>
        <span className="relative size-[11px] rounded-[3px] bg-ink after:absolute after:inset-x-[3px] after:top-0 after:h-[3px] after:rounded-b-sm after:bg-white sm:size-[13px]" />
        <b className="font-bold">{app}</b>
        <span>File</span>
        <span>Edit</span>
        {!sm && (
          <>
            <span className="hidden md:inline">View</span>
            <span className="hidden lg:inline">Go</span>
            <span className="hidden lg:inline">Window</span>
            <span className="hidden lg:inline">Help</span>
          </>
        )}
      </div>
      <div className={cn("flex items-center whitespace-nowrap", sm ? "gap-2.5" : "gap-2.5 sm:gap-4")}>
        {!sm && <Wifi className="size-3 sm:size-[15px]" strokeWidth={1.8} />}
        {!sm && <Search className="hidden size-[15px] md:block" strokeWidth={1.8} />}
        <span>{clock}</span>
      </div>
    </div>
  );
}

export function Dock() {
  const tiles = [
    { bg: "#5468FF", dot: "rounded-full" },
    { bg: "#F08A5D", dot: "rounded-[4px]" },
    { bg: "#2BB389", dot: "rounded-full" },
    { bg: "#FFFFFF", dot: "rounded-[3px] !bg-ink" },
    { bg: "#C9C3FF", dot: "rounded-[2px]" },
    { bg: "#FFD36E", dot: "rounded-full" },
  ];
  return (
    <div aria-hidden="true" className="absolute bottom-[2.4%] left-1/2 z-[3] flex -translate-x-1/2 gap-1 rounded-[10px] bg-white/40 px-1.5 py-1 shadow-[inset_0_0_0_.5px_rgba(255,255,255,.7),0_10px_30px_-12px_rgba(40,40,80,.3)] backdrop-blur-xl sm:gap-2 sm:rounded-2xl sm:px-2.5 sm:py-[7px]">
      {tiles.map((t, i) => (
        <span key={i} className="grid aspect-square w-[clamp(18px,3.3vw,40px)] place-items-center rounded-[24%] shadow-[0_2px_6px_rgba(0,0,0,.12)]" style={{ background: t.bg }}>
          <i className={cn("block size-[42%] bg-white/90", t.dot)} />
        </span>
      ))}
      <span className="relative grid aspect-square w-[clamp(18px,3.3vw,40px)] place-items-center rounded-[24%] bg-[#111] after:absolute after:inset-x-[30%] after:top-0 after:h-[20%] after:rounded-b after:bg-white" />
    </div>
  );
}

/** A generic document window used to make the desktop feel lived-in. */
export function DesktopWindow({ className, animated = false }: { className?: string; animated?: boolean }) {
  const lines = ["92%", "84%", "88%", "60%"];
  return (
    <div aria-hidden="true" className={cn("absolute z-[2] flex flex-col overflow-hidden rounded-[10px] bg-white/95 shadow-[0_24px_50px_-20px_rgba(40,40,80,.35),0_0_0_.5px_rgba(0,0,0,.12)]", className)}>
      <div className="flex h-5 flex-none items-center gap-1.5 border-b border-black/5 px-2.5 sm:h-7">
        <i className="size-[7px] rounded-full bg-[#dedee2] sm:size-[9px]" />
        <i className="size-[7px] rounded-full bg-[#dedee2] sm:size-[9px]" />
        <i className="size-[7px] rounded-full bg-[#dedee2] sm:size-[9px]" />
      </div>
      <div className="flex flex-col gap-1.5 px-[9%] py-[8%] sm:gap-[9px]">
        <div className={cn("mb-1.5 h-2.5 w-1/2 rounded bg-[#cfd0d7] sm:h-[13px]", animated && "loop-type")} />
        {lines.map((w, i) => (
          <div
            key={i}
            className={cn("h-[5px] rounded bg-[#E8E8EB] sm:h-[7px]", animated && "loop-type")}
            style={{ width: w, animationDelay: animated ? `${0.4 * (i + 1)}s` : undefined }}
          />
        ))}
      </div>
    </div>
  );
}
