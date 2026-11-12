import type { Metadata } from "next";
import { PageHead, Subpage } from "@/components/site/subpage";
import { currentUser } from "@/lib/supabase/server";
import { accountsEnabled } from "@/lib/supabase/env";
import { SignIn } from "@/components/account/sign-in";
import { LinkApprove } from "@/components/account/link-approve";
import { describeLink } from "@/lib/device-health/service";
import { store } from "@/lib/device-health/http";

export const metadata: Metadata = {
  title: "Link your Mac",
  description: "Confirm the code TopShelf shows on your Mac to link it to your account.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LinkPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code = "" } = await searchParams;
  const crumbs = [{ name: "Your devices", path: "/account" }, { name: "Link your Mac", path: "/link" }];
  const head = <PageHead kicker="Device Health" title={<>Link <b>your Mac.</b></>} />;

  if (!accountsEnabled) {
    return <Subpage crumbs={crumbs}>{head}<p className="pb-24 text-[17px] text-muted">Accounts aren&apos;t switched on for this site yet.</p></Subpage>;
  }
  const user = await currentUser();
  if (!user) {
    return (
      <Subpage crumbs={crumbs}>
        {head}
        <p className="mt-0 text-[17px] text-muted">Sign in first, then confirm the code from your Mac.</p>
        <div className="pb-24"><SignIn next={`/link?code=${encodeURIComponent(code)}`} /></div>
      </Subpage>
    );
  }
  const info = code ? await describeLink(store(), code, new Date()) : null;
  return (
    <Subpage crumbs={crumbs}>
      {head}
      <div className="pb-24">
        {info ? <LinkApprove info={info} /> : (
          <p className="text-[17px] text-muted">We couldn&apos;t find that code. On your Mac, open TopShelf Settings › Device Health and choose “Link this Mac” to get a new one.</p>
        )}
      </div>
    </Subpage>
  );
}
