# 전국 행정동 20차 batch — 용현5동·송도1동(첫 인천 연수구 동)·갈산동(안양) (2026-10-27)

# Baseline
- 시작: work = origin/work = `5ba3894`, main = origin/main = Production = `cea3072`(19차 배포 직후), working tree clean, 다른 세션 변경 없음.
- Routes 2773 / Sitemap 626 / Noindex 2145, region-dong GREEN 69/69, region-dong-subject GREEN 345/345, indexed RED 0.

# Candidate review
19차 QA의 Batch20 후보 조사(P1~P3) 그대로 선정했다.

| 동 | 지역 | 학교 | CONFIRMED | 본문 사용(READY) | PDF_HEAVY | 학교급 | 5과목 | route risk | 최종 |
|---|---|---:|---:|---:|---:|---|---|---|---|
| 용현5동 | 인천 미추홀구 | 6 | 6 | 3(인항고·용현중·인천용학초) | 1(용현여중) | 초·중·고 | 가능 | 없음(관교동과 같은 구) | **선정** |
| 송도1동 | 인천 연수구 | 7 | 7 | 3(신송고·인천해송중·인천신송초) | 4(인천해송고·신송중·인천먼우금초·인천해송초) | 초·중·고 | 가능 | 없음(아래) | **선정** |
| 갈산동 | 경기 안양 | 5 | 5 | 3(평촌과학기술고·안양남초·안양덕현초) | 2(대안중·대안여중) | 초·고 | 가능 | 없음(관양동과 같은 시) | **선정** |
- BACKUP 계산4동(인천 계양, zip 의존)·수서동(강남, 고교 PDF)은 조사만 유지.

# Route compatibility
- 송도1동: `regions.ts`에 `yeonsu`(인천 연수구, city)가 이미 있고 조합 route가 운영 중 → 기존 시·도 → 구 → 행정동 패턴 그대로(`/region/incheon/yeonsu/songdo1-dong`). 연수구 첫 행정동.
- 갈산동: `anyang` 아래 관양동(`/region/gyeonggi/anyang/gwanyang-dong`)과 같은 패턴(`/region/gyeonggi/anyang/galsan-dong`). 법정동은 NEIS 주소 5건 모두 호계동 → `legalDongs: ["호계동"]`.
- 용현5동: 관교동과 같은 미추홀구. 새 route 체계·URL 이전·sitemap 구조 변경 없음.
- 상담 prefill: "인천 / 연수구 송도1동", "경기 / 안양시 갈산동" 테스트 추가.

# Selected dongs
- **용현5동**(미추홀, 법정동 용현동): 인항고 1학년, 용현중 1~3학년, 인천용학초 6학년.
- **송도1동**(연수, 법정동 송도동): 신송고 1학년, 인천해송중 1~3학년, 인천신송초 6학년.
- **갈산동**(안양, 법정동 호계동): 평촌과학기술고 1학년(공통과목), 안양남초·안양덕현초 6학년. 중학교 2곳이 PDF뿐이라 중학교 내용은 없다.

# Official collection (18교 신규 수집, 모두 `JG_CHASU=3`, 재다운로드 0)
| 학교 | 형식 | 분류 | 사용 |
|---|---|---|---|
| 인항고 | hwp 3(학년별) | READY | 1학년 공통국어2·공통수학2·공통영어2·통합사회2·한국사2·통합과학2·과학탐구실험2 |
| 용현중 | hwp 1(전 학년·전 교과) | READY(일부 제외) | 1~3학년 국어·영어·수학, 사회 1·2, 역사 2·3, 과학 1·3 |
| 인천용학초 | hwp 1·hwpx 5 | READY | 6학년 |
| 인천용현초·인천용현남초 | hwp 6·zip → hwp 7 | READY(미사용) | 학교 페이지만(용학초로 초등 충분, 표 분할·주차 표기) |
| 용현여중 | pdf 14 | PDF_HEAVY | 학교 페이지만 |
| 신송고 | hwp 4(학년별 + 꿈두레) | READY | 1학년 공통과목 7개 |
| 인천해송중 | hwp 3(학년별 전 교과) | READY | 1~3학년 |
| 인천신송초 | hwp 12(학년별 계획 + 예고안) | READY | 6학년(계획과 예고안 행 수·단원·방법·시기 일치 확인) |
| 인천해송고·신송중·인천먼우금초·인천해송초 | pdf | PDF_HEAVY | 학교 페이지만 |
| 평촌과학기술고 | hwp 3(학년별) | READY | 1학년 공통국어2·공통수학2·공통영어2·통합사회2·통합과학2 |
| 안양남초·안양덕현초 | hwp/hwpx 6씩 | READY | 6학년 |
| 대안중·대안여중 | pdf 1씩 | PDF_HEAVY | 학교 페이지만 |
- PARTIAL 0, UNUSABLE 0. OCR 없음. 수집은 기존 Node collector(scratch, 1초 간격, 학교별 `done` checkpoint) 재사용, repo 변경 없음. NEIS 행은 단건 조회 캐시 `.cache/official/neis/national-20.json`(인천 E10 13교, 경기 J10 5교).
- 동별 사실 추출은 셀 주소가 보존된 표 dump에서 학교·학년·과목·행 번호를 함께 기록했고, 주요 표(비율·유형·시기·합계)는 원문 행과 다시 대조했다.

# School mapping
- 18교 모두 `school-candidates.json` CONFIRMED(주소 → 공식 행정동). PENDING 사용 0.
- `--promote 2817757000,2818582000,4117363000` dry run → 18교, skip 0 → `--write`(`schools.imported.ts`만). 기존 slug registry 그대로.
- `school-import.ts --write`(candidates 전체) 미사용, `data/official/` 변경 0 → disclosed·registered 감소 0. 17~20차 신규 학교의 candidates 상태 반영은 후속 정리.

# Used official facts
정기시험·수행평가 비율(학년·과목별 합 100% 검산), 평가 유형별(선택형·서술형·논술형·기타) 비율과 합계, 수행평가 과제명·시기(월/주), 정기시험 시기, 6학년 단원별 평가 시기·방법·총 횟수(행 수 일치: 인천용학초 국어 4·사회 4·수학 3·과학 3·영어 3회, 인천신송초 국어 6·사회 4·수학 5·과학 6·영어 4회, 안양남초 국어 3·사회 3·수학 3·과학 4·영어 2회, 안양덕현초 국어 3·사회 2·수학 3·과학 3·영어 2회).

# Excluded inconsistencies
- **용현중 2학년 과학**: 2학기 계획서 안의 해당 교과 표제가 "2026학년도 1학기 [과학]과"로 인쇄됨 → 비율표 합계는 맞지만 17차 성재중·19차 염창중과 같은 기준으로 사용하지 않음.
- **인항고 공통수학2** "구술 발표"가 유형 열에서 논술형으로 분류 → 과제별 유형은 쓰지 않고 학기 전체 유형 합계(선택형 60·논술형 30·기타 10)만 사용.
- **인천해송중 1학년 수학**: 문제해결력 평가1의 시기 칸이 다른 행에 떨어져 있음 → 1학년은 과제별 월을 쓰지 않음.
- **인천해송중 2학년 국어**: 정기시험 "영역 만점"이 30으로 인쇄 → 만점은 쓰지 않고 반영 비율만 사용. **3학년 정기시험** 실시 월이 표에 없음 → 월 표기 안 함.
- **평촌과학기술고**: 통합사회2만 과제별 만점·유형·시기 표가 있고, 국어·수학·영어·과학은 요약표(정기:수행 비율, 과제명·비율)와 교수·학습 계획의 "★수행평가 연계" 주차만 있음 → 과제와 주차를 1:1로 연결하지 않고 계획에 표시된 주차·단원만 인용. 정기시험 명칭 "2차"와 본문 "학기당 1회"는 해석하지 않고 "12월 1주 정기시험"으로만 씀. 한국사·과학탐구실험은 1학년 계획에 없음.
- **안양덕현초** '세계와 나'(학교자율시간)는 사회 교과가 아니어서 제외.
- 고교 2·3학년, 5과목 밖 교과(도덕·기술가정·체육·전문교과 등)는 읽지 않았다. 난이도·학군·성적·취업률·후기 등은 쓰지 않았다.

# Content
- 동별 hub 1 + 국어·영어·수학·사회·과학 = 18페이지. 최적화 템플릿(기준 표시·맥락 상담 CTA·압축된 공통 가이드·기존 내부링크) 그대로.
- intro·notes는 학교별 공식 수치 차이를 앞세웠다: 인항고 정기시험 안의 서술형 비율·과학탐구실험2 수행 100%, 신송고 공통수학2 시험 50%·공통영어2 서술형 4.5%, 인천해송중 1학년 사회 12월 시험 한 번 50%, 평촌과기고 수행평가 70%(통합과학2 60%) 등.

# Expected delta (write 전 기록)
- 색인 +18(허브 3 + 동×과목 15), noindex +18(신규 학교 페이지) → Routes 2773 → 2809, Sitemap 626 → 644, Noindex 2145 → 2163.

# Actual delta
- `getAllContentRoutes()` 비교(19차 상태 vs 작업 후): 추가 36(색인 18 / noindex 18), 삭제 0, 기존 플래그 변경 0, indexed→noindex 0, sitemap 누락 0·누수 0, 중복 0. 합계 **2809 / 644 / 2163**으로 예상과 일치. `scripts/lib/baseline.ts` 갱신.

# Similarity
- Quality Gate(이름 마스킹): 허브 용현5동 20.87%, 송도1동 20.87%, 갈산동 23.82%. 동×과목 용현5동 22.46·22.46·20.59·22.00·22.74 / 송도1동 20.98·22.64·20.83·20.27·22.90 / 갈산동 23.33·22.31·23.33·21.46·23.22 → 최대 23.82%. 기존 최대(27.54%) 변화 없음.

# Quality Gate
- region-dong GREEN **72/72**, region-dong-subject GREEN **360/360**, AMBER·RED 0, indexed RED 0. 신규 18페이지 첫 작성본부터 GREEN. threshold 변경 없음.

# Validation
- lint PASS, typecheck PASS, node:test consultContext 4/4(연수구·안양 prefill 케이스 추가).
- `validate:full` **PASS**: Quality gate(위 수치), Quick, Build, Routes 2,809, Sitemap 644, Noindex 2,163, Broken 0, Orphan 0, Metadata 중복 0, Search/Consult smoke.

# Render
- 로컬 production 서버 HTTP 검사: 신규 18페이지 전부 200·`index, follow`·canonical 일치·H1 1개·BreadcrumbList·기준 표시·맥락 상담 CTA(`/consult?subject=…&region=…&dong=…`). 미작성 조합(`yonghyeon5-dong/physics`, `songdo1-dong/history`, `galsan-dong/chemistry`) 404·noindex. 신규 학교 페이지(예: `/school/yonghyeon-middle-school`, `/school/daean-middle-school`) `noindex, follow`. 상위 `/region/incheon/michuhol`·`/region/incheon/yeonsu`·`/region/gyeonggi/anyang`에서 신규 동 링크 확인.
- 브라우저(Playwright) 대표 6페이지(동 hub 3 + 과목 3) 모바일 폭(390px 창): 가로 넘침 0, 깨진 이미지 0, H1 1개. 1440px `/consult?subject=math&region=yeonsu&dong=songdo1-dong` → 폼 "수학 / 인천 / 연수구 송도1동", 콘솔 오류 0.

# Candidate status
- 20차 사용: 용현5동·송도1동·갈산동. 수집했지만 본문 미사용: 인천용현초·인천용현남초(READY, 용학초로 충분).
- 보류 유지: 목4동·오정동·귀인동·부림동·역곡1동·성산제2동, 신정7동·대치2동·논현2동·문정1동·압구정동(PDF 위주). BACKUP 계산4동·수서동.
- 다음 후보(19차 조사 기준, 미조회 포함): 인천 연수3동(초 HWP, 중·고 zip), 송도3동(초 HWP, 나머지 PDF/zip), 서울 잠실7동·서초2동·신사동(초·중 HWP 2곳씩). 다음 batch 전에 읽기 전용 조사를 다시 한다.

# Production (2026-10-27)
- 배포 전: origin/main = Production = `cea3072`, work = `0ed9b41`(main 위 2커밋, FF). 작업 트리 clean, 다른 세션 변경 없음. Vercel preview build success(인증 보호라 페이지는 로컬 build로 확인).
- 배포 commit 그대로 `validate:full` 재실행 PASS(2,809 / 644 / 2,163, dong 72/72·subject 360/360 GREEN, indexed RED 0).
- `git push origin 0ed9b41:main`(FF) → GitHub Production deployment `7351321519` success.
- Smoke: sitemap 626 → **644**, 전부 200, 이전 URL 손실 0, 신규 18(허브 3 + 동×과목 15) 모두 index 가능·canonical 일치. 미작성 조합(`yonghyeon5-dong/physics`, `songdo1-dong/history`, `galsan-dong/chemistry`) 404, `/school/yonghyeon-middle-school`·`/school/daean-middle-school` `noindex, follow`.
- 롤백 지점: `cea3072` (deployment 7350898516).
