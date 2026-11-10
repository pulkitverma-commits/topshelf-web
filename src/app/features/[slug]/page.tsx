import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Download, ExternalLink, KeyRound, ScanFace, ShieldCheck, Sparkles, UploadCloud, Link2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { JsonLd, PageHead, Subpage } from "@/components/site/subpage";
import { DownloadButton } from "@/components/delight/download";
import { FeatureDemo } from "@/components/site/feature-demo";
import { MacBook } from "@/components/mac/macbook";
import { BREAKS_PAGE, CELEBRATION_PAGE, SENSE_PAGE, SEND_PAGE, THEMES_PAGE, featurePages } from "@/lib/pages";
import { FEATURE_META, extraPageMeta } from "@/lib/feature-meta";
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
  const extra =
    slug === BREAKS_PAGE.slug ? BREAKS_PAGE.points
    : slug === CELEBRATION_PAGE.slug ? CELEBRATION_PAGE.points
    : slug === SENSE_PAGE.slug ? SENSE_PAGE.points
    : slug === SEND_PAGE.slug ? SEND_PAGE.points
    : slug === THEMES_PAGE.slug ? THEMES_PAGE.points
    : p.points ?? null;
  const isSense = slug === SENSE_PAGE.slug;
  const isSend = slug === SEND_PAGE.slug;
  const stepIcons = [KeyRound, UploadCloud, Link2];

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
            {p.upcoming ? "Download TopShelf free" : `Try ${p.label} free`}
          </DownloadButton>
          <span className="text-sm text-muted">
            {p.upcoming ? `${p.label} arrives in the next update. ` : ""}
            Free for {siteConfig.offers.trial.length}, then {siteConfig.offers.lifetime.price} once
          </span>
        </div>
      </PageHead>

      {p.experimental && <p className="m-0 mb-4 inline-flex rounded-full bg-lavender px-3 py-1.5 text-[13px] text-accent-deep">Experimental</p>}
      {p.upcoming && (
        <p className="m-0 mb-4 inline-flex min-h-7 items-center gap-1.5 rounded-2xl bg-peach px-3 py-1.5 text-[13px] text-[#8A3D12]">
          <Clock className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
          Coming in the next update. Not in the build you can download today.
        </p>
      )}

      {p.id ? (
        <section aria-label={`${p.label} demo`} className="pb-6">
          <p className="m-0 mb-3 font-hand text-2xl">go on, it works. try it ↓</p>
          <FeatureDemo id={p.id} stage={p.stage} />
        </section>
      ) : isSend ? (
        <section aria-label="How Send Securely works" className="pb-6">
          <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-3">
            {SEND_PAGE.steps.map((step, n) => {
              const Icon = stepIcons[n];
              return (
                <li key={step.h} className="relative flex flex-col gap-3 rounded-[26px] bg-[#E4F4F7] p-6">
                  <span className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-white text-[#0E6A7E]">
                      <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="font-display text-[13px] font-semibold uppercase tracking-[.08em] text-[#0E6A7E]">Step {n + 1}</span>
                  </span>
                  <b className="font-display text-xl font-semibold tracking-[-.02em]">{step.h}</b>
                  <span className="text-[15px] text-ink/70">{step.p}</span>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-sm text-muted">
            <a href="https://onepeek.io" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-ink">
              Secured by OnePeek
              <ExternalLink className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
            </a>
            {" "}· End-to-end encrypted · No account needed to open
          </p>
        </section>
      ) : isSense ? (
        <section aria-label="Sense preview" className="pb-6">
          {/*
            TODO(sense): replace this neutral device frame with real Sense screenshots once the build exists.
            Nothing here depicts actual Sense UI on purpose: the feature is not shipped yet, so we show the
            generic MacBook frame and a plain label rather than invent an interface.
          */}
          <MacBook className="max-w-[760px]">
            <div className="absolute inset-0 z-30 grid place-items-center">
              <div className="flex max-w-[70%] flex-col items-center gap-3 rounded-[22px] bg-white/80 px-6 py-5 text-center backdrop-blur-md sm:px-8 sm:py-6">
                <span className="grid size-12 place-items-center rounded-2xl" style={{ background: "#EAF4FB", color: "#245E8C" }}>
                  <ScanFace className="size-6" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <b className="font-display text-[clamp(16px,1.8vw,22px)] font-semibold tracking-[-.02em]">Real screenshots coming soon</b>
                <span className="text-[clamp(11px,1.2vw,14px)] text-muted">Sense is in today&apos;s download. We&apos;ll show the real thing here, not a mock-up.</span>
              </div>
            </div>
          </MacBook>
          <p className="mt-8 flex max-w-[720px] gap-2.5 rounded-[22px] bg-peach p-5 text-[16px] text-[#5a2a0c]">
            <Clock className="mt-1 size-4 flex-none" aria-hidden="true" />
            {SENSE_PAGE.status}
          </p>
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
      ) : slug === THEMES_PAGE.slug ? (
        <p className="m-0 pb-6 text-[17px]">
          <a className="inline-flex items-center gap-1.5 underline underline-offset-4" href="/#customise">
            Try every finish in the live customiser <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </p>
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
            {extra ? (isSense ? "What Sense does" : isSend ? "What you can do" : "How it works") : "New in 1.1"}
          </h2>
          {extra && p.next ? (
            <p className="mt-4 flex max-w-[720px] gap-2.5 rounded-[22px] bg-peach p-5 text-[16px] text-[#5a2a0c]">
              <Clock className="mt-1 size-4 flex-none" aria-hidden="true" />
              <span><b className="font-display font-semibold">Coming in the next update: </b>{p.next}</span>
            </p>
          ) : null}
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

      {isSense && (
        <section aria-labelledby="sense-privacy" className="py-12">
          <h2 id="sense-privacy" className="m-0 font-display text-[clamp(28px,3vw,40px)] font-semibold tracking-[-.035em]">
            Private by design
          </h2>
          <p className="m-0 mt-3 max-w-[640px] text-[17px] text-muted">Sense uses the camera, so here is exactly what it does and does not do.</p>
          <ul className="m-0 mt-6 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {SENSE_PAGE.privacy.map((x) => (
              <li key={x.h} className="flex gap-3.5 rounded-[22px] bg-[#1C1C1E] p-5 text-white">
                <ShieldCheck className="mt-0.5 size-[22px] flex-none text-accent-soft" strokeWidth={1.7} aria-hidden="true" />
                <div>
                  <b className="block font-display text-lg font-semibold tracking-[-.01em]">{x.h}</b>
                  <span className="text-[15px] text-white/65">{x.p}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[760px] rounded-[22px] bg-sand p-5 text-[15px] text-[#4a4232] shadow-[inset_0_0_0_1px_var(--color-line)]">
            <b className="font-display font-semibold">Not a medical device.</b> {SENSE_PAGE.disclaimer}
          </p>
        </section>
      )}

      {isSend && (
        <section aria-labelledby="send-privacy" className="py-12">
          <h2 id="send-privacy" className="m-0 font-display text-[clamp(28px,3vw,40px)] font-semibold tracking-[-.035em]">
            What OnePeek can and can&apos;t see
          </h2>
          <p className="m-0 mt-3 max-w-[640px] text-[17px] text-muted">
            Send Securely is built on{" "}
            <a href="https://onepeek.io" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ink">OnePeek</a>
            , a private sharing service. Here is exactly what that means for your data.
          </p>
          <ul className="m-0 mt-6 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {SEND_PAGE.privacy.map((x) => (
              <li key={x.h} className="flex gap-3.5 rounded-[22px] bg-[#1C1C1E] p-5 text-white">
                <ShieldCheck className="mt-0.5 size-[22px] flex-none text-accent-soft" strokeWidth={1.7} aria-hidden="true" />
                <div>
                  <b className="block font-display text-lg font-semibold tracking-[-.01em]">{x.h}</b>
                  <span className="text-[15px] text-white/65">{x.p}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="more" className="pb-24 pt-6">
        <h2 id="more" className="m-0 font-display text-[28px] font-semibold tracking-[-.03em]">
          Also in TopShelf
        </h2>
        <ul className="m-0 mt-5 grid list-none gap-3 p-0 sm:grid-cols-3">
          {related.map((r) => {
            const m = r.id ? FEATURE_META[r.id] : extraPageMeta(r.slug);
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
