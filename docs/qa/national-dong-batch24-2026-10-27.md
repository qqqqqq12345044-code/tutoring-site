# 전국 행정동 24차 batch — 성남동(성남 중원)·중2동(부천 원미) (2026-10-27)

1시간 제한 묶음 작업(Batch24 + 광역시 구조 audit + Batch25 후보). Production·main 미변경.

# Baseline
- 시작(16:21): work = origin/work = `aa3379c`, main = origin/main = Production = `e066805`(23차), working tree clean, 다른 세션 변경 없음.
- Routes 2897 / Sitemap 692 / Noindex 2203, region-dong GREEN 80/80, region-dong-subject GREEN 400/400, indexed RED 0.

# Candidate review
23차 QA에서 남긴 차순위(성남동·중2동·신봉동·유림2동) 중 중학교 probe 결과가 HWP/HWPX인 동만 수집(1초 간격, 재다운로드 0).

| 순위 | 동 | 지역 | 수집 | 중학교 | 고교 | 초등 6학년 | 판단 |
|---|---|---|---:|---|---|---|---|
| PRIMARY | 성남동 | 경기 성남 중원구 | 9 | 성일중 hwpx(READY), 동광중 hwpx(PARTIAL), 성남중 PDF | 성남여고 hwp/hwpx(READY), 동광고 hwp, 성일고·성일정보고·성남고 PDF | 성남중앙초 hwp | **선정** |
| SECONDARY | 중2동 | 경기 부천 원미구 | 8 | 계남중 hwpx, 부천부곡중 hwpx 3(READY), 심원중 PDF | 계남고·원미고 PDF | 부천부곡초(READY)·부천중앙초(PARTIAL) hwp | **선정** |
| BACKUP | 신봉동 | 경기 용인 수지구 | 8 | 홍천중 hwpx 3, 신봉중 PDF | 용인홍천고 hwp, 신봉고 PDF | 신리초 hwp, 홍천초·용인신봉초 PDF, 신일초 NOTFOUND | 수집만(25차 후보) |

# Route compatibility
- 성남(`seongnam`, 서현1동 등)·부천(`bucheon`, 상동) 모두 동 페이지 운영 중 → 기존 시·도 → 시 → 행정동 패턴 그대로. 새 route 체계·URL 이전 없음.
- 법정동은 공식 행정동 구성(`admin-dongs.json`) 기준: 성남동 = 성남동, 중2동 = 중동(Config PASS).

# Selected content
- **성남동**: 성일중 1~3학년(요약표 + 과목별 상세표 15개 일치, 1·2학년 70/30, 3학년 50/50), 성남여고 1학년 공통과목 7개, 성남중앙초 6학년(국어 3·수학 2·사회 2·과학 3·영어 2회, 행 수 일치).
- **중2동**: 계남중 1~3학년(5과목 50/50, 3학년 과학만 정기시험 선택형 44·논술형 6), 부천부곡중 1~3학년(국·영·수 60/40, 1학년 국어 70/30, 사회·역사 50/50, 과학 1·3학년 50/50·2학년 60/40), 부천부곡초 6학년(국어 4·사회 3·수학 4·과학 3·영어 2), 부천중앙초 6학년(수학 제외).

# School mapping
- `--promote 4113351000,4119264000` dry run → 17교, skip 0 → `--write`(`schools.imported.ts`만). 기등록 0, candidates 전체 `--write` 미사용 → disclosed·registered 감소 0, slug·mapping 변경 0. NEIS 단건 캐시 `.cache/official/neis/national-24.json`(J10 17교).
- 성일중 slug는 동명 학교와 구분된 `seongil-middle-school-seongnam`(기존 slug registry 규칙).

# Excluded inconsistencies
- **동광중 3학년 국어·수학·역사**: "평가의 유형과 반영비율" 제목 뒤 표가 비어 있음(이미지 표로 추정) → 동광중 전체 미사용(PARTIAL).
- **성남여고 통합사회2 정기시험 시기**: 반영비율표 '9월 5주' vs 주간 계획 "10.12.~15." → 시기 미기재. **공통수학2 시기**: 행마다 열 병합이 다르고 수행 시기 칸에 날짜 두 개 → 시기 미기재. 공통국어2 정기시험 논술형 하위열 만점 공란 → "정기시험 논술형 반영 없음"으로만.
- **성일중 3학년**: 2차 칸 '-'만 있고 "1회 실시" 문장 없음 → "한 번 본다"고 쓰지 않음.
- **부천중앙초 수학 전체**: 단원은 '소수의 나눗셈'인데 성취수준 문장은 '분수의 나눗셈' → 제외.
- **계남중 1학년 영어**: 논술형 비율 행 열 정렬 어긋남 → 논술형 합계 미인용(영역별 비율만).
- **부천부곡중 3학년** 특성화고 고입전형 환산 행 → 미사용. 초안의 "2차 시험 한 번만 봅니다"·"매달 한 번" 표현 2곳은 근거(비율표 행 수·초등 행 수)에 맞게 수정.

# Expected delta (write 전 기록)
- 색인 +12(허브 2 + 동×과목 10), noindex +17(신규 학교 페이지) → Routes 2897 → 2926, Sitemap 692 → 704, Noindex 2203 → 2220.

# Actual delta
- `getAllContentRoutes()` 비교(23차 vs 작업 후): 추가 29(색인 12 / noindex 17), 삭제 0, 기존 플래그 변경 0, indexed→noindex 0, sitemap 누락 0·누수 0, 중복 0 → **2926 / 704 / 2220** 예상과 일치. `scripts/lib/baseline.ts` 갱신.

# Similarity / Quality Gate
- 허브 성남동 18.50%, 중2동 18.16%. 동×과목 12.72~15.51%. 전체 최대(28.44%) 변화 없음.
- region-dong GREEN **82/82**, region-dong-subject GREEN **410/410**, AMBER·RED 0, indexed RED 0. 첫 작성본부터 GREEN, threshold 변경 없음.

# Validation
- lint·typecheck·Config PASS, node:test consultContext 4/4, `validate:quick` PASS, `validate:full` **PASS**(Build, Routes 2,926 / Sitemap 704 / Noindex 2,220, Broken 0, Orphan 0, Metadata 중복 0, Search/Consult smoke).

# Render
- 깨끗한 build + 직접 띄운 로컬 서버(HTTP): 신규 12페이지 200·`index, follow`·canonical 일치·H1 1·BreadcrumbList·OG 3+·JSON-LD·학교알리미 출처 링크·기준 표시·맥락 CTA(`dong=` 포함). 미작성 조합·신봉동 404. 신규 학교(`/school/seongil-middle-school-seongnam`, `/school/gyenam-middle-school`, `/school/seongnamyeoja-high-school`) `noindex, follow`. 상위 성남·부천 페이지에서 신규 동 링크. 회귀(송도3동·수서동·부천 상동·계양2동) 0.
- 브라우저(Playwright): 성남동 hub·수학·과학, 중2동 hub·국어·사회 + 대조군 송도3동 hub·수서동 수학 × 390/768/1440 = 24건 — 가로 넘침 0, 깨진 이미지 0, H1 1, 콘솔 오류 0. 24px 미만 터치 대상 15~16개/페이지는 대조군과 동일(기존 템플릿 특성, 이번 변경 무관).

# Batch25 candidates (읽기 전용 probe, 구현 0)
| 순위 | 동 | 지역 | 학교 | READY | PDF_HEAVY | 예상 색인 | 예상 noindex | risk |
|---|---|---|---:|---|---|---:|---:|---|
| **P1** | 산곡1동 | 인천 부평 | 8(중1·고3·초) | 산곡중 hwp 28·hwpx 4, 인천외고 hwp/hwpx 40, 세일고 zip | 명신여고 | 6 | ~8 | 인천외고는 특목고 — 공통과목만 |
| **P2** | 풍산동 | 경기 고양 일산동구 | 7 | 풍동중 hwp 3, 풍산중 hwpx 3 | 세원고·풍동고 PDF | 6 | ~7 | 고교 없음(중+초), 초등 미probe |
| B1 | 신봉동 | 경기 용인 수지구 | 8(수집 완료) | 홍천중 hwpx 3, 용인홍천고 hwp, 신리초 hwp | 신봉중·신봉고·홍천초·용인신봉초 PDF | 6 | ~7 | 신일초 NOTFOUND |
| B2 | 삼산2동 | 인천 부평 | 7 | 삼산중·진산중 zip(내부 미확인) | 인천영선고·진산과학고 PDF | 6 | ~7 | zip 형식 확인 필요 |
| B3 | 유림2동 | 경기 용인 처인구 | 7 | 고진중 hwp 3 | 고림중 PDF 14 | 6 | ~7 | 중학교 1곳만 READY |
- 제외: 대화동(고양) 중·고 전부 PDF, 도화2·3동(미추홀) 중학교 전부 PDF, 상2동(부천) 상동중 PDF·상일중 NOTFOUND.
- 광역시(부산·대구·대전·울산·광주)는 `docs/qa/metropolitan-route-architecture-audit-2026-10-27.md` 결론대로 첫 학교 등록 게이트 정책 결정 전에는 batch 후보에 넣지 않는다.
