import { siteConfig } from "@/config/site";

export function organization() {
  return { "@type": "Organization", "@id": `${siteConfig.url}/#org`, name: siteConfig.company, url: siteConfig.url, email: siteConfig.email, logo: `${siteConfig.url}/icon.svg` };
}

/** Product facts for search engines. No ratings or reviews: there are none to report. */
export function softwareApplication() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "ProductivityApplication",
    operatingSystem: `macOS ${siteConfig.requirements.minMacOS} or later`,
    softwareVersion: siteConfig.release.version,
    fileSize: siteConfig.release.size,
    downloadUrl: `${siteConfig.url}${siteConfig.links.dmg}`,
    description: siteConfig.description,
    url: siteConfig.url,
    publisher: organization(),
    offers: {
      "@type": "Offer",
      price: siteConfig.offers.lifetime.amount.toFixed(2),
      priceCurrency: siteConfig.offers.lifetime.currency,
      description: `Lifetime licence for ${siteConfig.offers.licenceDevices}, after a ${siteConfig.offers.trial.length} free trial`,
      url: `${siteConfig.url}/download`,
    },
  };
}
