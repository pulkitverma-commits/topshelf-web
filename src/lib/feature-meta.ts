import { Calculator, Palette, CalendarDays, ClipboardList, Cpu, Droplet, Inbox, LayoutGrid, Music, PartyPopper, Radio, ScanFace, Sparkles, StickyNote, Timer, Trophy, type LucideIcon } from "lucide-react";
import type { FeatureId } from "./demo-data";

/** Icon, pastel and page slug for each module, shared by the marquee, cards and feature pages. */
export const FEATURE_META: Record<FeatureId, { Icon: LucideIcon; bg: string; fg: string; slug: string; seo: string }> = {
  music: { Icon: Music, bg: "#FCE7EF", fg: "#C2336A", slug: "music", seo: "Now playing for Apple Music and Spotify at the top of your Mac" },
  shelf: { Icon: Inbox, bg: "#ECEBFF", fg: "#4357EE", slug: "file-shelf", seo: "A drag-and-drop file shelf at the top of your Mac" },
  calendar: { Icon: CalendarDays, bg: "#FCE7D8", fg: "#B85A1E", slug: "calendar", seo: "A countdown to your next meeting with one-click join" },
  focus: { Icon: Timer, bg: "#E1F3EA", fg: "#1D7F5F", slug: "focus-timer", seo: "Focus and Pomodoro timers for Mac" },
  notes: { Icon: StickyNote, bg: "#FFF0CF", fg: "#9A6A00", slug: "quick-notes", seo: "Quick notes you can jot without leaving your app" },
  live: { Icon: Radio, bg: "#E6F1FF", fg: "#2368C4", slug: "live-activities", seo: "Battery, connected devices and background tasks, shown quietly" },
  wellness: { Icon: Droplet, bg: "#DFF4F7", fg: "#16808F", slug: "wellness", seo: "Water, posture and eye-rest nudges for Mac" },
  calc: { Icon: Calculator, bg: "#F3F0E8", fg: "#6B5A2E", slug: "calculator", seo: "A calculator with live results and a tiny friend called Digit" },
  inbox: { Icon: Inbox, bg: "#E8EEFF", fg: "#3651C9", slug: "inbox", seo: "Mail and WhatsApp unread counts, without reading your messages" },
  scores: { Icon: Trophy, bg: "#E5F6E0", fg: "#2F7D1F", slug: "live-scores", seo: "Live cricket, football, NBA and NFL scores on your Mac" },
  clipboard: { Icon: ClipboardList, bg: "#F1E9FF", fg: "#7A3FD1", slug: "clipboard-history", seo: "Clipboard history for Mac that skips passwords" },
  system: { Icon: Cpu, bg: "#ECEDEF", fg: "#3D4350", slug: "system-stats", seo: "Battery, CPU, memory, network and Bluetooth at a glance" },
  all: { Icon: LayoutGrid, bg: "#FFE9E3", fg: "#C2452D", slug: "quick-actions", seo: "Every module and your quick actions in one view" },
  assistant: { Icon: Sparkles, bg: "#EAE8FF", fg: "#5146D9", slug: "assistant", seo: "An experimental assistant: Claude, OpenAI-compatible or Ollama" },
};

/** Icon and pastel for the long-form pages that live outside the module playground (see `pages.ts`). */
export const EXTRA_PAGES: Record<"breaks" | "celebration" | "sense" | "themes", { slug: string; Icon: LucideIcon; bg: string; fg: string }> = {
  breaks: { slug: "break-reminders", Icon: Timer, bg: "#E1F3EA", fg: "#1D7F5F" },
  celebration: { slug: "celebration-alerts", Icon: PartyPopper, bg: "#ECEBFF", fg: "#4357EE" },
  /** TopShelf Sense: announced for the next update, not in the downloadable build yet. */
  sense: { slug: "sense", Icon: ScanFace, bg: "#EAF4FB", fg: "#245E8C" },
  themes: { slug: "themes", Icon: Palette, bg: "#F3F0E8", fg: "#6B5A2E" },
};

/** Look up an extra page's icon and pastel by slug. */
export function extraPageMeta(slug: string) {
  return Object.values(EXTRA_PAGES).find((e) => e.slug === slug) ?? null;
}
