export function slugify(string) {
  return string.toLowerCase().replace(/\s+/g, "-");
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
export async function formatBlogPosts(
  posts,
  {
    filterOutDrafts = true,
    filterFuturePosts = true,
    sortBy = "date",
    limit = 0,
  } = {}
) {
  // Convert the object of modules to an array of post data
  const postsArray = Object.values(posts).map((post) => ({
    frontmatter: post.frontmatter,
    url: post.url,
    ...post,
  }));

  const filteredPosts = postsArray.reduce((acc, post) => {
    const { date, draft } = post.frontmatter;

    if (filterOutDrafts && draft) {
      return acc;
    }
    if (filterFuturePosts && new Date(date) > new Date()) {
      return acc;
    }
    return [...acc, post];
  }, []);

  const sortedPosts = sortPosts(sortBy, filteredPosts);

  return limit > 0 ? sortedPosts.slice(0, limit) : sortedPosts;
}

// Picks the posts shown under an article. `posts` comes from formatBlogPosts, newest first.
// Same-category posts go first; when they run short, the newest posts from any category fill in.
// `sameCategory` is true only when every picked post shares the current post's category.
export function selectRelatedPosts(posts, current, count = 3) {
  const others = posts.filter((post) => post.url !== current.url);
  const { category } = current.frontmatter;
  const same = others.filter((post) => post.frontmatter.category === category);
  const fill = others.filter((post) => post.frontmatter.category !== category);
  const picked = [...same, ...fill].slice(0, count);
  return { posts: picked, sameCategory: picked.length > 0 && picked.length <= same.length };
}

function sortPosts(sortType, posts) {
  switch (sortType) {
    case "date":
      return posts.sort((a, b) => {
        const dateA = new Date(a.frontmatter.date);
        const dateB = new Date(b.frontmatter.date);
        return dateB - dateA;
      });
    case "title":
      return posts.sort((a, b) => {
        const titleA = a.frontmatter.title;
        const titleB = b.frontmatter.title;
        return titleA.localeCompare(titleB);
      });
    default:
      return posts;
  }
}

// Full years since the first job, in May 2021. `now` is a parameter so a test can pin it.
export function getExperienceInYears(now = new Date()) {
  const start = new Date(2021, 4, 1);
  const hadAnniversary = now >= new Date(now.getFullYear(), start.getMonth(), start.getDate());
  return now.getFullYear() - start.getFullYear() - (hadAnniversary ? 0 : 1);
}

// The text of the landing's Ahora strip. `experience` comes from src/data/experience.ts and
// `now` from landing.now. The current job is the entry whose period ends in "Actualidad";
// its "<role> - <company>" title fills "{job}" in the working text as "<role> en <company>".
// With no current job, the open text comes back with its link.
export function selectNow(experience, now) {
  const current = experience.find(({ period }) => period.trim().endsWith("Actualidad"));
  if (!current) return { text: now.open, link: now.link };
  const split = current.title.lastIndexOf(" - ");
  const job = split === -1 ? current.title : `${current.title.slice(0, split)} en ${current.title.slice(split + 3)}`;
  return { text: now.working.replace("{job}", job) };
}
