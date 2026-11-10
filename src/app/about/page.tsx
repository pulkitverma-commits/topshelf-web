import type { Metadata } from "next";
import { ArrowUpRight, CalendarCheck, Compass, Feather, Lock, Map as MapIcon, MapPin, Monitor, Pill, Scale, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { Value } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { JsonLd, PageHead, Subpage } from "@/components/site/subpage";
import { DownloadButton } from "@/components/delight/download";

export const metadata: Metadata = {
  title: "About",
  description: `TopShelf is made by ${siteConfig.company}, a San Francisco software company founded in 2025 and backed by investors including Pulkit Verma, Yash Ganeriwala and Stuart Paz.`,
  alternates: { canonical: "/about" },
};

/** Investors as stated by the company. Only names and role; no invented titles or bios. */
const INVESTORS = ["Pulkit Verma", "Yash Ganeriwala", "Stuart Paz"];

const PRINCIPLES = [
  { Icon: Monitor, h: "Native to the Mac", p: "TopShelf is a native macOS app for Apple silicon and Intel, built to sit quietly at the top of your screen." },
  { Icon: Lock, h: "Private by default", p: "Features that touch your data stay off until you turn them on, and Send Securely encrypts on your Mac before anything leaves it." },
  { Icon: Feather, h: "Calm, not noisy", p: "Music, files, meetings, timers and break reminders in one quiet place, out of the way until you need them." },
  { Icon: Scale, h: "Fair pricing", p: `Free for ${siteConfig.offers.trial.length}, then ${siteConfig.offers.lifetime.price} once, with ${siteConfig.offers.updateTerms}. No subscription.` },
];

/** The one contact address for the whole site (siteConfig.email). */
const CONTACT_EMAIL = siteConfig.email;

/** MacLily's products. Descriptions are each product's own wording from its website. */
const PRODUCTS: { name: string; href: string; domain: string; tagline: string; p: string; Icon?: LucideIcon; current?: boolean }[] = [
  { name: "TopShelf", href: "/", domain: "gettopshelf.co", tagline: "A calm home for the top of your Mac.", p: "Music, files, meetings, timers, break reminders and secure sharing, in one quiet bar at the top of the screen.", current: true },
  { name: "OnePeek", href: "https://onepeek.io", domain: "onepeek.io", tagline: "Send secrets that disappear.", p: "Zero-knowledge one-time secret sharing: encrypted in your browser, deleted after it’s viewed. It also powers Send Securely in TopShelf.", Icon: ShieldCheck },
  { name: "Journeo", href: "https://www.journeo.life", domain: "journeo.life", tagline: "Every place has a story.", p: "Journeo turns photographs, maps and memory into an interactive visual travel story — a journey a reader moves through, not a feed they scroll past.", Icon: MapIcon },
  { name: "Sociomatix", href: "https://www.sociomatix.com", domain: "sociomatix.com", tagline: "Your AI social media manager.", p: "Sociomatix plans your content calendar, writes and designs posts, publishes to Instagram, LinkedIn and 7 more networks, and replies to comments.", Icon: CalendarCheck },
  { name: "Pill-Pair", href: "https://pillpair.app", domain: "pillpair.app", tagline: "A MacLily app.", p: "Learn more at pillpair.app.", Icon: Pill },   // TODO: replace with Pill-Pair's own one-liner
];

/** Real dates only. */
const MILESTONES = [
  { when: "2025", h: "MacLily Inc is founded in San Francisco", p: "With one idea: the most valuable space on a Mac is the strip at the very top of the screen, and almost nobody uses it well." },
  { when: "November 2026", h: "TopShelf 1.0", p: "Music, files, meetings, timers, notes, wellness reminders and more, in one calm bar at the top of the Mac." },
  { when: "November 2026", h: "TopShelf 1.1 preview", p: "Break reminders, Celebration alerts, Sense, and Send Securely: end-to-end encrypted sharing, secured by OnePeek." },
];

/** Direction, stated as intent rather than achievement. */
const AHEAD = [
  { Icon: Compass, h: "Calm computing", p: "We want the Mac to feel quieter: fewer windows to juggle, fewer apps to switch between, less noise competing for your attention." },
  { Icon: Lock, h: "Privacy as a default, not a setting", p: "Every feature we build starts from the same question: how little do we need to know? The answer is usually nothing at all." },
  { Icon: Sparkles, h: "Craft in the details", p: "Small things done carefully — an animation that eases instead of jumps, a reminder that waits for a better moment — are what make software feel like it belongs on a Mac." },
];

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function AboutPage() {
  return (
    <Subpage crumbs={[{ name: "About", path: "/about" }]}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          url: `${siteConfig.url}/about`,
          about: {
            "@type": "Organization",
            name: siteConfig.company,
            url: siteConfig.url,
            foundingDate: "2025",
            foundingLocation: { "@type": "Place", name: "San Francisco, California" },
            address: { "@type": "PostalAddress", addressLocality: "San Francisco", addressRegion: "CA", addressCountry: "US" },
            email: CONTACT_EMAIL,
            funder: INVESTORS.map((name) => ({ "@type": "Person", name })),
            brand: PRODUCTS.map((x) => ({ "@type": "Brand", name: x.name, url: x.href.startsWith("http") ? x.href : siteConfig.url })),
          },
        }}
      />
      <PageHead
        kicker={`About ${siteConfig.name}`}
        title={<>A calm home for <b>the top of your Mac.</b></>}
        lead={<>{siteConfig.name} is a product of <b className="font-semibold text-ink">{siteConfig.company}</b>, a software company founded in San Francisco in 2025 that also makes OnePeek, Journeo, Sociomatix and Pill-Pair.</>}
      />
      <p className="-mt-2 mb-14 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] text-muted shadow-[inset_0_0_0_1px_var(--color-line)]">
        <MapPin className="size-4 text-[#9e5cff]" strokeWidth={1.9} aria-hidden="true" />
        San Francisco, California · Founded 2025
      </p>

      <section aria-labelledby="story" className="pb-14">
        <h2 id="story" className="m-0 font-display text-[clamp(28px,3vw,40px)] font-semibold tracking-[-.035em]">Our story</h2>
        <div className="mt-4 grid max-w-[880px] gap-4 text-[17px] leading-relaxed text-muted">
          <p className="m-0">
            {siteConfig.company} started in San Francisco in 2025 with a simple observation: the top of a Mac&apos;s screen is the one place your eyes
            return to all day, and it was doing almost nothing. A clock, a few icons, and on newer MacBooks, a notch.
          </p>
          <p className="m-0">
            We set out to turn that strip into something useful without making it loud. The result is {siteConfig.name}: a quiet home for the things you
            reach for constantly — what&apos;s playing, the file you&apos;re about to send, your next meeting, a timer, a reminder to look away from the
            screen — that stays out of the way until you need it.
          </p>
          <p className="m-0">
            {siteConfig.name} is one of a small family of {siteConfig.company} products, each built around the same idea: technology should be
            private, considered and a pleasure to use.
          </p>
          <p className="m-0">
            We build for people who care how their tools feel. That means native Mac software, careful design, private by default, and a price you pay
            once.
          </p>
        </div>
      </section>

      <section aria-labelledby="products" className="pb-14">
        <h2 id="products" className="m-0 font-display text-[clamp(28px,3vw,40px)] font-semibold tracking-[-.035em]">Products by {siteConfig.company}</h2>
        <ul className="m-0 mt-8 grid list-none gap-3 p-0 sm:grid-cols-2">
          {PRODUCTS.map(({ name, href, domain, tagline, p, Icon, current }) => (
            <li key={name}>
              <a
                href={href}
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full flex-col gap-3 rounded-[26px] bg-white p-6 shadow-[inset_0_0_0_1px_var(--color-line)] transition-[transform,box-shadow] duration-300 ease-spring hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_var(--color-line),0_30px_50px_-30px_rgba(84,104,255,.45)]"
              >
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="badge-icon grid size-11 place-items-center rounded-2xl text-white">
                      {Icon ? <Icon className="size-5" strokeWidth={1.9} aria-hidden="true" /> : (
                        // eslint-disable-next-line @next/next/no-img-element -- static brand mark
                        <img src="/brand/logo-mark.png" alt="" aria-hidden="true" className="size-6 brightness-0 invert" />
                      )}
                    </span>
                    <span>
                      <b className="block font-display text-xl font-semibold tracking-[-.02em]">{name}</b>
                      <span className="text-[13px] text-muted">{current ? `${domain} · you are here` : domain}</span>
                    </span>
                  </span>
                  <ArrowUpRight className="size-5 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
                </span>
                <b className="font-display text-[17px] font-semibold"><Value>{tagline}</Value></b>
                <span className="text-[15px] text-muted"><Value wrap>{p}</Value></span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="milestones" className="pb-14">
        <h2 id="milestones" className="m-0 font-display text-[clamp(28px,3vw,40px)] font-semibold tracking-[-.035em]">Milestones</h2>
        <ol className="relative m-0 mt-8 grid max-w-[880px] list-none gap-6 p-0 pl-8 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-0.5 before:rounded-full before:bg-[linear-gradient(#3dd1ff,#5478ff,#9e5cff,#ff54cc,#ff9e66)]">
          {MILESTONES.map((m) => (
            <li key={m.h} className="relative">
              <span aria-hidden="true" className="badge-icon absolute -left-8 top-1 size-6 rounded-full ring-4 ring-[var(--color-canvas,#f8f8f6)]" />
              <span className="font-display text-[13px] font-semibold uppercase tracking-[.08em] text-[#7a5cff]">{m.when}</span>
              <b className="mt-1 block font-display text-xl font-semibold tracking-[-.02em]">{m.h}</b>
              <span className="mt-1 block text-[16px] text-muted">{m.p}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="what" className="pb-14">
        <h2 id="what" className="m-0 font-display text-[clamp(28px,3vw,40px)] font-semibold tracking-[-.035em]">What we make</h2>
        <p className="m-0 mt-3 max-w-[720px] text-[17px] text-muted">{siteConfig.description}</p>
        <ul className="m-0 mt-8 grid list-none gap-3 p-0 sm:grid-cols-2">
          {PRINCIPLES.map(({ Icon, h, p }) => (
            <li key={h} className="flex gap-4 rounded-[24px] bg-white p-6 shadow-[inset_0_0_0_1px_var(--color-line)]">
              <span className="badge-icon grid size-11 flex-none place-items-center rounded-2xl text-white">
                <Icon className="size-5" strokeWidth={1.9} aria-hidden="true" />
              </span>
              <span>
                <b className="block font-display text-lg font-semibold tracking-[-.01em]">{h}</b>
                <span className="text-[15px] text-muted">{p}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="company" className="pb-14">
        <h2 id="company" className="m-0 font-display text-[clamp(28px,3vw,40px)] font-semibold tracking-[-.035em]">The company</h2>
        <p className="m-0 mt-3 max-w-[720px] text-[17px] text-muted">
          {siteConfig.name} is designed, built and sold by {siteConfig.company}. {siteConfig.company} is backed by investors including:
        </p>
        <ul className="m-0 mt-8 grid list-none gap-3 p-0 sm:grid-cols-3">
          {INVESTORS.map((name) => (
            <li key={name} className="flex items-center gap-4 rounded-[24px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)]">
              <span aria-hidden="true" className="badge-icon grid size-12 flex-none place-items-center rounded-full font-display text-[17px] font-semibold text-white">
                {initials(name)}
              </span>
              <span>
                <b className="block font-display text-lg font-semibold tracking-[-.01em]">{name}</b>
                <span className="text-[14px] text-muted">Investor</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ahead" className="pb-14">
        <h2 id="ahead" className="m-0 font-display text-[clamp(28px,3vw,40px)] font-semibold tracking-[-.035em]">Where we&apos;re headed</h2>
        <ul className="m-0 mt-8 grid list-none gap-3 p-0 sm:grid-cols-3">
          {AHEAD.map(({ Icon, h, p }) => (
            <li key={h} className="flex flex-col gap-3 rounded-[24px] bg-[#1C1C1E] p-6 text-white">
              <span className="badge-icon grid size-11 place-items-center rounded-2xl text-white">
                <Icon className="size-5" strokeWidth={1.9} aria-hidden="true" />
              </span>
              <b className="font-display text-lg font-semibold tracking-[-.01em]">{h}</b>
              <span className="text-[15px] text-white/65">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="contact" className="pb-24">
        <div className="flex flex-col items-start gap-5 rounded-[30px] bg-white p-8 shadow-[inset_0_0_0_1px_var(--color-line)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="contact" className="m-0 font-display text-2xl font-semibold tracking-[-.02em]">Get in touch</h2>
            <p className="m-0 mt-1 text-[16px] text-muted">
              Questions for {siteConfig.company}? Email{" "}
              <a className="text-ink underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
          <DownloadButton size="md" />
        </div>
      </section>
    </Subpage>
  );
}
