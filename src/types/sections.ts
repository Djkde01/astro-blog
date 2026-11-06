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
