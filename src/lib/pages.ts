import { siteConfig } from "@/config/site";
import { FEATURES, type Feature, type FeatureId } from "./demo-data";
import { FEATURE_META } from "./feature-meta";

/** Long-form copy for the two headline features that live outside the module playground. */
export const BREAKS_PAGE = {
  slug: "break-reminders",
  label: "Break reminders",
  kicker: "Break reminders",
  title: "Work in a healthy rhythm. Rest on time.",
  seo: "Break reminders for Mac that wait for your calls",
  body: "By default, 20 minutes of work, then a 20-second break, and a 5-minute long break every third time. All adjustable, and only active time counts.",
  points: [
    { h: "A gentle heads-up", p: "A minute before a break, TopShelf asks: start now, delay 1, 5 or 15 minutes, or skip." },
    { h: "A countdown that follows you", p: "For the last 10 seconds, a small countdown follows your pointer, with optional soft ticks." },
    { h: "A real break", p: "A full-screen break on every display: drifting gradients with film grain, your blurred desktop or your own image, an eye exercise or stretch and water illustrations, a big countdown and today's stats. Then focus goes back to your app." },
    { h: "Smart Pause", p: "Waits while you type or drag, and holds during calls, video, full-screen apps and focus apps you choose. Stepping away counts as a break." },
    { h: "Your schedule", p: "Office hours, planned breaks like lunch or a walk, Shortcut and AppleScript automations, and an optional display sleep on long breaks." },
    { h: "Casual, Balanced or Hardcore", p: "Choose how easy skipping is. Postpone, “I'm rested”, and an emergency press-and-hold exit for when you really need it." },
    { h: "Menu bar and shortcuts", p: "Status and controls in the menu bar, with an optional minutes-left label, plus global shortcuts." },
    { h: "Stats that stay on your Mac", p: "Screen time, breaks taken and skipped, your longest and typical session, top apps, and a 0–100 Screen Score with a 7-day view." },
  ],
};

export const CELEBRATION_PAGE = {
  slug: "celebration-alerts",
  label: "Celebration alerts",
  kicker: "New in 1.1",
  title: "Time's up? Make it an entrance.",
  seo: "Broadcast-style celebration alerts for timers, meetings and goals",
  body: "When an alarm, timer, meeting, reminder, goal or new message arrives, TopShelf plays a short broadcast-style stinger, then folds back into a small pill with the details. All in 1.9 seconds.",
  points: [
    { h: "A 1.9-second stinger", p: "The pill drops below the camera into a wide banner, a colour panel wipes across, the icon drives in, a bold headline slams down with a few sparkles and a scoreboard chip rolls in its value." },
    { h: "Alarms punch twice", p: "Timers, meetings and reminders punch the headline twice. Routine events like a file added, something copied, a new track or a device connecting stay quiet." },
    { h: "Your choice of style", p: "Choose Celebration, Colour flash or None in Settings › Appearance › Alert animation. Reduce Motion turns it into a short fade." },
    { h: "Honest chips", p: "The chip only ever shows a value the alert itself contains. No value, no chip." },
  ],
};

/**
 * TopShelf Sense. Announced for the next update: it is NOT in the downloadable build yet,
 * so every surface that shows it carries the "Coming in the next update" label. Keep the copy
 * free of medical or diagnostic claims; pulse tracking is experimental and is not a heart-rate monitor.
 */
export const SENSE_PAGE = {
  slug: "sense",
  label: "Sense",
  kicker: "Coming in the next update",
  /** Short line for the catalogue card and the home page teaser. */
  blurb: "A privacy-first wellness companion for your screen habits, eye movement and wellness trends",
  title: "Your Mac, looking out for you.",
  seo: "Blink awareness, screen-break nudges, head-position insights and wellness trends, processed privately on your Mac",
  body: "A privacy-first wellness companion that helps you understand screen habits, eye movement patterns and personal wellness trends—right from your Mac.",
  /** Where the feature stands today. Shown verbatim on the page. */
  status: "Sense is coming in the next TopShelf update. It is not in the build you can download today, so there is nothing to switch on yet. This page describes what is being built.",
  points: [
    { h: "Blink awareness", p: "A gentle sense of how often you blink while you work, so long stares at the screen don't go unnoticed." },
    { h: "Screen-break reminders", p: "Nudges to look away and rest your eyes, in step with the break reminders TopShelf already has." },
    { h: "Head-position insights", p: "Notice when you've been leaning in or slumping for a while, and get a quiet prompt to reset." },
    { h: "Personal wellness check-ins", p: "A short, optional check-in on how you feel, kept alongside your day so you can spot patterns over time." },
    { h: "Historical charts", p: "Simple charts of your own trends across days and weeks, on your Mac, for your eyes only." },
    { h: "Experimental pulse tracking", p: "An experimental estimate of rhythm from subtle changes in the camera image. It is not a medical device and not a heart-rate monitor; treat it as a curiosity, not a reading." },
    { h: "Private local-first storage", p: "Everything Sense notices stays in a local store on your Mac. No account, no cloud, no uploads." },
    { h: "Complete control over your data", p: "Export it as CSV or JSON, delete some or all of it whenever you like, and choose how long anything is kept." },
  ],
  /** Plain statements about what Sense does and does not do. */
  privacy: [
    { h: "Off by default", p: "Sense does nothing until you turn it on, and asks for camera access only then. Turn it off and it stops." },
    { h: "Processed on your Mac", p: "The camera image is analysed on the device, in real time. It is never sent anywhere." },
    { h: "No video recorded", p: "Sense keeps numbers, not pictures. No frames, clips or photos are saved." },
    { h: "No face recognition", p: "Sense does not identify who is in front of the Mac, build a face profile or compare faces." },
    { h: "No uploads", p: "There is no account, no sync and no telemetry. Nothing leaves your Mac." },
    { h: "Your data, your retention", p: "Export everything as CSV or JSON, delete it at any time, and set how long history is kept." },
  ],
  disclaimer: "Sense is a wellness companion, not a medical device. It does not diagnose, treat or monitor any health condition, and the experimental pulse estimate is not a heart-rate monitor. If you have a health concern, talk to a professional.",
};

export const RELEASES = [
  {
    version: "1.1 preview",
    build: siteConfig.release.build,
    file: siteConfig.links.dmg,
    size: siteConfig.release.size,
    items: [
      { h: "Celebration alerts", p: "Alarms, timers, meetings, reminders, goals and new messages arrive with a 1.9-second broadcast-style stinger. Choose Celebration, Colour flash or None." },
      { h: "Opens on your Shelf", p: "TopShelf now opens on the File Shelf by default. Hold ⌘ while you drag a file anywhere and it flies onto the shelf. Folders and apps drag back out too." },
      { h: "Stays open while you use it", p: "If the pointer slips out after you've clicked, scrolled or dragged, TopShelf waits (3 seconds by default, adjustable from 0 to 10) before closing." },
      { h: "Install and start at login", p: "Opened from a download or the disk image, TopShelf offers to move itself into Applications, and it starts at login by default." },
      { h: "Clipboard upgrades", p: "Favourites and filters, rich text with copy as plain text, verification codes deleted after two minutes, ↑↓ ↩ and drag out, and AI actions on text." },
    ],
  },
  {
    version: "1.0.0",
    build: "",
    file: siteConfig.links.dmgStable,
    size: siteConfig.release.stableSize,
    items: [
      { h: "First release", p: "Music, File Shelf, Calendar, timers, notes, live activities, wellness reminders, the calculator, Inbox, Live Scores, clipboard history, system stats, quick actions, break reminders and seven themes, in a calm bar at the top of your Mac." },
    ],
  },
];

export interface FeaturePage {
  slug: string;
  id?: FeatureId;
  label: string;
  kicker: string;
  title: string;
  body: string;
  seo: string;
  next?: string;
  stage: string;
  experimental?: boolean;
  /** Announced but not in the downloadable build yet. */
  upcoming?: boolean;
}

export function featurePages(): FeaturePage[] {
  const modules = FEATURES.filter((f) => siteConfig.flags.aiWorkspace || !f.experimental).map((f: Feature) => ({
    slug: FEATURE_META[f.id].slug,
    id: f.id,
    label: f.label,
    kicker: f.kicker,
    title: f.title,
    body: f.body,
    seo: FEATURE_META[f.id].seo,
    next: f.next,
    stage: f.stage,
    experimental: f.experimental,
  }));
  return [
    { ...BREAKS_PAGE, stage: "bg-mint" },
    { ...CELEBRATION_PAGE, stage: "bg-lavender" },
    { slug: SENSE_PAGE.slug, label: SENSE_PAGE.label, kicker: SENSE_PAGE.kicker, title: SENSE_PAGE.title, body: SENSE_PAGE.body, seo: SENSE_PAGE.seo, stage: "bg-[#EAF4FB]", upcoming: true },
    ...modules,
  ];
}
