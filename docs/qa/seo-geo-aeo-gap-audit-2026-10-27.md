# 교과설계소 SEO / GEO / AEO / Entity GAP Audit (2026-10-27)

AUDIT ONLY — 코드·콘텐츠·route 변경 없음. 근거는 현재 코드(`1f4761b`)와 Production(`https://gyogwaseolgye.com`) 렌더를 읽기 전용으로 측정한 값이다. 점수는 참고용이며 각 점수 옆에 근거를 적었다.

# Executive Summary

- **기술 SEO는 건강하다.** sitemap 608 URL 전부 200·`index, follow`·canonical self, sitemap 안 noindex 0, soft404 0, title/description 중복 0(직전 배포 crawl). 홈에서 링크만 따라가면 608개 모두 도달(최대 깊이 4, orphan 0). **P0 없음.**
- **사이트 자산의 65%(396/608)가 행정동 hub·동×과목 페이지**이고, 이 페이지들은 학교알리미 원문 수치(비율·과제·시기)를 학교별로 담아 사실 밀도가 높다. 다만 동×과목 페이지 본문 문장 중 **30~52%가 다른 동 페이지와 글자 그대로 같은 공통 섹션**(학년별 전략·시험 4주 계획·수업 진행 5단계)이다. Quality Gate는 intro·notes만 비교하므로 이 공통 비중은 측정하지 않는다.
- **가장 큰 빈틈은 브랜드·운영 주체 신뢰 정보**다. 소개(about) 페이지 없음, footer 사업자 정보 칸 비어 있음(`siteConfig.businessName` 등 빈 값), 개인정보처리방침에 보호책임자·시행일·처리 위탁(상담 신청은 webhook → Google Sheets·이메일) 기재 없음. 이 항목은 **사업 운영 정보 확인이 먼저 필요**하다.
- **GEO/AEO 기반은 이미 있다.** 동×과목 intro가 학교별 수치를 2문장으로 바로 답하고, 출처가 학교·학기·공시 월 단위로 표시된다. 부족한 것은 (1) 페이지 상단의 "기준" 표시(무엇을, 언제 기준으로 정리했는지, 학교와 무관하다는 관계), (2) 표·bullet 형태의 요약, (3) 서비스 사실 질문(매칭·방문 가능 지역·연락 시점)에 대한 직접 답이다.
- **판단: 19차 확장보다 기존 608 페이지 최적화 1 사이클을 먼저 권한다.** 템플릿 1곳 수정이 396~430 페이지에 한 번에 적용된다.

## Current baseline

| 항목 | 값 | 근거 |
|---|---|---|
| Git | work = main = origin = `1f4761b`, working tree clean | `git rev-parse` |
| Production | `1f4761b`, `/`·`robots.txt`·`sitemap.xml` 200, sitemap 608 | 시작 시 재확인 |
| Routes / Sitemap / Noindex | 2742 / 608 / 2132 | 직전 `validate:full` |
| Quality Gate | region-dong GREEN 66/66, region-dong-subject GREEN 330/330, indexed RED 0 | 직전 `validate:full` |
| sitemap 구성 | 동×과목 330, 동 hub 66, 학교×과목 49, 학교 47, 과목 하위 22, 시·구 19, 가이드 18, 학년 15, 시·구×학년×과목 15, 기타 27 | sitemap 분류 |
| 크롤 깊이 | 깊이 0:1 · 1:47 · 2:215 · 3:270 · 4:75, 미도달 0 | 홈에서 BFS(sitemap URL만) |

샘플: 페이지 유형별 50개(아래 Evidence). 동 페이지는 강남(청담동·개포1동), 서초(방배4동), 강서(화곡제4동), 경기(상동·화정1동·의정부 송산2동=가장 오래된 batch)를 섞었고, 과목은 국어·영어·수학·사회·과학을 고르게 골랐다. noindex 학교 페이지 4개 포함.

## SEO

**참고 점수 20/25**
- (+) 608/608 200·index·canonical self·누수 0, title·description 중복 0 (Production crawl).
- (+) 깊이 ≤4, 미도달 0, 동×과목 in-link 최소 5·중앙 6, 동 hub 최소 6·중앙 13 (BFS).
- (+) title = H1 정합: 예) title "강서구 화곡제4동 수학과외 | 학교별 2학기 수학 평가계획", H1 "강서구 화곡제4동 수학과외 / 학교별 2학기 수학 평가계획". H1 1개, H2→H3 순서 유지.
- (−) 동×과목 본문 문장의 30~52%가 다른 동 페이지와 같은 문장(화곡제4동 수학 16/31, 송산2동 수학 16/35, 청담동 국어 8/25). 대부분 "지역과 관계없이 공통" 섹션이다. 라벨을 붙여 정직하게 표시했지만, 페이지당 사실 비중을 낮춘다.
- (−) 색인 중인 얇은 페이지: 구 단위 district 4개(본문 약 200자, 링크 목록뿐: `/region/gyeonggi/suwon/yeongtong`), 시·도 province 3개(약 420자, 문장 50%가 서로 같음), 색인 학교 hub 47개(약 540자: H2 "○○학교 학생을 위한 안내" + 공통 FAQ 2개).
- (=) `region-program` 5개는 in-link 최소 1.

Technical 세부: robots.txt `Allow: /`, `Disallow: /api/`, sitemap 선언 있음. 미작성 조합은 404 + noindex. OG 4종(title·description·image·url) 전 샘플 존재. 검색(`SearchBox`)은 클라이언트 컴포넌트라 색인 대상 검색결과 URL이 없다(정상).

## GEO

**참고 점수 15/25**
- (+) 동×과목 intro는 독립적으로 인용할 수 있는 사실 문장이다. 예) "화곡제4동 수학은 한광고 1학년 공통수학2가 수행평가 50% 가운데 30%를 9월 초 문제해결 과제 하나에 두고…" — 고유명사(학교·과목·학년)를 대명사로 바꾸지 않는다.
- (+) 출처가 학교 단위로 구체적이다: "학교알리미 — 한광고등학교 교과별(학년별) 교수·학습 및 평가계획 (2026학년도 2학기, 2026년 9월 공시)", 행안부 행정동 코드(2026.10.12. 시행), NEIS 학교기본정보.
- (−) 핵심 수치가 note 1개당 150~250자 문단에 3~6개씩 들어 있어 표·bullet 구조가 없다. 학교×학년×(정기시험/수행평가/서·논술형) 비교는 문단을 읽어야 나온다.
- (−) "언제 확인했는지"(확인일·갱신일)가 페이지에 없다. 표시되는 날짜는 행정동 코드 시행일(2026.10.12)과 공시 월뿐이다. 오래된 batch(송산2동)는 그 날짜도 없다.
- (−) 브랜드 Entity가 페이지 안에서 약하다: 동 페이지 본문에 "교과설계소가 무엇을 하는 곳인지" 한 문장 정의가 없다(header·footer·CTA에만 있음).

## AEO

**참고 점수 11/20**

| 잠재 질문 | 현재 답할 수 있는 곳 | 평가 |
|---|---|---|
| ○○동 학교들의 수행평가 비중은? | 동×과목 intro·notes | 답 있음(숫자형). 상단 2문장에 바로 있음 |
| ○○중 시험 대비는 어떻게? | 학교×과목(49), 동×과목 notes | 학교 평가 구조는 답함. "준비 방법"은 공통 섹션 |
| 중학생·고등학생 준비는 어떻게 다른가? | 과목 hub "초등·중등·고등 수학, 무엇이 달라지나요" | 정의형 답 있음 |
| 국영수사과 모두 가능한가? | 홈·과목 FAQ "어떤 과목을 수업할 수 있나요?" | 답 있음 |
| 수업료는? | FAQ: "상담 이후 정확히 안내" | 숫자 없이 정직한 답(유지 권장) |
| 선생님은 어떻게 매칭·교체되나? | FAQ: 교체만 답함 | **매칭 기준·절차는 없음 → 사업 운영 기준 확인 필요** |
| 수업 가능한 지역은? 방문/화상? | 홈 "전국 어디에서든 상담" | **방문 가능 범위 불명확 → 사업 운영 기준 확인 필요** |
| 상담 신청 후 언제 연락이 오나? | 상담 페이지 "순차적으로 연락" | **소요 시간 없음 → 사업 운영 기준 확인 필요** |

- (+) FAQPage JSON-LD 질문이 모두 화면에도 보인다(샘플 전부 `faq n/n` 일치).
- (−) 동 hub·동×과목(396 페이지)에는 FAQ가 없다. 대신 공통 FAQ 세트(과목 범위·수업료·교체)가 과목·학교·프로그램 템플릿에 반복된다.

## Entity

**참고 점수 9/15**
- (+) 모든 페이지에 BreadcrumbList(홈 → 지역 → 시·구 → 동 → 과목)와 화면 breadcrumb이 일치한다.
- (+) 학교와의 관계를 "학교알리미에 공시된 … 평가계획"으로 표현하고, 제휴·협약·파트너 표현은 코드 전체에 없다(검색 확인). 사례 카드는 "특정 학생을 대상으로 한 후기가 아닌 … 예시"로 표시돼 가짜 후기 위험이 없다.
- (−) Organization JSON-LD가 최소형: `EducationalOrganization` + name·url·description·telephone만 있다. logo·contactPoint·areaServed·sameAs가 없고 Service 엔터티도 없다. 단 schema를 늘리는 것보다 **화면에 실제로 보이는 사실과 일치**시키는 것이 우선이다.
- (−) "교과설계소는 학교와 별개이며 공시 자료를 정리했다"는 명시 문장이 없다. 지금 문장만으로 오인 위험은 낮지만, 학교명이 H1·title에 반복되는 구조라 한 줄 명시가 있으면 관계가 분명해진다.
- (−) 레거시 slug와 교명 불일치: `/school/gangnam-middle-school` = 대치중학교(H1·H2는 정확). URL 이전은 하지 않는 것이 맞고(기존 색인 보호) 기록만 한다.

## Content / Trust

**참고 점수 7/15**
- (+) 공식 출처·학기·공시 월, 행안부·NEIS 출처가 페이지마다 있다. 가이드 페이지에도 "기준" 표기가 있다.
- (+) 수업료 등 확인되지 않은 숫자를 만들지 않았다.
- (−) 소개/운영 주체 페이지가 없다(라우트 목록에 `/about` 없음). footer는 사업자명·등록번호·주소·이메일 값이 비어 있어 표시되지 않는다.
- (−) 개인정보처리방침에 개인정보 보호책임자, 시행일, 처리 위탁(상담 신청 데이터의 Google Sheets 저장·이메일 알림)이 없다. 법적 기재사항 확인이 필요하다(운영자 판단).
- (−) 콘텐츠 검증 기준("학교알리미 원문을 표로 검산, 불일치 값 제외")이 docs/qa에만 있고 사이트에는 없다.

## Conversion UX

- (+) 상단 sticky header에 "무료 상담", 모바일 하단 고정 바(전화·무료 상담)가 모든 페이지에 있다. 전화는 `tel:` 링크.
- (+) 상담 페이지에 3단계 절차(신청 → 담당자 연락 → 맞춤 안내)와 짧은 폼(학년·과목·시도·동·이름·연락처·가능 시간·문의)이 있다.
- (−) 동·학교 페이지의 본문 CTA는 맨 아래 1개뿐이다(본문 안 첫 상담 링크 위치 = 본문 끝). 모바일 고정 바가 보완하지만, 데스크톱에서는 정보 확인 직후 CTA가 멀다.
- (−) **모든 CTA가 `/consult`로만 연결**되고 페이지 맥락(지역·동·과목·학교)이 폼에 전달되지 않는다. 화곡제4동 수학 페이지에서 온 사용자가 학년·과목·시도를 다시 고르고 동을 직접 입력해야 한다.
- (−) "왜 교과설계소인가"(진단 → 학교 평가계획 반영 → 수업 설계)가 홈에는 있지만 동 페이지에는 연결 문장이 없다.

## P0

없음. (indexability·canonical·sitemap leak·schema 오류·Production 오류 모두 0)

## P1

| ID | 발견 | Impact | Effort | Risk |
|---|---|---|---|---|
| P1-1 | 운영 주체·소개·사업자 정보 부재, 개인정보처리방침 필수 기재 누락 가능성(보호책임자·시행일·처리 위탁) | High | M (운영 정보 확보 후 S) | Low — **사업 운영 정보 확인 필요** |
| P1-2 | 동×과목·학교×과목 페이지 상단에 "기준" 표시 없음(공시 학기·월은 출처 목록 하단에만, 확인일 없음, 학교와의 관계 명시 없음) | High (396~430 페이지) | S | Low |
| P1-3 | CTA가 페이지 맥락 없이 `/consult`로만 연결 → 폼 재입력 | High (전환) | S~M | Low (canonical은 `/consult` 유지) |
| P1-4 | 동×과목 페이지 공통 섹션 비중 30~52%(학년별 전략·시험 4주 계획·수업 진행) | Medium~High | M | Medium (330 페이지 일괄 변경, 유사도 재측정 필요) |
| P1-5 | 서비스 사실 질문(매칭 방식, 방문/화상 범위, 연락 시점) 답 없음 | Medium | S (답이 확보되면) | Low — **사업 운영 기준 확인 필요** |

## P2

| ID | 발견 | Impact | Effort | Risk |
|---|---|---|---|---|
| P2-1 | 색인 중인 얇은 페이지: district 4(~200자), province 3(~420자, 50% 공통), 학교 hub 47(~540자) | Medium | M | Medium (noindex 전환은 indexed→noindex 변경이라 신중) |
| P2-2 | 동×과목 notes가 문단형 → 학교별 비교 요약(표/bullet) 없음 | Medium | L (구조화 데이터 필요) | Medium (수치 재입력 오류 위험) |
| P2-3 | Organization JSON-LD 최소형(logo·contactPoint 없음), Service 엔터티 없음 | Low~Medium | S | Low (화면 사실과 일치하는 항목만) |
| P2-4 | 공통 FAQ 세트(수업료·교체·과목 범위)가 여러 템플릿 FAQPage에 반복 | Low | S | Low |
| P2-5 | 동 페이지 본문에 브랜드 정의 1문장·"왜 교과설계소" 연결 없음 | Low~Medium | S | Low |
| P2-6 | NEIS 출처 링크가 API endpoint(JSON 응답)로 연결 | Low | S | Low |

## P3

| ID | 발견 | Impact | Effort | Risk |
|---|---|---|---|---|
| P3-1 | 레거시 slug ↔ 교명 불일치(`gangnam-middle-school` = 대치중) | Low | — (URL 유지, 기록만) | URL 이전 시 High |
| P3-2 | `region-program` 5개 in-link 1 | Low | S | Low |
| P3-3 | 데스크톱 동 페이지 본문 중간 CTA 없음(모바일은 고정 바로 보완) | Low | S | Low |

## Top 5 opportunities

**Candidate A — 기준·관계 표시 블록 (P1-2)**
- 범위: 동 hub 66, 동×과목 330, 학교×과목 49 (H1·intro 바로 아래 1~2줄).
- 내용 예: "학교알리미 2026학년도 2학기 교과별 평가계획(2026년 9월 공시) 원문 기준 · 교과설계소는 각 학교와 별개이며 공시 자료를 정리했습니다 · 학교 사정에 따라 바뀔 수 있습니다." 확인일은 데이터에 없으므로 필드 추가 여부를 결정해야 한다(batch QA 문서에는 날짜가 있음).
- 변경 예상 파일: `src/components/region/DongPages.tsx`, `src/app/school/[schoolSlug]/[subject]/page.tsx`, (확인일을 넣으면) `src/data/dongSubjectContent.ts` 타입.
- 재사용: `planTerm`, `sources`의 공시 월 문자열, 기존 텍스트 스타일. 새 컴포넌트는 작은 표시용 1개면 충분.
- indexability 영향: 없음(route·robots 불변). Quality Gate는 intro·notes만 비교하므로 템플릿 문구 추가로 유사도가 바뀌지 않는다.
- 기대 효과: GEO(출처·시점 추출), Entity(학교 관계 명확), 신뢰. 규모 **S**.

**Candidate B — 운영 주체·신뢰 정보 (P1-1, P1-5)**
- 범위: footer(전 페이지), 소개 페이지 1개(신규 route → sitemap +1), 개인정보처리방침 보완, Organization JSON-LD를 화면 정보와 일치시키기.
- 변경 예상 파일: `src/config/site.ts`(값 입력), `src/components/layout/Footer.tsx`(이미 조건부 렌더 있음), `src/app/privacy/page.tsx`, 신규 `src/app/about/page.tsx`, `src/lib/schema.tsx`.
- 위험: 실제 사업 정보가 없으면 진행 불가(허위 작성 금지). 규모 **M**. **선행 조건: 운영자가 사업자명·대표 연락처·보호책임자·처리 위탁 정보를 제공.**

**Candidate C — 맥락 전달 상담 CTA (P1-3)**
- 범위: 모든 `ConsultCTA`(동·학교·과목 페이지) → `/consult?subject=math&region=…&dong=…` 형태로 기본값 전달, 폼이 값을 미리 채움.
- 변경 예상 파일: `src/components/ConsultCTA.tsx`, `src/components/ConsultForm.tsx`, `src/app/consult/page.tsx`.
- indexability: `/consult` canonical 유지 필요(쿼리 URL은 sitemap·canonical 대상 아님). Search/Consult smoke 재확인.
- 기대 효과: 전환 마찰 감소(측정은 GA 이벤트로 확인해야 함, 인과는 미검증). 규모 **S~M**.

**Candidate D — 동×과목 공통 섹션 압축 (P1-4)**
- 범위: 평가계획이 있는 동×과목 330 페이지에서 "학년별 전략"·"시험 4주 계획"을 짧은 요약 + `/subject/{slug}`·`/grade/{slug}` 링크로 바꾸고 "수업 진행"은 유지.
- 변경 예상 파일: `src/components/region/DongPages.tsx` 한 곳.
- 위험: 일괄 변경이므로 render·validate:full·유사도 재측정 필수. 콘텐츠 삭제가 아니라 위치 이동(링크 대상 페이지에 이미 있음). 규모 **M**.

**Candidate E — 학교별 비교 요약 (P2-2)**
- 범위: 동×과목에 "학교·학년·정기시험·수행평가·서·논술형" 짧은 표.
- 위험: 문단 속 수치를 구조화 필드로 다시 입력해야 하고 330 페이지 검수가 필요하다. 신규 batch부터 적용하는 것이 안전하다. 규모 **L**.

## Recommended first implementation

**Candidate A — 기준·관계 표시 블록**을 먼저 권한다.
- 이유: 이미 있는 데이터(`planTerm`, 학교별 공시 출처)만으로 만들 수 있다(운영 정보 대기 없음). 템플릿 2곳 수정으로 430여 페이지의 출처·시점·학교 관계가 상단에서 분명해진다. route·robots·Quality Gate에 영향이 없어 위험이 가장 낮다.
- 적용 범위: 동 hub, 동×과목, 학교×과목 템플릿.
- 위험: 상단 텍스트가 길어지지 않도록 1~2줄로 제한(과잉 최적화 방지). 확인일 필드는 넣을지 별도 결정.
- 병행 권장: Candidate B는 운영자 정보 수집을 지금 시작하고, Candidate C는 A 다음 구현.

## Continue expansion vs optimization

- **Q1. 19차 확장 vs 기존 개선** — 기존 608 페이지 최적화 1 사이클을 먼저 권한다. 근거: 기술 SEO가 이미 안정적이라 남은 격차는 템플릿 단위(기준 표시·CTA·공통 섹션·신뢰 정보)이고, 템플릿 1곳 수정이 396~430 페이지에 한 번에 적용된다. 19차는 동당 색인 6 페이지를 더할 뿐이며, 최적화 후 확장하면 새 페이지도 개선된 템플릿을 그대로 쓴다. 수집 도구·절차는 준비돼 있어 재개 비용이 낮다.
- **Q2. 전체 레버리지 Top 3** — ① 기준·관계 표시(A) ② 운영 주체·신뢰 정보(B, 운영 정보 확보 전제) ③ 맥락 전달 CTA(C).
- **Q3. Quick Answer 도입 가치** — 동×과목은 intro가 이미 Quick Answer 역할(수치 2문장)을 한다. 사이트 전체 공통 Quick Answer 컴포넌트는 권하지 않는다. 일반 과목·학년 페이지에 넣으면 같은 답이 반복된다. 대신 A(기준 표시)와 E(학교별 비교 요약, 신규 batch부터)로 보완한다.
- **Q4. FAQ 전체 적용 여부** — 전체 적용은 권하지 않는다. 기존 FAQ는 유지하고, 동 페이지에는 그 페이지 데이터로만 답할 수 있는 질문이 있을 때만 일부 템플릿에 넣는다. 공통 FAQ 반복(P2-4)은 줄이는 방향.
- **Q5. schema 충분성** — 정확성은 충분하다(FAQ 화면 일치, Breadcrumb 일치, 잘못된 관계 없음). 보완점은 Organization을 화면 정보(운영 주체·연락처)와 맞추는 것뿐이며 Service·Article·학교 EducationalOrganization 추가는 우선순위가 낮다. 학교에 Organization schema를 붙이면 소유·제휴 오해를 키울 수 있어 권하지 않는다.
- **Q6. 학교·지역 Entity relation** — 지역(시·구 → 행정동 → 법정동)과 학교 → 행정동 관계는 breadcrumb·출처·본문에서 명확하다. 부족한 것은 "학교와 별개" 명시 한 줄(A에 포함).
- **Q7. 신뢰 정보 최대 빈틈** — 운영 주체 정보(소개·사업자·보호책임자)가 없다는 점.
- **Q8. 전환 관점 첫 수정** — 상담 CTA의 맥락 전달(C). 모바일 고정 바는 이미 있으므로 CTA 개수를 늘리는 것보다 폼 재입력 마찰을 줄이는 것이 먼저다.

## Evidence / sampled URLs

측정 방법: Production HTML을 읽기 전용으로 받아 `<main>` 본문 기준으로 title·description 길이, H1/H2/H3 수, JSON-LD 타입, FAQPage 질문의 화면 노출 여부, 본문 글자 수, 본문 안 첫 `/consult` 링크 위치(0=맨 위, 1=맨 아래), 출처·날짜 신호, 같은 유형 샘플끼리 글자 그대로 같은 문장 비율을 셌다. BFS는 sitemap URL만 따라갔다.

| 유형 | URL | 본문(자) | JSON-LD | 공통 문장 | 첫 CTA |
|---|---|---|---|---|---|
| 홈 | `/` | 3,393 | Org·WebSite·FAQ(5/5) | — | 0.02 |
| 상담 | `/consult` | 495 | Org·WebSite·Breadcrumb | — | — |
| 신뢰 | `/privacy`, `/terms` | 423, 294 | Breadcrumb | 0% | — |
| 과목 | `/subject/math` | 2,504 | FAQ(3/3) | 0% | 0.09 |
| 과목 하위 | `/subject/korean/school-exam` | 518 | Breadcrumb | 0% | 0.99 |
| 학년 | `/grade/middle`, `/grade/middle/2` | 687, 874 | Breadcrumb | 0% | 0.17, 0.99 |
| 가이드 | `/guide/middle-first-exam`, `/guide/high-naeshin-suneung-balance` | 1,799, 1,928 | Breadcrumb | 0% | 0.99 |
| 프로그램 | `/program/coding`, `/region/seoul/gangnam/program/coding` | 1,252, 1,284 | FAQ(3/3) | 12%, 33% | 0.15, 0.23 |
| 시·도 | `/region/seoul`, `/region/gyeonggi` | 417, 417 | Breadcrumb | 50% | 1.0 |
| 시·구 | `/region/seoul/gangnam`, `/region/gyeonggi/goyang`, `/region/gyeonggi/uijeongbu` | 2,271 / 1,260 / 2,856 | FAQ | 33~40% | 1.0 |
| 구 단위 | `/region/gyeonggi/suwon/yeongtong` | 207 | Breadcrumb | — | 0.99 |
| 시·구×과목 | `/region/seoul/gangseo/math` | 3,790 | FAQ(5/5) | — | 1.0 |
| 시·구×학년×과목 | `/region/seoul/seocho/middle/english`, `/region/seoul/songpa/middle/math` | 805, 765 | Breadcrumb | 0% | 0.63, 0.71 |
| 동 hub | 청담동·방배4동·화곡제4동·개포1동·화정1동·상동·송산2동 | 3,092~4,780 | Breadcrumb | 3~6% | 1.0 |
| 동×과목 | 청담동 국어·방배4동 영어·화곡제4동 수학·개포1동 사회·화정1동 과학·상동 국어·송산2동 수학 | 1,964~3,756 | Breadcrumb | 5~52% (수학 46~52%) | 1.0 |
| 학교(색인) | `/school/gangnam-middle-school`, `/school/yeongtong-middle-school` | 538, 539 | FAQ(2/2) | 17~20% | 0.84 |
| 학교×과목 | `/school/gangnam-middle-school/english`, `/school/yeongtong-middle-school/math` | 1,041, 803 | Breadcrumb | 0% | 0.63~0.66 |
| 학교(noindex) | `/school/hangwang-high-school`, `/school/gaepo-middle-school`, `/school/hwajeong-high-school`, `/school/gyeonggi-high-school` | 404~423 | FAQ(2/2) | 50% | 0.77 |

- 모든 샘플: H1 1개, OG 4종, Org·WebSite JSON-LD(layout), 화면 breadcrumb와 BreadcrumbList 일치.
- 동×과목 공통 문장 예(화곡제4동 수학 ↔ 송산2동 수학): "중1 자유학기제 활용 …", "시험 4주 전 시험 범위 확인 …", "01 현재 수준 확인 …" ~ "05 오답 관리 …".
- 상담 폼 필드: grade, subject, province, cityDetail, studentName, phone, availableTime, message, agree. 모든 본문 CTA href = `/consult`(쿼리 없음).
- 코드 근거: `src/lib/schema.tsx`(Org 최소형), `src/config/site.ts`(businessName·businessRegistrationNumber·businessAddress·email 빈 값), `src/app/privacy/page.tsx`(보호책임자·시행일·위탁 없음), `src/app/api/consult/route.ts`(webhook → Sheets·이메일), `src/components/region/DongPages.tsx`(동 템플릿 섹션 구성).
