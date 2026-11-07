import type { Metadata } from "next";
import { ArrowUpRight, Clock } from "lucide-react";
import { siteConfig } from "@/config/site";
import { JsonLd, PageHead, Subpage } from "@/components/site/subpage";
import { DownloadButton } from "@/components/delight/download";
import { featurePages } from "@/lib/pages";
import { FEATURE_META, extraPageMeta } from "@/lib/feature-meta";

export const metadata: Metadata = {
  title: "Features: everything TopShelf puts at the top of your Mac",
  description: "Music, File Shelf, Calendar, timers, notes, break reminders, Celebration alerts, clipboard history, live scores and more, in one calm bar at the top of your Mac. Plus Sense, coming in the next update.",
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
      <PageHead kicker={`${pages.length} features · one quiet bar`} title={<>Everything you need. <b>Right where you need it.</b></>} lead="Every feature below is in the 1.1 preview you can download today, except the one marked as coming in the next update. Open any of them to read more and try a working demo.">
        <div>
          <DownloadButton />
        </div>
      </PageHead>
      <ul className="m-0 grid list-none gap-4 p-0 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((p) => {
          const meta = p.id ? FEATURE_META[p.id] : extraPageMeta(p.slug);
          const Icon = meta?.Icon ?? ArrowUpRight;
          const bg = meta?.bg ?? "#ECEBFF";
          const fg = meta?.fg ?? "#4357EE";
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
                {p.upcoming && (
                  <span className="mt-auto inline-flex min-h-7 items-center gap-1.5 self-start rounded-2xl bg-peach px-3 py-1 text-[13px] text-[#8A3D12]">
                    <Clock className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                    Coming in the next update, not in today&apos;s build
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </Subpage>
  );
}
