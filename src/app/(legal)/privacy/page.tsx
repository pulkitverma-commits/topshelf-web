import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy">
      <p>
        <span className="ph">[Privacy policy to be supplied]</span>
      </p>
      <p>The interactive demos on this website run entirely in your browser and do not connect to your Mac or any macOS service.</p>
    </LegalPage>
  );
}
