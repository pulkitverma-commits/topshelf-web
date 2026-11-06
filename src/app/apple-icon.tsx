import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(150deg,#7E8BFF 0%,#5468FF 45%,#3A2FBF 100%)" }}>
        <svg width="110" height="110" viewBox="0 0 28 28">
          <rect x="2" y="4" width="24" height="20" rx="6" fill="none" stroke="#fff" strokeWidth="2" />
          <path d="M10 4h8v2.6a2.4 2.4 0 0 1-2.4 2.4h-3.2A2.4 2.4 0 0 1 10 6.6z" fill="#fff" />
          <path d="M8 17.5h12" stroke="#FFD36E" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
