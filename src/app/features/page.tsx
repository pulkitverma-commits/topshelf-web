import type { Metadata } from "next";
import { ArrowUpRight, Eye, PartyPopper } from "lucide-react";
import { siteConfig } from "@/config/site";
import { JsonLd, PageHead, Subpage } from "@/components/site/subpage";
import { DownloadButton } from "@/components/delight/download";
import { featurePages } from "@/lib/pages";
import { FEATURE_META } from "@/lib/feature-meta";

export const metadata: Metadata = {
  title: "Features: everything TopShelf puts at the top of your Mac",
  description: "Music, File Shelf, Calendar, timers, notes, break reminders, Celebration alerts, clipboard history, live scores and more, in one calm bar at the top of your Mac.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  const pages = featurePages();
  return (
    <Subpage crumbs={[{ name: "Features", path: "/features" }]}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "TopShelf features",
          itemListElement: pages.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.label, url: `${siteConfig.url}/features/${p.slug}` })),
        }}
      />
      <PageHead kicker={`${pages.length} features · one quiet bar`} title={<>Everything you need. <b>Right where you need it.</b></>} lead="Every feature below works in TopShelf today. Open any of them to read more and try a working demo.">
        <div>
          <DownloadButton />
        </div>
      </PageHead>
      <ul className="m-0 grid list-none gap-4 p-0 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((p) => {
          const meta = p.id ? FEATURE_META[p.id] : null;
          const Icon = meta?.Icon ?? (p.slug === "break-reminders" ? Eye : PartyPopper);
          const bg = meta?.bg ?? (p.slug === "break-reminders" ? "#E1F3EA" : "#ECEBFF");
          const fg = meta?.fg ?? (p.slug === "break-reminders" ? "#1D7F5F" : "#4357EE");
          return (
            <li key={p.slug}>
              <a href={`/features/${p.slug}`} className="group flex h-full flex-col gap-3 rounded-[26px] bg-white p-6 shadow-[inset_0_0_0_1px_var(--color-line)] transition-[transform,box-shadow] duration-300 ease-spring hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_var(--color-line),0_30px_50px_-30px_rgba(23,23,23,.3)]">
                <span className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl transition-transform duration-300 ease-spring group-hover:rotate-[-8deg] group-hover:scale-110" style={{ background: bg, color: fg }}>
                    <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <ArrowUpRight className="size-5 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
                </span>
                <span className="text-[12.5px] uppercase tracking-[.08em] text-muted">{p.kicker}</span>
                <h2 className="m-0 font-display text-[22px] font-semibold leading-tight tracking-[-.025em]">{p.label}</h2>
                <p className="m-0 text-[15px] text-muted">{p.seo}.</p>
              </a>
            </li>
          );
        })}
      </ul>
    </Subpage>
  );
}
