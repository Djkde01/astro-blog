export type ProjectStatus = "deployed" | "development";

export interface Project {
  title: string;
  description: string;
  image: string;
  status: ProjectStatus;
  link?: string;
  github?: string;
}

export interface Experience {
  title: string;
  period: string;
  description: string;
  link?: string;
}

export interface HeroButton {
  text: string;
  href: string;
  variant: "solid" | "outline";
  icon: { name: string; side: "left" | "right" };
}

export interface Landing {
  title: string;
  hero: {
    photoAlt: string;
    name: string;
    role: string;
    value: string;
    buttons: HeroButton[];
  };
  now: {
    label: string;
    // "{job}" is replaced by the current job, as "<role> en <company>".
    working: string;
    // Shown with the link when no job in experience.ts is current.
    open: string;
    link: { text: string; href: string };
  };
  metrics: {
    label: string;
    // The post category whose posts count as talks.
    talksCategory: string;
    talks: string;
    years: string;
    posts: string;
  };
  latestPosts: { title: string; count: number };
}

// One run of text in a paragraph; `highlight` marks it with the accent color.
export interface TextSegment {
  text: string;
  highlight?: boolean;
}

export interface SectionHeading {
  title: string;
  icon: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface FindMeLink {
  network: string;
  handle: string;
  href: string;
  icon: string;
}

export interface AboutPage {
  title: string;
  intro: {
    photoAlt: string;
    greeting: string;
    greetingEmoji: string;
    // "{years}" in a segment is replaced by the computed years of experience.
    paragraphs: TextSegment[][];
  };
  findMe: SectionHeading & { links: FindMeLink[] };
  services: SectionHeading;
  experience: SectionHeading;
  projects: SectionHeading;
}

// One link on /enlaces. `id` is the link_id sent to analytics: keep it when the label or href changes.
export interface HubLink {
  id: string;
  label: string;
  href: string;
  description?: string;
  highlighted: boolean;
}

export interface LinkHub {
  title: string;
  description: string;
  newTabNote: string;
  // In page order: the highlighted links render first, as cards.
  links: HubLink[];
}
