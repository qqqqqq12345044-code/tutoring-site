# 전국 학교 import pipeline — 후보 등록과 route 생성 분리 (2026-10-20)

## 왜 분리하는가
- `src/data/schools.ts`에 학교 1곳을 넣으면 `/school/[slug]` + `/school/[slug]/[subject]` 5개가 생기고
  (`generateStaticParams`), 학교가 없던 시군이면 지역 조합 route ~27개(`hasRegionComboRoutes`)와 허브 색인 게이트가 켜진다.
  전국 11,887곳을 그대로 넣으면 route 약 7만 + 조합 수천 개 — 과거 빈 조합 5,562개 문제의 반복.
- 그래서 전국 학교는 **후보 데이터**(`data/official/`, 앱 번들 밖)로만 관리하고, 동 batch에 실제로 쓰는 학교만 등록한다.

## 구조 (`scripts/official/school-import.ts`)
- 입력: `national-school-dongs.json`(매핑 결과) · `school-dongs.json`(등록 190) · `regions.ts` · 학교알리미 manifest · NEIS 캐시.
- `school-candidates.json`: 학교마다 status
  - `registered` 190 · `candidate` 10,440(CONFIRMED + 사이트 도시 안) · `unmapped-region` 1,260(세종 104, 전남광주통합특별시 1,156)
    · `pending` 156 · `excluded` 13 + 학교코드 없는 (가칭)·개교예정 32행(목록 제외).
  - `operating`: 학교알리미 2026년 3차 공시를 실제로 받은 학교만 `disclosed-2026-3`(현재 54), 나머지 `unverified`.
- `school-slugs.json`: NEIS 코드 → slug, append-only. 등록 190곳은 기존 slug 유지, 신규는 로마자(국어의 로마자 표기법, 음절 단위)
  + 학교급, 충돌 시 `-도시`, 그래도 충돌 시 `-코드`. 12,059개 전부 고유.
- dry-run 기본, `--write`로 저장, 저장본과 diff(+/−/변경/slug 변경) 출력. 같은 입력이면 결과 동일(재실행 안전).
- `--dongs`: 동 페이지 없는 행정동을 학교 수·학교급 수·등록 학교·공시 확인·시도 우선순위(서울>경기>인천>광역시)로 점수화.
- `--promote <행정동코드,…> [--write]`: 그 동의 학교를 `src/data/schools.imported.ts`에 등록(append-only).
  - 조건: CONFIRMED, 사이트 도시 안, 학교알리미 2026년 3차 공시 확인, **이미 조합 route가 있는 도시만**.
  - `availableSubjectSlugs: []` → 학교×과목 route 0. 학교 페이지 1개만(콘텐츠 전까지 noindex).
  - `official` 기록(NEIS 코드·교육청 코드·도로명주소·법정동·설립·남녀공학·고교유형·설립일)은 NEIS 캐시에서.
- `--summary`: Routes·Sitemap·Noindex(빌드 없이 route inventory) — promote 전후 delta 확인용.

## 앱 쪽 최소 변경
- `schools.ts`: `schools = [...listedSchools, ...importedSchools]`, `OfficialSchoolRecord.office`(교육청 코드),
  `highSchoolType`에 NEIS 값(자율고·특목고(계열)) 허용.
- `dongContent.ts`: NEIS 출처 링크의 교육청 코드를 학교별 값으로(없으면 J10).
- 이 단계에서 route·sitemap·noindex 변화 0 (2,300 / 368 / 1,930).
