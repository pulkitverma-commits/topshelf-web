import { siteConfig } from "@/config/site";
import { featurePages } from "@/lib/pages";

export const dynamic = "force-static";

/** /llms.txt: a plain-text map of the site for AI assistants and answer engines (llmstxt.org). */
export function GET() {
  const u = siteConfig.url;
  const features = featurePages()
    .map((p) => `- [${p.label}](${u}/features/${p.slug}): ${p.seo}${p.upcoming ? " (coming in the next update)" : ""}`)
    .join("\n");
  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is a native macOS app by ${siteConfig.company}. It runs on ${siteConfig.requirements.systemRequirementsLabel}. It is free for ${siteConfig.offers.trial.length} with no card and no sign-up, then ${siteConfig.offers.lifetime.price} once (US dollars) for a lifetime licence covering ${siteConfig.offers.licenceDevices}, with ${siteConfig.offers.updateTerms}. There is no subscription. The latest build is version ${siteConfig.release.version} (${siteConfig.release.size}).

## Get started

- [Download TopShelf](${u}/download): the latest build, system requirements and checksum
- [All features](${u}/features): everything TopShelf puts at the top of your Mac
- [FAQ](${u}/faq): pricing, privacy, install and features
- [Changelog](${u}/changelog): release notes

## Features

${features}

## Company

- [About](${u}/about): ${siteConfig.company} and the products it makes
- [Support](${u}/support): help and contact (${siteConfig.email})
- [Privacy policy](${u}/privacy)
- [Terms of use and licence](${u}/terms)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
