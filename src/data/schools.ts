/**
 * cityRegionSlug must be a city-level RegionNode.slug from src/data/regions.ts.
 * districtRegionSlug (optional) must, when present, be a district-level
 * RegionNode.slug whose parentSlug equals this school's cityRegionSlug.
 * Both relationships are checked by scripts/lib/route-inventory.ts's
 * checkSchoolDataIntegrity() (see scripts/validate-quick.ts).
 *
 * dataSource: "manual" — verified one by one against public sources (school
 * home pages, 학교알리미, Wikipedia/나무위키 category pages) during Stage 1
 * data entry, not from a bulk official import. "official" is reserved for a
 * future structured import (e.g. NEIS) and unused so far.
 */
export interface School {
  slug: string;
  name: string;
  cityRegionSlug: string;
  districtRegionSlug?: string;
  level: "초등학교" | "중학교" | "고등학교";
  availableSubjectSlugs: string[];
  dataSource: "manual" | "official";
}

const ALL_SUBJECTS = ["korean", "english", "math", "social", "science"];

export const schools: School[] = [
  // 수원 (기존 2건 migration + 신규 초등 1건)
  {
    slug: "yeongtong-elementary-school",
    name: "영통초등학교",
    cityRegionSlug: "suwon",
    districtRegionSlug: "yeongtong",
    level: "초등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "yeongtong-middle-school",
    name: "영통중학교",
    cityRegionSlug: "suwon",
    districtRegionSlug: "yeongtong",
    level: "중학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "suwon-high-school",
    name: "수원고등학교",
    cityRegionSlug: "suwon",
    level: "고등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },

  // 서울 강남구
  {
    slug: "gangnam-elementary-school",
    name: "개원초등학교",
    cityRegionSlug: "gangnam",
    level: "초등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "gangnam-middle-school",
    name: "대치중학교",
    cityRegionSlug: "gangnam",
    level: "중학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "gangnam-high-school",
    name: "개포고등학교",
    cityRegionSlug: "gangnam",
    level: "고등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },

  // 서울 서초구
  {
    slug: "seocho-elementary-school",
    name: "서울서초초등학교",
    cityRegionSlug: "seocho",
    level: "초등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "seocho-middle-school",
    name: "세화여자중학교",
    cityRegionSlug: "seocho",
    level: "중학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "seocho-high-school",
    name: "세화고등학교",
    cityRegionSlug: "seocho",
    level: "고등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },

  // 서울 송파구
  {
    slug: "songpa-elementary-school",
    name: "서울송파초등학교",
    cityRegionSlug: "songpa",
    level: "초등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "songpa-middle-school",
    name: "가락중학교",
    cityRegionSlug: "songpa",
    level: "중학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "songpa-high-school",
    name: "가락고등학교",
    cityRegionSlug: "songpa",
    level: "고등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },

  // 서울 양천구
  {
    slug: "yangcheon-elementary-school",
    name: "서울양천초등학교",
    cityRegionSlug: "yangcheon",
    level: "초등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "yangcheon-middle-school",
    name: "목동중학교",
    cityRegionSlug: "yangcheon",
    level: "중학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "yangcheon-high-school",
    name: "양천고등학교",
    cityRegionSlug: "yangcheon",
    level: "고등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },

  // 서울 마포구
  {
    slug: "mapo-elementary-school",
    name: "서울공덕초등학교",
    cityRegionSlug: "mapo",
    level: "초등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "mapo-middle-school",
    name: "마포중학교",
    cityRegionSlug: "mapo",
    level: "중학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "mapo-high-school",
    name: "마포고등학교",
    cityRegionSlug: "mapo",
    level: "고등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },

  // 경기 성남시
  {
    slug: "seongnam-elementary-school",
    name: "서현초등학교",
    cityRegionSlug: "seongnam",
    level: "초등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "seongnam-middle-school",
    name: "서현중학교",
    cityRegionSlug: "seongnam",
    level: "중학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "seongnam-high-school",
    name: "성남외국어고등학교",
    cityRegionSlug: "seongnam",
    level: "고등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },

  // 경기 용인시
  {
    slug: "yongin-elementary-school",
    name: "신갈초등학교",
    cityRegionSlug: "yongin",
    level: "초등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "yongin-middle-school",
    name: "신갈중학교",
    cityRegionSlug: "yongin",
    level: "중학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "yongin-high-school",
    name: "신갈고등학교",
    cityRegionSlug: "yongin",
    level: "고등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },

  // 경기 고양시
  {
    slug: "goyang-elementary-school",
    name: "백마초등학교",
    cityRegionSlug: "goyang",
    level: "초등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "goyang-middle-school",
    name: "백마중학교",
    cityRegionSlug: "goyang",
    level: "중학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "goyang-high-school",
    name: "고양국제고등학교",
    cityRegionSlug: "goyang",
    level: "고등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },

  // 경기 안양시
  {
    slug: "anyang-elementary-school",
    name: "안양초등학교",
    cityRegionSlug: "anyang",
    level: "초등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "anyang-middle-school",
    name: "안양중학교",
    cityRegionSlug: "anyang",
    level: "중학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "anyang-high-school",
    name: "안양외국어고등학교",
    cityRegionSlug: "anyang",
    level: "고등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },

  // 경기 부천시
  {
    slug: "bucheon-elementary-school",
    name: "부천초등학교",
    cityRegionSlug: "bucheon",
    level: "초등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "bucheon-middle-school",
    name: "부천중학교",
    cityRegionSlug: "bucheon",
    level: "중학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
  {
    slug: "bucheon-high-school",
    name: "부천고등학교",
    cityRegionSlug: "bucheon",
    level: "고등학교",
    availableSubjectSlugs: ALL_SUBJECTS,
    dataSource: "manual",
  },
];

export function getSchoolBySlug(slug: string): School | undefined {
  return schools.find((s) => s.slug === slug);
}
