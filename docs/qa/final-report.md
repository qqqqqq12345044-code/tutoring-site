# 최종 검수 보고서 — tutoring-site 자동 안정화 세션

목표: 현재 디자인/콘텐츠/브랜드/라우팅 구조를 그대로 유지한 채, 배포 전 기술적 문제를 자동으로 찾아 "안전하게 수정 가능한 것만" 수정. 디자인 변경, 색상 변경, 대규모 리팩터링, 허위 데이터 생성, 실제 배포는 수행하지 않음.

---

## 1. 검사한 항목

1. Git 상태 보호 확인 (기존 변경사항 보존)
2. `npm run build`, `npm run lint`
3. 전체 라우트 자동 크롤링 (실제 데이터 기반 조합 전수 생성)
4. 내부 링크 전수 검사 (Header/Footer/Mobile menu/CTA/Breadcrumb/RelatedLinks)
5. SEO 자동 감사 (title/description 중복·누락, canonical, OG, sitemap, H1, noindex)
6. JSON-LD/Schema 검사 (Organization/WebSite/BreadcrumbList/FAQPage)
7. 반응형 자동 검사 (375/390/768/1024/1440px × 7개 대표 페이지)
8. MobileBottomCTA 집중 테스트
9. 상담폼 기능 검사 (`/consult`)
10. 접근성 자동 감사 (axe-core, 19개 페이지)
11. 성능 기본 검사 (bundle, client component, 폰트 로딩, 의존성)
12. `/regions` 검색 기능 테스트
13. 대표 페이지 최종 스크린샷 캡처
14. 최종 빌드 재검증

## 2. 발견한 문제

| # | 문제 | 심각도 | 상태 |
|---|---|---|---|
| 1 | `sitemap.xml`이 실제 동작하는 페이지 331개 중 60개만 포함(약 271개 프로그래매틱 SEO 페이지 누락) | 높음 (SEO) | ✅ 자동 수정 |
| 2 | 이전 세션의 실패한 Vercel 배포 시도가 남긴 `.vercel/output` 캐시가 `eslint` 대상에 잡혀 lint 에러 2건 발생 | 중간 (빌드 위생) | ✅ 자동 수정 (캐시 삭제) |
| 3 | 상담폼 라디오 그룹이 `<label>`로 잘못 감싸여 접근성 트리에서 이름이 뒤섞임 | 중간 (접근성) | ✅ 자동 수정 |
| 4 | Footer 소제목 색상 대비 미달 (3.5:1, 기준 4.5:1) | 낮음 (접근성) | ✅ 자동 수정 |
| 5 | `/subjects`, `/grades` 페이지 헤딩 계층 건너뜀 (h1→h3) | 낮음 (접근성) | ✅ 자동 수정 |
| 6 | 장식용 배경 숫자/텍스트가 스크린리더에 그대로 노출됨 | 낮음 (접근성) | ✅ 자동 수정 (aria-hidden) |
| 7 | 장식용 배경 숫자/텍스트의 시각적 색상 대비 부족 | 낮음 (접근성) | ⏸ 보류 (색상 변경 필요) |
| 8 | 옅은 파란 배경(`bg-brand-light`) 위 `text-text-muted` 대비 4.37 (기준 4.5, 근소 미달) | 낮음 (접근성) | ⏸ 보류 (색상 변경 필요) |
| 9 | 지역 목록형 페이지 28곳에 동일한 FAQPage 스키마 반복 게시 | 낮음 (SEO) | ⏸ 보류 (콘텐츠 전략 판단 필요) |
| 10 | 사업자 전화번호가 placeholder(`1588-0000`)로 Organization 스키마에 노출 | - | ⏸ 확인 불가 (실제 정보 없음) |

이 외에 **깨진 링크, 404, 500, redirect loop, 가로 overflow, 텍스트 잘림, 버튼 줄바꿈, hydration 오류, console error, TypeScript 오류는 0건**이었습니다.

## 3. 자동 수정한 문제

1. **`src/app/sitemap.ts`** — 도시×과목, 도시×학년, 도시×학년×과목, 구×과목 조합을 데이터 기반으로 전부 생성하도록 로직 추가. sitemap URL 수 60 → 331 (실제 200 페이지 수와 정확히 일치). 라우팅/콘텐츠 변경 없음.
2. **`.vercel/` 디렉터리 삭제** — 이전 세션에서 중단된 배포 시도의 잔여 빌드 캐시(`git`에 추적되지 않고 이미 `.gitignore`에 포함되어 있던 디스포저블 파일). lint 오류의 원인이었으며 삭제 후 정상.
3. **`src/components/ConsultForm.tsx`** — "수업 방식" 라디오 그룹을 감싸던 `<label>`을 `<fieldset>`+`<legend>`로 교체(시각적으로 동일하게 스타일 리셋).
4. **`src/components/layout/Footer.tsx`** — 소제목 색상 `text-white/40` → `text-white/70` (같은 흰색, 투명도만 조정, 대비 3.5→약 6대 개선).
5. **`src/app/subjects/page.tsx`, `src/app/grades/page.tsx`** — 화면에 보이지 않는 `sr-only` `<h2>` 추가로 헤딩 계층 보완.
6. **`src/app/page.tsx`, `src/app/subject/[slug]/page.tsx`, `src/components/GradeCard.tsx`** — 장식용 배경 숫자/텍스트 3곳에 `aria-hidden="true"` 추가.

패키지는 추가/제거하지 않았으며(`package.json` 변경 없음), 디자인·색상·라우팅·콘텐츠 구조는 위 항목들을 제외하고 전혀 건드리지 않았습니다.

## 4. 수정하지 않고 남겨둔 문제 (판단 필요)

- **장식용 배경 숫자/텍스트의 색상 대비 부족** (WHY 섹션 큰 숫자, 과목 페이지 리스트 번호, GradeCard 배경 학년명) — 대비를 기준치까지 올리려면 브랜드 색상 팔레트 값 자체를 바꿔야 해서 보류. `docs/qa/accessibility-report.md` 참고.
- **`bg-brand-light` 배경 위 `text-text-muted` 텍스트 대비 근소 미달(4.37/4.5)** — 전역 디자인 시스템 색상이라 보류. 같은 문서 참고.
- **지역 목록 페이지 28곳의 FAQPage 스키마 중복** — 콘텐츠 전략(지역별 FAQ를 따로 만들지, 상위 페이지에서 FAQ 스키마를 뺄지) 판단 필요. `docs/qa/seo-report.md` 참고.
- **`/guide/[slug]` 아티클에 Article류 전용 JSON-LD 없음** — 작성자/발행일 등 실제 메타데이터가 없어 임의로 추가하지 않음.
- **상담폼 전화번호 입력에 형식 검증(`pattern`) 없음** — 어떤 형식까지 허용할지는 정책 판단이 필요해 보류.

## 5. 실제 운영정보가 필요해서 확인하지 못한 항목

- `siteConfig.phone`(`1588-0000`), `businessName`, `businessRegistrationNumber`, `businessAddress`, `kakaoUrl`(`https://pf.kakao.com/_example`)가 모두 placeholder 상태입니다. 실제 배포 전 반드시 실제 값으로 교체해야 하며, 이번 세션에서는 임의로 채우지 않았습니다.
- `siteConfig.domain`도 `https://www.example-tutoring.com` placeholder이므로, canonical/OG/sitemap의 절대경로 URL이 전부 이 값을 그대로 사용 중입니다. 실제 도메인 확정 후 일괄 반영이 필요합니다.

## 6. Build / TypeScript / Lint 결과

| 검사 | 결과 |
|---|---|
| `npm run build` (최초) | ✅ 통과 |
| `npm run lint` (최초) | ❌ 2건 (원인: 이전 세션의 `.vercel` 잔여 캐시, 프로젝트 코드 문제 아님) |
| `.vercel` 캐시 삭제 후 `npm run lint` | ✅ 0 에러 / 0 경고 |
| TypeScript 컴파일 | ✅ 통과 (build 과정에 포함, 별도 오류 없음) |
| 접근성 수정 반영 후 재빌드 | ✅ 통과 |
| **최종 `npm run build`** | ✅ 통과, 62개 라우트 전부 정상 생성 |
| **최종 `npm run lint`** | ✅ 0 에러 / 0 경고 |
| Console error / hydration warning (브라우저 실측) | 0건 (정상 페이지 기준. 의도적으로 500 에러를 모킹한 상담폼 에러 테스트 중 발생한 "Failed to load resource: 500" 로그 1건은 테스트가 유발한 것으로 실제 버그 아님) |

## 7. 검수한 route 개수

- 데이터 모델 기준 실제 생성 가능한 URL: **333개** (+ 대조군 404 테스트용 1개, 총 334개 요청)
- 상태 코드: 200 → 333, 404 → 1(의도된 대조군), 500/redirect loop → 0
- 세부 구성은 `docs/qa/routes-report.md` 참고

## 8. broken link 발견 개수

- **0개.** Header/MobileMenu/Footer/CTA/Breadcrumb/RelatedLinks 등 코드베이스 전체의 `href` 패턴을 정적 검사하고, 크롤러로 실제 요청까지 검증했습니다. 빈 href, `#`, 존재하지 않는 내부 경로, 잘못된 subject/grade slug, 존재하지 않는 region 경로는 발견되지 않았습니다.

## 9. SEO 관련 발견사항

- title/description 중복 0건, 누락 0건, canonical 누락 0건, OG 누락 0건, noindex 오삽입 0건 (333개 페이지 전수).
- **sitemap.xml이 실제 페이지의 18%만 포함하고 있던 것을 발견해 100% 커버리지로 수정**(가장 중요한 발견사항).
- JSON-LD 문법 오류 0건. 다만 지역 목록 페이지 28곳의 FAQPage 콘텐츠 중복은 판단 보류.
- 상세: `docs/qa/seo-report.md`

## 10. 접근성 관련 발견사항

- axe-core 기준 자동 수정 가능한 위반 4종(라디오 그룹 시맨틱, Footer 대비, 헤딩 계층, 장식 요소 스크린리더 노출)을 모두 수정했습니다.
- 남은 위반은 전부 **색상 값 변경이 필요한 항목**으로, 이번 세션의 "색상 변경 금지" 원칙에 따라 보류했습니다.
- 폼 라벨 연결, 버튼/링크 accessible name, 키보드 포커스, 아코디언/메뉴 ARIA 속성은 전부 정상.
- 상세: `docs/qa/accessibility-report.md`

---

## 부록 A. 상담폼 검사 결과 (`/consult`)

| 항목 | 결과 |
|---|---|
| required field 검증 | 정상 (빈 폼 제출 시 브라우저 네이티브 검증으로 차단, API 호출 안 됨) |
| label 연결 | 정상 (모든 필드 접근 가능한 이름 확인) |
| input type | 적절 (전화번호 `type="tel"`, 그 외 텍스트/select/textarea 적절) |
| select 기본값 | "선택해주세요" disabled 옵션으로 강제 선택 유도 — 정상 |
| 개인정보 동의 없이 제출 가능 여부 | **불가능** — `agree` 체크박스도 `required`로 네이티브 검증에 포함됨을 실측 확인 |
| mock API 오류 처리 | 정상 — API를 500으로 모킹한 결과 에러 메시지가 노출되고 재제출 가능한 상태로 복귀 |
| success 상태 | 정상 — 정상 제출 시 "상담 신청이 접수되었습니다" 화면과 카카오톡 링크 노출 |
| 중복 submit 방지 | `disabled={state === "loading"}`로 로딩 중 버튼 비활성화 확인 (코드 레벨 보장) |
| 실제 DB/CRM 연결 | 하지 않음 — 기존 mock 상태 그대로 유지 |

## 부록 B. `/regions` 검색 기능 테스트 결과

| 입력 | 결과 |
|---|---|
| 수원 | `/region/gyeonggi/suwon` 정상 이동 |
| 영통 | `/region/gyeonggi/suwon/yeongtong` 정상 이동 (부분 일치) |
| 서울 | `/region/seoul` 정상 이동 |
| 대치 | 데이터에 없는 지역명 — 오류 없이 "'대치'에 대한 검색 결과가 없습니다. 아래 지역 목록에서 찾아보세요." 안내 표시 |
| 수원고등학교 (등록된 학교명) | `/school/suwon-high-school` 정상 이동 |

외부 API를 새로 연동하지 않았으며, 기존 지역/학교 데이터 구조 내에서만 동작합니다.

## 부록 C. 성능 기본 검사 결과

| 항목 | 결과 |
|---|---|
| Client Component 개수 | 5개 (`ConsultForm`, `SearchBox`, `MobileBottomCTA`, `MobileMenu`, `FAQAccordion`) — 전부 실제 상호작용이 필요한 곳에만 사용됨. 불필요한 client component 없음 |
| 미사용 의존성 | 없음 (`next`, `react`, `react-dom`, `lucide-react` 전부 사용 중) |
| 아이콘 임포트 방식 | 전부 named import(`import { X } from "lucide-react"`)로 tree-shaking 가능한 형태 |
| 중복 import | eslint 통과로 확인(중복 import 있었다면 규칙에 걸림) |
| 이미지 최적화 | 사이트에 `<img>` 사용 자체가 없어 해당 없음 |
| 폰트 로딩 | Pretendard를 `next/font`가 아닌 외부 CDN `<link rel="stylesheet">`로 로드 중 — 동작에는 문제 없으나 `next/font/local`로 전환하면 렌더 차단을 줄일 여지가 있음(폰트 파일을 프로젝트에 추가해야 해 이번 세션에서는 수정하지 않고 기록만 함) |
| hydration 유발 코드 | `Footer.tsx`의 `{new Date().getFullYear()}` — 서버/클라이언트 렌더링 시점이 자정을 걸치는 극단적 경우가 아니면 문제 없는 통상적 패턴이라 별도 조치하지 않음 |

## 부록 D. 변경 파일 목록 (이번 자동 검수 세션)

```
src/app/sitemap.ts                 sitemap 커버리지 271개 페이지 추가
src/app/page.tsx                   장식 요소 aria-hidden 추가
src/app/subject/[slug]/page.tsx    장식 요소 aria-hidden 추가
src/app/subjects/page.tsx          sr-only h2 추가 (헤딩 계층)
src/app/grades/page.tsx            sr-only h2 추가 (헤딩 계층)
src/components/ConsultForm.tsx     라디오 그룹 fieldset/legend로 교체
src/components/layout/Footer.tsx   소제목 색상 대비 개선 (white/40 → white/70)
src/components/GradeCard.tsx       장식 요소 aria-hidden 추가
docs/qa/*.md, crawl-results.json   이번 검수 리포트 (신규)
review-screenshots-final/*.png     최종 대표 페이지 스크린샷 14장 (신규)
.vercel/                           삭제 (이전 세션의 잔여 빌드 캐시, git 비추적)
```

`package.json` / `package-lock.json`은 변경하지 않았습니다. 기존 `review-screenshots/`, `review-screenshots-v2/` 폴더는 삭제하지 않고 그대로 보존했습니다.

## 부록 E. Git 상태

세션 시작 시 기존 미커밋 변경사항(디자인 V2 작업분)을 그대로 확인했고, 삭제/되돌리기 없이 그 위에 이번 QA 수정사항만 추가했습니다. 브랜치는 계속 `master`이며 커밋은 진행하지 않았습니다(요청 시 별도로 안내 가능).

최종 `git status --short`:

```
 M .gitignore
 M package-lock.json
 M package.json
 M src/app/globals.css
 M src/app/layout.tsx
 M src/app/page.tsx
?? .playwright-mcp/
?? docs/
?? review-screenshots-final/
?? review-screenshots-v2/
?? review-screenshots/
?? src/app/api/
?? src/app/consult/
?? src/app/grade/
?? src/app/grades/
?? src/app/guide/
?? src/app/lesson/
?? src/app/not-found.tsx
?? src/app/privacy/
?? src/app/region/
?? src/app/regions/
?? src/app/robots.ts
?? src/app/school/
?? src/app/schools/
?? src/app/sitemap.ts
?? src/app/subject/
?? src/app/subjects/
?? src/app/terms/
?? src/components/
?? src/config/
?? src/data/
?? src/lib/
```

최초 커밋이 `Initial commit from Create Next App`(보일러플레이트) 하나뿐이라, 실제 사이트 구현 전체가 아직 커밋되지 않은 상태입니다. `.playwright-mcp/`, `review-screenshots*/`는 검수 산출물(스크린샷/트레이스)이라 소스 코드 커밋 시 제외를 권장합니다.
