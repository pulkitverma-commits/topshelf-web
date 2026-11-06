import type { Metadata } from "next";
import { Download } from "lucide-react";
import { siteConfig } from "@/config/site";
import { JsonLd, PageHead, Subpage } from "@/components/site/subpage";
import { DownloadButton } from "@/components/delight/download";
import { softwareApplication } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: `Download TopShelf for Mac: free for ${siteConfig.offers.trial.length}` },
  description: `Download TopShelf ${siteConfig.release.version} for macOS ${siteConfig.requirements.minMacOS} or later. A ${siteConfig.release.size} universal disk image for Apple silicon and Intel. Free for ${siteConfig.offers.trial.length}, then ${siteConfig.offers.lifetime.price} once.`,
  alternates: { canonical: "/download" },
};

const STEPS = [
  { h: "Open the disk image", p: `Open ${siteConfig.links.dmg.split("/").pop()} from your Downloads folder.` },
  { h: "Drag TopShelf into Applications", p: "Drag the TopShelf icon onto the Applications folder in the window that opens. If you open TopShelf straight from the disk image instead, it offers to move itself into Applications." },
  { h: "Open TopShelf", p: "Open it from Applications. It starts at login by default; you can turn that off in Settings › General." },
  { h: "Move your pointer to the top", p: `Move the pointer to the top centre of the screen and TopShelf opens. Or press ${siteConfig.shortcut.keys.join("")} (${siteConfig.shortcut.names.join("-")}).` },
];

export default function DownloadPage() {
  const rows = [
    ["Version", `${siteConfig.release.version} (build ${siteConfig.release.build})`],
    ["Size", `${siteConfig.release.size} disk image`],
    ["Requires", siteConfig.requirements.systemRequirementsLabel],
    ["Price", `Free for ${siteConfig.offers.trial.length}, then ${siteConfig.offers.lifetime.price} once (US dollars)`],
    ["Licence", `${siteConfig.offers.licenceDevices} · ${siteConfig.offers.updateTerms}`],
    ["SHA-256", siteConfig.release.sha256],
  ];
  return (
    <Subpage crumbs={[{ name: "Download", path: "/download" }]}>
      <JsonLd data={softwareApplication()} />
      <PageHead kicker={`TopShelf ${siteConfig.release.version}`} title={<>Download TopShelf <b>for Mac.</b></>} lead={`A ${siteConfig.release.size} universal download for Apple silicon and Intel. Free for ${siteConfig.offers.trial.length}, no card and no sign-up.`}>
        <div className="flex flex-wrap items-center gap-3">
          <DownloadButton size="lg">
            <Download className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
            Download TopShelf {siteConfig.release.version}
          </DownloadButton>
          <span className="text-sm text-muted">{siteConfig.requirements.systemRequirementsLabel}</span>
        </div>
      </PageHead>

      <div className="grid gap-10 pb-24 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <section id="install" aria-labelledby="install-title" className="scroll-mt-24">
          <h2 id="install-title" className="m-0 font-display text-[32px] font-semibold tracking-[-.03em]">
            Install in four steps
          </h2>
          <ol className="m-0 mt-6 flex list-none flex-col gap-3 p-0">
            {STEPS.map((s, i) => (
              <li key={s.h} className="flex gap-4 rounded-[22px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)]">
                <span className="grid size-9 flex-none place-items-center rounded-full bg-lavender font-display font-semibold text-accent-deep">{i + 1}</span>
                <span>
                  <b className="block font-display text-lg font-semibold">{s.h}</b>
                  <span className="text-[15.5px] text-muted">{s.p}</span>
                </span>
              </li>
            ))}
          </ol>
          <h3 className="mb-2 mt-10 font-display text-xl font-semibold">If macOS won&apos;t open it</h3>
          <p className="m-0 text-[15.5px] text-muted">
            The first time, macOS checks apps downloaded from the internet. If it says TopShelf can&apos;t be opened, Control-click TopShelf in Applications and choose Open. On newer versions of macOS you may instead need System Settings › Privacy &amp; Security, then Open Anyway next to TopShelf. Still stuck? Email{" "}
            <a className="text-ink underline underline-offset-4" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            .
          </p>
        </section>

        <aside aria-labelledby="details-title" className="flex flex-col gap-4">
          <div className="rounded-[26px] bg-white p-6 shadow-[inset_0_0_0_1px_var(--color-line)]">
            <h2 id="details-title" className="m-0 font-display text-xl font-semibold">
              Release details
            </h2>
            <dl className="m-0 mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2.5 text-[14.5px]">
              {rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">{k}</dt>
                  <dd className={k === "SHA-256" ? "m-0 break-all font-mono text-[12px]" : "m-0"}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-[26px] bg-sand p-6">
            <h2 className="m-0 font-display text-xl font-semibold">Earlier release</h2>
            <p className="m-0 mt-2 text-[14.5px] text-muted">
              TopShelf {siteConfig.release.stableVersion}, {siteConfig.release.stableSize}.{" "}
              <a className="text-ink underline underline-offset-4" href={siteConfig.links.dmgStable} download>
                Download {siteConfig.release.stableVersion}
              </a>
            </p>
            <p className="m-0 mt-2 break-all font-mono text-[12px] text-muted">SHA-256 {siteConfig.release.stableSha256}</p>
          </div>
          <a href="/changelog" className="rounded-[26px] bg-lavender p-6 text-[15px] transition-transform duration-300 ease-spring hover:-translate-y-1">
            <b className="block font-display text-xl font-semibold">What&apos;s new in 1.1 →</b>
            <span className="text-muted">Celebration alerts, ⌘-drag to the Shelf, clipboard upgrades and more.</span>
          </a>
        </aside>
      </div>
    </Subpage>
  );
}
