import { Download } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/motion-primitives";
import { ButtonLink, Logo, Value } from "@/components/ui/primitives";

export function FinalCta() {
  return (
    <section id="download" aria-labelledby="download-title" className="relative overflow-hidden bg-[#EEEDFB] pb-[120px] pt-24 text-center sm:pt-[140px]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <Reveal>
          <h2 id="download-title" className="m-0 mx-auto max-w-[900px] text-balance font-display text-[clamp(34px,4.8vw,64px)] font-medium leading-[1.03] tracking-[-.04em]">
            Give the top of your screen <b className="font-bold">something to do.</b>
          </h2>
        </Reveal>
        <div aria-hidden="true" className="relative mx-auto mt-14 h-[250px] w-[min(640px,100%)]">
          <div className="absolute inset-x-0 top-0 h-[200px] rounded-t-[30px] border-[1.5px] border-b-0 border-ink [mask-image:linear-gradient(#000_35%,transparent)]" />
          <div className="loop-final absolute left-1/2 top-0 flex -translate-x-1/2 items-end justify-center gap-2.5 overflow-hidden bg-ink pb-[18px]">
            <i className="loop-final-in block size-[70px] flex-none rounded-xl bg-accent" />
            <i className="loop-final-in block h-[70px] w-[150px] flex-none rounded-xl bg-white/[.12]" />
            <i className="loop-final-in block size-[70px] flex-none rounded-full shadow-[inset_0_0_0_6px_rgba(255,255,255,.2)]" />
          </div>
        </div>
        <ButtonLink href={siteConfig.links.dmg} download size="lg">
          <Download className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
          Download the TopShelf 1.1 preview
        </ButtonLink>
        <p className="mb-0 mt-4 text-sm text-muted">macOS 14 Sonoma or later · Apple silicon &amp; Intel · 3.8 MB disk image</p>
        <p className="mb-0 mt-1 text-sm text-muted">
          Includes Celebration alerts and everything new in 1.1. Prefer the earlier release?{" "}
          <a href={siteConfig.links.dmgStable} download className="underline underline-offset-4 hover:text-ink">
            Download 1.0.0 (2.9 MB)
          </a>
        </p>
        <p className="mb-0 mt-[22px] font-hand text-[22px]">Made for the little space that does a lot.</p>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    { title: "Product", links: [{ href: "#features", label: "Features" }, { href: "#breaks", label: "Breaks" }, { href: "#new", label: "New in 1.1" }, { href: "#pricing", label: "Pricing" }, { href: siteConfig.links.download, label: "Download" }] },
    { title: "Help", links: [{ href: siteConfig.links.support, label: "Support" }, { href: "#faq", label: "FAQs" }, { href: "#privacy", label: "Privacy promises" }] },
    { title: "Legal", links: [{ href: siteConfig.links.privacy, label: "Privacy" }, { href: siteConfig.links.terms, label: "Terms" }] },
  ];
  return (
    <footer className="pb-12 pt-[72px]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <div className="flex flex-wrap justify-between gap-10">
          <a href="#top" aria-label="TopShelf home">
            <Logo />
          </a>
          <nav aria-label="Footer" className="flex flex-wrap gap-14">
            {cols.map((c) => (
              <div key={c.title} className="flex min-w-[120px] flex-col gap-1">
                <b className="mb-1.5 text-[13px] font-normal uppercase tracking-[.08em] text-muted">{c.title}</b>
                {c.links.map((l) => (
                  <a key={l.label} href={l.href} className="py-2 text-[15px] text-[#2d2d2d] hover:text-black">
                    {l.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-[13px] text-muted">
          <span>
            © {new Date().getFullYear()} <Value>{siteConfig.company}</Value>. All rights reserved.
          </span>
          <span>Made for Mac.</span>
        </div>
      </div>
    </footer>
  );
}
