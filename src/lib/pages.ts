import { latestBuild, siteConfig } from "@/config/site";
import { FEATURES, type Feature, type FeatureId } from "./demo-data";
import { FEATURE_META } from "./feature-meta";

/** Long-form copy for the two headline features that live outside the module playground. */
export const BREAKS_PAGE = {
  slug: "break-reminders",
  label: "Break reminders",
  kicker: "Break reminders · in the 1.1 preview",
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
  kicker: "New in 1.1 · in the preview",
  title: "Time's up? Make it an entrance.",
  seo: "Broadcast-style celebration alerts for timers, meetings and goals",
  body: "When an alarm, timer, meeting, reminder, goal or new message arrives, TopShelf plays a short broadcast-style stinger, then folds back into a small pill with the details. All in 1.9 seconds.",
  points: [
    { h: "A 1.9-second stinger", p: "The pill drops below the camera into a wide banner, a colour panel wipes across, the icon drives in, a bold headline slams down with a few sparkles and a scoreboard chip rolls in its value." },
    { h: "Alarms punch twice", p: "Timers, meetings and reminders punch the headline twice. Routine events like a file added, something copied, a new track or a device connecting stay quiet." },
    { h: "Your choice of style", p: "Choose Celebration, Colour flash or None in Settings › Appearance › Alert animation. Reduce Motion turns it into a short fade." },
    { h: "Quiet by default", p: "Alerts can play a soft wooden tick-tick instead of a chime, or stay silent. Pick Soft tick, System sound, both, or Silent." },
    { h: "Honest chips", p: "The chip only ever shows a value the alert itself contains. No value, no chip." },
  ],
};

/**
 * TopShelf Sense. In the downloadable 1.1 preview since build 85a2505 (Nov 10, 2026), off by
 * default. Keep the copy free of medical or diagnostic claims and of anything the app does not
 * measure; camera numbers are unvalidated estimates and pulse is experimental, not a heart-rate monitor.
 */
export const SENSE_PAGE = {
  slug: "sense",
  label: "Sense",
  kicker: "New in the 1.1 preview · opt-in",
  /** Short line for the catalogue card and the home page teaser. */
  blurb: "A privacy-first wellness companion for your screen habits, eye movement and wellness trends",
  title: "Your Mac, looking out for you.",
  seo: "Blink awareness, screen-break nudges, head-position insights and wellness trends, processed privately on your Mac",
  body: "A privacy-first wellness companion that helps you understand screen habits, eye movement patterns and personal wellness trends—right from your Mac.",
  /** Where the feature stands today. Shown verbatim on the page. */
  status: "Sense is in the 1.1 preview you can download today, switched off. Turn it on in Settings › Sense, agree to what it does, then press Start; macOS asks for camera access once. Every camera-based number is an estimate that has not been validated yet.",
  points: [
    { h: "Blink awareness", p: "A gentle sense of how often you blink while you work, so long stares at the screen don't go unnoticed." },
    { h: "Screen-break reminders", p: "Nudges to look away and rest your eyes, in step with the break reminders TopShelf already has." },
    { h: "Head-position insights", p: "See how much of your time you face the screen, and get a quiet prompt to move when your head has stayed still in one position for a long stretch." },
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
    { h: "No video recorded", p: "Sense keeps numbers, not video. Still photos are saved only if you turn on the optional appearance journal, and they stay on your Mac." },
    { h: "No face recognition", p: "Sense does not identify who is in front of the Mac, build a face profile or compare faces." },
    { h: "No uploads", p: "There is no account, no sync and no telemetry. Nothing leaves your Mac." },
    { h: "Your data, your retention", p: "Export everything as CSV or JSON, delete it at any time, and set how long history is kept." },
  ],
  disclaimer: "Sense is a wellness companion, not a medical device. It does not diagnose, treat or monitor any health condition, and the experimental pulse estimate is not a heart-rate monitor. If you have a health concern, talk to a professional.",
};

/**
 * Send Securely. In the 1.1 preview since build 897eb1c. Every claim here matches the app and
 * OnePeek's code (grokpass docs/send-securely/SECURITY.md); keep it that way — in particular,
 * never promise screenshot prevention, malware scanning or recall of opened content.
 */
export const SEND_PAGE = {
  slug: "send-securely",
  label: "Send Securely",
  kicker: "New in 1.1 · Secured by OnePeek",
  title: "Anything you need to share. Only for as long as you want.",
  body: "Send files, text, screenshots and sensitive information through OnePeek, without leaving TopShelf. Share privately. Stay in control.",
  seo: "End-to-end encrypted sharing of files, text, screenshots and clipboard content from the top of your Mac, with expiry, view limits, passphrases and revoke",
  steps: [
    { h: "Encrypted on your Mac", p: "TopShelf encrypts with AES-256-GCM before anything leaves your Mac. The key is part of the link and never reaches a server." },
    { h: "Stored by OnePeek", p: "OnePeek keeps only ciphertext it can’t read, and enforces your expiry, view limit and passphrase." },
    { h: "Opened by your recipient", p: "They open the link in any browser, with no account. Once it expires, runs out of views or you revoke it, it’s gone." },
  ],
  points: [
    { h: "Files, text, screenshots, clipboard", p: "Drag in files (several go as one ZIP), type or paste a note, capture an area or window, or send what’s on your clipboard. Up to 50 MB per share." },
    { h: "Blur or redact first", p: "Hide parts of a screenshot before it’s sent. The covered pixels are replaced in the image itself, not just hidden behind a box." },
    { h: "Expiry and view limits", p: "5 minutes to 7 days, or a custom time. View once, a few times, or any number of times until it expires." },
    { h: "Passphrase protection", p: "Add a passphrase and the link alone won’t open it. OnePeek never learns the passphrase and allows 5 wrong tries before deleting the share." },
    { h: "My Shares and revoke", p: "See every share’s status (active, viewed, expired, revoked) and how often it was opened. Revoke any time, from the notch or Settings." },
    { h: "Right where you are", p: "From the notch, Quick Actions, the shelf’s right-click menu, or ⌃⌥S. Copy the link or a ready-made invitation in one click." },
  ],
  privacy: [
    { h: "OnePeek can’t read it", p: "Contents, file names and the key never reach OnePeek in a readable form. It stores ciphertext and when and how often a share is opened." },
    { h: "No account, no tracking", p: "Recipients don’t need an account. Send Securely sends no analytics, and names of what you shared stay on your Mac." },
    { h: "Honest limits", p: "Revoking stops future access but can’t recall what someone already opened or saved, and no app can stop a screenshot on their side. Encrypted files can’t be scanned for malware, so open files only from people you trust." },
  ],
};

export const CLIPBOARD_PAGE = {
  slug: "clipboard-history",
  label: "Clipboard",
  kicker: "Clipboard · upgraded in 1.1",
  title: "Everything you copied, nothing you shouldn't keep.",
  seo: "Clipboard history for Mac with favourites, rich text, short-lived codes and AI actions, that never records passwords",
  body: "Text and image history that skips passwords, password-manager copies and anything that looks like a key, token or card number. Off until you turn it on, and local only.",
  points: [
    { h: "Favourites and filters", p: "Star the items you keep coming back to and filter the history down to pinned items or favourites." },
    { h: "Rich text, your way", p: "Formatted text is kept as it was copied. Copy it back as plain text when you need it clean." },
    { h: "Codes that vanish", p: "Verification codes are deleted two minutes after they are copied. You can also choose never to record them." },
    { h: "Keyboard first", p: "Move with ↑ and ↓, paste with ↩, or drag an item straight out of TopShelf into any app." },
    { h: "AI actions on text", p: "Rewrite, summarise or translate a clipping with the optional Assistant. Nothing is sent until you choose an action and confirm the preview." },
    { h: "Never your secrets", p: "Items that password managers mark as concealed, copies from apps on the ignored list, and text that looks like a card number, private key, API token or JWT are skipped automatically." },
  ],
};

export const THEMES_PAGE = {
  slug: "themes",
  label: "Themes",
  kicker: "Seven finishes · in the 1.1 preview",
  title: "Seven finishes. Tuned to the pixel.",
  seo: "Seven TopShelf themes for Mac: Classic Black, Glass, Chrome, Aurora, Midnight, Neon and Luxe Gold",
  body: "Pick the finish that suits your desk: Classic Black, Glass, Chrome, Aurora, Midnight, Neon and Luxe Gold. Then set the accent, corner radius, width and hover delay to taste.",
  points: [
    { h: "Classic Black", p: "The original. A deep black bar that disappears into the top of the screen." },
    { h: "Glass", p: "Blurs and refracts what is behind it. On macOS 26 and later it uses Apple's Liquid Glass." },
    { h: "Chrome", p: "A brushed, metallic finish with a soft highlight along the top edge." },
    { h: "Aurora", p: "A slow drift of colour across the bar. Animated themes only move while TopShelf is open." },
    { h: "Midnight", p: "A deep blue-black for late evenings and dark wallpapers." },
    { h: "Neon", p: "A glowing outline in the colour you choose from the Neon picker." },
    { h: "Luxe Gold", p: "A warm gold edge on black." },
    { h: "Pin what you use", p: "Pin the modules you use most to the tab bar (eight are pinned to start). Everything else lives in All, a grid of colourful tiles with one-tap quick actions." },
  ],
};

export const WELLNESS_PAGE = {
  slug: "wellness",
  label: "Wellness reminders",
  kicker: "Wellness reminders",
  title: "Small nudges, all day.",
  seo: "Posture, water, eye-rest, stretch, stand, breathe, medicine and blink reminders for Mac, plus your own",
  body: "Nine reminders: posture, drink water with an 8-glass tracker, eye rest (20-20-20), blink, stretch, stand up, breathe, medicine and your own custom reminder. Each has an interval, active hours and a weekdays-only switch, and TopShelf blinks until you tap Done or Snooze.",
  points: [
    { h: "Posture", p: "Sit tall. A reminder to reset your back and shoulders." },
    { h: "Water", p: "Drink water, with an 8-glass tracker that logs each glass for the day." },
    { h: "Eye rest", p: "The 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds." },
    { h: "Blink", p: "A reminder to blink; long stares at a screen dry your eyes." },
    { h: "Stretch and stand up", p: "Two reminders to move: a quick stretch, or get up and walk." },
    { h: "Breathe", p: "A short breathing pause." },
    { h: "Medicine", p: "A reminder at the times you set." },
    { h: "Your own", p: "A custom reminder with its own text and interval." },
  ],
};

/**
 * Device Health. Built in the app (yuzu-store branch claude/device-health) with simulated-telemetry
 * tests; not yet checked on every kind of accessory, so it's labelled beta. Every claim below must
 * match what macOS exposes through public APIs — in particular, never promise AirPods or Apple
 * Magic accessory battery levels, cycle counts, "left behind" detection or time-to-empty predictions.
 */
export const DEVICE_HEALTH_PAGE = {
  slug: "device-health",
  label: "Device Health",
  kicker: siteConfig.flags.deviceHealthInBuild ? "Beta · in the 1.1 preview" : "Beta · coming in the next update",
  title: "Know before a battery runs out.",
  seo: "Low-battery alerts for your Mac, keyboard, mouse and headphones, plus storage warnings and an optional web dashboard",
  body: "TopShelf keeps an eye on your Mac's battery and storage and on the Bluetooth accessories you use every day. When something needs attention it tells you once, not every minute, and then gets out of the way.",
  status: siteConfig.flags.deviceHealthInBuild
    ? "Device Health is in the 1.1 preview and labelled beta: it has been tested with simulated readings, and not yet on every kind of accessory."
    : "Device Health is built and arrives in the next preview build. It isn't in the download on this site yet. It's labelled beta: it has been tested with simulated readings, and not yet on every kind of accessory.",
  points: [
    { h: "Low, critical and urgent", p: "Alerts at 20% and 10% by default, with an optional urgent alert at 5%. Change them for everything or for one device. Each fires once as the battery drops, and only the most urgent one if a reading jumps past several." },
    { h: "No nagging", p: "An alert can come back only after the battery recovers 5 points above it, so a level hovering around 20% alerts once. Nothing fires while a device is charging. Plugged in but not charging still counts." },
    { h: "Needs attention first", p: "Devices that need you are listed first, then your favourites. Rename, favourite, hide or forget any device from the notch or Settings." },
    { h: "Snooze, quiet hours, Focus", p: "Snooze from the notification for 30 minutes, an hour or until tomorrow. Set quiet hours and choose which kinds of device may alert. macOS Focus and Do Not Disturb apply as you've set them." },
    { h: "Charged and disconnected", p: "Optional reminders when a device reaches 80–100%, off by default. For devices you mark, an alert if one stays disconnected, ignoring blips and your Mac sleeping or waking. It can't tell whether a device was left behind or simply switched off, so it doesn't claim to." },
    { h: "Storage and before meetings", p: "A warning when your startup disk drops below 20 GB free, and again below 5 GB. With the Calendar module on, an optional check of the devices you choose a few minutes before a meeting." },
    { h: "Honest readings", p: "An unknown level shows as —, never 0%. Old readings are marked out of date. Estimates appear only when recent readings are steady, and are always labelled." },
    { h: "On the web, if you want", p: "Link a Mac to a TopShelf account to see its readings and change alert settings from a browser. Each alert is shown in one place you choose. Unlinking deletes everything that Mac reported." },
  ],
  /** What each kind of device can report through public macOS APIs. */
  readings: [
    { what: "This Mac", has: "Battery level; charging, on battery, charged, or plugged in but not charging; macOS's own time-remaining estimate and battery condition (Good, Fair, Poor or Check Battery).", not: "Cycle count and maximum capacity aren't available to apps; see System Settings › Battery." },
    { what: "Storage", has: "Free space on the startup disk.", not: "Other volumes aren't checked yet." },
    { what: "Temperature", has: "macOS's thermal state: normal, elevated, high or critical.", not: "Not a temperature in degrees." },
    { what: "Bluetooth accessories", has: "Connection state and when each was last seen, for paired accessories. Battery level for accessories that report it through the standard Bluetooth battery service, which many keyboards, mice and game controllers do.", not: "AirPods, Beats and Apple's Magic Keyboard, Mouse and Trackpad don't make their levels available to other apps, so TopShelf shows their connection only. It never scans for nearby devices." },
    { what: "iPhone, iPad and other computers", has: "Not supported yet.", not: "" },
  ],
  privacy: [
    { h: "Needs no account", p: "Everything works on your Mac without signing in. Bluetooth permission is asked for only if you include accessories." },
    { h: "No hardware identifiers", p: "A linked Mac sends device names, readings and alerts. Bluetooth addresses and serial numbers never leave it; devices are identified by a code that's different on every Mac." },
    { h: "Your choice to keep history", p: "Battery history stays on your Mac for 7 days. Uploading it to your account is a separate switch, off by default, kept 30 days." },
  ],
};

/** Launcher & Links (the "launcher" module). Plain utility, on by default. */
export const LAUNCHER_PAGE = {
  slug: "launcher-and-links",
  label: "Launcher & Links",
  kicker: "Launcher & Links",
  title: "Your apps and links, one hover away.",
  seo: "Favourite apps, favourite links and a screenshot shortcut at the top of your Mac",
  body: "Keep the apps and web pages you open all day at the top of the screen. One click opens them; the app you were in stays put until you choose.",
  points: [
    { h: "Favourite apps", p: "Add apps from your Applications folder and launch them with one click. Remove them just as easily." },
    { h: "Favourite links", p: "Save the pages you open all day, with a name, and open them in your default browser." },
    { h: "Screenshot to clipboard", p: "Uses the same capture tool as ⌘⇧4, then tucks TopShelf away so it isn't in the shot. The image goes to your clipboard. Add a global shortcut in Settings." },
  ],
};

/** Built but not in the current download. Empty when the newest build contains everything. */
export const NEXT_UPDATE: { h: string; p: string; href: string }[] = siteConfig.flags.deviceHealthInBuild ? [] : [
  { h: "Device Health (beta)", p: "Low-battery, storage and disconnection alerts for your Mac and Bluetooth accessories, with an optional web dashboard.", href: `/features/${DEVICE_HEALTH_PAGE.slug}` },
];

export interface Release {
  version: string;
  build: string;
  file: string;
  size: string;
  items: { h: string; p: string }[];
  /** Built but not in this download yet. */
  pending?: { h: string; p: string }[];
  /** Commit subjects in this build since the previous published one. */
  changes?: string[];
}

export const RELEASES: Release[] = [
  {
    version: siteConfig.release.version,
    build: siteConfig.release.build,
    file: siteConfig.links.dmg,
    size: siteConfig.release.size,
    items: [
      { h: "Celebration alerts", p: "Alarms, timers, meetings, reminders, goals and new mail arrive with a 1.9-second broadcast-style stinger. Choose Celebration, Colour flash or None, and a soft tick instead of a chime." },
      { h: "Opens on your Shelf", p: "TopShelf now opens on the File Shelf by default. Hold ⌘ while you drag a file anywhere and it lands on the shelf. Folders and apps drag back out too." },
      { h: "Stays open while you use it", p: "If the pointer slips out after you've clicked, scrolled or dragged, TopShelf waits (3 seconds by default, adjustable from 0 to 10) before closing." },
      { h: "Install and start at login", p: "Opened from a download or the disk image, TopShelf offers to move itself into Applications, and it starts at login by default." },
      { h: "Clipboard upgrades", p: "Favourites and filters, rich text with copy as plain text, verification codes deleted after two minutes, ↑↓ ↩ and drag out, and AI actions on text with the opt-in Assistant." },
      { h: "Inbox: unread counts only", p: "Inbox reads only Mail's unread count for each account, about once a minute, so Mail never freezes on a big mailbox." },
      { h: "Breaks", p: "Gentle heads-up, floating countdown, full-screen pause on every display, Smart Pause, office hours, Casual/Balanced/Hardcore, daily stats, a Screen Score, a menu-bar timer and shortcuts." },
      { h: "Send Securely, secured by OnePeek", p: "Share files, text, screenshots and clipboard content end-to-end encrypted, with expiry, view limits, an optional passphrase, My Shares and revoke. From the notch, Quick Actions, the shelf menu or ⌃⌥S." },
      { h: "Shelf: a right-click menu for every file", p: "Open With, Show in Finder, Quick Look, share through AirDrop, Mail, Messages and Notes, Copy to and Move to, Rename, Create ZIP Archive, Copy Path, Add From Clipboard, and Protect Using Password for PDFs." },
      { h: "Shelf: something useful when it's empty", p: "With nothing parked, the shelf suggests your newest downloads, what's playing and your next event. Drop a file and your files take over again." },
      { h: "Now playing in the closed notch", p: "Song and artist sit next to the artwork and scroll when they don't fit." },
      { h: "TopShelf Sense (opt-in)", p: "Blink awareness, screen-break reminders, head-position insights, wellness check-ins, historical charts and an experimental pulse estimate. Camera off by default, processed on-device, no video recorded, no uploads, no face recognition. Camera numbers are unvalidated estimates. Not a medical device; the pulse estimate is experimental and not a heart-rate monitor." },
      { h: "Calendar: Recent Apps", p: "The Calendar view shows the three most recently used apps as cards; click one to switch back." },
      { h: "Wellness: line icons", p: "A new line-icon design for all nine reminders." },
      { h: "Steadier", p: "Fixes a crash when changing settings with repeating calendar events, a crash with VoiceOver on Sense's live page, and ZIP archives of single files. The shelf now says why a file couldn't be added." },
      { h: "iCloud sync", p: "Preferences and quick notes sync through iCloud; privacy consents never do. Needs a build signed for iCloud, so it is off in the preview." },
    ],
    /** Every commit in the newest build since the previous published one (written by publish-build.sh). */
    changes: latestBuild.changes,
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
  /** Long-form "How it works" cards, for pages that have them. */
  points?: { h: string; p: string }[];
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
    points: f.id === "clipboard" ? CLIPBOARD_PAGE.points : f.id === "wellness" ? WELLNESS_PAGE.points : undefined,
  }));
  return [
    { slug: SEND_PAGE.slug, label: SEND_PAGE.label, kicker: SEND_PAGE.kicker, title: SEND_PAGE.title, body: SEND_PAGE.body, seo: SEND_PAGE.seo, stage: "bg-[#E4F4F7]" },
    { ...BREAKS_PAGE, stage: "bg-mint" },
    { ...CELEBRATION_PAGE, stage: "bg-lavender" },
    { slug: DEVICE_HEALTH_PAGE.slug, label: DEVICE_HEALTH_PAGE.label, kicker: DEVICE_HEALTH_PAGE.kicker, title: DEVICE_HEALTH_PAGE.title,
      body: DEVICE_HEALTH_PAGE.body, seo: DEVICE_HEALTH_PAGE.seo, stage: "bg-mint", upcoming: !siteConfig.flags.deviceHealthInBuild },
    { slug: SENSE_PAGE.slug, label: SENSE_PAGE.label, kicker: SENSE_PAGE.kicker, title: SENSE_PAGE.title, body: SENSE_PAGE.body, seo: SENSE_PAGE.seo, stage: "bg-[#EAF4FB]" },
    { ...THEMES_PAGE, stage: "bg-sand" },
    ...modules,
    { ...LAUNCHER_PAGE, stage: "bg-[#FFE9E3]" },
  ];
}
