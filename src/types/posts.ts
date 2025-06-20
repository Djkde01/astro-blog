export interface Post {
  frontmatter: {
    title: string;
    description: string;
    date: string;
    category: string;
    image: string;
  };
  url: string;
}
