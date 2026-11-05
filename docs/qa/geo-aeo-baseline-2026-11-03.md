# GEO/AEO Measurement Baseline (2026-11-03)

파일럿: `docs/qa/geo-aeo-pilot-2026-11-03.md`. Primary = `/school/jamsil-high-school/1/korean`, 파일럿 5 URL은 그 문서 Pilot Scope 참고.

규칙: 실측값만 적는다. 측정하지 못한 항목은 0이나 추정치를 쓰지 않고 상태로 표시한다.

- **NOT_MEASURED** — 측정 방법은 있으나 이번에 측정하지 않음(사람이 수행해야 함)
- **NOT_CONNECTED** — 데이터 출처가 이 환경에 연결되어 있지 않음
- **NOT_AVAILABLE** — 아직 존재할 수 없는 값(예: Production 반영 전 GEO 효과)

기준 시점: 2026-11-03, GEO 파일럿은 **work branch에만 있음**(Production 반영 전). 따라서 아래 baseline은 “GEO 적용 전(Before)” 상태다.

| Metric | Baseline | Source | Status | Recheck Date |
|---|---|---|---|---|
| Prompt Mention Rate (Primary, 10 prompts) | — | 수동 Prompt Audit (`docs/qa/geo-prompt-audit-template.csv`) | NOT_MEASURED — ChatGPT·Gemini·Perplexity·Copilot 접근/자동화 없음 | T0 직전 1회 + T0+7/14/30 |
| Citation Rate (Primary, 10 prompts) | — | 같은 audit | NOT_MEASURED | 같음 |
| Cited Pages | — | 같은 audit | NOT_MEASURED | 같음 |
| Answer Quality (0~3 평균) | — | 같은 audit, 내부 reviewer | NOT_MEASURED | 같음 |
| AI Assistant Sessions | — | GA4 (AI referrer 채널 그룹) | NOT_CONNECTED — Production에 GA4/GTM 태그 없음 | GA4 연결 후 |
| AI CTA conversions (consult_cta_click·consult_form_start·consult_submit_success) | — | GA4 이벤트 (기존 이름) | NOT_CONNECTED | GA4 연결 후 |
| GSC impressions (파일럿 5 URL) | — | Search Console page 필터 | NOT_CONNECTED — 이 세션에서 접근 불가(사용자 Chrome 세션 필요). 참고: 사이트 전체 2026-10-29 감사 = 노출 36·클릭 3 (`docs/qa/gsc-performance-audit-2026-10-29.md`), 파일럿 URL 값 아님 | 2026-11-24 GSC 재측정 때 함께 |
| GSC clicks (파일럿 5 URL) | — | 같음 | NOT_CONNECTED | 같음 |
| GSC CTR (파일럿 5 URL) | — | 같음 | NOT_CONNECTED | 같음 |
| indexed pages (sitemap URL 수) | Production 984 / work 1,146 | Production `sitemap.xml` 실측(2026-11-03) / validate:full | MEASURED | T0, T0+30 |
| 파일럿 5 URL의 Production 상태 | 5/5 sitemap 포함 | Production `sitemap.xml` | MEASURED | T0+7 |
| indexed RED | 0 | validate:quick / validate:full Quality Gate | MEASURED | 매 배포 |
| pilot page quality (내부 readiness) | 5/5 페이지 11/11 | `checkSchoolGradeGeo().readiness` | MEASURED (내부 QA, 검색·AI 지표 아님) | 콘텐츠 변경 때 |
| pilot Quality Gate nearest | 9.8~15.6% (전부 GREEN) | `scripts/lib/quality-gate.ts` (답변 포함) | MEASURED | 매 배포 |
| GEO 효과(After) | — | 위 항목들의 T0 이후 값 | NOT_AVAILABLE — Production 미반영 | T0+30 |

## GSC와 GEO 지표의 구분

GSC impressions·clicks·CTR·position은 Google 검색 결과의 SEO 성과다. AI 답변에서의 언급·인용(GenAI visibility)과 다르며, GSC 값을 AI citation이나 GenAI exposure로 부르지 않는다. GenAI 쪽은 수동 Prompt Audit(Mention/Citation/Cited Page/Answer Quality)과 GA4 AI referral 세션으로만 본다.

## 30-Day Before/After 일정

| 시점 | 날짜 | 할 일 |
|---|---|---|
| Before | T0 직전(Production 반영 전날까지) | Prompt Audit 10개 × 측정 가능한 플랫폼 수동 1회, CSV 기록. GSC 파일럿 5 URL 28일 값 기록 |
| T0 | Production 반영일 (미정 — 승인 필요) | 반영 커밋·배포 ID 기록 |
| T0+7 | T0 + 7일 | Prompt Audit 재측정, index 상태(5 URL) 확인 |
| T0+14 | T0 + 14일 | Prompt Audit, GSC page 값 |
| T0+30 | T0 + 30일 | 전 항목 비교: Mention·Citation·Cited Page·AI referral·CTA·form·GSC·index·그 사이 콘텐츠 변경 |

오늘(2026-11-03)이 T0라면 T0+7 = 2026-11-10, T0+14 = 2026-11-17, T0+30 = 2026-12-03.

측정 수가 0인 비율은 0%가 아니라 NOT_MEASURED로 적는다. 예측·목표 수치는 적지 않는다.

## T0 기록 (2026-11-05)

- T0 = 2026-11-05: GEO 파일럿을 포함한 `a07e54b`가 Production에 반영됨(GitHub deployment 7566119896). 이어서 IndexNow 키 파일 `571eaf1` 배포(7566667061), 신규 162 + 파일럿 5 = 167 URL을 IndexNow(Naver 엔드포인트)로 1회 전송, 응답 200.
- Before 측정은 배포 전에 하지 못했다. 아래 Prompt Audit은 **T0 당일(배포 약 1시간 후)** 측정값이다. AI 답변이 새 페이지를 반영하기 전일 가능성이 높지만 확인할 방법은 없으므로 "T0 당일 값"으로 기록한다.
- 재측정: T0+7 = 2026-11-12, T0+14 = 2026-11-19, T0+30 = 2026-12-05.

### Prompt Audit T0 — Perplexity (`docs/qa/geo-prompt-audit-2026-11-05.csv`)

| Metric | 값 | 비고 |
|---|---|---|
| 측정 플랫폼 | Perplexity 1곳 | ChatGPT·Gemini·Copilot: NOT_MEASURED. Perplexity는 앱 내 브라우저의 기존 세션(로그아웃 아님)이라 개인화 가능성 있음 |
| Mention Rate | 0/10 | 교과설계소 브랜드 언급 0 |
| Citation Rate | 1/10 | JS1K-02에서 gyogwaseolgye.com 동×과목 페이지 2개 인용. 파일럿 URL 인용 0 |
| Cited Pages | `/region/seoul/songpa/jamsil4-dong/korean`, `/region/seoul/songpa/jamsil2-dong/korean` | |
| Answer Quality (사실형 7개 평균) | 5/21 = 0.71 | 0~3 척도. 추천형 3개(JS1K-08~10)는 사실 채점 제외 |
| 변동성 메모 | JS1K-01 재질의 1회에서는 gyogwaseolgye 인용 발생 | 1회 측정이라 통계적 결론 아님 |
