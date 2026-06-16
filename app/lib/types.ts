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

export interface Branch {
  id?: string;
  label: string;
  desc: string;
}

export interface EducationStep {
  id?: string;
  year: string;
  title: string;
  subtitle: string;
  desc: string;
  order?: number;
  branches?: Branch[];
}
