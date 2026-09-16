# 성능/번들 감사 보고서 — tutoring-site

목표: 현재 디자인/콘텐츠/라우팅을 건드리지 않고, 성능·번들 관련 상태를 점검하고 개선 후보를 분류. 이 문서는 **리포트 전용**이며 이번 세션에서 소스 코드를 수정하지 않았습니다.

과거 이력: `docs/qa/final-report.md` 부록 C에 초기 성능 점검 결과가 있음(client component 5개, 미사용 의존성 없음, 아이콘 named import, 이미지 사용 없음, Pretendard CDN 로딩, `Footer.tsx`의 `new Date().getFullYear()`). 이번 감사는 그 이후 브랜드 자산 적용(Header/Footer의 `next/image` + `publicAssetExists()` 도입)을 포함해 전부 재검증했습니다.

## 0. 방법론 및 제약사항

- 정적 분석 위주: `grep`/`Read`로 소스 전수 검사.
- **`npm run build`는 이번 에이전트가 직접 실행하지 않았습니다.** 오케스트레이터가 동일 세션에서 별도로 정본(canonical) 빌드를 실행할 예정이며, 개발 서버(`next dev`, 포트 3000)가 이미 실행 중인 상태에서 중복 빌드가 `.next` 캐시를 경합할 위험이 있어 지시에 따라 생략함.
  - `.next/` 디렉터리에 이전 빌드/개발 서버 산출물이 섞여 있는 것을 확인했으나(`BUILD_ID`는 11:58, `dev/` 하위는 12:20으로 이후 갱신됨), Turbopack dev 모드와 production 빌드 산출물이 혼재되어 있어 **라우트별 First Load JS 표는 신뢰할 수 없다고 판단, 이 문서에 포함하지 않음.**
  - 참고용으로만: `.next/static/chunks/`에 존재하는 JS 청크 총합은 약 692KB이며 가장 큰 개별 청크는 `3kmozkq6tgqnz.js`(약 224KB), `2-rtuqsgzmno4.js`(약 162KB), `0cz1d0mv5g_q7.js`(폴리필, 약 110KB)였음. 이 값들은 dev 모드 산출물일 가능성이 높아 **프로덕션 First Load JS 수치로 인용하지 말 것.**
  - **→ 라우트별 "First Load JS" 표는 오케스트레이터가 이번 세션에서 실행할 정본 `npm run build` 결과로 이 문서에 추가 예정.**

## 1. "use client" 감사

`grep -rn '"use client"' src/` 결과, client component는 여전히 정확히 **5개**로 과거 이력과 동일합니다.

| 컴포넌트 | 경로 | 필요한 이유 |
|---|---|---|
| `ConsultForm` | `src/components/ConsultForm.tsx` | `useState`(제출 상태), `onSubmit` 핸들러, `fetch` 호출 — 상호작용 필수 |
| `SearchBox` | `src/components/SearchBox.tsx` | `useState`(입력값/안내문구), `useRouter().push`, `onChange`/`onSubmit` 핸들러 |
| `MobileBottomCTA` | `src/components/layout/MobileBottomCTA.tsx` | `usePathname()`으로 현재 경로에 따라 표시 여부 결정 |
| `MobileMenu` | `src/components/layout/MobileMenu.tsx` | `useState`, `useEffect`(body scroll lock), `createPortal` — 브라우저 전용 API |
| `FAQAccordion` | `src/components/FAQAccordion.tsx` | `useState`(열림/닫힘 아코디언 상태), `onClick` 핸들러 |

5개 전부 실제 상호작용/브라우저 API가 필요한 곳에만 사용되어 **불필요한 client component 없음**. 서버 컴포넌트로 전환 가능한 후보 없음.

**Header/Footer 확인**: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx` 모두 `"use client"` 지시어 없음 — 여전히 **서버 컴포넌트**로 유지됨. 두 파일이 호출하는 `publicAssetExists()`(`src/lib/brand.ts`)는 `fs.existsSync` + `path.join(process.cwd(), ...)`를 사용하므로 반드시 서버에서만 실행되어야 하는데, 실제로 두 컴포넌트가 서버 컴포넌트로 유지되고 있어 **fs 접근이 서버 사이드에만 머무는 것을 확인**. (참고: `Header`가 렌더링하는 `MobileMenu`만 client component이고, `Header` 자신은 아님 — 트리 경계가 올바르게 나뉘어 있음.)

## 2. 번들 크기

위 0번 항목 참고 — **이 에이전트는 정본 빌드를 실행하지 않았으므로 라우트별 First Load JS 표를 직접 확보하지 못함.** 오케스트레이터의 `npm run build` 결과를 이 섹션에 첨부 예정.

간접 근거(참고용, 비신뢰 수치): 의존성이 `next`/`react`/`react-dom`/`lucide-react` 4개뿐이고 client 컴포넌트가 5개뿐이라, 사이트 규모(333 라우트) 대비 공유 청크는 일반적인 Next.js 16 + Tailwind v4 베이스라인(react/react-dom 런타임 + Next 라우터/청크 로더) 수준에서 크게 벗어나지 않을 것으로 예상됩니다. 다만 이는 추정이며 정본 빌드 수치로 반드시 재확인이 필요합니다.

가장 큰 소스 파일(참고, 번들 크기와 1:1 대응 아님):

| 파일 | 라인 수 |
|---|---|
| `src/app/page.tsx` | 331 |
| `src/app/region/[province]/[city]/[slug]/page.tsx` | 296 |
| `src/components/ConsultForm.tsx` | 216 |
| `src/data/subjects.ts` | 205 |
| `src/app/lesson/visit/page.tsx` | 167 |

주의: `ConsultForm.tsx`(client component)가 `src/data/subjects.ts`(13.5KB)와 `src/data/regions.ts`의 `getProvinces()`를 직접 import합니다. 두 데이터는 `/consult` 라우트의 client 청크에 포함되며, 다른 페이지와 공유되는 shared chunk에는 들어가지 않으므로 전역 영향은 없지만, `/consult` 개별 First Load JS에는 이 데이터 크기가 그대로 반영됩니다. 데이터 자체가 정적이고 작아(수 KB) 문제로 보기는 어려우나, 빌드 표 확보 후 `/consult` 라우트 크기가 유독 크다면 1차 확인 지점입니다.

## 3. 의존성 사용 현황

`package.json` 전체 의존성(총 4 dependencies + 8 devDependencies, 매우 작은 세트):

| 패키지 | 종류 | src/ 사용 확인 | 비고 |
|---|---|---|---|
| `next` | dep | 사용 (프레임워크 전역) | - |
| `react` | dep | 사용 (전역) | - |
| `react-dom` | dep | 사용 (`createPortal` 등) | - |
| `lucide-react` | dep | 사용 (26개 파일에서 import) | 아이콘 전용, 중복 아이콘 라이브러리 없음 |
| `@tailwindcss/postcss` | devDep | 사용 (`postcss.config` 경유, Tailwind v4 빌드 파이프라인) | - |
| `tailwindcss` | devDep | 사용 (`globals.css` `@import "tailwindcss"` 등) | - |
| `@types/node`, `@types/react`, `@types/react-dom` | devDep | 타입 전용, 직접 import 없음(정상) | 타입 패키지 특성상 grep으로 사용 확인 불가하나 필요 |
| `eslint`, `eslint-config-next` | devDep | `npm run lint`에서 사용 | - |
| `typescript` | devDep | 빌드/타입체크 전반에 사용 | - |

**미사용 의존성: 발견되지 않음.** 아이콘 라이브러리(lucide-react 1개), 날짜 라이브러리(없음, `Date` 네이티브만 사용) 등 **중복/겹치는 의존성도 없음.** 의존성 세트가 매우 미니멀하게 유지되고 있어 이 항목은 정상.

(버전 업그레이드는 이번 감사 범위 밖이라 제안하지 않음.)

## 4. 아이콘 임포트 방식

`grep -rn 'from "lucide-react"' src/` 결과 **26개 파일 전부 named import**(`import { X, Y } from "lucide-react"`) 형태였고, `import * as`, default import, `require()` 패턴은 **0건**. Tree-shaking이 정상적으로 동작하는 구조입니다. 추가 조치 불필요.

## 5. 폰트 로딩

`src/app/layout.tsx` 50~56행:

```tsx
<link
  rel="stylesheet"
  as="style"
  crossOrigin="anonymous"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
/>
```

- 여전히 `next/font`가 아닌 외부 CDN `<link>` 방식으로 로드 중. 이는 렌더 블로킹 스타일시트 요청 1개(+ 실제 폰트 파일 요청들)를 추가로 발생시켜 `next/font`가 제공하는 self-hosting/preload/자동 서브셋 최적화를 누리지 못합니다.
- **font-display 확인**: 실제 CDN CSS(`pretendard.css`)를 확인한 결과 `@font-face` 규칙에 **`font-display: swap`이 이미 명시되어 있음**을 확인(third-party 파일이지만 우리가 통제할 수 없는 영역에서 이미 안전한 기본값이 적용된 상태). 즉 FOIT(보이지 않는 텍스트) 위험은 낮고, fallback 폴백 체인도 `globals.css` 23행에 `--font-sans: "Pretendard", -apple-system, BlinkMacSystemFont, "Malgun Gothic", sans-serif;`로 적절히 설정되어 있어 폰트 로드 전에도 유사한 시스템 폰트로 렌더링됩니다.
- `next/font/local`로 전환하려면 폰트 파일을 리포지토리에 추가해야 하므로 이번 세션 범위 밖 — 문서화만 하고 구현하지 않음.

## 6. 이미지 최적화 (Header/Footer 신규 브랜드 자산)

- `src/components/layout/Header.tsx` 18~25행: `next/image`로 `logo-symbol` 렌더링, `width={36} height={32}` 아님 `width={36} height={36}` 명시, **`priority` 지정됨** — 헤더 로고는 above-the-fold이므로 적절한 선택.
- `src/components/layout/Footer.tsx` 53~60행: `next/image`로 `logo-horizontal` 렌더링, `width={153} height={32}` 명시, **`loading="eager"`로 지정되어 있음을 확인** — 태스크에서 언급된 "지연 로드 타이밍 버그 수정" 조치가 여전히 적용된 상태. Footer 로고는 파일 크기가 매우 작고(로고 SVG 수백 바이트~1KB대) 페이지당 1회만 렌더링되므로 `eager`로 인한 성능 비용은 무시할 수준 — 현재 설정 유지가 합리적.
- 둘 다 `width`/`height`가 명시적으로 설정되어 있어 **레이아웃 시프트(CLS) 위험 없음.**
- `next.config.ts`는 기본값 그대로(`images` 설정 없음, `remotePatterns`/`domains` 미설정). 두 로고 자산이 모두 `public/assets/brand/*`의 로컬 파일이므로 **remotePattern 설정이 필요 없음 — 현재 상태로 충분.**
- `publicAssetExists()` 폴백 로직(파일이 없으면 아이콘+텍스트로 대체)도 그대로 유지되어 있어, 실제 브랜드 자산이 없는 경우에도 깨지지 않음.

## 7. 레이아웃 시프트(CLS) 위험 전수 확인

- `grep -rn '<Image' src/` → Header, Footer 2건뿐이며 둘 다 `width`/`height` 명시. `fill` 사용 없음(따라서 `sizes` 속성 관련 위험도 없음).
- `grep -rn '<img ' src/` → **0건.** 네이티브 `<img>` 태그 사용 없음.
- 웹폰트 font-display: 5번 항목 참고, `swap`으로 이미 안전.
- 종합: **레이아웃 시프트 위험 요소 없음.**

## 8. Hydration 민감 코드

`grep -rn 'new Date()|Math.random()|window.|localStorage|sessionStorage|document.' src/` 결과:

| 위치 | 코드 | 평가 |
|---|---|---|
| `src/components/layout/Footer.tsx:91` | `{new Date().getFullYear()}` | **여전히 존재.** 렌더링 중 호출되지만 서버/클라이언트가 자정을 사이에 두고 각각 렌더링되는 극단적 경우가 아니면 값이 동일해 mismatch가 발생하지 않음. 과거 이력과 동일하게 **저위험/허용 가능한 패턴**으로 재확인. |
| `src/components/layout/MobileMenu.tsx:14,16` | `document.body.style.overflow = ...` | `useEffect` 내부에서만 호출됨(렌더 본문 아님) — client component이므로 hydration 문제 없음. |
| `src/components/layout/MobileMenu.tsx:89` | `typeof document !== "undefined" ? createPortal(...) : null` | 방어적 체크 포함, client component 내부, 문제 없음. |
| `src/app/sitemap.ts:69` | `lastModified: new Date()` | React 렌더링과 무관한 서버 전용 메타데이터 생성 함수 — hydration 대상 아님. |

`Math.random()`, `window.`(단독), `localStorage`, `sessionStorage` 사용은 src/ 전체에서 **0건**. `Footer.tsx`의 연도 표시 외 신규 hydration 위험 없음 — 과거 판단 그대로 유지.

## 9. Dynamic import(`next/dynamic`) 후보

`grep -rn "next/dynamic" src/` → **0건** (아직 미사용). Client component가 5개뿐이고 각각 크기가 작고(가장 큰 `ConsultForm.tsx`도 216줄) 항상 필요한 위치(헤더/푸터/폼/아코디언)에 있어, "상호작용 후에만 필요한 대형 컴포넌트"에 해당하는 후보가 없습니다. 모달처럼 드물게 열리는 대형 컴포넌트도 존재하지 않음. **→ `next/dynamic` 도입은 현재 불필요하다고 판단하며, 억지로 권장하지 않음.**

---

## 안전하게 수정 가능 (설계/동작 변경 없음)

이 항목들은 시각적 결과나 동작을 바꾸지 않고 적용 가능한 것들입니다(다만 이번 세션에서는 적용하지 않고 권고만 함):

1. 없음에 가까움 — 이번 감사에서 발견된 실제 코드 결함은 없습니다. 현재 구조(client component 5개, named import, width/height 명시, font-display swap 등)가 이미 양호한 상태입니다.
2. (참고 수준) `docs/qa/final-report.md` 부록 C의 "이미지 최적화: 사이트에 `<img>` 사용 자체가 없어 해당 없음" 문구는 Header/Footer의 `next/image` 도입 이후 더 이상 정확하지 않으므로, 다음에 `final-report.md`를 갱신할 때 이 문서(`performance-report.md`)로 대체/링크하는 것을 권장.

## 판단 필요 / 향후 작업 (더 큰 노력 또는 의사결정 필요)

1. **Pretendard `next/font/local` 전환** — 외부 CDN `<link rel="stylesheet">` 방식(현재 `font-display: swap`은 이미 적용되어 있어 긴급하지 않음)에서 self-hosting으로 전환하면 렌더 블로킹 요청을 없애고 preload/subsetting 이점을 얻을 수 있음. 단, 폰트 파일(WOFF2)을 리포지토리에 추가해야 하므로 라이선스(OFL, 이미 확인됨)·용량·빌드 설정 변경이 필요한 별도 작업.
2. **라우트별 First Load JS 정본 수치 확보** — 이 에이전트는 중복 빌드 방지 지시에 따라 `npm run build`를 실행하지 않았음. 오케스트레이터가 실행할 정본 빌드 결과를 이 문서(2번 섹션)에 반영해 실제 가장 큰 라우트/공유 청크를 확정할 것.
3. **`/consult` 라우트의 client 데이터 bundling** — `ConsultForm.tsx`가 `subjects.ts`/`regions.ts` 데이터를 client 측에서 직접 import. 현재는 무시할 수준(수 KB)이나, 향후 데이터가 커지면 서버에서 props로 내려주는 방식으로 분리할지 판단이 필요.
4. (모니터링만) `docs/qa/final-report.md`의 placeholder 값들(`siteConfig.phone`, `domain` 등)은 성능과 무관하지만 실제 배포 전 교체 필요 — 기존 문서에 이미 기록되어 있어 본 문서에서는 참고만 함.

---

## 결론 요약

- Client component 5개, 전부 정당한 이유로 사용 중 — 과거 이력과 동일하며 신규 불필요한 client component 없음.
- Header/Footer는 브랜드 자산(`next/image` + `publicAssetExists()` fs 체크) 도입 이후에도 여전히 서버 컴포넌트 — fs 접근이 서버에만 머무름을 확인.
- 미사용/중복 의존성 없음. 아이콘 import 전부 tree-shakeable named import.
- 이미지 2건(Header/Footer 로고) 모두 width/height 명시, CLS 위험 없음.
- 폰트는 CDN 방식이지만 `font-display: swap` 이미 적용, fallback 체인 적절 — `next/font` 전환은 개선 여지로만 기록.
- Hydration 위험: `Footer.tsx`의 연도 표시 1건, 과거와 동일하게 저위험/정보성.
- 라우트별 실제 "First Load JS" 빌드 표는 이번 에이전트가 직접 실행하지 않았으며(중복 빌드 방지 지시에 따름), 오케스트레이터의 정본 빌드 결과로 보완 필요.
