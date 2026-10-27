# 전국 행정동 19차 batch — 역삼2동·염창동·관교동(첫 인천 미추홀구 동) (2026-10-27)

# Baseline
- 시작: work = origin/work = `8a003bf`, main = origin/main = Production = `1256e45`, working tree clean.
- Routes 2742 / Sitemap 608 / Noindex 2132, region-dong GREEN 66/66, region-dong-subject GREEN 330/330, indexed RED 0. 최적화 1사이클(기준 표시·맥락 CTA·공통 섹션 압축) 템플릿이 적용된 상태에서 작업했다.

# Candidate review
| 동 | 지역 | 학교 | CONFIRMED | READY | PDF_HEAVY | 학교급 | 5과목 | route risk | 최종 |
|---|---|---:|---:|---:|---:|---|---|---|---|
| 역삼2동 | 서울 강남구 | 4 | 4 | 3 | 1 (역삼중, 기등록) | 초·중·고 | 가능 | 없음(기존 강남 동 다수) | **선정** |
| 염창동 | 서울 강서구 | 5 | 5 | 3 | 2 (염동초·염창초) | 초·중 | 가능 | 없음 | **선정** |
| 관교동 | 인천 미추홀구 | 6 | 6 | 4 | 2 (인명여고, 관교중 기등록) | 초·중(고 PDF) | 가능 | 없음(아래) | **선정** |
- 갈산동(경기 안양)·계산4동(인천 계양)은 BACKUP으로 남겼다(PRIMARY 3동 모두 근거 충분).

# Incheon route compatibility
- 현재 모델: `src/data/regions.ts`에 `incheon`(province) → `michuhol`·`yeonsu`·`namdong`·`bupyeong`·`gyeyang`·`ganghwa`·`ongjin`(city, fullName "인천 ○○구/군")이 있고, 행정동은 `dongs.ts`의 `citySlug`로 붙는다.
- 이미 운영 중인 인천 동 페이지: `/region/incheon/bupyeong/bupyeong4-dong`(+과목 5), 강화읍(`/region/incheon/ganghwa/...`). 미추홀구는 조합 route가 있다(`/region/incheon/michuhol/english` 등 sitemap 포함, `hasRegionComboRoutes` 참).
- 따라서 관교동은 **기존 시·도 → 구 → 행정동 패턴 그대로**(`/region/incheon/michuhol/gwangyo-dong`) 들어간다. 새 route 체계·URL 이전·sitemap 구조 변경 없음. 명칭도 기존 규칙(province name "인천", city name "미추홀구")을 그대로 쓴다. 상담 prefill은 "인천 / 미추홀구 관교동"으로 정상 처리(테스트 추가).
- 부산·대구·대전·울산·광주는 이번 범위 밖(도시 조합 route 없음, 별도 architecture 작업).

# Selected dongs
- **역삼2동**(강남, 법정동 역삼동): 진선여중 1~3학년, 진선여고 1학년, 서울도성초 6학년.
- **염창동**(강서, 법정동 염창동·가양동): 염경중 1~3학년, 염창중 1~3학년(일부), 서울염경초 6학년.
- **관교동**(인천 미추홀, 법정동 관교동): 관교여중 1~3학년, 남인천여중 1~3학년, 인천관교초 6학년.

# Official collection (15교 신규 수집, 모두 `JG_CHASU=3`, 재다운로드 0)
| 학교 | 형식 | 분류 | 사용 |
|---|---|---|---|
| 진선여고 | hwpx 3·hwp 2(학년별 계획 + 평가계획서 전체 + 과목별 요약) | READY | 1학년 공통국어2·공통수학2·공통영어2·통합사회2·한국사2·통합과학2·과학탐구실험2 |
| 진선여중 | hwp 1(학년별 비율표) | READY(간결) | 1~3학년 국어·영어·수학·사회·역사·과학 |
| 서울도성초 | hwp 1(1~6학년) | READY | 6학년 |
| 역삼중(기등록) | pdf 1 | PDF_HEAVY | 사용 안 함, dongSlug만 연결 |
| 염경중 | hwp 1(전 교과) | READY | 2·3학년 비율표, 1학년 자유학기 과정 중심 항목 |
| 염창중 | zip → hwp/hwpx 35(학년×교과) | READY(일부 제외) | 1학년 자유학기, 2학년 영어·역사·과학, 3학년 국어·영어·과학 |
| 서울염경초 | hwp 6 | READY | 6학년 |
| 서울염동초·서울염창초 | pdf 6·1 | PDF_HEAVY | 학교 페이지만 |
| 관교여중 | hwp 14(교과별) | READY | 1~3학년 국어·영어·수학·사회·역사·과학 |
| 남인천여중 | hwp/hwpx 17(교과별) | READY | 1~3학년 |
| 인천관교초 | zip → hwp 6 | READY | 6학년 |
| 인천승학초 | hwp 1 | READY(미사용) | 학교 페이지만(관교초로 초등 충분) |
| 인명여고 | pdf 3 | PDF_HEAVY | 학교 페이지만 |
| 관교중(기등록) | pdf 8 | PDF_HEAVY | 사용 안 함, dongSlug만 연결 |
- PARTIAL 0, UNUSABLE 0. OCR 없음. 수집은 기존 Node collector(scratch, 1초 간격, 학교별 `done` checkpoint) 재사용, repo 변경 없음. NEIS 행은 단건 조회 캐시 `.cache/official/neis/national-19.json`(서울 B10, 인천 E10).

# School mapping
- 모두 `school-candidates.json` CONFIRMED(주소 → 공식 행정동). PENDING 사용 0.
- `--promote 1168065000,1150051000,2817770000` dry run → 13교, skip 0 → `--write`(`schools.imported.ts`만). 기존 slug registry 그대로.
- 기등록 역삼중(`yeoksam-middle-school`)·관교중(`michuhol-middle-school`)은 `school-dongs.json` resolved 매핑대로 `schools.ts`에 `dongSlug`만 연결(slug·URL·색인 상태 불변 — inventory 플래그 변경 0).
- `school-import.ts --write`(candidates 전체) 미사용, `data/official/` 변경 0 → disclosed·registered 감소 0. 신규 13교의 candidates 상태 반영은 후속 정리.

# Used official facts
정기시험·수행평가 비율(학년·과목별 합 100% 검산), 서·논술형 비율, 수행평가 과제명·만점·시기, 6학년 단원별 평가 시기·방법·총 횟수(서울도성초 국어 3·사회 2·수학 2·과학 2·영어 2회, 서울염경초 국어 3·사회 3·수학 1·과학 2·영어 2회 — 행 수 일치), 자유학기 운영(염경중·염창중 1학년 2학기 지필 없음, 염창중은 이수 여부 P/F).

# Excluded inconsistencies
- **염창중** 2학년 국어·수학, 3학년 수학·사회·역사: 2학기 계획인데 비율표 학기 칸이 "1"로 인쇄됨 → 17차 성재중과 같은 기준으로 사용하지 않음. (같은 학교 다른 표는 "2".)
- **염창중 3학년 국어**: 쓰기 30% 안의 세부 과제 배분이 읽기 항목과 구분되지 않아 세부 배분은 쓰지 않음(쓰기 30·읽기 10·학습활동 10만 사용).
- **진선여고**: 과목별 요약표(5.hwp)와 통합과학2 수행평가 표의 학기 칸이 "1학기"로 인쇄됨. 문서 제목·교과명(공통국어2 등 2학기 과목)·평가계획서(전체)의 2학기 비율과 값이 일치해 사용했고, 비율은 평가계획서(전체) 기준으로 적음.
- **진선여중 과학 1·2학년**: 서·논술형 10% 칸에 과제명이 없음 → 과제명이 있는 항목만 서술.
- **남인천여중 3학년 수학**: 논술·서술의 반영 비율(10·20)과 유형 칸(20·10)이 반대 → 과제 구분 없이 "시험 60% + 수행평가 40%"만 사용. **3학년 역사**·**관교여중 3학년 과학**: 유형별 합계가 반영 비율과 맞지 않음 → 반영 비율만 사용.
- **남인천여중 1학년 사회** 수행 과제명(미디어 혐오 표현 논술 등)은 학년 대응이 불확실해 쓰지 않음.
- 진선여고 2·3학년, 각 중학교 도덕·기술가정 등 5과목 밖 교과는 읽지 않았다. 난이도·학군·성적·후기 등은 쓰지 않았다.

# Content
- 동별 hub 1 + 국어·영어·수학·사회·과학 = 18페이지. 최적화된 템플릿이 그대로 적용됨: 기준 표시(18/18), 맥락 상담 CTA(18/18, `/consult?subject=…&region=…&dong=…`), 압축된 공통 준비 가이드, 기존 내부링크.
- 각 페이지 intro·notes는 학교별 공식 수치 차이(자유학기 유무, 3학년 시험 횟수, 과제 구성·시기)를 중심으로 썼다.

# Expected delta (write 전 기록)
- 색인 +18(허브 3 + 동×과목 15), noindex +13(신규 학교 페이지) → Routes 2742 → 2773, Sitemap 608 → 626, Noindex 2132 → 2145.

# Actual delta
- `getAllContentRoutes()` 비교(18차 상태 vs 작업 후): 추가 31(색인 18 / noindex 13), 삭제 0, 기존 플래그 변경 0, indexed→noindex 0, sitemap 누락 0·누수 0, 중복 0. 합계 **2773 / 626 / 2145**로 예상과 일치. `scripts/lib/baseline.ts` 갱신.
- 로컬 build 전수(626): 200 = 626, canonical 불일치 0, sitemap noindex 0, soft404 0, title·description 중복 0. 기존 608 URL의 title·description·canonical·robots·H1·JSON-LD 변화 0.

# Similarity
- Quality Gate(이름 마스킹): 허브 역삼2동 20.69%, 염창동 21.29%, 관교동 19.77%. 동×과목 역삼2동 16.86·22.69·18.01·17.21·16.03 / 염창동 18.88·23.77·17.94·18.97·16.52 / 관교동 23.04·17.83·18.83·19.84·23.04 → 최대 23.77%. 기존 최대(27.79%) 변화 없음.
- 같은 과목 동×과목 25곳과 글자 그대로 겹치는 문장(최적화 1사이클 측정 방식): 신규 15페이지 **13~29%**(겹치는 문장 2~5개). 최적화 후 Production 범위(16~31%)와 같은 수준.

# Quality Gate
- region-dong GREEN **69/69**, region-dong-subject GREEN **345/345**, AMBER·RED 0, indexed RED 0. 신규 18페이지 첫 작성본부터 GREEN. threshold 변경 없음.

# Validation
- lint PASS, typecheck PASS, node:test 8/8(consultContext 4 — 인천 prefill 케이스 추가, operating 4).
- `validate:full` **PASS**: Quality gate(위 수치), Quick, Build, Routes 2,773, Sitemap 626, Noindex 2,145, Broken 0, Orphan 0, Metadata 중복 0, Search/Consult smoke. Index→noindex 링크 비율 28.0%(info).

# Render
- 로컬 production 서버, 14페이지 × 390/768/1024/1440 = **56건**: 신규 동 hub 3 + 과목 6, 대조군(화곡제4동 수학·개포1동 사회·화정1동 과학), 인천 상위(`/region/incheon`, `/region/incheon/michuhol`). 가로 넘침 0, 깨진 이미지 0, H1 1개, heading 건너뜀 0, BreadcrumbList 있음, 동 페이지 기준 표시 있음(390px 3줄 이하), 콘솔·page·네트워크 오류 0.
- 관교동 영어 CTA 클릭 → `/consult?subject=english&region=michuhol&dong=gwangyo-dong`, 폼 "영어 / 인천 / 미추홀구 관교동".
- 미작성 조합(`…/yeoksam2-dong/physics`, `…/gwangyo-dong/history`, `…/yeomchang-dong/chemistry`) 404·noindex. 신규 학교 페이지(예: `/school/gwangyoyeoja-middle-school`) `noindex, follow`.

# Candidate status
- 19차 사용: 역삼2동·염창동·관교동. 수집했지만 본문 미사용: 인천승학초(HWP, 관교초로 충분).
- 보류 유지: 목4동·오정동·귀인동·부림동·역곡1동·성산제2동(사유 그대로), 신정7동·대치2동·논현2동·문정1동·압구정동(PDF 위주).

# Batch20 candidates (읽기 전용 조사, 구현 0)
관교동이 기존 구조로 문제없이 들어가 인천 동 4곳을 추가로 조회했다(학교 24곳, 1초 간격, 다운로드 없음).

| 순위 | 지역·동 | 학교 | READY(HWP/HWPX) | zip | PDF | 학교급 | 예상 색인 | 예상 noindex | 비고 |
|---|---|---:|---|---|---|---|---:|---:|---|
| **P1** | 인천 미추홀 용현5동 | 6 | 4(인항고 hwp3, 용현중 hwp, 용학초, 용현초) | 1(용현남초) | 1(용현여중) | 초·중·고 | 6 | 6 | 관교동과 같은 구, 고교 HWP |
| **P2** | 인천 연수 송도1동 | 7 | 3(신송고 hwp4, 해송중 hwp3, 신송초) | 0 | 4 | 초·중·고 | 6 | 7 | 연수구 첫 동 |
| **P3** | 경기 안양 갈산동 | 5 | 3(평촌과학기술고, 안양남초, 덕현초) | 0 | 2(중) | 초·고 | 6 | 5 | 특성화고 → 공통과목만 |
| B1 | 인천 계양 계산4동 | 7 | 4(계산공고, 초 3) | 2(계산중·계양고) | 1 | 초·중·고(zip 의존) | 6 | 6 | zip 안 형식 미확인 |
| B2 | 서울 강남 수서동 | 4 | 2(수서초, 수서중) | 0 | 2(고) | 초·중 | 6 | 4 | 고교 2곳 PDF |
- 그 밖: 인천 연수3동(초 2만 HWP, 중·고 zip, 인천중 검색 미일치), 송도3동(초 2 HWP, 나머지 PDF/zip) → 차순위. 서울 잠실7동·서초2동·신사동(초·중 HWP 2곳씩) 차순위.
- 인천 확대 가능: 미추홀·연수·계양·남동·부평은 조합 route가 있어 기존 구조로 수용 가능.

# Production (2026-10-27)
- 배포 전: origin/main = Production = `1256e45`, work = `cea3072`(main 위 2커밋, FF). 작업 트리 clean, 다른 세션 변경 없음.
- 배포 전 audit: `validate:full` PASS(Routes 2,773 / Sitemap 626 / Noindex 2,145, region-dong 69/69·subject 345/345 GREEN, indexed RED 0). main..work 9파일(데이터·QA 문서·test·baseline), secret 패턴 0(문서 내 "secret 패턴 0" 문구 오탐 1). Preview(`tutoring-site-i6118lh57`)는 Vercel 인증 보호(302)라 비인증 확인 불가 → 로컬 build 검증으로 대체.
- `git push origin cea3072:main`(FF) → GitHub Production deployment `7350898516` success.
- Smoke: sitemap 608 → **626**, 전부 200, 이전 URL 손실 0, 신규 18(허브 3 + 동×과목 15) 모두 index 가능·canonical 일치. 미작성 조합(`yeoksam2-dong/physics`, `gwangyo-dong/history`, `yeomchang-dong/chemistry`) 404, `/school/gwangyoyeoja-middle-school` `noindex, follow`.
- 롤백 지점: `1256e45` (deployment 7349736708).
