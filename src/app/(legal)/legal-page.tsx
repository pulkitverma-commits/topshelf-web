import Link from "next/link";
import { Logo } from "@/components/ui/primitives";

/** Minimal shell for legal pages. Replace the placeholder copy with your real policies. */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-16 sm:px-8">
      <Link href="/" aria-label="TopShelf home">
        <Logo />
      </Link>
      <h1 className="mb-6 mt-16 font-display text-5xl font-semibold tracking-[-.04em]">{title}</h1>
      <div className="flex flex-col gap-4 text-lg text-muted">{children}</div>
    </div>
  );
}
