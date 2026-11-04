import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage title="Terms">
      <p>
        <span className="ph">[Terms of use and licence agreement to be supplied]</span>
      </p>
    </LegalPage>
  );
}
