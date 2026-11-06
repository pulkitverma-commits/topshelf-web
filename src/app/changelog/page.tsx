import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PageHead, Subpage } from "@/components/site/subpage";
import { DownloadButton } from "@/components/delight/download";
import { RELEASES } from "@/lib/pages";

export const metadata: Metadata = {
  title: { absolute: "What's new in TopShelf for Mac: release notes" },
  description: "Release notes for TopShelf for Mac: Celebration alerts, opening on the Shelf with ⌘-drag, staying open while you use it, install and login, and clipboard upgrades in 1.1.",
  alternates: { canonical: "/changelog" },
};

export default function ChangelogPage() {
  return (
    <Subpage crumbs={[{ name: "What's new", path: "/changelog" }]}>
      <PageHead kicker="Release notes" title={<>What&apos;s new in <b>TopShelf.</b></>} lead="Every release, newest first." />
      <ol className="m-0 flex list-none flex-col gap-8 p-0 pb-24">
        {RELEASES.map((r, ri) => (
          <li key={r.version} className="grid gap-5 rounded-[30px] bg-white p-6 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-9 lg:grid-cols-[minmax(0,3fr)_minmax(0,8fr)]">
            <div className="flex flex-col items-start gap-3">
              <h2 className="m-0 font-display text-[34px] font-semibold tracking-[-.035em]">{r.version}</h2>
              {r.build && <span className="text-sm text-muted">Build {r.build}</span>}
              <span className="text-sm text-muted">{r.size} disk image</span>
              {ri === 0 ? (
                <DownloadButton size="sm" />
              ) : (
                <a href={r.file} download className="text-sm underline underline-offset-4">
                  Download {r.version}
                </a>
              )}
            </div>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {r.items.map((it) => (
                <li key={it.h} className="rounded-[20px] bg-canvas p-5">
                  <h3 className="m-0 font-display text-lg font-semibold">{it.h}</h3>
                  <p className="m-0 mt-1 text-[15.5px] text-muted">{it.p}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="sr-only">{siteConfig.name}</p>
    </Subpage>
  );
}
