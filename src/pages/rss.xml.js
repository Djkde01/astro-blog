import rss from "@astrojs/rss";

import { formatBlogPosts } from "../js/utils";

const postImportResult = import.meta.glob("./blog/**/*.md", { eager: true });
const posts = formatBlogPosts(Object.values(postImportResult));

export const GET = () =>
  rss({
    stylesheet: "/rss/styles.xsl",
    title: "Blog - Sergio Estrella",
    description: "Posts acerca de programación, tecnología y más.",
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      link: post.url,
      title: post.frontmatter.title,
      pubDate: post.frontmatter.date,
      description: post.frontmatter.description,
      customData: `
      <author>Sergio Estrella</author>
    `,
    })),
  });
