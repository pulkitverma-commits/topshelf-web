import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { JsonLd, PageHead, Subpage } from "@/components/site/subpage";
import { FAQS } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "TopShelf FAQ: pricing, privacy, install and features",
  description: `Answers about TopShelf for Mac: ${siteConfig.offers.lifetime.price} once after a ${siteConfig.offers.trial.length} free trial, macOS ${siteConfig.requirements.minMacOS}+, privacy, break reminders, music, Inbox and more.`,
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <Subpage crumbs={[{ name: "FAQ", path: "/faq" }]}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <PageHead kicker="FAQ" title={<>Questions, <b>answered.</b></>} lead={<>Can&apos;t find yours? Email <a className="text-ink underline underline-offset-4" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</>} />
      <div className="grid max-w-[900px] gap-3 pb-24">
        {FAQS.map((f) => (
          <details key={f.q} className="group rounded-[22px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)] open:shadow-[inset_0_0_0_1.5px_var(--color-ink)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
              <h2 className="m-0 text-lg font-semibold">{f.q}</h2>
              <span aria-hidden="true" className="grid size-8 flex-none place-items-center rounded-full bg-canvas transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="m-0 mt-3 text-[16px] text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Subpage>
  );
}
