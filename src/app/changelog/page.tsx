import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { siteConfig } from "@/config/site";
import { PageHead, Subpage } from "@/components/site/subpage";
import { DownloadButton } from "@/components/delight/download";
import { RELEASES } from "@/lib/pages";

export const metadata: Metadata = {
  title: { absolute: "What's new in TopShelf for Mac: release notes" },
  description: "Release notes for TopShelf for Mac: Celebration alerts, opening on the Shelf with ⌘-drag, staying open while you use it, install and login, clipboard upgrades and Breaks in the 1.1 preview, plus what is coming next.",
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
            <div className="flex flex-col gap-3">
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {r.items.map((it) => (
                  <li key={it.h} className="rounded-[20px] bg-canvas p-5">
                    <h3 className="m-0 font-display text-lg font-semibold">{it.h}</h3>
                    <p className="m-0 mt-1 text-[15.5px] text-muted">{it.p}</p>
                  </li>
                ))}
              </ul>
              {"pending" in r && r.pending?.length ? (
                <div className="rounded-[20px] bg-peach p-5 text-[#5a2a0c]">
                  <h3 className="m-0 flex items-center gap-2 font-display text-lg font-semibold">
                    <Clock className="size-4" strokeWidth={1.8} aria-hidden="true" />
                    Coming in the next update
                  </h3>
                  <p className="m-0 mt-1 text-[14px] text-[#8A3D12]">Built and committed after this preview was made, so not in the download above. These ship in the next disk image.</p>
                  <ul className="m-0 mt-3 flex list-none flex-col gap-2.5 p-0">
                    {r.pending.map((it) => (
                      <li key={it.h}>
                        <b className="font-display font-semibold">{it.h}.</b> <span className="text-[15px]">{it.p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      <p className="sr-only">{siteConfig.name}</p>
    </Subpage>
  );
}
