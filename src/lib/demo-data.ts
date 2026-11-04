import { siteConfig } from "@/config/site";

/**
 * Mock data for the website demos. Nothing here connects to macOS services:
 * every interaction on the site is simulated locally in the browser.
 */

export type ArtId = "a1" | "a2" | "a3";

export interface Track {
  title: string;
  artist: string;
  duration: number;
  art: ArtId;
}

export const TRACKS: Track[] = [
  { title: "Paper Lanterns", artist: "Mira Okafor", duration: 214, art: "a1" },
  { title: "Low Tide Static", artist: "The Northbound", duration: 187, art: "a2" },
  { title: "Glasshouse", artist: "Iris & Vale", duration: 242, art: "a3" },
];

export type FileKind = "pdf" | "img" | "key" | "zip";

export interface DemoFile {
  id: string;
  name: string;
  kind: FileKind;
  inTray: boolean;
}

export const INITIAL_FILES: DemoFile[] = [
  { id: "f1", name: "Brief_v3.pdf", kind: "pdf", inTray: false },
  { id: "f2", name: "Moodboard.png", kind: "img", inTray: true },
  { id: "f3", name: "Q4 Plan.key", kind: "key", inTray: false },
  { id: "f4", name: "Assets.zip", kind: "zip", inTray: false },
];

export type FeatureId =
  | "music"
  | "shelf"
  | "calendar"
  | "notes"
  | "focus"
  | "live"
  | "shortcuts"
  | "ai";

export interface Feature {
  id: FeatureId;
  label: string;
  kicker: string;
  title: string;
  body: string;
  stage: string;
  experimental?: boolean;
}

export const FEATURES: Feature[] = [
  {
    id: "music",
    label: "Music",
    kicker: "Music controls",
    title: "Your soundtrack, always within reach.",
    body: "See what's playing, then skip, pause or scrub without leaving the window you're working in.",
    stage: "bg-lavender",
  },
  {
    id: "shelf",
    label: "File Shelf",
    kicker: "File Shelf",
    title: "Drop it here. Pick it up anywhere.",
    body: "Park files at the top of your screen while you move between apps, then drag them out wherever they're needed.",
    stage: "bg-mint",
  },
  {
    id: "calendar",
    label: "Calendar",
    kicker: "Calendar & meetings",
    title: "Your next meeting, minus the searching.",
    body: "Your next event waits up top, with a one-click way into the call when it's time.",
    stage: "bg-peach",
  },
  {
    id: "notes",
    label: "Notes",
    kicker: "Notes & quick capture",
    title: "Catch a thought before it's gone.",
    body: "Jot it down in a second, right where your cursor already is.",
    stage: "bg-sand",
  },
  {
    id: "focus",
    label: "Focus timer",
    kicker: "Timers & focus",
    title: "A little focus goes a long way.",
    body: "Start a focus session from the notch and keep an eye on the time without opening another window.",
    stage: "bg-[#F2F2F0]",
  },
  {
    id: "live",
    label: "Live activities",
    kicker: "Live activities",
    title: "Stay in the know without switching windows.",
    body: "Battery, connected devices and background tasks show up quietly in the notch, then step aside.",
    stage: "bg-[#1C1C1E]",
  },
  {
    id: "shortcuts",
    label: "Shortcuts",
    kicker: "Shortcuts & productivity",
    title: "Small actions. Big time saved.",
    body: "Keep the actions you reach for most one click away, from any app.",
    stage: "bg-[#EEEDF6]",
  },
  {
    id: "ai",
    label: "AI workspace",
    kicker: "AI workspace",
    title: "Your intelligent tools, one glance away.",
    body: "A concept for keeping an assistant and your coding agents in view: what they're doing, and when they need you.",
    stage: "bg-lavender",
    experimental: true,
  },
];

export const AGENT_STEPS = [
  "Reading the codebase",
  "Planning changes",
  "Editing 3 files",
  "Running tests",
  "Ready for your review",
];

export const STORY_STEPS = [
  {
    kicker: "Morning · 9:00",
    title: "Get organised",
    body: "Your first meeting is already waiting up top. One glance and you know what's next.",
    app: "Calendar",
    clock: "Wed 9:20",
    caption: "good morning",
  },
  {
    kicker: "Afternoon · 14:00",
    title: "Stay in the zone",
    body: "Music plays and the focus timer runs. Nothing pulls you out of the work.",
    app: "Pages",
    clock: "Wed 14:06",
    caption: "heads down",
  },
  {
    kicker: "Evening · 18:30",
    title: "Wrap things up",
    body: "Collect today's files on the Shelf, tick off the last task and close the lid.",
    app: "Finder",
    clock: "Wed 18:30",
    caption: "done for the day",
  },
] as const;

export const MAC_HIGHLIGHTS = [
  { title: "Designed specifically for macOS", body: "Made for the Mac and the way you already use it." },
  { title: "Beautifully integrated with the notch", body: "Puts the space around the camera to work." },
  { title: "Quick interactions", body: "Hover, glance, done. Then it tucks itself away." },
  { title: "Smooth animations", body: "Motion that feels physical, never slow." },
  { title: "Light and unobtrusive", body: "Out of sight until you reach for it." },
  { title: "Customisable workspace", body: "Choose your widgets, their order and their look." },
  { title: "Dark and light appearance", body: "Matches how you like your Mac to look." },
  { title: "Works with supported Mac displays", body: "See the system requirements for the full list." },
];

export interface Faq {
  q: string;
  a: string;
  /** Answer still needs confirming against the shipped product. */
  toConfirm?: boolean;
}

export const FAQS: Faq[] = [
  {
    q: "What is TopShelf?",
    a: "TopShelf is a Mac app that turns the notch and the space around it into a small workspace for music, files, your calendar, timers and quick actions. Move your pointer to the top of the screen to open it; move away and it tucks itself back.",
  },
  {
    q: "Does it work on MacBooks without a notch?",
    a: "On Macs and displays without a notch, TopShelf appears as a slim tab at the top centre of the screen and opens the same way.",
    toConfirm: true,
  },
  {
    q: "Which versions of macOS are supported?",
    a: `TopShelf requires macOS ${siteConfig.requirements.minMacOS} or later.`,
    toConfirm: true,
  },
  {
    q: "Does TopShelf work with Apple Music and Spotify?",
    a: "TopShelf shows and controls what's playing in supported music apps. The final list of supported players will be published here.",
    toConfirm: true,
  },
  {
    q: "Can I customise the widgets?",
    a: "Yes. Choose which widgets appear, the order they sit in, and how TopShelf looks, including dark and light appearance.",
    toConfirm: true,
  },
  {
    q: "Does it support multiple displays?",
    a: "Details on multi-display behaviour will be confirmed before launch.",
    toConfirm: true,
  },
  {
    q: "Is there a free trial?",
    a: `Yes. You can try TopShelf free for ${siteConfig.offers.trial.length} before buying a licence.`,
    toConfirm: true,
  },
  {
    q: "How do I install TopShelf?",
    a: "Download TopShelf, open the file and move the app to your Applications folder. Open it once and it will appear at the top of your screen.",
    toConfirm: true,
  },
];

export const CUSTOMISER = {
  defaults: {
    appearance: "dark" as "dark" | "light",
    size: "expanded" as "compact" | "expanded",
    material: "solid" as "solid" | "graphite" | "frosted",
    layout: "a" as "a" | "b" | "c",
    accent: "#5468FF",
  },
  accents: [
    { hex: "#5468FF", name: "Electric blue" },
    { hex: "#8B6CFF", name: "Lavender" },
    { hex: "#2BB389", name: "Mint" },
    { hex: "#F08A5D", name: "Peach" },
    { hex: "#8E8E93", name: "Graphite" },
  ],
  layouts: [
    { id: "a", label: "Music + Calendar", widgets: ["music", "calendar"] },
    { id: "b", label: "Calendar + Focus", widgets: ["calendar", "focus"] },
    { id: "c", label: "Shelf + Music", widgets: ["shelf", "music"] },
  ],
} as const;
