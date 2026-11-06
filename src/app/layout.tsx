import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Caveat, Instrument_Sans, Questrial } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const questrial = Questrial({ subsets: ["latin"], weight: "400", variable: "--font-questrial", display: "swap" });
const instrument = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-instrument", display: "swap" });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: "800", style: ["normal", "italic"], variable: "--font-barlow", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-caveat", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — A calm shelf at the top of your Mac`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["TopShelf", "Mac app", "MacBook top of screen app", "break reminders for Mac", "20-20-20 eye rest Mac", "now playing Mac", "file shelf Mac", "clipboard history Mac", "Pomodoro timer Mac", "macOS productivity"],
  authors: [{ name: siteConfig.company }],
  creator: siteConfig.company,
  publisher: siteConfig.company,
  category: "productivity",
  formatDetection: { telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    locale: "en_GB",
    title: `${siteConfig.name} — Your Mac has a new favourite spot`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Your Mac has a new favourite spot`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = {
  themeColor: "#F8F8F6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${questrial.variable} ${instrument.variable} ${caveat.variable} ${barlow.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
