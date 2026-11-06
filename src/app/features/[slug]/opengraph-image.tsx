import { ImageResponse } from "next/og";
import { featurePages } from "@/lib/pages";
import { siteConfig } from "@/config/site";

export const alt = "TopShelf feature";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return featurePages().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = featurePages().find((x) => x.slug === slug);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#ECEBFF 0%,#F8F8F6 55%,#E1F3EA 100%)", color: "#171717", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "#5468FF" }} />
          <div style={{ fontSize: 40, fontWeight: 700 }}>TopShelf</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 28, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: 2 }}>{`${p?.label ?? "Feature"} for Mac`}</div>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{p?.title ?? "TopShelf"}</div>
        </div>
        <div style={{ fontSize: 28, color: "#6B6B6B" }}>{`Free for ${siteConfig.offers.trial.length} · then ${siteConfig.offers.lifetime.price} once · macOS 14 or later`}</div>
      </div>
    ),
    size,
  );
}
