# GEO/AEO Pilot — 학교×학년×과목 질문형 Answer Block (2026-11-03)

work branch only. main·Production 반영 없음(별도 승인 필요). 측정 기준선은 `docs/qa/geo-aeo-baseline-2026-11-03.md`.

# Goal

AI 검색·답변 엔진이 교과설계소 페이지의 내용을 **이해·요약·인용하기 쉬운 구조**로 만든다: 질문형 heading → 2~4문장 즉답 → 그 답의 근거가 된 공식 평가계획 행 → 출처 링크 → 원문 대조·답변 작성 날짜. 문단 하나만 떼어 읽어도 학교·학년·과목과 근거가 함께 남게 한다.

이 작업은 AI 노출·인용을 **보장하지 않는다**. 목표는 인용되기 쉬운 evidence-backed 구조이고, 효과는 Prompt Audit·AI referral·GSC로 30일 동안 따로 측정한다. 기존 SEO(title·description·canonical·robots·sitemap·내부 링크·JSON-LD·Quality Gate)는 그대로 둔다.

# Current SEO Architecture

| 항목 | 현재 구현 (audit 결과) | GEO에서 재사용 |
|---|---|---|
| URL | `/region/{province}/{city}/{dong}(/{subject})`, `/school/{slug}(/{subject}\|/{grade}(/{subject}))` | 변경 없음, 신규 route 0 |
| 학년×과목 렌더 | `src/components/school/SchoolGradeSubjectPage.tsx`: 히어로(H1·intro·PlanBasisNote) → 반영 비율(AssessmentList) → 시험 준비 notes → EvidenceSection(FIELD/CASE, 현재 0건) → ConsultCTA → 관련 링크 → SourceList | 같은 페이지에 섹션 1개 추가 |
| 데이터 | `src/data/schoolGradeSubjectContent.ts` — assessments(name·kind·weight·timing·method·course), notes, sources(schoolInfoPlanSource), planTerm "2026-2" | 근거 행·notes를 그대로 참조 |
| 출처 | `ContentSource{label,url,schoolInfoPlan}` — 학교알리미 공시 URL 실존 | 답변마다 같은 출처 링크 표시 |
| 검증 날짜 | 행 단위 verifiedAt 필드 **없음**. 학기 기준(`SCHOOLINFO_PLAN_TERM`)과 재검증 기한(2027-04-30)만 있음 | `planCheckedAt` = 해당 entry가 처음 커밋된 날(git), build 날짜 사용 안 함 |
| 저자 | editorial author 모델 **없음** | 가짜 저자 만들지 않음 — 날짜만 표시 |
| FAQ | `FAQAccordion` + `faqSchema()`(일반 FAQ, 학교 hub에서 사용) | 재사용 안 함(아래 FAQ Schema 정책) |
| JSON-LD | 학년×과목 페이지: BreadcrumbList·EducationalOrganization·WebSite | 변경 없음 |
| Quality Gate | `scripts/lib/quality-gate.ts` — 이름 마스킹 token LCS, GREEN ≤30%, RED >60% | 파일럿 페이지는 답변 텍스트까지 포함해 채점(임계값 불변) |
| 분석 | `src/lib/analytics.ts` trackEvent(consult_cta_click·phone_click·kakao_click·consult_page_view·consult_form_start·consult_submit_success/failure), `GoogleAnalytics.tsx`는 `NEXT_PUBLIC_GA_MEASUREMENT_ID`가 있을 때만 동작 | Production HTML에 gtag·GTM 없음(2026-11-03 확인) → NOT_CONNECTED |
| GSC | 사용자 Chrome 세션으로만 읽기 가능(이 노트북 세션 아님), API 토큰 없음 | NOT_CONNECTED |

# GEO/AEO Principles

1. 기존 URL·색인 구조 유지, 신규 GEO 전용 URL 없음.
2. 질문은 그 페이지의 공식 데이터가 답할 수 있는 것만. 일반 FAQ 템플릿 복사 금지.
3. 답의 모든 숫자는 화면에 보이는 근거 행이나 해당 notes에 있어야 한다(validator 강제).
4. 답변 첫 문장 단독으로 학교·학년·과목·핵심 답이 성립.
5. 날짜는 실제 데이터 시점. 매 build 날짜 갱신 금지.
6. 정보 → 근거 → 추가 설명 → 상담 CTA 순서. 답변 아래에 광고성 CTA를 반복하지 않는다.
7. 보장 표현 금지(“AI에 인용됩니다”, “상위 노출” 등) — validator 금지어.

# Education Material Mapping

GEO Day2 교육자료는 **방법론과 audit 구조만** 사용했다. 교육자료의 예시 수치·더미 데이터는 어디에도 옮기지 않았다.

| 교육자료 개념 | 이 repo에서의 구현 |
|---|---|
| 질문형 Heading | `GeoAnswerSection` — `article > h3` 질문 |
| Answer Block | `h3` 바로 아래 `p` 2~4문장 |
| Evidence Block | 같은 `article` 안의 “근거 (평가계획 반영 비율 표)” 목록 — 데이터 행에서 렌더 |
| Source | `cite > a` 학교알리미 공시 링크(기존 sources URL) |
| Author / Updated | 저자 없음(모델 없음). `원문 대조 반영`·`답변 작성` 두 날짜를 `<time>`으로 |
| CTA | 기존 ConsultCTA 위치 유지(정보 섹션 뒤), 기존 이벤트 이름 그대로 |
| Mobile usability | 390/768/1440 render QA, 카드 높이 측정 후 질문 수 조정 |
| Page Audit | `scripts/lib/geo-check.ts` readiness boolean 11개 |
| Prompt Audit / Brand Mention Rate / Citation Rate / Cited Page / Answer Quality | `data/geo/prompt-audit-2026-11-03.json` + `docs/qa/geo-prompt-audit-template.csv`, 정의는 아래 Prompt Audit |
| AI Assistant Sessions / conversion | GA4 측정 명세(아래 Analytics). 현재 NOT_CONNECTED |
| GenAI visibility tracking | 외부 도구 없음 → 수동 Prompt Audit으로 대체(차이는 Analytics 절) |
| Before / After, 30-day | baseline 문서 + 아래 30-Day Measurement |
| “한 페이지 · 질문 10개 · 30일” | Primary 1페이지 · Prompt 10개 · T0+30일 재측정 |

# Pilot Scope

whitelist = `src/data/schoolGradeGeo.ts`에 entry가 있는 페이지만. 다른 학년×과목 페이지는 렌더 결과가 바뀌지 않는다.

선정 기준: indexed · Quality Gate GREEN · 학교알리미 OFFICIAL 원문 · 시기/방법 행 충분 · 서로 다른 학교·지역·과목 · **이미 Production sitemap에 있는 URL**(측정 가능) · 데이터 중복도 낮음(QG nearest 10~16%).

| # | URL | 지역 | 과목 | 질문(노출) |
|---|---|---|---|---|
| **Primary** | `/school/jamsil-high-school/1/korean` | 서울 송파 | 국어(공통국어2) | 3 |
| 2 | `/school/jukjeon-high-school/2/math` | 경기 용인 | 수학(미적분Ⅰ) | 3 |
| 3 | `/school/hadan-middle-school/2/english` | 부산 사하 | 영어 | 3 |
| 4 | `/school/gyeonganyeoja-middle-school/2/science` | 경북 안동 | 과학 | 3 |
| 5 | `/school/mugeo-middle-school/3/social` | 울산 남구 | 사회(사회·역사) | 2 |

Primary를 먼저 만들고 validate:quick(Quality Gate 포함)·render 검수를 통과한 뒤 나머지 4개를 추가했다. Primary는 처음 4문항이었으나 390px에서 카드 4개가 반영 비율 표를 약 2,900px 아래로 밀어서, 표와 내용이 겹치는 “수행평가 일정·방식” 문항을 화면에서 빼고 Prompt Audit(JS1K-02)으로만 남겼다.

# Question Model

- 질문 = 그 페이지의 평가계획 행/notes가 직접 답하는 것만. 각 페이지의 첫 질문은 그 학교 자료의 고유한 특징에서 시작(잠실 국어: 지필·수행 비중 / 죽전 미적분: 1차 논술형 24점 / 하단중 영어: 구술평가 / 경안여중 과학: 센서 서술형 과제 / 무거중: 사회·역사 분리 평가).
- 질문에는 학교명·학년·과목(또는 과목명 그대로의 course)이 들어간다 — 질문 heading만 떼어도 문맥이 남는다.
- 같은 질문 문형이 학교명만 바뀌어 반복되지 않도록 validator가 이름·숫자 마스킹 후 동일 질문을 막는다.
- Primary는 질문 후보 10개(=Prompt Audit 10개)를 만들고, 페이지에는 가치가 큰 3개만 노출했다.

# Answer Block

- 2~4문장, 60~400자. 첫 문장 = 직접 답(학교·학년·과목 포함), 이후 = 숫자/평가 방식 → 실무적 의미.
- 해석은 notes에 이미 있는 내용(예: “두 수행평가는 같은 평가요소를 글과 말로 본다”)만 쓰고, 그 경우 `noteRefs`로 근거에 연결한다.
- 금지: 난이도·합격·성적 향상·학원·후기 표현(기존 BANNED), 개인정보(PII), 보장 표현, placeholder.

# Evidence Block

`evidence: [{ name, course?, detail? }]` — 평가계획 행 이름으로만 참조하고, 화면 문장은 `geoEvidenceLine()`이 행 데이터에서 만든다(`[과목] 이름 비율% · 시기 (· 방법)`). 새 근거 텍스트를 손으로 쓰지 않는다. `detail`은 답이 평가 방법(배점·유형)을 쓸 때만 켠다(모바일 길이). notes를 쓴 답은 “평가계획 정리: {note 제목}”으로 아래 섹션을 가리킨다.

# Source Model

출처는 기존 `schoolInfoPlanSource` 그대로: 기관(학교알리미) · 자료명(학교명 교과별(학년별) 교수·학습 및 평가계획) · 기준 학기(2026학년도 2학기) · 공시 시점(2026년 9월 공시) · 실제 URL. URL을 새로 만들지 않았다.

# Updated/Verified Model

| 필드 | 의미 | 값의 출처 |
|---|---|---|
| `planCheckedAt` | 평가계획 행을 원문에서 읽어 사이트에 반영한 날 | 그 entry가 `schoolGradeSubjectContent.ts`에 처음 커밋된 날(`git log -S`): 5개 모두 2026-11-02 |
| `answersUpdatedAt` | 질문·답변을 쓰거나 고친 날 | 2026-11-03 |

둘 다 데이터에 고정된 값이라 build·배포 때 바뀌지 않는다. validator: ISO 날짜, 미래 금지, planCheckedAt ≤ answersUpdatedAt. 2027-04-30 학기 재검증 기한(기존)은 그대로 적용된다.

# Citation Readiness

내부 QA 지표일 뿐이며 검색 순위나 AI 인용 지표로 노출하지 않는다. `checkSchoolGradeGeo().readiness` (페이지별 boolean):

question_present · direct_answer_present · answer_self_contained · official_evidence_present · source_visible · verified_date_present · clear_heading(질문 ≤60자) · semantic_html · internal_link_present · cta_present · figures_supported

결과(2026-11-03): **5/5 페이지 11/11 true.** semantic_html·internal_link_present·cta_present는 컴포넌트 구조로 보장되는 값이라 상수 true로 표시하고, render QA에서 따로 확인했다.

## GEO validator (`scripts/lib/geo-check.ts`, validate:quick에 연결)

검사: 질문 “?”·문맥 / 답 문장 수·길이 / 첫 문장 문맥 / evidence 행·note 실재 / 다과목 entry의 course 지정 / **답의 모든 숫자가 보이는 근거 행·참조 notes·참조 비율 합계에 있음** / **모든 N%가 참조 비율·합계·근거에 보이는 %와 일치** / 금지어·PII·브랜드·보장 표현·placeholder / 학교알리미 출처 URL / 날짜 / Primary 정확히 1개 / 페이지당 ≤6문항 / 페이지 간 동일 마스킹 질문 0 / 마스킹 답변 유사도 ≤30%.

음성 시험(일부러 깨뜨린 7가지 — 근거 없는 숫자, 틀린 %, 문맥 없는 답, OOO, 인용 보장 문구, 미래 날짜, 없는 근거 행): **7/7 검출**.

기존 Quality Gate 임계값은 바꾸지 않았다. 대신 파일럿 페이지는 질문·답변을 포함한 텍스트로 채점하도록 QG 입력만 넓혔다(더 엄격해지는 방향).

## Duplicate / Template Risk

| 측정 | 결과 |
|---|---|
| 파일럿 간 마스킹 답변 최대 유사도 | 25.5% (1차 작성 때 잠실 국어 ↔ 죽전 미적분 31%로 validator FAIL → 죽전 답 문장 구조를 바꿔 해소) |
| 파일럿 간 동일 마스킹 질문 | 0 |
| QG(답변 포함) nearest — 기존 학년×과목 전체와 비교 | 잠실 11.9% · 죽전 11.9% · 무거 13.6% · 하단 15.6% · 경안여 9.8%, 전부 GREEN |
| school-grade-subject 전체 | GREEN 306 / AMBER 5 / RED 0 (변화 없음), indexed RED 0 |

## FAQ Schema 정책

FAQPage JSON-LD는 **추가하지 않았다.** 이유: (1) 화면의 Q&A가 핵심이고 FAQ schema가 AI 인용을 보장하지 않는다, (2) 학년×과목 페이지에는 원래 FAQPage가 없어 새 rich-result 실험이 SEO 변수로 섞인다, (3) 숨겨진 schema 금지 원칙. Rollout 단계에서 화면 Q&A와 1:1로 같은 텍스트일 때만 다시 검토한다.

## Semantic HTML

`section > h2` (페이지당 1개) → 질문마다 `article > h3 + p + (p + ul) + p > cite > a + p > time×2`. H1은 기존 1개 그대로, heading 순서 H1→H2→H3→H2(반영 비율)… 건너뜀 없음(render QA 측정).

# Prompt Audit

Primary 페이지 기준 10개: `data/geo/prompt-audit-2026-11-03.json` (정보형 2 · 수행평가형 2 · 시험대비형 2 · 비교형 1 · 지역형 2 · 추천형 1). `brandExpected`/`citationExpected`는 audit 의도 표시일 뿐 AI가 브랜드를 말해야 한다는 뜻이 아니다. 결과 기록: `docs/qa/geo-prompt-audit-template.csv` (date·platform·promptId·prompt·brandMention·citation·citedUrl·answerQuality·notes).

정의:

- **Mention Rate** = 교과설계소가 언급된 prompt 수 / 측정한 prompt 수
- **Citation Rate** = gyogwaseolgye.com URL이 출처로 제시된 prompt 수 / 측정한 prompt 수
- **Cited Page** = 실제로 제시된 URL(경로까지)
- **Answer Quality** = 내부 reviewer 점수 0~3: 0 틀림/무관 · 1 일부 맞음(학교·학년·과목 중 하나 틀림) · 2 사실은 맞으나 근거 없음 · 3 공식 근거와 일치하고 출처 명시
- 측정 수가 0이면 0%가 아니라 **NOT_MEASURED**.
- 절차: 플랫폼마다 로그아웃/새 대화(개인화 최소화), prompt 원문 그대로 1회, 응답 전문 캡처를 별도 보관, 같은 날 같은 순서.

# Analytics

- **GA4**: 코드 경로는 준비되어 있으나(`GoogleAnalytics.tsx`, `trackEvent`) Production에 측정 ID가 없다 → **NOT_CONNECTED**. GA4 켜기는 `/privacy`의 쿠키 고지 갱신이 함께 필요하다(컴포넌트 주석). 이번 작업에서 analytics 도입·secret 추가는 하지 않았다.
- **AI referral 구분 명세**(GA4 연결 후): 세션 source/referrer가 `chatgpt.com`·`chat.openai.com`·`perplexity.ai`·`gemini.google.com`·`copilot.microsoft.com`·`bing.com/chat`·`claude.ai` 이거나 `utm_source=chatgpt.com`인 세션을 “AI Assistant” 채널 그룹으로 묶는다. 리포트 = landing page × sessions × engaged sessions × consult_cta_click × consult_form_start × consult_submit_success. 이벤트 이름은 기존 것을 그대로 쓴다(새 이벤트 없음).
- **GSC는 SEO 지표**(검색 결과의 노출·클릭·CTR·순위)다. GSC 값을 AI citation이나 GenAI exposure라고 부르지 않는다. 교육자료의 GenAI visibility는 외부 측정 도구 또는 수동 Prompt Audit 결과이고, 이 repo에는 외부 도구가 없어 수동 Prompt Audit으로만 측정한다.

# Baseline

`docs/qa/geo-aeo-baseline-2026-11-03.md` — 2026-11-03 시점 실측값만, 나머지는 NOT_MEASURED / NOT_CONNECTED.

# 30-Day Measurement

T0 = 파일럿의 **Production 반영일**(아직 없음, 승인 필요). 재측정 T0+7 · T0+14 · T0+30. 오늘(2026-11-03) 반영된다고 가정하면 2026-11-10 · 2026-11-17 · 2026-12-03. 비교 항목: Prompt Mention · Citation · Cited Page · AI referral 세션 · CTA·form 이벤트 · GSC(파일럿 5 URL page 필터) · index 상태 · 그 사이 콘텐츠 변경 여부. 예측값은 적지 않는다.

# Rollout Gate

전국 확장(READY 페이지에 answers 추가) 전 모두 충족:

- [x] 파일럿 5개 GEO validator PASS
- [x] 기존 SEO validator(validate:quick) PASS, indexed RED 0
- [x] metadata·canonical 회귀 없음, 신규 route 0 (validate:full로 확인 — Validation 절)
- [x] build PASS, mobile render PASS
- [x] source/evidence 100% (14/14 답변)
- [x] duplicate risk 허용 범위(≤30%, 실제 25.5%)
- [ ] Primary Prompt Audit baseline 저장 — **NOT_MEASURED** (AI 플랫폼 연결 없음). 사용자가 수동 측정해 CSV에 남기기 전까지 전국 적용 금지
- [ ] Production 반영 승인 + T0+30 결과 검토

## Rollout Readiness (2026-11-03, `npx tsx scripts/geo-inventory.ts <Production sitemap 경로 목록>`)

indexed GREEN 학년×과목 306개:

| 분류 | 수 | 의미 |
|---|---|---|
| PILOT | 5 | 이번 파일럿 |
| READY | 175 | 시기·방법 행 충분, notes ≥2, QG nearest <25%, Production sitemap에 있음 |
| HOLD | 119 | Batch 30 등 work-only — Production 미반영이라 측정 불가 |
| NEEDS_EVIDENCE | 5 | 시기 또는 방법이 행의 절반 미만(경안여중 2 국어, 잠실고 2 영어·수학, 전주고 1 영어·사회) |
| DUPLICATE_RISK | 2 | 일신여고 1·2 영어(QG nearest 26.9%) |
| NO_DATA | 0 | |

READY 175는 21개 학교에 걸쳐 있다. 적용 순서 제안: 학교당 1페이지(과목 분산) → 측정 → 확대. 답변은 페이지마다 그 데이터로 쓰고 validator를 통과해야 한다(자동 생성 금지).

# 학년 hub 템플릿 위험 (분석만, 구현 안 함)

현상: 새 학교가 추가될 때마다 기존 색인 학년 hub의 nearest가 30% GREEN 경계 쪽으로 올라간다(Batch 30에서 일신여고 2·죽전고 1이 31%까지 → 새 학교 summary 문형 조정으로 29%/27%).

2026-11-03 측정(색인 학년 hub 41개): nearest **25% 이상 28개, 28% 이상 11개, 최대 29.3%**(정화여고 1). 30% 초과 0.

원인:

1. **공유 skeleton** — `buildSchoolGradeContent()` intro가 고정 2문장(“〔이름〕는 N학년 2학기 {과목들} 평가계획을 학교알리미에 공시했습니다. 수행평가 비중은 X가 N%로 가장 크고 Y는 M%입니다.”). intro는 hub 토큰의 12~16%뿐이지만 이웃 hub intro와 59~67% 같다.
2. **이름 마스킹 후 남는 공통어** — 카드의 summary·과제명에 “1차 정기시험”, “중간·기말 각 30%”, “수행 N개” 같은 평가계획 공통 용어가 많다. QG mask는 학교·지역명만 가리고 숫자는 그대로 두므로 숫자가 같으면 더 붙는다.
3. **같은 학교 다른 학년** — 일신여고 1↔2처럼 같은 학교의 학년 hub끼리 과제명·과목 구성이 같아 가장 가까운 이웃이 된다.
4. **데이터 희소** — 과목 2~3개 hub는 토큰이 90개 안팎이라 skeleton 비중이 커진다.
5. **nearest는 최대값** — hub 수가 늘수록 “우연히 가까운 짝”이 생길 확률이 커져, 개별 페이지가 그대로여도 점수는 단조 증가한다.

개선 설계안(별도 milestone, Opus 검토 대상):

- A. intro를 그 학년의 고유 사실(가장 큰 수행 과제명·시기, 과목 간 시험 일정 차이)로 시작하고 “학교알리미에 공시했습니다” 문장은 PlanBasisNote에 맡긴다(화면 정보 손실 없음).
- B. 카드에서 학년×과목 페이지의 summary를 그대로 반복하지 말고 과제명·시기만 보여 준다(같은 문장이 두 kind에 중복되는 것도 줄임).
- C. 같은 학교의 다른 학년 hub와의 유사도를 따로 보고(학교 내 비교) 다른 학교 비교와 분리해 원인을 보이게 한다 — QG 판정 변경이 아니라 진단 출력.
- D. 과목 2개 이하 학년 hub는 처음부터 index 후보에서 빼는 규칙 검토(현재도 다수가 AMBER noindex).
- 임계값 30%는 바꾸지 않는다.

# Risks

- 화면 텍스트가 늘어 모바일 스크롤이 길어짐 → 페이지당 2~3문항, 근거 행은 필요한 방법만 표시.
- 다른 페이지와 문형이 닮아 갈 위험 → validator 30% 제한 + QG에 답변 포함.
- 평가계획 학기 교체(2027-1) 때 답변이 낡음 → planTerm 재검증 기한(2027-04-30)과 함께 답변도 재작성 대상.
- Prompt Audit은 개인화·시점에 따라 결과가 흔들림 → 같은 절차·같은 날 측정, 표본 10개라 통계적 결론 아님.

# Non-goals

GEO 전용 URL, URL 이전, 전국 자동 적용, FAQPage schema, analytics 도입, AI 플랫폼 자동 호출, 가짜 저자·사례·수치, Production 반영.

# Holds

- Production 반영: 사용자 승인 필요.
- Prompt Audit baseline: NOT_MEASURED (플랫폼 접근 없음).
- GA4·AI referral: NOT_CONNECTED (측정 ID 없음, 개인정보처리방침 갱신 동반 필요).
- GSC page 단위 baseline: NOT_CONNECTED (이 세션에서 접근 불가).
- 학년 hub 템플릿 개선: 설계만.
- 광주·전남·세종, PENDING 159(404 유지), FIELD_ANALYSIS·CASE_BASED 0건: 변경 없음.

## 다음 지역 후보 (조사만, 콘텐츠 생성 없음)

`.cache/official/schoolinfo` 원문 캐시 기준:

| 순위 | 후보 | 학교(NEIS 코드) | 원문 형식 | 판단 |
|---|---|---|---|---|
| 1 | 경북 영천 금호읍 | 포은고(8750655) · 금호여중(8821056) | HWP 3 · HWP 3 | 중·고 모두 HWP, 새 시(영천) 1곳 |
| 2 | 충남 아산 온양5동 | 온양용화고(8140229) · 온양중(8181011) | HWP 4 · HWP 1+HWPX 2 | 아산 첫 동 — 새 city 등록(`--allow-new-city`) 필요 |
| 3 | 충북 청주 옥산면 | 양업고(8000090) · 옥산중(8011328) | zip 3(내용 미확인) · HWP 13 | 양업고는 zip 내부 형식·과목 구성 확인 전 |
| — | 경남 2차 · 강원 2차 | — | 원문 미수집 | NOT_RESEARCHED (NEXT_BATCH_TEMPLATE 1~2단계부터) |

# Validation

| 검증 | 결과 (2026-11-03) |
|---|---|
| lint / typecheck / test (node:test 11) | PASS |
| validate:quick | PASS — GEO/AEO pilot answers PASS (5 pages, 14 answers, max masked answer similarity 25.5%) |
| validate:full | **PASS** — Build PASS, Routes 13,870 / Sitemap 1,146 / Noindex 12,722 (**Batch 30 checkpoint와 동일 — GEO로 생긴 route 0**), indexed RED 0, broken 0, metadata 중복 0, orphan 0, search·consult smoke PASS |
| Quality Gate school-grade-subject | GREEN 306 / AMBER 5 / RED 0 — 파일럿 답변 포함 채점 후에도 변화 없음 |
| GEO 음성 시험 | 7/7 검출 |
| Render (Primary 390/768/1440, 나머지 4개 390/1440) | 가로 overflow 0, 카드 내부 overflow 0, H1 1, heading 건너뜀 0, 정보 섹션이 상담 CTA보다 앞, 답변마다 출처 cite 1·time 2, robots `index, follow`·canonical 자기 URL 유지. 비파일럿 페이지(잠실고 2 국어)는 GEO 섹션 없음 |
| 모바일 카드 높이 (390px) | 잠실 591/470/567 · 죽전 450/567/523 · 하단 495/494/475 · 경안여 515/474/495 · 무거 687/627 px |
| 긴 학교명·과제명 | “환경 문제 마인드맵으로 표현해 보기”, “광합성에 필요한 물질과 생산된 물질 알아보기” 등 줄바꿈 정상 |
| unsupported claim | 0 (validator: 모든 숫자·%가 보이는 근거와 일치) |
| 개인정보 | 0 (학생 이름·전화·이메일·상담 원문 없음, PII 정규식 통과) |
