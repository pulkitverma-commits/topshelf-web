import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PageHead, Prose, Subpage } from "@/components/site/subpage";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with TopShelf for Mac: installing, shortcuts, start at login, break reminders, Inbox and how to contact us.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  const mail = `mailto:${siteConfig.email}?subject=${encodeURIComponent("TopShelf support")}`;
  return (
    <Subpage crumbs={[{ name: "Support", path: "/support" }]}>
      <PageHead kicker="Support" title={<>We&apos;re here <b>to help.</b></>} lead={<>Email <a className="text-ink underline underline-offset-4" href={mail}>{siteConfig.email}</a> and we&apos;ll get back to you.</>} />
      <Prose>
        <h2>Before you write</h2>
        <p>Tell us your macOS version, your Mac model and the TopShelf version (in Settings), and what you expected to happen. A screenshot helps.</p>

        <h2>Installing</h2>
        <p>
          Open the disk image and drag TopShelf into Applications. If macOS won&apos;t open it the first time, Control-click TopShelf in Applications and choose Open, or use System Settings › Privacy &amp; Security › Open Anyway. The full steps are in the <a href="/download#install">install guide</a>.
        </p>

        <h2>Opening TopShelf</h2>
        <ul>
          <li>Move the pointer to the top centre of the screen. You can change the hover delay in Settings.</li>
          <li>
            Or press {siteConfig.shortcut.keys.join("")} ({siteConfig.shortcut.names.join("-")}). Other defaults: ⌃⌥V clipboard history, ⌃⌥T quick note, ⌃⌥D dashboard. Change any of them in Settings.
          </li>
          <li>TopShelf hides itself in full-screen apps, so they get the whole display.</li>
        </ul>

        <h2>Start at login</h2>
        <p>From 1.1, TopShelf starts at login by default. Turn it off in Settings › General or System Settings › Login Items, and it stays off.</p>

        <h2>Features that are off until you turn them on</h2>
        <p>Inbox, Live Scores, Clipboard and Assistant stay off until you turn them on. Break reminders and watched folders are off until you set them up. If one of these seems missing, check its switch in Settings first.</p>

        <h2>Celebration alerts</h2>
        <p>Prefer something calmer? Choose Colour flash or None in Settings › Appearance › Alert animation. With Reduce Motion on, alerts become a short fade.</p>

        <h2>More answers</h2>
        <p>
          The <a href="/faq">FAQ</a> covers pricing, privacy, music players, Mail and more. Licence questions are covered in the <a href="/terms">terms</a>, and data questions in the <a href="/privacy">privacy policy</a>.
        </p>
      </Prose>
    </Subpage>
  );
}
