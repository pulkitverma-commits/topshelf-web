/**
 * TopShelf site configuration.
 *
 * Every product fact shown on the website comes from this file. Values wrapped in
 * square brackets (e.g. "[TRIAL LENGTH]") are unconfirmed placeholders: the site
 * renders them with a dashed underline so they are easy to spot before launch.
 * Replace them with verified details and the styling disappears automatically.
 */
export const siteConfig = {
  name: "TopShelf",
  /** Production origin, used for canonical URLs, Open Graph and the sitemap. */
  url: "https://topshelf-web-eight.vercel.app",
  company: "[COMPANY NAME]",
  tagline: "A little space. A lot more magic.",
  description:
    "TopShelf turns the top of your Mac's screen into a calm home for music, files, meetings and timers, with healthy break reminders, wellness nudges, themes and a calculator with a tiny friend. Native and private.",

  links: {
    download: "#download",
    dmg: "/downloads/TopShelf-1.1-preview-93c9bdf.dmg",
    dmgStable: "/downloads/TopShelf-1.0.0.dmg",
    buy: "#pricing",
    support: "#faq",
    privacy: "/privacy",
    terms: "/terms",
  },

  requirements: {
    minMacOS: "14 Sonoma",
    systemRequirementsLabel: "macOS 14 Sonoma or later · Apple silicon & Intel",
  },

  /** Purchase options. Disable any that are not offered; the UI adapts. */
  offers: {
    trial: { enabled: true, length: "[TRIAL LENGTH]" },
    monthly: { enabled: true, price: "[MONTHLY PRICE]" },
    lifetime: { enabled: true, price: "[LIFETIME PRICE]" },
    licenceDevices: "[NUMBER OF MACS]",
    updateTerms: "[UPDATE TERMS]",
  },

  /** Feature flags for the marketing site. */
  flags: {
    /** Shows the AI workspace tab, always labelled as an experimental concept. */
    aiWorkspace: true,
    /** Which hero headline to use: "favourite" or "uptop". */
    heroVariant: "favourite" as "favourite" | "uptop",
  },

  /** Example shortcut shown in the details section. */
  exampleShortcut: ["⌥", "⌘", "T"],
  exampleShortcutConfirmed: false,
} as const;

export type SiteConfig = typeof siteConfig;
