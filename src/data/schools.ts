export interface School {
  slug: string;
  name: string;
  regionSlug: string;
  level: "초등학교" | "중학교" | "고등학교";
  availableSubjectSlugs: string[];
}

export const schools: School[] = [
  {
    slug: "yeongtong-middle-school",
    name: "영통중학교",
    regionSlug: "yeongtong",
    level: "중학교",
    availableSubjectSlugs: ["korean", "english", "math", "social", "science"],
  },
  {
    slug: "suwon-high-school",
    name: "수원고등학교",
    regionSlug: "suwon",
    level: "고등학교",
    availableSubjectSlugs: ["korean", "english", "math", "social", "science"],
  },
];

export function getSchoolBySlug(slug: string): School | undefined {
  return schools.find((s) => s.slug === slug);
}
