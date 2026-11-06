import { siteConfig } from "@/config/site";
import { DemoProvider } from "@/components/demo-provider";
import { MotionProvider } from "@/components/ui/motion-primitives";
import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { Concept } from "@/components/sections/concept";
import { ModuleMarquee } from "@/components/sections/module-marquee";
import { StickyDownload } from "@/components/delight/sticky-download";
import { Playground } from "@/components/playground/playground";
import { Tour } from "@/components/sections/tour";
import { DelightProvider } from "@/components/delight/delight-provider";
import { BuiltForMac } from "@/components/sections/built-for-mac";
import { Details } from "@/components/sections/details";
import { Customiser } from "@/components/sections/customiser";
import { Breaks } from "@/components/sections/breaks";
import { NewIn11 } from "@/components/sections/new-in-11";
import { Privacy } from "@/components/sections/privacy";
import { AppProvider } from "@/components/app-provider";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { FinalCta, Footer } from "@/components/sections/final-cta";
import { organization, softwareApplication } from "@/lib/schema";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    organization(),
    { "@type": "WebSite", "@id": `${siteConfig.url}/#site`, name: siteConfig.name, url: siteConfig.url, publisher: { "@id": `${siteConfig.url}/#org` }, inLanguage: "en-GB" },
    (({ "@context": _c, ...app }) => app)(softwareApplication()),
  ],
};

export default function HomePage() {
  return (
    <MotionProvider>
      <DemoProvider>
        <AppProvider>
        <DelightProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Nav />
        <main id="main">
          <Hero />
          <ModuleMarquee />
          <Concept />
          <Tour />
          <Playground />
          <Breaks />
          <NewIn11 />
          <BuiltForMac />
          <Details />
          <Customiser />
          <Privacy />
          <Pricing />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <StickyDownload />
        </DelightProvider>
        </AppProvider>
      </DemoProvider>
    </MotionProvider>
  );
}
