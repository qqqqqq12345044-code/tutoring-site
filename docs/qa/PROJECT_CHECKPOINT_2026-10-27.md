# 교과설계소 프로젝트 체크포인트 (2026-10-27)

개발/SEO 확장을 당분간 중단하기 위한 상태 정리. 코드·데이터 변경 없이 기존 QA 문서의 값만 옮겼다(추측 없음). 모르는 값은 "없음/미확인"으로 적었다.

# 1. Git
| 항목 | 값 |
|---|---|
| work branch | `work/uijeongbu-dong-seo` |
| work HEAD | `187fd6a` (docs: add metro sampling and thin page mini-audit) — 이 문서의 commit이 그 위에 1개 더 붙는다 |
| origin/work | `187fd6a`와 동일(체크포인트 push 전 기준) |
| main = origin/main | `e066805` (feat: expand national dong seo batch 23) |
| working tree | clean (체크포인트 작성 전) |
| main 대비 work | main이 work의 조상 → **fast-forward 가능**. 앞선 commit: `8d55041`(24차), `99c2c65`(광역시 audit), `187fd6a`(표본·얇은 페이지 audit) 및 `aa3379c`(23차 Production 검증 기록) |

# 2. Production
- **Production code = `e066805` (23차)**. 24차는 **미배포**(work에만 있음).
- 최근 정상 배포: GitHub deployment `7352579088` success (23차). 롤백 지점 `f7f359f`(deployment `7352198164`).
- 마지막 Production smoke(23차 배포 직후, 2026-10-27): sitemap **692**, 전부 200, 이전 URL 손실 0, 신규 18 모두 index·canonical 일치, 콘텐츠 없는 조합 404, 신규 학교 페이지 `noindex, follow`.
- Vercel runtime logs: 이 노트북은 Vercel MCP team 권한 403 + Vercel CLI 미설치 → **미확인**(`seo-geo-aeo-cycle1-production-2026-10-27.md`). 매 배포 후 공개 crawl(sitemap 전수 200)로 대체했다.
- 이 노트북에 로컬 `next start` 프로세스 2개(PID 22008·26472, 포트 3017·3018)가 남아 있다. 프로젝트와 무관하게 종료해도 된다.

# 3. 현재 SEO 규모 (최신 검증값)
| 기준 | Routes | Sitemap | Noindex | region-dong GREEN | region-dong-subject GREEN | indexed RED |
|---|---:|---:|---:|---:|---:|---:|
| **Production (23차, `e066805`)** | 2,897 | 692 | 2,203 | 80/80 | 400/400 | 0 |
| **work (24차, `187fd6a`)** | 2,926 | 704 | 2,220 | 82/82 | 410/410 | 0 |
- 출처: `national-dong-batch23-2026-10-27.md`, `national-dong-batch24-2026-10-27.md`. AMBER·RED 0, broken 0, orphan 0, metadata 중복 0, `validate:full` PASS.
- 24차 대비 증가분: Routes +29, Sitemap +12, Noindex +17(성남동·중2동, 신규 학교 17곳).
- 신규 동 페이지 유사도 최대 약 24%(전체 최대 28.44%, threshold 30%).

# 4. 완료된 주요 작업
- **전국 동 SEO batch**: 13차~24차(서울·경기·인천). 21~23차는 Production 반영 완료, **24차만 미배포**. 각 batch는 `docs/qa/national-dong-batch*.md`에 후보·제외 사실·delta·Quality Gate·render가 기록돼 있다.
  - 서울: 강남·서초·강서·송파·양천 등 다수 동(수서동·서초2동·신사동·역삼2동 포함). 경기: 부천 상동·중2동, 고양 화정1동, 안양 갈산동, 성남동 등. 인천: 관교동·용현5동·송도1동·송도3동·연수3동·계산4동·부개3동·계양2동.
- **학교알리미 기반 콘텐츠**: 2026학년도 2학기(2026년 3차 공시) 평가계획의 비율·과제명·시기·초등 횟수만 사용. 원문이 서로 맞지 않는 항목은 제외하고 batch별 QA에 사유 기록. 동당 hub 1 + 국어·영어·수학·사회·과학.
- **school-import 안전화**: `--write` 전체 재생성 대신 `--promote … --write`(schools.imported.ts만)로 등록, operating은 unverified→disclosed로만 이동(`scripts/official/lib/operating.ts` + node:test), candidates 상태 정리는 17~20차까지 반영(`e7ea3d4`).
- **SEO/GEO/AEO 최적화 1사이클**(Production 반영): 기준·학교 관계 표시(PlanBasisNote), 상담 맥락 prefill(`consultContext.ts`), 동×과목 공통 섹션 압축. 근거 audit: `seo-geo-aeo-gap-audit-2026-10-27.md`.
- **sitemap 전체 crawl**: 매 배포 후 sitemap 전수 200, 손실 0, canonical/robots 확인.
- **광역시 architecture audit**(읽기 전용): `metropolitan-route-architecture-audit-2026-10-27.md`.
- **얇은 색인 페이지 mini-audit**: 15개 표본 분류(기록만, 색인 변경 0) — `national-dong-batch24-2026-10-27.md` 하단.

# 5. 현재 구조적으로 안전한 지역
| 지역 | 상태 | 근거 |
|---|---|---|
| 서울 | 안전(운영 중) | 시·도 → 구 → 행정동 route 정상 |
| 경기 | 안전(운영 중) | 시/구 → 행정동 route 정상 |
| 인천 | 안전(운영 중) | 기존 구조 그대로 확장 확인(미추홀·연수·부평·계양) |
| 부산·대구·대전·울산 | **구조 변경 불필요, 데이터 문제** | 구는 이미 인천 미추홀구와 같은 city 노드. 등록 학교 0 → `hasRegionComboRoutes` false(`src/lib/regionRoutes.ts` L22) → 동·조합 URL 404. 등록 스크립트도 학교 없는 도시를 거부(`scripts/official/school-import.ts` L284). 학교알리미 첨부 표본(도시당 2곳): HWP/HWPX **5**, zip 1(부산 연일중), PDF 1(대구 경북대사대부설중), 검색 불가 1(울산 강동중). ※ audit 문서의 "8곳 중 6곳이 HWP/HWPX(+zip 1)" 문장은 집계 오기이며 정확한 값은 이 표의 5/1/1/1이다(이번 작업은 문서 1개만 변경하는 규칙이라 audit 문서는 수정하지 않음) |
| 광주 | route는 가능, **tooling·URL 결정 선행** | 공식 시·도명 `전남광주통합특별시` vs 사이트 `광주광역시` → `officialSigunguNames`(`admin-dong-table.ts` L36) 매핑 불일치, 광주로 매핑된 후보 0건. URL migration 여부는 `docs/ai/NEXT_TASK.md` 결정 2 |
- 권장 첫 도시(audit): **울산**(`ulsan-nam` 옥동), 이후 대전 → 부산 → 대구 → 광주. 대안: 이름 충돌이 없는 대전 유성구.
- 주의: 광역시 첫 학교를 등록하는 순간 그 도시·시도 허브가 색인/sitemap 대상이 되고 조합 route 약 27종이 생긴다. 광역시 간 구 이름 중복("중구" 등)으로 동 페이지 제목이 겹칠 수 있다(`DongPages.tsx` L66/L83).

# 6. 절대 건드리면 안 되는 HOLD (현재 QA·지침에 존재하는 것만)
- **광주 URL migration / 공식 시·도명** — `NEXT_TASK.md` 결정 2 + audit. 결정 전 구현 금지.
- **광역시 첫 학교 등록 정책**(opt-in 플래그 vs 수기 등록) — audit §Implementation scope. 결정 전 새 도시 route 생성 금지.
- **PENDING school→dong** — 주소로 추측해 공개 route에 쓰지 않는다(candidates `pending` 156건, `e7ea3d4` 시점).
- **기존 indexed route 삭제·indexed→noindex 변경 금지** — 얇은 페이지도 개선만 가능.
- **Quality Gate threshold 변경 금지** — AMBER 발생 시 문장 재작성으로 해결(22차 선례).
- **원문이 불확실한 학교알리미 자료** — 보류 동: 잠실7동(아주중 2학기 계획에 1학기 값·합계 불일치), 목4동·오정동·귀인동·부림동·역곡1동·성산제2동, 신정7동·대치2동·논현2동·문정1동·압구정동(PDF 위주). 사유는 `national-dong-batch19`·`21` QA.
- **PDF text layer 없는 자료** — OCR·추정 금지.
- **인천 신설구 빈 조합 route 140개** 유지/정리 — `NEXT_TASK.md` 결정 3(이미 공개된 URL).
- **plan freshness**: `PLAN_TERM_RECHECK_BY` "2026-2" = **2027-04-30** — 2027년 1차 공시 후 모든 동×과목 entry 재확인 필요(`validate:quick`가 기한 후 경고).
- **Vercel runtime log 권한**(2절).
- 참고: `www` DNS·Production env/DNS는 **현재 QA 문서에 근거가 없어** HOLD 목록에서 제외했다(필요하면 직접 확인).

# 7. 다시 시작할 때 우선순위
- **선행 0 — 24차 배포 여부 결정**: 24차가 검증을 마쳤지만 미배포라서, 재개 전에 배포(승인 필요)할지 판단해야 work와 Production의 괴리가 사라진다. work는 main에서 fast-forward 가능.
- **P1 — 실제 Search Console 성과 분석, 클릭/노출이 있는 지역 중심 확장 여부 결정**: 지금까지는 공식 데이터 준비 가능 여부 기준으로 확장했고 실제 유입 데이터가 한 번도 반영되지 않았다(이 repo 문서에 Search Console 데이터 없음).
- **P2 — 운영 주체·사업자·개인정보처리방침 정보 확보 시 Trust 개선**: GEO/AEO audit이 가장 큰 빈틈으로 꼽았고(P1-1·P1-5) 운영자 정보 없이는 작성할 수 없다.
- **P3 — 신규 batch 확장 / 부산·대구·대전·울산 첫 pilot**: 기술적 위험은 낮지만(데이터 문제), 성과 데이터와 Trust 보강 없이 규모만 키우는 것은 효율이 낮다. 25차 후보는 8절 아래 참고.
- 정리 작업(소): 21~24차 등록 학교의 candidates status/operating 반영(`e7ea3d4` 방식, src 무영향). 얇은 색인 페이지 개선(학교 허브 > 시·도 허브 > 동 적은 구·시, 색인 변경 없이 콘텐츠만).

# 8. 다시 하지 않아도 되는 작업 (실제 완료된 것만)
- 전국 행정동 기본 데이터(`data/official/admin-dongs.json`, `national-school-dongs.json`, `school-dongs.json`)와 학교 후보 목록(`school-candidates.json`, 12,059건) 구축.
- 13~24차 batch의 학교알리미 수집·판독·콘텐츠 작성(각 batch QA에 대상·제외 사실 기록). 같은 동 재작업 금지.
- SEO/GEO/AEO gap audit과 최적화 1사이클(기준 표시·맥락 CTA·공통 섹션 압축) — Production 반영 완료.
- metropolitan architecture audit과 표본 조사 — 재조사 불필요(재개는 구현/정책 결정부터).
- sitemap·canonical·robots 전수 검증 방식 — 매 배포마다 수행·기록됨.
- 17~20차 candidates 정리.
- **단, 로컬 캐시는 git에 없다**: `.cache/official/schoolinfo/`·`.cache/official/neis/national-13~24.json`은 이 노트북에만 있다(gitignore). 다른 PC에서는 재수집이 필요하다.

**25차 후보(24차 QA 기준, 구현 0)**: P1 인천 부평 산곡1동(산곡중 hwp/hwpx·인천외고·세일고 zip), P2 경기 고양 일산동구 풍산동(풍동중·풍산중). BACKUP 용인 신봉동(수집 완료)·인천 삼산2동(중학교 zip 내부 미확인)·용인 유림2동. 제외: 대화동(전부 PDF)·도화2·3동(중학교 전부 PDF)·상2동.

# 9. 재개 시 첫 5개 명령
```
git status && git branch --show-current
git fetch origin && git log --oneline --decorate -8
git rev-parse HEAD origin/work/uijeongbu-dong-seo main origin/main
npm run validate:quick
npx tsx scripts/official/school-import.ts --summary   # Routes/Sitemap/Noindex 현재값 (work 기준 2926 · 704 · 2220이어야 정상)
```
그다음 `docs/qa/national-dong-batch24-2026-10-27.md`와 이 문서를 읽는다. 24차 배포 승인 시: `validate:full` 재확인 → origin/main이 `e066805`인지 확인 → `git push origin <work HEAD>:main`(fast-forward) → Production deployment 확인 → sitemap 전수 200·손실 0 확인.

작업 도구 참고: 수집 스크립트(`collect.mjs`, `grid.mjs`)와 route inventory 비교 도구는 repo에 없고 세션 임시 폴더에 있었다. 없어졌다면 `scripts/official/schoolinfo_plans.py`를 쓸 수 있는 환경(Python)에서 수집하거나, 같은 endpoint로 Node 수집기를 다시 만든다. 이 노트북은 Python이 없다. `school-import.ts --write`(전체 재생성)는 다른 PC의 manifest 부재 시 disclosed를 덮어쓸 위험이 있어 `--promote … --write`만 쓴다(`school-import-manifest-risk-2026-10-26.md`).

# 10. 사용자에게 필요한 정보 (Trust 개선을 하려면)
아래 값이 확보되기 전에는 작성하지 않는다(허위 기재 금지). 현재 모두 **없음**.
- 사업자/운영 주체(사업자명·등록번호·주소) — `src/config/site.ts` 값이 비어 있음
- 공개 연락 이메일
- 개인정보 보호책임자
- 처리 위탁의 실제 구조(상담 신청 데이터의 저장·알림 방식)
- 개인정보처리방침 시행일
- 상담 후 연락 기준(언제·어떤 방법으로)
- 방문/화상 수업 범위
- 선생님 매칭 방식
