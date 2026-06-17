export interface Project {
  id: string;
  title: string;
  tech: string;
  url: string;
  img: string;
  year: string;
  desc: string;
  order?: number;
}

export interface TechItem {
  id?: string;
  name: string;
}

export interface TechCategory {
  id?: string;
  order?: number;
  label: string;
  items?: TechItem[];
}
