# 전국 행정동 22차 batch — 신사동(강남)·계산4동(인천 계양)·연수3동(인천 연수) (2026-10-27)

# Baseline
- 시작: work = origin/work = `f20922f`, main = origin/main = Production = `ba6e908`(21차), working tree clean, 다른 세션 변경 없음.
- Routes 2827 / Sitemap 656 / Noindex 2169, region-dong GREEN 74/74, region-dong-subject GREEN 370/370, indexed RED 0.

# Candidate review
| 동 | 학교(수집) | 중학교 | 고교 1학년 | 초등 6학년 | 판단 |
|---|---:|---|---|---|---|
| 신사동(강남, 1168051000) | 3 | 신사중: "학년별 연간 평가 운영 계획"에 학년별 **2학기 표가 따로** 있음(1학기 표는 미사용) | 현대고(기등록) PDF | 서울신구초 hwp | **선정** |
| 계산4동(계양) | 7 | 계산중(기등록): zip → 학년×교과별 hwp | 계양고: zip → 과목별 hwp | 길주초·부현동초·신대초 hwp | **선정** |
| 연수3동(연수) | 4(+인천중 NOTFOUND) | 연수중(기등록): 교과별 hwp | 인천여고: zip → 과목별 hwp | 인천연수초·인천중앙초 hwp | **선정** |
| 송도3동(연수) | 6 | 박문중: zip → 교과별 hwp(능허대중 PDF) | 박문여고 PDF | 송원초·첨단초 hwp | 23차 후보 |
- 21차에서 "zip 형식 미확인"으로 미뤘던 인천 동은 zip 안이 모두 과목별 HWP로 확인됐다.

# Route compatibility
- 세 구(`gangnam`·`gyeyang`·`yeonsu`) 모두 기존 city route와 운영 중인 동이 있다. 기존 시·도 → 구 → 행정동 패턴 그대로, 새 route 체계·URL 이전 없음.
- 법정동(NEIS 주소): 신사동 = 신사동·압구정동(신사중·현대고는 압구정동), 계산4동 = 계산동·용종동, 연수3동 = 연수동.

# Selected content
- **신사동**: 신사중 1~3학년(연간 계획의 2학기 표), 서울신구초 6학년.
- **계산4동**: 계산중 1~3학년, 계양고 1학년 공통과목 7개, 인천길주초 6학년(요약표에 단원·방법·시기가 한 표로, 과목별 행 수가 상세표와 일치).
- **연수3동**: 연수중 1~3학년, 인천여고 1학년 공통과목 7개, 인천연수초·인천중앙초 6학년(중앙초는 전 학년 통합본의 6학년 구획만).

# School mapping
- `--promote 1168051000,2824561400,2818576300` → 신규 11교, skip 1(인천중: 학교알리미 공시 미확인 → 등록 안 함).
- 기등록 현대고(`hyundai-high-school`)·계산중(`gyeyang-middle-school`)·연수중(`yeonsu-middle-school`)은 `school-dongs.json` resolved 매핑대로 `schools.ts`에 `dongSlug`만 연결(slug·URL·색인 상태 불변, inventory 플래그 변경 0).
- candidates 전체 `--write` 미사용. NEIS 단건 캐시 `.cache/official/neis/national-22.json`(11교).

# Excluded inconsistencies
- **신사중**: 1학기 표 전부 미사용. 2학기 교수학습 운영 계획(주차별)은 비율이 없어 인용하지 않음.
- **서울신구초 영어 전체**: 단원 번호 '9'가 두 행에 겹치고 'Hanok' 단원의 평가 요소가 '교통 수단'으로 단원과 불일치 → 영어 페이지는 신사중만. **과학**: 단원 1·2·3의 시기가 9·11·10월로 엇갈려 월 미기재(단원·방법·3회만).
- **계산중 1학년 과학**: '탐구 활동' 반영 10%인데 유형 칸 합 20%, 유형별 합계 110% → 제외. **3학년 국어**: 만점 칸 "100점 (00%)" → 제외. **3학년 수학**: 만점 칸 "100%", '수학적 의사소통' 10%의 유형 미기재 → 제외.
- 인천부현동초: 학년군 표에서 5~6학년 영역 줄에 '3~4학년' 라벨 → 미사용. 인천신대초는 미사용(길주초로 충분).
- **연수중 과학 3학년**: 과학논술1(10월)·2(9월) 번호와 시기 순서가 엇갈림 → "9월·10월 두 번"으로만. 1학년 과학 합계 칸 빈칸(항목 합 100·유형 합 100) → "합계" 표현 안 씀.
- **인천여고 통합사회2·통합과학2**: 반영비율표에는 기말시험 한 행뿐이지만 교수학습 일정표에 전교 공통 중간시험 행이 있음 → "시험을 한 번 본다"는 표현은 쓰지 않고 "기말시험 60%/40%"만 기재(초안 문장 2곳 수정).
- 인천중앙초 영어 9단원 평가 기준 문구('전기문')와 평가 내용 불일치 → 단원명·시기·방법만.

# Quality Gate 조정
- 첫 작성본에서 계산4동 사회가 이미 운영 중인 용현5동 사회와 이름 마스킹 유사도 30.72%(>30%)로 AMBER, 그 쌍 때문에 용현5동 사회도 AMBER → "색인 동 페이지는 GREEN만" FAIL. 원인은 초등 6학년 사회 단원 나열 문장 구조가 같았던 것. threshold는 그대로 두고 계산4동 사회의 길주초 note·intro 문장만 다시 써(사실은 동일: 9·10월 서술·서답형, 11·12월 보고서·구술) 17.97%로 해소. 기존 Production 페이지는 수정하지 않았다.

# Expected delta (write 전 기록)
- 색인 +18(허브 3 + 동×과목 15), noindex +11 → Routes 2827 → 2856, Sitemap 656 → 674, Noindex 2169 → 2180.

# Actual delta
- `getAllContentRoutes()` 비교(21차 vs 작업 후): 추가 29(색인 18 / noindex 11), 삭제 0, 기존 플래그 변경 0, indexed→noindex 0, sitemap 누락 0·누수 0, 중복 0 → **2856 / 674 / 2180** 예상과 일치. `scripts/lib/baseline.ts` 갱신.

# Similarity / Quality Gate
- 허브 신사동 22.15%, 계산4동 22.56%, 연수3동 21.06%. 동×과목 최대 28.44%(신사동 국어), 계산4동 사회 17.97%(수정 후). 기존 최대(27.79%) 대비 신사동 국어가 새 최대지만 threshold(30%) 이내.
- region-dong GREEN **77/77**, region-dong-subject GREEN **385/385**, AMBER·RED 0, indexed RED 0.

# Validation
- lint·typecheck PASS, `validate:full` **PASS**(Routes 2,856 / Sitemap 674 / Noindex 2,180, Broken 0, Orphan 0, Metadata 중복 0, Search/Consult smoke).

# Render
- 깨끗한 build + 직접 띄운 로컬 서버: 신규 18페이지 200·index·canonical 일치·H1 1개·BreadcrumbList·기준 표시·맥락 CTA. 미작성 조합·송도3동·잠실7동 404. 신규 학교(`/school/sinsa-middle-school`, `/school/incheonyeoja-high-school`) `noindex, follow`, 기등록 학교 색인 상태 불변. 상위 구 페이지에서 신규 동 링크. 20·21차 대표 페이지 회귀 0.
