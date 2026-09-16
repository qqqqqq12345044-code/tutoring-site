# 라우트 전수 재크롤 + 404/반응형 QA 리포트

개발 서버(`next dev`, `http://localhost:3000`)를 대상으로 (1) 전체 라우트 재크롤, (2) 404/에러/빈 상태, (3) 8개 뷰포트 반응형을 검사했습니다. 오케스트레이터가 병렬로 진행 중이던 콘텐츠/내부링크 수정(지역 허브 3종 템플릿의 FAQ 제거, RelatedLinks 신설, school 페이지 FAQ 추가, `/api/consult` 서버 검증 강화 등)이 반영된 **현재 코드 상태**를 기준으로 재검증했습니다. `src/lib/indexability.ts`와 `src/data/*.ts`를 직접 읽어 라우트/색인 정책을 재도출했으며, `scratch-audit/compute-counts.ts`로 교차 검증했습니다.

## 요약

| 항목 | 결과 | 기준선(baseline) 대비 |
|---|---|---|
| 콘텐츠 라우트 총 개수 | 331 | 일치 |
| index/sitemap 대상 | 60 | 일치 |
| noindex 대상 | 271 | 일치 |
| `sitemap.xml` `<url>` 개수 | 60 | 일치 |
| 전체 라우트 HTTP 200 | 331/331 | 이상 없음 |
| 의도적 잘못된 경로(9개) HTTP 404 | 9/9 | 이상 없음 |
| 500 / 리다이렉트 루프 | 0건 | 이상 없음 |
| 내부링크 크롤(18개 시드 페이지, 링크 78개 고유) 중 깨진 링크 | 0건 | 이상 없음 |
| canonical/robots meta/`<h1>` 샘플(81개 페이지) | 80 OK, 1건은 아래 "판단 불필요" 참고 | — |
| 반응형 overflow(14개 페이지 유형 × 8개 뷰포트 = 112 조합) | 0건 | 이상 없음 |
| 404/에러/빈 상태 | 전부 정상 동작 | — |

**모든 수치가 오케스트레이터가 제시한 기준선(60 index / 271 noindex / 331 total, +robots.txt/sitemap.xml = 333)과 정확히 일치합니다.** 불일치·이상 징후는 발견되지 않았습니다.

이번 세션에서 소스 코드 수정은 하지 않았습니다(발견된 문제가 없어 "사소한 typo 1줄 수정" 예외도 적용할 대상이 없었습니다).

---

## Part 1 — 라우트 전수 재크롤

### 1-1. 라우트 목록 재생성

`scratch-audit/full-route-list.ts`(기존 `compute-counts.ts` 로직을 데이터 기반으로 확장한 스크립트, 이번 세션에서 재실행만 함)로 실제 데이터 파일(`subjects.ts`, `grades.ts`, `regions.ts`, `schools.ts`, `guideArticles.ts`)과 `getIndexability()`를 조합해 331개 콘텐츠 라우트 + 각 라우트의 기대 index/noindex 플래그를 재생성했습니다.

- 과목 5, 학년 3, 지역 32(시/도 17 + 시/군/구 11 + 구 4), 학교 2, 가이드 5
- region-subject: 대치·전용 콘텐츠 있는 2건만 index, 나머지 53건 noindex(폴백)
- region-grade 33건, region-grade-subject 165건, region-district-subject 20건 — 전부 noindex
- 합계 331 / index 60 / noindex 271 — `compute-counts.ts` 재실행 결과와 100% 일치

### 1-2. 전 라우트 상태 코드

`scratch-audit/crawl.mjs`로 331개 콘텐츠 라우트 + `/robots.txt` + `/sitemap.xml`을 동시성 12로 크롤:

- 콘텐츠 331건 전부 `200`
- `/robots.txt`, `/sitemap.xml` 전부 `200`, 리다이렉트 없음(`redirect: "manual"`로 확인)
- 의도적으로 존재하지 않는 9개 경로(과목/학년/지역/시/도+도시/학교/가이드 각 1개 + 말이 안 되는 경로 3개) 전부 `404`
- 500, 예상 밖 리다이렉트, 리다이렉트 루프 **0건**

### 1-3. sitemap.xml / robots.txt

- `sitemap.xml`의 `<url>` 개수: **60개** — 기준선과 정확히 일치
- `robots.txt`:
  ```
  User-Agent: *
  Allow: /
  Disallow: /api/
  Sitemap: https://www.example-tutoring.com/sitemap.xml
  ```
  sitemap을 정상 참조하며, `/api/`만 차단하고 그 외 콘텐츠 경로는 전혀 막지 않음 — 문제 없음.

### 1-4. canonical / meta robots / `<h1>` 샘플 검사

`scratch-audit/sample-check.mjs`로 카테고리별 샘플(대형 카테고리는 10개씩 분산 추출) 81개 페이지를 검사:

- **`<h1>` 개수**: 81개 전부 정확히 1개.
- **canonical**: 81개 전부 자기 자신의 URL을 정확히 가리킴(다른 페이지를 가리키는 오류 없음).
  - 유일한 예외: 홈(`/`)의 canonical이 `https://www.example-tutoring.com`(끝에 `/` 없음)으로 렌더링됨. `src/lib/metadata.ts`의 `buildMetadata()`가 `${siteConfig.domain}${path}`(`path="/"`)로 URL을 만들면 Next.js 16의 metadata resolver가 루트 경로의 trailing slash를 정규화해서 제거하는 것으로 확인됨(Node의 `new URL()`은 슬래시를 보존하므로, Next 자체의 canonical 직렬화 단계에서 발생). **버그 아님** — 다른 페이지를 가리키지도 않고, 사이트 전체에서 이 URL 하나로 일관되게 정규화되므로 SEO 관점에서 실질적 문제가 없습니다. 제 체크 스크립트가 trailing slash를 기대한 것이 과도하게 엄격했던 것뿐입니다. 수정 불필요로 판단해 손대지 않았습니다.
- **meta robots 패턴**: 이 코드베이스는 두 가지 패턴이 혼재하며 둘 다 정상입니다.
  - index 대상 중 정적 페이지(홈/`/grades`/`/guide`/`/consult` 등 11개)와 guide 아티클 5개는 `<meta name="robots">` 자체가 **없음**(Next 기본값 = index, follow).
  - index 대상 중 subject/grade/region/school/region-subject(전용 콘텐츠)는 `robots: { index: true, follow: true }`를 명시해 `content="index, follow"`가 렌더링됨.
  - noindex 대상(region-subject 폴백, region-grade, region-grade-subject, region-district-subject) 전부 `content="noindex, follow"` 명시 — 샘플 41건 전부 정확히 noindex 렌더링, index 대상에 noindex가 잘못 붙은 사례 **0건**.

### 1-5. 내부링크 크롤

`scratch-audit/link-crawl.mjs`로 홈/과목목록/학년목록/지역목록/학교목록/가이드목록/과목상세/학년상세/시도/도시/지역+과목/학교/가이드아티클/방문·화상/상담/개인정보/약관 18개 시드 페이지를 렌더링해 `href` 78개(고유, 외부/mailto/tel/`#` 제외)를 추출 후 전수 재요청:

- **깨진 링크(비-200) 0건**

---

## Part 2 — 404 / 에러 / 빈 상태

- **잘못된 슬러그 5종** (`/subject/nonexistent-subject-qa`, `/grade/...`, `/region/...`, `/school/...`, `/guide/...`) 전부 `src/app/not-found.tsx`가 정상 렌더링됨: "페이지를 찾을 수 없습니다" 헤딩, 홈/상담 CTA, 과목·학년·지역·가이드 바로가기(관련 링크 섹션 포함), Header/Footer 정상. Next.js 개발 오류 오버레이나 빈 화면 없음.
  - 콘솔에 매번 `Failed to load resource: 404` 로그가 1건씩 찍히는데, 이는 최상위 문서 요청 자체가 (의도대로) HTTP 404를 반환하기 때문에 브라우저가 표준적으로 남기는 리소스 로그이며 애플리케이션 JS 런타임 에러가 아닙니다. 실제 JS 에러/경고는 0건.
- **`/regions` 검색 빈 결과**: "대치"로 검색 시 `"'대치'에 대한 검색 결과가 없습니다. 아래 지역 목록에서 찾아보세요."` 메시지가 정확히 재현됨 — 기존 QA 세션 결과와 동일, 회귀 없음.
- **`/consult` 정상 제출(happy path)**: 신규 필수 필드(`contactName`/`phone`/`grade`/`subject`/`lessonType`/`province`/`agree`) 전부 채운 뒤 제출 → 성공 상태("상담 신청이 접수되었습니다" + 카카오톡 상담 버튼) 정상 전환.
- **`/consult` 에러 경로**: Playwright `page.route()`로 `POST /api/consult`를 강제 `abort` 처리한 뒤 제출 → "신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." 에러 메시지 노출, 제출 버튼은 비활성화되지 않고 그대로 재사용 가능. 이후 `unroute` 후 재제출하면 정상적으로 성공 상태까지 도달 — **재제출 가능성 확인 완료**.
- **`/consult` 부분 입력**: 이름만 입력하고 나머지(학년/과목/수업방식/지역/연락처/동의)를 비운 채 제출 → 네이티브 HTML5 유효성 검사가 `grade` select를 `:invalid`로 막아 폼 제출/네트워크 요청 자체가 발생하지 않음(콜백에서 확인: API 호출 0회). 조용히 실패하거나 예외를 던지는 동작 없음.

---

## Part 3 — 반응형 검사

360 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440px(높이 800) × 14개 페이지 유형(홈, `/subject/math`, `/grade/middle`, `/lesson/visit`, `/regions`, `/region/seoul`, `/region/seoul/gangnam`, `/region/gyeonggi/suwon/math`, `/school/yeongtong-middle-school`, `/guide/elementary-study-habit`, `/consult`, `/privacy`, `/terms`, 404 페이지) = **112개 조합** 전부 `document.documentElement.scrollWidth > document.documentElement.clientWidth`가 `false`(가로 overflow 없음).

시각 스팟체크(스크린샷)는 홈과 지역+과목 페이지에 대해 375px/1440px 각 1장씩(총 4장)만 촬영 — 이전 브랜드 자산 리뷰에서 이미 Header/Footer는 375/390/768/1440에서 확인되었으므로, 이번엔 새로 추가된 콘텐츠(RelatedLinks, FAQ 등) 위주로 회귀 여부를 확인:

- 홈 375px, 1440px: 히어로/학생 프로필 카드/섹션 구성 정상, 줄바꿈이나 잘림 없음.
- `/region/gyeonggi/suwon/math`(region-subject, 신규 RelatedLinks + 기존 FAQ 섹션 포함) 375px, 1440px: breadcrumb, 학년별 카드, "이런 경우 상담을 받아보세요" 리스트, 관련 링크(관련 과목/관련 학교/자매 지역), FAQ 아코디언, 방문/화상과외 카드, 모바일 카카오+무료상담 하단 버튼 정렬까지 전부 정상 렌더링. overflow, 겹침, 잘못 배치된 요소 없음.

**발견된 overflow/레이아웃 문제: 0건.** 판단이 필요한 항목도 없습니다.

---

## 정리: 안전하게 수정 가능 vs 판단 필요

- **안전하게 수정 가능**: 해당 없음(발견된 문제 없음).
- **판단 필요**: 해당 없음. 유일하게 논의 여지가 있는 항목은 홈 canonical의 trailing slash 정규화(Part 1-4)인데, 이는 Next.js 16 metadata resolver의 정상 동작이고 SEO 영향이 없다고 판단해 "문제" 목록에 올리지 않았습니다. 필요시 `buildMetadata()` 호출부에서 명시적으로 trailing slash를 맞추는 것도 가능하나, 현재 상태로도 이상이 없어 권고하지 않습니다.

## 사용한 스크립트 / 산출물

- `scratch-audit/full-route-list.ts` → `scratch-audit/full-route-list.json` (라우트 331개 + 기대 index 플래그 + 무효 경로 9개)
- `scratch-audit/crawl.mjs` → `scratch-audit/crawl-output.json` (전 라우트 상태 코드)
- `scratch-audit/sample-check.mjs` → `scratch-audit/sample-check-output.json` (canonical/robots meta/h1 샘플 81건 + sitemap/robots.txt 원문)
- `scratch-audit/link-crawl.mjs` → `scratch-audit/link-crawl-output.json` (내부링크 78개 전수 재요청 결과)
- 스크린샷(시각 스팟체크용, 저장소 루트): `qa-home-375.png`, `qa-home-1440.png`, `qa-regionsubject-375.png`, `qa-regionsubject-1440.png`
