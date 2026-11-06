import { siteConfig } from "@/config/site";
import { DemoProvider } from "@/components/demo-provider";
import { MotionProvider } from "@/components/ui/motion-primitives";
import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { Concept } from "@/components/sections/concept";
import { Playground } from "@/components/playground/playground";
import { Story } from "@/components/sections/story";
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
import { FAQS } from "@/lib/demo-data";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: siteConfig.name,
      applicationCategory: "ProductivityApplication",
      operatingSystem: "macOS",
      description: siteConfig.description,
      url: siteConfig.url,
    },
    {
      "@type": "FAQPage",
      // Only answers confirmed against the shipped product are published as structured data.
      mainEntity: FAQS.filter((f) => !f.toConfirm).map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <MotionProvider>
      <DemoProvider>
        <AppProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Nav />
        <main id="main">
          <Hero />
          <Concept />
          <Playground />
          <Breaks />
          <NewIn11 />
          <Story />
          <BuiltForMac />
          <Details />
          <Customiser />
          <Privacy />
          <Pricing />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        </AppProvider>
      </DemoProvider>
    </MotionProvider>
  );
}
