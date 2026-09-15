# 접근성 기본 감사 리포트

[axe-core](https://github.com/dequelabs/axe-core) 4.10.2를 프로덕션 빌드 페이지에 실시간 주입해(CDN 로드, 배포 코드에는 포함되지 않음) 19개 대표 페이지를 검사했습니다: `/`, `/subject/math`, `/subject/korean`, `/grade/middle`, `/lesson/visit`, `/lesson/online`, `/regions`, `/region/gyeonggi`, `/region/gyeonggi/suwon`, `/region/gyeonggi/suwon/math`, `/consult`, `/subjects`, `/grades`, `/schools`, `/school/yeongtong-middle-school`, `/school/suwon-high-school`, `/guide`, `/guide/math-weak-unit`, `/privacy`, `/terms`.

## 자동 수정한 문제

### 1. 라디오 그룹이 `<label>`로 잘못 감싸여 있던 문제 (`/consult`)

`수업 방식` 라디오 3개(방문/화상/상관없음)를 감싸는 컨테이너가 `<label>`이었습니다. `<label>`은 정확히 하나의 폼 컨트롤에만 연결되어야 하는데 라디오 3개를 감싸고 있어, 브라우저 접근성 트리에서 첫 번째 라디오의 접근 가능한 이름이 "수업 방식 * 방문 화상 상관없음"처럼 뒤섞여 계산되는 것을 실측으로 확인했습니다.
- 수정: `<label>` → `<fieldset>` + `<legend>`로 교체. 시각적 스타일은 `border-0 p-0 m-0`로 브라우저 기본 스타일을 제거해 픽셀 단위로 동일하게 유지했습니다.
- 파일: `src/components/ConsultForm.tsx`

### 2. Footer 섹션 라벨 색상 대비 부족

Footer의 "서비스", "상담·수업 방식" 소제목이 `text-white/40`(네이비 배경 위 대비 3.5:1)로 WCAG AA 기준(4.5:1)에 못 미쳤습니다.
- 수정: `text-white/40` → `text-white/70`으로 상향. 같은 흰색·같은 배경 위에서 투명도만 조정한 것으로 브랜드 색상 자체는 변경하지 않았습니다.
- 파일: `src/components/layout/Footer.tsx`

### 3. 헤딩 계층 건너뜀 (`/subjects`, `/grades`)

각 페이지가 `<h1>` 다음 바로 카드 컴포넌트의 `<h3>`로 넘어가 `<h2>`가 빠져 있었습니다(`heading-order` 위반).
- 수정: 시각적으로는 보이지 않는 `sr-only` `<h2>`("과목 목록"/"학년 목록")를 그리드 앞에 추가해 계층을 채웠습니다. 디자인 변경 없음.
- 파일: `src/app/subjects/page.tsx`, `src/app/grades/page.tsx`

### 4. 장식용 숫자/텍스트에 `aria-hidden` 추가 (스크린리더 노이즈 감소)

홈 WHY 섹션의 큰 "01/02/03/04" 배경 숫자, 과목 페이지 편집형 리스트의 "01~06" 배경 숫자, GradeCard의 배경 학년명(초등/중등/고등 큰 글씨)은 순수 장식 요소로, 바로 옆에 이미 정상 대비의 실제 제목 텍스트가 있습니다. 스크린리더가 의미 없는 숫자/중복 텍스트를 읽지 않도록 `aria-hidden="true"`를 추가했습니다. 시각적 변경 없음.
- 파일: `src/app/page.tsx`, `src/app/subject/[slug]/page.tsx`, `src/components/GradeCard.tsx`

## 발견했지만 수정하지 않은 문제 (색상 변경이 필요해 보류)

### 색상 대비 부족 — 장식용 배경 숫자/텍스트

위에서 `aria-hidden`으로 스크린리더 노출은 제거했지만, **시각적 색상 대비 자체**는 axe 기준 여전히 미달입니다 (`aria-hidden`은 스크린리더 노출만 막을 뿐 저시력 사용자의 육안 대비 문제는 해결하지 못함).

| 위치 | 전경색 | 배경색 | 실측 대비 | 필요 기준 |
|---|---|---|---|---|
| 홈 WHY 섹션 배경 숫자 (`text-brand-light`) | `#eff6ff` | `#f8fafc` | 1.04 | 3:1 |
| 과목 페이지 편집형 리스트 배경 숫자 | `#eff6ff` | `#ffffff` | 1.08 | 3:1 |
| GradeCard 배경 학년명 (`text-navy/10`) | `#e8eaee` | `#ffffff` | 1.2 | 3:1 |

이 요소들은 "옅은 워터마크" 형태의 **의도된 디자인 장식**이며, 옆에 있는 실제 제목(진한 네이비, 대비 충분)이 동일한 정보를 이미 100% 대체 제공합니다. 대비를 3:1까지 올리려면 브랜드 색상 팔레트(`--color-brand-light`, `text-navy/10`)의 투명도/색상 값 자체를 바꿔야 하는데, 이는 이번 작업 범위에서 금지된 "컬러 변경"에 해당해 임의로 수정하지 않았습니다. 디자인 담당자 판단이 필요합니다.

### 색상 대비 부족 — 옅은 파란 배경 위 회색 본문 텍스트

`text-text-muted`(`#64748b`)가 `bg-brand-light`(`#eff6ff`) 배경 위에 올라간 곳에서 대비 4.37로, 기준 4.5에 근소하게 미달합니다. 발생 위치:

- `ConsultCTA` 컴포넌트의 설명 문구 (거의 모든 서브페이지 하단에 반복 사용)
- 홈페이지 "우리 동네 과외를 찾아보세요" 섹션 설명
- `/consult` 페이지 상단 설명 문구

`text-text-muted`는 사이트 전역에서 수백 곳에 쓰이는 디자인 시스템 색상이라 전역 변경은 대규모 영향(그리고 명시적으로 금지된 "컬러 변경")에 해당합니다. 이 특정 배경(밝은 하늘색) 위에서만 별도 색을 쓰는 것도 결국 새로운 색상 결정이 필요해 임의로 수정하지 않았습니다. 4.5 기준에 0.13 모자란 근소한 미달이라 시각적으로는 읽는 데 큰 무리는 없으나, 정식 WCAG AA 인증이 필요하다면 디자인 검토 후 조정이 필요합니다.

## 그 외 확인 항목 (문제 없음)

| 항목 | 결과 |
|---|---|
| 이미지 alt | 사이트에 `<img>` 사용 없음 (아이콘은 전부 lucide-react SVG, `aria-hidden` 처리 안 되어 있어도 장식 아이콘이 대부분 텍스트와 함께 쓰여 문제 없음) |
| form label 연결 | `/consult` 폼의 모든 입력에 접근 가능한 이름 확인 (`combobox "학생 학년 *"`, `textbox "연락처 *"` 등 — accessibility tree로 실측) |
| button/링크 accessible name | 전수 확인, 이름 없는 버튼/링크 없음 |
| heading hierarchy | 위 3번 항목 수정 후 19개 페이지 전체에서 `heading-order` 위반 0건 |
| keyboard focus | 폼 필드/아코디언/모바일 메뉴 모두 네이티브 `<button>`/`<input>`/`<a>` 사용으로 기본 포커스 가능 (커스텀 tabindex 오남용 없음) |
| accordion 접근성 | `FAQAccordion`이 `aria-expanded` 정상 사용 확인 |
| menu 접근성 | 모바일 메뉴 버튼에 `aria-label`("메뉴 열기"/"메뉴 닫기") 존재 |

## 최종 상태

수정 후 19개 페이지 재검사 결과, 남은 axe violation은 전부 위에서 설명한 **의도적 디자인 색상 2건**(장식용 워터마크, 옅은 배경 위 muted 텍스트)뿐이며, 그 외 카테고리(heading-order, label, name, aria-*, keyboard 등)는 전 페이지 0건입니다.
