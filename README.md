# TopShelf — marketing website

Interactive launch site for TopShelf, the macOS app that turns the MacBook notch into a workspace.
Built with Next.js (App Router), React, TypeScript, Tailwind CSS v4, Motion for React and Lucide icons.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build + type check
npm start
```

Requires Node 18.18 or later.

## Before launch: fill in the config

All product facts live in **`src/config/site.ts`**: name, URL, download and purchase links, minimum macOS
version, trial length, prices, licence terms, feature flags (AI workspace tab, hero headline variant) and the
example shortcut.

Any value written in square brackets (for example `"[TRIAL LENGTH]"`) is treated as an unconfirmed
placeholder and is shown on the page with a dashed underline. Replace it with the verified value and the
marking disappears automatically.

Other copy to confirm:

- **FAQ answers** — `src/lib/demo-data.ts` → `FAQS`. Answers flagged `toConfirm: true` show a
  "To confirm before launch" tag and are left out of the FAQ structured data until you remove the flag.
- **Display behaviour without a notch** — `src/components/sections/built-for-mac.tsx`.
- **Legal pages** — `src/app/(legal)/privacy` and `src/app/(legal)/terms` contain placeholders.
- **`siteConfig.url`** — set to the production domain so canonical URLs, Open Graph and the sitemap are right.

Pricing adapts to `offers`: disable `monthly` or `lifetime` and the Monthly/Lifetime switch disappears;
disable `trial` and the trial card is removed.

## Structure

```
src/
  app/                      layout (fonts, metadata), page, legal pages, robots, sitemap, OG image, icon
  config/site.ts            every configurable product detail
  lib/demo-data.ts          mock tracks, files, features, story steps, FAQs, customiser options
  components/
    demo-provider.tsx       shared local state for the demos (music, timer, Shelf files, meeting)
    mac/macbook.tsx         reusable MacBook, wallpaper, menu bar, dock, desktop window
    topshelf/               notch building blocks: hero notch, widgets, Shelf, album art, file icons
    playground/             feature tabs; demos beyond the first are lazy-loaded per tab
    sections/               nav, hero, concept, story, built-for-Mac, details, customiser, pricing, FAQ, CTA/footer
    ui/                     buttons, placeholders, scribbles, reveal, segmented control
```

## Notes

- Every demo runs locally in the browser with mock data. Nothing connects to macOS, music apps or calendars,
  and on-page labels such as "Joined (demo)" make that clear.
- Motion respects the visitor's reduced-motion setting (`MotionConfig reducedMotion="user"` plus a CSS fallback
  for keyframe loops). Scroll-linked scenes switch to tap-to-change on smaller screens.
- Album artwork, file icons, wallpaper and illustrations are original CSS/SVG, so there are no image assets to
  license or optimise. The menu bar uses a neutral glyph, not Apple's logo.
- Fonts: Instrument Sans (display), Questrial (body), Caveat (hand-drawn notes), self-hosted via `next/font`.

## Device Health accounts (optional, beta)

The signed-in dashboard (`/account`), the Mac link page (`/link`) and `src/app/api/device-health/*`
need a Supabase project. Without these variables the site builds and runs as before, and the
account pages say accounts aren't set up yet.

1. Apply `supabase/migrations/20261112000000_device_health.sql` to the project.
2. Set on Vercel (Production and Preview): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   and the server-only `SUPABASE_SERVICE_ROLE_KEY` (never exposed to browsers).
3. In Supabase Auth: allow `https://gettopshelf.co/auth/confirm` (and preview URLs) as redirect URLs,
   and configure custom SMTP — the built-in mailer only sends to project members.

Backend tests (in-memory store, simulated telemetry): `npm run test:device-health`.
`siteConfig.flags.deviceHealthInBuild` switches the site from "coming in the next update" to
"in the preview" once a build containing Device Health is published.
