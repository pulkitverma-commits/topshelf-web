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
      <PageHead kicker="Last updated 12 November 2026" title={<>Privacy <b>policy.</b></>} lead={`${siteConfig.company} makes TopShelf. This policy explains what the TopShelf app for Mac and this website do with data. The short version: almost everything stays on your Mac.`} />
      <Prose>
        <h2>The short version</h2>
        <ul>
          <li>No account needed. You never have to sign up or sign in to use TopShelf. An optional account exists only to see Device Health readings from a browser.</li>
          <li>No analytics, telemetry or crash reporting in the app.</li>
          <li>Permissions are asked for only when you turn on a feature that needs them.</li>
          <li>The app makes network requests only for the features listed below, and only when you use them.</li>
        </ul>

        <h2>What stays on your Mac</h2>
        <p>Clipboard history, Shelf files, notes, break statistics and wellness history are stored on your Mac and are not sent to us. API keys you add for the Assistant are stored in the macOS Keychain.</p>

        <h2>Network requests the app makes</h2>
        <ol>
          <li><strong>Album artwork</strong> for the song that is playing in Apple Music or Spotify.</li>
          <li><strong>Assistant requests you start</strong>, including clipboard AI actions you pick. These go to the provider you configure (Claude, an OpenAI-compatible endpoint, or a local Ollama model), under that provider&apos;s own privacy terms. Nothing is sent until you start a request.</li>
          <li><strong>Live scores</strong>, only if you turn Live Scores on, and only for the competitions you follow.</li>
          <li><strong>Send Securely</strong>, only when you create a share. Content is encrypted on your Mac before upload; OnePeek, which stores it, receives only ciphertext plus the share&apos;s size, expiry and view limit, and the network address of whoever opens it.</li>
          <li><strong>iCloud sync</strong> of settings and quick notes, through your own iCloud account, in builds signed for iCloud (not the current preview download).</li>
          <li><strong>Device Health account sync</strong>, only if you link a Mac to a TopShelf account (described below).</li>
        </ol>

        <h2>Device Health and TopShelf accounts</h2>
        <p>Device Health works entirely on your Mac without an account. If you choose to link a Mac to a TopShelf account so you can see it from a browser:</p>
        <ul>
          <li><strong>What we store:</strong> your email address (to sign you in); each linked Mac&apos;s name, macOS and TopShelf versions; for each device it reports, its name, type, connection state and battery, storage and temperature-state readings; alerts it raised; your Device Health settings; and, only if you turn on “Upload battery history”, battery-level samples.</li>
          <li><strong>What we don&apos;t:</strong> Bluetooth addresses, serial numbers or other hardware identifiers. Devices are identified by a code derived on your Mac that is different on every Mac.</li>
          <li><strong>How long:</strong> readings are replaced with each report; uploaded battery history is deleted after 30 days. Unlinking a Mac (on the Mac or the website) revokes its access and deletes everything it reported.</li>
          <li><strong>Where:</strong> stored with our database provider, Supabase, and served by Vercel. It is never used for advertising and never sold or shared for marketing.</li>
          <li><strong>Deleting your account:</strong> email {siteConfig.email} and we&apos;ll delete it and everything linked to it.</li>
        </ul>

        <h2>Features that read other apps</h2>
        <ul>
          <li><strong>Mail (Inbox):</strong> off until you turn it on. TopShelf reads the unread count for each account, about once a minute while Mail is running, and never opens Mail.{siteConfig.flags.inboxLatestInBuild ? " If you also allow Full Disk Access, it reads the sender, subject, time and read state of your newest inbox messages from Mail's index on your Mac to list them. It never reads message bodies, and none of this leaves your Mac." : " It never reads messages, senders or subjects."}</li>
          <li><strong>WhatsApp:</strong> only the unread count.</li>
          <li><strong>Calendar:</strong> read-only, to show your next event.</li>
          <li><strong>Clipboard:</strong> off until you turn it on. It never records passwords, password-manager copies, or anything that looks like a key, token or card number. From 1.1, one-time codes are deleted after two minutes, or you can choose never to record them.</li>
        </ul>

        <h2>This website</h2>
        <p>This website has no analytics. It sets cookies only when you sign in to a TopShelf account, to keep you signed in. The interactive demos run entirely in your browser and do not connect to your Mac or any macOS service. The site and the downloads are hosted by Vercel, which, like any web host, processes standard request information (such as IP address and browser type) to deliver pages and keep the service secure.</p>

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
