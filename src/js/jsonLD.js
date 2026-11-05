import siteData from "../data/siteData.json";
import { socialImageUrl } from "./images";

// Seo.astro writes this with set:html, so escape "<": frontmatter holding "</script>" or "<!--"
// would otherwise end the script. JSON.stringify already escapes quotes and backslashes.
const toScript = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

export default function jsonLDGenerator({ type, post, url }) {
  if (type === "post") {
    return toScript({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": String(url),
      },
      headline: post.title,
      description: post.description,
      image: socialImageUrl(post.image.src),
      author: {
        "@type": "Person",
        name: "Sergio Estrella",
        url: "/about",
      },
      datePublished: post.date,
    });
  }
  return toScript({
    "@context": "https://schema.org/",
    "@type": "WebSite",
    name: siteData.title,
    url: import.meta.env.SITE,
  });
}
