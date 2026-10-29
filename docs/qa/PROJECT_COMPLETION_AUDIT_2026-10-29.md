# 교과설계소 Final Completion Audit (2026-10-29)

24차 Production 반영 → 전체 회귀 검증 → candidates 정리 → 얇은 색인 페이지 개선(템플릿 2곳) → 최종 audit. 운영 정보가 필요한 항목은 작성하지 않고 HOLD로 분리했다. 점수는 참고용이며 순위·매출과의 인과를 뜻하지 않는다.

# Executive Summary
- **Verdict: COMPLETE_WITH_OWNER_INFO_HOLDS** — 기술·SEO·콘텐츠 작업은 이번 범위에서 모두 닫혔고, 남은 것은 운영자만 줄 수 있는 사업/개인정보/서비스 운영 정보뿐이다.
- Production = main = `00fece6`(24차 + candidates 정리 + 얇은 페이지 개선). sitemap 704, 전수 200, 손실 0, 5xx 0.
- 참고 점수 합계 **73/100** (SEO 22 · GEO 19 · AEO 13 · Entity 11 · Trust 8). 10-27 GAP audit 62/100 대비 +11. 상승분은 기준 표시·맥락 CTA·공통 섹션 압축(최적화 1사이클)과 이번 허브 개선이고, 감점의 대부분은 운영 정보 HOLD다.

# Git / Production
| 항목 | 값 |
|---|---|
| main = origin/main | `00fece6` feat: link school and province hubs to published plan pages |
| work = origin/work | 이 문서 commit(docs only, main보다 1개 앞섬 — 배포 무영향) |
| 이번 배포 1 | `fac51e7`(24차) — GitHub deployment `7403053891` success |
| 이번 배포 2 | `00fece6`(정리·허브 개선) — deployment `7403283723` success |
| 롤백 지점 | `fac51e7`(7403053891), 그 이전 `e066805`(7352579088, 23차) |
| 시작 상태 확인 | work = origin/work = `fac51e7`, main = origin/main = `e066805`, clean, 다른 세션 변경 없음 |
| main..work diff audit | 24차 구현·QA·광역시 audit·mini-audit·checkpoint docs만. secret/.env/cache/scratch/log/PDF·HWP/임시 스크립트 0, `baseline.ts`는 기대값(totalRoutes·sitemap·noindex)만 변경, Quality Gate threshold 변경 0 |
| Vercel runtime logs | 미확인(이 노트북 MCP 403, 권한 변경 시도 안 함) → 공개 sitemap 전수 crawl로 대체 |
| DNS·env·project settings·SSL | 변경 없음 |

# Current Scale
| 기준 | Routes | Sitemap | Noindex | region-dong | region-dong-subject | indexed RED |
|---|---:|---:|---:|---:|---:|---:|
| 이전 Production(23차) | 2,897 | 692 | 2,203 | 80/80 | 400/400 | 0 |
| **현재 Production(`00fece6`)** | **2,926** | **704** | **2,220** | **82/82** | **410/410** | **0** |
- 기타 Quality Gate: region-subject GREEN 2/RED 2, region-grade-subject GREEN 15/RED 19, school-subject GREEN 48/AMBER 2/RED 13 — RED·AMBER는 모두 noindex(indexed RED 0).
- 등록 학교 480, candidates 12,059(registered 480 · disclosed 364 · pending 156).

# Batch24 Production
- 사전: `validate:full` PASS(work `fac51e7`) — Routes 2926 / Sitemap 704 / Noindex 2220, broken 0, orphan 0, metadata 중복 0, route 삭제·indexed→noindex 0(24차 QA delta와 일치).
- 사전 render(로컬 production 서버): 성남동 hub·수학·과학, 중2동 hub·국어·사회 + 대조군 송도3동 hub·화곡제4동 수학 × 390/768/1440 = 24건 — 가로 넘침 0, 깨진 이미지 0, H1 1, console/network 오류 0. HTTP: 200·`index, follow`·canonical self·OG·JSON-LD 유효·BreadcrumbList·학교알리미 출처·기준 표시·`dong=` CTA.
- main fast-forward `e066805 → fac51e7`(충돌 없음, force 없음). main은 방금 `validate:full`을 통과한 동일 commit이라 같은 tree 재실행은 생략.
- Production sitemap 전수(704): 200 **704/704**, 3xx/4xx/5xx 0, sitemap 안 noindex 0, canonical 불일치 0, title·description 누락 0, H1≠1 0, soft404 0, 23차 692 URL 손실 0, 추가 12(= 신규 색인 12).
- 신규 색인 12(허브 2 + 과목 10): 전부 200·`index, follow`·canonical self·출처/기준 표시·맥락 CTA·JSON-LD 유효.
- 신규 학교 표본 5(성일중·계남중·성남여고·부천부곡중·성남중앙초): `noindex, follow`. 콘텐츠 없는 조합(`/school/bucheonbugok-middle-school/math`, `/school/seongnamyeoja-high-school/korean`, `…/seongnam-dong/history`) 404.
- robots.txt `Allow: /`, `Disallow: /api/`, sitemap 선언. 홈 200.

# Candidates housekeeping (`a906d56`, data only)
- 21~24차 등록 57곳: status candidate → registered, operating unverified → disclosed-2026-3(manifest 3차 공시 파일 확인 57/57).
- 21~22차에 동을 연결한 기등록 수기 학교 4곳(양재고·현대고·계산중·연수중): manifest 확인으로 operating만 disclosed-2026-3.
- 61개 레코드의 두 필드만 변경, 다른 필드 변경 0, 감소 0, slug·동 매핑 변화 0. registered 423 → 480(= `schools.ts` 등록 수), disclosed 303 → 364.
- 남긴 것: candidate|disclosed 3곳(강서고·서울정목초·영도중 — 수집·미등록, 의도적), registered|unverified 119곳(이 PC manifest에 3차 공시 기록이 없는 기존 학교 — 추정으로 바꾸지 않음).
- src는 이 파일을 읽지 않음 → Routes/Sitemap/Noindex 변화 0, `validate:quick` PASS.

# Technical SEO
- [x] sitemap 704 전수 200, 손실 0, sitemap 안 noindex 0, canonical self 100%, soft404 0 (2회 crawl: 24차 배포 후·최종 배포 후).
- [x] title·description 중복 0, H1 1개(704/704).
- [x] broken 0, orphan 0(`validate:full`), index→noindex 링크 비율 28.7%(정보용, 변화 없음).
- [x] 미작성 조합은 404 + noindex, 새 학교는 noindex,follow.
- [~] 동이 적은 구·시 페이지(안양·연수·부천 1,360~1,469자)는 INVESTIGATE 그대로 — 동 hub 링크와 요약이 이미 있어 이번에는 바꾸지 않음.
- 참고 점수 **22/25** (+2: 얇은 허브 2종 개선, 공통 섹션 압축 반영).

# GEO
- [x] 동×과목·동 hub 상단 기준 표시(공시 학기·공시 월·학교와 별개) — 444p + 이번에 학교 허브(263p 렌더)·시·도 허브 3곳.
- [x] 학교·학년·과목 고유명사가 들어간 인용 가능한 문장(동×과목 intro), 학교 단위 출처 링크.
- [x] 시·도 허브에 데이터에서 센 수치 문장(예: "인천에서는 5개 시·군·구의 행정동 10곳 … 과목별 페이지가 50개 … 등록된 인천 학교는 68곳").
- [ ] 학교×학년 비교 표/bullet(P2-2) — 수치 재입력 오류 위험이 커 이번 범위 밖(유지보수 후보).
- [ ] 확인일/갱신일 표시 — 공시 학기·월만 있음.
- 참고 점수 **19/25** (+4).

# AEO
- [x] 동×과목 intro가 "수행평가 비중은?"에 숫자로 바로 답한다.
- [x] FAQ/FAQPage 화면 일치, 수업료 질문은 숫자 없이 "상담 이후 안내"(허위 숫자 0, 사이트 전체에 원 단위 금액 0).
- [x] 수업 방식: 1:1·국영수사과·초중고는 직접 답함.
- [ ] 매칭 기준, 방문/화상 가능 범위, 상담 후 연락 시점 — **BLOCKED_BY_OWNER_INFO**.
- 참고 점수 **13/20** (+2).

# Entity
- [x] BreadcrumbList = 화면 breadcrumb(홈 → 지역 → 시·구 → 동 → 과목, 학교 허브 포함).
- [x] "교과설계소는 학교와 별개의 과외 서비스" 명시(PlanBasisNote) — 동·동×과목·학교×과목에 더해 학교 허브·시·도 허브에도 노출.
- [x] 학교 허브 → 학교 소속 동의 과목 페이지 연결(학교–동–과목 관계가 링크로 드러남). 매칭은 출처 항목의 학교명 기준(추정 0, 타 동 연결 0).
- [x] 제휴·협약 표현 0, 학교에 Organization schema 미부여(소유 오해 방지).
- [ ] Organization JSON-LD 보강(logo·contactPoint·address) — 화면 정보가 생긴 뒤에만(**owner info 필요**).
- 참고 점수 **11/15** (+2).

# Content / Trust
- [x] 공식 출처(학교알리미·행안부 행정동 코드·NEIS)와 공시 학기 표시, 원문 불일치 값 제외 원칙(각 batch QA).
- [x] 가짜 후기·가격·실적 0(사례 카드는 "예시" 표기).
- [ ] 운영 주체/사업자 정보, 개인정보처리방침 필수 항목 — **BLOCKED_BY_OWNER_INFO**.
- 참고 점수 **8/15** (+1).

# Conversion
- [x] 상단 sticky "무료 상담", 모바일 하단 고정 바(전화·상담), `tel:` 링크.
- [x] 맥락 CTA: 동·학교 페이지에서 지역·동·과목이 상담 폼에 prefill(`consultContext.ts`) — 신규 24차 페이지 포함 확인.
- [x] Consult API smoke PASS.
- [ ] 상담 후 연락 시간 안내 — **owner info 필요**.

# Company/Senior Order Checklist
- [x] 지역·학교·과목·학년 URL 정합 (`/region/{시도}/{시구}/{동}/{과목}`, `/school/{slug}/{과목}`; 레거시 slug `gangnam-middle-school`=대치중은 URL 유지·H1 정확)
- [x] H1/H2 정합 (title = H1, H1 1개, 704/704)
- [x] 실제 데이터 일치 (학교알리미 원문만, 불일치 값 제외 — batch QA 기록)
- [x] 비용 질문에 허위 숫자 없음
- [x] 수업 방식 직접 답 (1:1·과목·학년) — 방문/화상 범위만 HOLD
- [x] FAQ/Quick Answer (FAQPage 일치, 동×과목 intro가 quick answer 역할)
- [x] 상단 기준 표시 (PlanBasisNote)
- [x] 지역명만 바꾼 thin template 최소화 (동 유사도 최대 28.44% < 30%, 학교 허브·시·도 허브 실데이터 보강)
- [x] 학교 생활권/시험/평가계획 고유 정보 (동×과목 410p, 학교×과목 GREEN 48)
- [x] 내부링크 (broken 0, orphan 0, 학교 허브 → 동×과목 연결 추가)
- [x] 독립 domain (`gyogwaseolgye.com`)
- [x] indexing (sitemap 704 전수 index·canonical self, noindex 누수 0)
- [x] Entity (breadcrumb·학교와 별개 명시) — Organization 보강만 owner info 대기
- [x] source (학교·학기·공시 월 단위)
- [x] consultation CTA (맥락 prefill)
- [x] mobile (390/768/1440 가로 넘침 0, 모바일 고정 바)
- [ ] 운영 주체·개인정보 필수 항목 — BLOCKED_BY_OWNER_INFO

# Thin page improvement (`00fece6`)
| 템플릿 | 변경 | 렌더 대상 | 전 → 후 (본문 글자 / h2 / 내부 링크) |
|---|---|---|---|
| `/school/[schoolSlug]` | 이 학교 평가계획이 출처인 색인 동×과목 페이지 링크 + 기준 표시 | 263(색인 18 · noindex 245) | 대치중 538/2/12 → 848/3/17, 가락고 550 → 862, 연수중 536 → 846, 강화초 545 → 849 |
| `/region/[province]` | 색인 동 hub 목록 + 시·군·구 수·동×과목 페이지 수·등록 학교 수 | 3(서울·경기·인천) | 서울 417/1/35 → 1,078/2/81, 경기 → 883/2/67, 인천 361/1/21 → 703/2/31 |
- 변경 없음(대조군): 평가계획 연결이 없는 색인 학교 허브 29곳(동 미연결 22 + 동은 있으나 그 학교 공시가 동×과목 출처가 아닌 7, 예: 영통중 539자 그대로), 구·시 페이지(안양·연수·부천 그대로).
- 검증: title·description·robots·canonical이 배포 전 Production과 해시 동일, Routes/Sitemap/Noindex 변화 0, indexed RED 0, `validate:full` PASS, 학교 허브 4·시·도 2+1·구·시 3 × 390/768/1440 가로 넘침 0·H1 1·console 오류 0, JSON-LD 유효.
- 남은 얇은 페이지: 위 색인 학교 허브 29곳(이 학교 공시로 쓴 콘텐츠가 없어 새 사실 없이 보강 불가 — 그 학교 평가계획을 쓰는 동×과목이 생기면 자동 보강됨).

# Completed
- 24차 Production 반영·전수 검증, 신규 12 색인·학교 17 noindex 확인.
- 21~24차 candidates status/operating 정리.
- 학교 허브·시·도 허브 얇은 페이지 개선과 Production 반영, 최종 전수 crawl.
- SEO/GEO/AEO/Entity/Trust 재평가와 사수 오더 checklist.

# Blocked By Owner Information
모두 **BLOCKED_BY_OWNER_INFO** — 값이 확보되기 전에는 작성하지 않는다(허위 기재 금지).
- 사업자명 / 사업자 등록번호 / 사업자 주소 (`src/config/site.ts`의 `businessName`·`businessRegistrationNumber`·`businessAddress`가 비어 있음)
- 공개 이메일 (`email` 비어 있음)
- 개인정보 보호책임자
- 처리 위탁 구조(상담 신청 데이터의 저장·알림 방식)
- 개인정보처리방침 시행일
- 상담 후 연락 시간
- 방문/화상 수업 범위 (현재 시·도 허브 문구 "방문과 화상 수업 모두 상담을 통해 가능 여부를 확인"은 범위를 단정하지 않음)
- 선생님 매칭 방식

# Future Maintenance Only
- **PLAN_TERM_RECHECK_BY = 2027-04-30** (`src/data/dongSubjectContent.ts`): 2027년 1차 공시(2027학년도 1학기) 이후 동×과목 410 entry의 평가계획 재검증 필요. `validate:quick`가 기한 후 경고. 미래 유지보수라 미완료로 보지 않는다.
- registered|unverified 119곳 operating — 해당 학교 공시를 다시 수집하는 PC에서만 갱신.
- 평가계획 연결이 없는 색인 학교 허브 29곳 — 그 학교 공시를 쓰는 동×과목이 생기면 자동 보강.
- 이번에 하지 않은 것(지시대로): Batch25, 신규 지역, 광역시 pilot, 광주 route 결정, URL migration, www DNS, env.

# Search Console Readiness
- 상태: **NOT_CONNECTED** — 이 세션에 GSC 연결 도구 없음, repo에 GSC export 없음. `layout.tsx`에는 네이버 사이트 인증 meta만 있다(Google 소유 확인 방식은 repo로 확인 불가). 새 연결은 시도하지 않았다.
- 다음 운영 단계에서 볼 지표(최근 28일·3개월, 페이지·쿼리 차원):
  - impressions / clicks / CTR / 평균 순위
  - page 그룹: 동 hub(82), 동×과목(410), 학교 허브(47 색인), 학교×과목, 시·도·구 허브
  - query 그룹: "{동} 과외", "{동} {과목}과외", "{학교} 과외", "{학교} 수행평가"
  - 지역별(서울·경기·인천)·과목별 노출 분포, 노출은 있으나 CTR이 낮은 페이지(title/description 후보), 색인 생성 범위 보고서의 "발견됨/크롤링됨 – 색인 미생성" 수
- 판단 기준: 클릭·노출이 생기는 지역/과목을 기준으로 다음 batch 우선순위를 정한다(지금까지는 공식 데이터 준비 가능 여부 기준).

# Final Verdict
**COMPLETE_WITH_OWNER_INFO_HOLDS** — Production·SEO·콘텐츠·정리 작업은 모두 닫혔다(indexed RED 0, sitemap 704 전수 정상). 남은 것은 위 owner info 8개 항목과 Search Console 연결(사용자 계정)뿐이다.
