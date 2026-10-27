# SEO/GEO/AEO 최적화 1사이클 — 기준 표시 · 상담 맥락 · 공통 콘텐츠 압축 (2026-10-27)

근거 audit: `docs/qa/seo-geo-aeo-gap-audit-2026-10-27.md` (P1-2, P1-3, P1-4). 운영자 정보가 필요한 Candidate B(P1-1·P1-5)는 이번 사이클에서 건드리지 않았다.

# Baseline
- 시작: work = origin/work = `a8a6be0`, main = origin/main = Production = `1f4761b`, working tree clean.
- Routes 2742 / Sitemap 608 / Noindex 2132, region-dong GREEN 66/66, region-dong-subject GREEN 330/330, indexed RED 0.
- checkpoint: Phase A `11ba301` → Phase C `03dbec4` → Phase D `3c31d76` (각각 work branch push). main/Production 미변경.

# Phase A — Source / relationship context (`11ba301`)
- 새 컴포넌트 `src/components/PlanBasisNote.tsx`(서버 컴포넌트, JS 없음): intro 바로 아래 짧은 한 문단.
  > 학교알리미 2026학년도 2학기 평가계획(2026년 9월 공시) 원문 기준입니다. 교과설계소는 학교와 별개의 과외 서비스이며, 평가 일정은 학교 사정에 따라 바뀔 수 있습니다.
- 표시 조건: 페이지 출처에 `schoolInfoPlanSource`(학교알리미 평가계획 원문)가 있을 때만. `ContentSource.schoolInfoPlan` 표지를 이 함수만 붙인다. 학기·공시 시점은 `SCHOOLINFO_PLAN_TERM` 한 곳에서 가져와 출처 라벨과 문구가 어긋날 수 없다.
- 적용 페이지(데이터로 실측): 동 hub 66/66, 동×과목 330/330, 학교×과목 48(평가계획 출처가 있는 게시 entry, 모두 색인) → **색인 444페이지**. NEIS만 쓴 학교×과목(예: `/school/seocho-middle-school/math`)과 과목·학년·가이드 페이지에는 나오지 않는다.
- 동×과목 섹션 설명의 같은 내용("학교알리미에 공시된 … 바뀔 수 있습니다")은 상단으로 옮기며 삭제(중복 방지).
- 확인일: 데이터에 없어 표시하지 않았다(batch 날짜로 추정하지 않음).
- 줄 수: 360·390px 3줄, 1440px 2줄. 768px 동 페이지는 오른쪽 썸네일 열 때문에 4줄(학교×과목은 2줄).
- JSON-LD·route·robots 변화 없음. 학교 제휴로 읽히는 표현 없음("별개의 과외 서비스").

# Phase C — Consultation context prefill (`03dbec4`)
- `src/lib/consultContext.ts`: `consultHref({ subject, region, dong })` → `/consult?subject=…&region=…&dong=…`(slug만). `resolveConsultPrefill(search)` → 사이트 데이터(`getSubjectBySlug`·`getRegionBySlug`·`getDong`, 모두 `.find` 조회)와 대조해 폼 값(과목명·시도명·"강서구 화곡제4동"/"고양시 화정1동"/"수원 영통구")만 돌려준다. 모르는 값은 버린다.
- `ConsultCTA`에 `context` prop 추가. 맥락이 분명한 **13개 템플릿 CTA**에 전달: 동 hub, 동×과목, 시·도 hub, 시·구 hub, 구 hub, 시·구×과목, 시·구×학년, 시·구×학년×과목/구×과목, 지역 프로그램, 학교 hub, 학교×과목, 과목 hub, 과목 주제. 홈·학년·가이드·전국 프로그램 CTA와 header·모바일 고정 바는 `/consult` 그대로.
- `ConsultForm`: hydration 뒤 `useEffect`에서 `window.location.search`를 읽어 **빈 필드만** 채움(select는 실제 option 값일 때만). 값 설정은 이벤트를 발생시키지 않아 `consult_form_start` analytics가 오염되지 않는다. 학년은 페이지 맥락(학교급)과 폼 옵션(학년)이 1:1이 아니라 채우지 않았다. 학교명도 폼 필드가 없어 넣지 않았다.
- `/consult`는 여전히 정적(○) 페이지: 쿼리 유무와 관계없이 HTML이 바이트 단위로 같고(plain·정상·악성 쿼리 3종 비교), canonical `/consult`, sitemap 608 그대로(쿼리 URL 없음). analytics는 pathname만 비교하므로 `consult_cta_click` 분류가 그대로다.
- 테스트
  - node:test `src/lib/consultContext.test.ts` 4건 PASS(빈 맥락, 동·시·구·구 단계, 잘못된 과목·지역, `<script>`·`"><img onerror>`·`__proto__`/`constructor`, 다른 시의 동).
  - 브라우저 10건: 직접 `/consult` 빈 폼 / `?subject=math` → 수학 / 동×수학 CTA 클릭 → 수학·서울·강서구 화곡제4동 / 시·구×과목 CTA → 수학·서울·강서구 / 학교×과목 CTA → 영어·서울·강남구 도곡2동 / 잘못된 과목·지역 무시 / 특수문자 무시(오류 0) / 맥락 없는 페이지 `/consult` 유지 / 제출 payload 키 불변(`agree,availableTime,cityDetail,grade,message,phone,province,studentName,subject,submissionId`, 요청은 가로채서 실제 전송 안 함) / 모바일 고정 바 링크 `tel:`·`/consult` 불변. 사용자가 바꾼 값은 덮어쓰지 않음.
- 표현: 이 변경은 **입력 마찰 감소를 목표로 한 변경**이다. 전환 변화는 analytics 데이터로 확인해야 하며 아직 측정하지 않았다.

# Phase D — Repeated guidance reduction (`3c31d76`)
- 대상: 동×과목 템플릿(`DongSubjectView`) 한 곳 → 330페이지.
- 바꾼 것
  - "학년별 {과목} 학습 전략"(학교급별 playbook 포인트 제목+본문 최대 9개)과 "시험 4주 전부터의 {과목} 학습 계획"(4단계 본문)을 **"학년별 {과목} 준비와 시험 대비"** 한 섹션으로 합침.
    - 학교급별 포인트는 제목만 남기고 각 제목을 같은 본문이 있는 학년 페이지로 연결(`/grade/middle/2`처럼, 대상 페이지가 `focusPoints`에서 같은 포인트를 보여줌).
    - 시험 대비는 단계 이름("시험 4주 전 → 3주 전 → 2주 전 → 1주 전")과 링크 2개: 같은 시·구×과목 페이지(4단계 본문 전체), 과목 hub의 내신 대비 체크리스트.
  - "수업은 이렇게 진행합니다"는 남기되 단계 제목만 두고 과목 hub로 "학습 방식 자세히 보기" 연결(서비스 설명 유지).
- 유지: 학교별 평가계획 notes, 학교 목록, 동 지역·학교 정보, 관련 링크 4묶음, 출처, CTA. 삭제한 정보는 모두 링크 대상 페이지에 그대로 있다. 새 guide route 없음.
- 새 섹션 링크 16종(학년 하위 6, 시·구×과목, 과목 hub 등) 전부 200, broken 0.

# Before / After
| 항목 | Before | After |
|---|---|---|
| A. 기준·관계 표시 | 없음(출처 목록 하단에 학기·공시 월만) | 템플릿 3종, 색인 444페이지 상단 |
| C. 맥락 전달 CTA | 0 (모든 CTA `/consult`) | 13개 템플릿, prefill 10/10 |
| D. 동×과목 공통 섹션 | 학년 전략 본문 + 4주 계획 본문 + 진행 5단계 본문 | 학년 포인트 제목·시험 단계 이름·진행 단계 제목 + 전문 페이지 링크 |
| 대표 7페이지 본문(자) | 1,982~3,774 | 1,842~3,259 |

# Similarity
측정: `<main>` 본문을 문장(25자 이상)으로 나눠, 같은 과목의 다른 동×과목 페이지 25곳 중 어딘가에 글자 그대로 있는 문장 비율. Before = Production `1f4761b`, After = 로컬 build `3c31d76`.

| 페이지 | Before | After |
|---|---|---|
| 청담동 국어 | 8/25 (32%) | 4/20 (20%) |
| 방배4동 영어 | 16/32 (50%) | 5/20 (25%) |
| 화곡제4동 수학 | 16/31 (52%) | 5/19 (26%) |
| 개포1동 사회 | 7/20 (35%) | 3/15 (20%) |
| 화정1동 과학 | 8/21 (38%) | 3/16 (19%) |
| 상동 국어 | 8/24 (33%) | 3/19 (16%) |
| 송산2동 수학 | 16/35 (46%) | 4/23 (17%) |

- 남은 공통 문장: Phase A 기준 문구 2문장(의도된 공통 문구), 학년 포인트 제목 묶음 1개, 관련 가이드 링크 제목 1~2개.
- audit 때 쓴 7페이지 상호 비교(서로 다른 과목 포함)로는 화곡제4동 수학 55%→21%, 송산2동 수학 49%→17%. 같은 과목 비교 대상이 표본에 없는 영어·사회·과학은 이 방식으로는 공통 문장이 적게 잡히므로 위 같은 과목 비교를 기준으로 삼았다.
- Quality Gate 유사도(intro·notes 기준)는 바뀌는 입력이 없어 그대로다(region-dong 66/66, region-dong-subject 330/330 GREEN, threshold 변경 없음).

# Validation
- lint PASS, typecheck PASS, node:test 8/8(consultContext 4 + operating 4), validate:quick PASS(각 Phase).
- 최종 `validate:full` **PASS**: Lint·Typecheck·Config·콘텐츠·품질 게이트(region-dong GREEN 66/66, region-dong-subject GREEN 330/330, AMBER·RED 0, indexed RED 0)·Quick·Build·Routes 2,742·Sitemap 608·Noindex 2,132·Broken 0·Orphan 0·Metadata 중복 0·Search smoke·Consult API smoke. Index→noindex 링크 비율 29.2% → 27.9%(info, 색인 학년·과목 페이지로 가는 링크가 늘어서).

# Render
- 로컬 production 서버(`next start`, 최종 build) 18페이지 × 390/768/1024/1440 = **72건**: 가로 넘침 0, 깨진 이미지 0, 콘솔·page·네트워크 오류 0, H1 1개.
  - 홈, 과목 hub(대조군), 동 hub 3(청담동·화곡제4동·화정1동), 동×과목 7, 학교×과목 3(NEIS만 쓴 서초중 수학 포함), `/consult`, `/consult?…` 정상, `/consult?…` 잘못된 값.
- HTTP: 모두 200, canonical self(`/consult?…`도 `/consult`), robots 기존과 같음, OG 4종, JSON-LD 개수 변화 없음, BreadcrumbList 있음. 기준 표시는 계획 출처 페이지에만, 맥락 CTA는 맥락 있는 템플릿에만.
- 미작성 조합 3건(`…/hwagok4-dong/physics`, `…/gaepo1-dong/history`, `…/hwajeong1-dong/chemistry`) 404 + noindex.
- Phase D 단계별 확인(5페이지 × 4폭 = 20건): heading 건너뜀 0, 빈 섹션 0, 섹션 순서(준비·시험 대비 → 수업 진행 → 참고 자료) 유지. 새 링크 목록은 기존 학교 목록·관련 링크와 같은 text-sm 링크 패턴.

# SEO inventory
| | Before | After |
|---|---|---|
| Routes | 2742 | 2742 |
| Sitemap | 608 | 608 |
| Noindex | 2132 | 2132 |
| region-dong / region-dong-subject | GREEN 66/66 · 330/330 | GREEN 66/66 · 330/330 |
| indexed RED | 0 | 0 |
- route inventory 비교(batch 18 상태 vs 각 Phase 후): 추가 0, 삭제 0, 플래그 변경 0, indexed→noindex 0, sitemap 누락 0·누수 0.

# Remaining P1
실제 운영 정보 없이는 구현하지 않는다(허위 작성 금지).
- 사업자·운영 주체 정보(사업자명·등록번호·주소·이메일 — `siteConfig` 값이 비어 footer에 표시되지 않음), 소개 페이지.
- 개인정보처리방침: 개인정보 보호책임자, 시행일, 처리 위탁(상담 신청 → Google Sheets·이메일 알림).
- 선생님 매칭 방식, 방문/화상 수업 가능 범위, 상담 신청 후 연락 시점.

# Next recommendation
1. 이번 최적화(3 checkpoint)의 Production 배포 판단: 배포 전 audit(이번 QA 수치 재확인) → main fast-forward → Production sitemap 전체 smoke.
2. 운영 정보가 확보되면 Trust(P1-1·P1-5).
3. 신규 batch부터 학교별 비교 요약(표) 구조 검토(audit Candidate E).
4. 그 다음 19차 지역 확장(흥도동·염창동·수서동 후보).
