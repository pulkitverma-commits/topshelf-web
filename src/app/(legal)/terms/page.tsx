import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PageHead, Prose, Subpage } from "@/components/site/subpage";

export const metadata: Metadata = {
  title: "Terms of use and licence",
  description: `Terms for TopShelf for Mac: a ${siteConfig.offers.trial.length} free trial, then a ${siteConfig.offers.lifetime.price} lifetime licence for ${siteConfig.offers.licenceDevices} with ${siteConfig.offers.updateTerms}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const { offers, company, email } = siteConfig;
  return (
    <Subpage crumbs={[{ name: "Terms", path: "/terms" }]}>
      <PageHead kicker="Last updated 6 November 2026" title={<>Terms &amp; <b>licence.</b></>} lead={`These terms are an agreement between you and ${company} for the TopShelf app for Mac and this website. By downloading or using TopShelf, you agree to them.`} />
      <Prose>
        <h2>1. Free trial</h2>
        <p>You can use every feature of TopShelf free for {offers.trial.length}. No payment details or account are needed for the trial.</p>

        <h2>2. Lifetime licence</h2>
        <ul>
          <li>Price: {offers.lifetime.price} (US dollars), paid once. There is no subscription.</li>
          <li>One licence lets you use TopShelf on {offers.licenceDevices} that you own or control.</li>
          <li>Updates: {offers.updateTerms}. A later major version may be offered separately.</li>
          <li>The licence is personal to you and may not be resold, shared beyond the Macs above, or transferred without our written permission.</li>
        </ul>

        <h2>3. Preview releases</h2>
        <p>Builds labelled &ldquo;preview&rdquo; are early versions. They may contain bugs or change before the final release.</p>

        <h2>4. What you may not do</h2>
        <ul>
          <li>Copy, redistribute, rent or sell TopShelf, except as these terms allow.</li>
          <li>Reverse engineer, decompile or modify the app, except where the law allows this despite these terms.</li>
          <li>Use TopShelf to break the law or to interfere with other people&apos;s devices or data.</li>
        </ul>

        <h2>5. Other services</h2>
        <p>Some features work with apps and services from other companies, such as Apple Music, Spotify, Mail, WhatsApp, your calendar, live-score data and the Assistant provider you choose. Those services have their own terms, and we are not responsible for them.</p>

        <h2>6. Privacy</h2>
        <p>
          How the app and this website handle data is described in the <a href="/privacy">privacy policy</a>.
        </p>

        <h2>7. No warranty</h2>
        <p>TopShelf is provided &ldquo;as is&rdquo;, without warranties of any kind, to the fullest extent the law allows. We do not promise it will be error-free or work without interruption.</p>

        <h2>8. Limitation of liability</h2>
        <p>To the fullest extent the law allows, {company} is not liable for indirect or consequential losses, and our total liability for any claim relating to TopShelf is limited to the amount you paid for your licence. Nothing in these terms limits liability that cannot be limited by law.</p>

        <h2>9. Trademarks</h2>
        <p>TopShelf is a product of {company}. Mac, macOS, Apple Music and FaceTime are trademarks of Apple Inc. Other names are trademarks of their owners. TopShelf is not affiliated with or endorsed by Apple or any other company named on this site.</p>

        <h2>10. Changes and contact</h2>
        <p>
          We may update these terms; the date at the top shows the latest version. Questions? Email <a href={`mailto:${email}`}>{email}</a>.
        </p>
      </Prose>
    </Subpage>
  );
}
