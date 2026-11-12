import type { Metadata } from "next";
import { PageHead, Subpage } from "@/components/site/subpage";
import { currentUser } from "@/lib/supabase/server";
import { accountsEnabled } from "@/lib/supabase/env";
import { SignIn, SignOut } from "@/components/account/sign-in";
import { BrowserAlertsToggle, DeviceHealthDashboard } from "@/components/account/device-health-dashboard";

export const metadata: Metadata = {
  title: "Your devices",
  description: "Device Health readings reported by the Macs you've linked to your TopShelf account.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/account" },
};

export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const crumbs = [{ name: "Your devices", path: "/account" }];

  if (!accountsEnabled) {
    return (
      <Subpage crumbs={crumbs}>
        <PageHead kicker="Device Health" title={<>Your devices, <b>from any browser.</b></>}
          lead="Accounts aren't switched on for this site yet. Device Health works fully inside TopShelf on your Mac: open Device Health in the notch, or Settings › Device Health." />
      </Subpage>
    );
  }

  const user = await currentUser();
  if (!user) {
    return (
      <Subpage crumbs={crumbs}>
        <PageHead kicker="Device Health" title={<>Your devices, <b>from any browser.</b></>}
          lead="Sign in to see the battery, storage and connection readings your linked Macs report, and to change their alert settings." />
        {error === "link" && <p role="alert" className="mt-0 text-[15px] text-[#b42318]">That sign-in link has expired or was already used. Send a new one.</p>}
        <div className="pb-24"><SignIn /></div>
      </Subpage>
    );
  }

  return (
    <Subpage crumbs={crumbs}>
      <PageHead kicker="Device Health" title={<>Your <b>devices.</b></>}
        lead="Everything here is reported by TopShelf on the Macs you've linked. Readings older than 45 minutes are marked out of date.">
        <div className="flex flex-wrap items-center gap-4"><SignOut /></div>
      </PageHead>
      <DeviceHealthDashboard email={user.email ?? "your account"} />
      <div className="max-w-[560px] pb-24"><BrowserAlertsToggle /></div>
    </Subpage>
  );
}
