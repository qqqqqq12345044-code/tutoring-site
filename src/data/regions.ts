export type RegionLevel = "province" | "city" | "district";

export interface RegionNode {
  slug: string;
  name: string;
  fullName: string;
  level: RegionLevel;
  parentSlug: string | null;
  children: string[];
}

const baseRegions: RegionNode[] = [
  { slug: "seoul", name: "서울", fullName: "서울특별시", level: "province", parentSlug: null, children: ["gangnam", "seocho", "songpa", "yangcheon", "mapo", "gangseo"] },
  { slug: "gyeonggi", name: "경기", fullName: "경기도", level: "province", parentSlug: null, children: ["suwon", "seongnam", "yongin", "goyang", "anyang", "bucheon"] },
  {
    slug: "incheon",
    name: "인천",
    fullName: "인천광역시",
    level: "province",
    parentSlug: null,
    children: [
      "michuhol",
      "yeonsu",
      "namdong",
      "bupyeong",
      "gyeyang",
      "ganghwa",
      "ongjin",
      "jemulpo",
      "yeongjong",
      "geomdan",
      "seohae",
    ],
  },
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
  { slug: "gangseo", name: "강서구", fullName: "서울 강서구", level: "city", parentSlug: "seoul", children: [] },

  { slug: "suwon", name: "수원", fullName: "수원시", level: "city", parentSlug: "gyeonggi", children: ["yeongtong", "paldal", "jangan", "gwonseon"] },
  { slug: "seongnam", name: "성남", fullName: "성남시", level: "city", parentSlug: "gyeonggi", children: [] },
  { slug: "yongin", name: "용인", fullName: "용인시", level: "city", parentSlug: "gyeonggi", children: [] },
  { slug: "goyang", name: "고양", fullName: "고양시", level: "city", parentSlug: "gyeonggi", children: [] },
  { slug: "anyang", name: "안양", fullName: "안양시", level: "city", parentSlug: "gyeonggi", children: [] },
  { slug: "bucheon", name: "부천", fullName: "부천시", level: "city", parentSlug: "gyeonggi", children: [] },

  // 인천 — 2026-07-01 행정체제 개편 반영 (2군 8구 → 2군 9구): 중구·동구는 제물포구·영종구로,
  // 서구는 검단구·서해구로 재편. 미추홀구·연수구·남동구·부평구·계양구·강화군·옹진군은 기존 그대로 유지.
  { slug: "michuhol", name: "미추홀구", fullName: "인천 미추홀구", level: "city", parentSlug: "incheon", children: [] },
  { slug: "yeonsu", name: "연수구", fullName: "인천 연수구", level: "city", parentSlug: "incheon", children: [] },
  { slug: "namdong", name: "남동구", fullName: "인천 남동구", level: "city", parentSlug: "incheon", children: [] },
  { slug: "bupyeong", name: "부평구", fullName: "인천 부평구", level: "city", parentSlug: "incheon", children: [] },
  { slug: "gyeyang", name: "계양구", fullName: "인천 계양구", level: "city", parentSlug: "incheon", children: [] },
  { slug: "ganghwa", name: "강화군", fullName: "인천 강화군", level: "city", parentSlug: "incheon", children: [] },
  { slug: "ongjin", name: "옹진군", fullName: "인천 옹진군", level: "city", parentSlug: "incheon", children: [] },
  // 2026-07-01 신설 4개 구 — 아직 학교 데이터는 미배정(구 경계 기준 학교별 소재 재확인 필요, 후속 작업)
  { slug: "jemulpo", name: "제물포구", fullName: "인천 제물포구", level: "city", parentSlug: "incheon", children: [] },
  { slug: "yeongjong", name: "영종구", fullName: "인천 영종구", level: "city", parentSlug: "incheon", children: [] },
  { slug: "geomdan", name: "검단구", fullName: "인천 검단구", level: "city", parentSlug: "incheon", children: [] },
  { slug: "seohae", name: "서해구", fullName: "인천 서해구", level: "city", parentSlug: "incheon", children: [] },

  { slug: "yeongtong", name: "영통구", fullName: "수원 영통구", level: "district", parentSlug: "suwon", children: [] },
  { slug: "paldal", name: "팔달구", fullName: "수원 팔달구", level: "district", parentSlug: "suwon", children: [] },
  { slug: "jangan", name: "장안구", fullName: "수원 장안구", level: "district", parentSlug: "suwon", children: [] },
  { slug: "gwonseon", name: "권선구", fullName: "수원 권선구", level: "district", parentSlug: "suwon", children: [] },
];

/**
 * 2026-10 지역 누락 보완 — 시·도 아래 빠져 있던 기초자치단체(시·군·구)를 행정구역 기준으로 추가.
 * [slug, 표시명, fullName] 형식. 자치구 이름이 겹치는 광역시(중구·동구·서구·남구·북구·강서구 등)와
 * 동명 군(고성군)·경기 광주시는 slug에 시·도 접두어를 붙여 전역 유일성을 유지한다(getRegionBySlug가 slug 단일 키).
 * 학교 데이터가 없는 노드는 src/lib/indexability.ts의 "region" 게이트에 따라 자동으로
 * noindex·sitemap 제외된다 — 학교가 등록되기 전까지 색인 대상이 아니다.
 * 일반구(예: 화성시·창원시의 구)는 학교 데이터가 생길 때 district로 추가한다.
 * 참고: 광주광역시·전라남도는 2026-07-01 전남광주통합특별시로 통합되었다(시·군·구 명칭·관할은 유지).
 * 시·도 노드 slug/URL 변경은 라우팅 전체에 영향을 주므로 별도 결정 사항으로 남긴다(docs/ai/NEXT_TASK.md).
 */
type CityRow = [slug: string, name: string, fullName: string];

function rows(prefix: string, list: string): CityRow[] {
  // "slug:이름" 공백 구분 목록 → [slug, 이름, "접두 이름"]
  return list
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [slug, name] = pair.split(":");
      return [slug, name, `${prefix} ${name}`];
    });
}

/** 시 단위: 표시명은 기존 경기 도시와 같이 "시"를 뺀 이름(예: 의정부), fullName은 "경기 의정부시". */
function cityRows(prefix: string, list: string): CityRow[] {
  return rows(prefix, list).map(([slug, name, fullName]) =>
    name.endsWith("군") ? [slug, name, fullName] : [slug, name, `${fullName}시`]
  );
}

const addedCities: Record<string, CityRow[]> = {
  seoul: rows(
    "서울",
    `jongno:종로구 seoul-jung:중구 yongsan:용산구 seongdong:성동구 gwangjin:광진구 dongdaemun:동대문구
     jungnang:중랑구 seongbuk:성북구 gangbuk:강북구 dobong:도봉구 nowon:노원구 eunpyeong:은평구
     seodaemun:서대문구 guro:구로구 geumcheon:금천구 yeongdeungpo:영등포구 dongjak:동작구 gwanak:관악구 gangdong:강동구`
  ),
  gyeonggi: [
    ...cityRows(
      "경기",
      `uijeongbu:의정부 gwangmyeong:광명 pyeongtaek:평택 dongducheon:동두천 ansan:안산 gwacheon:과천 guri:구리
       namyangju:남양주 osan:오산 siheung:시흥 gunpo:군포 uiwang:의왕 hanam:하남 paju:파주 icheon:이천 anseong:안성
       gimpo:김포 hwaseong:화성 yangju:양주 pocheon:포천 yeoju:여주 yeoncheon:연천군 gapyeong:가평군 yangpyeong:양평군`
    ),
    ["gyeonggi-gwangju", "경기 광주", "경기 광주시"],
  ],
  busan: rows(
    "부산",
    `busan-jung:중구 busan-seo:서구 busan-dong:동구 busan-yeongdo:영도구 busan-busanjin:부산진구 busan-dongnae:동래구
     busan-nam:남구 busan-buk:북구 busan-haeundae:해운대구 busan-saha:사하구 busan-geumjeong:금정구 busan-gangseo:강서구
     busan-yeonje:연제구 busan-suyeong:수영구 busan-sasang:사상구 busan-gijang:기장군`
  ),
  daegu: rows(
    "대구",
    `daegu-jung:중구 daegu-dong:동구 daegu-seo:서구 daegu-nam:남구 daegu-buk:북구 daegu-suseong:수성구
     daegu-dalseo:달서구 daegu-dalseong:달성군 daegu-gunwi:군위군`
  ),
  daejeon: rows("대전", `daejeon-dong:동구 daejeon-jung:중구 daejeon-seo:서구 daejeon-yuseong:유성구 daejeon-daedeok:대덕구`),
  gwangju: rows("광주", `gwangju-dong:동구 gwangju-seo:서구 gwangju-nam:남구 gwangju-buk:북구 gwangju-gwangsan:광산구`),
  ulsan: rows("울산", `ulsan-jung:중구 ulsan-nam:남구 ulsan-dong:동구 ulsan-buk:북구 ulsan-ulju:울주군`),
  gangwon: [
    ...cityRows(
      "강원",
      `chuncheon:춘천 wonju:원주 gangneung:강릉 donghae:동해 taebaek:태백 sokcho:속초 samcheok:삼척
       hongcheon:홍천군 hoengseong:횡성군 yeongwol:영월군 pyeongchang:평창군 jeongseon:정선군 cheorwon:철원군
       hwacheon:화천군 yanggu:양구군 inje:인제군 gangwon-goseong:고성군 yangyang:양양군`
    ),
  ],
  chungbuk: cityRows(
    "충북",
    `cheongju:청주 chungju:충주 jecheon:제천 boeun:보은군 okcheon:옥천군 yeongdong:영동군 jeungpyeong:증평군
     jincheon:진천군 goesan:괴산군 eumseong:음성군 danyang:단양군`
  ),
  chungnam: cityRows(
    "충남",
    `cheonan:천안 gongju:공주 boryeong:보령 asan:아산 seosan:서산 nonsan:논산 gyeryong:계룡 dangjin:당진
     geumsan:금산군 buyeo:부여군 seocheon:서천군 cheongyang:청양군 hongseong:홍성군 yesan:예산군 taean:태안군`
  ),
  jeonbuk: cityRows(
    "전북",
    `jeonju:전주 gunsan:군산 iksan:익산 jeongeup:정읍 namwon:남원 gimje:김제 wanju:완주군 jinan:진안군
     muju:무주군 jangsu:장수군 imsil:임실군 sunchang:순창군 gochang:고창군 buan:부안군`
  ),
  jeonnam: cityRows(
    "전남",
    `mokpo:목포 yeosu:여수 suncheon:순천 naju:나주 gwangyang:광양 damyang:담양군 gokseong:곡성군 gurye:구례군
     goheung:고흥군 boseong:보성군 hwasun:화순군 jangheung:장흥군 gangjin:강진군 haenam:해남군 yeongam:영암군
     muan:무안군 hampyeong:함평군 yeonggwang:영광군 jangseong:장성군 wando:완도군 jindo:진도군 sinan:신안군`
  ),
  gyeongbuk: cityRows(
    "경북",
    `pohang:포항 gyeongju:경주 gimcheon:김천 andong:안동 gumi:구미 yeongju:영주 yeongcheon:영천 sangju:상주
     mungyeong:문경 gyeongsan:경산 uiseong:의성군 cheongsong:청송군 yeongyang:영양군 yeongdeok:영덕군
     cheongdo:청도군 goryeong:고령군 seongju:성주군 chilgok:칠곡군 yecheon:예천군 bonghwa:봉화군 uljin:울진군 ulleung:울릉군`
  ),
  gyeongnam: cityRows(
    "경남",
    `changwon:창원 jinju:진주 tongyeong:통영 sacheon:사천 gimhae:김해 miryang:밀양 geoje:거제 yangsan:양산
     uiryeong:의령군 haman:함안군 changnyeong:창녕군 gyeongnam-goseong:고성군 namhae:남해군 hadong:하동군
     sancheong:산청군 hamyang:함양군 geochang:거창군 hapcheon:합천군`
  ),
  jeju: rows("제주", `jeju-si:제주시 seogwipo:서귀포시`),
};

function withAddedCities(base: RegionNode[], added: Record<string, CityRow[]>): RegionNode[] {
  const nodes = base.map((r) => ({ ...r, children: [...r.children] }));
  const bySlug = new Map(nodes.map((r) => [r.slug, r]));
  for (const [provinceSlug, list] of Object.entries(added)) {
    const province = bySlug.get(provinceSlug);
    if (!province || province.level !== "province") throw new Error(`regions: unknown province "${provinceSlug}"`);
    for (const [slug, name, fullName] of list) {
      if (bySlug.has(slug)) throw new Error(`regions: duplicate slug "${slug}"`);
      const node: RegionNode = { slug, name, fullName, level: "city", parentSlug: provinceSlug, children: [] };
      nodes.push(node);
      bySlug.set(slug, node);
      province.children.push(slug);
    }
  }
  return nodes;
}

export const regions: RegionNode[] = withAddedCities(baseRegions, addedCities);

/**
 * Region nodes that existed before the 2026-10-09 expansion. Their combination
 * routes (region × subject / grade / grade × subject / program) are already
 * public URLs, so they are kept even without registered schools (e.g. 인천
 * 제물포·영종·검단·서해구). See src/lib/regionRoutes.ts.
 */
export const preExpansionRegionSlugs: ReadonlySet<string> = new Set(baseRegions.map((r) => r.slug));

/**
 * Page-title name for a region hub. Regions added in the 2026-10 expansion whose short name is shared
 * with another region (중구·동구·강서구·고성군 …) use fullName ("부산 중구") so hub titles stay unique;
 * pre-expansion regions keep their existing (already indexed) titles unchanged.
 */
export function getRegionTitleName(slug: string): string {
  const node = getRegionBySlug(slug);
  if (!node) return "";
  if (preExpansionRegionSlugs.has(slug)) return node.name;
  const shared = regions.some((r) => r.slug !== slug && r.name === node.name);
  return shared ? node.fullName : node.name;
}

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
