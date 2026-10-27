# 광역시 5곳 행정동 확장 — 구조 감사 (READ-ONLY, 2026-10-27)

> 작성 방식: 코드·데이터 읽기 전용 분석(코드 변경 0, 새 route·URL 변경 0). 핵심 근거 3개는 2026-10-27 별도로 재확인했다 —
> `src/lib/regionRoutes.ts` `hasRegionComboRoutes()`(L22: `preExpansionRegionSlugs.has(citySlug) || countSchoolsInRegion(citySlug) > 0`),
> `scripts/official/school-import.ts` promote 게이트(L283 공시 확인, L284 `hasRegionComboRoutes` 거부),
> `scripts/official/lib/admin-dong-table.ts` `officialSigunguNames()`(시·도를 `province.fullName`으로 매칭 → 공식표 `전남광주통합특별시`와 불일치).
> 학교알리미 첨부 형식 sampling(도시당 1~2교)은 이번 제한시간 안에 하지 않았다 → 재개 시 첫 작업.

대상: `C:\Users\qqqqq\tutoring-site`, branch `work/uijeongbu-dong-seo`. 파일 수정·빌드·커밋 없음. 코드·데이터 읽기만으로 판단.

**한 줄 결론:** 부산·대구·대전·울산은 **architecture gap 없음**. 라우트·sitemap·metadata·breadcrumb·indexability·consult 코드는 이미 `/region/busan/busan-yeongdo/<dong>` 형태를 표현할 수 있다. 막힌 것은 (1) 등록 학교 0곳이라 `hasRegionComboRoutes`가 false인 점, (2) import 파이프라인의 두 게이트(학교알리미 공시 확인 0건 + "조합 route 보호")다. 둘 다 데이터·운영 gap이다. 광주는 여기에 **tooling 매핑 gap**(시·도명 불일치)이 하나 더 있고, 아직 결정되지 않은 **URL 구조 결정(전남광주통합특별시)** 에 묶여 있다. "city combo route가 없다"는 이전 메모의 뜻은 "route 형식이 없다"가 아니다. "학교가 없어서 게이트가 꺼져 있다"는 뜻이다.

---

# Current route model

- 라우트 트리: `src/app/region/[province]/page.tsx`, `[province]/[city]/page.tsx`, `[province]/[city]/[slug]/page.tsx`, `[province]/[city]/[slug]/[subject]/page.tsx`, `[province]/[city]/program/[programSlug]/page.tsx`. 경로 깊이는 고정이고, `[city]`는 **level === "city"인 RegionNode slug** 하나다.
- 계층: `src/data/regions.ts` `RegionNode{slug, level, parentSlug, children}` (L1-10). `getRegionUrl()`(L255-258)는 parent 체인을 이어 붙여 URL을 만든다. 따라서 city 노드 `busan-yeongdo`(parent `busan`)의 URL은 자동으로 `/region/busan/busan-yeongdo`가 된다.
- 광역시 5곳의 자치구는 `addedCities`(regions.ts L131-144)에서 `rows("부산", …)` 형식으로 정의된다. `withAddedCities()`(L189-204)가 이를 **`level: "city"`, `parentSlug: <province>`** 노드로 만들고 province의 `children`에 push한다. 인천 `michuhol`(L66)과 **완전히 같은 모델**이다. slug에 접두어(`busan-`, `daegu-` …)가 붙은 것은 slug 전역 유일성 때문이다(주석 L86-88, `getRegionBySlug`가 slug 단일 키, L229-231). 구조 차이는 아니다.
- city 허브: `[city]/page.tsx` `generateStaticParams()`(L27-31)가 모든 city 노드를 생성한다. 따라서 `/region/busan/busan-yeongdo`, `/region/daegu/daegu-seo` 같은 허브 URL은 **지금도 존재한다**(noindex, 아래 참조).
- 조합 route 게이트(단일 진실 공급원): `src/lib/regionRoutes.ts` `hasRegionComboRoutes(citySlug)`(L22-24) = `preExpansionRegionSlugs.has(citySlug) || countSchoolsInRegion(citySlug) > 0`.
  - `preExpansionRegionSlugs`(regions.ts L214)는 `baseRegions`(서울 6구·경기 6시+수원 4구·인천 11구군 + 시·도 노드)뿐이다. 광역시 자치구는 2026-10 확장분이라 여기에 없다.
  - `countSchoolsInRegion`(src/lib/indexability.ts L110-117)은 `schools`의 `cityRegionSlug`/`districtRegionSlug`/parent로 센다.
- `[slug]` 분기: `[slug]/page.tsx` `resolveContext()`(L44-65). 순서는 combo 게이트(L49) → subject → grade → district(children) → **dong**(`getDong(region.slug, slug)`, L61-62)이며, 해당 없으면 null → `notFound()`(L110). `generateStaticParams`(L33-42)는 `regionSubjectContents`만 생성하고 dong은 on-demand로 렌더링한다(`dynamicParams` 설정 없음, `grep dynamicParams src/app` 결과 0 → 기본값 true. 인천·서울 동 페이지도 같은 방식).
- `[slug]/[subject]`: `resolveContext()`(L36-56). combo 게이트(L42) → grade → district → dong(`hasDongSubjectRoute` 있을 때만, L52-53).
- 행정동 데이터: `src/data/dongs.ts` `AdminDong.citySlug`는 "City-level RegionNode slug"(L27-28)다. `getDong(citySlug, dongSlug)`(L~152)는 city slug 형태에 제약이 없다.
- 색인: `getIndexability()` (indexability.ts L122~)
  - `"region"`: 학교 수가 1 이상일 때만 INDEXED (L130)
  - `"region-dong"`: dong 존재 + 그 동에 등록 학교 있음 + qualityNoindex 아님
  - `"region-grade"`·`"region-district-subject"`: 항상 NOT_INDEXED
  - `"region-subject"`: `regionSubjectContent` 있을 때만
- sitemap: `src/app/sitemap.ts` L31(region 허브, indexability 게이트), L74/L124/L136(combo·program·dong — 모두 `hasRegionComboRoutes`로 필터). route inventory: `scripts/lib/route-inventory.ts` L85/L126/L135(같은 게이트), dong 무결성 검사 L495-565.
- consult prefill: `src/lib/consultContext.ts` `provinceOf()`(L35-39)가 parent 체인을 따라 올라가고, `areaLabel()`(L42-45)이 `/[시군구]$/`로 표시명을 고른다. 노드 종류와 무관하게 동작하고 province 이름은 따로 채운다.

# Seoul / Incheon working pattern

| 항목 | 서울 `gangnam` / 인천 `michuhol` | 경기 `uijeongbu`(확장분 성공 사례) | 광역시 5곳 (`busan-yeongdo` 등) |
|---|---|---|---|
| RegionNode | `baseRegions` city, parent `seoul`/`incheon` (regions.ts L50, L66) | `addedCities.gyeonggi` city (L125) | `addedCities.<metro>` city (L131-144) — **동일 형식** |
| preExpansion | 예 → combo 무조건 ON | 아니오 | 아니오 |
| 등록 학교 | 있음 | 있음 (schools.ts L1145~, 수기 helper `uijeongbu()` L1737) | **0** (`grep 'cityRegionSlug: "busan-'` 등 schools.ts·schools.imported.ts 모두 0) |
| `hasRegionComboRoutes` | true | true(학교 덕분) | **false** |
| dongs.ts | 있음 (예: `gwangyo-dong` michuhol L172, `songdo1-dong` yeonsu L175) | 15개 (L53-67) | 없음 |
| URL 예 | `/region/incheon/michuhol/gwangyo-dong` | `/region/gyeonggi/uijeongbu/howon1-dong` | (가능) `/region/busan/busan-yeongdo/dongsam1-dong` |

핵심은 `uijeongbu`다. 확장분(preExpansion 아님) city도 **학교가 등록되기만 하면** combo route·dong route·sitemap이 모두 켜진다는 것이 이미 운영에서 입증되었다. 광역시 자치구가 다른 점은 slug 접두어와 학교 0곳, 두 가지뿐이다.

# Busan

- 노드: `busan` province(regions.ts L35, `children: []`) + `addedCities.busan` 16개 city(L131-136: `busan-jung`…`busan-gijang`)가 `withAddedCities`로 children에 들어간다.
- 공식표 매핑: `scripts/official/lib/admin-dong-table.ts` `officialSigunguNames()`(L32-52)가 province fullName `부산광역시`로 `inSido`를 필터(L36)하고 bare 이름("영도구")으로 일치시킨다. 실제로 `data/official/admin-dongs.json`의 sido 목록에 `부산광역시`(행정동 206개)가 있다. 그 결과 `school-candidates.json`에 `citySlug: "busan-*"` 586개교, 16개 구·군 전부가 매핑되어 있다(예: 첫 레코드 부산해사고 → `busan-yeongdo`, 동삼제2동).
- 현재 live URL(코드 기준): `/region/busan`과 16개 허브 `/region/busan/busan-*`는 존재한다. 모두 `"region"` 게이트(indexability.ts L130)에 걸려 noindex이고 sitemap에서 빠진다. 조합·dong URL은 `resolveContext` L49에서 null → 404.
- dong을 `dongs.ts`에 `citySlug: "busan-yeongdo"`로 넣기만 하면: `getDong`은 매칭되지만 `hasRegionComboRoutes("busan-yeongdo")`가 false라 **여전히 404**다([slug]/page.tsx L49). route-inventory 공식표 검사(L551-563)는 통과할 것이다(부산광역시 sigungu 일치, UNVERIFIED — 실행하지 않음). 학교를 1곳 이상 `cityRegionSlug: "busan-yeongdo", dongSlug: …`로 등록하면 combo + dong 허브 + sitemap이 **자동으로** 켜진다(sitemap.ts L136-147).
- 막힌 지점:
  1. `school-import.ts` `promote()` L283: `operating !== "disclosed-2026-3"`이면 skip한다. 부산 후보 586개 중 **disclosed 0**(전국 disclosed는 303건뿐).
  2. L284: `!hasRegionComboRoutes(citySlug)`이면 skip한다("조합 route 보호"). 첫 학교는 promote로 **원리상 등록할 수 없다**(닭과 달걀). 의정부처럼 `schools.ts`에 수기로 넣거나, 명시적 opt-in 플래그 같은 tooling 변경이 필요하다.
- 판정: **DATA gap(+ import 게이트 운영 결정)**. architecture 변경은 필요 없다.

# Daegu

- 노드: `daegu`(L36) + 9개 city(L137-141: `daegu-jung`…`daegu-dalseong`, `daegu-gunwi` 포함). `대구광역시` 행정동 152개가 공식표에 있다.
- 후보 455개교, 9개 구·군 모두 매핑되었다(`daegu-gunwi` 15개 포함, 2023 편입 반영). disclosed 0.
- `/region/daegu/daegu-seo` 허브는 존재한다(noindex). 조합·dong은 404(같은 게이트).
- 판정: **DATA gap**. 부산과 똑같다.

# Daejeon

- 노드: `daejeon`(L37) + 5개 city(L142). `대전광역시` 행정동 82개.
- 후보 305개교, 5개 구 매핑. disclosed 0. 학교 2곳 이상인 동 66개(관저2동 11, 신성동 10 …).
- 판정: **DATA gap**.

# Ulsan

- 노드: `ulsan`(L39) + 5개 city(L144: `ulsan-jung`·`ulsan-nam`·`ulsan-dong`·`ulsan-buk`·`ulsan-ulju`). `울산광역시` 행정동 55개.
- 후보 244개교. disclosed 0. 학교 2곳 이상인 동 45개(범서읍 16, 옥동 9 …). 읍(`-eup`) slug는 `dongSlugFor()`(school-import.ts L95-100)와 validator(route-inventory.ts L516)가 이미 지원한다(인천 `ganghwa-eup` 선례, dongs.ts).
- 판정: **DATA gap**.

# Gwangju

- 노드: `gwangju` province fullName **`광주광역시`**(regions.ts L38) + 5개 city(L143 `gwangju-dong`…`gwangju-gwangsan`). 주석 L92-93: 2026-07-01 전남광주통합특별시 통합. 시·도 slug/URL 변경은 별도 결정 사항이다.
- 공식표(`admin-dongs.json`, asOf 2026-10-12)의 sido는 **`전남광주통합특별시`** 하나(코드 12xxxxxxxx, 행정동 420개, 시군구 27개: 동구·서구·남구·북구·광산구 + 전남 22개)다. `광주광역시` sido는 표에 없다.
- 결과:
  - `officialSigunguNames()` L36 `table.sigungu.filter(s => s.sido === province.fullName)` → `광주광역시`라서 0행이 나오고 매핑에 실패한다.
  - `school-import.ts` `buildCandidates()` L173-175(주석이 이 문제를 직접 언급)에서 `idx.get("전남광주통합특별시|북구")`가 miss → `status: "unmapped-region"`, reason "사이트 지역 노드 없음: 전남광주통합특별시 북구"가 된다. F10(광주교육청) 321개교 중 313개가 unmapped이고 citySlug가 붙은 광주 후보는 **0**이다.
  - 동을 `dongs.ts`에 수기로 넣으면 route-inventory L551-556 `officialDongsForRegion()`이 0건을 돌려주므로 **validate:quick이 실패**한다("공식 행정동 표에 없음").
- 라우트 자체(`/region/gwangju/gwangju-buk/<dong>`)는 다른 광역시와 똑같이 표현할 수 있다. route 코드 gap은 없다.
- 남은 미결 결정은 `docs/ai/NEXT_TASK.md` L23·L27(결정 2: 전남광주통합특별시 URL migration 여부)과 `docs/qa/gwangju-jeonnam-sejong-structure-2026-10-20.md`다. 이 문서의 A안(URL 유지, `officialSigunguNames`가 통합 시·도에서 같은 시군구명을 찾도록 매핑만 보완)이 권장안이다. B/C안은 시·도 slug를 바꾸고 301 redirect를 거는 **architecture/migration** 작업이다.
- 판정: **TOOLING/DATA gap(시·도명 매핑 1곳) + 선행 결정 의존**. A안으로 가면 architecture 변경이 없다. B/C안을 고르면 URL migration이다. 결정 전에 동 페이지를 열면, 나중에 B/C안을 택할 때 redirect 대상이 늘어난다.

# Data vs architecture gap

| 지역 | 현재 모델 호환 | 필요한 URL 형태 | 구조 변경 | migration | 난이도 | 추천 |
|---|---|---|---|---|---|---|
| 부산 | 예 (city 노드·공식표·후보 매핑 완료) | `/region/busan/busan-<gu>/<dong>(/<subject>)` | 없음 | 없음 (기존 허브 URL 유지, 새 URL만 추가) | 중 (첫 학교 등록 게이트 + 학교알리미 공시 fetch) | 2순위 |
| 대구 | 예 | `/region/daegu/daegu-<gu>/<dong>` | 없음 | 없음 | 중 | 3순위 |
| 대전 | 예 | `/region/daejeon/daejeon-<gu>/<dong>` | 없음 | 없음 | 중-하 (5개 구, 후보 305) | 1순위 후보 |
| 울산 | 예 | `/region/ulsan/ulsan-<gu>/<dong>` | 없음 | 없음 | 하 (5개 구군, 후보 244, 가장 작음) | **1순위(테스트)** |
| 광주 | 라우트는 예, tooling 매핑은 아니오 | (A안) `/region/gwangju/gwangju-<gu>/<dong>` | A안: `officialSigunguNames` 매핑 보완(script, route 아님). B/C안: 시·도 slug 변경 | A안: 없음 / B·C안: 29개 허브 301 | A안 중, B/C안 상 | 결정 2 확정 후 마지막 |

공통 판정 근거: route·sitemap·metadata·breadcrumb·indexability·consult 코드 중 어느 것도 province/city slug 이름이나 시·도를 하드코딩하지 않는다.
- `getRegionUrl`(regions.ts L255), `resolveContext`([slug]/page.tsx L44), `sitemap.ts` L136, `consultContext.ts` L35, `DongPages.tsx` breadcrumbBase(L50-52)는 모두 parent 체인과 노드 데이터를 일반적으로 사용한다.
- 시·도 하드코딩은 import 우선순위 `SIDO_PRIORITY`(school-import.ts, rankDongs)와 `dongContent.ts` L74의 office 기본값 `"J10"` 정도다. 둘 다 데이터에 office 코드가 있으면 영향이 없다(`OfficialSchoolRecord.office`는 promote가 채운다).

부차 품질 이슈(구조 gap 아님, 코드 소규모):
- `DongPages.tsx` L66/L83 title, `[slug]/page.tsx` L80/L90 title은 `region.name`(예: "중구", "강서구", "동구")을 쓴다. 광역시마다 중구·동구·서구·남구·북구가 겹치므로 "중구 ○○동 과외" 같은 제목이 모호해진다.
- 허브 title은 이미 `getRegionTitleName()`(regions.ts L221-227)으로 "부산 중구" 형태를 쓴다. 동·조합 페이지도 같은 helper를 쓰도록 바꾸는 편이 바람직하다. `busan-gangseo`의 "강서구"는 서울 `gangseo`(인덱스된 동 9개)와도 이름이 겹친다.
- region-subject·region-grade 조합 페이지는 noindex라 SEO 영향은 작지만, dong 허브 title은 index 대상이다.

# Migration risk

- 부산·대구·대전·울산: 기존 URL을 바꾸지 않는다. 위험은 **route·색인 대량 증가**다.
  - 첫 학교를 등록하는 순간 그 city에 조합 route 약 27종이 생성된다(`regionRoutes.ts` 주석 L11-12, `docs/ai/NEXT_TASK.md` L18 "신규 지역 206곳 × 조합 27종").
  - 대부분은 noindex다(region-grade·region-district-subject는 항상 NOT_INDEXED, region-subject는 content가 있어야 index).
  - 동시에 `"region"` 게이트(indexability.ts L130)로 **city 허브와 province 허브(`/region/busan`)가 index·sitemap 대상으로 바뀐다**. `countSchoolsInRegion`은 parentSlug로도 세기 때문이다(L115). province 페이지 본문은 템플릿 문구뿐이다(`[province]/page.tsx` L46-50). 품질 게이트(qualityNoindex)를 검토해야 한다.
- 조합 route 증가분은 `npx tsx scripts/official/school-import.ts --summary`(L349-352, `computeSummary`)로 before/after를 미리 계산할 수 있다(실행하지 않음, UNVERIFIED 수치).
- `[slug]` 충돌: dong slug는 `-dong/-eup/-myeon`으로 끝나야 하고, subject/grade/district/program과의 충돌은 validator(route-inventory.ts L516-517)가 막는다. 광역시 city는 district children이 없으므로 충돌 여지가 더 적다.
- 광주: A안이면 URL 위험이 0이다. 다만 표시명 "광주광역시"와 공식 시·도명이 맞지 않는 콘텐츠 정합성 문제가 남는다(gwangju-jeonnam 문서 A안 위험란). B/C안이면 기존 허브 29개(광주 5 + 전남 22 + province 2)를 301로 옮겨야 한다. 해당 문서 기준으로 현재 색인된 URL은 없다(sitemap 0).
- 롤백: 학교·dong 데이터 행을 제거하면 게이트가 다시 꺼지고 404로 돌아간다. 다만 한 번 index된 URL이 404가 되므로 정책 결정이 필요하다(NEXT_TASK L24의 인천 신설구 선례와 같은 문제).

# Recommended rollout order

1. **울산**(테스트): 5개 구군, 후보 244개교, 가장 작은 단위로 파이프라인 전 구간을 검증한다.
2. **대전**: 5개 구, 후보 305개교, 학교 2곳 이상인 동 66개.
3. **부산**: 16개 구군, 586개교. 이름이 겹치는 구(중·서·동·남·북·강서)가 많아 title 모호성 수정을 먼저 넣는다.
4. **대구**: 9개 구군, 455개교. 부산과 같은 이유.
5. **광주**: 결정 2(NEXT_TASK L23)를 확정하고 A안 매핑을 보완한 뒤에 진행한다.

도시마다 선행 작업은 같다.
- (a) 해당 교육청 학교알리미 2026년 3차 공시 fetch(울산 H10, 대전 G10, 부산 C10, 대구 D10, 광주 F10 — office 코드는 SIDO_PRIORITY 키 기준이며 정확한 매핑은 UNVERIFIED). 현재 disclosed 0건이다.
- (b) 첫 학교 등록 방식 결정(수기 `schools.ts` vs promote opt-in 플래그).
- (c) `--summary`로 route delta를 확인한다.

# Candidate test city

**울산 남구 `ulsan-nam` — 옥동**(후보 9개교, 초·중·고 3개 급). 대안은 울주군 범서읍(16개교, `-eup` slug 검증 겸용)이다.
- 이유: 울산 남구는 이름이 겹치는 자치구("남구"는 부산·대구·광주에도 있음)다. 그래서 title 모호성 수정의 효과도 함께 검증할 수 있다.
- 단독 이름 구로 시작하려면 대전 유성구 `daejeon-yuseong`(신성동 10개교)가 이름 충돌이 없는 가장 깨끗한 후보다.
- 예상 URL: `/region/ulsan/ulsan-nam/ok-dong`. slug는 `dongSlugFor("옥동")` → romanize 결과에 따라 달라진다(UNVERIFIED).

# Implementation scope estimate

부산·대구·대전·울산(도시별, architecture 변경 0):

| 작업 | 파일 | 규모 |
|---|---|---|
| 학교알리미 공시 fetch(해당 교육청) | scripts/official/* + manifest (Python 없는 노트북 제약 — 메모리 참고, UNVERIFIED) | 운영 작업 |
| 첫 학교 등록 경로 | `scripts/official/school-import.ts` L284 게이트에 명시적 opt-in(예: `--allow-new-city <slug>`) 추가, 또는 `src/data/schools.ts` 수기 helper(의정부 L1737 방식) | 코드 ~10줄 또는 데이터 |
| 학교 등록 | `src/data/schools.imported.ts`(promote 생성) | 데이터 |
| 행정동 행 | `src/data/dongs.ts` (`citySlug: "ulsan-nam"`, code·legalDongs는 admin-dongs.json 그대로) | 데이터 |
| (선택) title 모호성 | `src/components/region/DongPages.tsx` L66/L83, `[slug]/page.tsx` L80/L90 → `getRegionTitleName` | 코드 ~4줄, 기존 index URL title이 바뀌므로 확장분 slug에만 적용 |
| 검증 | `validate:quick`(combo 게이트 L448-456, dong 무결성 L495-565), `--summary` | 기존 스크립트 |
| 동×과목 페이지 | `src/data/dongSubjectContent.ts` — 학교 2곳 이상의 2학기 평가계획 텍스트 필요(배치 기준) | 콘텐츠 |

route 파일(`src/app/region/**`), `sitemap.ts`, `indexability.ts`, `regionRoutes.ts`, `consultContext.ts`, `Breadcrumb`는 **변경할 필요가 없다**.

광주 추가분(A안): `scripts/official/lib/admin-dong-table.ts` `officialSigunguNames` L36에 통합 시·도 fallback을 넣는다(~5-10줄 + 테스트). 그 뒤 `school-import.ts --write`로 후보를 재생성한다(route 변화 0). B/C안은 별도 프로젝트 규모다: regions.ts 시·도 노드, redirect 설정, 내부 링크, validator 전부.

UNVERIFIED 목록: 실제 route/sitemap 증가 수치(스크립트 미실행), 각 광역시 교육청 office 코드와 학교알리미 fetch 가능 여부, `dongSlugFor` romanize 결과, 부산 등의 동을 추가했을 때 validate:quick이 실제로 통과하는지(코드 경로상 통과 예상).
