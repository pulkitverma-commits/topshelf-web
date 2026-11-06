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
  company: "TopShelf Inc",
  email: "pulkit.verma@foxnetglobal.com",
  tagline: "A little space. A lot more magic.",
  description:
    "TopShelf turns the top of your Mac's screen into a calm home for music, files, meetings, timers and healthy break reminders. Native, private, free to try.",

  links: {
    download: "/downloads/TopShelf-1.1-preview-93c9bdf.dmg",
    downloadPage: "/download",
    dmg: "/downloads/TopShelf-1.1-preview-93c9bdf.dmg",
    dmgStable: "/downloads/TopShelf-1.0.0.dmg",
    /** No checkout yet: buying is the same free download until a payment link exists. */
    buy: "/downloads/TopShelf-1.1-preview-93c9bdf.dmg",
    support: "/support",
    privacy: "/privacy",
    terms: "/terms",
  },

  release: {
    version: "1.1 preview",
    build: "93c9bdf",
    size: "3.8 MB",
    stableVersion: "1.0.0",
    stableSize: "2.9 MB",
    sha256: "73222ee0346b8eb1152425cbdb74546ab60c257fc8e0c4bbcf9b2a196999d269",
    stableSha256: "8578a16d46d0b5b8aed8f7e53aee674159cd8f0aa1e44dcc61d53a4991711f8f",
  },

  requirements: {
    minMacOS: "14 Sonoma",
    systemRequirementsLabel: "macOS 14 Sonoma or later · Apple silicon & Intel",
  },

  /** Purchase options. Disable any that are not offered; the UI adapts. */
  offers: {
    trial: { enabled: true, length: "14 days", days: 14 },
    monthly: { enabled: false, price: "" },
    lifetime: { enabled: true, price: "$9.99", amount: 9.99, currency: "USD" },
    licenceDevices: "2 Macs",
    updateTerms: "every 1.x update, free",
  },

  /** Feature flags for the marketing site. */
  flags: {
    /** Shows the AI workspace tab, always labelled as an experimental concept. */
    aiWorkspace: true,
    /** Which hero headline to use: "favourite" or "uptop". */
    heroVariant: "favourite" as "favourite" | "uptop",
  },

  /** The app's default "Expand / collapse" shortcut (KeyCombo.defaults in the app source). */
  shortcut: { keys: ["⌃", "⌥", "N"], names: ["Control", "Option", "N"] },
} as const;

export type SiteConfig = typeof siteConfig;
