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
    // Shown ahead of the job text while a published talk in talks.ts is upcoming.
    upcoming: UpcomingNow;
  };
  metrics: {
    label: string;
    // Counts the published talks in talks.ts dated before the build day.
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
  talks: SectionHeading & {
    // The tag of an upcoming talk; a past talk shows its year.
    upcoming: string;
    links: { registration: string; slides: string; recording: string; post: string };
  };
  community: SectionHeading & {
    organizers: string;
    collaborators: string;
    link: string;
    events: string;
    // The toggle over the folded event chips; "{count}" is how many it hides.
    more: string;
  };
  clients: SectionHeading & { employer: string; freelance: string };
  testimonials: SectionHeading;
  projects: SectionHeading;
}

// One link on /enlaces. `id` is the link_id sent to analytics: keep it when the label or href changes.
export interface HubLink {
  id: string;
  label: string;
  href: string;
  // An astro-icon name from the mdi set.
  icon: string;
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

// Phase 5: talks, community, clients and testimonials. An entry with `draft: true` is a
// placeholder: it renders under `astro dev` only, never in a build (see published() in utils.js).

export interface Talk {
  title: string;
  event: string;
  // ISO date, "YYYY-MM-DD". A talk dated on or after the build day is upcoming.
  date: string;
  place: string;
  language: string;
  slides?: string;
  recording?: string;
  registration?: string;
  // Slug of the post about this talk, under src/pages/blog/. The card takes its cover.
  post?: string;
  // Path under src/assets/images/, used when the talk has no post.
  image?: string;
  draft?: boolean;
}

export interface ExternalEvent {
  title: string;
  url: string;
}

export interface CommunityEntry {
  name: string;
  // Organizers render as cards; collaborators as one row of chips.
  kind: "organizer" | "collaborator";
  role?: string;
  period?: string;
  link?: string;
  // Chips on an organizer's card: the slug of an event post under src/pages/blog/, or an
  // event published elsewhere, which links out in a new tab.
  events?: (string | ExternalEvent)[];
  draft?: boolean;
}

export interface Client {
  // "employer" names the employer, never the client ("· vía Fuse"); "freelance" is a direct client.
  kind: "employer" | "freelance";
  title: string;
  role: string;
  outcome: string;
  // Path under src/assets/images/, such as a logo.
  image?: string;
  draft?: boolean;
}

// Published only with the owner's approval: each quote is a recommendation its author wrote publicly for Sergio.
export interface Testimonial {
  name: string;
  role: string;
  // Left out when the source does not name one; the caption then ends at the role.
  company?: string;
  quote: string;
  draft?: boolean;
}

export interface UpcomingNow {
  // "{talk}", "{event}" and "{date}" are replaced by the upcoming talk's title, event and date.
  text: string;
  link: string;
}
