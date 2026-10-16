# 의정부 행정동×과목 2단계 파일럿 — 학교알리미 평가계획 (2026-10-16)

대상: 송산2동·흥선동·신곡2동 × 국어·영어·수학 = 9페이지. 기준(quality gate threshold) 변경 없음.

## 데이터
- 학교알리미 공시항목 4-가 '교과별(학년별) 교수·학습 및 평가계획', **2026년 3차(9월) 공시 = 2026학년도 2학기**.
- 대상 동 학교 23곳(초 9·중 8·고 6) 전부 공시 있음. 평가계획 첨부 68개(HWP/HWPX/PDF)를 원문으로 받아 읽음.
  - HWP/HWPX: 직접 텍스트 추출. PDF 10개는 한글 폰트 매핑이 없어 학교알리미 '미리보기' 변환 결과(페이지 좌표 텍스트)로 읽음.
  - 표 열 매칭이 불확실한 값(일부 과제 시기·비율)은 쓰지 않았고, 수행평가 이름은 각 계획서의 '수행평가 세부기준' 영역명으로 확인.
- 학교알리미 ID: 검색 결과의 NEIS 학교코드·주소를 `src/data/schools.ts`와 대조(23/23). 신곡중은 검색 미노출 → 인접 학교 목록에서 찾아 주소로 확인.
- 쓰지 않은 것: 난이도·교육열·학원 수·성적·입시 실적·후기, 교사 이름.

## 구현 (기존 패턴 재사용)
- `src/data/dongSubjectContent.ts` — `schoolSubjectContent.ts`와 같은 published-content 구조(intro/notes/sources).
- `src/lib/dongContent.ts` — 작성 항목이 있으면 생성 문구 대신 사용(`planBased`), 없으면 기존 생성 문구.
- `src/components/region/DongPages.tsx` — planBased 페이지는 제목/설명 "학교별 2학기 ○○ 평가계획", 노트를 본문 한 섹션에 표시.
- `src/data/sources.ts` — `SCHOOLINFO_IDS`에 23개교 추가, 출처는 `schoolInfoPlanSource()`.
- `src/data/qualityNoindex.ts` — GREEN 9개 제외(게이트 RED 집합과 동기화). `scripts/lib/baseline.ts` sitemap 212→221, noindex 2020→2011.

## 결과
| 페이지 | 전(이름 마스킹) | 후(이름 마스킹) | 후(+과목명 마스킹) | 등급 |
|---|---|---|---|---|
| 송산2동 국어 | 82% | 15% | 16% | GREEN |
| 송산2동 영어 | 82% | 20% | 20% | GREEN |
| 송산2동 수학 | 82% | 18% | 19% | GREEN |
| 흥선동 국어 | 76% | 19% | 19% | GREEN |
| 흥선동 영어 | 75% | 19% | 19% | GREEN |
| 흥선동 수학 | 75% | 15% | 15% | GREEN |
| 신곡2동 국어 | 84% | 17% | 17% | GREEN |
| 신곡2동 영어 | 84% | 20% | 20% | GREEN |
| 신곡2동 수학 | 84% | 17% | 17% | GREEN |

region-dong-subject: GREEN 0 / RED 75 → **GREEN 9 / AMBER 0 / RED 66**, indexed RED 0. 동 허브 15개는 변경 없음(RED·noindex).

## 검증
lint · validate:quick · validate:full · build PASS. Routes 2,234 / Sitemap 221 / Noindex 2,011, Broken 0 · Orphan 0 · Metadata 중복 0.
9페이지: 200, robots `index, follow`, canonical 자기참조, sitemap 포함, OG 이미지 200, 출처(학교알리미) 7~8개, 학교 페이지 링크 7~8개.
390/768/1024/1440 × 9 = 36조합 가로 넘침 0, 깨진 이미지 0, 콘솔 에러 0.

## 남은 위험 / 다음
- 평가계획은 학기 단위. **2027년 1차 공시(4월) 때 다시 확인**하지 않으면 사실이 낡음 → 갱신 또는 draft 전환.
- 동 허브(RED)는 그대로라 GREEN 9개로 가는 내부 링크는 의정부 허브·동 허브(noindex)·학교 페이지 쪽. Orphan 0.
- 확대: 나머지 12개 동 × 국·영·수 = 36페이지는 같은 방식으로 가능(학교 47곳 공시 수집 필요). 사회·과학 30페이지도 평가계획에 있음.
