# SEO 전수 감사 및 품질 개선 (2026-10-07)

기준: commit `5f0a49f`(main, clean), Production과 같은 상태에서 시작. **배포·commit·IndexNow send는 하지 않았다.**
수치 출처: `npx tsx scripts/audit-quality.ts --verbose`, `npm run validate:full`, 로컬 production 빌드 크롤(임시 스크립트, 삭제함).

## 1. 전체 현황

| 항목 | 작업 전 | 작업 후 |
|---|---|---|
| Sitemap | 199 | 199 (변화 없음) |
| Noindex | 1,281 | 1,281 (변화 없음) |
| 품질 게이트 GREEN / AMBER / RED | 14 / 53 / 34 | **58 / 9 / 34** |
| 학교×과목 GREEN / AMBER / RED | 0 / 50 / 13 | **42 / 8 / 13** |
| 지역×학년×과목 | 12 / 3 / 19 | 14 / 1 / 19 |
| 지역×과목 | 2 / 0 / 2 | 2 / 0 / 2 |
| noindex 39개(RED 34 + 학교×과목 보류 5) | noindex | **변경 없음** (RED 동기화 PASS, 보류 목록 PASS) |

## 2. 핵심 발견 — 학교별·과목별 공식 자료

이전 분석(`school-subject-amber-analysis-2026-10-06.md`)의 결론은 "학교×과목이 GREEN이 되려면 과목과 연결된 학교별 공개자료가 필요하다"였다.
이번에 그 자료를 찾았다.

- **학교알리미 공시항목 4-가 '교과별(학년별) 교수ㆍ학습 및 평가계획에 관한 사항'** — 2026년 3차(9월) 공시, 2026학년도 2학기 계획.
- 학교마다 과목·학년별로 정기시험 횟수와 반영비율, 수행평가 과제명과 비율, 서·논술형 비중, 시험 시기(일부는 단원 범위)를 공개한다.
- 원문(HWP·HWPX·PDF, 일부 zip)을 학교알리미에서 직접 내려받아 텍스트로 확인했다(38개교, 파일 362개). 검색 요약은 쓰지 않았다.
- 출처 URL은 학교알리미 학교 페이지(`Pneiss_b01_s0.do?SHL_IDF_CD=…`)이며, 37개 모두 HTTP 200·제목에 해당 학교명이 나오는 것을 확인했다.
- 교사 이름 등 개인정보는 쓰지 않았다. 시기·범위는 계획서 기준이며 "교과협의회에서 변경될 수 있다"는 단서가 있는 경우 그 문구도 함께 적었다.

부수 확인(NEIS 시간표 API): 키 없이 하루 1~5교시만 조회돼 과목 편성을 확정하기 어려워 사용하지 않았다.

## 3. 학교×과목 45개(색인) 결과

| 분류 | 개수 | 페이지 |
|---|---|---|
| 공시 평가계획으로 재작성 → GREEN | 41 | 아래 목록 |
| 재작성했으나 AMBER(32%) | 2 | 연수고 수학 ↔ 부평고 수학 (서로가 최근접. 추가 사실을 보강했지만 1학년 문장 구성이 비슷해 32%. 숫자를 낮추기 위한 문장 재배열은 하지 않음) |
| 미편집 → GREEN(이웃 변화로 유사도 하락) | 1 | 인천고 영어 (학교알리미 검색에서 학교가 나오지 않아 공시 미확보, 기존 NEIS 사실 그대로) |
| 보류(AMBER 유지) | 1 | 언남중 영어 — 2026 3차 공시 파일이지만 문서 내부 표기가 '2025년도 2학기'라 연도를 확정할 수 없어 사용하지 않음 |

GREEN 41(재작성): 대치중 영어·수학, 목동중 수학·영어, 세화고 영어, 가락중 수학·영어, 가락고 영어, 양천고 수학, 마포중 영어·수학, 영통중 수학,
신갈고 수학, 안양외고 수학, 부천중 영어·수학, 중동고 수학, 잠실고 수학, 신서중 수학, 성산중 수학, 죽전고 수학, 평촌고 수학, 서울대치초 수학·국어,
현대고 영어, 문정중 영어, 신목고 영어, 숭문고 영어, 서울반포초 영어, 인천숭의초 국어, 관교중 수학, 인천송도초 수학, 인천구월초 영어, 부평중 영어,
계산고 영어, 강화초 수학, 강화고 국어, 세화여중 영어, 서현중 수학, 고양국제고 수학, 반포중 수학(아래 주의).

각 페이지에 추가한 내용(예):
- 학년별 정기시험 횟수·비중(예: "3학년 2학기는 기말고사 한 번이 60%"), 수행평가 과제명과 비율, 서·논술형 합계.
- 그 사실이 과외 준비에 갖는 의미(시험 대비 vs 말하기·글쓰기 과제 준비 비중).
- 같은 학교의 두 과목 페이지는 서로 다른 사실을 쓰도록 나눴다(학교 공통 NEIS 사실은 한 페이지에만).
- 기존 "지역별 과외 페이지에서 확인" 안내 문장과 학교급 일반 조언은 모두 제거했다.

### ⚠ 반포중학교 (P0, 사용자 결정 필요)
- 학교알리미에서 **'휴교'** 로 표시되고, 4-가 공시의 최신 자료가 **2023년 3차**다. 언론(한국일보 2022) 보도도 재건축에 따른 휴교다.
- 기존 페이지는 운영 중인 학교처럼 "재학 학년과 최근 시험 범위를 확인한 뒤 상담"이라고 썼다 → **사실 오류라 정정**했다(휴교 표시, 2023학년도가 마지막 공시라는 사실 + 출처).
- 게이트 숫자상 GREEN이지만, 휴교 학교의 과외 페이지는 검색 의도가 거의 없다. **noindex 또는 페이지 정리 여부를 사용자가 결정**해야 한다(이번 작업 금지 사항이라 적용하지 않음).
- 같은 오류가 남은 곳(이번에 수정하지 않음): `/school/banpo-middle-school` 학교 페이지 문구("반포중학교처럼 … 다니는 학생"), GREEN `/region/seoul/seocho/middle/english`의 학교 목록.
- 참고: 서울반포초는 NEIS 학급정보상 2025년 기록이 없고 2026년 22학급이 있어 재개교한 것으로 보인다(페이지는 2026학년도 평가계획 기준으로 작성).

## 4. 남은 AMBER (색인 4 + 보류 5)

| 페이지 | 상태 | 이유·다음 |
|---|---|---|
| `/school/yeonsu-high-school/math`, `/school/bupyeong-high-school/math` | 32% | 서로 최근접. 다음 공시 때 과목별 차이를 더 쓰거나 한쪽 1학년 문단을 다른 사실로 교체 |
| `/school/eonnam-middle-school/english` | 47%, 출처 없음 | 공시 문서 연도 표기 불일치(2025). 학교에 확인되면 재작성 |
| `/region/gyeonggi/seongnam/middle/math` | 41%, 출처 없음 | 이매중·판교중 공시 수집 중 학교알리미 검색이 응답하지 않아 중단. 세 학교 비교 note로 개선 가능 |
| 학교×과목 보류 5개 | noindex 유지 | 변경 금지 대상 |

지역×학년×과목 STEP 5 대상 3개:
- 안양 고등 영어: 안양외고(30:70)·평촌고(60:40, 단편소설 탐색·서평) 비교 note 추가 → **GREEN 23%**.
- 수원 고등 수학: 편집하지 않았지만 최근접 이웃(안양 고등 영어)이 바뀌어 **GREEN**으로 집계됨. 수원 고교 4곳 공시는 미수집.
- 성남 중등 수학: 위 표와 같이 AMBER 유지.

### 추가 noindex 후보 (적용하지 않음, 기록만)
1. `/school/banpo-middle-school/math` — 휴교(위 P0).
2. `/school/eonnam-middle-school/english` — 출처 없는 일반 조언형, 47%.
3. `/region/gyeonggi/seongnam/middle/math` — 출처 없음, 안내 링크성 note.

## 5. 전체 index 페이지 감사 (STEP 6)

| 유형 | 결과 |
|---|---|
| 지역×과목 / 지역×학년×과목 / 학교×과목 | 위 게이트 결과. 색인된 RED 0 |
| 과목·학년·학년 하위·과목 주제·guide·program·지역 허브 | 기존 validator 전부 PASS (guide 최소 1,007자, guide 쌍 유사도 최대 9%, 문단 중복 최대 32%) |
| 검색 의도 | 학교×과목은 "○○학교 ○○과외" 의도에 맞춰 학교의 실제 평가 방식(무엇을 준비해야 하는지)을 주 정보로 바꿈 |

분류: 실제 콘텐츠 개선 44(학교×과목 43 + 안양 고등 영어 1), 출처 추가 44, 내부링크 개선 0(필요 없음), 개선 불가 2(인천고·언남중 자료 부족).

## 6. 출처 감사 (STEP 7)

- 형식 검사(`Content sources`): https·라벨·중복 PASS.
- 신규 학교알리미 출처 37개: 모두 실제 요청으로 200 + 학교명 일치 확인.
- 기존 NEIS 출처: 이전 감사(2026-10-06)에서 1건 반환 확인. 이번에는 반포중 1건 재조회(정상).
- 비공식 출처(위키백과 등): 학교×과목·지역 페이지 출처 목록에 없음.
- 한계: 학교알리미 페이지는 학교 페이지로 연결되며, 평가계획은 페이지 안 공시항목에서 선택해야 보인다(라벨에 항목명을 적음). 2027년 1차 공시 후 내용이 바뀐다 → **학기마다 재확인 필요**.

## 7. 내부링크 감사 (STEP 8)

- orphan index 0, 깨진 링크 0, index→noindex 링크 비율 17.9%(정보, 변화 없음).
- index→noindex 비중이 큰 곳: `/schools`(121개 중 72개가 noindex 학교 페이지), 수원·성남·고양·부천 허브. 목록 페이지 특성상 유지.
- 본문 inbound가 1개 이하인 색인 페이지 7개: `/schools`, `/terms`(전역 nav에서 연결), 수원 장안구·권선구, 강남 코딩·서초 한국어·송파 검정고시 지역 프로그램. orphan은 아니며 이번에 수정하지 않음.
- 학교 → 학교×과목, 과목 → 지역 링크는 index-aware helper(`src/lib/internalLinks.ts`)가 처리하며 이번 변경으로 index 대상이 바뀌지 않아 구조 변화 없음.

## 8. SEO 구조 감사 (STEP 9) — 로컬 production 빌드 전수 크롤 1,480페이지

| 검사 | 결과 |
|---|---|
| canonical = 자기 URL | 1,480 / 1,480 |
| robots noindex ↔ sitemap 불일치 | 0 |
| sitemap에 noindex URL | 0 |
| RSS(38개)에 noindex URL | 0 |
| og:url = canonical, og:image 존재 | 전 페이지 |
| BreadcrumbList | 홈 제외 전 페이지, 마지막 항목 = 자기 URL, 상위 항목 모두 실제 route (학교 페이지는 지역 계층을 거치는 설계) |
| h1 개수 1 | 전 페이지 |
| 중복 title/description(색인) | 0 |
| lastmod | 내용이 바뀐 44개만 2026-10-07로 갱신, 나머지 유지 |
| robots.txt | `/api/` 차단, sitemap 안내 — 이상 없음 |

## 9. OG / 썸네일 (STEP 10)

`public/`의 이미지는 여전히 `og-default.png`(1200×630)와 로고·파비콘뿐이다. 모든 페이지가 기본 이미지를 쓰고, 존재하지 않는 이미지 경로는 없다.
카테고리 이미지가 없으므로 코드는 바꾸지 않았다. 필요한 16장 목록과 적용 패치안은 `og-thumbnail-plan-2026-10-06.md` 그대로 유효하다.

## 10. Quality Gate 검토 (STEP 11) — validator 미변경

| 관찰 | 영향 | 제안(미적용) |
|---|---|---|
| 학교 상태(휴교·폐교)를 보지 않음 | 휴교 학교 페이지가 GREEN 가능(반포중) | 학교 데이터에 운영 상태 필드를 두고 구조적 RED/AMBER 조건 추가 — 데이터 확인·정책 결정 필요 |
| 출처는 개수만 셈 | 관련 없는 출처 1개로도 조건 충족 | 출처 유형(공시·NEIS 등)과 note 연결을 검사하는 방식 검토 |
| 유사도는 같은 종류 안에서만 비교 | 지역 페이지와 학교 페이지가 같은 사실을 반복해도 잡히지 않음 | 교차 종류 비교는 오탐 가능성이 커 정책 결정 후 |
| 안내 링크성 note 정규식 | 이번 데이터에서 오판 없음 | 유지 |

기준을 느슨하게 하는 수정은 하지 않았다. 실제 개선이 확실한 수정이 아니어서 validator는 그대로 두었다.

## 11. 실제 수정 사항

| 파일 | 내용 |
|---|---|
| `src/data/sources.ts` | 학교알리미 학교 ID 37개 레지스트리, `schoolInfoPlanSource()`·`schoolInfoPageSource()` 추가 (NEIS 헬퍼와 같은 패턴) |
| `src/data/schoolSubjectContent.ts` | 색인 학교×과목 43개 재작성(공시 평가계획 사실 + 의미 + 출처), 반포중 휴교 정정 |
| `src/data/regionGradeSubjectContent.ts` | 안양 고등 영어에 학교별 평가 비교 note와 출처 2개 추가 |
| `src/data/contentDates.ts` | 바뀐 44개 경로 lastmod 2026-10-07 |

라우트·indexability·noindex 목록·상담 시스템·env·Apps Script는 건드리지 않았다.

## 12. Validation

lint PASS · typecheck PASS · build PASS · validate:quick PASS · validate:full PASS(Routes 1482, Sitemap 199, Noindex 1281, Broken 0, Metadata dup 0, Orphans 0, Search·Consult smoke PASS)
· Quality gate RED sync PASS · 보류 목록 PASS · 대표 페이지 렌더링(학교×과목 3, 지역 1: 200·index·참고 자료 표시) · 390px 모바일 가로 넘침 없음 · IndexNow `prepare`: changed 44(전송 안 함).

## 13-A. 후속 세션 (2026-10-07 오후, 세션 중단 후 재개)

시작 상태: 중단된 세션은 baseline diff 저장 후 파일 수정 없이 종료(현재 diff와 동일 확인). 위 §1~§12는 반복하지 않고 재사용.

### 한눈에 보기

| 항목 | 이 세션 전 | 이 세션 후 |
|---|---|---|
| 게이트 GREEN / AMBER / RED | 58 / 9 / 34 | **65 / 2 / 34** |
| 학교×과목 | 42 / 8 / 13 | 48 / 2 / 13 |
| 지역×학년×과목 | 14 / 1 / 19 | 15 / 0 / 19 |
| Sitemap / Noindex | 199 / 1,281 | 199 / 1,281 (변화 없음 — 색인 정책 미변경) |
| sitemap lastmod 2026-10-07 | 44 | 46 |
| IndexNow prepare | changed 44 | changed 46 / added 0 / removed 0 (전송 안 함, 키 미설정 NOT READY) |

### 실제 수정 (공식 출처 확보 + 내용 개선인 경우만)

| 페이지 | 색인 | 전→후 | 근거 |
|---|---|---|---|
| `/school/eonnam-middle-school/english` | index | AMBER 47% → GREEN 22% | 학교알리미 4-가(2026-3). 영어 표지만 '2025년도'(체육도 동일)지만 2학년 성취기준이 2022 개정 코드·문구([9영01]/[9영02], "담화나 글"), 3학년이 2015 개정 코드([9영03]/[9영04]) → 2026학년도 편성에서만 성립. 문서 내부 주차가 서로 다른 값(듣기평가 10월 2주/3주 등)은 쓰지 않음 |
| `/region/gyeonggi/seongnam/middle/math` | index | AMBER 41% → GREEN 14% | 서현·이매·판교중 공시 수학 평가계획 비교(1학년 시험 1회 50% vs 2회 70%, 2·3학년 60:40 vs 70:30). 안내 링크성 note 제거 |
| `/school/seongnam-middle-school/english` (서현중) | **noindex 보류 유지** | AMBER → GREEN 27% | 학년별 평가계획 PDF 3개 |
| `/school/yeongtong-middle-school/english` | **noindex 보류 유지** | AMBER → GREEN 21% | 교과교육과정 PDF(논술형 합 45% 확인) |
| `/school/gangnam-high-school/math` (개포고) | **noindex 보류 유지** | AMBER → GREEN 22% | 학년별 전과목 평가계획(3학년 미적분 2학기 수행 0%) |
| `/school/namdong-high-school/social` | **noindex 보류 유지** | AMBER → GREEN 18% | 사회교과 평가 운영 계획 |
| `/school/bupyeong-elementary-school/science` (갈산초) | **noindex 보류 유지** | AMBER → GREEN 21% | 3~6학년 평가운영계획 HWP |

- `sources.ts` 학교알리미 ID 6개 추가: 언남중·이매중·판교중·개포고·인천남동고·인천갈산초. 각 ID는 학교 페이지 제목의 학교명 + 인근 학교 목록(분당/강남/남동/부평)으로 확인. 판교중 동명 학교(충남 서천, `d369ab1d…`)는 제외.
- 보류 5개는 내용만 개선했고 `schoolSubjectNoindex.ts`는 건드리지 않음 → **noindex 해제는 사용자 결정**.

### 개선하지 않은 것 (조사만)

- **연수고·부평고 수학 (AMBER 32%, 색인)**: 둘 다 이미 공시 사실 3개 note. 유사도는 공통 교육과정 과목명(공통수학2·미적분Ⅰ·인공지능 수학)과 공시 양식에서 생김 → 숫자를 낮추기 위한 문장 수정 안 함. 실질 품질 문제 없음.
- **인천고(영어 GREEN)**: 학교알리미 검색(cp949 폼) 결과에 동인천고·서인천고만 나오고 인천고는 없음. 공시 미확보 상태 유지.
- 참고: 학교알리미 검색은 `SEARCH_KEYWORD`·`SEARCH_SCHUL_NM`를 **cp949**로 인코딩하고 `SEARCH_MODE=9` 등 헤더 폼 전체 필드를 보내야 결과가 나온다(이전 세션의 "검색 무응답" 원인).

### 반포중 휴교 영향 분석 (적용 안 함, 사용자 결정)

| 노출 지점 | 색인 | 현재 문제 |
|---|---|---|
| `/school/banpo-middle-school` | index | `schoolContent.ts` 문구 "반포중학교처럼 … 중학교에 다니는 학생" — 운영 중인 학교처럼 읽힘 |
| `/school/banpo-middle-school/math` | index, GREEN | 휴교 사실로 정정됨(1차). 검색 의도는 거의 없음 |
| `/region/seoul/seocho/middle/english` | index, GREEN | 서초 중학교 3곳 비교에 반포중 포함(설립·주소 사실은 맞지만 휴교 언급 없음) |
| 색인 페이지의 반포중 링크 | — | `/schools`, `/region/seoul/seocho`(학교·수학 2개), `/region/seoul/seocho/program/korean-language`, 반포중 학교·수학 페이지 상호 링크 |

선택지(권장 순):
1. **학교 페이지 + 수학 페이지 noindex, 데이터 유지(권장)** — sitemap 199 → 197. 학교×과목은 `schoolSubjectNoindex.ts`에 추가하면 되지만, **학교 페이지 자체를 noindex하는 목록은 현재 없음** → `indexability.ts` 학교 분기에 새 목록이 필요(코드 변경). 서초 중등 영어 문장에 "2026년 현재 휴교" 추가 필요(→ 그 페이지 lastmod 변경).
2. 유지 + 학교 페이지 문구만 휴교로 정정 — 변경 최소, 검색 의도 없는 페이지가 색인에 남음.
3. `schools.ts`에서 반포중 제거 — 라우트 404/서초 학교 수·지역 문장 연쇄 변경. 비권장.

### 감사 결과 (재검증)

- 내부링크: orphan 0, 깨진 링크 0, index→noindex 490/2,733(17.9%, 정보) — 1차와 동일.
- 로컬 production 전수 크롤 1,480페이지: canonical 자기 URL 1,480/1,480, og:image 전 페이지, robots↔sitemap 불일치 0, sitemap·RSS(38)에 noindex 0, 색인 중복 title 0, h1 이상 0. breadcrumb "조상 아님" 3,690건은 `/subjects`·`/grades` 허브와 학교→지역 계층 설계에 따른 것(정상).
- OG: og:image = `/assets/brand/og-default.png`(1200×630), 로컬·운영 모두 200. 카테고리 이미지 없음 — `og-thumbnail-plan-2026-10-06.md` 그대로 유효.
- 변경 페이지 7개: 200, h1 1개, '참고 자료' 표시, index 2 / noindex 5 의도대로. 390px 가로 넘침 없음.

### Quality Gate 구조 감사 (validator 미변경, 제안만)

§10의 4개 관찰에 더해:
1. **보류 목록이 GREEN이 돼도 신호가 없음** — `checkSchoolSubjectNoindexHolds`는 GREEN 보류도 PASS. 현재 보류 5개 전부 GREEN → "GREEN 보류: 해제 검토" 정보 출력 추가 제안.
2. **사실의 유효기간 검사 없음** — 학교×과목 48개 중 다수가 "2026학년도 2학기" 공시 기반. 2027년 1차 공시(4월) 후 자동으로 낡지만 게이트는 모름 → `asOf`(학기) 필드 + 만료 경고 제안.
3. **일반 조언형 note도 '실질 note'로 셈** — 포인터 정규식만 거르므로, 일반 조언 2개 + 무관 출처 1개 + 낮은 유사도면 GREEN 가능(현재 데이터에서 실제 사례는 없음).
4. **고교 수학처럼 국가 교육과정 과목명이 겹치는 페이지는 30% 경계에 몰림** (연수고·부평고). 마스킹 대상에 과목명을 넣으면 완화되지만 기준 완화이므로 정책 결정 후.

### Validation (이 세션)

lint PASS · typecheck PASS · validate:quick PASS · build PASS · validate:full PASS (Routes 1482 / Sitemap 199 / Noindex 1281 / Broken 0 / Metadata dup 0 / Orphans 0 / Search·Consult smoke PASS) · RED sync PASS · 보류 목록 PASS · 모바일 390px PASS · diff 민감정보 0 · 저장소 내 임시 파일 0(임시 감사 스크립트 삭제).

### commit 가능한 변경

`src/data/{sources,schoolSubjectContent,regionGradeSubjectContent,contentDates}.ts` + 이 문서. 1차(오전) 변경과 이번 후속 변경이 같은 파일에 섞여 있음 — 한 커밋으로 묶거나, 원하면 오전/오후로 나눌 수 있음(오전 baseline: 이전 세션 scratchpad `baseline-session2.diff`).

## 13-B. indexability 최종 정리 (승인 후 적용, 2026-10-07)

| 변경 | 내용 |
|---|---|
| 보류 5개 해제 | 서현중 영어·영통중 영어·개포고 수학·인천남동고 사회·인천갈산초 과학을 `schoolSubjectNoindex.ts`에서 제거 → index + sitemap (+5) |
| 반포중 수학 | `schoolSubjectNoindex.ts`에 추가 (GREEN이지만 휴교) → noindex (−1) |
| 반포중 학교 페이지 | 신규 `src/data/schoolNoindex.ts` + `indexability.ts` "school" 분기. 학교 단위 보류 목록이 없어 새로 둠 (−1) |
| 유지 | route·canonical·본문 그대로(HTTP 200), robots만 noindex, sitemap 제외. Quality Gate 기준·AMBER 2개(연수고·부평고 수학) 미변경 |

- 결과: **Sitemap 199 → 202, Noindex 1,281 → 1,278** (계산값과 일치). `baseline.ts`와 `checkSchoolGate`(보류 목록 반영·미등록 slug 검사) 갱신.
- 반포중 본문의 "운영 중인 학교처럼 읽히는 문구"(`schoolContent.ts`, 서초 중등 영어 학교 목록)는 이번에 **고치지 않음** — 본문 유지 지시. 페이지가 noindex이므로 색인 영향은 없고, 서초 중등 영어(색인)의 반포중 설명은 설립·주소 사실이라 틀리지 않으나 휴교 언급이 없음.
- 반포중 학교 페이지로 가는 링크(`/schools`, `/region/seoul/seocho` 등)는 학교 목록용이라 index-aware helper 대상이 아니어서 남아 있음(다른 noindex 학교 72곳과 같은 구조).
- validate:full 첫 실행의 Consult API smoke FAIL은 코드 문제가 아니라 직전 크롤용으로 띄운 `next start`가 3100 포트를 점유한 탓(해당 프로세스 종료 후 PASS). 상담 시스템 변경 없음.
- IndexNow prepare: added 5 / removed 2 / changed 45 — 전송 안 함(키 미설정, NOT READY).

## 13. 다음 작업

1. **반포중 처리 결정**(§13-A 선택지 1~3) — 사용자 결정.
2. **보류 5개(전부 GREEN) noindex 해제 여부** — 해제 시 sitemap +5, `schoolSubjectNoindex.ts`에서 제거 — 사용자 결정.
3. 2027년 1차 공시(4월) 후 학교×과목 사실 재확인(이제 49개) — 학교알리미 ID는 `sources.ts`에 있음.
4. 수원 고교 4곳, 관양고 공시 수집 후 지역 페이지 비교 note. (성남 중등 수학·언남중 영어는 완료)
5. Quality Gate 제안(§10, §13-A) 적용 여부 결정.
6. commit/배포는 사용자 요청 시. 배포 직전 `indexnow.ts prepare` 재실행.
