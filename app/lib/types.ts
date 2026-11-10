export interface Project {
  id: string;
  title: string;
  tech: string;
  url: string;
  img: string;
  year: string;
  desc: string;
  desc_id?: string;
  desc_en?: string;
  order?: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  title_id?: string;
  title_en?: string;
  subtitle?: string;
  subtitle_id?: string;
  subtitle_en?: string;
  location?: string;
  year: string;
  desc: string;
  desc_id?: string;
  desc_en?: string;
  img: string;
  category?: string;
  category_id?: string;
  category_en?: string;
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
