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

// The entries a page shows: drafts are placeholders, rendered under `astro dev` only.
// Pages pass `import.meta.env.DEV`; tests pass a boolean.
export function published(entries, includeDrafts) {
  return includeDrafts ? entries : entries.filter(({ draft }) => !draft);
}

// A talk's ISO date ("2025-11-29") as "29 nov 2025".
export function formatTalkDate(date) {
  return new Intl.DateTimeFormat("es", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`))
    .replace(".", "");
}

// A talk dated on or after `today` is upcoming. The day is the build's, so a deploy that is not
// rebuilt after the talk keeps showing it as upcoming.
export function isUpcoming({ date }, today = new Date()) {
  return date >= today.toISOString().slice(0, 10);
}

// The text of the landing's Ahora strip. `experience` comes from src/data/experience.ts, `now`
// from landing.now and `talks` from src/data/talks.ts. The earliest published talk dated on or
// after `today` comes first, with a link to its registration, post, slides or recording.
// Otherwise the current job is the entry whose period ends in "Actualidad"; its
// "<role> - <company>" title fills "{job}" in the working text as "<role> en <company>".
// With no current job, the open text comes back with its link.
export function selectNow(experience, now, talks = [], today = new Date()) {
  const [next] = talks
    .filter((talk) => !talk.draft && isUpcoming(talk, today))
    .toSorted((a, b) => a.date.localeCompare(b.date));
  if (next) {
    const text = now.upcoming.text
      .replace("{talk}", next.title)
      .replace("{event}", next.event)
      .replace("{date}", formatTalkDate(next.date));
    const href = next.registration ?? (next.post && `/blog/${next.post}`) ?? next.slides ?? next.recording;
    return href ? { text, link: { text: now.upcoming.link, href } } : { text };
  }
  const current = experience.find(({ period }) => period.trim().endsWith("Actualidad"));
  if (!current) return { text: now.open, link: now.link };
  const split = current.title.lastIndexOf(" - ");
  const job = split === -1 ? current.title : `${current.title.slice(0, split)} en ${current.title.slice(split + 3)}`;
  return { text: now.working.replace("{job}", job) };
}

// The post a talk or a community event names by slug. `posts` comes from formatBlogPosts, so a
// draft or future post is missing, and the build stops rather than link to a page that is not there.
export function findPost(posts, slug) {
  const post = posts.find(({ url }) => url === `/blog/${slug}`);
  if (!post) throw new Error(`No published post at src/pages/blog/${slug}.md`);
  return post;
}
