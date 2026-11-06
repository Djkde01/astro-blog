export interface Post {
  frontmatter: {
    title: string;
    description: string;
    date: string;
    category: string;
    author: string;
    image: { src: string; alt: string };
    robots?: string;
    draft?: boolean;
  };
  url: string;
}
