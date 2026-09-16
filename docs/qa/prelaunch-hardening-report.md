# 교과설계소 출시 전 종합 하드닝 — 최종 보고서

작업 일자: 2026-09-16. 사용자 확인 없이 끝까지 자동 진행하도록 요청받은 세션입니다. 금지 항목(Production 배포, 외부 계정/유료 서비스 가입, 실제 전화번호·사업자정보·카카오URL·도메인 등 허위 정보 생성, 실제 지역/학교 특성 추측, 디자인 전면 개편, SEO index/noindex 정책 변경, Git commit)은 전부 준수했습니다.

## 1. 시작 시 Git 상태

```
$ git status --porcelain
?? review-screenshots-brand/
```

직전 세션(교과설계소 브랜드 로고/에셋 제작·적용, 커밋 `4874c96`)이 이미 커밋되어 있었고, 그 세션의 검수용 스크린샷 폴더(`review-screenshots-brand/`)만 미추적 상태로 남아 있었습니다. `git diff`는 빈 결과(추적 파일 변경 없음)였습니다. 이번 세션은 이 상태를 그대로 보존한 채 작업했고, `review-screenshots-brand/`는 삭제하지 않았습니다.

## 2. 검사 범위

- 프로젝트 구조 전수 확인: `src/app/`, `src/components/`, `src/config/`, `src/data/`, `src/lib/`, `public/assets/brand/`, `docs/qa/`.
- 브랜드/정책 기준값 재확인: 브랜드명 "교과설계소", tagline "초·중·고 국영수사과 1:1 맞춤과외", slogan "학생마다 다른 공부, 다르게 설계합니다." — 전부 유지 확인.
- `src/lib/indexability.ts` + 실제 데이터 파일을 코드로 재계산(`scratch-audit/compute-counts.ts`)해 **sitemap 60 / noindex 271 / 총 라우트 333**(콘텐츠 라우트 331 + `/robots.txt` + `/sitemap.xml`) 기준값을 실측 확인.
- Index 대상 60개 페이지 콘텐츠 품질 전수 감사(템플릿 단위), 지역 허브 32개 집중 검토, 내부링크 구조 전수 검토, FAQ/Schema 정리, 브랜드 에셋 기술 검수 — 오케스트레이터가 직접 수행.
- 접근성 심화 검사(axe-core + Playwright 라이브 테스트), 성능/번들 감사, 보안 감사, 상담폼 연동 준비도 감사, 404/에러/빈 화면 감사, 반응형(8개 viewport × 14개 페이지 유형) 감사, 전체 라우트 재크롤 — **5개의 독립 서브에이전트**에게 위임(읽기 전용 감사 + 보고서 작성만; 코드 수정은 오케스트레이터가 각 보고서를 검토·검증한 뒤 직접 적용).

## 3. 발견 문제 수

| 카테고리 | 발견 | 자동 수정 | 판단 보류 |
|---|---|---|---|
| SEO 콘텐츠 품질 (지역 허브/학교) | 2건(지역 허브 34곳 전반의 획일적 문구+FAQ, 학교 2곳의 얕은 콘텐츠) | 2건 | 지역별/학교별 실제 특성 서술은 보류(사실 확인 불가) |
| FAQ/Schema 중복 | 1건(87개 URL 동일 FAQPage 스키마) | 1건 | FAQ 문항 풀 자체 확장은 보류(억지로 늘리지 않음 원칙) |
| 내부링크 | 3건(학교 페이지 orphan 위험, guide↔subject/grade 링크 없음, 학교 페이지의 관련성 약한 학년 링크) | 3건 | 없음 |
| 접근성 | Critical 1 / Serious 3 / Moderate 5 / Minor 4 (총 13건) | 10건(마크업/로직 수정만) | 색상 대비 4건(팔레트 변경 필요) |
| 보안 | Medium 2건(API 검증 부족, PII 평문 로깅) + Low 1건(길이 제한 없음) | 3건 | 보안 헤더/CSP 도입은 인프라 정책 판단 필요 |
| 상담폼 연동 준비도 | 5건(제안) | 3건 적용 | 필드명 리네이밍 등 2건은 연동 시점으로 유예(에이전트 권고 존중) |
| 성능 | 0건(실제 결함 없음, 권고 3건만) | — | Pretendard self-hosting 전환은 별도 작업 규모 |
| 404/에러/반응형/라우트 재크롤 | 0건(전부 PASS — 아래 8·15절 참고) | — | — |

## 4. 자동 수정한 문제

**콘텐츠/SEO/내부링크**
1. 지역 허브 32곳(province/city/district)의 FAQ 섹션·FAQPage 스키마 완전 제거 — 87개 URL에 동일 스키마가 반복되던 문제의 최대 원인 제거.
2. region+subject(55개) 페이지의 FAQ를 `homeFaqSlugs.slice(0,4)`(고정 4문항) → `subject.faqSlugs`(과목별로 이미 존재하던 데이터)로 교체 — 과목 5종 기준 최대 5가지 조합으로 분산.
3. city/district 지역 페이지 + region+subject 페이지에 "관련 학교" 링크 추가 — `schools.ts`의 실제 `regionSlug` 관계를 이용(지역 특성 창작 없음).
4. 학교 페이지 2곳: 학교급에 맞지 않는 학년 링크(초/중/고 전부) → 실제 학교급 1개만 링크하도록 축소, FAQ 3문항 신규 추가(subject-scope/lesson-type/pricing).
5. `guide/[slug]` ↔ `subject/[slug]`·`grade/[slug]` 양방향 내부링크 신규 추가 — `src/data/guide.ts`에 카테고리→학년/과목 매핑 헬퍼 추가(실제 카테고리 분류 기반, 창작 아님).
6. 404 페이지에 과목/학년/지역/가이드 바로가기 추가.

**접근성** (전부 markup/로직 수정, 색상·디자인 변경 없음; 라이브 Playwright 테스트로 검증 완료)
7. **[Critical]** `MobileMenu.tsx` — 패널이 `createPortal`로 `document.body` 끝에 렌더링되어 메뉴를 열고 Tab을 누르면 포커스가 메뉴가 아니라 가려진 배경 콘텐츠(Hero의 CTA 버튼)로 이동하던 문제. Portal 구조는 그대로 두고(Header의 `backdrop-blur`가 `fixed` 자손의 containing block을 바꿀 위험이 있어 portal 제거는 피함) 열릴 때 패널로 포커스를 이동시키고 닫힐 때 트리거 버튼으로 포커스를 되돌리는 방식으로 수정. 라이브 테스트로 Tab이 정상적으로 패널 내부 첫 버튼으로 이동함을 확인.
8. **[Serious]** `MobileMenu.tsx` — Escape 키로 메뉴가 닫히지 않던 문제 → keydown 핸들러 추가. 라이브 테스트로 확인.
9. **[Moderate]** `MobileMenu.tsx` — 햄버거 트리거·각 nav-group 토글 버튼에 `aria-expanded` 누락 → 추가.
10. **[Moderate]** `FAQAccordion.tsx` — 토글 버튼과 답변 패널 간 `id`/`aria-controls` 연결 누락(홈/과목/학년/region+subject/학교 전 페이지에서 재사용되는 공통 컴포넌트) → 추가.
11. **[Minor]** `Header.tsx`, `Footer.tsx` — 로고 이미지의 `alt`가 바로 옆 텍스트와 동일한 브랜드명을 중복 발화(axe image-redundant-alt) → 로고 이미지를 `alt=""`(장식용)로 변경, 브랜드명은 인접 텍스트가 전달.
12. **[하위 우선순위 4건]** `MobileBottomCTA.tsx`(랜드마크 없음 → `<nav aria-label="빠른 상담">`), `ConsultForm.tsx`(에러 메시지에 `role="alert"`), `SearchBox.tsx`(입력창에 `sr-only` 라벨 + 결과 없음 안내에 `role="status"`), `Hero.tsx`/`lesson/visit/page.tsx`(장식용 "→" 구분자 4곳에 `aria-hidden="true"`).

**보안/상담폼**
13. 상담 API(`src/app/api/consult/route.ts`) 서버측 검증 강화 — 필수 필드를 4개(contactName/phone/grade/subject)에서 폼이 이미 `required`로 강제하는 7개(+ lessonType/province/agree)로 확장, 길이 제한 추가.
14. PII(이름/연락처) 콘솔 로그 마스킹 — 실제 백엔드 연동 전까지 유일한 기록 경로인 로그에서 평문 노출 제거.
15. `ConsultForm.tsx`의 학년 선택지를 `grades.ts` 데이터에서 파생(기존 하드코딩 배열과 글자 단위로 동일함을 확인 후 교체) — 향후 학년 데이터 변경 시 자동 동기화.
16. 상담 API에 `submittedAt` 서버측 타임스탬프 추가, `agree` 체크박스 값을 boolean으로 정규화해 로그에 기록 — 향후 실제 연동 시 스키마 정리 최소화.
17. 폼 입력 필드(contactName/phone/cityDetail/availableTime/message)에 `maxLength` 추가.

## 5. 판단이 필요해서 수정하지 않은 문제

- 지역/학교별 실제 특성 서술(교육열, 학교 시험 경향 등) — **사실 확인 불가, 추측 금지 원칙에 따라 보류**.
- `region+subject`(수원 2개)의 완전한 지역 특화 문구 — 현재도 "일반론 + 지역명" 수준이며, 더 구체화하려면 실제 수원 지역 데이터가 필요해 보류.
- FAQ 문항 풀(6개) 확장 — "FAQ 수를 억지로 늘리지 않는다" 원칙과 상충되어 보류.
- `guideCategories`(10개) 중 글이 없는 5개 카테고리(국어/영어/사회/과학/수능 공부법)에 대한 새 글 작성 — 콘텐츠 제작 판단이 필요해 보류.
- **색상 대비 미달 4건**(과거 세션에서 이미 발견·보류됨, 이번 접근성 재감사에서도 동일하게 확인): `text-muted`(#64748b) on `brand-light`(#eff6ff) ≈ 4.37:1(기준 4.5:1 근소 미달, 사이트 전역), 장식용 배경 숫자/워터마크 3곳(홈 WHY 섹션, GradeCard, 과목 페이지 리스트 번호) ≈ 1.04~1.2:1(기준 3:1) — 전부 브랜드 색상 팔레트 값 변경이 필요해 이번에도 손대지 않음. 워터마크 3곳은 이미 `aria-hidden`이 적용되어 스크린리더 노출 문제는 없고, 순수 시각적 대비 문제만 남아 있음.
- 보안 헤더(CSP, X-Frame-Options 등) 도입 — 향후 외부 스크립트(분석, 카카오 SDK 등) 계획에 따라 정책이 달라져 인프라/제품 판단 필요.
- PII 로그 보관 정책 — 실제 백엔드 연동 시점과 함께 결정 필요.
- 상담폼 필드명 리네이밍(`grade`→`studentGrade` 등) — 담당 에이전트가 "실제 연동 시점에 한 번에 처리 권장"이라 명시해 그 판단을 존중, 지금은 보류.
- 시/군/구를 완전 select 드롭다운화할지(현재는 자유 텍스트) — UX/데이터 정합성 판단 필요.
- `siteConfig.domain`, `phone`, `businessName`, `kakaoUrl` 등 placeholder 값 — 실제 운영정보가 없어 이번에도 교체하지 않음(기존 세션과 동일).

## 6. SEO 콘텐츠 품질 결과

상세: [`index-content-quality-report.md`](./index-content-quality-report.md). 요약: 60개 index 페이지 중 thin content 문제가 실제로 있던 곳은 지역 허브 32개와 학교 2개뿐이었고(4절에서 수정 완료), 나머지(홈/과목5/학년3/정적허브5/가이드5/수업방식2/상담·약관3)는 이미 충분한 콘텐츠를 갖추고 있었습니다.

## 7. 내부링크 결과

상세: [`internal-link-report.md`](./internal-link-report.md). Header/Footer 전역 nav가 정적 허브(11개)+과목(5개)을 모든 페이지에서 1클릭 도달 가능하게 이미 보장하고 있었고, 이번에 학교 페이지의 orphan 위험(인바운드 1곳뿐)과 guide↔subject/grade 양방향 링크 부재를 발견해 수정했습니다.

## 8. 접근성 결과

상세: [`accessibility-final-report.md`](./accessibility-final-report.md). 서브에이전트가 axe-core(CDN 주입) + Playwright 라이브 테스트로 17개 페이지 유형(정적 허브, subject/grade/region 3단계/학교/guide/lesson/consult/privacy/terms/404)을 검사했습니다.

- 총 13건 발견(Critical 1 / Serious 3 / Moderate 5 / Minor 4). 마크업/로직만으로 고칠 수 있는 10건을 4절에 정리한 대로 전부 수정하고, 오케스트레이터가 Playwright로 재검증(모바일 메뉴 Tab 포커스 이동, Escape 닫힘, `aria-expanded`/`aria-controls` 값, 로고 `alt` 중복 해소)까지 완료했습니다.
- 나머지 4건은 전부 색상 대비 문제로, 브랜드 팔레트 변경 없이는 고칠 수 없어 5절에 기록만 하고 보류했습니다.
- 기존에 이미 정상이던 항목(헤딩 계층 1개의 `<h1>`, 랜드마크 중복 없음, 라디오 그룹 fieldset/legend, Footer 대비 수정 유지, 장식 요소 `aria-hidden` 유지, 유효하지 않은 `aria-*` 속성 0건, 전역 focus outline 억제 없음)은 전부 재확인되었습니다.

## 9. 성능 결과

상세: [`performance-report.md`](./performance-report.md). 요약: client component 5개(ConsultForm/SearchBox/MobileBottomCTA/MobileMenu/FAQAccordion) 전부 정당화됨, 미사용/중복 의존성 0건, lucide-react 전부 named import(tree-shaking 유지), Header/Footer 이미지 width/height 명시로 CLS 위험 없음, Pretendard CDN에 이미 `font-display: swap` 적용 확인. **실제 코드 결함은 발견되지 않았습니다.** 최종 빌드(16절) 결과 정적 자산(`​.next/static`) 총합 735KB, 가장 큰 단일 청크 224KB로, 이 규모의 사이트치고 무거운 수준은 아닙니다.

## 10. 보안 결과

상세: [`security-report.md`](./security-report.md). 요약: Critical/High 0건. Medium 2건(API 검증 부족, PII 평문 로깅) → **둘 다 수정 완료**. `dangerouslySetInnerHTML`은 JSON-LD 스키마 주입 1곳뿐이며 사용자 입력과 무관함을 확인. 외부 링크 3곳 전부 `rel="noopener noreferrer"` 이미 적용. `.env` 파일/하드코딩 시크릿 0건. `npm audit` 결과 **0 vulnerabilities**.

## 11. 상담폼 실연동 준비도

상세: [`consult-integration-readiness.md`](./consult-integration-readiness.md). 요약: 홈/`/consult`는 실제로는 **동일한 `ConsultForm` 컴포넌트**를 공유해 드리프트 위험이 원천적으로 없음을 확인(과제가 전제한 "두 폼"은 실제로는 하나였음). 목표 데이터 모델 대비 갭: `submittedAt` 누락(추가함), 필드명 스타일 차이 4건(연동 시점으로 유예), 서버측 필수값 검사 불충분(보강함).

## 12. 브랜드 에셋 결과

`public/assets/brand/`의 5개 파일(`logo-symbol.svg`, `logo-horizontal.svg`, `favicon.svg`, `apple-touch-icon.png`, `og-default.png`)은 직전 세션에서 이미 제작·적용 완료된 상태였습니다. 이번 세션에서 재검수한 결과:

- SVG 3종: viewBox 정상(48×48 / 32×32 / 230×48), `role="img"`+`aria-label`(+`<title>`) 포함, 불필요한 에디터 메타데이터/공백 없음, 파일 크기 248~615바이트로 매우 가벼움.
- 서버 렌더링 HTML을 직접 확인(curl)해 favicon.ico/favicon.svg/apple-touch-icon.png/og:image가 `<head>`에 모두 정상 연결되어 있음을 재확인. Header 로고(`logo-symbol.svg`, 36×36)와 Footer 로고(`logo-horizontal.svg`, 흰색 chip 안에 153×32)도 정상 출력 확인.
- **Footer의 흰색 chip 방식**(로고가 흰 배경용으로 제작되어 네이비 Footer 위에서는 chip으로 감싸는 방식)을 재검토했으나, 명백히 어색하거나 구현적으로 불필요하다고 판단되지 않아 **dark-background variant(`logo-horizontal-dark.svg` 등)는 추가하지 않았습니다.** 로고 디자인 자체도 변경하지 않았습니다.
- 접근성 감사에서 발견된 로고 이미지의 `alt` 중복 문제(8절 #11)만 수정했고, 브랜드 자산 파일 자체(SVG/PNG)는 수정하지 않았습니다.

## 13. 최종 sitemap URL 수

**60개** (변경 없음 — 실측: `curl .../sitemap.xml`의 `<url>` 태그 개수 60, `scratch-audit/compute-counts.ts` 재계산 결과, 라우트 재크롤 서브에이전트의 독립 측정 결과 세 가지 모두 일치).

## 14. 최종 noindex 예상 수

**271개** (변경 없음 — region-subject fallback 53 + region-grade 33 + region-grade-subject 165 + region-district-subject 20). `src/lib/indexability.ts`는 이번 세션에서 전혀 수정하지 않았습니다. canonical/robots meta 표본(81개 페이지) 검사에서 index/noindex 오분류 0건.

## 15. broken link 수

**0개.** 라우트 재크롤 서브에이전트가 18개 시드 페이지에서 추출한 내부링크 78개(중복 제거) 전수가 200 응답. 콘텐츠 라우트 331개(+robots.txt/sitemap.xml) 전수 200, 의도적으로 요청한 무효 슬러그 9건 전부 정상 404, 500/redirect loop 0건. 오케스트레이터가 직접 curl로 재검증한 신규/수정 라우트(11곳)도 전부 200.

## 16. Build / Lint 결과

| 검사 | 결과 |
|---|---|
| `npx tsc --noEmit` (코드 수정 직후 수 차례 반복) | ✅ 매번 0 에러 |
| `npm run lint` (코드 수정 직후 수 차례 반복) | ✅ 매번 0 에러 / 0 경고 |
| `npm run build` (최종, 서브에이전트 종료 후 dev 서버 정지하고 실행) | ✅ 통과 — 62/62 정적 페이지 생성, TypeScript 컴파일 통과 |
| 정적 자산 총합(`.next/static`) | 735KB, 최대 단일 청크 224KB |
| 반응형(8개 폭 × 14개 페이지 유형 = 112개 조합) | ✅ horizontal overflow 0건 |
| 404/빈 화면/에러 UX | ✅ PASS — 잘못된 슬러그 5종 전부 정상 404, `/regions` 검색 "결과 없음" 안내 정상, `/consult` API 실패 시뮬레이션(네트워크 인터셉트) 시 에러 메시지 표시 후 재제출 가능, 부분 입력 시 네이티브 검증으로 차단 |

## 17. 다음 작업 우선순위 TOP 10

1. 실제 운영정보(전화번호, 사업자등록번호/주소, 카카오 채널 URL, 도메인) 확보 후 `siteConfig` 일괄 교체 — 배포 전 필수.
2. 색상 대비 미달 4건(5절) — 디자인 팀과 브랜드 팔레트 조정 논의(현재 팔레트를 벗어나지 않는 선에서 톤 조정 검토).
3. 보안 헤더(CSP 등) 도입 여부 결정 — 외부 스크립트 도입 계획과 함께.
4. 상담 데이터 실제 저장소(Sheets/이메일/CRM) 연동 — 데이터 모델은 이미 정리됨(11절).
5. 지역/학교 실제 콘텐츠(사실 기반) 확보 후 지역 허브·학교 페이지 재보강.
6. `guideCategories` 중 글 없는 5개 카테고리(국어/영어/사회/과학/수능 공부법) 콘텐츠 작성.
7. Pretendard `next/font/local` self-hosting 전환 검토.
8. 상담폼 필드명 정리(`grade`→`studentGrade` 등, 연동 시점에 일괄 적용).
9. `MobileMenu.tsx` 포커스 관리는 이번에 고쳤지만, 완전한 focus trap(패널이 열려 있는 동안 배경 콘텐츠를 Tab 순환에서 완전히 제외)까지는 구현하지 않음 — 필요 시 `inert` 속성 등으로 보강 검토.
10. FAQ 문항 풀(현재 6개)을 늘려 region+subject 55개 페이지의 FAQ 다양성을 과목당 1종에서 더 세분화할지 콘텐츠 전략 검토.

---
검사 산출물: `docs/qa/index-content-quality-report.md`, `internal-link-report.md`, `schema-final-report.md`, `accessibility-final-report.md`, `performance-report.md`, `security-report.md`, `consult-integration-readiness.md`, `route-crawl-and-ux-report.md`.
