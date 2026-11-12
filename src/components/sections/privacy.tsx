import { Ban, HardDrive, Lock, MailCheck, ToggleLeft } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/motion-primitives";
import { siteConfig } from "@/config/site";

const PROMISES = [
  { Icon: Ban, title: "No account needed, no tracking", body: "TopShelf works without signing up. No analytics, telemetry or crash reporting. Permissions are asked for only when you turn on a feature that needs them." },
  { Icon: Lock, title: "Network only for what you use", body: "Album artwork; Assistant requests you start; live scores if you turn them on; Send Securely shares you create (encrypted on your Mac first); settings sync through your own iCloud, in builds signed for it; and Device Health readings only if you link a Mac to an account." },
  { Icon: ToggleLeft, title: "Off until you choose", body: "Inbox, Live Scores, Clipboard, Assistant and Sense stay off until you turn them on. Break reminders and watched folders are off until you set them up. Nothing is ever linked to an account unless you link it." },
  { Icon: HardDrive, title: "Stays on your Mac", body: "Clipboard history, shelf files, notes, break stats and wellness history stay on the Mac. API keys live in the macOS Keychain." },
  { Icon: MailCheck, title: "Reads only what's needed", body: siteConfig.flags.inboxLatestInBuild
    ? "From Mail: unread counts, and with Full Disk Access the sender, subject and time of your newest inbox messages, read on your Mac. Never message bodies. TopShelf never opens Mail. Calendar is read-only."
    : "From Mail, only unread counts are read, never messages, senders or subjects. TopShelf never opens Mail; it checks about once a minute while Mail is running. Calendar is read-only." },
];

export function Privacy() {
  return (
    <section id="privacy" aria-labelledby="privacy-title" className="bg-[#1C1C1E] py-24 text-white sm:py-[140px]">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-8 min-[901px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Reveal className="flex flex-col gap-[18px]">
          <p className="m-0 text-[13px] uppercase tracking-[.08em] text-white/55">Private by design</p>
          <h2 id="privacy-title" className="m-0 text-balance font-display text-[clamp(34px,4.8vw,64px)] font-medium leading-[1.03] tracking-[-.04em]">
            No account needed. <b className="font-bold">No tracking.</b>
          </h2>
          <p className="m-0 max-w-[420px] text-[17px] text-white/65">TopShelf is native Swift with no third-party code, and almost everything it does happens on your Mac.</p>
        </Reveal>
        <ul className="m-0 grid list-none gap-3 p-0">
          {PROMISES.map(({ Icon, title, body }, i) => (
            <Reveal as="li" key={title} delay={i * 0.05} className="flex gap-4 rounded-[22px] bg-white/[.05] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]">
              <Icon className="mt-0.5 size-[22px] flex-none text-accent-soft" strokeWidth={1.7} aria-hidden="true" />
              <div>
                <b className="block font-display text-lg font-semibold tracking-[-.01em]">{title}</b>
                <span className="text-[15px] text-white/65">{body}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
