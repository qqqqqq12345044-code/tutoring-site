# 내부링크 구조 전수 최적화 — 출시 전 하드닝

Index 대상 60개 페이지를 기준으로 Header/Footer/MobileMenu(전역 nav)와 각 템플릿의 본문 링크(`RelatedLinks`, `Breadcrumb`, CTA)를 전수 확인했습니다.

## 전역 nav 커버리지 (Header `src/data/nav.ts` + Footer `src/components/layout/Footer.tsx`)

Header: `/regions`, `/schools`, `/grades`, `/subjects`(+ 과목 5개 직접 링크), `/lesson/visit`, `/lesson/online`, `/guide`.
Footer: 위와 동일한 항목 + `/consult`, `/privacy`, `/terms`.

→ 정적 허브 페이지(11개) + 과목 5개는 **모든 페이지에서 1클릭**으로 도달 가능. Footer에 수백 개 링크를 무차별로 넣는 방식은 사용하지 않았고, 이번에도 Footer에 새 링크를 추가하지 않았습니다(요구사항 준수).

## Orphan / 링크 부족 페이지 — 발견 및 수정

| 페이지 | 수정 전 인바운드 링크 | 문제 | 수정 |
|---|---|---|---|
| `school/[schoolSlug]` (2개) | `/schools` 목록 1곳뿐 | 사실상 단일 진입점 | `region/[province]/[city]` 및 district 페이지에서 실제 소속 학교로 링크 추가 → 진입점 2~3곳으로 증가 |
| `guide/[slug]` (5개) | `/guide` 목록에서만 진입, 본문에서 나가는 링크 0개 | "guide → subject/grade" 연결 누락 (과목/학년 페이지에서 guide로 들어오는 링크도 0개, 양방향 모두 없음) | `guide.ts`에 카테고리→학년/과목 매핑 추가 후 guide 기사 하단에 관련 subject/grade(및 방문·화상) 링크, 반대로 subject/grade 페이지 하단에 관련 guide 링크 추가 |
| `not-found.tsx` (사이트에서 나가는 링크는 있지만 "정보 탐색"용 링크가 약함) | 홈/상담 2개뿐 | 사용자가 원하는 걸 못 찾고 홈으로만 튕기는 구조 | 과목/학년/지역/가이드 4개 바로가기 추가 |

## 관련성이 약한 링크 — 발견 및 수정

- `school/[schoolSlug]`: 학교급(초/중/고)과 무관하게 학년 링크 **3개 전부**를 보여줌(중학교인데 초등/고등 링크도 노출) → 해당 학교급에 맞는 학년 **1개만** 링크하도록 수정.

## 반복/중복 링크 패턴 (문제 아님으로 확인)

- `subject/[slug]`↔`grade/[slug]`가 서로를 링크하는 것, `region+subject`가 형제 과목/학년/하위지역을 링크하는 것은 요구사항의 권장 패턴(과목→학년, 학년→과목, 지역→하위지역/과목)과 일치하며 개수도 5~6개 수준으로 "지나치게 많은 링크"에 해당하지 않음. 별도 수정 없음.
- `RelatedLinks` 컴포넌트는 `href`를 key로 사용해 렌더링하므로, 같은 목록 안에서 동일 링크가 중복 렌더링될 구조적 위험은 없음(코드 레벨 확인).

## 신규로 만든 연결 (요구사항의 패턴 목록 대비)

| 요구 패턴 | 적용 여부 | 위치 |
|---|---|---|
| 과목 → 학년 | 기존에 이미 있음 | `subject/[slug]` |
| 과목 → 관련 guide | **신규 추가** | `subject/[slug]` |
| 학년 → 과목 | 기존에 이미 있음 | `grade/[slug]` |
| 학년 → 관련 guide | **신규 추가** | `grade/[slug]` |
| 지역 → 하위지역 | 기존에 이미 있음 | `region/[province]`, `[city]` |
| 지역 → 과목 | 기존에 이미 있음 | 전 지역 템플릿 |
| 지역 → 학교(실제 데이터 존재 시) | **신규 추가** | `region/[province]/[city]`, district 페이지, `region+subject` 페이지 |
| guide → 관련 subject/grade | **신규 추가** | `guide/[slug]` |

## 수정하지 않고 남긴 항목

- `guideCategories`(10개) 중 글이 아직 없는 5개 카테고리(국어/영어/사회/과학/수능 공부법)로는 애초에 연결할 대상 글이 없어 링크를 만들 수 없음 — 콘텐츠 제작(새 글 작성) 판단이 필요해 보류.
- 데이터 부족한 폴백 그룹(region+subject 53개, region+grade 33개, region+grade+subject 165개, region+district+subject 20개)은 noindex 정책 대상이라, 내부링크 그래프 관점에서도 "index 대상 페이지 간 연결"을 다지는 이번 작업 범위에서 의도적으로 제외했습니다. (이 noindex 페이지들도 여전히 자기 자신의 형제 과목/학년/하위지역으로 나가는 링크는 갖고 있어 완전한 dead-end는 아닙니다 — 구조는 기존 그대로 유지.)

## 수정한 파일

`docs/qa/index-content-quality-report.md`의 "수정한 파일" 목록과 동일합니다(내부링크 변경이 콘텐츠 변경과 같은 커밋 단위로 이루어졌습니다).
