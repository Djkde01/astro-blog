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

export function formatBlogPosts(
  posts,
  {
    filterOutDrafts = true,
    filterFuturePosts = true,
    sortBy = "date",
    limit = undefined,
  } = {}
) {
  const filteredPosts = posts.reduce((acc, post) => {
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

  return limit ? sortedPosts.slice(0, limit) : sortedPosts;
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
