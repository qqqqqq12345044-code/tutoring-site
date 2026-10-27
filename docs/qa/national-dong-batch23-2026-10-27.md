# 전국 행정동 23차 batch — 송도3동(인천 연수)·부개3동(인천 부평)·계양2동(인천 계양) (2026-10-27)

# Baseline
- 시작: work = origin/work = `e23205e`, main = origin/main = Production = `f7f359f`(22차), working tree clean, 다른 세션 변경 없음.
- Routes 2856 / Sitemap 674 / Noindex 2180, region-dong GREEN 77/77, region-dong-subject GREEN 385/385, indexed RED 0.

# Candidate review
- 이미 동 페이지가 운영 중인 구·시 안의 미등록 CONFIRMED 동(초·중 모두 있음) 중 중·고 수 상위 8개 동의 중학교 21곳을 읽기 전용 probe(1초 간격, 다운로드 없음).
| 동 | 중학교 형식 | 판단 |
|---|---|---|
| 송도3동(연수) | 박문중 zip → 교과별 hwp(22차 때 수집) | **선정** |
| 부개3동(부평) | 부광중 hwp 15·부흥중 hwp 14, 구산중 PDF | **선정** |
| 계양2동(계양) | 인천예일중 hwp 42, 임학중·인천양촌중 zip(hwp) | **선정** |
| 도화2·3동(미추홀) | 선인중·선화여중·인화여중 모두 PDF | 제외 |
| 성남동(성남)·중2동(부천) | hwpx 1~3, 일부 PDF | 차순위 |
| 상2동(부천) | 상동중 PDF, 상일중 NOTFOUND | 제외 |
| 신봉동·유림2동(용인) | 홍천중·고진중 hwp, 신봉중·고림중 PDF | 차순위 |

# Selected content
- **송도3동**(법정동 송도동): 박문중 1~3학년(교과별 통합본), 인천송원초 6학년(평가 예고안과 교과별 횟수 일치). 박문여고·능허대중·인천송명초 PDF, 인천첨단초는 표 열 어긋남으로 미사용.
- **부개3동**(법정동 부개동): 부광중·부흥중 1~3학년, 부광여고 1학년 공통과목 7개, 인천부광초 6학년. 구산중·부개여고 PDF, 인천미래생활고(특성화) 미사용.
- **계양2동**(법정동 방축동·병방동·용종동·임학동): 인천예일중 1~3학년(1·2학년 교과별 운영 계획, 3학년 평가계획+성취기준), 인천양촌초 6학년(횟수만, 월은 계획에 비어 있어 미기재). 고교 2곳·인천병방초 PDF, 임학중·인천양촌중은 수집만.
- 기존 시·도 → 구 → 행정동 패턴 그대로(`/region/incheon/{yeonsu|bupyeong|gyeyang}/…`), 새 route 체계·URL 이전 없음.

# School mapping
- `--promote 2818584000,2823766100,2824572000` → 신규 23교, skip 0, 기등록 0. candidates 전체 `--write` 미사용. NEIS 단건 캐시 `.cache/official/neis/national-23.json`(23교).

# Excluded inconsistencies
- **박문중 3학년 사회(지리) 전체**: 2학기 문서에 '3학년 1학기 성취 수준' 제목, 단원표 '기말시험 출제'와 반영 비율표의 정기시험 1행(11월 1주) 충돌, 과제-비율 대응 모호. **1학년 영어** 수행 과제명이 비율표('논술형 프로젝트')와 세부 기준('논술형 포트폴리오')·채점 요소('서술평가')에서 달라 비율만 사용. 2학년 과학 기말 만점 칸 공란 → 비율만.
- **부흥중 3학년 사회**: 요약표 머리글 "정기시험(60%)"과 값 80% 불일치 → 제외. **2학년 역사**: 2학기 문서에 7월·4월 시기와 "1차시험 미실시" → 1학기 값으로 보고 제외. 국어 2학년 배점 없는 행, 수학 1학년 문제해결력 과제 유형 문구 불일치 → 미사용.
- **인천예일중 3학년 사회 전체**: 도시경관탐구 제목 "15점" vs 반영 비율·평가요소 합 20점 → 제외. 1학년 수학 수행평가 월(비율표 vs 교수학습 계획 불일치) → 월 미기재. 3학년 수학 이차함수 그래프 과제 유형 비율 미기재 → 유형 미언급.
- **인천양촌초**: 평가 시기 칸 전부 공란 → 월 미기재. 과학 '물질의 연소'·'전기의 이용' 평가 방법이 예고안("관찰 서술")과 계획("관찰 실기")에서 달라 방법 미기재.
- "정기시험 1회"는 계획 본문에 명시된 경우(박문중 3학년 수학, 부광중 3학년 각 교과)에만 썼고, 비율표에 시험 행이 하나뿐인 다른 경우는 "한 번"이라고 쓰지 않았다.

# Config
- 첫 반영에서 `validate:quick` Config FAIL: 계양2동 `legalDongs`를 학교 주소 기준(방축동·병방동)으로 넣었으나 공식 행정동 구성은 방축동·병방동·용종동·임학동 → 공식 구성으로 수정 후 PASS.

# Expected delta (write 전 기록)
- 색인 +18(허브 3 + 동×과목 15), noindex +23(신규 학교 페이지) → Routes 2856 → 2897, Sitemap 674 → 692, Noindex 2180 → 2203.

# Actual delta
- `getAllContentRoutes()` 비교(22차 vs 작업 후): 추가 41(색인 18 / noindex 23), 삭제 0, 기존 플래그 변경 0, indexed→noindex 0, sitemap 누락 0·누수 0, 중복 0 → **2897 / 692 / 2203** 예상과 일치. `scripts/lib/baseline.ts` 갱신.

# Similarity / Quality Gate
- 허브 송도3동 20.27%, 부개3동 18.15%, 계양2동 17.76%. 동×과목 11.76~21.51%(최대 계양2동 과학). 초등 단원 나열형 문장을 피해 첫 작성본부터 기존 쌍 유사도 상승 없음(전체 최대 28.44% 그대로).
- region-dong GREEN **80/80**, region-dong-subject GREEN **400/400**, AMBER·RED 0, indexed RED 0. threshold 변경 없음.

# Validation
- lint·typecheck·Config PASS, `validate:full` **PASS**(Routes 2,897 / Sitemap 692 / Noindex 2,203, Broken 0, Orphan 0, Metadata 중복 0, Search/Consult smoke).

# Render
- 깨끗한 build + 직접 띄운 로컬 서버: 신규 18페이지 200·index·canonical 일치·H1 1개·BreadcrumbList·기준 표시·맥락 CTA. 미작성 조합 404. 신규 학교(`/school/bakmun-middle-school`, `/school/bugwang-middle-school`, `/school/incheonyeil-middle-school`, `/school/bugwangyeoja-high-school`) `noindex, follow`. 상위 연수구·부평구·계양구 페이지에서 신규 동 링크. 20~22차 대표 페이지 회귀 0.
