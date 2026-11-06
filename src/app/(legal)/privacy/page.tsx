import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PageHead, Prose, Subpage } from "@/components/site/subpage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "TopShelf has no accounts, analytics, telemetry or crash reporting. Here is exactly what the app and this website do with data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const mail = `mailto:${siteConfig.email}`;
  return (
    <Subpage crumbs={[{ name: "Privacy", path: "/privacy" }]}>
      <PageHead kicker="Last updated 6 November 2026" title={<>Privacy <b>policy.</b></>} lead={`${siteConfig.company} makes TopShelf. This policy explains what the TopShelf app for Mac and this website do with data. The short version: almost everything stays on your Mac.`} />
      <Prose>
        <h2>The short version</h2>
        <ul>
          <li>No accounts. You never sign up or sign in to use TopShelf.</li>
          <li>No analytics, telemetry or crash reporting in the app.</li>
          <li>Permissions are asked for only when you turn on a feature that needs them.</li>
          <li>The app makes only three kinds of network request, described below.</li>
        </ul>

        <h2>What stays on your Mac</h2>
        <p>Clipboard history, Shelf files, notes, break statistics and wellness history are stored on your Mac and are not sent to us. API keys you add for the Assistant are stored in the macOS Keychain.</p>

        <h2>Network requests the app makes</h2>
        <ol>
          <li><strong>Album artwork</strong> for the song that is playing in Apple Music or Spotify.</li>
          <li><strong>Assistant requests you start</strong>, including clipboard AI actions you pick. These go to the provider you configure (Claude, an OpenAI-compatible endpoint, or a local Ollama model), under that provider&apos;s own privacy terms. Nothing is sent until you start a request.</li>
          <li><strong>Live scores</strong>, only if you turn Live Scores on, and only for the competitions you follow.</li>
        </ol>

        <h2>Features that read other apps</h2>
        <ul>
          <li><strong>Mail (Inbox):</strong> off until you turn it on. TopShelf reads only the unread count for each account, about once a minute while Mail is running. It never reads messages, senders or subjects, and never opens Mail.</li>
          <li><strong>WhatsApp:</strong> only the unread count.</li>
          <li><strong>Calendar:</strong> read-only, to show your next event.</li>
          <li><strong>Clipboard:</strong> off until you turn it on. It never records passwords, password-manager copies, or anything that looks like a key, token or card number. From 1.1, one-time codes are deleted after two minutes, or you can choose never to record them.</li>
        </ul>

        <h2>This website</h2>
        <p>This website has no analytics and sets no cookies. The interactive demos run entirely in your browser and do not connect to your Mac or any macOS service. The site and the downloads are hosted by Vercel, which, like any web host, processes standard request information (such as IP address and browser type) to deliver pages and keep the service secure.</p>

        <h2>When you email us</h2>
        <p>If you email {siteConfig.email}, we use your address and message only to reply and help you, and keep them only as long as needed for that.</p>

        <h2>Children</h2>
        <p>TopShelf is not directed at children under 13, and we do not knowingly collect their information.</p>

        <h2>Changes</h2>
        <p>If this policy changes, we will update it here and change the date at the top.</p>

        <h2>Contact</h2>
        <p>
          {siteConfig.company} · <a href={mail}>{siteConfig.email}</a>
        </p>
      </Prose>
    </Subpage>
  );
}
