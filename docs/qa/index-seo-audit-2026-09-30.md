# Index 페이지 240개 SEO 심층 감사 (2026-09-30)

대상: sitemap에 포함된 index 페이지 240개 전체 (HEAD `36d8d27` 빌드를 로컬 `next start`로 실제 크롤링).
Routes 1453 / Sitemap 240 / Noindex 1211 구조는 변경하지 않았고, 이 감사로 index/noindex를 자동 전환하지 않았습니다.

## 방법

1. 240개 URL의 실제 HTML에서 title/description/canonical/robots/og/twitter/H1/JSON-LD/본문을 추출.
2. 전체 페이지의 40% 이상에 공통으로 나오는 줄(헤더·푸터·공통 CTA)을 제거한 **본문만** 비교.
3. 같은 유형끼리 최근접 유사도: 본문 토큰 Jaccard, 이때 **페이지 자신의 H1/제목 단어(지역·학교명)를 가림** — "이름만 바꾼 같은 문서"가 높은 값으로 드러나도록.
4. 수치는 후보 선별용일 뿐, 후보 페이지는 본문을 직접 읽고 판정(유사도 %만으로 판정하지 않음).
5. 유형 간 카니발리제이션: 제목 핵심어 겹침 + 내부 링크 관계 확인.

## 메타데이터 결과 — 이상 없음

- canonical: 240개 모두 non-www 자기 자신. robots: 240개 모두 index. H1: 모두 1개. og:image / twitter:card: 전부 있음.
- title/description 중복 0 (validate:full의 Metadata duplicates 0과 일치).
- 템플릿 누수(`undefined`/`null`/`${`) 0.
- 참고: description이 50자 미만인 페이지 17개(허브 5, `/consult`, 가이드 4, 학교 7). 잘못된 것은 아니며 우선순위 낮음.
- 참고: 본문 추출 중 `수원 팔달구 에서`처럼 보인 공백은 React SSR의 텍스트 노드 구분자(`<!-- -->`)로 인한 추출 오탐 — 실제 렌더링은 `팔달구에서`. 수정 대상 아님.

## 분류 요약

| 분류 | 개수 |
|---|---|
| KEEP | 151 |
| IMPROVE | 70 |
| NOINDEX REVIEW | 19 |

## KEEP (151)

| 유형 | 개수 | 근거 |
|---|---|---|
| 홈 / 정적 허브·약관·상담 | 9 | 목적 분명, 중복 없음 |
| subject | 5 | 과목별 topics·학년 전략·FAQ가 실제로 다름 (최근접 0.46 이하) |
| subject-topic | 17 | 고유 본문 비율 72%+ , 최근접 0.37 이하 |
| grade / sub-grade | 12 | 고유 비율 76%+ , 최근접 0.30 이하 |
| program | 3 | 프로그램별 본문 상이 |
| region province (서울·경기·인천) | 3 | 하위 구·시 허브 역할, 실제 하위 데이터 존재 |
| region city (학교 데이터 있는 곳) | 18 | 실제 등록 학교 수·목록 기반 문장, 지역별 학교 링크 |
| region-grade-subject (학년 playbook 있음) | 16 | 중등 수학/영어·고등 수학: 학년별 포인트 + 실제 학교 연결 |
| region-program | 5 | 프로그램×지역 본문 + 해당 지역 실제 학교 링크 (송파·수원 검정고시 쌍 0.61로 가장 비슷하나 지역 학교 링크가 달라 유지) |
| school-subject | 63 | 학교명+과목 검색 의도 명확, 과목별 체크리스트·지역 페이지 역링크. 최근접 0.60~0.70이지만 학교가 실제로 다르고 검색어가 학교명 단위라 중복 문서로 보지 않음 |

## IMPROVE (70) — 유지하되 콘텐츠 보강 권장

| 그룹 | 개수 | 문제 | 권장 보강 (사실 확인 가능한 범위) |
|---|---|---|---|
| school (`/school/*`) | 48 | 본문이 "지역·학교급·가능 과목 + 학교급 팁 1문장 + 공통 FAQ" 템플릿. 최근접 0.60~0.72 | 해당 학교의 school-subject 페이지·같은 구 다른 학교로의 링크 구성 강화. 학교별 사실(학사일정·교육과정 편성)은 공개자료 확인 후에만 추가 |
| region-grade-subject, 학년 playbook 없는 조합 | 12 | `gradeSubjectPlaybook.ts`가 중등 수학·영어, 고등 수학 3개 조합만 있어 나머지는 "학년별 학습 포인트" 섹션이 통째로 빠짐. 예: 남동구 중등 국어 ↔ 남동구 고등 사회 0.80 | playbook에 해당 학년×과목(중등 국어·사회·과학, 고등 영어·국어·사회, 초등 수학) 추가 — 교육과정 일반론이라 지역 사실 추측 불필요 |
| 수원 구 페이지 (영통·팔달·장안·권선) | 4 | 본문 한 문장 + 과목 링크 + 관련 학교 3개. 서로 0.81 | 구별 등록 학교 수/목록 문장(도시 페이지와 같은 `regionIntro` 패턴) 적용 |
| 수원 수학/영어 (region-subject) | 2 | 일반론 + 지역명. `/region/gyeonggi/suwon/middle/math`, `/high/math`와 제목 핵심어 67% 겹침(카니발리제이션 후보) | 상위(지역+과목) → 하위(지역+학년+과목) 링크를 본문 상단에 명시해 역할 분리. URL 변경 불필요 |
| guide 글 | 4 | 본문 3문장(약 280자) | 글당 실제 학습 방법 단락 보강 |

IMPROVE 목록 상세: `school` 48개 전체, region-grade-subject 12개 —
`/region/seoul/mapo/high/english`, `/region/seoul/gangseo/elementary/math`, `/region/seoul/gangseo/high/korean`,
`/region/gyeonggi/yongin/high/english`, `/region/gyeonggi/anyang/high/english`, `/region/incheon/michuhol/high/english`,
`/region/incheon/namdong/middle/korean`, `/region/incheon/namdong/high/social`, `/region/incheon/gyeyang/middle/social`,
`/region/incheon/gyeyang/high/english`, `/region/incheon/ganghwa/middle/science`, `/region/incheon/ganghwa/high/korean`.

## NOINDEX REVIEW (19) — 자동 전환하지 않음, 사용자 판단 필요

| 페이지 | 이유 |
|---|---|
| `/region/{busan,daegu,daejeon,gwangju,ulsan,sejong,gangwon,chungbuk,chungnam,jeonbuk,jeonnam,gyeongbuk,gyeongnam,jeju}` (14) | 하위 지역·학교 데이터가 없어 본문이 "OO 지역에서 과외를 찾고 있다면…" 1문장 + noindex 페이지(지역+학년/과목)로 가는 링크뿐. 지역명 가림 후 14개가 **서로 100% 동일**. 링크 대상도 전부 noindex |
| `/region/incheon/{ongjin,jemulpo,yeongjong,geomdan,seohae}` (5) | "학교별 상세 정보는 순차적으로 등록" + 공통 수업 예시. 서로 98% 동일 |

판단 기준: 해당 지역에서 실제로 수업(방문 또는 화상)을 받을 수 있고 곧 학교 데이터를 넣을 계획이면 유지, 아니면
`src/lib/indexability.ts`의 `"region"` 분기에 "하위 지역 또는 등록 학교가 있는 지역만 index" 조건을 추가하는 방식이 최소 변경입니다.
전환 시 Sitemap 240 → 221, Noindex 1211 → 1230 (Routes 1453 불변)이며 `scripts/lib/baseline.ts`도 함께 갱신해야 합니다.

## 카니발리제이션 점검

- subject ↔ school-subject (예: "영어과외" ↔ "대치중학교 영어과외"): 검색어 단위가 달라(일반 vs 학교명) 문제 아님.
- region-subject ↔ region-grade-subject (수원): 위 IMPROVE 항목. 유일하게 실제로 의도가 겹치는 쌍.
- region city ↔ region-grade-subject: 계층 관계이고 상호 링크 있음. 문제 없음.
- school ↔ school-subject: 계층 관계, 상호 링크 있음.
- 학교 slug와 학교명 불일치(예: `/school/gangnam-middle-school` → 대치중학교)는 "지역-학교급" 기반 slug 설계로 보이며 URL 구조 변경 금지 원칙에 따라 유지.

## 데이터 정확성

- 새 사실 데이터(순위·합격률·경쟁률 등)를 추가하지 않았습니다.
- 인천 제물포구·영종구·검단구·서해구는 2026-07-01 인천 행정체제 개편(중구·동구·서구 재편)과 일치하는 구성으로 보이며, 오류로 판단하지 않았습니다.
