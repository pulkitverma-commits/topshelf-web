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
  | "focus"
  | "notes"
  | "live"
  | "wellness"
  | "calc"
  | "inbox"
  | "scores"
  | "clipboard"
  | "system"
  | "all"
  | "assistant";

export interface Feature {
  id: FeatureId;
  label: string;
  kicker: string;
  title: string;
  body: string;
  stage: string;
  /** What changed in 1.1. */
  next?: string;
  experimental?: boolean;
}

export const FEATURES: Feature[] = [
  {
    id: "music",
    label: "Music",
    kicker: "Now Playing",
    title: "Your soundtrack, always within reach.",
    body: "Apple Music and Spotify, with an optional real spectrum visualiser. Skip, pause or scrub without leaving the window you're working in.",
    stage: "bg-lavender",
  },
  {
    id: "shelf",
    label: "File Shelf",
    kicker: "File Shelf",
    title: "Drop it here. Pick it up anywhere.",
    body: "Park files at the top of your screen and drag them out wherever they're needed. Quick Look, copy path, reveal in Finder. Watch folders like Downloads so finished downloads appear on their own; partial downloads are ignored and originals are never touched.",
    stage: "bg-mint",
    next: "TopShelf opens on the Shelf by default, ⌘-drag any file anywhere to add it, and folders and apps drag back out too.",
  },
  {
    id: "calendar",
    label: "Calendar",
    kicker: "Calendar & meetings",
    title: "Your next meeting, minus the searching.",
    body: "A live countdown to your next event, with one-click join for Zoom, Meet, Teams, Webex and FaceTime. Read-only.",
    stage: "bg-peach",
  },
  {
    id: "focus",
    label: "Timers",
    kicker: "Timers & focus",
    title: "A little focus goes a long way.",
    body: "Stopwatch, countdowns and Pomodoro at the top of your screen, keeping exact time even across sleep.",
    stage: "bg-[#F2F2F0]",
  },
  {
    id: "notes",
    label: "Notes",
    kicker: "Quick Notes",
    title: "Catch a thought before it's gone.",
    body: "Jot it down in a second, right where your cursor already is. Notes stay on your Mac.",
    stage: "bg-sand",
  },
  {
    id: "live",
    label: "Live activities",
    kicker: "Live activities",
    title: "Stay in the know without switching windows.",
    body: "Battery, connected devices and background tasks show up quietly, queued so they never overlap, then step aside.",
    stage: "bg-[#1C1C1E]",
  },
  {
    id: "wellness",
    label: "Wellness",
    kicker: "Wellness reminders",
    title: "Gentle nudges, beautifully animated.",
    body: "Posture, drink water with an 8-glass tracker, eye rest (20-20-20), blink, stretch, stand up, breathe, medicine and your own reminders, with intervals, active hours and weekdays only. Each has a glossy 3D icon that comes alive, and TopShelf blinks until you tap Done or Snooze.",
    stage: "bg-[#FDEFF4]",
  },
  {
    id: "calc",
    label: "Calculator",
    kicker: "Calculator & Digit",
    title: "A calculator with a friend.",
    body: "Candy-glass keys, rolling digits, a live result and a history tape. Meet Digit: it follows your keys, cheers when you press =, gets dizzy if you divide by zero, and dozes off when you leave it alone.",
    stage: "bg-lavender",
  },
  {
    id: "inbox",
    label: "Inbox",
    kicker: "Inbox · opt-in",
    title: "Only the counts that matter.",
    body: "Your Mail unread count for each account, from any account added to Mail, plus your WhatsApp unread count. When a count goes up, TopShelf tells you.",
    stage: "bg-[#EAF1FF]",
  },
  {
    id: "scores",
    label: "Live Scores",
    kicker: "Live Scores · opt-in",
    title: "The match, at a glance.",
    body: "Cricket, football, NBA and NFL. Pick favourite teams: the score slides in every few minutes, and goals, wickets and results are announced instantly.",
    stage: "bg-mint",
  },
  {
    id: "clipboard",
    label: "Clipboard",
    kicker: "Clipboard · opt-in",
    title: "Everything you copied. Nothing you shouldn't.",
    body: "Text and image history that never records passwords, password-manager copies or anything that looks like a key, token or card number. Local only.",
    stage: "bg-[#EEEDF6]",
    next: "Favourites and filters, rich text with copy as plain text, verification codes deleted after two minutes, ↑↓ ↩ and drag out, and AI actions on text.",
  },
  {
    id: "system",
    label: "System",
    kicker: "System",
    title: "Your Mac, at a glance.",
    body: "Battery, CPU, memory, network, Bluetooth, and when your mic or camera is in use.",
    stage: "bg-[#F2F2F0]",
  },
  {
    id: "all",
    label: "All & quick actions",
    kicker: "Pinned modules",
    title: "Pin what you use. Find everything else.",
    body: "Pin up to eight modules to the tab bar. Everything else lives in All, a grid of colourful tiles, with one-tap quick actions: take a break, a 25-minute focus timer, log water, screenshot, new note and settings.",
    stage: "bg-sand",
  },
  {
    id: "assistant",
    label: "Assistant",
    kicker: "Assistant · optional",
    title: "Ask, summarise or rewrite.",
    body: "With Claude, any OpenAI-compatible endpoint or a local Ollama model. Keys are stored in the macOS Keychain, and requests go out only when you start one.",
    stage: "bg-lavender",
  },
];

export const MAC_HIGHLIGHTS = [
  { title: "100% Swift, SwiftUI & AppKit", body: "Native to the Mac, with zero third-party dependencies." },
  { title: "Lines up with the camera", body: "Sits exactly around the camera housing on MacBooks." },
  { title: "Works on every Mac", body: "Draws its own bar on an iMac, Mac mini or external display." },
  { title: "Never steals focus", body: "Hover to expand after 0.18 s; the app you're in stays active." },
  { title: "Springs, not slides", body: "Physical motion that respects Reduce Motion." },
  { title: "Hides in full screen", body: "Full-screen apps get the whole display." },
  { title: "A 3.8 MB download", body: "A universal binary for Apple silicon and Intel." },
  { title: "macOS 14 Sonoma or later", body: "Liquid Glass on macOS 26 and later." },
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
    a: "TopShelf is a Mac app that turns the dark strip around your MacBook's camera into a calm, glanceable home for music, files, meetings, timers and more, and reminds you to take healthy breaks. Move your pointer to the top of the screen to open it; move away and it tucks itself back.",
  },
  {
    q: "Do I need a MacBook with a camera housing?",
    a: "No. On MacBooks with a camera housing at the top of the screen, TopShelf lines up with it exactly. On an iMac, Mac mini or an external display, it draws its own bar at the top centre of the menu bar.",
  },
  {
    q: "Which versions of macOS are supported?",
    a: "macOS 14 Sonoma or later, on Apple silicon or Intel. The 1.1 preview download is a 3.8 MB universal disk image. The Glass theme uses Liquid Glass on macOS 26 and later.",
  },
  {
    q: "Which music players work?",
    a: "Apple Music and Spotify.",
  },
  {
    q: "Will a break interrupt a call or a video?",
    a: "No. Smart Pause holds breaks during calls, video, full-screen apps and focus apps you choose, and waits while you type or drag. Only active screen time counts, and stepping away counts as a break.",
  },
  {
    q: "Can I skip a break?",
    a: "That's up to you. Casual always lets you skip or postpone. Balanced unlocks Skip after 5 seconds, and postponing is always possible. Hardcore has no skip or postpone, only an emergency press-and-hold exit.",
  },
  {
    q: "Will it get in the way?",
    a: "TopShelf never steals focus from the app you're in, and it hides itself in full-screen apps. Hover opens it after a short delay you can adjust.",
  },
  {
    q: "Why does TopShelf drop down when an alarm goes off?",
    a: "That's the Celebration alert, new in 1.1: a short stinger with a headline like TIME'S UP! or MEETING!, then the details. Prefer something calmer? Choose Colour flash or None in Settings › Appearance › Alert animation. With Reduce Motion it's a short fade.",
  },
  {
    q: "Does Inbox read my email?",
    a: "No. Inbox is off until you turn it on. When it's on, it reads only Mail's unread count for each account and announces new mail when a count goes up. It never reads messages, senders or subjects.",
  },
  {
    q: "Will TopShelf slow down Mail?",
    a: "No. It only reads unread counts, about once a minute while Mail is running, and never opens Mail. Asking Mail for the messages themselves makes it load the whole mailbox and freeze on big inboxes, so TopShelf doesn't.",
  },
  {
    q: "What does the WhatsApp integration show?",
    a: "Your WhatsApp unread count.",
  },
  {
    q: "Does the clipboard keep my one-time codes?",
    a: "From 1.1, for two minutes, then they're deleted automatically. You can also choose never to record them. Passwords and anything that looks like a key, token or card number are never recorded.",
  },
  {
    q: "Do Live Scores need an account?",
    a: "No. Live Scores is off until you turn it on, and then it only fetches scores for the competitions you follow.",
  },
  {
    q: "How do I stop it opening at login?",
    a: "From 1.1, TopShelf starts at login by default. Turn it off in Settings › General (or System Settings › Login Items) and it stays off.",
  },
  {
    q: "Is there a free trial?",
    a: `Yes. You can try TopShelf free for ${siteConfig.offers.trial.length} before buying a licence.`,
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
