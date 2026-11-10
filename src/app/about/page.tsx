import type { Metadata } from "next";
import { Feather, Lock, Monitor, Scale } from "lucide-react";
import { siteConfig } from "@/config/site";
import { JsonLd, PageHead, Subpage } from "@/components/site/subpage";
import { DownloadButton } from "@/components/delight/download";

export const metadata: Metadata = {
  title: "About",
  description: `TopShelf is made by ${siteConfig.company}, backed by investors including Pulkit Verma, Yash Ganeriwala and Stuart Paz.`,
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
            funder: INVESTORS.map((name) => ({ "@type": "Person", name })),
            brand: { "@type": "Brand", name: siteConfig.name },
          },
        }}
      />
      <PageHead
        kicker={`About ${siteConfig.name}`}
        title={<>A calm home for <b>the top of your Mac.</b></>}
        lead={<>{siteConfig.name} is a product of <b className="font-semibold text-ink">{siteConfig.company}</b>.</>}
      />

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

      <section aria-labelledby="contact" className="pb-24">
        <div className="flex flex-col items-start gap-5 rounded-[30px] bg-white p-8 shadow-[inset_0_0_0_1px_var(--color-line)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="contact" className="m-0 font-display text-2xl font-semibold tracking-[-.02em]">Get in touch</h2>
            <p className="m-0 mt-1 text-[16px] text-muted">
              Questions for {siteConfig.company}? Email{" "}
              <a className="text-ink underline underline-offset-4" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>
          </div>
          <DownloadButton size="md" />
        </div>
      </section>
    </Subpage>
  );
}
