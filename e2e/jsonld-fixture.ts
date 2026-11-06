// Frontmatter for the end-to-end fixture post. Each string would break JSON-LD built by interpolation:
// the quotes end the JSON string, and the closing script tag ends the JSON-LD script.
export const fixturePost = {
  title: 'Fixture "quoted" title </script><script>window.__jsonLdInjected = true</script>',
  description: 'A "description" with <b>markup</b>, a backslash \\ and <!-- a comment opener',
  date: "2026-11-05T00:00:00.000Z",
  category: "Productividad",
  image: { src: "/src/assets/images/post-5.webp", alt: "Fixture cover" },
};
