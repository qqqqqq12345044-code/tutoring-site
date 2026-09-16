# 접근성 최종 감사 리포트 (재검증)

이전 리포트(`docs/qa/accessibility-report.md`)의 수정 사항이 현재 코드에 여전히 유효한지 재검증하고,
그 사이 추가된 신규 콘텐츠(RelatedLinks 섹션, School FAQ, 브랜드 로고 이미지 등)를 포함해 전체를 다시 감사했습니다.

## 방법론

- 정적 코드 검토: `src/app/**/page.tsx` 전 라우트 템플릿(홈, subjects/grades/regions/schools/guide 허브, subject/grade/region(3단계)/school/guide 상세, region+subject 전용 콘텐츠/제네릭/4단계 조합, lesson/visit·online, consult, privacy, terms, not-found)과 공용 컴포넌트(`Header`, `Footer`, `MobileMenu`, `MobileBottomCTA`, `FAQAccordion`, `ConsultForm`, `SearchBox`, `RelatedLinks`, `SectionHeader`, `Breadcrumb`, `ConsultCTA`, `ChecklistPanel`, `GradeCard`, `PrimaryButton`, `Hero`, `StepFlow`, `globals.css`)을 전수 확인.
- 동적 검증: Playwright로 dev 서버(`localhost:3000`)에 접속해 axe-core 4.x를 CDN에서 런타임 주입(`axe.run()`) — CSP/CORS 이슈 없이 정상 동작. 홈, `/region/gyeonggi/suwon/math`(지역+과목 전용 콘텐츠), `/region/seoul/gangnam/math`(지역+과목 제네릭/noindex), `/school/suwon-high-school`(신규 FAQ 포함)에서 실행.
- 키보드 내비게이션: `Tab`/`Escape` 키 입력 후 `document.activeElement` 실측, 포커스 링 스크린샷 촬영.
- **주의**: 이 세션의 Playwright 브라우저 탭이 병렬로 작업 중인 다른 프로세스(오케스트레이터 등)와 **공유**되고 있어, 테스트 도중 URL이 예고 없이 바뀌는 현상이 여러 차례 발생했습니다(`/regions`, `/region/nonexistent-province-qa` 등으로 임의 이동). 매 실행마다 `location.href`를 함께 반환해 결과가 의도한 페이지에서 나온 것인지 검증했고, 불일치가 감지된 결과는 모두 폐기했습니다. 이 때문에 일부 템플릿(lesson/visit·online, privacy/terms, 404, guide 허브 등)은 동적 axe 실행 대신 정적 코드 검토로 대체 검증했습니다(해당 템플릿들은 다른 페이지에서 이미 axe로 검증된 동일한 공용 컴포넌트만 사용하므로 신뢰도는 높습니다).

## 페이지 유형별 결과 요약

| 페이지 유형 | h1 1개 | 헤딩 스킵 없음 | 랜드마크 정상 | axe 위반(치명적 카테고리) | 비고 |
|---|---|---|---|---|---|
| `/` 홈 | ✅ | ✅ | ✅ (header/nav/main/footer 각 1개) | color-contrast 9, image-redundant-alt 1, region 1(375px에서만) | 폼 라벨/라디오그룹 실측 정상 |
| `/subjects`, `/grades` | ✅ | ✅ (sr-only h2 유지) | ✅ | 미실행(정적 검토, 동일 패턴) | 이전 수정 유지 확인 |
| `/subject/math` | ✅ | ✅ | ✅ | 미실행(정적 검토) | RelatedLinks 2개 신규 섹션도 헤딩 미사용(카드형 `<p>`)이라 계층 영향 없음 |
| `/grade/elementary` | ✅ | ✅ | ✅ | 미실행(정적 검토) | 동일 |
| `/region/seoul`, `/region/gyeonggi/suwon` | ✅ | ✅ | ✅ | 미실행(정적 검토) | |
| `/region/gyeonggi/suwon/math` (전용 콘텐츠) | ✅ | ✅ (h1→h2×5) | ✅ (nav 2개: 헤더+breadcrumb, 각각 구분 가능) | color-contrast 1, image-redundant-alt 1 | breadcrumb `aria-label="breadcrumb"` 확인 |
| `/region/seoul/gangnam/math` (제네릭/noindex) | ✅ | ✅ (동일 패턴) | ✅ | color-contrast 1, image-redundant-alt 1 | |
| `/region/.../yeongtong` (구 허브) | ✅ | ✅ | ✅ | 미실행(정적 검토) | |
| `/school/suwon-high-school` (신규 FAQ 포함) | ✅ | ✅ (h1→h2 "자주 묻는 질문") | ✅ | image-redundant-alt 1 | FAQAccordion `aria-expanded` 있으나 `aria-controls` 없음 |
| `/guide/[slug]`, `/guide` | ✅ | ✅ | ✅ | 미실행(정적 검토) | |
| `/lesson/visit`, `/lesson/online` | ✅ | ✅ | ✅ | 미실행(정적 검토) | 장식용 "→" 구분자 다수 |
| `/consult` | ✅ | ✅ | ✅ | 미실행(정적 검토, 홈과 동일 ConsultForm) | 폼 접근성 전 항목 정상 |
| `/privacy`, `/terms` | ✅ | ✅ | ✅ | 미실행(정적 검토) | |
| 404 (`not-found.tsx`) | ✅ | ✅ | ✅ | 미실행(정적 검토) | RelatedLinks 신규 섹션 포함해도 계층 문제 없음 |

## 전체 위반 목록 (심각도별)

### Critical

**C1. 모바일 메뉴 — 키보드 포커스 순서가 시각적 순서와 완전히 어긋남 (포커스 함정)**
- 파일: `src/components/layout/MobileMenu.tsx` (전체 구조, 특히 9~91행)
- `createPortal(panel, document.body)`로 메뉴 패널을 `document.body` 끝에 렌더링합니다. 열림 상태에서 실제 DOM/tab 순서는 시각적 순서(헤더 → 메뉴 패널)를 따르지 않고 `body`의 마지막 자식 위치를 따릅니다.
- 실측: 375px 뷰포트에서 햄버거 버튼(`aria-label="메뉴 열기"`)에 포커스 후 클릭으로 메뉴를 열고 `Tab`을 누르면, 포커스가 메뉴 패널 안의 링크("과목별 과외" 등)가 아니라 **메뉴 패널 뒤에 시각적으로 가려진 히어로 섹션의 "무료 과외 상담받기" 버튼**으로 이동함을 확인했습니다(`document.activeElement` 실측).
- 영향: 키보드 사용자가 메뉴를 열어도 다음 Tab에서 화면에 보이지 않는 배경 콘텐츠로 포커스가 이동해 방향을 잃습니다(WCAG 2.4.3 초점 순서, 2.1.2류 함정과 유사한 심각한 사용성 문제).
- 제안(로직 변경 필요, 색상/디자인과 무관): 패널을 `createPortal` 없이 컴포넌트 트리 내(버튼 바로 다음)에 `position: fixed`로 렌더링하도록 변경 — `fixed`는 트랜스폼이 없는 조상 기준 뷰포트에 붙으므로 portal 없이도 동일하게 화면 전체를 덮을 수 있습니다. 또는 portal을 유지한다면 열림 시 포커스를 패널 첫 링크로 이동시키고 포커스 트랩을 구현해야 합니다.

### Serious

**S1. 모바일 메뉴 — `Escape` 키로 닫히지 않음**
- 파일: `src/components/layout/MobileMenu.tsx` (9~18행, `useEffect` 블록 — `keydown` 리스너 자체가 없음)
- 실측: 메뉴를 연 상태에서 `Escape`를 눌러도 패널이 닫히지 않고 `body.style.overflow`도 `hidden`으로 유지됨을 확인.
- 제안(로직 추가): `useEffect`에 `keydown` 리스너를 추가해 `open === true`일 때 `Escape` 키 입력 시 `setOpen(false)` 호출.

**S2. 색상 대비 미달 — `text-text-muted` on `bg-brand-light`**
- 실측(axe `color-contrast`, serious): `#64748b` on `#eff6ff` ≈ **4.37:1** (기준 4.5:1 근소 미달)
- 발생 위치: `ConsultCTA` 설명 문구(거의 모든 서브페이지 하단, `src/components/ConsultCTA.tsx` 18행), 홈 "우리 동네 과외를 찾아보세요" 섹션 설명(`src/app/page.tsx` 110행 `SectionHeader description`), `/consult` 상단 설명 등.
- **판단 필요(색상 변경 필요) — 이전 리포트와 동일하게 미해결 상태, 디자인 시스템 색상이라 임의 수정 불가.**

**S3. `MobileBottomCTA` — 랜드마크에 포함되지 않은 콘텐츠 (모바일 폭에서만)**
- 파일: `src/components/layout/MobileBottomCTA.tsx` (36~46행)
- 실측(axe `region`, moderate/serious 경계): 뷰포트 <1024px(`lg:hidden` 해제 구간)에서 "카카오 상담"/"무료 상담" 링크 바를 담은 `<div className="fixed ...">`가 `header`/`main`/`footer` 어느 랜드마크에도 속하지 않은 채 `<body>` 바로 아래 노출됩니다.
- 제안(마크업/안전 수정): 42행의 바깥 `<div>`를 `<nav aria-label="빠른 상담">`으로 바꾸거나 `role="navigation" aria-label="빠른 상담"`을 추가.

### Moderate

**M1. 모바일 메뉴 트리거 버튼에 `aria-expanded` 없음**
- 파일: `src/components/layout/MobileMenu.tsx` 80~86행
- `aria-label`은 열림/닫힘에 따라 바뀌지만(`"메뉴 열기"`/`"메뉴 닫기"`), `aria-expanded`가 없어 스크린리더가 버튼을 표준 방식으로 "확장됨/축소됨" 상태로 안내하지 못함(실측: `getAttribute('aria-expanded')` → `null`).
- 안전 수정: `<button type="button" aria-label={...} aria-expanded={open} onClick={...}>`로 `aria-expanded={open}` 추가.

**M2. 모바일 메뉴 그룹 토글 버튼에도 `aria-expanded` 없음**
- 파일: `src/components/layout/MobileMenu.tsx` 27~40행 (하위 메뉴 아코디언 버튼)
- 안전 수정: `aria-expanded={openGroup === item.label}` 추가.

**M3. `FAQAccordion` — `aria-controls`/`id` 연결 누락**
- 파일: `src/components/FAQAccordion.tsx` 19~23행(버튼), 34~38행(답변 패널)
- `aria-expanded`는 정상이나(이전 리포트에서 확인한 그대로), 버튼과 답변 패널을 프로그래밍적으로 연결하는 `aria-controls`/`id` 쌍이 없습니다. 홈, subject, grade, region-subject, school(신규) 등 사이트 전역에서 재사용되는 컴포넌트라 영향 범위가 큽니다.
- 안전 수정: 답변 `<div>`에 `id={`faq-panel-${item.slug}`}` 추가, 버튼에 `aria-controls={`faq-panel-${item.slug}`}` 추가.

**M4. `ConsultForm` 제출 실패 메시지가 스크린리더에 전달되지 않음**
- 파일: `src/components/ConsultForm.tsx` 162~166행
- `state === "error"`일 때 렌더되는 `<p className="text-sm text-red-600">...</p>`에 `role`이나 `aria-live`가 없어, 폼을 스크린리더로 제출한 사용자는 실패 사실을 알아채기 어렵습니다.
- 안전 수정: `<p role="alert" className="...">` 추가(또는 `aria-live="assertive"`).

**M5. 장식용 워터마크·배경 숫자 대비 미달 (이전 리포트와 동일, 여전히 미해결)**
- 실측(axe `color-contrast`): 홈 WHY 섹션 "01~04"(`text-brand-light` on `#f8fafc`) ≈ 1.04:1, `GradeCard` 배경 학년명(`text-navy/10`) ≈ 1.2:1, subject 페이지 편집형 리스트 배경 숫자 ≈ 1.08:1 — 모두 기준 3:1 미달.
- `aria-hidden="true"`는 이미 적용되어 있어(스크린리더 노출 없음, 확인 완료) 그 부분은 정상이나, **저시력 사용자의 육안 대비 자체는 여전히 미달**입니다.
- **판단 필요(색상/투명도 변경 필요) — 기존 리포트와 동일 사유로 미수정 유지.**

### Minor

**N1. 헤더 로고 — `image-redundant-alt`**
- 파일: `src/components/layout/Header.tsx` 16~32행
- `<Link href="/">` 안에 `<Image alt={siteConfig.brandShortName} .../>`와 바로 옆 `<span>{siteConfig.brandShortName}</span>`이 함께 있어, 링크의 접근 가능한 이름이 `"교과설계소 교과설계소"`로 중복 계산됨을 실측 확인(`link "교과설계소 교과설계소"`).
- 참고: 이전 리포트는 "사이트에 `<img>` 사용 없음"이라고 기록했으나, 이후 브랜드 자산 커밋(`4874c96 Add Gyogwa Seolgyeso brand assets`, `a988a0b Apply Gyogwa Seolgyeso brand identity`)으로 로고 이미지가 추가되어 더 이상 사실이 아닙니다 — 재검증 과정에서 새로 발견.
- Footer(`src/components/layout/Footer.tsx` 51~61행)의 로고는 `<Link>`로 감싸여 있지 않아 동일 문제 없음(축소 대비 확인).
- 안전 수정: `Header.tsx`의 `Image` `alt`를 `siteConfig.brandShortName` → `""`(빈 문자열, 장식 처리 — 바로 옆 텍스트가 이미 동일 정보 제공)로 변경.

**N2. `SearchBox` 검색창이 `placeholder`에만 의존한 접근 가능한 이름**
- 파일: `src/components/SearchBox.tsx` 42~52행
- `<label>`/`aria-label`이 없고 `placeholder="예) 수원, 영통구, 영통중학교"`만 있음. 브라우저가 placeholder를 이름으로 폴백해 실측상 이름 자체는 존재하지만(`combobox "예) 수원, 영통구, 영통중학교"`), 입력 시작 시 placeholder가 사라져 지속적인 라벨이 없어지는 취약한 패턴입니다(WCAG 3.3.2 권장 사항). 홈페이지와 `/regions` 양쪽에서 재사용됨.
- 안전 수정: `sr-only` `<label htmlFor="region-search-input">지역 또는 학교 검색</label>` 추가 + `input`에 `id="region-search-input"` 부여.

**N3. 장식용 "→" 화살표 구분자에 `aria-hidden` 없음**
- 위치 예시: `src/components/home/Hero.tsx` 63, 65행(FlowStep 사이 구분자), `src/app/lesson/visit/page.tsx` 83, 85행 등 — 동일 패턴이 `lesson/online`, region-subject 페이지의 단계 흐름 표시 등 여러 곳에 반복됩니다(`className="text-border-subtle"` 안의 `→` 텍스트로 검색하면 전체 위치 확인 가능).
- 순수 시각적 구분선이며 스크린리더가 "오른쪽 화살표"로 불필요하게 읽어 각 단계 라벨 사이에 노이즈를 추가합니다.
- 안전 수정: 각 `<span className="text-border-subtle">→</span>`에 `aria-hidden="true"` 추가.

**N4. 헤더 데스크톱 `<nav>`에 `aria-label` 없음**
- 파일: `src/components/layout/Header.tsx` 34행
- Breadcrumb의 `<nav aria-label="breadcrumb">`와는 이미 구분되므로 위반은 아니지만(동시에 페이지에 노출되는 두 `nav` 모두 서로 다른 접근 가능한 이름을 가짐 — breadcrumb는 라벨 있음, 헤더 nav는 라벨 없음 상태로 이름 없는 "navigation"으로 구분됨), 견고성을 위해 `aria-label="주 메뉴"` 부여를 권장합니다(필수 아님).

## 안전하게 수정 가능한 항목 (마크업/로직, 색상 변경 없음)

| # | 파일 | 위치 | 변경 내용 |
|---|---|---|---|
| 1 | `src/components/layout/MobileMenu.tsx` | 9~18행 `useEffect` | `Escape` keydown 리스너 추가해 열림 상태에서 `setOpen(false)` 호출 |
| 2 | `src/components/layout/MobileMenu.tsx` | 80~86행 | 트리거 `<button>`에 `aria-expanded={open}` 추가 |
| 3 | `src/components/layout/MobileMenu.tsx` | 27~40행 | 그룹 토글 `<button>`에 `aria-expanded={openGroup === item.label}` 추가 |
| 4 | `src/components/layout/MobileMenu.tsx` | 20~76행(패널 렌더링) | `createPortal(panel, document.body)` 제거하고 컴포넌트 내부에서 `position: fixed`로 직접 렌더링 (탭 순서를 시각 순서와 일치시킴) — Critical C1 해결 |
| 5 | `src/components/FAQAccordion.tsx` | 19~23행, 34~38행 | 답변 `<div>`에 `id={`faq-panel-${item.slug}`}`, 버튼에 `aria-controls={`faq-panel-${item.slug}`}` 추가 |
| 6 | `src/components/ConsultForm.tsx` | 162~166행 | 에러 메시지 `<p>`에 `role="alert"` 추가 |
| 7 | `src/components/layout/Header.tsx` | 18~25행 | 로고 `<Image alt={siteConfig.brandShortName}>` → `alt=""`로 변경(장식 처리, 인접 텍스트가 이름 제공) |
| 8 | `src/components/layout/MobileBottomCTA.tsx` | 42행 | 바깥 `<div className="lg:hidden fixed ...">`를 `<nav aria-label="빠른 상담" className="lg:hidden fixed ...">`로 변경 |
| 9 | `src/components/SearchBox.tsx` | 42~52행 | `sr-only` `<label htmlFor="region-search-input">` 추가 + `input id="region-search-input"` 부여 |
| 10 | `src/components/home/Hero.tsx` 등 (그 외 동일 패턴 파일 다수) | "→" 구분자 `<span>` | `aria-hidden="true"` 추가 (전체 위치는 `text-border-subtle">→` 검색으로 확인) |

## 판단 필요 (색상/디자인 변경 필요 — 수정하지 않음)

| # | 위치 | 실측 대비 | 필요 기준 | 비고 |
|---|---|---|---|---|
| 1 | `text-text-muted`(`#64748b`) on `bg-brand-light`(`#eff6ff`) — `ConsultCTA`, 홈 섹션 설명, `/consult` 상단 설명 등 사이트 전역 | 4.37:1 | 4.5:1 | 이전 리포트와 동일 사유로 미해결. 디자인 시스템 전역 색상이라 이 배경에서만 별도 색을 쓰는 것도 새로운 색상 결정에 해당 |
| 2 | 홈 WHY 섹션 배경 숫자 `text-brand-light` on `#f8fafc` | 1.04:1 | 3:1 | `aria-hidden` 처리로 SR 노출은 이미 차단됨. 육안 대비만 미달 |
| 3 | `GradeCard` 배경 학년명 `text-navy/10` on 흰색 | 1.2:1 | 3:1 | 동일 |
| 4 | subject 페이지 편집형 리스트 배경 숫자 `text-brand-light` | 1.08:1 | 3:1 | 동일 |

## 재확인된 통과 항목 (이전 수정 유지 확인)

- 라디오 그룹(`ConsultForm` "수업 방식") — `<fieldset>`+`<legend>` 정상 작동, 실측 접근성 트리에서 `group "수업 방식 *"`로 올바르게 노출됨.
- Footer 섹션 라벨 색상(`text-white/70`) 유지.
- 헤딩 계층 스킵 0건 — 감사한 모든 템플릿(신규 RelatedLinks/FAQ 섹션 포함)에서 h1 1개, 레벨 스킵 없음.
- 장식용 숫자/배경 텍스트 `aria-hidden="true"` 유지(홈 WHY, subject 리스트, GradeCard).
- 폼 라벨 연결 — `/consult`, 홈 미니 폼 모든 입력에 접근 가능한 이름 확인.
- 포커스 가시성 — `globals.css`/Tailwind 어디에도 전역 `outline-none`이 없어 브라우저 기본 포커스 링이 모든 링크·버튼에서 살아있음을 실측(1280px 데스크톱에서 Tab 후 스크린샷으로 시각 확인). `ConsultForm`/`SearchBox` 입력 필드는 추가로 `focus:ring-2 focus:ring-brand` 커스텀 스타일 적용.
- 모바일 메뉴/닫기 버튼 `aria-label`("메뉴 열기"/"메뉴 닫기") 정상.
- `MobileBottomCTA` 스페이서(`aria-hidden="true"`)로 중복 낭독 방지 정상.
- 잘못된 `aria-*` 속성이나 중복 role 없음(전수 검토).

## 최종 상태

- **Critical**: 1건 (모바일 메뉴 포커스 순서)
- **Serious**: 3건 (Escape 미작동, 색상 대비 1건, MobileBottomCTA 랜드마크 누락)
- **Moderate**: 5건 (aria-expanded 2건, FAQAccordion aria-controls, 폼 에러 미고지, 장식 워터마크 대비)
- **Minor**: 4건 (로고 alt 중복, SearchBox 라벨, 화살표 노이즈, nav aria-label 권장)
- 안전하게 수정 가능(마크업/로직, 색상 무관): **10건**
- 판단 필요(색상/디자인 변경 필요): **4건**(모두 이전 리포트에서 이미 보류된 항목과 동일 — 신규 색상 문제 없음)
