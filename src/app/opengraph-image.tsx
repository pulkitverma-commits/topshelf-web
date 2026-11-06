import { ImageResponse } from "next/og";

export const alt = "TopShelf — Your Mac has a new favourite spot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", background: "#F8F8F6", color: "#171717", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", width: 900, height: 230, marginTop: 70, border: "3px solid #171717", borderBottom: "none", borderRadius: "40px 40px 0 0", justifyContent: "center" }}>
          <div style={{ display: "flex", width: 520, height: 170, background: "#000", borderRadius: "0 0 40px 40px", alignItems: "flex-end", padding: 26, gap: 16 }}>
            <div style={{ width: 100, height: 100, borderRadius: 18, background: "#5468FF" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, justifyContent: "center" }}>
              <div style={{ height: 14, width: "80%", borderRadius: 8, background: "rgba(255,255,255,.35)" }} />
              <div style={{ height: 14, width: "55%", borderRadius: 8, background: "rgba(255,255,255,.2)" }} />
            </div>
          </div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3, marginTop: 50 }}>Your Mac has a new favourite spot.</div>
        <div style={{ fontSize: 30, color: "#6B6B6B", marginTop: 14 }}>TopShelf — a calm shelf at the top of your Mac.</div>
      </div>
    ),
    size,
  );
}
