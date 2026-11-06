import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { JsonLd, PageHead, Subpage } from "@/components/site/subpage";
import { DownloadButton } from "@/components/delight/download";
import { FeatureDemo } from "@/components/site/feature-demo";
import { BREAKS_PAGE, CELEBRATION_PAGE, featurePages } from "@/lib/pages";
import { FEATURE_META } from "@/lib/feature-meta";
import { ALL_STINGERS, shade, tintHex } from "@/lib/stinger";

export function generateStaticParams() {
  return featurePages().map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = featurePages().find((x) => x.slug === slug);
  if (!p) return {};
  const name = p.slug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
  const title = `${name} for Mac`;
  const description = `${p.seo}. ${p.body}`.slice(0, 158).replace(/\s+\S*$/, "") + "…";
  return {
    title,
    description,
    alternates: { canonical: `/features/${slug}` },
    openGraph: { title: `${title} · TopShelf`, description, url: `/features/${slug}` },
    twitter: { title: `${title} · TopShelf`, description },
  };
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pages = featurePages();
  const i = pages.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = pages[i];
  const related = [pages[(i + 1) % pages.length], pages[(i + 2) % pages.length], pages[(i + 3) % pages.length]];
  const extra = slug === BREAKS_PAGE.slug ? BREAKS_PAGE.points : slug === CELEBRATION_PAGE.slug ? CELEBRATION_PAGE.points : null;

  return (
    <Subpage crumbs={[{ name: "Features", path: "/features" }, { name: p.label, path: `/features/${slug}` }]}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${p.label} for Mac · TopShelf`,
          description: p.seo,
          url: `${siteConfig.url}/features/${slug}`,
          about: { "@type": "SoftwareApplication", name: "TopShelf", operatingSystem: "macOS", applicationCategory: "ProductivityApplication" },
        }}
      />
      <PageHead kicker={p.kicker} title={p.title} lead={p.body}>
        <div className="flex flex-wrap items-center gap-3">
          <DownloadButton>
            <Download className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
            Try {p.label} free
          </DownloadButton>
          <span className="text-sm text-muted">
            Free for {siteConfig.offers.trial.length}, then {siteConfig.offers.lifetime.price} once
          </span>
        </div>
      </PageHead>

      {p.experimental && <p className="m-0 mb-4 inline-flex rounded-full bg-lavender px-3 py-1.5 text-[13px] text-accent-deep">Experimental</p>}

      {p.id ? (
        <section aria-label={`${p.label} demo`} className="pb-6">
          <p className="m-0 mb-3 font-hand text-2xl">go on, it works. try it ↓</p>
          <FeatureDemo id={p.id} stage={p.stage} />
        </section>
      ) : slug === CELEBRATION_PAGE.slug ? (
        <section aria-label="Every headline" className="pb-6">
          <h2 className="m-0 mb-4 font-display text-[28px] font-semibold tracking-[-.03em]">Every headline</h2>
          <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 lg:grid-cols-5">
            {ALL_STINGERS.map((s) => {
              const c = tintHex(s.tint);
              const deep = shade(c, s.tint === "yellow" ? -0.62 : -0.5);
              return (
                <li key={s.name} className="flex min-h-[58px] items-center justify-between gap-2 rounded-2xl px-3 py-2" style={{ background: shade(c, 0.86), boxShadow: `inset 0 0 0 1px ${shade(c, 0.55)}` }}>
                  <span className="min-w-0">
                    <span className="condensed block truncate text-[17px] font-extrabold italic leading-none" style={{ color: deep }}>
                      {s.h}
                    </span>
                    <small className="mt-1 block text-[11.5px] text-ink/60">{s.name}</small>
                  </span>
                  {s.v && (
                    <span className="condensed rounded-md px-1.5 py-[3px] text-[13px] font-extrabold leading-none text-white" style={{ background: deep }}>
                      {s.v}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[15px] text-muted">
            See them play on the <a className="underline underline-offset-4" href="/#new">home page</a>.
          </p>
        </section>
      ) : (
        <p className="m-0 pb-6 text-[17px]">
          <a className="inline-flex items-center gap-1.5 underline underline-offset-4" href="/#breaks">
            Try a real break on the home page <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </p>
      )}

      {(extra || p.next) && (
        <section aria-labelledby="details" className="py-12">
          <h2 id="details" className="m-0 font-display text-[clamp(28px,3vw,40px)] font-semibold tracking-[-.035em]">
            {extra ? "How it works" : "New in 1.1"}
          </h2>
          {extra ? (
            <ul className="m-0 mt-6 grid list-none gap-3 p-0 sm:grid-cols-2">
              {extra.map((x) => (
                <li key={x.h} className="rounded-[22px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)]">
                  <h3 className="m-0 font-display text-lg font-semibold tracking-[-.015em]">{x.h}</h3>
                  <p className="m-0 mt-1.5 text-[15px] text-muted">{x.p}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 flex max-w-[720px] gap-2.5 rounded-[22px] bg-lavender p-5 text-[16px]">
              <Sparkles className="mt-1 size-4 flex-none text-accent" aria-hidden="true" />
              {p.next}
            </p>
          )}
        </section>
      )}

      <section aria-labelledby="more" className="pb-24 pt-6">
        <h2 id="more" className="m-0 font-display text-[28px] font-semibold tracking-[-.03em]">
          Also in TopShelf
        </h2>
        <ul className="m-0 mt-5 grid list-none gap-3 p-0 sm:grid-cols-3">
          {related.map((r) => {
            const m = r.id ? FEATURE_META[r.id] : null;
            return (
              <li key={r.slug}>
                <a href={`/features/${r.slug}`} className="flex h-full flex-col gap-1.5 rounded-[22px] p-5 transition-transform duration-300 ease-spring hover:-translate-y-1" style={{ background: m?.bg ?? "#ECEBFF" }}>
                  <b className="font-display text-lg font-semibold">{r.label}</b>
                  <span className="text-[14px] text-ink/70">{r.seo}.</span>
                </a>
              </li>
            );
          })}
        </ul>
        <p className="mt-6">
          <a href="/features" className="text-[15px] underline underline-offset-4">
            See all features
          </a>
        </p>
      </section>
    </Subpage>
  );
}
