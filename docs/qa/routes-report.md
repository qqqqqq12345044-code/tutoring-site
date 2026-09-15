# 라우트 크롤링 리포트

생성일: 자동 검수 세션 (프로덕션 빌드 기준, `next build` + `next start` 후 로컬 크롤)
원본 데이터: [`crawl-results.json`](./crawl-results.json) (각 URL별 status/title/description/canonical/OG/JSON-LD 상세)

## 요약

| 항목 | 값 |
|---|---|
| 검사한 URL 총 개수 | 334 (실제 페이지 333 + 의도적으로 존재하지 않는 경로 1개 검증용) |
| HTTP 200 | 333 |
| HTTP 404 | 1 (`/this-route-should-not-exist-qa-check` — 존재하지 않아야 할 경로가 실제로 404를 반환하는지 확인하기 위한 대조군) |
| HTTP 500 / redirect loop | 0 |
| 예상과 다른 결과 (unexpected) | **0건** |
| 중복 `<title>` | 0건 |
| 중복 `<meta description>` | 0건 |
| canonical 누락 (HTML 페이지 기준) | 0건 |
| `<h1>` 0개 또는 2개 이상인 페이지 | 0건 (robots.txt/sitemap.xml은 HTML이 아니므로 제외) |
| noindex 오삽입 | 0건 |

## 크롤 대상 범위

데이터 모델(`src/data/*.ts`)을 기준으로 다음 조합을 전수 생성해 검사했습니다.

- 정적 페이지: `/`, `/subjects`, `/grades`, `/regions`, `/schools`, `/guide`, `/lesson/visit`, `/lesson/online`, `/consult`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`
- `/subject/[slug]` — 5개 과목 전체
- `/grade/[slug]` — 3개 학년 전체
- `/school/[schoolSlug]` — 등록된 학교 2곳 전체
- `/guide/[slug]` — 등록된 가이드 아티클 5개 전체
- `/region/[province]` — 17개 시/도 전체
- `/region/[province]/[city]` — 11개 시/군/구 전체 (서울 5, 경기 6)
- `/region/[province]/[city]/[subject]` — 도시 11개 × 과목 5개 = 55
- `/region/[province]/[city]/[grade]` — 도시 11개 × 학년 3개 = 33
- `/region/[province]/[city]/[district]` — 수원 하위 4개 구
- `/region/[province]/[city]/[grade]/[subject]` — 도시 11개 × 학년 3개 × 과목 5개 = 165
- `/region/[province]/[city]/[district]/[subject]` — 수원 4개 구 × 과목 5개 = 20

## 발견한 문제와 조치

### 🔴 sitemap.xml 커버리지 누락 (수정 완료)

기존 `sitemap.ts`는 `regionSubjectContents`(수원-수학, 수원-영어 단 2건)만 지역+과목 조합으로 등록하고 있어, 실제로는 정상 동작하는 나머지 **약 271개의 지역 조합 페이지**(도시별 과목, 도시별 학년, 도시×학년×과목, 구×과목 등 프로그래매틱 SEO 페이지)가 sitemap에서 빠져 있었습니다. 검색엔진이 이 페이지들을 내부 링크로만 발견해야 하는 상태였습니다.

- 수정 전 sitemap URL 수: 60
- 수정 후 sitemap URL 수: **331** (크롤로 확인된 실제 200 페이지 수와 정확히 일치)
- 변경 파일: `src/app/sitemap.ts` (데이터 기반으로 도시×과목/학년/학년×과목/구×과목 조합을 모두 생성하도록 로직 추가, 실제 라우팅 구조·콘텐츠는 변경 없음)

이 외에는 라우팅/404/리다이렉트 관련 문제가 발견되지 않았습니다.
