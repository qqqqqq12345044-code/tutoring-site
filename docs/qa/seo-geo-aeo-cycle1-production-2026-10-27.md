# SEO/GEO/AEO 최적화 1사이클 — Production 반영·전수 검증 (2026-10-27)

이전 단계: `docs/qa/seo-geo-aeo-optimization-cycle1-2026-10-27.md`(work 검증). 아래 수치는 모두 이번 배포 전후 실제 측정값이다.

# Deployment
- 사전 확인: work = origin/work = `1256e45`, main = origin/main = Production = `1f4761b`, working tree clean.
- main..work 감사: commit 5개(a8a6be0 docs, 11ba301, 03dbec4, 3c31d76, 1256e45 docs), 18파일. binary·package·lock·env·cache·scratch 0, secret 패턴 0, `scripts/lib/quality-gate.ts`·`baseline.ts` 변경 0(threshold·기준값 그대로), `src/app/api` 변경 0.
- 상담 보안: 쿼리에는 과목·지역·행정동 slug만 실린다(이름·연락처는 쿼리에 없음). `resolveConsultPrefill`은 `subject`·`province`·`cityDetail` 세 값만 돌려주고, 사이트 데이터에 없는 값은 버린다. `/consult`는 정적 페이지라 쿼리가 서버 HTML에 들어가지 않는다. API route·서버 로그 코드는 바뀌지 않았다.
- `validate:full` work `1256e45` PASS → main fast-forward(merge commit 없음) → main `validate:full` PASS → `git push origin main`(force 없음) → GitHub Production deployment **7349736708 success**(2026-10-27T03:41:03Z, `1256e45`).
- 롤백 지점: 직전 Production deployment 7348893577(`1f4761b`).
- Vercel runtime logs: MCP 403(권한 미변경), Vercel CLI 미설치 → **미확인**. 공개 crawl로 대체(5xx 0).

# Commit
- Production runtime = main = origin/main = `1256e45`.
- 이 문서는 배포 뒤 work branch에만 docs commit으로 추가한다(main에는 추가 push 안 함).

# Production baseline (배포 전, `1f4761b`)
- sitemap 608 URL(고유 608): 200 = 608, 3xx·4xx·5xx 0, canonical 불일치 0, sitemap 안 noindex 0, soft404 0, H1≠1 0, title 중복 0, description 중복 0.
- 전 URL의 title·description·canonical·robots·H1·JSON-LD @type 목록을 저장해 배포 뒤와 비교했다.
- 기준 표시 0페이지, 맥락 상담 CTA 0페이지.

# Sitemap crawl (배포 후, `1256e45`, 608 URL 전수, 동시 6·재시도 1)
- `/`·`/robots.txt`·`/sitemap.xml` 200.
- 200 = **608**/608, 3xx·4xx·5xx **0**, 요청 오류 0.
- canonical 불일치 **0**, sitemap 안 noindex **0**, soft404 **0**, H1≠1 0, title 중복 **0**, description 중복 **0**.

# URL preservation
- 배포 전 sitemap 집합 vs 배포 후: 추가 **0**, 삭제 **0**(608 = 608).
- 608 URL 전체에서 배포 전후 title·description·canonical·robots·H1·JSON-LD @type·HTTP status 변화 **0**.

# Phase A verification (기준·관계 표시)
- 기준 표시가 있는 페이지(608 전수): 동 hub **66/66**, 동×과목 **330/330**, 학교×과목 **48/49**(나머지 1개는 NEIS만 출처인 색인 페이지로 의도대로 표시 없음), 그 외 유형 0 → **합계 444**. 로컬 build 사전 측정(444)과 같다.
- 내용 일치(표본 28페이지, 동 hub·동×과목·학교×과목 고르게): 28/28이 문구의 "2026학년도 2학기"·"2026년 9월 공시"와 같은 페이지 출처 라벨("2026학년도 2학기, 2026년 9월 공시")이 일치하고 "학교와 별개" 문구가 있으며, 제휴·협약·파트너 표현은 0.
- 렌더: 390px에서 3줄 이하(아래 Render), 중복 heading 없음(H1 1개 전수).

# Phase C verification (상담 맥락)
- 맥락 CTA가 있는 페이지(608 전수, 본문 CTA href 기준): 과목 hub·주제 22, 시·도 3, 시·구 19, 구 4, 시·구×과목 2, 시·구×학년×과목 15, 지역 프로그램 5, 학교 47, 학교×과목 49, 동 hub 66, 동×과목 330. 홈·학년·가이드·전국 프로그램·상담·약관 페이지는 `/consult` 그대로. 서로 다른 맥락 href 454종, 형식 위반 0(`subject`는 국영수사과 slug, `region`·`dong`은 slug만).
- Production 브라우저(실제 제출 없음, `/api/consult` 요청 0건):
  - `/consult` → 빈 폼 / `?subject=math` → 수학 / `?region=seoul` → 서울 / `?region=gangseo&dong=hwagok4-dong` → 서울·강서구 화곡제4동 / `?subject=science&region=goyang&dong=hwajeong1-dong` → 과학·경기·고양시 화정1동.
  - 잘못된 과목(`physics`)·지역(`atlantis`)·특수문자(`<script>`, `"><img onerror>`) → 빈 폼, 오류 0.
  - 모든 경우 canonical `https://gyogwaseolgye.com/consult`.
  - CTA 클릭 5경로(동×수학, 동 hub, 학교×영어, 시·구×수학, 과목 hub) → 맥락 쿼리로 이동하고 해당 값이 채워짐.
  - 채운 값은 사용자가 바꿀 수 있음(과목·지역 수정 확인, 제출하지 않음).
- 정리: 상담 입력 마찰을 줄이는 구조가 Production에 정상 반영됐다. 상담 신청 수 변화는 analytics 데이터로 따로 확인해야 하며 이 문서에서는 판단하지 않는다.

# Phase D verification (공통 콘텐츠 압축)
같은 과목의 다른 동×과목 페이지 25곳과 글자 그대로 겹치는 문장(25자 이상) 비율. Before = 배포 전 Production `1f4761b`, After = 배포 후 Production `1256e45`. 과목별 3페이지, 15페이지.

| 페이지 | Before | After |
|---|---|---|
| 화곡제4동 수학 | 16/31 (52%) | 5/19 (26%) |
| 송산2동 수학 | 16/35 (46%) | 4/23 (17%) |
| 삼성1동 수학 | 16/29 (55%) | 5/17 (29%) |
| 청담동 국어 | 8/25 (32%) | 4/20 (20%) |
| 상동 국어 | 8/24 (33%) | 3/19 (16%) |
| 반포3동 국어 | 8/21 (38%) | 4/16 (25%) |
| 방배4동 영어 | 16/32 (50%) | 5/20 (25%) |
| 가양제1동 영어 | 16/28 (57%) | 5/16 (31%) |
| 화정1동 영어 | 16/29 (55%) | 4/17 (24%) |
| 개포1동 사회 | 7/20 (35%) | 3/15 (20%) |
| 아현동 사회 | 9/25 (36%) | 5/20 (25%) |
| 송산2동 사회 | 9/24 (38%) | 4/19 (21%) |
| 화정1동 과학 | 8/21 (38%) | 3/16 (19%) |
| 신정4동 과학 | 8/23 (35%) | 4/18 (22%) |
| 대치1동 과학 | 8/23 (35%) | 4/18 (22%) |

- 범위: 32~57% → 16~31%, 겹치는 문장 수 7~16 → 3~5. work 측정(16~26%, 7페이지)과 같은 수준이며 회귀 없음. 남은 공통 문장은 기준 표시 2문장(의도), 학년 포인트 제목 묶음, 관련 가이드 링크 제목.

# Internal links
- 홈에서 sitemap URL만 따라간 BFS: 608/608 도달, 최대 깊이 **4**, 깊이 분포 {0:1, 1:47, 2:215, 3:270, 4:75} — audit 기준선과 같음. orphan **0**.
- 608페이지에서 나가는 sitemap 밖 내부 링크 대상 604개(학교 noindex 페이지·학년 하위 등) 전부 200, **broken 0**.
- `/consult?…` 링크 454종은 그래프에서 `/consult` 하나로 취급(별도 색인 URL 아님, canonical `/consult`). 쿼리 링크로 인한 crawl 폭증 없음(sitemap·canonical에 쿼리 URL 0).

# Metadata / schema
- 608 전수 배포 전후 비교: title·description·canonical·robots·H1 변화 0, JSON-LD @type 목록 변화 0. 템플릿별 JSON-LD는 이전과 같다(공통 EducationalOrganization·WebSite + BreadcrumbList, 홈·과목·시·구·프로그램·학교 hub FAQPage). 기준 표시는 화면 텍스트만 추가했고 schema를 바꾸지 않았다. 학교에 Organization/제휴 관계를 표시하는 schema 없음.
- OG 4종(title·description·image·url) 전 페이지 유지(snapshot 기준).

# Render (Production)
- 13페이지 × 390/768/1440 = **39건**: 홈, 과목 hub, 동 hub 3(청담동·화곡제4동·화정1동), 동×과목 5(청담동 국어·화곡제4동 수학·송산2동 수학·개포1동 사회·화정1동 과학), 학교×과목 2, 맥락 쿼리 `/consult`.
- 가로 넘침 0, 깨진 이미지 0, H1 1개, 콘솔·page·네트워크 오류 0. 390px에서 기준 표시 3줄 이하, 모바일 하단 고정 상담 바 존재(`/consult` 제외 모든 페이지).
- 배포 전 로컬 build 렌더(8페이지 × 4폭 = 32건)도 이상 없음.

# Before / After
| 항목 | 배포 전 Production | 배포 후 Production |
|---|---|---|
| Routes / Sitemap / Noindex | 2742 / 608 / 2132 | 2742 / 608 / 2132 |
| region-dong / region-dong-subject | GREEN 66/66 · 330/330 | GREEN 66/66 · 330/330 |
| indexed RED | 0 | 0 |
| sitemap 200 | 608 | 608 |
| 기준 표시 페이지 | 0 | 444 |
| 맥락 상담 CTA 페이지 | 0 | 562 (본문 CTA 기준, 위 유형 합) |
| 동×과목 같은 과목 공통 문장(15페이지) | 32~57% | 16~31% |
| 최대 크롤 깊이 / orphan / broken | 4 / 0 / 0 | 4 / 0 / 0 |

# Remaining P1
실제 운영 정보가 필요해 구현하지 않음:
- 사업자·운영 주체 정보(소개 페이지, footer 사업자 정보 — `siteConfig` 값이 비어 있음).
- 개인정보처리방침의 보호책임자·시행일·처리 위탁(상담 신청 → Google Sheets·이메일 알림).
- 선생님 매칭 기준, 방문/화상 가능 범위, 상담 후 연락 시점.

# 19th Batch Preparation
조사만 했다(콘텐츠·route·학교 등록 0). 학교알리미는 학교 검색 + 첨부 목록만 읽기 전용 조회(1초 간격, 다운로드 없음). PDF 텍스트층과 zip 안 파일 형식은 수집 단계에서 확인해야 하므로 아래 PDF는 "PDF(텍스트층 미확인)"이다.

## 후보 풀 재평가
- 로컬 `school-import.ts --dongs` 순위(CONFIRMED, 사이트 도시 안, 동 페이지 없음) 2,903동 가운데 새로 조회한 8개 동(학교 39곳, 전부 3차 공시) + 기존 조회 결과(염창동·수서동·잠실7동·서초2동·신사동·흥도동·갈산동·정자1동·성산제2동).
- 새 조회에서 PDF 위주라 탈락: 신정7동(초 1곳만 HWP), 대치2동(초 1·고 zip, 중 PDF), 논현2동(초 2만 HWP), 문정1동(초 1만 HWP), 압구정동(초 1·고 zip, 중 PDF 2).
- 목4동·오정동·귀인동·부림동·역곡1동은 같은 자료로 재시도하지 않았다. 성산제2동은 수집돼 있으나 학교별 서식 상이(보류 사유 그대로).

## 인천·광역시 sampling
- **부산·대구·대전·울산·광주** 후보 동은 로컬 순위에서 모두 "도시 조합 route 없음"이다. 첫 학교를 등록하면 그 도시의 조합 route(약 27개)와 hub 색인 조건이 켜지므로 `--promote`가 의도적으로 막는다 → 이 지역의 동 batch는 **도시 route 구조 결정이 먼저 필요**하다(이번 범위 밖, 첨부 조회 생략).
- **인천**(미추홀·남동·계양은 조합 route 있음) 3개 동 sampling:

| 동 | 학교 | HWP/HWPX | zip | PDF | 비고 |
|---|---|---|---|---|---|
| 미추홀구 관교동 | 6 | 관교여중(hwp 14, 교과별)·승학초(hwp)·남인천여중(hwp+zip) | 관교초 | 인명여고, 관교중(기등록) | 초·중 READY, 고 PDF |
| 계양구 계산4동 | 7 | 계산공고(hwp 3)·길주초(hwpx 6)·부현동초·신대초(hwp) | 계산중·계양고 | 계산여고 | 공고는 전문교과 위주 가능성 |
| 남동구 논현2동 | 6 | 논곡초·동방초 | — | 남동고(기등록)·금융고·논곡중·동방중(pdf 31) | 중·고 PDF → 제외 |

## Shortlist
| 순위 | 지역·동 | 학교 | CONFIRMED | READY(HWP/HWPX) | zip(내용 미확인) | PDF | 학교급 | 예상 색인 | 예상 noindex | 기존 cache | 위험 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **P1** | 서울 강남 역삼2동 | 4 | 4 | 3(진선여고 hwp2+hwpx3, 진선여중 hwp, 도성초 hwp) | 0 | 1(역삼중, 기등록) | 초·중·고 | 6 | 3 | 없음 | 진선여고 파일이 학년별인지 확인 필요 |
| **P2** | 인천 미추홀 관교동 | 6 | 6 | 3(관교여중 교과별 14, 승학초, 남인천여중) | 1 | 2(인명여고, 관교중 기등록) | 초·중(+고 PDF) | 6 | 5 | 없음 | 첫 인천 동 batch(지역 다양성), 고교 근거 없음 |
| **P3** | 서울 강서 염창동 | 5 | 5 | 2(염경초, 염경중) | 1(염창중 교과별 14) | 2(염동초·염창초) | 초·중 | 6 | 5 | 없음 | 염창중 zip 안 형식 미확인 |
| B1 | 경기 안양 갈산동 | 5 | 5 | 3(평촌과학기술고 hwp3, 안양남초, 덕현초) | 0 | 2(대안중·대안여중) | 초·고 | 6 | 5 | 없음 | 특성화고 → 공통과목만 사용 가능 |
| B2 | 인천 계양 계산4동 | 7 | 7 | 4(계산공고, 길주초, 부현동초, 신대초) | 2(계산중·계양고) | 1(계산여고) | 초·중·고(zip 의존) | 6 | 6 | 없음 | 중·일반고가 zip 안 형식에 달림 |
- 그 밖에 수서동·잠실7동·서초2동·신사동(초·중 HWP 2곳씩, 고 PDF), 흥도동(초 2 HWP/HWPX, 고 zip, 중 PDF)은 차순위.
- 예상 noindex는 기등록 학교를 뺀 신규 등록 수(PDF 학교도 3차 공시가 받아지면 `--promote`가 학교 페이지만 등록한다는 17·18차 규칙 기준).
- 추천: **PRIMARY 역삼2동 · 관교동 · 염창동**, **BACKUP 갈산동 · 계산4동**. 구현은 다음 작업.
