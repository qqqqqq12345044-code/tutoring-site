export type RegionLevel = "province" | "city" | "district";

export interface RegionNode {
  slug: string;
  name: string;
  fullName: string;
  level: RegionLevel;
  parentSlug: string | null;
  children: string[];
}

export const regions: RegionNode[] = [
  { slug: "seoul", name: "서울", fullName: "서울특별시", level: "province", parentSlug: null, children: ["gangnam", "seocho", "songpa", "yangcheon", "mapo"] },
  { slug: "gyeonggi", name: "경기", fullName: "경기도", level: "province", parentSlug: null, children: ["suwon", "seongnam", "yongin", "goyang", "anyang", "bucheon"] },
  { slug: "incheon", name: "인천", fullName: "인천광역시", level: "province", parentSlug: null, children: [] },
  { slug: "busan", name: "부산", fullName: "부산광역시", level: "province", parentSlug: null, children: [] },
  { slug: "daegu", name: "대구", fullName: "대구광역시", level: "province", parentSlug: null, children: [] },
  { slug: "daejeon", name: "대전", fullName: "대전광역시", level: "province", parentSlug: null, children: [] },
  { slug: "gwangju", name: "광주", fullName: "광주광역시", level: "province", parentSlug: null, children: [] },
  { slug: "ulsan", name: "울산", fullName: "울산광역시", level: "province", parentSlug: null, children: [] },
  { slug: "sejong", name: "세종", fullName: "세종특별자치시", level: "province", parentSlug: null, children: [] },
  { slug: "gangwon", name: "강원", fullName: "강원특별자치도", level: "province", parentSlug: null, children: [] },
  { slug: "chungbuk", name: "충북", fullName: "충청북도", level: "province", parentSlug: null, children: [] },
  { slug: "chungnam", name: "충남", fullName: "충청남도", level: "province", parentSlug: null, children: [] },
  { slug: "jeonbuk", name: "전북", fullName: "전북특별자치도", level: "province", parentSlug: null, children: [] },
  { slug: "jeonnam", name: "전남", fullName: "전라남도", level: "province", parentSlug: null, children: [] },
  { slug: "gyeongbuk", name: "경북", fullName: "경상북도", level: "province", parentSlug: null, children: [] },
  { slug: "gyeongnam", name: "경남", fullName: "경상남도", level: "province", parentSlug: null, children: [] },
  { slug: "jeju", name: "제주", fullName: "제주특별자치도", level: "province", parentSlug: null, children: [] },

  { slug: "gangnam", name: "강남구", fullName: "서울 강남구", level: "city", parentSlug: "seoul", children: [] },
  { slug: "seocho", name: "서초구", fullName: "서울 서초구", level: "city", parentSlug: "seoul", children: [] },
  { slug: "songpa", name: "송파구", fullName: "서울 송파구", level: "city", parentSlug: "seoul", children: [] },
  { slug: "yangcheon", name: "양천구", fullName: "서울 양천구", level: "city", parentSlug: "seoul", children: [] },
  { slug: "mapo", name: "마포구", fullName: "서울 마포구", level: "city", parentSlug: "seoul", children: [] },

  { slug: "suwon", name: "수원", fullName: "수원시", level: "city", parentSlug: "gyeonggi", children: ["yeongtong", "paldal", "jangan", "gwonseon"] },
  { slug: "seongnam", name: "성남", fullName: "성남시", level: "city", parentSlug: "gyeonggi", children: [] },
  { slug: "yongin", name: "용인", fullName: "용인시", level: "city", parentSlug: "gyeonggi", children: [] },
  { slug: "goyang", name: "고양", fullName: "고양시", level: "city", parentSlug: "gyeonggi", children: [] },
  { slug: "anyang", name: "안양", fullName: "안양시", level: "city", parentSlug: "gyeonggi", children: [] },
  { slug: "bucheon", name: "부천", fullName: "부천시", level: "city", parentSlug: "gyeonggi", children: [] },

  { slug: "yeongtong", name: "영통구", fullName: "수원 영통구", level: "district", parentSlug: "suwon", children: [] },
  { slug: "paldal", name: "팔달구", fullName: "수원 팔달구", level: "district", parentSlug: "suwon", children: [] },
  { slug: "jangan", name: "장안구", fullName: "수원 장안구", level: "district", parentSlug: "suwon", children: [] },
  { slug: "gwonseon", name: "권선구", fullName: "수원 권선구", level: "district", parentSlug: "suwon", children: [] },
];

export function getRegionBySlug(slug: string): RegionNode | undefined {
  return regions.find((r) => r.slug === slug);
}

export function getProvinces(): RegionNode[] {
  return regions.filter((r) => r.level === "province");
}

export function getChildren(slug: string): RegionNode[] {
  const node = getRegionBySlug(slug);
  if (!node) return [];
  return node.children
    .map((childSlug) => getRegionBySlug(childSlug))
    .filter((r): r is RegionNode => Boolean(r));
}

export function getRegionPath(slug: string): RegionNode[] {
  const path: RegionNode[] = [];
  let current = getRegionBySlug(slug);
  while (current) {
    path.unshift(current);
    current = current.parentSlug ? getRegionBySlug(current.parentSlug) : undefined;
  }
  return path;
}

export function getRegionUrl(slug: string): string {
  const path = getRegionPath(slug);
  return "/region/" + path.map((r) => r.slug).join("/");
}
