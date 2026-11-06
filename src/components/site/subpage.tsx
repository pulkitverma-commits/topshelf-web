import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { MotionProvider } from "@/components/ui/motion-primitives";
import { DelightProvider } from "@/components/delight/delight-provider";
import { Nav } from "@/components/sections/nav";
import { Footer } from "@/components/sections/final-cta";

export interface Crumb {
  name: string;
  path: string;
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** Shared frame for every page other than the home page: nav, breadcrumbs (with schema), footer. */
export function Subpage({ crumbs, children, wide = false }: { crumbs: Crumb[]; children: ReactNode; wide?: boolean }) {
  const all = [{ name: "Home", path: "/" }, ...crumbs];
  return (
    <MotionProvider>
      <DelightProvider>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${siteConfig.url}${c.path === "/" ? "" : c.path}` })),
          }}
        />
        <Nav />
        <main id="main" className={wide ? "" : "mx-auto max-w-[1200px] px-4 sm:px-8"}>
          <nav aria-label="Breadcrumb" className={wide ? "mx-auto max-w-[1200px] px-4 pt-8 sm:px-8" : "pt-8"}>
            <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-[13.5px] text-muted">
              {all.map((c, i) => (
                <li key={c.path} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {i < all.length - 1 ? (
                    <a href={c.path} className="hover:text-ink">
                      {c.name}
                    </a>
                  ) : (
                    <span aria-current="page" className="text-ink">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          {children}
        </main>
        <Footer />
      </DelightProvider>
    </MotionProvider>
  );
}

/** Big page title block used across subpages. */
export function PageHead({ kicker, title, lead, children }: { kicker: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="flex flex-col gap-5 pb-10 pt-12 sm:pt-16">
      <p className="m-0 text-[13px] uppercase tracking-[.08em] text-muted">{kicker}</p>
      <h1 className="m-0 max-w-[900px] text-balance font-display text-[clamp(40px,6vw,76px)] font-medium leading-[1] tracking-[-.045em] [&_b]:font-bold">{title}</h1>
      {lead && <p className="m-0 max-w-[640px] text-pretty text-[clamp(17px,1.4vw,20px)] text-muted">{lead}</p>}
      {children}
    </header>
  );
}

/** Prose styles for long-form pages (privacy, terms, support). */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[760px] pb-24 text-[17px] leading-[1.65] text-[#3a3a3a] [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[28px] [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:tracking-[-.03em] [&_h2]:text-ink [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink [&_li]:mt-1.5 [&_p]:my-3 [&_ul]:my-3 [&_ul]:pl-5 [&_ol]:pl-5">
      {children}
    </div>
  );
}
