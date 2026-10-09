# 빈 지역 조합 route 정리 + SEO 전수 재계산 (2026-10-09)

기준: HEAD `38cc67a` + 사수 오더 1~6 미커밋 변경. 커밋·push·배포 없음.

## 1. 무엇을 바꿨나

- `src/lib/regionRoutes.ts` `hasRegionComboRoutes(city)` 추가 — 조합 route(지역×과목·학년·학년×과목·구×과목·프로그램)는
  **확장 이전부터 있던 지역**(`preExpansionRegionSlugs`, `src/data/regions.ts`)이거나 **학교가 1곳 이상 등록된 지역**일 때만 생성.
  - 페이지 resolver(`[slug]`, `[slug]/[subject]`, `program/[programSlug]`) → 조건 불충족 시 `notFound()`
  - `program/[programSlug]` `generateStaticParams`, `src/app/sitemap.ts`, `scripts/lib/route-inventory.ts` 동일 조건 사용
  - 학교가 등록되면 조합 route는 자동 생성(색인 여부는 기존 `src/lib/indexability.ts`가 그대로 판단)
- 신규 검증 `checkRegionComboRoutes()` (`scripts/lib/route-inventory.ts`, validate:quick Config에 포함):
  기존 지역 조합 route 누락·신규 빈 지역 조합 route 재생성을 모두 FAIL로 잡는다.
- 시·군·구 허브: 조합 route가 없는 지역은 과목·학년 링크를 전국 공통 페이지(`/subject/*`, `/grade/*`)로 연결하고 라벨을 "○○과외 안내"로 표시.
- 신규 지역 중 이름이 겹치는 곳(중구·동구·서구·남구·북구·강서구·고성군)은 허브 title/H1에 fullName 사용(예: "부산 중구 과외").
  기존(색인 중) 지역 title은 변경하지 않음.
- 학교급 링크: 지역×과목 페이지의 "관련 학년"은 그 학교급 학교가 실제로 있을 때만 지역 학교급 허브로, 없으면 전국 학년 페이지로 연결.
  /schools·시군구 허브의 학교급 링크는 학교가 있는 학교급에만 렌더링되므로 유지(빈 학교급 허브로 가는 링크 0건).
- 터치 영역: /schools·시군구 허브의 학교급/시군구 링크에 `inline-block py-1`.

기존 Production route(인천 제물포·영종·검단·서해구, 옹진군 등 학교 없는 기존 지역 포함)는 삭제하지 않았다.

## 2. BEFORE / AFTER

| 항목 | HEAD 38cc67a | BEFORE(정리 전 미커밋) | AFTER |
|---|---|---|---|
| Routes (content + robots + sitemap) | 1,482 | 7,259 | **1,697** |
| Index | 202 | 211 | **211** |
| Noindex | 1,278 | 7,046 | **1,484** |
| Sitemap | 202 | 211 | **211** |
| 신규 지역 route | – | 5,768 | **206** (허브만) |
| 학교 없는 지역 route (전체) | – | 5,908 | **346** (신규 허브 206 + 기존 5곳×28) |
| 지역×프로그램 정적 생성 | 92 | 917 | **92** |
| 빌드 정적 페이지 | – | – | 1,187 |

- 미생성 route 5,562개 = 지역×과목 1,030 / 지역×학년 618 / 지역×학년×과목 3,090 / 지역×프로그램 824.
  전부 noindex·sitemap 제외였고 HEAD에 없던 미커밋 route. 전체 목록(211KB)은 저장소에 포함하지 않음 — 신규 지역 206곳 × 조합 27종(과목 5·학년 3·학년×과목 15·프로그램 4)으로 재생성 가능.
- 정리 전후 비교: 기존 route 추가 0, 색인/sitemap 플래그 변경 0, 제거 route 중 색인·sitemap 대상 0.
- 시·도별 route: 서울 188 / 경기 218 / 인천 309 / 부산 17 / 대구 10 / 대전 6 / 광주 6 / 울산 6 / 세종 1 / 강원 19 / 충북 12 / 충남 16 / 전북 15 / 전남 23 / 경북 23 / 경남 19 / 제주 3.

## 3. SEO 전수 결과 (AFTER)

- Quality Gate: GREEN 65 / AMBER 2 / RED 34, **indexed RED 0**, RED sync PASS, 학교×과목 noindex hold PASS
- Broken links 0 · Orphans 0 · Metadata duplicates 0 (validate:full)
- canonical: 색인 페이지 211 + 지역 허브 250 모두 자기 자신, robots 불일치 0
- 지역 허브 title 중복 0 (정리 전 신규 동명 자치구 title 중복 존재 → 해소)
- 제거된 조합 URL 샘플 23개 → 404, 인천 기존 조합 URL → 200
- sitemap 211 (신규 지역 0), RSS item 47, robots.txt 변경 없음
- Index→noindex 링크 20.6% (validate:full 기준, 정보 지표). 남은 증가분: 서울·경기 시·도 허브 → 신규 구·시 허브 44개,
  /schools·시군구 허브 → 학교가 있는 학교급 허브 링크. 빈 학교급 허브로 가는 링크 0.

## 4. 렌더링 (headless Chrome, 19페이지 × 390/768/1024/1440)

가로 넘침 0, 잘린 요소 0, h1 1개, breadcrumb·header 정상, 썸네일 SVG 정상, 내부 링크 309개 오류 0, OG 이미지 200.
본문(main) 내 24px 미만 터치 영역은 기존 TextLink 2종·개인정보 링크만 남음(헤더·푸터·breadcrumb의 기존 소형 링크는 이번 범위 밖).

## 5. 이번에 하지 않은 것

- 광주·전남 → 전남광주통합특별시 URL migration (설계만, `docs/ai/NEXT_TASK.md`)
- 대구·경북: 공식 시행 미확인 → 변경 없음
- 인천 신설 4개 구·옹진군 등 기존 학교 없는 지역의 조합 route 140개: 기존 공개 URL이라 유지(별도 결정)
- 행안부 원문 PDF와 229개 지역 행 단위 대조(유형별 개수 시 75·군 82·자치구 70 + 제주 행정시 2는 일치)
