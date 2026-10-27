# 전국 행정동 21차 batch — 수서동(강남)·서초2동(서초) (2026-10-27)

# Baseline
- 시작: work = origin/work = `e7ea3d4`(17~20차 candidates 정리 후), main = origin/main = Production = `0ed9b41`(20차), working tree clean, 다른 세션 변경 없음.
- Routes 2809 / Sitemap 644 / Noindex 2163, region-dong GREEN 72/72, region-dong-subject GREEN 360/360, indexed RED 0.

# Candidate review (읽기 전용 probe, 1초 간격, 다운로드 없음)
| 동 | 지역 | 학교 | 중학교 | 초등 | 고교 | 판단 |
|---|---|---:|---|---|---|---|
| 수서동 | 서울 강남 | 4 | 수서중 hwp 3(학년별) | 서울수서초 hwp | 서울세종고·대진디자인고 PDF | **선정** |
| 서초2동 | 서울 서초 | 3 | 서운중 hwp 1(전 학년) | 서울서이초 hwp | 양재고(기등록) PDF | **선정** |
| 잠실7동 | 서울 송파 | 4 | 아주중 hwp 1, 정신여중 PDF | 서울아주초 hwp | 정신여고 PDF | 수집·추출 후 **보류**(아래) |
| 신사동(강남) | 서울 강남 | 3 | 신사중 hwp 2(비율은 "연간" 계획에만) | 서울신구초 hwp | 현대고(기등록) PDF | BACKUP(2학기 비율 확인 필요) |
| 연수3동·송도3동 | 인천 연수 | 5·6 | zip / NOTFOUND(인천중) / PDF | hwp | zip·PDF | 차순위(중학교 근거 부족) |
| 계산4동 | 인천 계양 | 7 | 계산중(기등록) zip | hwp 3 | 계산공고 hwp, 계양고 zip | BACKUP(zip 형식 미확인) |

# 잠실7동 보류 사유
아주중 계획(첨부명 "(음악과)"이나 전 교과 통합본)은 2학기 표제지만, 1학기 값이 여러 곳에 섞여 있다: 2학년 수학 포트폴리오 세부 시기 "3월-6월", 3학년 영어 포트폴리오 "6월 3주", 각 교과 개요의 "1학기 단위 성취수준" 머리글. 또 3학년 과학 비율표 합계 75%(빈칸), 3학년 영어 듣기 20% vs 10% 충돌, 과제 시기 불일치 6건. 항목 단위로 걸러 쓸 수는 있었지만 문서 전체의 2학기 정합성이 불확실해(SJ-2: 공식 자료 해석 불확실 → 보류) 동 전체를 보류했다. 수집 파일은 cache에 남아 있고 학교 등록도 하지 않았다(route 0). 2027년 1차 공시(4월) 또는 정정 공시 확인 후 재검토.

# Selected dongs
- **수서동**(강남, 법정동 수서동): 수서중 1~3학년, 서울수서초 6학년.
- **서초2동**(서초, 법정동 서초동): 서운중 1~3학년, 서울서이초 6학년. 기등록 양재고(`yangjae-high-school`)는 `school-dongs.json` resolved 매핑대로 `schools.ts`에 `dongSlug`만 연결(slug·URL·색인 상태 불변).
- 고교는 두 동 모두 PDF뿐이라 본문은 중학교 + 초등 6학년 기준.

# Official collection (14교 신규 수집, 모두 `JG_CHASU=3`)
- 본문 사용: 수서중(hwp 3), 서울수서초(6학년 hwp), 서운중(hwp 1), 서울서이초(6학년 hwp).
- 수집·미사용: 서울세종고·대진디자인고·양재고·정신여고·정신여중·현대고(PDF), 아주중·서울아주초(잠실7동 보류), 신사중·서울신구초(BACKUP).
- NEIS 단건 캐시 `.cache/official/neis/national-21.json`(B10 10교). Node collector·grid dump 재사용, repo 변경 없음.

# School mapping
- `--promote 1168075000,1165052000` dry run → 6교, skip 0 → `--write`(`schools.imported.ts`만). candidates 전체 `--write` 미사용.

# Used official facts
정기시험·수행평가 비율(학년·과목별 합 100% 검산), 서·논술형 반영 비율, 수행평가 과제명·시기, 정기시험 일자·주차, 6학년 단원별 평가 시기·방법·횟수(행 수 일치: 서울수서초 국어 3·사회 1·수학 2·과학 3·영어 1회, 서울서이초 국어 3·사회 2·수학 2·과학 3·영어 2회 + 국어과 관계세움 2회).

# Excluded inconsistencies
- **서운중 2학년 영어 전체**: 반영 비율 행은 중간·기말 100%씩, 소계 행은 25%씩으로 충돌 → 영어 페이지는 1·3학년 + 서이초.
- **서운중 1학년 국어 중간고사 시기** "-" → 비율만. **1학년 과학 서·논술형** 과정·총괄평가 시기 병합 셀 → 과제 전체 시기로만. 3학년 기말 주차는 과목별 표기(10/28~10/30, 10월 4주, 10월 5주) 그대로.
- **수서중 1학년 과학** 과제 두 개의 만점 행 15% vs 서·논술형 행 10% → 서·논술 비율 미사용. **1학년 사회 재판 분석하기** 평가표 11월 vs 수업 계획 10월 → 월 미기재. **1·3학년 영어** 듣기 영역의 서·논술형 10% 표기 의미 불명 → 과제별 서·논술 비율 미사용. 2학년 수학 포트폴리오 서·논술 칸 공란 → 언급 안 함.
- 서울수서초 학교자율시간 '책 속 탐험'은 국어 횟수에서 제외. 5과목 밖 교과는 읽지 않았다. 난이도·학군·성적·후기 등은 쓰지 않았다.

# Expected delta (write 전 기록, 잠실7동 보류 반영)
- 색인 +12(허브 2 + 동×과목 10), noindex +6(신규 학교 페이지) → Routes 2809 → 2827, Sitemap 644 → 656, Noindex 2163 → 2169.

# Actual delta
- `getAllContentRoutes()` 비교(20차 상태 vs 작업 후): 추가 18(색인 12 / noindex 6), 삭제 0, 기존 플래그 변경 0(양재고 dongSlug 연결 포함), indexed→noindex 0, sitemap 누락 0·누수 0, 중복 0 → **2827 / 656 / 2169** 예상과 일치. `scripts/lib/baseline.ts` 갱신.

# Similarity / Quality Gate
- 허브 수서동 23.11%, 서초2동 21.00%. 동×과목 수서동 21.57·17.39·24.04·19.75·18.73 / 서초2동 17.54·22.75·24.45·20.63·20.81 → 최대 24.45%. 기존 최대(27.79%) 변화 없음.
- region-dong GREEN **74/74**, region-dong-subject GREEN **370/370**, AMBER·RED 0, indexed RED 0. threshold 변경 없음.

# Validation
- lint·typecheck PASS, `validate:full` **PASS**(Routes 2,827 / Sitemap 656 / Noindex 2,169, Broken 0, Orphan 0, Metadata 중복 0, Search/Consult smoke).

# Render
- 로컬 production 서버(깨끗한 build): 신규 12페이지 200·`index, follow`·canonical 일치·H1 1개·BreadcrumbList·기준 표시·맥락 상담 CTA. 미작성 조합(`suseo-dong/physics`, `seocho2-dong/history`)과 보류한 `/region/seoul/songpa/jamsil7-dong` 404·noindex. `/school/suseo-middle-school`·`/school/seoun-middle-school`·`/school/yangjae-high-school` `noindex, follow`, 미등록 `/school/aju-middle-school` 404. 상위 강남구·서초구 페이지에서 신규 동 링크. 20차 18페이지 회귀 bad 0.
- 참고(로컬 환경): 20차 때 띄운 로컬 서버가 남아 공유 `.next` 캐시에 이전 코드 기준 렌더(신규 동 noindex/404)를 써서 첫 smoke가 어긋났다. 다시 build하고 다른 포트의 새 서버로 재검사해 위 결과를 얻었다(Vercel build와 무관).
