import type { Metadata } from "next";
import { PageHead, Subpage } from "@/components/site/subpage";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  const links = [
    ["/", "Home"],
    ["/features", "Features"],
    ["/download", "Download"],
    ["/faq", "FAQ"],
    ["/support", "Support"],
  ];
  return (
    <Subpage crumbs={[{ name: "Not found", path: "/404" }]}>
      <PageHead kicker="404" title={<>This shelf is <b>empty.</b></>} lead="The page you were looking for isn't here. Try one of these instead." />
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0 pb-32">
        {links.map(([href, label]) => (
          <li key={href}>
            <a href={href} className="inline-flex h-11 items-center rounded-full bg-white px-5 text-[15px] shadow-[inset_0_0_0_1px_var(--color-line-strong)] transition-colors hover:bg-ink hover:text-white">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </Subpage>
  );
}
